# NestJS Interview — Câu 11–20

> Lifecycle (tiếp) + Module

---

## 11. `OnApplicationBootstrap()`

Chạy **sau tất cả** `onModuleInit` của mọi module — khi toàn app đã sẵn sàng.

```ts
async onApplicationBootstrap() {
  await this.scheduler.start(); // cần mọi module sẵn
}
```

**Khác `OnModuleInit`:** module-level vs application-level.

---

## 12. `OnModuleDestroy()`

Khi module bị destroy (shutdown). Cleanup resource của module đó.

```ts
async onModuleDestroy() {
  await this.redis.quit();
}
```

---

## 13. `BeforeApplicationShutdown()`

Trước khi app shutdown — nhận `signal` (`SIGTERM`…). Dùng dừng nhận traffic mới, drain queue.

```ts
async beforeApplicationShutdown(signal?: string) {
  this.logger.warn(`Shutting down: ${signal}`);
  await this.httpServer.close(); // stop accept
}
```

---

## 14. `OnApplicationShutdown()`

Sau `beforeApplicationShutdown` — đóng DB, flush log.

```ts
async onApplicationShutdown() {
  await this.dataSource.destroy();
}
```

**Thứ tự shutdown:** `onModuleDestroy` → `beforeApplicationShutdown` → `onApplicationShutdown`.

---

## 15. `app.enableShutdownHooks()`

Bật lắng nghe OS signals (`SIGTERM`, `SIGINT`) để gọi lifecycle shutdown. **Bắt buộc** trên K8s/Docker nếu muốn graceful shutdown.

```ts
const app = await NestFactory.create(AppModule);
app.enableShutdownHooks();
await app.listen(3000);
```

Không gọi → Nest có thể không chạy cleanup khi process bị kill.

---

## 16. Feature Module là gì?

Module theo domain/feature: `UsersModule`, `OrdersModule`, `PaymentsModule`.

```
users/
  users.module.ts
  users.controller.ts
  users.service.ts
  dto/
```

---

## 17. Shared Module là gì?

Module chứa provider dùng chung, **export** ra ngoài.

```ts
@Global() // optional
@Module({
  providers: [MailerService, HasherService],
  exports: [MailerService, HasherService],
})
export class SharedModule {}
```

Module khác `imports: [SharedModule]` rồi inject.

---

## 18. Global Module là gì?

`@Global()` — import **một lần** ở `AppModule`, mọi nơi inject được mà không import lại.

```ts
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

Dùng sparingly: Config, Logger. Lạm dụng → dependency ẩn, khó trace.

---

## 19. Dynamic Module là gì?

Module cấu hình lúc runtime (`forRoot`, `register`).

```ts
@Module({})
export class DatabaseModule {
  static forRoot(options: DbOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        { provide: 'DB_OPTIONS', useValue: options },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}

// AppModule
imports: [DatabaseModule.forRoot({ host: 'localhost' })]
```

---

## 20. `forRoot()` khác `forRootAsync()` như thế nào?

| | `forRoot` | `forRootAsync` |
|---|---|---|
| Config | Sync, hardcode/env sẵn | Async, inject ConfigService |
| Khi nào | Options tĩnh | Cần đọc env/secret async |

```ts
// Sync
TypeOrmModule.forRoot({ type: 'postgres', host: 'localhost' })

// Async
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_HOST'),
  }),
})
```

Senior tip: hầu hết production dùng **`forRootAsync`**.
