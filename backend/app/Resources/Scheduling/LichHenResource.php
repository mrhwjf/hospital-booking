<?php

namespace App\Resources\Scheduling;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LichHenResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_lich_hen' => $this->ma_lich_hen,
			'benh_nhan_id' => $this->benh_nhan_id,
			'bac_si_id' => $this->bac_si_id,
			'chuyen_khoa_id' => $this->chuyen_khoa_id,
			'khung_gio_id' => $this->khung_gio_id,
			'ngay_hen' => $this->ngay_hen?->format('Y-m-d') ?? $this->ngay_hen,
			'ly_do_kham' => $this->ly_do_kham,
			'trang_thai' => $this->trang_thai,
			'nguoi_tao_id' => $this->nguoi_tao_id,
			'gio_den_thuc_te' => $this->gio_den_thuc_te,
			'nguoi_tiep_nhan_id' => $this->nguoi_tiep_nhan_id,
			'ly_do_huy_id' => $this->ly_do_huy_id,
			'ly_do_huy_khac' => $this->ly_do_huy_khac,
			'ghi_chu' => $this->ghi_chu,
			'ghi_chu_noi_bo' => $this->ghi_chu_noi_bo,
			'benh_nhan' => $this->whenLoaded('benhNhan', fn() => new BenhNhanResource($this->benhNhan)),
			'bac_si' => $this->whenLoaded('bacSi', fn() => new BacSiResource($this->bacSi)),
			'chuyen_khoa' => $this->whenLoaded('chuyenKhoa', fn() => new ChuyenKhoaResource($this->chuyenKhoa)),
			'khung_gio_kham' => $this->whenLoaded('khungGioKham', fn() => new KhungGioKhamResource($this->khungGioKham)),
			'ly_do_huy' => $this->whenLoaded('lyDoHuy', fn() => new LyDoHuyResource($this->lyDoHuy)),
			'dich_vu_lich_hens' => $this->whenLoaded('dichVuLichHens', fn() => DichVuLichHenResource::collection($this->dichVuLichHens)),
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
