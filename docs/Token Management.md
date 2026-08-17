# Nhóm Quản lý Token (Token Management)

## 1. Cấp phát Token (Token Issuance)
- **Access Token (AT)**: 
  - JWT, chứa UserID, Role. 
  - Không lưu DB. Thời gian sống ngắn (15m - 1h). 
  - Client gắn vào header `Authorization: Bearer <AT>`.
- **Refresh Token (RT)**: 
  - Chuỗi ngẫu nhiên (Opaque Token) hoặc JWT.
  - Lưu vào DB hoặc Redis (kèm metadata: device, IP). Thời gian sống dài (7d - 30d).
  - Cấp quyền sinh Access Token mới.

## 2. Làm mới Token (Refresh Token Rotation)
- Khi AT hết hạn, Client gọi API `/refresh` truyền lên RT.
- **Rotation**: Cấp cả AT mới và RT mới. RT cũ bị hủy. Giảm thiểu rủi ro khi RT bị lộ (chỉ dùng được 1 lần).

## 3. Đăng xuất (Logout) & Revocation (Blacklist)
- Xóa RT ở Client. Hủy RT trong DB/Redis.
- Vấn đề: AT vẫn còn hạn.
- Giải pháp (Blacklist): Lưu ID (jti) của AT vào Redis với TTL bằng đúng thời gian sống còn lại của AT. Middleware check Redis trước, nếu có trong Blacklist -> Từ chối.

## Bài toán & Cạm bẫy thực tế
1. **Nơi lưu trữ ở Client (XSS vs CSRF)**:
   - Lưu LocalStorage: Dễ dính XSS (Script đánh cắp).
   - Lưu Cookie `HttpOnly, Secure`: Chống XSS, nhưng dễ dính CSRF. 
   - *Thực hành tốt*: Lưu AT vào memory (biến JS) hoặc Cookie bảo mật. RT luôn lưu Cookie `HttpOnly`. Dùng CSRF Token.
2. **Reuse Detection (Phát hiện dùng lại RT)**:
   - Nếu RT cũ đã bị hủy (do Rotation) nhưng lại được gửi lên `/refresh`. Nghĩa là token đã bị lộ (Kẻ trộm hoặc User thực sự đang dùng token cũ).
   - *Cách giải quyết*: Xóa TẤT CẢ RT của dòng đời (family) đó. Bắt User đăng nhập lại toàn bộ.
3. **Kích thước JWT**: Đừng nhồi nhét quá nhiều data (Profile bự) vào Payload JWT, làm phình to Request HTTP.
4. **Mất kết nối Redis**: Nếu Redis sập, cơ chế Blacklist tê liệt. 
   - *Cách giải quyết*: Fallback - Cho qua (Fail-open - ưu tiên trải nghiệm) hoặc Chặn hết (Fail-close - ưu tiên bảo mật), tùy business.
