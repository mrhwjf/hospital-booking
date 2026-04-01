<?php

namespace App\Resources\Patients;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChiDinhResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'phieu_kham_id' => $this->phieu_kham_id,
			'bac_si_id' => $this->bac_si_id,
			'dich_vu_id' => $this->dich_vu_id,
			'goi_kham_id' => $this->goi_kham_id,
			'so_luong' => $this->so_luong,
			'trang_thai' => $this->trang_thai,
			'ngay_chi_dinh' => $this->ngay_chi_dinh?->format('Y-m-d') ?? $this->ngay_chi_dinh,
			'ghi_chu' => $this->ghi_chu,
			'bac_si' => $this->whenLoaded('bacSi', function () {
				return $this->bacSi ? [
					'id' => $this->bacSi->id,
					'ho_ten' => $this->bacSi->ho_ten,
				] : null;
			}),
			'dich_vu' => $this->whenLoaded('dichVu', function () {
				return $this->dichVu ? [
					'id' => $this->dichVu->id,
					'ma_dich_vu' => $this->dichVu->ma_dich_vu,
					'ten_dich_vu' => $this->dichVu->ten_dich_vu,
					'gia_dich_vu' => $this->dichVu->gia_dich_vu,
				] : null;
			}),
			'goi_kham' => $this->whenLoaded('goiKham', function () {
				return $this->goiKham ? [
					'id' => $this->goiKham->id,
					'ma_goi_kham' => $this->goiKham->ma_goi_kham,
					'ten_goi_kham' => $this->goiKham->ten_goi_kham,
					'gia_goi_kham' => $this->goiKham->gia_goi_kham,
				] : null;
			}),
		];
	}
}
