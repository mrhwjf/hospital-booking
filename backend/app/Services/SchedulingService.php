<?php

namespace App\Services;

use App\Models\BacSi;
use App\Models\BacSiChuyenKhoa;
use App\Models\BenhNhan;
use App\Models\CauHinhHeThong;
use App\Models\ChuyenKhoa;
use App\Models\DichVu;
use App\Models\DichVuLichHen;
use App\Models\GoiKham;
use App\Models\KhungGioKham;
use App\Models\LichHen;
use App\Models\LichLamViecBacSi;
use App\Models\LyDoHuy;
use App\Models\NgayNghiLe;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SchedulingService
{
	public const DEFAULT_PAGE_SIZE = 10;

	public function __construct(private readonly BookingValidationService $bookingValidationService)
	{
	}

	public function getChuyenKhoas(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);

		return ChuyenKhoa::query()
			->active()
			->when(!empty($filters['ten']), function ($query) use ($filters) {
				$query->where('ten_chuyen_khoa', 'like', '%' . trim((string) $filters['ten']) . '%');
			})
			->orderBy('thu_tu_hien_thi')
			->orderBy('id')
			->paginate($pageSize);
	}

	public function getBacSisByChuyenKhoa(int $chuyenKhoaId, array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);

		$exists = ChuyenKhoa::query()->whereKey($chuyenKhoaId)->exists();
		if (!$exists) {
			throw ValidationException::withMessages([
				'chuyen_khoa_id' => ['Chuyen khoa khong ton tai.'],
			]);
		}

		return BacSi::query()
			->select('bac_si.*')
			->join('bac_si_chuyen_khoa', 'bac_si_chuyen_khoa.bac_si_id', '=', 'bac_si.id')
			->where('bac_si_chuyen_khoa.chuyen_khoa_id', $chuyenKhoaId)
			->where('bac_si.trang_thai', 'hoat_dong')
			->when(!empty($filters['ten']), function ($query) use ($filters) {
				$query->where('bac_si.ho_ten', 'like', '%' . trim((string) $filters['ten']) . '%');
			})
			->with(['bacSiChuyenKhoas.chuyenKhoa:id,ten_chuyen_khoa'])
			->orderBy('bac_si.ho_ten')
			->paginate($pageSize);
	}

	public function getLichLamViecBacSi(int $bacSiId, array $filters): array
	{
		$bacSi = BacSi::query()->find($bacSiId);
		if ($bacSi === null) {
			throw ValidationException::withMessages([
				'bac_si_id' => ['Bac si khong ton tai.'],
			]);
		}

		$fromDate = Carbon::parse($filters['tu_ngay'] ?? now()->format('Y-m-d'))->format('Y-m-d');
		$toDate = Carbon::parse($filters['den_ngay'] ?? now()->addDays(7)->format('Y-m-d'))->format('Y-m-d');

		if ($fromDate > $toDate) {
			throw ValidationException::withMessages([
				'tu_ngay' => ['tu_ngay phai nho hon hoac bang den_ngay.'],
			]);
		}

		$schedules = LichLamViecBacSi::query()
			->with(['lichLamViec:id,ten_ca,gio_bat_dau,gio_ket_thuc,thoi_luong_kham', 'khungGioKhams'])
			->where('bac_si_id', $bacSiId)
			->where('trang_thai', 'hoat_dong')
			->whereBetween('ngay_lam_viec', [$fromDate, $toDate])
			->orderBy('ngay_lam_viec')
			->get();

		$holidays = NgayNghiLe::query()
			->whereBetween('ngay', [$fromDate, $toDate])
			->where('trang_thai', 'hoat_dong')
			->get()
			->keyBy(fn($holiday) => Carbon::parse($holiday->ngay)->format('Y-m-d'));

		$items = $schedules->map(function (LichLamViecBacSi $schedule) use ($holidays) {
			$dateKey = Carbon::parse($schedule->ngay_lam_viec)->format('Y-m-d');
			$holiday = $holidays->get($dateKey);

			return [
				'id' => $schedule->id,
				'bac_si_id' => $schedule->bac_si_id,
				'ngay_lam_viec' => $dateKey,
				'trang_thai' => $schedule->trang_thai,
				'ca_lam_viec' => [
					'id' => $schedule->lichLamViec?->id,
					'ten_ca' => $schedule->lichLamViec?->ten_ca,
					'gio_bat_dau' => $schedule->lichLamViec?->gio_bat_dau,
					'gio_ket_thuc' => $schedule->lichLamViec?->gio_ket_thuc,
					'thoi_luong_kham' => $schedule->lichLamViec?->thoi_luong_kham,
				],
				'ngay_nghi_le' => $holiday ? [
					'id' => $holiday->id,
					'ten_ngay_nghi' => $holiday->ten_ngay_nghi,
				] : null,
				'khung_gio' => $this->generateKhungGioForSchedule($schedule),
			];
		});

		return [
			'bac_si' => [
				'id' => $bacSi->id,
				'ho_ten' => $bacSi->ho_ten,
				'hoc_vi' => $bacSi->hoc_vi,
				'gioi_thieu' => $bacSi->gioi_thieu,
			],
			'tu_ngay' => $fromDate,
			'den_ngay' => $toDate,
			'items' => $items,
		];
	}

	public function getDichVus(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);

		return DichVu::query()
			->active()
			->with('chuyenKhoa:id,ten_chuyen_khoa')
			->when(!empty($filters['ten']), function ($query) use ($filters) {
				$query->where('ten_dich_vu', 'like', '%' . trim((string) $filters['ten']) . '%');
			})
			->when(!empty($filters['chuyen_khoa_id']), function ($query) use ($filters) {
				$query->where('chuyen_khoa_id', (int) $filters['chuyen_khoa_id']);
			})
			->orderBy('ten_dich_vu')
			->paginate($pageSize);
	}

	public function getGoiKhams(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);

		return GoiKham::query()
			->active()
			->with([
				'chiTietGoiKhams' => function ($query) {
					$query->with('dichVu:id,ten_dich_vu,chuyen_khoa_id')->orderBy('thu_tu_hien_thi');
				},
			])
			->when(!empty($filters['ten']), function ($query) use ($filters) {
				$query->where('ten_goi_kham', 'like', '%' . trim((string) $filters['ten']) . '%');
			})
			->when(!empty($filters['chuyen_khoa_id']), function ($query) use ($filters) {
				$query->whereHas('chiTietGoiKhams.dichVu', function ($q) use ($filters) {
					$q->where('chuyen_khoa_id', (int) $filters['chuyen_khoa_id']);
				});
			})
			->orderBy('ten_goi_kham')
			->paginate($pageSize);
	}

	public function getCauHinhHeThong(array $filters): array
	{
		$keys = collect(explode(',', (string) ($filters['khoa'] ?? '')))
			->map(fn(string $key) => trim($key))
			->filter()
			->values();

		$query = CauHinhHeThong::query()
			->select(['khoa', 'gia_tri', 'mo_ta', 'nhom'])
			->when(!empty($filters['nhom']), function ($builder) use ($filters) {
				$builder->where('nhom', (string) $filters['nhom']);
			})
			->when($keys->isNotEmpty(), function ($builder) use ($keys) {
				$builder->whereIn('khoa', $keys->all());
			})
			->orderBy('nhom')
			->orderBy('khoa');

		$items = $query->get();

		return [
			'items' => $items,
			'map' => $items->pluck('gia_tri', 'khoa'),
		];
	}

	public function createLichHen(array $payload): LichHen
	{
		$slotContext = $this->bookingValidationService->validateCreatePayload($payload);
		$nguoiTaoId = $this->resolveNguoiTaoId($payload);
		$this->validateItemsBelongToSpecialty($payload['items'], (int) $payload['chuyen_khoa_id']);

		$doctorSpecialtyLinked = BacSiChuyenKhoa::query()
			->where('bac_si_id', $payload['bac_si_id'])
			->where('chuyen_khoa_id', $payload['chuyen_khoa_id'])
			->exists();

		if (!$doctorSpecialtyLinked) {
			throw ValidationException::withMessages([
				'chuyen_khoa_id' => ['Bac si khong thuoc chuyen khoa da chon.'],
			]);
		}

		return DB::transaction(function () use ($payload, $slotContext, $nguoiTaoId) {
			$slot = $this->lockAndResolveKhungGio($payload, $slotContext);

			if ((int) $slot->lichLamViecBacSi->bac_si_id !== (int) $payload['bac_si_id']) {
				throw ValidationException::withMessages([
					'bac_si_id' => ['Khung gio khong thuoc bac si da chon.'],
				]);
			}

			if ($slot->trang_thai !== 'trong') {
				throw ValidationException::withMessages([
					'khung_gio_id' => ['Khung gio khong con trong de dat lich.'],
				]);
			}

			$lichHen = LichHen::query()->create([
				'ma_lich_hen' => $this->generateAppointmentCode(),
				'benh_nhan_id' => $payload['benh_nhan_id'],
				'bac_si_id' => $payload['bac_si_id'],
				'chuyen_khoa_id' => $payload['chuyen_khoa_id'],
				'khung_gio_id' => $slot->id,
				'ngay_hen' => $payload['ngay_hen'],
				'ly_do_kham' => $payload['ly_do_kham'],
				'ghi_chu' => $payload['ghi_chu'] ?? null,
				'nguoi_tao_id' => $nguoiTaoId,
				'trang_thai' => 'dang_cho',
			]);

			$items = collect($payload['items'])->map(function (array $item) use ($lichHen) {
				return [
					'lich_hen_id' => $lichHen->id,
					'dich_vu_id' => $item['dich_vu_id'] ?? null,
					'goi_kham_id' => $item['goi_kham_id'] ?? null,
					'so_luong' => $item['so_luong'] ?? 1,
					'ghi_chu' => $item['ghi_chu'] ?? null,
					'created_at' => now(),
					'updated_at' => now(),
				];
			})->all();

			DichVuLichHen::query()->insert($items);

			$slot->trang_thai = 'da_dat';
			$slot->save();

			return $this->getLichHenById($lichHen->id);
		});
	}

	private function validateItemsBelongToSpecialty(array $items, int $chuyenKhoaId): void
	{
		$dichVuIds = collect($items)
			->pluck('dich_vu_id')
			->filter()
			->map(fn($id) => (int) $id)
			->unique()
			->values();

		if ($dichVuIds->isNotEmpty()) {
			$invalidDichVuIds = DichVu::query()
				->whereIn('id', $dichVuIds->all())
				->where('chuyen_khoa_id', '!=', $chuyenKhoaId)
				->pluck('id');

			if ($invalidDichVuIds->isNotEmpty()) {
				throw ValidationException::withMessages([
					'items' => ['Dich vu da chon khong thuoc chuyen khoa hien tai.'],
				]);
			}
		}

		$goiKhamIds = collect($items)
			->pluck('goi_kham_id')
			->filter()
			->map(fn($id) => (int) $id)
			->unique()
			->values();

		if ($goiKhamIds->isNotEmpty()) {
			$invalidGoiKhamIds = GoiKham::query()
				->whereIn('id', $goiKhamIds->all())
				->whereDoesntHave('chiTietGoiKhams.dichVu', function ($query) use ($chuyenKhoaId) {
					$query->where('chuyen_khoa_id', $chuyenKhoaId);
				})
				->pluck('id');

			if ($invalidGoiKhamIds->isNotEmpty()) {
				throw ValidationException::withMessages([
					'items' => ['Goi kham da chon khong lien ket voi chuyen khoa hien tai.'],
				]);
			}
		}
	}

	public function getLichHensByBenhNhan(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);
		$benhNhanId = (int) ($filters['benh_nhan_id'] ?? 0);

		if ($benhNhanId <= 0 || !BenhNhan::query()->whereKey($benhNhanId)->exists()) {
			throw ValidationException::withMessages([
				'benh_nhan_id' => ['Benh nhan khong ton tai.'],
			]);
		}

		return LichHen::query()
			->with([
				'bacSi:id,ho_ten,hoc_vi',
				'chuyenKhoa:id,ten_chuyen_khoa',
				'khungGioKham:id,gio_bat_dau,gio_ket_thuc',
				'dichVuLichHens.dichVu:id,ten_dich_vu,gia_dich_vu',
				'dichVuLichHens.goiKham:id,ten_goi_kham,gia_goi_kham',
				'lyDoHuy:id,ten_ly_do',
			])
			->where('benh_nhan_id', $benhNhanId)
			->when(!empty($filters['trang_thai']), function ($query) use ($filters) {
				$query->where('trang_thai', (string) $filters['trang_thai']);
			})
			->orderByDesc('ngay_hen')
			->orderByDesc('id')
			->paginate($pageSize);
	}

	public function getLyDoHuyBenhNhan(): Collection
	{
		return LyDoHuy::query()
			->where('loai', 'benh_nhan')
			->where('trang_thai', 'hoat_dong')
			->orderBy('thu_tu')
			->orderBy('id')
			->get(['id', 'ma_ly_do', 'ten_ly_do']);
	}

	public function cancelLichHen(int $id, array $payload): LichHen
	{
		return DB::transaction(function () use ($id, $payload) {
			/** @var LichHen|null $lichHen */
			$lichHen = LichHen::query()
				->with('khungGioKham:id,gio_bat_dau,trang_thai')
				->lockForUpdate()
				->find($id);

			if ($lichHen === null) {
				throw ValidationException::withMessages([
					'id' => ['Lich hen khong ton tai.'],
				]);
			}

			$this->bookingValidationService->validateCancelPayload($lichHen);

			if (!empty($payload['ly_do_huy_id'])) {
				$validReason = LyDoHuy::query()
					->whereKey((int) $payload['ly_do_huy_id'])
					->where('loai', 'benh_nhan')
					->where('trang_thai', 'hoat_dong')
					->exists();

				if (!$validReason) {
					throw ValidationException::withMessages([
						'ly_do_huy_id' => ['Ly do huy khong hop le cho benh nhan.'],
					]);
				}
			}

			if ($lichHen->khungGioKham !== null) {
				KhungGioKham::query()
					->whereKey($lichHen->khung_gio_id)
					->lockForUpdate()
					->update(['trang_thai' => 'trong']);
			}

			$lichHen->update([
				'trang_thai' => 'da_huy',
				'ly_do_huy_id' => $payload['ly_do_huy_id'] ?? null,
				'ly_do_huy_khac' => $payload['ly_do_huy_khac'] ?? null,
			]);

			return $this->getLichHenById($lichHen->id);
		});
	}

	public function doiLichHen(int $id, array $payload): LichHen
	{
		return DB::transaction(function () use ($id, $payload) {
			/** @var LichHen|null $lichHen */
			$lichHen = LichHen::query()
				->with('khungGioKham:id,lich_lam_viec_bac_si_id,gio_bat_dau,gio_ket_thuc,trang_thai')
				->lockForUpdate()
				->find($id);

			if ($lichHen === null) {
				throw ValidationException::withMessages([
					'id' => ['Lich hen khong ton tai.'],
				]);
			}

			$doctorSpecialtyLinked = BacSiChuyenKhoa::query()
				->where('bac_si_id', $payload['bac_si_id'])
				->where('chuyen_khoa_id', $payload['chuyen_khoa_id'])
				->exists();

			if (!$doctorSpecialtyLinked) {
				throw ValidationException::withMessages([
					'bac_si_id' => ['Bac si moi khong thuoc chuyen khoa da chon.'],
				]);
			}

			$this->validateItemsBelongToSpecialty($payload['items'], (int) $payload['chuyen_khoa_id']);

			$validationPayload = [
				'benh_nhan_id' => $lichHen->benh_nhan_id,
				'bac_si_id' => (int) $payload['bac_si_id'],
				'chuyen_khoa_id' => (int) $payload['chuyen_khoa_id'],
				'ngay_hen' => $payload['ngay_hen'],
				'khung_gio_id' => $payload['khung_gio_id'] ?? null,
				'lich_lam_viec_bac_si_id' => $payload['lich_lam_viec_bac_si_id'] ?? null,
				'gio_bat_dau' => $payload['gio_bat_dau'] ?? null,
				'gio_ket_thuc' => $payload['gio_ket_thuc'] ?? null,
			];

			$slotContext = $this->bookingValidationService->validateReschedulePayload($lichHen, $validationPayload);
			$newSlot = $this->lockAndResolveKhungGio($validationPayload, $slotContext);

			if ((int) $newSlot->lichLamViecBacSi->bac_si_id !== (int) $payload['bac_si_id']) {
				throw ValidationException::withMessages([
					'bac_si_id' => ['Khung gio moi khong thuoc bac si da chon.'],
				]);
			}

			if ($newSlot->trang_thai !== 'trong' && (int) $newSlot->id !== (int) $lichHen->khung_gio_id) {
				throw ValidationException::withMessages([
					'khung_gio_id' => ['Khung gio moi khong con trong de doi lich.'],
				]);
			}

			$oldKhungGioId = $lichHen->khung_gio_id;

			$lichHen->update([
				'bac_si_id' => $payload['bac_si_id'],
				'chuyen_khoa_id' => $payload['chuyen_khoa_id'],
				'ngay_hen' => $payload['ngay_hen'],
				'khung_gio_id' => $newSlot->id,
				'ly_do_kham' => $payload['ly_do_kham'] ?? $lichHen->ly_do_kham,
				'ghi_chu' => $payload['ghi_chu'] ?? $lichHen->ghi_chu,
			]);

			DichVuLichHen::query()->where('lich_hen_id', $lichHen->id)->delete();

			$newItems = collect($payload['items'])->map(function (array $item) use ($lichHen) {
				return [
					'lich_hen_id' => $lichHen->id,
					'dich_vu_id' => $item['dich_vu_id'] ?? null,
					'goi_kham_id' => $item['goi_kham_id'] ?? null,
					'so_luong' => $item['so_luong'] ?? 1,
					'ghi_chu' => $item['ghi_chu'] ?? null,
					'created_at' => now(),
					'updated_at' => now(),
				];
			})->all();

			DichVuLichHen::query()->insert($newItems);

			KhungGioKham::query()
				->whereKey($newSlot->id)
				->lockForUpdate()
				->update(['trang_thai' => 'da_dat']);

			if (!empty($oldKhungGioId) && (int) $oldKhungGioId !== (int) $newSlot->id) {
				KhungGioKham::query()
					->whereKey($oldKhungGioId)
					->lockForUpdate()
					->update(['trang_thai' => 'trong']);
			}

			return $this->getLichHenById($lichHen->id);
		});
	}

	private function resolveNguoiTaoId(array $payload): int
	{
		if (!empty($payload['nguoi_tao_id'])) {
			return (int) $payload['nguoi_tao_id'];
		}

		if (auth()->check()) {
			return (int) auth()->id();
		}

		$nguoiDungId = BenhNhan::query()
			->whereKey($payload['benh_nhan_id'])
			->value('nguoi_dung_id');

		if (!empty($nguoiDungId)) {
			return (int) $nguoiDungId;
		}

		throw ValidationException::withMessages([
			'nguoi_tao_id' => ['Khong xac dinh duoc nguoi tao lich hen. Vui long dang nhap lai.'],
		]);
	}

	public function getLichHenById(int $id): LichHen
	{
		$lichHen = LichHen::query()
			->with([
				'benhNhan:id,ho_ten,so_dien_thoai,email,so_cccd',
				'bacSi:id,ho_ten,hoc_vi,gioi_thieu',
				'chuyenKhoa:id,ten_chuyen_khoa',
				'khungGioKham:id,lich_lam_viec_bac_si_id,gio_bat_dau,gio_ket_thuc,trang_thai',
				'dichVuLichHens.dichVu:id,ten_dich_vu,gia_dich_vu',
				'dichVuLichHens.goiKham:id,ten_goi_kham,gia_goi_kham',
				'lyDoHuy:id,ten_ly_do',
			])
			->find($id);

		if ($lichHen === null) {
			throw ValidationException::withMessages([
				'id' => ['Lich hen khong ton tai.'],
			]);
		}

		if ($lichHen->benhNhan !== null) {
			$lichHen->benhNhan->so_dien_thoai = $this->maskPhone($lichHen->benhNhan->so_dien_thoai);
			$lichHen->benhNhan->email = $this->maskEmail($lichHen->benhNhan->email);
			$lichHen->benhNhan->so_cccd = $this->maskIdentity($lichHen->benhNhan->so_cccd);
		}

		return $lichHen;
	}

	private function generateKhungGioForSchedule(LichLamViecBacSi $schedule): array
	{
		$shift = $schedule->lichLamViec;
		if ($shift === null) {
			return [];
		}

		$start = Carbon::createFromFormat('H:i:s', $shift->gio_bat_dau);
		$end = Carbon::createFromFormat('H:i:s', $shift->gio_ket_thuc);
		$duration = (int) ($shift->thoi_luong_kham ?? 0);

		if ($duration <= 0 || $start->gte($end)) {
			return [];
		}

		/** @var Collection<int, KhungGioKham> $existingSlots */
		$existingSlots = $schedule->khungGioKhams->keyBy('gio_bat_dau');

		$rows = [];
		$current = $start->copy();
		while ($current->copy()->addMinutes($duration)->lte($end)) {
			$slotStart = $current->format('H:i:s');
			$slotEnd = $current->copy()->addMinutes($duration)->format('H:i:s');
			$dbSlot = $existingSlots->get($slotStart);

			$rows[] = [
				'id' => $dbSlot?->id,
				'slot_key' => $dbSlot?->id ?? ($schedule->id . '-' . $slotStart),
				'lich_lam_viec_bac_si_id' => $schedule->id,
				'gio_bat_dau' => $slotStart,
				'gio_ket_thuc' => $slotEnd,
				'trang_thai' => $dbSlot?->trang_thai ?? 'trong',
				'exists_in_db' => $dbSlot !== null,
			];

			$current->addMinutes($duration);
		}

		return $rows;
	}

	private function lockAndResolveKhungGio(array $payload, array $slotContext): KhungGioKham
	{
		if (!empty($payload['khung_gio_id'])) {
			$slot = KhungGioKham::query()
				->with('lichLamViecBacSi:id,bac_si_id,ngay_lam_viec')
				->lockForUpdate()
				->find($payload['khung_gio_id']);

			if ($slot === null) {
				throw ValidationException::withMessages([
					'khung_gio_id' => ['Khung gio khong ton tai.'],
				]);
			}

			return $slot;
		}

		$existing = KhungGioKham::query()
			->with('lichLamViecBacSi:id,bac_si_id,ngay_lam_viec')
			->where('lich_lam_viec_bac_si_id', $slotContext['lich_lam_viec_bac_si_id'])
			->where('gio_bat_dau', $slotContext['gio_bat_dau'])
			->lockForUpdate()
			->first();

		if ($existing !== null) {
			return $existing;
		}

		$created = KhungGioKham::query()->create([
			'lich_lam_viec_bac_si_id' => $slotContext['lich_lam_viec_bac_si_id'],
			'gio_bat_dau' => $slotContext['gio_bat_dau'],
			'gio_ket_thuc' => $slotContext['gio_ket_thuc'],
			'trang_thai' => 'trong',
		]);

		$created->load('lichLamViecBacSi:id,bac_si_id,ngay_lam_viec');

		return $created;
	}

	private function generateAppointmentCode(): string
	{
		$prefix = 'LH' . now()->format('Ymd');
		$lastCode = LichHen::query()
			->where('ma_lich_hen', 'like', $prefix . '%')
			->lockForUpdate()
			->orderByDesc('ma_lich_hen')
			->value('ma_lich_hen');

		$next = $lastCode ? ((int) substr($lastCode, -3)) + 1 : 1;

		return $prefix . str_pad((string) $next, 3, '0', STR_PAD_LEFT);
	}

	private function resolvePageSize(mixed $pageSize): int
	{
		$size = (int) ($pageSize ?? self::DEFAULT_PAGE_SIZE);

		if ($size <= 0) {
			$size = self::DEFAULT_PAGE_SIZE;
		}

		return min($size, 100);
	}

	private function maskPhone(?string $phone): ?string
	{
		if (empty($phone)) {
			return $phone;
		}

		$len = strlen($phone);
		if ($len <= 4) {
			return str_repeat('*', $len);
		}

		return substr($phone, 0, 3) . str_repeat('*', max(0, $len - 5)) . substr($phone, -2);
	}

	private function maskEmail(?string $email): ?string
	{
		if (empty($email) || !str_contains($email, '@')) {
			return $email;
		}

		[$name, $domain] = explode('@', $email, 2);
		if ($name === '') {
			return '***@' . $domain;
		}

		return substr($name, 0, 1) . str_repeat('*', max(1, strlen($name) - 1)) . '@' . $domain;
	}

	private function maskIdentity(?string $identity): ?string
	{
		if (empty($identity)) {
			return $identity;
		}

		$len = strlen($identity);
		if ($len <= 4) {
			return str_repeat('*', $len);
		}

		return str_repeat('*', $len - 4) . substr($identity, -4);
	}
}
