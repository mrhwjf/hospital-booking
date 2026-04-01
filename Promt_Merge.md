## Quy trình khám bệnh của bác sĩ:
1. Bác sĩ bấm vô nút "Quản lí bệnh nhân" ở menu chính.
2. UI hiển thị danh sách bệnh nhân đã và đang đặt lịch khám với bác sĩ.
3. Bác sĩ chọn bệnh nhân đang khám.
4. UI hiển thị danh sách phiếu khám (tức là lịch sử khám bệnh) của bệnh nhân đó. Phiếu khám mới vừa được tạo sẽ nằm ở đầu danh sách hoặc được nếu nổi bật.
5. Bác sĩ chọn phiếu khám mới để xem chi tiết.
6. UI hiển thị hồ sơ bệnh nhân, phiếu khám, chỉ định, đơn thuốc, tài liệu hồ sơ (kết quả xét nghiệm, hình ảnh chẩn đoán,...) của bệnh nhân.
7. Bác sĩ chỉnh sửa trên phiếu khám, chỉ định, đơn thuốc,... nếu cần thiết. Mỗi mục có 1 nút lưu riêng.
8. Sau khi hoàn tất khám, bác sĩ bấm nút "Hoàn tất khám" để kết thúc quy trình khám bệnh.
9. UI hiển thị thông báo "Khám bệnh hoàn tất" và tự động chuyển về trang danh sách bệnh nhân đã và đang đặt lịch khám với bác sĩ.

## Sidebar của bác sĩ sẽ có gì:
- Trang ThongTinBS.jsx để hiển thị thông tin cá nhân của bác sĩ.
- Trang QuanLiBenhNhan.jsx để hiển thị danh sách bệnh nhân đã và đang đặt lịch khám với bác sĩ hiện tại.

## Luồng đúng của bác sĩ khi khám bệnh:
1. Bác sĩ vào trang QuanLiBenhNhan.jsx để xem danh sách bệnh nhân đã và đang đặt lịch khám với bác sĩ.
2. Bác sĩ chọn bệnh nhân cần khám.
3. Sau khi chọn bệnh nhân ở trang QuanLiBenhNhan.jsx, bác sĩ sẽ được chuyển đến trang LichSuKhamPage.jsx để xem lịch sử khám bệnh của bệnh nhân đó.
4. Bác sĩ chọn phiếu khám mới nhất để khám bệnh hoặc chọn phiếu khám cũ để xem lại lịch sử khám bệnh của bệnh nhân.
5. Sau khi chọn phiếu khám, ở phần content của bác sĩ sẽ có 4 mục để chọn:
+ Phiếu khám (là phiếu khám vừa được chọn): tương đương với PhieuKhamPage.jsx, hiển thị thông tin phiếu khám và cho phép chỉnh sửa nếu cần thiết.
+ Chỉ định: tương đương với ChiDinhPage.jsx, hiển thị danh sách chỉ định của phiếu khám vừa được chọn và cho phép chỉnh sửa nếu cần thiết.
+ Đơn thuốc: tương đương với DonThuocPage.jsx, hiển thị danh sách đơn thuốc của phiếu khám vừa được chọn và cho phép chỉnh sửa nếu cần thiết.
+ Hồ sơ tài liệu: tương đương với HoSoTaiLieuPage.jsx, hiển thị danh sách tài liệu hồ sơ của phiếu khám vừa được chọn và cho phép chỉnh sửa nếu cần thiết.
6. Sau khi hoàn tất khám bệnh, bác sĩ bấm nút "Hoàn tất khám" để kết thúc quy trình khám bệnh. Phiếu khám sẽ được cập nhật trạng thái thành "đã hoàn thành" và không còn cho phép chỉnh sửa thông tin, chỉ định, đơn thuốc,... nữa.
7. UI hiển thị thông báo "Khám bệnh hoàn tất" và tự động chuyển về trang danh sách bệnh nhân đã và đang đặt lịch khám với bác sĩ.

