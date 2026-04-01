# Du An Dat Lich Kham Benh - Cau Truc Thu Muc Va Phan Quyen Thanh Vien

Tai lieu nay quy dinh:
- Cau truc day du thu muc/tep cho du an monolithic (`React + Laravel + MySQL`)
- Phan quyen ro rang de moi thanh vien lam **ca FE + BE** trong mot domain
- Thu tu cong viec cho tung thanh vien (khong can timeline/giai doan)

## 1) Cau Truc Goc

```text
hospital-booking/
|-- README.md
|-- .gitignore
|-- .editorconfig
|-- .gitattributes
|-- LICENSE
|
|-- docs/
|   |-- 00-project/
|   |   |-- project-overview.md
|   |   |-- stakeholders.md
|   |   |-- glossary.md
|   |-- 01-requirements/
|   |   |-- functional-requirements.md
|   |   |-- non-functional-requirements.md
|   |   |-- use-cases.md
|   |-- 02-analysis/
|   |   |-- business-rules.md
|   |   |-- workflow-diagrams.md
|   |-- 03-ui-ux/
|   |   |-- sitemap.md
|   |   |-- wireframes.md
|   |   |-- ui-guidelines.md
|   |-- 04-api/
|   |   |-- api-design.md
|   |   |-- error-standard.md
|   |   |-- cloudinary-upload-api.md
|   |   |-- postman-collection.json
|   |-- 05-database/
|   |   |-- schema.sql
|   |   |-- dbdiagram-sql.txt
|   |   |-- trigger-rules.md
|   |   |-- view-rules.md
|   |   |-- seed-strategy.md
|   |-- 06-testing/
|   |   |-- test-plan.md
|   |   |-- test-cases.md
|   |   |-- uat-checklist.md
|   |-- 07-deployment/
|       |-- local-setup.md
|       |-- cloudinary-env.md
|       |-- release-checklist.md
|
|-- backend/
|   |-- composer.json
|   |-- composer.lock
|   |-- artisan
|   |-- .env.example
|   |-- phpunit.xml
|   |-- config/
|   |   |-- app.php
|   |   |-- auth.php
|   |   |-- database.php
|   |   |-- services.php
|   |-- routes/
|   |   |-- api.php
|   |   |-- web.php
|   |   |-- api/
|   |       |-- v1/
|   |           |-- auth.php
|   |           |-- patients.php
|   |           |-- scheduling.php
|   |           |-- clinical.php
|   |           |-- admin.php
|   |           |-- reports.php

|   |-- app/
|   |   |-- Http/
|   |   |   |-- Controllers/
|   |   |   |   |-- Api/V1/Auth/
|   |   |   |   |   |-- AuthController.php
|   |   |   |   |   |-- ProfileController.php
|   |   |   |   |-- Api/V1/Patients/
|   |   |   |   |   |-- BenhNhanController.php
|   |   |   |   |   |-- LichSuLichHenController.php
|   |   |   |   |-- Api/V1/Scheduling/
|   |   |   |   |   |-- LichLamViecController.php
|   |   |   |   |   |-- KhungGioKhamController.php
|   |   |   |   |   |-- LichHenController.php
|   |   |   |   |-- Api/V1/Clinical/
|   |   |   |   |   |-- PhieuKhamController.php
|   |   |   |   |   |-- DonThuocController.php
|   |   |   |   |   |-- ChiDinhController.php
|   |   |   |   |-- Api/V1/Admin/
|   |   |   |   |   |-- NguoiDungController.php
|   |   |   |   |   |-- VaiTroQuyenController.php
|   |   |   |   |   |-- DanhMucController.php
|   |   |   |   |-- Api/V1/Reports/
|   |   |   |       |-- BaoCaoLichHenController.php
|   |   |   |       |-- BaoCaoDoanhThuController.php
|   |   |   |-- Middleware/
|   |   |   |   |-- EnsureRole.php
|   |   |   |   |-- CheckPermission.php
|   |   |-- Requests/
|   |   |   |-- Auth/
|   |   |   |-- Patients/
|   |   |   |-- Scheduling/
|   |   |   |-- Clinical/
|   |   |   |-- Admin/
|   |   |   |-- Reports/
|   |   |-- Resources/
|   |   |   |-- Auth/
|   |   |   |-- Patients/
|   |   |   |-- Scheduling/
|   |   |   |-- Clinical/
|   |   |   |-- Admin/
|   |   |   |-- Reports/
|   |   |-- Models/
|   |   |   |-- NguoiDung.php
|   |   |   |-- VaiTro.php
|   |   |   |-- Quyen.php
|   |   |   |-- BenhNhan.php
|   |   |   |-- BacSi.php
|   |   |   |-- NhanVien.php
|   |   |   |-- ChuyenKhoa.php
|   |   |   |-- PhongKham.php
|   |   |   |-- DichVu.php
|   |   |   |-- GoiKham.php
|   |   |   |-- LichLamViec.php
|   |   |   |-- LichLamViecBacSi.php
|   |   |   |-- KhungGioKham.php
|   |   |   |-- LichHen.php
|   |   |   |-- PhieuKham.php
|   |   |   |-- DonThuoc.php
|   |   |   |-- ChiDinh.php
|   |   |   |-- Icd10.php
|   |   |   |-- CauHinhHeThong.php
|   |   |-- Services/
|   |   |   |-- AuthService.php
|   |   |   |-- SchedulingService.php
|   |   |   |-- BookingValidationService.php
|   |   |   |-- ClinicalService.php
|   |   |   |-- CloudinaryUploadService.php
|   |   |   |-- ReportService.php
|   |   |-- Policies/
|   |   |   |-- LichHenPolicy.php
|   |   |   |-- PhieuKhamPolicy.php
|   |   |   |-- NguoiDungPolicy.php
|   |   |-- Providers/
|   |       |-- AuthServiceProvider.php
|   |-- database/
|   |   |-- migrations/
|   |   |   |-- 2026_01_01_000001_create_vai_tro_table.php
|   |   |   |-- 2026_01_01_000002_create_quyen_table.php
|   |   |   |-- 2026_01_01_000003_create_nguoi_dung_table.php
|   |   |   |-- ... (1 migration per table in schema)
|   |   |-- seeders/
|   |   |   |-- DatabaseSeeder.php
|   |   |   |-- VaiTroSeeder.php
|   |   |   |-- QuyenSeeder.php
|   |   |   |-- VaiTroQuyenSeeder.php
|   |   |   |-- CauHinhHeThongSeeder.php
|   |   |-- factories/
|   |       |-- NguoiDungFactory.php
|   |       |-- BenhNhanFactory.php
|   |-- sql/
|   |   |-- schema.sql
|   |   |-- triggers.sql
|   |   |-- views.sql
|   |   |-- events.sql
|   |   |-- seed.sql
|   |-- tests/
|       |-- Feature/
|       |   |-- Auth/
|       |   |-- Patients/
|       |   |-- Scheduling/
|       |   |-- Clinical/
|       |   |-- Admin/
|       |   |-- Reports/
|       |-- Unit/
|           |-- Services/
|           |-- Policies/
|
|-- frontend/
|   |-- package.json
|   |-- package-lock.json
|   |-- vite.config.js
|   |-- index.html
|   |-- .env.example
|   |-- src/
|   |   |-- main.jsx
|   |   |-- App.jsx
|   |   |-- app/
|   |   |   |-- router.jsx
|   |   |   |-- providers.jsx
|   |   |-- api/
|   |   |   |-- httpClient.js
|   |   |   |-- authApi.js
|   |   |   |-- patientApi.js
|   |   |   |-- schedulingApi.js
|   |   |   |-- clinicalApi.js
|   |   |   |-- uploadApi.js
|   |   |   |-- adminApi.js
|   |   |   |-- reportApi.js
|   |   |-- components/
|   |   |   |-- common/
|   |   |   |   |-- DataTable.jsx
|   |   |   |   |-- FormField.jsx
|   |   |   |   |-- FileUploader.jsx
|   |   |   |   |-- StatusBadge.jsx
|   |   |   |   |-- ConfirmDialog.jsx
|   |   |   |-- layout/
|   |   |       |-- PatientLayout.jsx
|   |   |       |-- StaffLayout.jsx
|   |   |       |-- DoctorLayout.jsx
|   |   |       |-- AdminLayout.jsx
|   |   |-- features/
|   |   |   |-- auth/
|   |   |   |   |-- pages/LoginPage.jsx
|   |   |   |   |-- pages/ProfilePage.jsx
|   |   |   |   |-- hooks/useAuth.js
|   |   |   |-- patients/
|   |   |   |   |-- pages/PatientProfilePage.jsx
|   |   |   |   |-- pages/LichSuKhamPage.jsx
|   |   |   |-- scheduling/
|   |   |   |   |-- pages/DatLichPage.jsx
|   |   |   |   |-- pages/LichHenCuaToiPage.jsx
|   |   |   |   |-- pages/QuanLyLichBacSiPage.jsx
|   |   |   |   |-- components/DoctorPicker.jsx
|   |   |   |   |-- components/TimeSlotPicker.jsx
|   |   |   |-- clinical/
|   |   |   |   |-- pages/CheckInPage.jsx
|   |   |   |   |-- pages/PhieuKhamPage.jsx
|   |   |   |   |-- pages/DonThuocPage.jsx
|   |   |   |   |-- components/TaiLieuUploader.jsx
|   |   |   |-- admin/
|   |   |   |   |-- pages/UserManagementPage.jsx
|   |   |   |   |-- pages/RolePermissionPage.jsx
|   |   |   |   |-- pages/DanhMucPage.jsx
|   |   |   |   |-- pages/SystemConfigPage.jsx
|   |   |   |-- reports/
|   |   |       |-- pages/BaoCaoLichHenPage.jsx
|   |   |       |-- pages/BaoCaoDoanhThuPage.jsx
|   |   |-- hooks/
|   |   |   |-- usePagination.js
|   |   |   |-- useDebounce.js
|   |   |-- utils/
|   |   |   |-- dateTime.js
|   |   |   |-- validators.js
|   |   |   |-- constants.js
|   |   |-- styles/
|   |       |-- tokens.css
|   |       |-- global.css
|   |-- tests/
|       |-- unit/
|       |-- integration/
|
|-- scripts/
|   |-- setup-dev.ps1
|   |-- import-schema.ps1
|   |-- run-backend-tests.ps1
|   |-- run-frontend-tests.ps1
|   |-- lint-all.ps1
|
|-- .github/
|   |-- pull_request_template.md
|   |-- workflows/
|       |-- backend-ci.yml
|       |-- frontend-ci.yml
|       |-- docs-check.yml
```

