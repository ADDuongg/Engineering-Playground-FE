# NestJS Interview — Câu 1–10

> Fundamentals + Lifecycle (phần đầu)

---

## 1. NestJS là gì?

**NestJS** là framework Node.js xây trên Express/Fastify, mang kiến trúc **modular + DI + decorator** kiểu Angular vào backend.

### NestJS giải quyết vấn đề gì?

- Express “tự do” → dễ thành spaghetti khi team lớn
- Thiếu convention: module boundary, DI, testability
- NestJS chuẩn hóa: Module / Provider / Controller / Guard / Pipe / Interceptor

### Vì sao chọn NestJS thay vì Express?

| Express | NestJS |
|---|---|
| Flexible, ít opinion | Opinionated, scale tốt |
| Tự tổ chức folder | Module-first |
| DI thủ công | IoC container sẵn |
| Test khó hơn | Mock provider dễ |

```ts
// Express: tự wire dependency
const userService = new UserService(new UserRepo(db));
app.get('/users', (req, res) => userService.findAll());

// NestJS: DI tự inject
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
```

---

## 2. Kiến trúc của NestJS dựa trên những nguyên lý nào?

1. **Dependency Injection (IoC)** — class không `new` dependency, container inject
2. **Module** — ranh giới feature, export/import rõ
3. **Decorator** — metadata cho routing, DI, guards…

```ts
@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## 3. Module là gì?

Đơn vị tổ chức app: gom controller, provider, import/export.

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // module khác mới dùng được
})
export class UsersModule {}
```

Không `exports` → module khác **không** inject được `UsersService`.

---

## 4. Provider là gì?

Bất kỳ class/value Nest có thể inject: Service, Repository, Factory, custom token…

```ts
providers: [
  UsersService,
  { provide: 'CONFIG', useValue: { ttl: 60 } },
  { provide: 'HASH', useFactory: () => new BcryptHasher() },
]
```

---

## 5. Controller là gì?

Lớp nhận HTTP, map route → gọi service. **Không** chứa business logic nặng.

```ts
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }
}
```

---

## 6. Injectable là gì?

`@Injectable()` đánh dấu class là provider, Nest có thể tạo instance + inject deps.

```ts
@Injectable()
export class OrdersService {
  constructor(private readonly repo: OrdersRepository) {}
}
```

Không có `@Injectable()` vẫn có thể work trong vài case, nhưng **nên luôn gắn** nếu class có dependency.

---

## 7. NestJS IoC Container hoạt động như thế nào?

1. Bootstrap đọc metadata (`@Module`, `@Injectable`, constructor params)
2. Build dependency graph
3. Instantiation theo scope (mặc định singleton)
4. Inject vào constructor khi resolve

```ts
// Nest thấy UsersController cần UsersService
// → tạo UsersService (và deps của nó) trước
// → inject vào UsersController
```

Circular dependency → cần `forwardRef()` hoặc redesign.

---

## 8. Dependency Injection hoạt động như thế nào?

Constructor injection (khuyến nghị):

```ts
constructor(
  private readonly users: UsersService,
  @Inject('REDIS') private readonly redis: Redis,
) {}
```

Token = class type hoặc string/symbol. Nest resolve token → instance.

---

## 9. Thứ tự lifecycle của một request trong NestJS?

```text
Incoming Request
  → Middleware
  → Guards
  → Interceptors (before / tap vào stream)
  → Pipes
  → Controller method
  → Service / Repository
  → Interceptors (after / map response)
  → Exception Filters (nếu lỗi)
  → Response
```

| Layer | Việc |
|---|---|
| **Middleware** | Logging raw, CORS, parse cookie — gần Express |
| **Guard** | AuthN/AuthZ: cho qua hay 401/403 |
| **Interceptor (before)** | Đo thời gian, wrap context |
| **Pipe** | Validate/transform DTO |
| **Controller** | Orchestrate |
| **Service** | Business |
| **Interceptor (after)** | Transform response `{ data }` |
| **Exception Filter** | Map error → HTTP response |

---

## 10. `OnModuleInit()`

Chạy **sau khi** module dependencies được resolve, **trước** app listen (thường dùng init connection, warm cache).

```ts
@Injectable()
export class CacheService implements OnModuleInit {
  async onModuleInit() {
    await this.redis.connect();
  }
}
```
