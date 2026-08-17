# Nhóm Xác thực (Authentication & Login)

## 1. Đăng nhập truyền thống (Local Login)
- **Đầu vào**: Username/Email + Password.
- **Xử lý**: 
  - Truy vấn User theo Username/Email.
  - So sánh mật khẩu (Compare hash).
  - Trả về Token hoặc Session Cookie.

## 2. Đăng nhập bên thứ ba (OAuth2 / Social Login)
- **Nhà cung cấp (Provider)**: Google, GitHub, Facebook.
- **Flow**: 
  1. Redirect sang Provider.
  2. Provider trả về Auth Code (tại Callback URL).
  3. Backend dùng Auth Code lấy Access Token của Provider -> Gọi API lấy thông tin User.
  4. Mapping vào DB (Tạo mới nếu chưa có, dùng `provider_id`). Trả về hệ thống Token riêng của mình.

## 3. Passwordless / OTP Login
- **Flow**: Nhập Email/SĐT -> Backend tạo mã OTP/Magic Link (lưu Redis) -> Gửi cho User -> User nhập/click -> Trả Token.

## 4. Xác thực đa yếu tố (MFA / 2FA)
- Dùng `authenticator` (Google Auth, Authy). Cơ chế TOTP (Time-based One-Time Password).
- Dùng thư viện `otplib` hoặc `speakeasy` sinh mã QR/Secret.

## Bài toán & Cạm bẫy thực tế
1. **Brute-force / Credential Stuffing**: Thử mật khẩu liên tục.
   - *Cách giải quyết*: Rate Limit theo IP hoặc theo Username (ví dụ: Khóa tài khoản 15 phút sau 5 lần sai).
2. **Account Takeover qua Social Login**: User đăng ký Local bằng Email A. Người khác dùng GitHub cũng có Email A đăng nhập vào.
   - *Cách giải quyết*: Require verify email GitHub. Link các Identity (`local`, `github`) vào cùng 1 bảng User, thay vì tạo User mới.
3. **MFA Backup**: Nếu user mất điện thoại (mất app Authenticator), làm sao đăng nhập?
   - *Cách giải quyết*: Sinh 10 Backup Codes tĩnh (lưu hash) khi bật 2FA. Mỗi mã dùng 1 lần.
4. **Time Sync (TOTP)**: Server bị lệch giờ sẽ check mã MFA sai. Đảm bảo cấu hình NTP trên server đồng bộ giờ quốc tế.
