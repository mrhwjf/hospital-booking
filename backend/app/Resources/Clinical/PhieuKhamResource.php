<?php

namespace App\Resources\Clinical;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhieuKhamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $patientDob = $this->benhNhan?->ngay_sinh;
        $patientAge = $patientDob ? Carbon::parse($patientDob)->age : null;

        return [
            'id' => $this->id,
            'ma_phieu_kham' => $this->ma_phieu_kham,
            'lich_hen_id' => $this->lich_hen_id,
            'benh_nhan_id' => $this->benh_nhan_id,
            'bac_si_id' => $this->bac_si_id,
            'nguoi_tao_id' => $this->nguoi_tao_id,
            'trang_thai' => $this->trang_thai,
            'thoi_gian_tiep_nhan' => $this->thoi_gian_tiep_nhan ? $this->thoi_gian_tiep_nhan->format('Y-m-d H:i') : null,

            // Chi so sinh hieu
            'mach' => $this->mach,
            'nhiet_do' => $this->nhiet_do,
            'huyet_ap' => $this->huyet_ap,
            'can_nang' => $this->can_nang,
            'chieu_cao' => $this->chieu_cao,

            // Thong tin kham benh
            'trieu_chung' => $this->trieu_chung,
            'ket_qua_kham' => $this->ket_qua_kham,
            'chan_doan' => $this->chan_doan,
            'ma_icd10_chinh' => $this->ma_icd10_chinh,
            'ma_icd10' => $this->ma_icd10_chinh,
            'tinh_trang' => $this->tinh_trang,
            'huong_dieu_tri' => $this->huong_dieu_tri,
            'loi_dan' => $this->loi_dan,
            'hen_tai_kham' => $this->hen_tai_kham ? $this->hen_tai_kham->format('Y-m-d') : null,
            'ghi_chu_noi_bo' => $this->ghi_chu_noi_bo,

            'benh_nhan' => [
                'id' => $this->benhNhan?->id,
                'ma_benh_nhan' => $this->benhNhan?->ma_benh_nhan,
                'ma' => $this->benhNhan?->ma_benh_nhan,
                'ho_ten' => $this->benhNhan?->ho_ten,
                'ten' => $this->benhNhan?->ho_ten,
                'gioi_tinh' => $this->benhNhan?->gioi_tinh,
                'ngay_sinh' => $patientDob,
                'tuoi' => $patientAge,
                'so_dien_thoai' => $this->benhNhan?->so_dien_thoai,
                'sdt' => $this->benhNhan?->so_dien_thoai,
                'tien_su_benh' => $this->benhNhan?->tien_su_benh,
                'tien_su_di_ung' => $this->benhNhan?->tien_su_di_ung,
            ],
            'bac_si' => [
                'id' => $this->bacSi?->id,
                'ma_bac_si' => $this->bacSi?->ma_bac_si,
                'ma' => $this->bacSi?->ma_bac_si,
                'ho_ten' => $this->bacSi?->ho_ten,
                'ten' => $this->bacSi ? 'BS. ' . $this->bacSi->ho_ten : null,
            ],
            'nguoi_tao' => [
                'id' => $this->nguoiTao?->id,
                'ho_ten' => $this->nguoiTao?->nhanVien?->ho_ten ?? $this->nguoiTao?->ho_ten,
                'ten' => $this->nguoiTao?->nhanVien?->ho_ten ?? $this->nguoiTao?->ho_ten,
                'email' => $this->nguoiTao?->email,
                'ma_nhan_vien' => $this->nguoiTao?->nhanVien?->ma_nhan_vien,
                'nhan_vien' => $this->nguoiTao?->nhanVien ? [
                    'ho_ten' => $this->nguoiTao->nhanVien->ho_ten,
                    'ma_nhan_vien' => $this->nguoiTao->nhanVien->ma_nhan_vien,
                ] : null,
            ],
            'lich_hen' => [
                'id' => $this->lichHen?->id,
                'ma_lich_hen' => $this->lichHen?->ma_lich_hen,
                'ngay_hen' => $this->lichHen?->ngay_hen ? Carbon::parse($this->lichHen->ngay_hen)->format('Y-m-d') : null,
                'ly_do_kham' => $this->lichHen?->ly_do_kham,
                'ghi_chu' => $this->lichHen?->ghi_chu,
                'ghi_chu_noi_bo' => $this->lichHen?->ghi_chu_noi_bo,
                'dich_vu_lich_hen' => $this->lichHen?->dichVuLichHens
                    ? $this->lichHen->dichVuLichHens->map(fn($item) => [
                        'id' => $item->id,
                        'dich_vu_id' => $item->dich_vu_id,
                        'goi_kham_id' => $item->goi_kham_id,
                        'so_luong' => $item->so_luong,
                        'ghi_chu' => $item->ghi_chu,
                        'dich_vu' => $item->dichVu ? [
                            'id' => $item->dichVu->id,
                            'ma_dich_vu' => $item->dichVu->ma_dich_vu,
                            'ten_dich_vu' => $item->dichVu->ten_dich_vu,
                            'gia_dich_vu' => $item->dichVu->gia_dich_vu,
                            'loai_dich_vu' => $item->dichVu->loai_dich_vu,
                        ] : null,
                        'goi_kham' => $item->goiKham ? [
                            'id' => $item->goiKham->id,
                            'ma_goi_kham' => $item->goiKham->ma_goi_kham,
                            'ten_goi_kham' => $item->goiKham->ten_goi_kham,
                        ] : null,
                    ])->values()
                    : [],
            ],
        ];
    }
}
