<?php

namespace App\Resources\Admin\Schedule;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignedScheduleResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'bac_si_id' => $this->bac_si_id,
			'lich_lam_viec_id' => $this->lich_lam_viec_id,
			'phong_kham_id' => $this->phong_kham_id,
			'ngay_lam_viec' => Carbon::parse($this->ngay_lam_viec)->format('Y-m-d'),
			'ghi_chu' => $this->ghi_chu,
			'trang_thai' => $this->trang_thai,
			'bac_si' => $this->whenLoaded('bacSi', function () {
				return [
					'id' => $this->bacSi?->id,
					'ma_bac_si' => $this->bacSi?->ma_bac_si,
					'ho_ten' => $this->bacSi?->ho_ten,
					'hoc_vi' => $this->bacSi?->hoc_vi,
					'trang_thai' => $this->bacSi?->trang_thai,
				];
			}),
			'ca_lam_viec' => $this->whenLoaded('lichLamViec', function () {
				return [
					'id' => $this->lichLamViec?->id,
					'ma_ca' => $this->lichLamViec?->ma_ca,
					'ten_ca' => $this->lichLamViec?->ten_ca,
					'thu_trong_tuan' => $this->lichLamViec?->thu_trong_tuan,
					'gio_bat_dau' => $this->lichLamViec?->gio_bat_dau,
					'gio_ket_thuc' => $this->lichLamViec?->gio_ket_thuc,
					'thoi_luong_kham' => $this->lichLamViec?->thoi_luong_kham,
					'trang_thai' => $this->lichLamViec?->trang_thai,
				];
			}),
			'phong_kham' => $this->whenLoaded('phongKham', function () {
				return [
					'id' => $this->phongKham?->id,
					'ma_phong' => $this->phongKham?->ma_phong,
					'ten_phong' => $this->phongKham?->ten_phong,
					'trang_thai' => $this->phongKham?->trang_thai,
				];
			}),
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
