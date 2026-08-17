# Nhóm Quản lý Phiên (Session Management)

## 1. Stateful Session (Phiên có trạng thái)
- Server tạo `Session ID`, lưu toàn bộ thông tin User/Session vào Memory/Redis/DB.
- Trả về `Session ID` cho Client qua Cookie `connect.sid`.
- Client gửi Cookie ở mọi Request. Server tra cứu Redis để biết ai đang gọi API.
- **Ưu điểm**: Thu hồi phiên (Logout, Force kill session) lập tức.
- **Nhược điểm**: Server chịu tải, khó scale ngang nếu không có Redis dùng chung.

## 2. Stateless Session (JWT - Phiên không trạng thái)
- Server ký một JWT chứa payload (`userId`, `role`). 
- Không lưu trạng thái phiên ở Server. Server chỉ cần Verify Signature của JWT bằng Secret key/Public key.
- **Ưu điểm**: Dễ scale ngang, nhanh, không phải Query Redis/DB mỗi Request.
- **Nhược điểm**: Khó thu hồi ngay lập tức trước khi JWT hết hạn (Cần dùng Blacklist).

## 3. Hybrid Strategy (Chiến lược kết hợp - Khuyên dùng)
- **Access Token**: Stateless (JWT), sống ngắn (15 phút).
- **Refresh Token / Session Record**: Stateful, sống dài (30 ngày), lưu Redis/DB (lưu User Agent, IP, Device Name).
- Hiển thị danh sách thiết bị đang đăng nhập (Active Sessions) & tính năng "Đăng xuất khỏi tất cả thiết bị".

## Bài toán & Cạm bẫy thực tế
1. **Sticky Session vs Shared Session**: Nếu xài Stateful Session trên Multi-instance (nhiều server NestJS), client gửi request 1 lên Server A, request 2 lên Server B -> Server B không thấy Session.
   - *Cách giải quyết*: Dùng Redis làm Centralized Session Store (Express-Session + connect-redis).
2. **Session Fixation Attack**: Hacker cố tình bắt nạn nhân dùng 1 Session ID do hacker chọn trước.
   - *Cách giải quyết*: Sinh lại Session ID mới (Regenerate Session) ngay sau khi đăng nhập thành công.