## Yêu cầu:
Đảm bảo sau khi chọn bệnh nhân thì chuyển sang trang phiếu khám chỉ hiện phiếu khám của bệnh nhân đó. Sau khi chọn phiếu khám thì chuyển sang các mục phiếu khám, chỉ định, đơn thuốc, hồ sơ tài liệu cũng chỉ hiện dữ liệu của phiếu khám đó. Khi chuyển sang phiếu khám khác thì các mục cũng phải tự động cập nhật theo phiếu khám mới.

Đảm bảo cách gọi API của mỗi trang con (QuanLyBenhNhanPage.jsx, PhieuKhamPage.jsx, ChiDinhPage.jsx, DonThuocPage.jsx, HoSoTaiLieuPage.jsx) phải tương tự với cấu trúc sau:

Đây là cấu trúc chuẩn để gọi API từ frontend đến backend, giúp đảm bảo tính nhất quán và dễ bảo trì:
Backend:
  Model      → PhieuKham.php       (đại diện bảng DB)
  Request    → UpdatePhieuKhamRequest.php  (validate input)
  Service    → ClinicalService.php  (logic nghiệp vụ)
  Resource   → PhieuKhamResource.php  (format response)
  Controller → PhieuKhamController.php  (nhận request → gọi Service → trả Resource)

Frontend:
  api/httpClient.js          → cấu hình axios (baseURL, timeout, interceptors)
  api/clinicalApi.js         → cấu hình endpoint URLs
  Services/clinicalService.js → hàm giao tiếp với backend
  Pages/PhieuKhamPage.jsx    → gọi hàm từ Service

Các trang còn lại (QuanLyBenhNhanPage.jsx, ChiDinhPage.jsx, DonThuocPage.jsx, HoSoTaiLieuPage.jsx) cũng sẽ tuân theo cấu trúc tương tự, chỉ khác ở phần Service và API cụ thể cho từng chức năng. Điều này giúp đảm bảo rằng mọi trang con đều có cách gọi API nhất quán, dễ hiểu và dễ bảo trì.

## Database:
Làm theo chuẩn cấu trúc database đã thiết kế, đảm bảo rằng các bảng liên quan đến phiếu khám, chỉ định, đơn thuốc, hồ sơ tài liệu,... đều có mối quan hệ rõ ràng và được tối ưu hóa cho các truy vấn cần thiết trong quy trình khám bệnh của bác sĩ.

## Lưu ý:
Hiện tại chưa liên kết với chức năng đăng nhập nên hãy cho chọn bác sĩ ở trang thông tin cá nhân của bác sĩ (ThongTinBS.jsx) để test; Sau khi chọn bác sĩ thì ở phần quản lý bệnh nhân phải hiển thị đúng danh sách bệnh nhân đã và đang đặt lịch khám với bác sĩ đó. Sau này khi có chức năng đăng nhập thì sẽ tự động lấy bác sĩ đang đăng nhập để hiển thị thông tin và danh sách bệnh nhân tương ứng.

## Việc cần làm:
Nối các chức năng đã làm riêng lẻ thành một flow hoàn chỉnh, đảm bảo rằng khi bác sĩ chọn bệnh nhân thì sẽ chuyển sang trang phiếu khám chỉ hiện phiếu khám của bệnh nhân đó, sau đó chọn phiếu khám thì sẽ chuyển sang các mục phiếu khám, chỉ định, đơn thuốc, hồ sơ tài liệu cũng chỉ hiện dữ liệu của phiếu khám đó. Khi chuyển sang phiếu khám khác thì các mục cũng phải tự động cập nhật theo phiếu khám mới. Cuối cùng là hoàn tất khám bệnh thì sẽ chuyển trạng thái của phiếu khám thành "đã hoàn thành" và chuyển về trang danh sách bệnh nhân đã và đang đặt lịch khám với bác sĩ.