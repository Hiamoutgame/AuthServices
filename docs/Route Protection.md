# Nhóm Bảo vệ Tuyến đường (Route Protection trong NestJS)

## 1. Guard & Strategy (Passport + NestJS)
- **Passport Strategy**: Nơi triển khai logic giải mã và kiểm tra tính hợp lệ của JWT / Session / Local credentials.
  - Ví dụ: `JwtStrategy extends PassportStrategy(Strategy)`.
- **NestJS AuthGuard**: Tầng chặn Request ở Controller/Routelevel, gọi Strategy tương ứng.
  - Ví dụ: `@UseGuards(AuthGuard('jwt'))`.

## 2. RolesGuard & Custom Decorator
- **Custom Decorator**:
  - `@SetMetadata()` hoặc `Reflector`: Gán nhãn yêu cầu cho Route. `@Roles('ADMIN', 'USER')`.
  - `@CurrentUser()`: Trích xuất User Object đã gán vào `request.user` bởi AuthGuard để xài trong Controller Parameter.
- **RolesGuard**: 
  - Đọc Metadata từ Route (thông qua `Reflector`).
  - So sánh `user.roles` (từ `request.user`) với roles yêu cầu. Trả về `true` (cho qua) hoặc `false` (`403 Forbidden`).

## 3. Global Guard & Public Decorators
- Áp dụng `AuthGuard` toàn cục (Global Guard trong `APP_GUARD`).
- Đánh dấu các Route không cần login (ví dụ: Register, Login) bằng Custom Decorator `@Public()`.
- Guard kiểm tra nếu Route có Metadata `@Public()` -> Cho qua ngay, không cần verify Token.

## Cấu trúc Code Mẫu trong NestJS

```
src/auth/
├── decorators/
│   ├── current-user.decorator.ts
│   ├── public.decorator.ts
│   └── roles.decorator.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
```

## Bài toán & Cạm bẫy thực tế
1. **Quên gán `@Public()`**: Dẫn đến việc Global AuthGuard chặn các route công khai như `/auth/login`, `/auth/register`.
2. **Context Execution**: NestJS dùng được cho HTTP, GraphQL, Microservices, WebSockets. `ExecutionContext` của Guard phải chuyển đổi đúng loại (`switchToHttp()`, `GqlExecutionContext.create(context)`).
3. **Thứ tự thực thi Guards**: 
   - AuthGuard phải chạy TRƯỚC RolesGuard (để giải mã token thành `request.user` trước khi RolesGuard lấy `user` ra check role).