### 1.1 Giai Thich Chi Tiet Cac Thu Muc Chinh

Phan nay mo ta vai tro cua tung thu muc de tat ca thanh vien hieu dung pham vi sua file, tranh sua nham khu vuc.

- `docs/`: noi luu tai lieu dac ta, phan tich, API, database, test, deployment.
- Y nghia: la nguon su that cua yeu cau nghiep vu va quy uoc ky thuat truoc khi code.
- Nguyen tac: khi doi logic nghiep vu, cap nhat tai lieu lien quan truoc hoac cung PR code.

- `backend/`: toan bo ma nguon Laravel cho API va xu ly nghiep vu.
- `routes/`: khai bao endpoint, tach theo module `v1` (`auth`, `patients`, `scheduling`, `clinical`, `admin`, `reports`).
- `app/Http/Controllers/`: xu ly request/response theo tung domain.
- `app/Requests/`: validate dau vao cho moi API.
- `app/Resources/`: chuan hoa JSON tra ve.
- `app/Models/`: dinh nghia model Eloquent va quan he giua bang.
- `app/Services/`: chua business logic co the tai su dung, tranh de controller qua lon.
- `app/Policies/` + `Middleware/`: kiem soat quyen truy cap theo vai tro/quyen.
- `database/migrations`, `seeders`, `factories`: quan ly schema, du lieu mau, du lieu test.
- `sql/`: script tong hop cho schema/triggers/views/events/seed theo thiet ke chuan.
- `tests/`: test `Feature` theo module va `Unit` cho service/policy.

