# Nhóm Quản lý Danh tính (Identity & Registration)

## 1. Đăng ký (Register / Sign-up)
- **Đầu vào**: Username, Email, Password, Profile data.
- **Xử lý**:
  - Kiểm tra định dạng (ValidationPipe).
  - Kiểm tra trùng lặp (Email/Username).
  - Băm mật khẩu (Hashing): Dùng `bcrypt` hoặc `argon2`. Tuyệt đối không lưu plain text.
  - Lưu vào CSDL. Trạng thái khởi tạo: `Unverified`.

## 2. Xác thực tài khoản (Account Verification)
- **Cơ chế**: Sinh mã OTP (Random 6 số) hoặc Token (JWT/UUID).
- **Lưu trữ**: Lưu mã kèm thời gian hết hạn (TTL) vào Redis hoặc DB.
- **Gửi**: Gửi qua Email (Nodemailer/SendGrid) hoặc SMS (Twilio).
- **Kích hoạt**: User nhập mã. Hệ thống check khớp & chưa hết hạn -> Đổi trạng thái User thành `Active`.

## Bài toán & Cạm bẫy thực tế
1. **Race Condition (Tranh chấp đồng thời)**: 2 request đăng ký cùng 1 email xuất hiện cùng lúc, vượt qua khâu check trùng lặp, gây lỗi DB (nếu thiếu Unique Constraint).
   - *Cách giải quyết*: Đặt `UNIQUE index` cho cột email/username trong Database. Bắt lỗi (Catch Exception) ở tầng Repository.
2. **Spam đăng ký**: Kẻ xấu dùng bot đăng ký hàng loạt.
   - *Cách giải quyết*: Áp dụng Rate Limit (Giới hạn request theo IP). Thêm CAPTCHA (reCAPTCHA/Turnstile).
3. **Database Transaction**: Tạo User và tạo Profile cần nằm trong cùng 1 Transaction. Lỗi 1 cái, rollback tất cả, tránh rác dữ liệu.
4. **Leak OTP**: Không bao giờ trả OTP/Token kích hoạt về trong Response API đăng ký.
