# NestJS Interview — Câu 51–60

> Performance + Practical design

---

## 51. Singleton có lợi gì?

- Tạo 1 lần → ít GC
- Giữ connection pool, in-memory cache
- Predictable performance

Tradeoff: **không** lưu state per-user trên singleton (race condition).

---

## 52. Làm sao cache dữ liệu trong NestJS?

```ts
// app.module
CacheModule.register({ ttl: 60_000, max: 100 })

@Injectable()
export class ProductsService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async find(id: string) {
    const key = `product:${id}`;
    const hit = await this.cache.get(key);
    if (hit) return hit;
    const data = await this.repo.findOne(id);
    await this.cache.set(key, data, 60_000);
    return data;
  }
}

// hoặc interceptor / @CacheKey + CacheInterceptor
```

Production: Redis store thay memory.

---

## 53. Khi nào dùng Redis?

- Shared cache giữa nhiều instance
- Session / refresh token store
- Rate limit
- Pub/Sub, leaderboard
- BullMQ backend
- Distributed lock

Đừng Redis hóa mọi thứ — DB + index tốt vẫn đủ nhiều case.

---

## 54. Xử lý background job trong NestJS như thế nào? (BullMQ / Queue)

```ts
// producer
await this.ordersQueue.add('send-invoice', { orderId }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
});

// processor
@Processor('orders')
export class OrdersProcessor {
  @Process('send-invoice')
  async handle(job: Job<{ orderId: string }>) {
    await this.mail.sendInvoice(job.data.orderId);
  }
}
```

Dùng khi: email, resize ảnh, report, webhook retry — **không** block request HTTP.

---

## 55. Làm sao xử lý upload file lớn?

- Multipart stream (`Fastify`/`multer` limits)
- Direct-to-S3 **presigned URL** (best): client upload thẳng storage
- Chunked upload + assemble
- Giới hạn size, virus scan async
- Không load cả file vào RAM

```ts
// API chỉ tạo presign
@Post('uploads/presign')
presign(@Body() dto: PresignDto) {
  return this.s3.getSignedUrl('putObject', { Bucket, Key, Expires: 300 });
}
```

---

## 56. Thiết kế Authentication Module

Bao gồm: Controller, Service, Guard, Strategy, DTO.

```
auth/
  auth.module.ts
  auth.controller.ts      // login, refresh, logout
  auth.service.ts         // issue/verify tokens, validate user
  strategies/
    jwt.strategy.ts
    local.strategy.ts
  guards/
    jwt-auth.guard.ts
    roles.guard.ts
  dto/
    login.dto.ts
    refresh.dto.ts
  decorators/
    current-user.decorator.ts
    roles.decorator.ts
```

```ts
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({...}),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

---

## 57. Thiết kế Notification Module (Email / SMS / Push)

**Strategy / Port-Adapter:**

```ts
interface NotificationSender {
  send(message: NotificationMessage): Promise<void>;
}

@Injectable()
class EmailSender implements NotificationSender { ... }
class SmsSender implements NotificationSender { ... }
class PushSender implements NotificationSender { ... }

@Injectable()
export class NotificationService {
  constructor(
    @Inject('SENDERS') private senders: NotificationSender[],
  ) {}

  async notify(msg: NotificationMessage) {
    const targets = this.senders.filter((s) => s.supports(msg.channel));
    await Promise.all(targets.map((s) => s.send(msg)));
  }
}
```

Queue (BullMQ) cho retry; template riêng; không hardcode Twilio/SES trong business service.

---

## 58. Thiết kế Logging Module

Làm sao để: log request, response, error, execution time.

```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    const started = Date.now();
    this.logger.log({ type: 'request', method: req.method, url: req.url });

    return next.handle().pipe(
      tap({
        next: (body) =>
          this.logger.log({
            type: 'response',
            ms: Date.now() - started,
            status: 200,
          }),
        error: (err) =>
          this.logger.error({
            type: 'error',
            ms: Date.now() - started,
            message: err.message,
          }),
      }),
    );
  }
}
```

+ Exception Filter log stack; correlation id từ middleware; structured JSON (pino).

---

## 59. Nếu API bị chậm, bạn sẽ debug theo thứ tự nào?

1. **Reproduce + đo** (APM / `LoggingInterceptor` latency)
2. **Network/gateway** (DNS, LB, TLS)
3. **Handler time** vs **DB time** (slow query log)
4. **N+1 / missing index**
5. **External HTTP** (timeout, waterfall)
6. **CPU** (JSON serialize lớn, sync crypto)
7. **Lock/contention** (Redis, row lock)
8. **Cold start / GC**
9. Cache / pagination / projection
10. Scale horizontal sau khi tối ưu code/query

Đừng scale trước khi biết bottleneck.

---

## 60. Nếu bắt đầu dự án NestJS mới, tổ chức folder / module / service / dependency thế nào?

```text
src/
  main.ts
  app.module.ts
  config/
  common/           # filters, interceptors, guards shared
  modules/
    users/
    orders/
    payments/
  infrastructure/   # db, redis, mail adapters (optional)
```

Nguyên tắc:

- **Feature module** theo domain
- Controller mỏng, Service use-case
- Depend on **interfaces**/tokens ở boundary (DIP)
- `forRootAsync` cho infra
- Không circular; event-driven khi cần
- DTO ≠ Entity
- Test: unit service (mock repo), e2e module

SOLID gọn:

- **S**: một service một trách nhiệm use-case
- **O**: thêm channel notification bằng sender mới
- **D**: inject `UsersRepository` token, không hardcode TypeORM everywhere