- `frontend/`: toan bo ma nguon React + Vite.
- `src/app/`: cau hinh app cap cao (router, providers).
- `src/api/`: lop goi API, dong bo voi route backend theo domain.
- `src/features/`: chia theo domain nghiep vu (auth/patients/scheduling/clinical/admin/reports).
- `src/components/`: component dung chung (`common`) va layout theo role.
- `src/hooks/`: custom hooks dung lai duoc.
- `src/utils/`: ham tien ich, constants, validator dung chung.
- `src/styles/`: token va global style dung xuyen suot he thong.
- `tests/`: unit/integration test cho FE.

- `scripts/`: cac script PowerShell de chuan hoa thao tac dev/test/lint/import schema.
- Y nghia: giam sai khac lenh giua cac may, tang tinh lap lai khi lam viec nhom.

- `.github/workflows/`: cau hinh CI cho backend/frontend/docs.
- Y nghia: dam bao code va tai lieu duoc kiem tra tu dong truoc khi merge.

- Tep goc (`README.md`, `.gitignore`, `.editorconfig`, ...):
- `README.md`: huong dan chay du an va quy trinh lam viec.
- `.editorconfig`: thong nhat style co ban giua cac IDE.
- `.gitignore`: loai bo file khong nen commit.

### 1.2 Nguyen Tac Dinh Vi File Nhanh (Cho Thanh Vien Moi)

