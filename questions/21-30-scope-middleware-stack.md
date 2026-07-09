# NestJS Interview — Câu 21–30

> Module (tiếp) + Provider Scope + Middleware / Guard / Pipe / Interceptor / Filter

---

## 21. `forwardRef()` dùng để giải quyết vấn đề gì?

**Circular dependency** giữa 2 class/module.

```ts
// users.service.ts
constructor(
  @Inject(forwardRef(() => OrdersService))
  private orders: OrdersService,
) {}

// orders.service.ts
constructor(
  @Inject(forwardRef(() => UsersService))
  private users: UsersService,
) {}
```

Module level:

```ts
imports: [forwardRef(() => OrdersModule)]
```

Tốt hơn: tách shared service / event / redesign để bỏ vòng.

---

## 22. Singleton Scope

Một instance cho cả app lifetime. **Default** trong NestJS.

```ts
@Injectable() // scope = DEFAULT = singleton
export class UsersService {}
```

Nhanh, tiết kiệm memory — **default đúng cho hầu hết service**.

---

## 23. Request Scope

Mỗi HTTP request một instance mới.

```ts
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  userId?: string;
}
```

Dùng: request-scoped context, multi-tenant per request. **Chậm hơn** vì tạo tree mới mỗi request; provider phụ thuộc request-scoped cũng bị “bubble up” thành request-scoped.

---

## 24. Transient Scope

Mỗi lần inject → instance mới.

```ts
@Injectable({ scope: Scope.TRANSIENT })
export class ReportBuilder {}
```

A và B cùng inject `ReportBuilder` → 2 instance khác nhau.

---

## 25. Khi nào KHÔNG nên dùng Request Scope?

- Hot path / high QPS
- Chỉ để “lấy user từ request” → dùng `@Req()` / custom decorator / CLS (`nestjs-cls`) thay vì request-scoped service
- Cache/singleton logic bị kéo theo request scope → memory + GC tăng

Rule: **ưu tiên singleton + AsyncLocalStorage/CLS**.

---

## 26. Middleware dùng khi nào?

Gần Express: logging IP, body parse custom, correlation id sớm.

```ts
export class CorrelationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.headers['x-request-id'] ??= randomUUID();
    next();
  }
}
```

Chưa có `ExecutionContext` đầy đủ như Guard.

---

## 27. Guard dùng khi nào?

**Authorization / Authentication gate** — return `true/false` hoặc throw.

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin')
adminOnly() {}
```

---

## 28. Pipe dùng khi nào?

Validate + transform input (body/query/param).

```ts
@Post()
create(@Body(ValidationPipe) dto: CreateUserDto) {}

// hoặc ParseIntPipe
@Get(':id')
find(@Param('id', ParseIntPipe) id: number) {}
```

---

## 29. Interceptor dùng khi nào?

AOP quanh handler: timing, transform response, cache, logging.

```ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => ({ data, success: true })));
  }
}
```

---

## 30. Exception Filter dùng khi nào?

Bắt exception → chuẩn hóa HTTP error response.

```ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```
