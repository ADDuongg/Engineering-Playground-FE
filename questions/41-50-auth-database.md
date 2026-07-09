# NestJS Interview — Câu 41–50

> Authentication + Database

---

## 41. Authentication và Authorization khác nhau như thế nào?

- **Authentication**: Bạn là ai? (login, JWT)
- **Authorization**: Bạn được làm gì? (role, permission)

Login thành công ≠ được xóa user admin.

---

## 42. Passport hoạt động như thế nào trong NestJS?

`@nestjs/passport` wrap Passport strategies thành Nest providers.

```ts
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    const user = await this.auth.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return user; // gắn vào req.user
  }
}
```

`AuthGuard('local')` → gọi strategy tương ứng.

---

## 43. JWT Strategy hoạt động như thế nào?

```ts
PassportStrategy(Strategy, 'jwt')
constructor() {
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  });
}
async validate(payload: JwtPayload) {
  return { userId: payload.sub, roles: payload.roles };
}
```

Flow: extract → verify signature/exp → `validate` → `req.user`.

Access token: short-lived (5–15 phút).

---

## 44. Refresh Token nên xử lý như thế nào?

Best practices:

1. Access JWT ngắn hạn
2. Refresh token dài hơn, **opaque hoặc JWT riêng**, lưu hash ở DB
3. Rotate refresh mỗi lần dùng (reuse detection)
4. HttpOnly Secure cookie hoặc storage có kiểm soát
5. Revoke khi logout / đổi password

```ts
// pseudo
async refresh(refreshToken: string) {
  const stored = await this.tokens.findValid(hash(refreshToken));
  if (!stored) throw new UnauthorizedException();
  await this.tokens.revoke(stored.id); // rotate
  return this.issueTokens(stored.userId);
}
```

---

## 45. RBAC là gì?

**Role-Based Access Control**: quyền theo role (`admin`, `editor`, `viewer`).

```ts
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
```

Đơn giản; hệ lớn hơn thường thêm **permission** (`order:write`) hoặc ABAC.

---

## 46. Permission Guard hoạt động như thế nào?

```ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>('permissions', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required?.length) return true;
    const { user } = ctx.switchToHttp().getRequest();
    return required.every((p) => user.permissions?.includes(p));
  }
}

@Permissions('order:cancel')
@UseGuards(JwtAuthGuard, PermissionsGuard)
```

---

## 47. Repository Pattern là gì?

Tách data access khỏi business. Service nói “lấy user theo email”, không viết SQL/ORM rải rác.

```ts
interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
```

TypeORM `Repository<User>` là một implementation.

---

## 48. Service có nên gọi Repository trực tiếp không?

**Có** — trong Nest/TypeORM đây là chuẩn:

`Controller → Service → Repository`

Không nên: Controller → Repository (bỏ business layer).

Có thể thêm Domain Service / Use Case khi phức tạp, nhưng đừng over-abstract sớm.

---

## 49. Transaction nên đặt ở đâu?

| Layer | Nên? |
|---|---|
| Controller | ❌ Không — HTTP layer |
| **Service** | ✅ Use-case / orchestration |
| Repository | Chỉ khi helper thuần data, tránh business tx ở đây |

```ts
await this.dataSource.transaction(async (manager) => {
  await manager.save(Order, order);
  await manager.save(Payment, payment);
});
```

---

## 50. Nếu một request gọi 3 Service khác nhau và cần rollback, bạn sẽ xử lý transaction như thế nào?

Đừng để mỗi service tự `commit`. **Một transaction boundary ở use-case/orchestrator**:

```ts
@Injectable()
export class CheckoutService {
  constructor(private dataSource: DataSource) {}

  async checkout(dto: CheckoutDto) {
    return this.dataSource.transaction(async (manager) => {
      const order = await this.orders.createWithManager(manager, dto);
      await this.inventory.reserveWithManager(manager, dto.items);
      await this.payments.chargeWithManager(manager, order.id);
      return order;
    });
  }
}
```

Pattern: truyền `EntityManager` / Unit of Work xuống. Hoặc `@Transactional()` (als) nếu team chuẩn hóa.

Saga/outbox nếu cross-service distributed (microservice) — không dùng DB transaction xuyên service.
