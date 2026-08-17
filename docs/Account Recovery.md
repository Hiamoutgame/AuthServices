# Nhóm Khôi phục & Quản lý Tài khoản (Account Recovery & Security)

## 1. Quên mật khẩu (Forgot / Reset Password)
- **Đầu vào**: Email của User.
- **Flow**:
  1. Check Email tồn tại.
  2. Tạo Reset Token ngẫu nhiên (UUID hoặc JWT có payload `sub: userId, type: reset`).
  3. Lưu Hash của Token + Expire time (15 phút) vào Redis/DB.
  4. Gửi email chứa link dạng: `https://app.com/reset-password?token=XYZ`.
  5. User click link -> Gửi Token + Pass mới.
  6. Server verify Token -> Update Password mới -> Hủy Token.

## 2. Đổi mật khẩu (Change Password)
- Cho User đã đăng nhập.
- **Yêu cầu bắt buộc**: Nhập Mật khẩu cũ (Old Password) để xác thực chủ sở hữu -> Mật khẩu mới (New Password).

## Bài toán & Cạm bẫy thực tế
1. **Rò rỉ thông tin qua API Forgot Password (User Enumeration)**:
   - Nếu nhập email không tồn tại, API trả về "Email không tồn tại trong hệ thống". Kẻ xấu lợi dụng quét xem email nào đã đăng ký.
   - *Cách giải quyết*: Luôn trả về thông báo chung: "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn khôi phục mật khẩu".
2. **Replay Attack với Reset Token**: Token chưa hết hạn bị dùng lại nhiều lần.
   - *Cách giải quyết*: Token sau khi dùng thành công 1 lần phải bị XÓA HOẶC VÔ HIỆU HÓA NGAY LẬP TỨC (One-time use).
3. **Invalidate All Sessions**: Đổi mật khẩu thành công nhưng các thiết bị cũ vẫn chưa đăng xuất.
   - *Cách giải quyết*: Xóa toàn bộ Refresh Token / Session của User đó trong Redis/DB ngay khi đổi mật khẩu thành công.
