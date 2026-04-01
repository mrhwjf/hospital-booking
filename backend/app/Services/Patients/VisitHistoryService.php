<?php

namespace App\Services\Patients;

use App\Models\BenhNhan;
use App\Models\DonThuoc;
use App\Models\PhieuKham;
use App\Services\CloudinaryService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VisitHistoryService
{
	public const DEFAULT_PAGE_SIZE = 10;
	private const MAX_PAGE_SIZE = 100;

	public function __construct(private readonly CloudinaryService $cloudinaryService)
	{
	}

	public function getCurrentPatient(int $benhNhanId): BenhNhan
	{
		$benhNhan = BenhNhan::query()->find($benhNhanId);

		if (!$benhNhan) {
			throw ValidationException::withMessages([
				'benh_nhan_id' => ['Bệnh nhân không tồn tại.'],
			]);
		}

		return $benhNhan;
	}

	public function getVisitHistory(array $filters): LengthAwarePaginator
	{
		$benhNhanId = (int) ($filters['benh_nhan_id'] ?? 0);
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);
		$keyword = trim((string) ($filters['q'] ?? ''));
		$fromDate = !empty($filters['tu_ngay']) ? (string) $filters['tu_ngay'] : null;
		$toDate = !empty($filters['den_ngay']) ? (string) $filters['den_ngay'] : null;

		$this->getCurrentPatient($benhNhanId);

		$query = PhieuKham::query()
			->with([
				'bacSi:id,ho_ten,hoc_vi',
			])
			->withCount([
				'donThuoc',
				'taiLieuHoSos',
			])
			->where('benh_nhan_id', $benhNhanId);

		$trangThai = (string) ($filters['trang_thai'] ?? '');

		if ($trangThai === '' || $trangThai === 'all') {
			$query->where('trang_thai', 'hoan_thanh');
		} else {
			$query->where('trang_thai', $trangThai);
		}

		if ($fromDate !== null) {
			$query->whereDate(DB::raw('COALESCE(thoi_gian_tiep_nhan, created_at)'), '>=', $fromDate);
		}

		if ($toDate !== null) {
			$query->whereDate(DB::raw('COALESCE(thoi_gian_tiep_nhan, created_at)'), '<=', $toDate);
		}

		if ($keyword !== '') {
			$query->where(function ($builder) use ($keyword) {
				$builder
					->where('ma_phieu_kham', 'like', '%' . $keyword . '%')
					->orWhere('chan_doan', 'like', '%' . $keyword . '%')
					->orWhereHas('bacSi', function ($doctorQuery) use ($keyword) {
						$doctorQuery->where('ho_ten', 'like', '%' . $keyword . '%');
					});
			});
		}

		return $query
			->orderByDesc('thoi_gian_tiep_nhan')
			->orderByDesc('created_at')
			->paginate($pageSize);
	}

	public function getVisitDetail(int $visitId, int $benhNhanId): PhieuKham
	{
		$visit = $this->resolveOwnedVisit($visitId, $benhNhanId);

		$visit->load([
			'bacSi:id,ho_ten,hoc_vi',
			'lichHen:id,ma_lich_hen,ngay_hen',
			'icd10Chinh:ma_icd10,ten_chan_doan',
		]);

		$visit->loadCount([
			'donThuoc',
			'taiLieuHoSos',
		]);

		return $visit;
	}

	public function getVisitDetailBundle(int $visitId, int $benhNhanId): array
	{
		$visit = $this->getVisitDetail($visitId, $benhNhanId);

		$chiDinhs = $visit->chiDinhs()
			->with([
				'bacSi:id,ho_ten',
				'dichVu:id,ma_dich_vu,ten_dich_vu,gia_dich_vu',
				'goiKham:id,ma_goi_kham,ten_goi_kham,gia_goi_kham',
			])
			->orderByDesc('ngay_chi_dinh')
			->orderByDesc('id')
			->get();

		$donThuoc = $visit->donThuoc()
			->with([
				'chiTietDonThuocs.thuoc:id,ma_thuoc,ten_thuoc,don_vi,ham_luong,duong_dung',
			])
			->first();

		$taiLieus = $visit->taiLieuHoSos()
			->orderByDesc('ngay_tao')
			->orderByDesc('id')
			->get();

		return [
			'visit' => $visit,
			'chiDinhs' => $chiDinhs,
			'donThuoc' => $donThuoc,
			'taiLieus' => $taiLieus,
		];
	}

	public function getVisitChiDinhs(int $visitId, int $benhNhanId): Collection
	{
		$visit = $this->resolveOwnedVisit($visitId, $benhNhanId);

		return $visit->chiDinhs()
			->with([
				'bacSi:id,ho_ten',
				'dichVu:id,ma_dich_vu,ten_dich_vu,gia_dich_vu',
				'goiKham:id,ma_goi_kham,ten_goi_kham,gia_goi_kham',
			])
			->orderByDesc('ngay_chi_dinh')
			->orderByDesc('id')
			->get();
	}

	public function getVisitDonThuoc(int $visitId, int $benhNhanId): ?DonThuoc
	{
		$visit = $this->resolveOwnedVisit($visitId, $benhNhanId);

		return $visit->donThuoc()
			->with([
				'chiTietDonThuocs.thuoc:id,ma_thuoc,ten_thuoc,don_vi,ham_luong,duong_dung',
			])
			->first();
	}

	public function getVisitTaiLieus(int $visitId, int $benhNhanId): Collection
	{
		$visit = $this->resolveOwnedVisit($visitId, $benhNhanId);

		return $visit->taiLieuHoSos()
			->orderByDesc('ngay_tao')
			->orderByDesc('id')
			->get();
	}

	public function getVisitTaiLieuSignedUrl(int $visitId, int $taiLieuId, int $benhNhanId): array
	{
		$visit = $this->resolveOwnedVisit($visitId, $benhNhanId);

		$taiLieu = $visit->taiLieuHoSos()->whereKey($taiLieuId)->first();
		if (!$taiLieu) {
			throw ValidationException::withMessages([
				'tai_lieu_id' => ['Không tìm thấy tài liệu hồ sơ.'],
			]);
		}

		if (empty($taiLieu->file_public_id)) {
			throw ValidationException::withMessages([
				'file_public_id' => ['Tài liệu chưa có file_public_id hợp lệ.'],
			]);
		}

		$url = $this->cloudinaryService->getSignedUrl((string) $taiLieu->file_public_id, 'raw');

		return [
			'tai_lieu_id' => $taiLieu->id,
			'url' => $url,
			'expires_in' => 3600,
		];
	}

	private function resolveOwnedVisit(int $visitId, int $benhNhanId): PhieuKham
	{
		$this->getCurrentPatient($benhNhanId);

		$visit = PhieuKham::query()->find($visitId);
		if (!$visit) {
			throw ValidationException::withMessages([
				'id' => ['Không tìm thấy phiếu khám.'],
			]);
		}

		if ((int) $visit->benh_nhan_id !== $benhNhanId) {
			throw ValidationException::withMessages([
				'benh_nhan_id' => ['Bạn không có quyền truy cập phiếu khám này.'],
			]);
		}

		return $visit;
	}

	private function resolvePageSize(mixed $pageSize): int
	{
		if ($pageSize === null) {
			return self::DEFAULT_PAGE_SIZE;
		}

		$normalized = (int) $pageSize;

		if ($normalized <= 0) {
			return self::DEFAULT_PAGE_SIZE;
		}

		return min($normalized, self::MAX_PAGE_SIZE);
	}
}
