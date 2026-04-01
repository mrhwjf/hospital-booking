# Huong Dan Cloudinary (Flow Hien Tai)

Tai lieu nay cap nhat dung theo code hien tai cho nghiep vu luu tai lieu ho so tren Cloudinary.

## 1. Nguyen tac thiet ke

- Luu file len Cloudinary, khong luu URL tinh vao DB.
- DB chi luu file_public_id.
- file_public_id la NOT NULL.
- Su dung flow 2 pha: tao metadata truoc, upload file sau.
- Tai lieu duoc rang buoc theo benh nhan va phieu kham.

## 2. Cac file/chuc nang chinh

- Route patients API:
  - backend/routes/api/v1/patients.php
- Controller:
  - backend/app/Http/Controllers/Api/V1/Patients/TaiLieuHoSoController.php
- Service nghiep vu:
  - backend/app/Services/PatientService.php
- Service Cloudinary:
  - backend/app/Services/CloudinaryService.php
- Frontend page:
  - frontend/src/features/records/pages/HoSoTaiLieuPage.jsx
- Frontend modal form:
  - frontend/src/features/records/components/DocumentFormModal.jsx
- Frontend service:
  - frontend/src/Services/patients/hoSoTaiLieuService.js

## 2.1 Diem cau hinh de truyen benh nhan va phieu kham khi test

Day la cac diem can biet de sau nay gop flow that:

1. Benh nhan test (frontend):
  - File: frontend/src/features/records/pages/HoSoTaiLieuPage.jsx
  - Bien: const BENH_NHAN_ID = 3
  - Cach dung:
    - getLichSuPhieuKham(BENH_NHAN_ID, { per_page: 100 })
    - getHoSoTaiLieuByBenhNhan(BENH_NHAN_ID, ...)
    - createHoSoTaiLieu(BENH_NHAN_ID, ...)

2. Phieu kham tu URL:
  - File: frontend/src/features/records/pages/HoSoTaiLieuPage.jsx
  - Bien: const urlPhieuKhamId = Number(urlParams.get("id")) || null

3. Phieu kham dang chon de xem/tao tai lieu:
  - File: frontend/src/features/records/pages/HoSoTaiLieuPage.jsx
  - State:
    - activePhieuKhamId (dang ap dung)
    - pendingPhieuKhamId (dang chon tren dropdown)
  - Nut ap dung: handleApplyPhieuKham()

4. Cho truyen phieu kham vao API doc danh sach:
  - getHoSoTaiLieuByBenhNhan(BENH_NHAN_ID, { per_page: 100, phieu_kham_id: activePhieuKhamId })

5. Cho truyen phieu kham vao API tao metadata:
  - createHoSoTaiLieu(BENH_NHAN_ID, { phieu_kham_id: activePhieuKhamId, ... })

6. Cho dong bo URL khi doi phieu kham:
  - window.history.replaceState({}, "", `${window.location.pathname}?page=ho-so&id=${pendingPhieuKhamId}`)

Khi gop voi flow that:

- Bo hard-code BENH_NHAN_ID, thay bang benhNhanId tu trang chon benh nhan.
- Giu activePhieuKhamId la nguon su that duy nhat cho man hinh ho so tai lieu.
- Van nen dong bo URL de co deep-link den dung phiếu kham.

## 3. API hien tai

- GET /patients/{benhNhanId}/lich-su-phieu-kham
  - Lay phieu kham de do vao dropdown test.
- GET /patients/{benhNhanId}/tai-lieu-ho-so
  - Lay danh sach tai lieu, co ho tro filter phieu_kham_id.
- POST /patients/{benhNhanId}/tai-lieu-ho-so
  - Tao metadata tai lieu.
- POST /patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}/upload
  - Upload file len Cloudinary va cap nhat file_public_id that.
- GET /patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}/signed-url
  - Lay signed URL de preview.
- PUT /patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}
  - Sua metadata.
- DELETE /patients/{benhNhanId}/tai-lieu-ho-so/{taiLieuId}
  - Xoa tai lieu.

## 4. Flow frontend hien tai (trang Ho So Tai Lieu)

### Buoc 1: Chon phiieu kham de xem

- Trang doc id tu URL (?id=...)
- Neu URL khong co id hoac id khong hop le:
  - Tu dong lay phieu kham dau tien trong danh sach lich su cua benh nhan.
- Co dropdown + nut de chuyen phieu kham dang xem khi test.

