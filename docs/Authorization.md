# Nhóm Phân quyền (Authorization)

## 1. Role-Based Access Control (RBAC - Phân quyền theo vai trò)
- **Khái niệm**: Gán Vai trò (Role) cho User. Gán Quyền hạn (Permission) cho Role.
- Ví dụ:
  - Role `ADMIN`: Có tất cả quyền (`CREATE_USER`, `DELETE_USER`, `VIEW_POST`).
  - Role `USER`: Có quyền (`CREATE_POST`, `VIEW_POST`).
- **Mô hình Bảng DB**:
  - `Users` (1) --- (*) `User_Roles` (*) --- (1) `Roles`
  - `Roles` (1) --- (*) `Role_Permissions` (*) --- (1) `Permissions`

## 2. Attribute-Based Access Control (ABAC - Phân quyền theo thuộc tính)
- **Khái niệm**: Quyền dựa trên thuộc tính động của môi trường/người dùng/tài nguyên.
- Ví dụ:
  - "User chỉ có quyền SỬA bài viết NẾU bài viết đó do chính User tạo ra (`authorId === currentUserId`)".
  - "Chỉ truy cập hệ thống vào giờ hành chính (8h-17h)".

## Bài toán & Cạm bẫy thực tế
1. **N+1 Query khi Load Roles/Permissions**: Mỗi request đều query DB lấy Roles & Permissions của User.
   - *Cách giải quyết*: 
     - Cách 1: Đưa thẳng array roles/permissions vào JWT payload (Cân nhắc độ dài JWT).
     - Cách 2: Cache User Roles/Permissions trong Redis (TTL 5-15 phút). Hủy Cache khi Admin đổi quyền của User.
2. **Phình to Role (Role Explosion)**: Tạo quá nhiều Role lẻ tẻ (VD: `MANAGER_DEPT_A`, `MANAGER_DEPT_B`).
   - *Cách giải quyết*: Kết hợp RBAC cơ bản với ABAC/Policy-based (Sử dụng thư viện như `CASL` trong NestJS).
