<?php

namespace App\Services;

use App\Models\BacSi;
use App\Models\LichHen;
use App\Models\NguoiDung;
use App\Models\NhanVien;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReportService
{
	private const TRANG_THAI_LICH_HEN_HOAN_TAT = 'da_hoan_tat';
	private const TRANG_THAI_LICH_HEN_HUY = 'da_huy';
	private const TRANG_THAI_LICH_HEN_KHONG_DEN = 'khong_den';

	public function layDashboardAdmin(?string $mocPhanTich = null): array
	{
		$analysisDate = $mocPhanTich
			? Carbon::createFromFormat('Y-m-d', $mocPhanTich)->endOfDay()
			: now()->endOfDay();

		$start30Days = $analysisDate->copy()->subDays(29)->startOfDay();
		$end30Days = $analysisDate->copy()->endOfDay();

		$tongTaiKhoan = NguoiDung::query()->count();
		$tongTaiKhoan30NgayTruoc = NguoiDung::query()
			->where('created_at', '<=', $start30Days)
			->count();

		$taiKhoanMoi30Ngay = NguoiDung::query()
			->whereBetween('created_at', [$start30Days, $end30Days])
			->count();

		$tangTruongTaiKhoan = $tongTaiKhoan30NgayTruoc > 0
			? round(($taiKhoanMoi30Ngay / $tongTaiKhoan30NgayTruoc) * 100, 1)
			: ($taiKhoanMoi30Ngay > 0 ? 100.0 : 0.0);

		$tongBacSi = BacSi::query()->count();
		$tongNhanVien = NhanVien::query()->count();

		$tongBacSiHoatDong = BacSi::query()->where('trang_thai', 'hoat_dong')->count();
		$tongNhanVienHoatDong = NhanVien::query()->where('trang_thai', 'hoat_dong')->count();

		$nhanSuTheoKhoa = DB::table('chuyen_khoa as ck')
			->leftJoin('bac_si_chuyen_khoa as bsck', 'bsck.chuyen_khoa_id', '=', 'ck.id')
			->leftJoin('bac_si as bs', 'bs.id', '=', 'bsck.bac_si_id')
			->where('ck.trang_thai', 'hoat_dong')
			->groupBy('ck.id', 'ck.ten_chuyen_khoa')
			->orderBy('ck.ten_chuyen_khoa')
			->selectRaw('ck.id as id, ck.ten_chuyen_khoa as ten_khoa, COUNT(DISTINCT bs.id) as bac_si')
			->get()
			->map(fn($item) => [
				'key' => 'ck-' . $item->id,
				'tenKhoa' => $item->ten_khoa,
				'bacSi' => (int) $item->bac_si,
				'nhanVien' => 0,
			])
			->values();

		$lichHenTheoThoiGian = [
			'ngay' => $this->thongKeLichHenTheoKhoang($analysisDate->copy()->startOfDay(), $analysisDate->copy()->endOfDay()),
			'tuan' => $this->thongKeLichHenTheoKhoang($analysisDate->copy()->startOfWeek(), $analysisDate->copy()->endOfWeek()),
			'thang' => $this->thongKeLichHenTheoKhoang($analysisDate->copy()->startOfMonth(), $analysisDate->copy()->endOfMonth()),
		];

		$doanhThuTheoChuyenKhoa = $this->tongHopDoanhThuTheoChuyenKhoa(
			$analysisDate->copy()->startOfMonth()->toDateString(),
			$analysisDate->copy()->endOfMonth()->toDateString(),
			null,
			null
		);

		$taiBacSi = $this->tongHopTaiBacSi(
			$analysisDate->copy()->subDays(6)->startOfDay(),
			$analysisDate->copy()->endOfDay()
		);

		return [
			'moc_phan_tich' => $analysisDate->toDateString(),
			// 'adminKpi' => [
			// 	'tongTaiKhoan' => $tongTaiKhoan,
			// 	'benhNhan' => NguoiDung::query()
			// 		->whereHas('vaiTro', fn($query) => $query->where('ma_vai_tro', 'BENHNHAN'))
			// 		->count(),
			// 	'bacSi' => NguoiDung::query()
			// 		->whereHas('vaiTro', fn($query) => $query->where('ma_vai_tro', 'BACSI'))
			// 		->count(),
			// 	'nhanVien' => NguoiDung::query()
			// 		->whereHas('vaiTro', fn($query) => $query->where('ma_vai_tro', 'NHANVIEN'))
			// 		->count(),
			// 	'tangTruongTaiKhoan' => $tangTruongTaiKhoan,
			// ],
			'nhanSuTongQuan' => [
				'tongBacSi' => $tongBacSi,
				'tongNhanVien' => $tongNhanVien,
				'tongBacSiHoatDong' => $tongBacSiHoatDong,
				'tongNhanVienHoatDong' => $tongNhanVienHoatDong,
				'tyLeBacSiHoatDong' => $tongBacSi > 0 ? round(($tongBacSiHoatDong / $tongBacSi) * 100, 1) : 0,
				'tyLeNhanVienHoatDong' => $tongNhanVien > 0 ? round(($tongNhanVienHoatDong / $tongNhanVien) * 100, 1) : 0,
			],
			'nhanSuTheoKhoa' => $nhanSuTheoKhoa,
			'doanhThuTheoChuyenKhoa' => $doanhThuTheoChuyenKhoa,
			'lichHenTheoThoiGian' => $lichHenTheoThoiGian,
			'taiBacSi' => $taiBacSi,
		];
	}

	public function layBaoCaoDoanhThu(array $filters): array
	{
		$today = now();

		$tuNgay = $filters['tu_ngay'] ?? $today->copy()->startOfMonth()->toDateString();
		$denNgay = $filters['den_ngay'] ?? $today->copy()->endOfMonth()->toDateString();
		$chuyenKhoaId = $filters['chuyen_khoa_id'] ?? null;
		$loaiDichVu = $filters['loai_dich_vu'] ?? null;

		$doanhThuTheoChuyenKhoa = $this->tongHopDoanhThuTheoChuyenKhoa($tuNgay, $denNgay, $chuyenKhoaId, $loaiDichVu);

		$tongDoanhThu = (int) collect($doanhThuTheoChuyenKhoa)->sum('doanhThu');
		$tongLuotKham = (int) collect($doanhThuTheoChuyenKhoa)->sum('soLuotKham');
		$doanhThuTrungBinh = $tongLuotKham > 0 ? (int) round($tongDoanhThu / $tongLuotKham) : 0;

		$mucTieuThang = (int) ($filters['muc_tieu_thang'] ?? 4200000000);

		$xuHuongDoanhThuThang = $this->tongHopXuHuongDoanhThu6Thang($today, $chuyenKhoaId, $loaiDichVu);
		$doanhThuThangGanNhat = (int) ($xuHuongDoanhThuThang[count($xuHuongDoanhThuThang) - 1]['doanhThu'] ?? 0);

		return [
			'filters' => [
				'tu_ngay' => $tuNgay,
				'den_ngay' => $denNgay,
				'chuyen_khoa_id' => $chuyenKhoaId,
				'loai_dich_vu' => $loaiDichVu,
			],
			'summary' => [
				'tongDoanhThu' => $tongDoanhThu,
				'tongLuotKham' => $tongLuotKham,
				'doanhThuTrungBinh' => $doanhThuTrungBinh,
				'mucTieuThang' => $mucTieuThang,
				'doanhThuThangGanNhat' => $doanhThuThangGanNhat,
			],
			'doanhThuTheoChuyenKhoa' => $doanhThuTheoChuyenKhoa,
			'xuHuongDoanhThuThang' => $xuHuongDoanhThuThang,
			'danhMucChuyenKhoa' => $this->layDanhMucChuyenKhoa(),
		];
	}

	public function layBaoCaoLichHen(array $filters): array
	{
		$today = now();
		$analysisDate = !empty($filters['moc_phan_tich'])
			? Carbon::createFromFormat('Y-m-d', $filters['moc_phan_tich'])->endOfDay()
			: $today->copy()->endOfDay();

		$tuNgay = $filters['tu_ngay'] ?? null;
		$denNgay = $filters['den_ngay'] ?? null;
		$chuyenKhoaId = $filters['chuyen_khoa_id'] ?? null;

		$rangeStart = $tuNgay ? Carbon::createFromFormat('Y-m-d', $tuNgay)->startOfDay() : null;
		$rangeEnd = $denNgay ? Carbon::createFromFormat('Y-m-d', $denNgay)->endOfDay() : null;

		$taiBacSiStart = $rangeStart ?? $analysisDate->copy()->subDays(6)->startOfDay();
		$taiBacSiEnd = $rangeEnd ?? $analysisDate->copy()->endOfDay();

		$phatSinhFrom = $rangeStart ?? $analysisDate->copy()->startOfMonth();
		$phatSinhTo = $rangeEnd ?? $analysisDate->copy()->endOfMonth();

		return [
			'filters' => [
				'moc_phan_tich' => $analysisDate->toDateString(),
				'tu_ngay' => $tuNgay,
				'den_ngay' => $denNgay,
				'chuyen_khoa_id' => $chuyenKhoaId,
			],
			'lichHenTheoThoiGian' => [
				'ngay' => $this->thongKeLichHenTheoKhoang($analysisDate->copy()->startOfDay(), $analysisDate->copy()->endOfDay(), $chuyenKhoaId),
				'tuan' => $this->thongKeLichHenTheoKhoang($analysisDate->copy()->startOfWeek(), $analysisDate->copy()->endOfWeek(), $chuyenKhoaId),
				'thang' => $this->thongKeLichHenTheoKhoang($analysisDate->copy()->startOfMonth(), $analysisDate->copy()->endOfMonth(), $chuyenKhoaId),
			],
			'nhanSuTheoKhoa' => DB::table('chuyen_khoa as ck')
				->leftJoin('bac_si_chuyen_khoa as bsck', 'bsck.chuyen_khoa_id', '=', 'ck.id')
				->leftJoin('bac_si as bs', 'bs.id', '=', 'bsck.bac_si_id')
				->where('ck.trang_thai', 'hoat_dong')
				->groupBy('ck.id', 'ck.ten_chuyen_khoa')
				->orderBy('ck.ten_chuyen_khoa')
				->selectRaw('ck.id as id, ck.ten_chuyen_khoa as ten_khoa, COUNT(DISTINCT bs.id) as bac_si')
				->get()
				->map(fn($item) => [
					'key' => 'ck-' . $item->id,
					'tenKhoa' => $item->ten_khoa,
					'bacSi' => (int) $item->bac_si,
					'nhanVien' => 0,
				])
				->values(),
			'taiBacSi' => $this->tongHopTaiBacSi($taiBacSiStart, $taiBacSiEnd, $chuyenKhoaId),
			'phanTichTheoKhungGio' => $this->tongHopLichHenTheoKhungGio($phatSinhFrom, $phatSinhTo, $chuyenKhoaId),
			'danhMucChuyenKhoa' => $this->layDanhMucChuyenKhoa(),
		];
	}

	private function thongKeLichHenTheoKhoang(Carbon $tuNgay, Carbon $denNgay, ?int $chuyenKhoaId = null): array
	{
		$query = LichHen::query()->whereBetween('ngay_hen', [$tuNgay->toDateString(), $denNgay->toDateString()]);

		if ($chuyenKhoaId) {
			$query->where('chuyen_khoa_id', $chuyenKhoaId);
		}

		$tong = (clone $query)->count();
		$daDat = (clone $query)->whereIn('trang_thai', ['dang_cho', 'da_thanh_toan', 'da_xac_nhan'])->count();
		$daHoanTat = (clone $query)->where('trang_thai', self::TRANG_THAI_LICH_HEN_HOAN_TAT)->count();
		$daHuy = (clone $query)->where('trang_thai', self::TRANG_THAI_LICH_HEN_HUY)->count();
		$khongDen = (clone $query)->where('trang_thai', self::TRANG_THAI_LICH_HEN_KHONG_DEN)->count();

		return [
			'daDat' => $daDat,
			'daHoanTat' => $daHoanTat,
			'daHuy' => $daHuy,
			'khongDen' => $khongDen,
			'tongLich' => $tong,
		];
	}

	private function tongHopTaiBacSi(Carbon $tuNgay, Carbon $denNgay, ?int $chuyenKhoaId = null): array
	{
		$query = DB::table('bac_si as bs')
			->leftJoin('bac_si_chuyen_khoa as bsck', function ($join) {
				$join->on('bsck.bac_si_id', '=', 'bs.id')
					->where('bsck.la_chuyen_khoa_chinh', '=', 1);
			})
			->leftJoin('chuyen_khoa as ck', 'ck.id', '=', 'bsck.chuyen_khoa_id')
			->leftJoin('lich_hen as lh', function ($join) use ($tuNgay, $denNgay) {
				$join->on('lh.bac_si_id', '=', 'bs.id')
					->whereBetween('lh.ngay_hen', [$tuNgay->toDateString(), $denNgay->toDateString()]);
			})
			->selectRaw('
				bs.id as id,
				bs.ho_ten as ten_bac_si,
				COALESCE(ck.ten_chuyen_khoa, N\'Chua phan khoa\') as chuyen_khoa,
				COUNT(lh.id) as lich_da_dat,
				SUM(CASE WHEN lh.trang_thai = ? THEN 1 ELSE 0 END) as lich_hoan_tat,
				SUM(CASE WHEN lh.trang_thai = ? THEN 1 ELSE 0 END) as lich_huy
			', [self::TRANG_THAI_LICH_HEN_HOAN_TAT, self::TRANG_THAI_LICH_HEN_HUY])
			->groupBy('bs.id', 'bs.ho_ten', 'ck.ten_chuyen_khoa')
			->orderBy('bs.ho_ten');

		if ($chuyenKhoaId) {
			$query->where('bsck.chuyen_khoa_id', $chuyenKhoaId);
		}

		$rows = $query->get();

		return $rows->map(function ($item) {
			$lichDaDat = (int) $item->lich_da_dat;
			$lichHoanTat = (int) $item->lich_hoan_tat;
			$lichHuy = (int) $item->lich_huy;

			return [
				'key' => 'bs-' . $item->id,
				'tenBacSi' => $item->ten_bac_si,
				'chuyenKhoa' => $item->chuyen_khoa,
				'lichDaDat' => $lichDaDat,
				'lichHoanTat' => $lichHoanTat,
				'lichHuy' => $lichHuy,
				'tyLeHoanThanh' => $lichDaDat > 0 ? round(($lichHoanTat / $lichDaDat) * 100, 1) : 0,
			];
		})->values()->all();
	}

	private function tongHopLichHenTheoKhungGio(Carbon $tuNgay, Carbon $denNgay, ?int $chuyenKhoaId = null): array
	{
		$query = DB::table('lich_hen as lh')
			->whereBetween('lh.ngay_hen', [$tuNgay->toDateString(), $denNgay->toDateString()]);

		if ($chuyenKhoaId) {
			$query->where('lh.chuyen_khoa_id', $chuyenKhoaId);
		}

		$rows = $query
			->selectRaw('
				CASE
					WHEN HOUR(lh.created_at) BETWEEN 6 AND 9 THEN "06:00-09:59"
					WHEN HOUR(lh.created_at) BETWEEN 10 AND 13 THEN "10:00-13:59"
					WHEN HOUR(lh.created_at) BETWEEN 14 AND 17 THEN "14:00-17:59"
					WHEN HOUR(lh.created_at) BETWEEN 18 AND 21 THEN "18:00-21:59"
					ELSE "22:00-05:59"
				END as khung_gio,
				COUNT(*) as dat_lich,
				SUM(CASE WHEN lh.trang_thai = ? THEN 1 ELSE 0 END) as hoan_tat,
				SUM(CASE WHEN lh.trang_thai = ? THEN 1 ELSE 0 END) as huy
			', [self::TRANG_THAI_LICH_HEN_HOAN_TAT, self::TRANG_THAI_LICH_HEN_HUY])
			->groupBy('khung_gio')
			->orderBy('khung_gio')
			->get();

		return $rows->map(fn($item) => [
			'khungGio' => $item->khung_gio,
			'datLich' => (int) $item->dat_lich,
			'hoanTat' => (int) $item->hoan_tat,
			'huy' => (int) $item->huy,
		])->values()->all();
	}

	private function layDanhMucChuyenKhoa(): array
	{
		return DB::table('chuyen_khoa')
			->where('trang_thai', 'hoat_dong')
			->orderBy('ten_chuyen_khoa')
			->get(['id', 'ten_chuyen_khoa'])
			->map(fn($item) => [
				'id' => (int) $item->id,
				'ten_chuyen_khoa' => $item->ten_chuyen_khoa,
			])
			->values()
			->all();
	}

	private function tongHopDoanhThuTheoChuyenKhoa(
		string $tuNgay,
		string $denNgay,
		?int $chuyenKhoaId,
		?string $loaiDichVu
	): array {
		$currentRows = $this->queryDoanhThuTheoChuyenKhoa($tuNgay, $denNgay, $chuyenKhoaId, $loaiDichVu);

		$fromCarbon = Carbon::createFromFormat('Y-m-d', $tuNgay);
		$toCarbon = Carbon::createFromFormat('Y-m-d', $denNgay);
		$periodDays = max($fromCarbon->diffInDays($toCarbon) + 1, 1);

		$previousFrom = $fromCarbon->copy()->subDays($periodDays);
		$previousTo = $fromCarbon->copy()->subDay();

		$previousRows = $this->queryDoanhThuTheoChuyenKhoa(
			$previousFrom->toDateString(),
			$previousTo->toDateString(),
			$chuyenKhoaId,
			$loaiDichVu
		)->keyBy('id');

		return $currentRows->map(function ($item) use ($previousRows) {
			$currentRevenue = (int) $item->doanh_thu;
			$previousRevenue = (int) ($previousRows->get($item->id)->doanh_thu ?? 0);

			$growth = $previousRevenue > 0
				? round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
				: ($currentRevenue > 0 ? 100.0 : 0.0);

			return [
				'key' => 'ck-' . $item->id,
				'id' => (int) $item->id,
				'tenChuyenKhoa' => $item->ten_chuyen_khoa,
				'doanhThu' => $currentRevenue,
				'soLuotKham' => (int) $item->so_luot_kham,
				'tangTruong' => $growth,
			];
		})->values()->all();
	}

	private function queryDoanhThuTheoChuyenKhoa(
		string $tuNgay,
		string $denNgay,
		?int $chuyenKhoaId,
		?string $loaiDichVu
	): Collection {
		$query = DB::table('chuyen_khoa as ck')
			->leftJoin('lich_hen as lh', function ($join) use ($tuNgay, $denNgay) {
				$join->on('lh.chuyen_khoa_id', '=', 'ck.id')
					->whereBetween('lh.ngay_hen', [$tuNgay, $denNgay])
					->where('lh.trang_thai', '=', self::TRANG_THAI_LICH_HEN_HOAN_TAT);
			})
			->leftJoin('dich_vu_lich_hen as dvlh', 'dvlh.lich_hen_id', '=', 'lh.id')
			->leftJoin('dich_vu as dv', 'dv.id', '=', 'dvlh.dich_vu_id')
			->leftJoin('goi_kham as gk', 'gk.id', '=', 'dvlh.goi_kham_id')
			->where('ck.trang_thai', 'hoat_dong');

		if ($chuyenKhoaId) {
			$query->where('ck.id', $chuyenKhoaId);
		}

		if ($loaiDichVu) {
			$query->where('dv.loai_dich_vu', $loaiDichVu);
		}

		return $query
			->groupBy('ck.id', 'ck.ten_chuyen_khoa')
			->orderBy('ck.ten_chuyen_khoa')
			->selectRaw('
				ck.id as id,
				ck.ten_chuyen_khoa,
				COUNT(DISTINCT lh.id) as so_luot_kham,
				COALESCE(SUM(
					CASE
						WHEN dvlh.dich_vu_id IS NOT NULL THEN COALESCE(dv.gia_dich_vu, 0) * COALESCE(dvlh.so_luong, 1)
						WHEN dvlh.goi_kham_id IS NOT NULL THEN COALESCE(gk.gia_goi_kham, 0) * COALESCE(dvlh.so_luong, 1)
						ELSE 0
					END
				), 0) as doanh_thu
			')
			->get();
	}

	private function tongHopXuHuongDoanhThu6Thang(
		Carbon $moc,
		?int $chuyenKhoaId,
		?string $loaiDichVu
	): array {
		$list = [];

		for ($i = 5; $i >= 0; $i--) {
			$month = $moc->copy()->subMonths($i);
			$from = $month->copy()->startOfMonth()->toDateString();
			$to = $month->copy()->endOfMonth()->toDateString();

			$tongDoanhThu = (int) $this->queryDoanhThuTheoChuyenKhoa($from, $to, $chuyenKhoaId, $loaiDichVu)
				->sum('doanh_thu');

			$list[] = [
				'thang' => $month->format('m/Y'),
				'doanhThu' => (int) $tongDoanhThu,
			];
		}

		return $list;
	}
}
