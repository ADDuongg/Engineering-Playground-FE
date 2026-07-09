# NestJS Interview — Câu 31–40

> So sánh Middleware/Guard/Interceptor/Pipe + Validation

---

## 31. Middleware khác Guard như thế nào?

| | Middleware | Guard |
|---|---|---|
| Timing | Trước nhất | Sau middleware |
| Context | `req,res,next` | `ExecutionContext` (biết handler, class) |
| Role | Infra (log, cors) | AuthZ quyết định |
| Reflector/metadata | Khó | Dễ (`@Roles()`) |

Auth JWT: có thể middleware, nhưng **Guard + Passport** là idiom Nest.

---

## 32. Guard khác Interceptor như thế nào?

| | Guard | Interceptor |
|---|---|---|
| Mục đích | Cho phép / từ chối | Wrap before/after |
| Return | boolean | Observable stream |
| Fail | 401/403 | Thường không “deny” |

Guard = security gate. Interceptor = cross-cutting transform/observe.

---

## 33. Pipe khác DTO Validation như thế nào?

- **DTO** = class shape + decorator rules (`@IsEmail`)
- **Pipe** (`ValidationPipe`) = engine chạy rules đó

DTO không tự validate; cần `ValidationPipe` (global hoặc local).

```ts
export class CreateUserDto {
  @IsEmail()
  email: string;
}
// + app.useGlobalPipes(new ValidationPipe())
```

---

## 34. Viết flow xử lý Authentication trong NestJS

```text
Client → Authorization: Bearer <jwt>
  → Middleware (optional: request-id)
  → JwtAuthGuard
      → Passport JWT Strategy
          → extract token
          → verify secret/exp
          → validate() → attach user vào request
  → RolesGuard / PermissionGuard (Authorization)
  → Pipes → Controller → Service
```

```ts
// strategy
async validate(payload: { sub: string; role: string }) {
  return { userId: payload.sub, role: payload.role };
}

// controller
@UseGuards(JwtAuthGuard)
@Get('me')
me(@CurrentUser() user: AuthUser) {
  return user;
}
```

---

## 35. DTO là gì?

Data Transfer Object — contract input/output API, tách khỏi Entity DB.

```ts
export class CreateOrderDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
```

Không expose entity trực tiếp ra API (password hash, internal fields…).

---

## 36. `ValidationPipe` hoạt động như thế nào?

1. Nhận plain object từ request
2. (nếu `transform`) convert → instance class DTO
3. `class-validator` validate metadata
4. Fail → `400 Bad Request`

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

---

## 37. `whitelist`

Strip property **không có decorator** trên DTO.

```ts
// body: { email, password, isAdmin: true }
// DTO chỉ có email, password → isAdmin bị bỏ
```

Bảo vệ mass assignment.

---

## 38. `forbidNonWhitelisted`

Thay vì strip lặng lẽ → **throw 400** nếu có field lạ.

An toàn hơn whitelist-only khi muốn client biết payload sai.

---

## 39. `transform`

Ép plain → class instance; convert type query/param.

```ts
// ?page=1 → number nếu @Type(() => Number) hoặc enableImplicitConversion
@IsInt()
@Type(() => Number)
page: number;
```

Không `transform` → `dto` là plain object, `instanceof CreateUserDto` = false.

---

## 40. `class-validator` khác `class-transformer` như thế nào?

| | class-validator | class-transformer |
|---|---|---|
| Việc | Rule: `@IsEmail`, `@Min` | Map/transform: `@Expose`, `@Type`, `plainToInstance` |
| Dùng với | ValidationPipe | transform + serialization |

Cả hai thường đi cặp trong Nest.
