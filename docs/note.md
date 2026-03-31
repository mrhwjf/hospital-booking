---
description: File này hướng dẫn cách viết layout cho tài khoản Bác sĩ trong dự án.
applyTo: Thành viên thiết kế layout cho tài khoản Bác sĩ.
name: Hướng dẫn thiết kế layout cho tài khoản Bác sĩ
---

# Hướng dẫn thiết kế layout cho tài khoản Bác sĩ
1. **Header**
- Logo (hoặc tên) của ứng dụng ở góc trái. D:\hospital-booking\frontend\public\logo.png
- Icon avatar của bác sĩ ở góc phải, khi click vào sẽ hiện dropdown menu với các tùy chọn như "Thông tin cá nhân", "Thông tin tài khoản", "Đăng xuất".
2. **Sidebar (Menu bên trái)**
- Sử dụng `react-router-dom` để điều hướng giữa các trang khi click vào các mục menu.
- Dùng component `Sider` của Ant Design.
- Các mục menu chính:
  - Khám bệnh: Icon `MedicineBoxOutlined` (Bấm vô sẽ dẫn đến trang danh sách phiếu khám của Thái đã làm). import DsPhieuKham from "./features/clinical/pages/DsPhieuKham"
  - Thông tin cá nhân: Icon `UserOutlined` import ThongTinBS from "./features/clinical/pages/ThongTinBS"
  - Thông tin tài khoản: Icon `SettingOutlined` (chưa gắn)
  - Đăng xuất: Icon `LogoutOutlined`(chưa gắn)
- Mỗi mục menu sẽ dẫn đến một trang tương ứng khi được click.
