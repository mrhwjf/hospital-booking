<?php

namespace App\Resources\Patients;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitHistoryItemResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_phieu_kham' => $this->ma_phieu_kham,
			'benh_nhan_id' => $this->benh_nhan_id,
			'bac_si_id' => $this->bac_si_id,
			'lich_hen_id' => $this->lich_hen_id,
			'thoi_gian_tiep_nhan' => $this->thoi_gian_tiep_nhan?->format('Y-m-d H:i:s') ?? $this->thoi_gian_tiep_nhan,
			'chan_doan' => $this->chan_doan,
			'tinh_trang' => $this->tinh_trang,
			'trang_thai' => $this->trang_thai,
			'co_don_thuoc' => ((int) ($this->don_thuoc_count ?? 0)) > 0,
			'so_tai_lieu' => (int) ($this->tai_lieu_ho_sos_count ?? 0),
			'bac_si' => $this->whenLoaded('bacSi', function () {
				return [
					'id' => $this->bacSi?->id,
					'ho_ten' => $this->bacSi?->ho_ten,
					'hoc_vi' => $this->bacSi?->hoc_vi,
				];
			}),
			'created_at' => $this->created_at?->format('Y-m-d H:i:s') ?? $this->created_at,
		];
	}
}