1. Neu sua nghiep vu dat lich/check-in/kham benh: tim trong `backend/app/Services/` va `frontend/src/features/` cung domain.
2. Neu sua du lieu tra ve API: uu tien sua trong `backend/app/Resources/` truoc khi sua FE.
3. Neu sua validate input: sua o `backend/app/Requests/` va dong bo validate FE (`frontend/src/utils/validators.js` hoac form schema).
4. Neu sua route tong hop: chi nguoi so huu file dung chung (Thanh vien 6) cap nhat `backend/routes/api.php` va `frontend/src/app/router.jsx`.
5. Neu thay doi schema/triggers/views/events: cap nhat trong `backend/sql/` va tai lieu `docs/05-database/` de tranh lech tai lieu.

## 2) Quy Tac Phan Quyen Khong Xung Dot

1. Moi thanh vien so huu mot domain va lam ca FE + BE trong domain do.
2. Cac file dung chung chi co mot thanh vien phu trach.
3. Khong ai sua file ngoai pham vi so huu neu chua co yeu cau PR toi nguoi so huu.
4. Cac file tong hop route (`backend/routes/api.php`, `frontend/src/app/router.jsx`) chi duoc sua boi thanh vien so huu phan dung chung.
5. Cac file trigger/view/event cua database chi duoc sua boi thanh vien phu trach DB/dung chung.

## 3) Phan Cong Nhom (6 Thanh Vien, FE + BE Theo Tung Domain)

## Thanh Vien 1 - Domain: Xac Thuc + Ho So

Path BE so huu:
- `backend/routes/api/v1/auth.php`
- `backend/app/Http/Controllers/Api/V1/Auth/*`
- `backend/app/Requests/Auth/*`
- `backend/app/Resources/Auth/*`
- `backend/app/Services/AuthService.php`
- `backend/tests/Feature/Auth/*`

