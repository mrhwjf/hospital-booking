# Trigger Rules

## TRG-01: Dat lich thanh cong
- Bang lien quan: `lich_hen`, `khung_gio_kham`.
- Hanh dong: khi insert lich hen, slot duoc cap nhat thanh `da_dat`.

## TRG-02: Huy lich
- Dieu kien: `lich_hen.trang_thai` doi sang `da_huy`.
- Hanh dong: slot mo lai `trong`.

## TRG-03: Check-in lan dau
- Dieu kien: `gio_den_thuc_te` tu NULL sang gia tri hop le.
- Hanh dong: tao `phieu_kham` neu chua ton tai, trang thai `tiep_nhan`.

## TRG-04: Rang buoc item lich hen
- Bang: `dich_vu_lich_hen`.
- Rang buoc:
	- Khong duoc cung luc co ca `dich_vu_id` va `goi_kham_id`.
	- Khong duoc cung luc NULL ca hai cot.

