<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BenhNhanResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_benh_nhan' => $this->ma_benh_nhan,
			'nguoi_dung_id' => $this->nguoi_dung_id,
			'ho_ten' => $this->ho_ten,
			'ngay_sinh' => $this->ngay_sinh?->format('Y-m-d') ?? $this->ngay_sinh,
			'gioi_tinh' => $this->gioi_tinh,
			'so_dien_thoai' => $this->so_dien_thoai,
			'email' => $this->email,
			'so_cccd' => $this->so_cccd,
			'dia_chi' => $this->dia_chi,
			'nguoi_lien_he' => $this->nguoi_lien_he,
			'sdt_nguoi_lien_he' => $this->sdt_nguoi_lien_he,
			'nhom_mau' => $this->nhom_mau,
			'tien_su_di_ung' => $this->tien_su_di_ung,
			'tien_su_benh' => $this->tien_su_benh,
			'ghi_chu' => $this->ghi_chu,
			'trang_thai' => $this->trang_thai,
		];
	}
}