Path FE so huu:
- `frontend/src/features/auth/*`
- `frontend/src/api/authApi.js`
- `frontend/tests/integration/auth-*`

Thu tu cong viec:
1. Xay dung cac API xac thuc (`login`, `logout`, `profile`, `change password`).
2. Xay dung cac trang frontend cho auth/profile va state hooks.
3. Ket noi luong auth cua frontend voi API auth cua backend.
4. Bo sung logic dieu huong theo vai tro sau khi dang nhap.
5. Viet FE integration tests + BE feature tests cho auth.

## Thanh Vien 2 - Domain: Thong Tin Benh Nhan + Lich Su

Path BE so huu:
- `backend/routes/api/v1/patients.php`
- `backend/app/Http/Controllers/Api/V1/Patients/*`
- `backend/app/Requests/Patients/*`
- `backend/app/Resources/Patients/*`
- `backend/tests/Feature/Patients/*`

Path FE so huu:
- `frontend/src/features/patients/*`
- `frontend/src/api/patientApi.js`
- `frontend/tests/integration/patient-*`

Thu tu cong viec:
1. Xay dung API CRUD ho so benh nhan (bao gom xu ly benh nhan vang lai).
2. Xay dung API lich hen/lich su cua benh nhan (su dung cac view da thong nhat).
3. Xay dung cac trang profile/lich su cho benh nhan.
4. Ket noi trang voi API va kiem tra dinh dang du lieu.
5. Viet FE integration tests + BE feature tests cho module benh nhan.

## Thanh Vien 3 - Domain: Lich Lam Viec + Dat Lich Hen

Path BE so huu:
- `backend/routes/api/v1/scheduling.php`
- `backend/app/Http/Controllers/Api/V1/Scheduling/*`
- `backend/app/Requests/Scheduling/*`
- `backend/app/Resources/Scheduling/*`
- `backend/app/Services/SchedulingService.php`
- `backend/app/Services/BookingValidationService.php`
- `backend/tests/Feature/Scheduling/*`
- `backend/tests/Unit/Services/SchedulingServiceTest.php`

Path FE so huu:
- `frontend/src/features/scheduling/*`
- `frontend/src/api/schedulingApi.js`
- `frontend/tests/integration/scheduling-*`

Thu tu cong viec:
1. Xay dung API slot trong tu `lich_lam_viec_bac_si` + `khung_gio_kham`.
2. Xay dung API dat/huy/doi lich, kem kiem tra ngay nghi va ngay bac si nghi.
3. Xay dung trang dat lich va quan ly lich hen.
4. Ket noi UI dat lich voi API scheduling va ap dung rang buoc nghiep vu.
5. Viet FE integration tests + BE feature/unit tests cho scheduling.

## Thanh Vien 4 - Domain: Quy Trinh Lam Sang (Check-in + Kham Benh + Don Thuoc)

Path BE so huu:
- `backend/routes/api/v1/clinical.php`
- `backend/app/Http/Controllers/Api/V1/Clinical/*`
- `backend/app/Requests/Clinical/*`
- `backend/app/Resources/Clinical/*`
- `backend/app/Services/ClinicalService.php`
- `backend/app/Services/CloudinaryUploadService.php`
- `backend/config/services.php` (phan Cloudinary)
- `backend/tests/Feature/Clinical/*`

Path FE so huu:
- `frontend/src/features/clinical/*`
- `frontend/src/api/clinicalApi.js`
- `frontend/src/api/uploadApi.js`
- `frontend/src/components/common/FileUploader.jsx`
- `frontend/tests/integration/clinical-*`

