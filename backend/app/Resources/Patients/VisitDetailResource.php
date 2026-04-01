<?php

namespace App\Resources\Patients;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitDetailResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'ma_phieu_kham' => $this->ma_phieu_kham,
			'lich_hen_id' => $this->lich_hen_id,
			'benh_nhan_id' => $this->benh_nhan_id,
			'bac_si_id' => $this->bac_si_id,
			'thoi_gian_tiep_nhan' => $this->thoi_gian_tiep_nhan?->format('Y-m-d H:i:s') ?? $this->thoi_gian_tiep_nhan,
			'mach' => $this->mach,
			'nhiet_do' => $this->nhiet_do,
			'huyet_ap' => $this->huyet_ap,
			'can_nang' => $this->can_nang,
			'chieu_cao' => $this->chieu_cao,
			'trieu_chung' => $this->trieu_chung,
			'ket_qua_kham' => $this->ket_qua_kham,
			'chan_doan' => $this->chan_doan,
			'ma_icd10_chinh' => $this->ma_icd10_chinh,
			'tinh_trang' => $this->tinh_trang,
			'huong_dieu_tri' => $this->huong_dieu_tri,
			'loi_dan' => $this->loi_dan,
			'hen_tai_kham' => $this->hen_tai_kham?->format('Y-m-d') ?? $this->hen_tai_kham,
			'trang_thai' => $this->trang_thai,
			'co_don_thuoc' => ((int) ($this->don_thuoc_count ?? 0)) > 0,
			'so_tai_lieu' => (int) ($this->tai_lieu_ho_sos_count ?? 0),
			'icd10' => $this->whenLoaded('icd10Chinh', function () {
				return $this->icd10Chinh ? [
					'ma_icd10' => $this->icd10Chinh->ma_icd10,
					'ten_chan_doan' => $this->icd10Chinh->ten_chan_doan,
				] : null;
			}),
			'bac_si' => $this->whenLoaded('bacSi', function () {
				return $this->bacSi ? [
					'id' => $this->bacSi->id,
					'ho_ten' => $this->bacSi->ho_ten,
					'hoc_vi' => $this->bacSi->hoc_vi,
				] : null;
			}),
			'lich_hen' => $this->whenLoaded('lichHen', function () {
				return $this->lichHen ? [
					'id' => $this->lichHen->id,
					'ma_lich_hen' => $this->lichHen->ma_lich_hen,
					'ngay_hen' => $this->lichHen->ngay_hen?->format('Y-m-d') ?? $this->lichHen->ngay_hen,
				] : null;
			}),
		];
	}
}
