## Flow sau khi chỉnh sửa:
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

## Flow: 
Frontend (PhieuKhamPage.jsx) → gọi hàm từ clinicalService → clinicalService gọi API qua clinicalApi → clinicalApi gọi httpClient → httpClient gửi request đến backend → Backend nhận request vào route → route map vào Controller → Controller nhận request, validate bằng UpdatePhieuKhamRequest → Controller gọi Service để xử lý nghiệp vụ → Service tương tác với Model (PhieuKham) để cập nhật DB → Service trả kết quả cho Controller → Controller trả response dạng Resource (PhieuKhamResource) → httpClient nhận response, interceptor unwrap data → clinicalApi nhận data đã unwrap, trả về cho Service → PhieuKhamPage.jsx nhận data mới, cập nhật state và UI.