### Buoc 2: Load danh sach tai lieu theo 1 phieu kham

Frontend goi:

- getHoSoTaiLieuByBenhNhan(BENH_NHAN_ID, { per_page: 100, phieu_kham_id: activePhieuKhamId })

=> 1 trang chi hien tai lieu cua 1 phieu kham dang chon.

### Buoc 3: Them tai lieu moi

Form them hien tai da bo 2 truong nhap tay:

- Ma tai lieu (backend tu sinh)
- Phieu kham lien ket (lay tu activePhieuKhamId dang chon)

Frontend gui payload tao metadata:

{
  "phieu_kham_id": activePhieuKhamId,
  "loai_tai_lieu": "ket_qua_ct_scan",
  "ten_tai_lieu": "Ket qua CT Scan",
  "ngay_tao": "2026-03-30",
  "ghi_chu": "..."
}

Luu y: ngay_tao hien tai dang required o backend.

### Buoc 4: Upload file

Sau khi tao metadata thanh cong, frontend upload file qua endpoint upload voi key form-data:

- tai_lieu

### Buoc 5: Preview

- Frontend goi signed-url
- Neu file da san sang, mo modal preview
- Neu dang o trang thai PENDING, backend tra loi

## 5. Flow backend 2 pha (chi tiet)

### Pha A: Tao metadata

PatientService::createTaiLieuHoSo:

1. Kiem tra phieu_kham_id ton tai.
2. Kiem tra phieu kham thuoc dung benh nhan.
3. Tu sinh ma_tai_lieu theo format:
   - TL + ddMMyyyyHHmmss + - + ma_phieu_kham
4. Tao file_public_id tam:
   - PENDING:{ma_tai_lieu}
5. Insert ban ghi vao tai_lieu_ho_so.

### Pha B: Upload cloud

PatientService::uploadTaiLieuHoSoFile:

1. Tim tai lieu dung benh nhan.
2. Goi CloudinaryService upload.
3. Lay public_id that tu ket qua upload.
4. Update file_public_id = public_id that.

## 6. Vi sao can PENDING

Do schema yeu cau file_public_id NOT NULL.

Neu chua upload ma da can tao metadata, he thong bat buoc gan gia tri tam de:

- Dam bao dung rang buoc DB
- Van giu duoc flow 2 pha
- Tranh null tren du lieu san xuat

## 7. Rule bao mat va ownership

Moi thao tac deu rang buoc theo benh nhan:

- load list
- create
- update
- upload
- signed-url
- delete

Neu phieu kham hoac tai lieu khong thuoc benh nhan dang goi API, backend se fail.

## 8. Rule update/delete

### Update metadata

- Co the sua: loai_tai_lieu, ten_tai_lieu, ngay_tao, ghi_chu
- Co the doi phieu_kham_id neu phieu kham moi van thuoc cung benh nhan

### Delete

- Neu file_public_id la public id that:
  - Xoa tren Cloudinary roi xoa DB
- Neu file_public_id dang PENDING:
  - Bo qua cloud delete, chi xoa DB

## 9. Validation hien tai khi tao tai lieu

CreateTaiLieuHoSoRequest:

- phieu_kham_id: required|integer|exists:phieu_kham,id
- loai_tai_lieu: required|in:...
- ten_tai_lieu: required|string|max:200
- ngay_tao: required|date
- ghi_chu: nullable|string

## 10. Checklist test nhanh

1. Chon 1 phieu kham trong dropdown trang ho so tai lieu.
2. Tao metadata tai lieu (co ngay_tao).
3. Kiem tra ban ghi vua tao co file_public_id dang PENDING:...
4. Upload file that.
5. Kiem tra file_public_id da doi thanh public id that.
6. Mo preview signed URL.
7. Chuyen sang phieu kham khac, dam bao danh sach khong bi tron.
8. Thu xoa tai lieu va reload danh sach.

## 11. Loi thuong gap

- No query results for model [App\Models\PhieuKham] {id}
  - activePhieuKhamId khong ton tai trong DB
  - Can chon lai phieu kham hop le tu dropdown
- 422 khi tao metadata
  - Thieu phieu_kham_id, loai_tai_lieu, ten_tai_lieu, hoac ngay_tao
- Signed URL fail
  - file_public_id van la PENDING, chua upload that
- Upload fail
  - Sai key form-data (phai la tai_lieu)
