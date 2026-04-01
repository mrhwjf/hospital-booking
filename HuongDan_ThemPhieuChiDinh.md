# Huong Dan Them Phieu Chi Dinh (Flow Hien Tai)

Tai lieu nay mo ta dung flow dang chay tren code hien tai cho man hinh Phieu Chi Dinh.

## 1. Muc tieu nghiep vu

- Bac si chon benh nhan de test bang bien BENH_NHAN_ID trong frontend.
- Neu benh nhan co nhieu phieu kham, bac si phai chon 1 phieu kham cu the bang dropdown + nut ap dung.
- Moi phieu kham chi duoc tao 1 phieu chi dinh.
- Neu phieu kham da co chi dinh, form tao se an, chi hien danh sach chi dinh da luu.

## 2. Vi tri file chinh

- Frontend page: frontend/src/features/clinical/pages/PhieuChiDinhPage.jsx
- Frontend service: frontend/src/Services/clinicals/phieuChiDinhService.js
- Frontend service lich su phieu kham: frontend/src/Services/patients/lichSuKhamService.js
- Backend route: backend/routes/api/v1/clinical.php
- Backend service nghiep vu: backend/app/Services/ClinicalService.php
- Backend request validate: backend/app/Requests/Clinical/StoreChiDinhRequest.php

## 2.1 Diem cau hinh de truyen benh nhan va phieu kham khi test

Day la cac cho quan trong de sau nay gop flow that thi biet cho sua:

1. Benh nhan test (frontend):
  - File: frontend/src/features/clinical/pages/PhieuChiDinhPage.jsx
  - Bien: const BENH_NHAN_ID = 2
  - Cach dung: getLichSuPhieuKham(BENH_NHAN_ID, { per_page: 100 })

2. Phieu kham tu URL:
  - File: frontend/src/features/clinical/pages/PhieuChiDinhPage.jsx
  - Bien: const urlPhieuKhamId = Number(params.get("id")) || null
  - Y nghia: nhan phieu kham tu query string (?id=...)

3. Phieu kham dang chon de doc/ghi du lieu:
  - File: frontend/src/features/clinical/pages/PhieuChiDinhPage.jsx
  - State:
    - activePhieuKhamId (phieu dang ap dung)
    - pendingPhieuKhamId (phieu vua chon tren dropdown)
  - Nut ap dung: handleApplyPhieuKham()

4. Cho truyen phieu kham vao API (doc):
  - getChiDinhList(activePhieuKhamId)

5. Cho truyen phieu kham vao API (ghi):
  - createChiDinh(activePhieuKhamId, { items })

6. Cho dong bo URL khi doi phieu kham:
  - window.history.replaceState({}, "", `${window.location.pathname}?page=chi-dinh&id=${pendingPhieuKhamId}`)

Khi gop voi flow that:

- Bo hard-code BENH_NHAN_ID, thay bang benhNhanId tu context dang nhap/route.
- Bo lay id truc tiep tu URL neu da co state trung tam, hoac giu URL sync de deep-link.
- Giu activePhieuKhamId la nguon su that duy nhat de goi API.

## 3. API dang su dung

- GET /dich-vu
  - Lay danh sach dich vu de chon.
- GET /patients/{benhNhanId}/lich-su-phieu-kham
  - Lay danh sach phieu kham hoan thanh cua benh nhan de do vao dropdown.
- GET /phieu-kham/{phieuKhamId}/chi-dinh
  - Kiem tra phieu kham da co chi dinh chua.
- POST /phieu-kham/{phieuKhamId}/chi-dinh
  - Tao chi dinh moi cho phieu kham.

## 4. Flow frontend hien tai

### Buoc 1: Chon benh nhan test

Trong file PhieuChiDinhPage.jsx co bien:

- const BENH_NHAN_ID = 2 (hoac doi thanh id can test)

Page se lay lich su phieu kham theo id nay.

### Buoc 2: Chon phieu kham

- Dropdown hien tat ca phieu kham cua benh nhan.
- Bac si bam nut Xem phieu kham nay de ap dung.
- He thong cap nhat URL ve dang:
  - ?page=chi-dinh&id={phieuKhamId}

### Buoc 3: Tai du lieu chi dinh cua phieu kham dang chon

- Goi GET /phieu-kham/{id}/chi-dinh.
- Neu co du lieu:
  - Hien khoi Phieu chi dinh da luu.
  - An ServiceTable va an form tao ben phai.
- Neu chua co du lieu:
  - Hien ServiceTable + SelectedServices de tao moi.

### Buoc 4: Luu chi dinh

- Bac si chon nhieu dich vu (moi dich vu co so luong).
- Bam Luu chi dinh.
- Payload gui len:

{
  "items": [
    { "dich_vu_id": 5, "so_luong": 1 },
    { "dich_vu_id": 8, "so_luong": 2 }
  ]
}

- Sau khi luu thanh cong:
  - setExistingChiDinh(createdItems)
  - Form tao bien mat ngay.
  - Man hinh chuyen sang che do hien phieu da luu.

## 5. Rule backend quan trong

Trong ClinicalService::createChiDinh:

- Kiem tra phieu kham ton tai.
- Kiem tra da ton tai chi_dinh theo phieu_kham_id chua:
  - Neu da ton tai -> tra ValidationException:
    - "Phieu kham nay da co phieu chi dinh. Khong the tao them."
- Neu chua ton tai -> tao cac dong chi dinh trong transaction.

=> Rule thuc te hien tai: moi phieu kham chi tao 1 lan.

## 6. Validation hien tai

StoreChiDinhRequest:

- items: required|array|min:1
- items.*.dich_vu_id: required|integer|exists:dich_vu,id
- items.*.so_luong: nullable|integer|min:1
- items.*.trang_thai: nullable|in:cho_thuc_hien,da_hoan_thanh,huy
- items.*.ngay_chi_dinh: nullable|date
- items.*.ghi_chu: nullable|string

## 7. Checklist test nhanh

1. Chinh BENH_NHAN_ID thanh benh nhan can test.
2. Reload trang.
3. Chon 1 phieu kham trong dropdown, bam Xem phieu kham nay.
4. Neu phieu chua co chi dinh:
   - Chon dich vu, bam Luu chi dinh -> phai tao thanh cong.
5. Thu tao lan 2 tren cung phieu:
   - Phai bi chan va bao loi da ton tai phieu chi dinh.
6. Chuyen sang phieu kham khac:
   - Trang phai hien data rieng theo phieu moi.

## 8. Luu y ve du lieu demo

Thong tin benh nhan o khoi header tren cung (ten, BHYT, dia chi, chan doan so bo) hien tai la giao dien demo. Phan quyet dinh nghiep vu va du lieu thuc de hien/luu phieu chi dinh nam o:

- phieuKhamId dang duoc chon
- existingChiDinh tu API
- services tu API

Neu can dong bo thong tin header theo benh nhan/phieu kham thuc, can goi them API chi tiet phieu kham va bind du lieu vao UI.