Thu tu cong viec:
1. Xay dung API check-in va API ho so kham (`phieu_kham`, `chi_dinh`).
2. Xay dung API don thuoc (`don_thuoc`) va cac validation lien quan.
3. Tich hop Cloudinary cho upload tai lieu ho so (ky thuat upload, validate file, luu `file_url`).
4. Xay dung cac trang/than phan lam sang cho nhan vien/bac si, gom uploader tai lieu.
5. Ket noi cac trang FE lam sang voi API BE va xu ly chuyen trang thai.
6. Viet FE integration tests + BE feature tests cho quy trinh lam sang, gom ca luong upload Cloudinary.

## Thanh Vien 5 - Domain: Quan Tri (Nguoi Dung, Vai Tro, Cau Hinh Danh Muc)

Path BE so huu:
- `backend/routes/api/v1/admin.php`
- `backend/app/Http/Controllers/Api/V1/Admin/*`
- `backend/app/Requests/Admin/*`
- `backend/app/Resources/Admin/*`
- `backend/tests/Feature/Admin/*`

Path FE so huu:
- `frontend/src/features/admin/*`
- `frontend/src/api/adminApi.js`
- `frontend/tests/integration/admin-*`

Thu tu cong viec:
1. Xay dung API admin cho users/roles/permissions.
2. Xay dung API admin cho cau hinh danh muc (chuyen khoa, phong, dich vu, goi kham).
3. Xay dung cac trang quan tri.
4. Ket noi cac trang FE quan tri voi API BE kem kiem tra quyen.
5. Viet FE integration tests + BE feature tests cho domain quan tri.

## Thanh Vien 6 - Domain: Bao Cao + Nen Tang Dung Chung + Cong Giu Cong DB

Path BE so huu:
- `backend/routes/api/v1/reports.php`
- `backend/app/Http/Controllers/Api/V1/Reports/*`
- `backend/app/Requests/Reports/*`
- `backend/app/Resources/Reports/*`
- `backend/app/Services/ReportService.php`
- `backend/database/migrations/*`
- `backend/database/seeders/*`
- `backend/sql/*`
- `backend/app/Models/*`
- `backend/tests/Feature/Reports/*`

Path FE so huu:
- `frontend/src/features/reports/*`
- `frontend/src/api/reportApi.js`
- `frontend/src/api/httpClient.js`
- `frontend/src/hooks/*`
- `frontend/src/utils/*`
- `frontend/src/styles/*`
- `frontend/tests/integration/reports-*`

Path dung chung/repo so huu:
- `backend/routes/api.php`
- `frontend/src/app/router.jsx`
- `scripts/*`
- `.github/workflows/*`
- `docs/*`
- `README.md`, `.gitignore`, `.editorconfig`

Thu tu cong viec:
1. Xay dung API bao cao va cac trang UI bao cao.
2. Xay dung va duy tri DB migrations/seeders/triggers/views/events.
3. Duy tri toan bo Eloquent models va quan he cho ca du an.
4. Xay dung va duy tri ha tang FE dung chung (`httpClient`, hooks, utils, styles).
5. Duy tri file tong hop route va CI/scripts/docs.
6. Viet FE integration tests + BE feature tests cho bao cao va cac contract dung chung.

## 4) Ghi Chu Cuoi Ve Xung Dot

- Cau truc nay dam bao moi thanh vien deu lam FE + BE trong mot domain.
- Cac diem nong xung dot duoc tap trung vao quyen so huu cua Thanh vien 6.
- Cac thanh vien con lai lam viec o cac thu muc feature/domain va route rieng, nen xung dot merge se toi thieu va de quan ly.

## 5) Phan Cong Rieng Cho Cloudinary

- Thanh vien chiu trach nhiem chinh: **Thanh vien 4**.
- Pham vi: upload tai lieu kham benh, luu `file_url` vao ho so, xu ly validate/bao loi upload tren ca BE va FE.
- Nguyen tac bao mat: su dung bien moi truong (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), khong hard-code khoa trong source.

## 6) Danh Sach Thu Vien FE/BE Va Chinh Sach Dong Bo Phien Ban

Muc tieu:
- Thong nhat bo thu vien tu dau de tranh trung chuc nang, xung dot package.
- Khoa version de moi may dev/CI cho ket qua giong nhau.

