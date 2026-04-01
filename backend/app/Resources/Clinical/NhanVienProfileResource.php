<?php

namespace App\Resources\Clinical;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NhanVienProfileResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_nhan_vien' => $this->ma_nhan_vien,
			'nguoi_dung_id' => $this->nguoi_dung_id,
			'ho_ten' => $this->ho_ten,
			'so_dien_thoai' => $this->so_dien_thoai,
			'chuc_vu' => $this->chuc_vu,
			'ngay_vao_lam' => $this->ngay_vao_lam?->format('Y-m-d') ?? $this->ngay_vao_lam,
			'trang_thai' => $this->trang_thai,
			'ghi_chu' => $this->ghi_chu,
			'nguoi_dung' => $this->whenLoaded('nguoiDung', function () {
				return $this->nguoiDung ? [
					'id' => $this->nguoiDung->id,
					'email' => $this->nguoiDung->email,
					'trang_thai' => $this->nguoiDung->trang_thai,
					'vai_tro' => $this->nguoiDung->vaiTro ? [
						'id' => $this->nguoiDung->vaiTro->id,
						'ma_vai_tro' => $this->nguoiDung->vaiTro->ma_vai_tro,
						'ten_vai_tro' => $this->nguoiDung->vaiTro->ten_vai_tro,
					] : null,
				] : null;
			}),
			'created_at' => $this->created_at?->format('Y-m-d H:i:s') ?? $this->created_at,
		];
	}
}
