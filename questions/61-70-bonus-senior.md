# NestJS Interview — Câu 61–70 (Bonus Senior)

> Reflect Metadata, Decorator, ExecutionContext, Multi-tenancy, Architecture

---

## 61. Reflect Metadata là gì? NestJS sử dụng nó ở đâu?

`reflect-metadata` lưu metadata trên class/method/param lúc runtime.

Nest dùng cho:

- DI tokens (constructor param types)
- `@Module` metadata
- `@Get`, `@Body` routing
- Guards/Pipes qua `Reflector`
- `@SetMetadata('roles', ['admin'])`

```ts
SetMetadata('roles', ['admin']);
this.reflector.get('roles', context.getHandler());
```

Cần `emitDecoratorMetadata` trong `tsconfig`.

---

## 62. Decorator hoạt động như thế nào trong TypeScript?

Syntactic sugar gọi hàm với target:

```ts
function Injectable(): ClassDecorator {
  return (target) => {
    // gắn metadata → Nest biết đây là provider
  };
}

@Injectable()
class UsersService {}
// ≈ Injectable()(UsersService)
```

Method/param decorators tương tự — Nest đọc metadata lúc bootstrap.

---

## 63. `ExecutionContext` là gì?

Wrapper context của request hiện tại — biết HTTP/RPC/WS, class, handler.

```ts
const ctx = context.switchToHttp();
const req = ctx.getRequest();
const handler = context.getHandler();
const classRef = context.getClass();
```

Dùng trong Guard / Interceptor / Filter / custom decorator.

---

## 64. Custom Decorator hoạt động như thế nào? (`@CurrentUser()`)

```ts
export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUser;
    return data ? user?.[data] : user;
  },
);

// usage
me(@CurrentUser() user: AuthUser) {}
me(@CurrentUser('userId') userId: string) {}
```

---

## 65. Custom Param Decorator khác Custom Decorator như thế nào?

| | Param (`createParamDecorator`) | Custom (SetMetadata / Class/Method) |
|---|---|---|
| Mục đích | Extract giá trị vào argument | Gắn metadata / behavior |
| Ví dụ | `@CurrentUser()`, `@Ip()` | `@Roles()`, `@Public()` |
| Chạy khi | Resolve param trước handler | Guard/Interceptor đọc metadata |

```ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

---

## 66. Interceptor có thể thay đổi Response như thế nào?

```ts
return next.handle().pipe(
  map((data) => ({
    data,
    meta: { traceId: req.id },
  })),
);
```

Hoặc đổi status gián tiếp qua gắn header trên `res` trong `tap`.

---

## 67. Interceptor có thể thay đổi Request không?

**Có**, mutate `request` object trước `next.handle()`:

```ts
intercept(context: ExecutionContext, next: CallHandler) {
  const req = context.switchToHttp().getRequest();
  req.timezone = req.headers['x-timezone'] ?? 'UTC';
  return next.handle();
}
```

Nhưng validate body → Pipe; auth → Guard. Interceptor không thay thế chúng.

---

## 68. Làm sao implement Multi-tenancy trong NestJS?

Các model phổ biến:

1. **Shared DB + `tenant_id` column** (phổ biến)
2. Schema-per-tenant
3. DB-per-tenant

Implementation:

- Resolve tenant từ subdomain / header `X-Tenant-Id` / JWT claim
- Middleware/Guard set tenant vào CLS
- Repository tự filter `tenantId`
- Connection pool strategy nếu DB-per-tenant

```ts
// middleware
const tenantId = req.headers['x-tenant-id'];
cls.set('tenantId', tenantId);

// service
const tenantId = this.cls.get('tenantId');
return this.repo.find({ where: { tenantId } });
```

Quan trọng: **không leak data** cross-tenant (test bắt buộc).

---

## 69. Nếu hệ thống có 500 API, bạn sẽ tổ chức Module như thế nào?

Không 500 module theo endpoint. Theo **bounded context**:

```text
iam/          (auth, users, roles)
catalog/      (products, categories)
ordering/     (cart, orders)
billing/      (payments, invoices)
fulfillment/
reporting/
```

Trong mỗi domain: submodules nếu lớn (`OrdersModule`, `OrderItemsModule`).

API versioning: `/v1`, hoặc module `V1OrdersController`.  
Shared kernel mỏng: `common/`, `database/`.

---

## 70. Theo bạn, những nguyên lý quan trọng nhất khi xây dựng một dự án NestJS lớn là gì?

1. **Boundary rõ** — feature module, không god `AppService`
2. **DI + interfaces ở biên** — dễ test, đổi infra
3. **Lifecycle đúng chỗ** — Guard/Pipe/Interceptor/Filter không lẫn trách nhiệm
4. **Singleton-first** — request-scope chỉ khi thật sự cần
5. **Transaction ở use-case**
6. **Async boundaries** — queue cho side-effect chậm
7. **Observability** — structured log, metrics, trace id
8. **Config async + 12-factor**
9. **Tránh circular** — event / tách module
10. **Consistency over cleverness** — convention team > pattern lạ