### 6.1 Frontend (React + Vite)

Thu vien chinh:
- `react` (`^18.3.1`): nen tang component va state cua toan bo FE.
- `react-dom` (`^18.3.1`): render app React ra DOM.
- `react-router-dom` (`^6.30.1`): dinh tuyen trang theo role (`Patient`, `Doctor`, `Staff`, `Admin`).
- `axios` (`^1.8.2`): HTTP client dung chung cho `frontend/src/api/httpClient.js`.

Thu vien bo tro de dong bo form/validate:
- `react-hook-form` (`^7.54.2`): quan ly form cho cac trang CRUD + transaction.
- `zod` (`^3.24.2`): validate schema input FE truoc khi goi API.
- `@hookform/resolvers` (`^3.10.0`): ket noi `react-hook-form` voi `zod`.

Thu vien test FE:
- `vitest` (`^3.0.7`): unit test cho hooks/utils/components.
- `@testing-library/react` (`^16.2.0`): test hanh vi UI.
- `@testing-library/user-event` (`^14.6.1`): mo phong thao tac nguoi dung.
- `jsdom` (`^26.0.0`): moi truong DOM cho test.

Thu vien quality FE:
- `eslint` (`^9.20.1`): lint quy tac code style va bug co ban.
- `prettier` (`^3.5.2`): format code thong nhat.
- `eslint-config-prettier` (`^10.0.1`): tranh xung dot rule giua ESLint va Prettier.

### 6.2 Backend (Laravel)

Thu vien chinh:
- `php` (`^8.2`): runtime chuan cho backend.
- `laravel/framework` (`^11.0`): nen tang API, auth, validation, queue, policy.
- `laravel/sanctum` (`^4.0`): token auth cho API dang nhap/phan quyen.
- `cloudinary/cloudinary_php` (`^2.13`): upload tai lieu kham benh len Cloudinary, luu `file_url`.

Thu vien ho tro du lieu/thoi gian:
- `doctrine/dbal` (`^4.2`): ho tro migration cap nhat cot/phuc tap.
- `nesbot/carbon` (`^3.8`): xu ly ngay gio cho dat/huy/doi lich.

Thu vien test va quality BE:
- `phpunit/phpunit` (`^11.5`): unit/feature test backend.
- `laravel/pint` (`^1.21`): format PHP code theo chuan Laravel.
- `fakerphp/faker` (`^1.24`): tao du lieu gia cho test/seeder.
- `mockery/mockery` (`^1.6`): mock service trong unit test.

### 6.3 Nguyen Tac Chot Version De Tranh Lech Moi Truong

Quy tac bat buoc:
1. FE bat buoc commit `frontend/package-lock.json`; BE bat buoc commit `backend/composer.lock`.
2. Khong merge PR neu co thay doi package ma khong cap nhat lock file tuong ung.
3. Tang version theo quy tac:
	- Patch/Minor: duoc phep neu khong pha vo API noi bo.
	- Major: phai tao RFC ngan trong `docs/04-api/` hoac `docs/07-deployment/` truoc khi nang cap.
4. Moi thu vien moi phai ghi ro:
	- Ly do them.
	- Domain su dung (Auth/Scheduling/Clinical/Admin/Reports).
	- Nguoi so huu phe duyet (theo phan cong o Muc 3).
5. Uu tien tai su dung thu vien da co; khong them 2 thu vien cung chuc nang (vi du: khong dung dong thoi nhieu HTTP client).

Checklist khi them/sua thu vien:
- [ ] Cap nhat `package.json` hoac `composer.json`.
- [ ] Cap nhat lock file tuong ung.
- [ ] Cap nhat tai lieu muc nay neu co them/bo thu vien.
- [ ] Chay test toi thieu: `scripts/run-frontend-tests.ps1` va/hoac `scripts/run-backend-tests.ps1`.
