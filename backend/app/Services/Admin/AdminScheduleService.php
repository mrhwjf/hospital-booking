<?php

namespace App\Services\Admin;

use App\Models\BacSi;
use App\Models\BacSiNghi;
use App\Models\CauHinhHeThong;
use App\Models\KhungGioKham;
use App\Models\LichHen;
use App\Models\LichLamViec;
use App\Models\LichLamViecBacSi;
use App\Models\NgayNghiLe;
use App\Models\PhongKham;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminScheduleService
{
	public const DEFAULT_PAGE_SIZE = 10;
	private const MAX_REPEAT_WEEKS = 4;
	private const LEAVE_CANCELLED_APPOINTMENT_STATUSES = ['dang_cho', 'da_thanh_toan', 'da_xac_nhan'];
	private const ASSIGNMENT_DEACTIVATION_CANCELLED_APPOINTMENT_STATUSES = ['dang_cho', 'da_thanh_toan'];
	private const HOLIDAY_CANCELLED_APPOINTMENT_STATUSES = ['dang_cho', 'da_thanh_toan'];

	public function __construct(
		private readonly AdminScheduleValidationService $validationService,
		private readonly AdminScheduleConflictCheckerService $conflictCheckerService,
	) {
	}

	public function getDoctors(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);
		$keyword = trim((string) ($filters['q'] ?? $filters['ten'] ?? ''));
		$doctorCode = trim((string) ($filters['ma_bac_si'] ?? ''));

		return BacSi::query()
			->with(['bacSiChuyenKhoas.chuyenKhoa:id,ten_chuyen_khoa'])
			->when($keyword !== '', function ($query) use ($keyword) {
				$query->where(function ($subQuery) use ($keyword) {
					$subQuery
						->where('ho_ten', 'like', '%' . $keyword . '%')
						->orWhere('ma_bac_si', 'like', '%' . $keyword . '%');
				});
			})
			->when($doctorCode !== '', function ($query) use ($doctorCode) {
				$query->where('ma_bac_si', 'like', '%' . $doctorCode . '%');
			})
			->when(!empty($filters['chuyen_khoa_id']), function ($query) use ($filters) {
				$query->whereHas('bacSiChuyenKhoas', function ($subQuery) use ($filters) {
					$subQuery->where('chuyen_khoa_id', (int) $filters['chuyen_khoa_id']);
				});
			})
			->when(!empty($filters['trang_thai']), function ($query) use ($filters) {
				$query->where('trang_thai', (string) $filters['trang_thai']);
			})
			->orderBy('ho_ten')
			->paginate($pageSize);
	}

	public function getRooms(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);

		return PhongKham::query()
			->with('chuyenKhoa:id,ten_chuyen_khoa')
			->when(!empty($filters['ten']), function ($query) use ($filters) {
				$query->where(function ($subQuery) use ($filters) {
					$keyword = trim((string) $filters['ten']);
					$subQuery
						->where('ten_phong', 'like', '%' . $keyword . '%')
						->orWhere('ma_phong', 'like', '%' . $keyword . '%');
				});
			})
			->when(!empty($filters['chuyen_khoa_id']), function ($query) use ($filters) {
				$query->where('chuyen_khoa_id', (int) $filters['chuyen_khoa_id']);
			})
			->when(!empty($filters['trang_thai']), function ($query) use ($filters) {
				$query->where('trang_thai', (string) $filters['trang_thai']);
			})
			->orderBy('ten_phong')
			->paginate($pageSize);
	}

	public function getTemplates(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);

		return LichLamViec::query()
			->when(!empty($filters['ten_ca']), function ($query) use ($filters) {
				$query->where('ten_ca', 'like', '%' . trim((string) $filters['ten_ca']) . '%');
			})
			->when(!empty($filters['thu_trong_tuan']), function ($query) use ($filters) {
				$query->where('thu_trong_tuan', (int) $filters['thu_trong_tuan']);
			})
			->when(!empty($filters['trang_thai']), function ($query) use ($filters) {
				$query->where('trang_thai', (string) $filters['trang_thai']);
			})
			->orderBy('thu_trong_tuan')
			->orderBy('gio_bat_dau')
			->paginate($pageSize);
	}

	public function getDoctorScheduleOverview(int $doctorId, array $filters): array
	{
		$doctor = BacSi::query()->find($doctorId);
		if ($doctor === null) {
			throw ValidationException::withMessages([
				'bac_si_id' => ['Bác sĩ không tồn tại.'],
			]);
		}

		[$fromDate, $toDate] = $this->resolveDateRange(
			$filters,
			now()->startOfWeek(Carbon::MONDAY)->format('Y-m-d'),
			now()->endOfWeek(Carbon::SUNDAY)->format('Y-m-d'),
		);

		$assignments = LichLamViecBacSi::query()
			->with([
				'lichLamViec:id,ma_ca,ten_ca,thu_trong_tuan,gio_bat_dau,gio_ket_thuc,thoi_luong_kham,trang_thai',
				'phongKham:id,ma_phong,ten_phong,trang_thai',
			])
			->where('bac_si_id', $doctorId)
			->whereBetween('ngay_lam_viec', [$fromDate, $toDate])
			->orderBy('ngay_lam_viec')
			->orderBy('id')
			->get();

		$holidays = NgayNghiLe::query()
			->whereBetween('ngay', [$fromDate, $toDate])
			->where('trang_thai', 'hoat_dong')
			->orderBy('ngay')
			->get();

		$leaves = BacSiNghi::query()
			->where('bac_si_id', $doctorId)
			->whereBetween('ngay', [$fromDate, $toDate])
			->where('trang_thai', 'hoat_dong')
			->orderBy('ngay')
			->orderBy('gio_bat_dau')
			->get();

		return [
			'bac_si' => [
				'id' => $doctor->id,
				'ma_bac_si' => $doctor->ma_bac_si,
				'ho_ten' => $doctor->ho_ten,
				'hoc_vi' => $doctor->hoc_vi,
				'trang_thai' => $doctor->trang_thai,
			],
			'tu_ngay' => $fromDate,
			'den_ngay' => $toDate,
			'items' => $assignments,
			'ngay_nghi_bac_si' => $leaves,
			'ngay_nghi_le' => $holidays,
		];
	}

	public function getAssignedSchedules(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);

		[$fromDate, $toDate] = $this->resolveDateRange(
			$filters,
			now()->startOfWeek(Carbon::MONDAY)->format('Y-m-d'),
			now()->addWeeks(4)->endOfWeek(Carbon::SUNDAY)->format('Y-m-d'),
		);

		return LichLamViecBacSi::query()
			->with([
				'bacSi:id,ma_bac_si,ho_ten,hoc_vi,trang_thai',
				'lichLamViec:id,ma_ca,ten_ca,thu_trong_tuan,gio_bat_dau,gio_ket_thuc,thoi_luong_kham,trang_thai',
				'phongKham:id,ma_phong,ten_phong,trang_thai',
			])
			->whereBetween('ngay_lam_viec', [$fromDate, $toDate])
			->when(!empty($filters['bac_si_id']), function ($query) use ($filters) {
				$query->where('bac_si_id', (int) $filters['bac_si_id']);
			})
			->when(!empty($filters['trang_thai']), function ($query) use ($filters) {
				$query->where('trang_thai', (string) $filters['trang_thai']);
			})
			->orderBy('ngay_lam_viec')
			->orderBy('id')
			->paginate($pageSize);
	}

	public function createTemplate(array $payload): LichLamViec
	{
		$this->validationService->validateShiftTimeWindow($payload['gio_bat_dau'], $payload['gio_ket_thuc']);
		$maCa = $this->generateShiftCode(
			$payload['gio_bat_dau'],
			$payload['gio_ket_thuc'],
			(int) $payload['thu_trong_tuan'],
		);

		return LichLamViec::query()->create([
			'ma_ca' => $maCa,
			'ten_ca' => $payload['ten_ca'],
			'thu_trong_tuan' => $payload['thu_trong_tuan'],
			'gio_bat_dau' => $payload['gio_bat_dau'],
			'gio_ket_thuc' => $payload['gio_ket_thuc'],
			'thoi_luong_kham' => $payload['thoi_luong_kham'],
			'ghi_chu' => $payload['ghi_chu'] ?? null,
			'trang_thai' => $payload['trang_thai'] ?? 'hoat_dong',
		]);
	}

	public function updateTemplate(int $id, array $payload): LichLamViec
	{
		$template = $this->getTemplateById($id);

		$data = [];
		$fillable = [
			'ten_ca',
			'thu_trong_tuan',
			'gio_bat_dau',
			'gio_ket_thuc',
			'thoi_luong_kham',
			'ghi_chu',
			'trang_thai',
		];

		foreach ($fillable as $field) {
			if (array_key_exists($field, $payload)) {
				$data[$field] = $payload[$field];
			}
		}

		$gioBatDau = $data['gio_bat_dau'] ?? $template->gio_bat_dau;
		$gioKetThuc = $data['gio_ket_thuc'] ?? $template->gio_ket_thuc;
		$this->validationService->validateShiftTimeWindow((string) $gioBatDau, (string) $gioKetThuc);

		$template->update($data);

		return $template->refresh();
	}

	public function softDeleteTemplate(int $id): LichLamViec
	{
		$template = $this->getTemplateById($id);
		$template->update(['trang_thai' => 'huy']);

		return $template->refresh();
	}

	public function previewAssignments(array $payload): array
	{
		$doctor = BacSi::query()->find($payload['bac_si_id']);
		if ($doctor === null) {
			throw ValidationException::withMessages([
				'bac_si_id' => ['Bác sĩ không tồn tại.'],
			]);
		}

		$repeatWeeks = min(max((int) ($payload['so_tuan_lap'] ?? 1), 1), self::MAX_REPEAT_WEEKS);
		$candidates = $this->buildAssignmentCandidates($payload, $repeatWeeks);
		$analysis = $this->evaluateAssignmentCandidates(
			(int) $payload['bac_si_id'],
			(string) $doctor->ho_ten,
			$candidates,
			$repeatWeeks,
		);

		return $analysis;
	}

	public function createAssignments(array $payload): array
	{
		$analysis = $this->previewAssignments($payload);
		if (!empty($analysis['blocking_conflicts'])) {
			return [
				'saved' => false,
				...$analysis,
			];
		}

		$createdIds = [];
		$runtimeSkipped = [];

		DB::transaction(function () use ($payload, $analysis, &$createdIds, &$runtimeSkipped) {
			foreach ($analysis['preview_items'] as $item) {
				if (($item['trang_thai_du_kien'] ?? null) !== 'se_tao') {
					continue;
				}

				$unique = [
					'bac_si_id' => (int) $payload['bac_si_id'],
					'ngay_lam_viec' => $item['ngay_lam_viec'],
					'lich_lam_viec_id' => (int) $item['lich_lam_viec_id'],
				];

				$existing = LichLamViecBacSi::query()
					->where($unique)
					->lockForUpdate()
					->first();

				if ($existing !== null && $existing->trang_thai === 'hoat_dong') {
					$runtimeSkipped[] = [
						'candidate_key' => $item['candidate_key'],
						'ngay_lam_viec' => $item['ngay_lam_viec'],
						'ly_do' => 'existing_schedule',
						'thong_diep' => 'Ca làm việc đã được gán trong lúc lưu dữ liệu.',
					];
					continue;
				}

				if ($existing !== null) {
					$existing->update([
						'phong_kham_id' => $item['phong_kham_id'] ?? null,
						'ghi_chu' => $item['ghi_chu'] ?? null,
						'trang_thai' => 'hoat_dong',
					]);

					$createdIds[] = $existing->id;
					continue;
				}

				$created = LichLamViecBacSi::query()->create([
					'bac_si_id' => (int) $payload['bac_si_id'],
					'lich_lam_viec_id' => (int) $item['lich_lam_viec_id'],
					'phong_kham_id' => $item['phong_kham_id'] ?? null,
					'ngay_lam_viec' => $item['ngay_lam_viec'],
					'ghi_chu' => $item['ghi_chu'] ?? null,
					'trang_thai' => 'hoat_dong',
				]);

				$createdIds[] = $created->id;
			}
		});

		$createdItems = empty($createdIds)
			? collect()
			: LichLamViecBacSi::query()
				->with([
					'bacSi:id,ma_bac_si,ho_ten,hoc_vi,trang_thai',
					'lichLamViec:id,ma_ca,ten_ca,thu_trong_tuan,gio_bat_dau,gio_ket_thuc,thoi_luong_kham,trang_thai',
					'phongKham:id,ma_phong,ten_phong,trang_thai',
				])
				->whereIn('id', $createdIds)
				->orderBy('ngay_lam_viec')
				->orderBy('id')
				->get();

		$skippedCount = $analysis['summary']['shifts_skipped'] + count($runtimeSkipped);

		return [
			'saved' => true,
			'created_count' => count($createdIds),
			'skipped_count' => $skippedCount,
			'blocking_conflicts' => [],
			'warnings' => [
				...$analysis['warnings'],
				...$runtimeSkipped,
			],
			'summary' => [
				...$analysis['summary'],
				'shifts_created' => count($createdIds),
				'shifts_skipped' => $skippedCount,
			],
			'created_items' => $createdItems,
		];
	}

	public function updateAssignment(int $id, array $payload): LichLamViecBacSi
	{
		return DB::transaction(function () use ($id, $payload) {
			$assignment = LichLamViecBacSi::query()
				->with('lichLamViec:id,gio_bat_dau,gio_ket_thuc,trang_thai')
				->lockForUpdate()
				->find($id);

			if ($assignment === null) {
				throw ValidationException::withMessages([
					'id' => ['Ca làm việc bác sĩ không tồn tại.'],
				]);
			}

			$newRoomId = array_key_exists('phong_kham_id', $payload)
				? ($payload['phong_kham_id'] ?: null)
				: $assignment->phong_kham_id;
			$nextStatus = array_key_exists('trang_thai', $payload)
				? (string) $payload['trang_thai']
				: (string) $assignment->trang_thai;
			$isDeactivatingAssignment = $assignment->trang_thai === 'hoat_dong'
				&& in_array($nextStatus, ['tam_ngung', 'huy'], true);

			if ($nextStatus === 'hoat_dong' && $assignment->lichLamViec?->trang_thai !== 'hoat_dong') {
				throw ValidationException::withMessages([
					'trang_thai' => ['Không thể kích hoạt ca vì mẫu ca làm việc đang tạm ngưng hoặc đã hủy.'],
				]);
			}

			$appointmentsToCancel = collect();
			if ($isDeactivatingAssignment) {
				$appointmentsToCancel = $this->getAppointmentsAffectedByAssignmentDeactivation((int) $assignment->id);
				$this->validationService->assertAssignmentCancellationConfirmed($payload, $appointmentsToCancel);
			}

			if ($newRoomId !== null && $nextStatus === 'hoat_dong') {
				$this->conflictCheckerService->assertRoomConflictFree(
					(int) $newRoomId,
					Carbon::parse($assignment->ngay_lam_viec)->format('Y-m-d'),
					(string) $assignment->lichLamViec?->gio_bat_dau,
					(string) $assignment->lichLamViec?->gio_ket_thuc,
					$assignment->id,
				);
			}

			$data = [];
			if (array_key_exists('phong_kham_id', $payload)) {
				$data['phong_kham_id'] = $newRoomId;
			}
			if (array_key_exists('ghi_chu', $payload)) {
				$data['ghi_chu'] = $payload['ghi_chu'];
			}
			if (array_key_exists('trang_thai', $payload)) {
				$data['trang_thai'] = $nextStatus;
			}

			$assignment->update($data);

			$cancellationSummary = null;
			if ($isDeactivatingAssignment) {
				$cancellationSummary = $this->cancelAppointmentsForAssignmentDeactivation($appointmentsToCancel, $assignment);
			}

			$assignment = $assignment->refresh()->load([
				'bacSi:id,ma_bac_si,ho_ten,hoc_vi,trang_thai',
				'lichLamViec:id,ma_ca,ten_ca,thu_trong_tuan,gio_bat_dau,gio_ket_thuc,thoi_luong_kham,trang_thai',
				'phongKham:id,ma_phong,ten_phong,trang_thai',
			]);

			if ($cancellationSummary !== null) {
				$assignment->setAttribute('thong_tin_huy_lich_hen', $cancellationSummary);
			}

			return $assignment;
		});
	}

	public function softDeleteAssignment(int $id): LichLamViecBacSi
	{
		$assignment = LichLamViecBacSi::query()->find($id);
		if ($assignment === null) {
			throw ValidationException::withMessages([
				'id' => ['Ca làm việc bác sĩ không tồn tại.'],
			]);
		}

		$assignment->update(['trang_thai' => 'huy']);

		return $assignment->refresh()->load([
			'bacSi:id,ma_bac_si,ho_ten,hoc_vi,trang_thai',
			'lichLamViec:id,ma_ca,ten_ca,thu_trong_tuan,gio_bat_dau,gio_ket_thuc,thoi_luong_kham,trang_thai',
			'phongKham:id,ma_phong,ten_phong,trang_thai',
		]);
	}

	public function getDoctorLeaves(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);
		[$fromDate, $toDate] = $this->resolveDateRange(
			$filters,
			now()->startOfMonth()->format('Y-m-d'),
			now()->endOfMonth()->format('Y-m-d'),
		);

		return BacSiNghi::query()
			->with('bacSi:id,ma_bac_si,ho_ten,hoc_vi,trang_thai')
			->whereBetween('ngay', [$fromDate, $toDate])
			->when(!empty($filters['bac_si_id']), function ($query) use ($filters) {
				$query->where('bac_si_id', (int) $filters['bac_si_id']);
			})
			->when(!empty($filters['trang_thai']), function ($query) use ($filters) {
				$query->where('trang_thai', (string) $filters['trang_thai']);
			})
			->orderBy('ngay')
			->orderBy('gio_bat_dau')
			->paginate($pageSize);
	}

	public function createDoctorLeave(array $payload): BacSiNghi
	{
		$this->validationService->assertDateIsTodayOrFuture($payload['ngay'], 'ngay', 'Ngày nghỉ bác sĩ');

		return DB::transaction(function () use ($payload) {
			$this->validationService->assertLeaveBusinessRules(
				(int) $payload['bac_si_id'],
				$payload['ngay'],
				$payload['gio_bat_dau'] ?? null,
				$payload['gio_ket_thuc'] ?? null,
				null,
			);

			$appointments = $this->getAppointmentsAffectedByLeave(
				(int) $payload['bac_si_id'],
				$payload['ngay'],
				$payload['gio_bat_dau'] ?? null,
				$payload['gio_ket_thuc'] ?? null,
			);

			$this->validationService->assertLeaveCancellationConfirmed($payload, $appointments);

			$leave = BacSiNghi::query()->create([
				'bac_si_id' => (int) $payload['bac_si_id'],
				'ngay' => $payload['ngay'],
				'gio_bat_dau' => $payload['gio_bat_dau'] ?? null,
				'gio_ket_thuc' => $payload['gio_ket_thuc'] ?? null,
				'ly_do' => $payload['ly_do'] ?? null,
				'trang_thai' => $payload['trang_thai'] ?? 'hoat_dong',
			]);

			$summary = $this->cancelAppointmentsForLeave($appointments, (int) $payload['bac_si_id'], $payload['ngay']);
			$leave->setAttribute('thong_tin_huy_lich_hen', $summary);

			return $leave->load('bacSi:id,ma_bac_si,ho_ten,hoc_vi,trang_thai');
		});
	}

	public function updateDoctorLeave(int $id, array $payload): BacSiNghi
	{
		return DB::transaction(function () use ($id, $payload) {
			$leave = BacSiNghi::query()->lockForUpdate()->find($id);
			if ($leave === null) {
				throw ValidationException::withMessages([
					'id' => ['Bản ghi nghỉ bác sĩ không tồn tại.'],
				]);
			}

			$doctorId = (int) ($payload['bac_si_id'] ?? $leave->bac_si_id);
			$ngay = $payload['ngay'] ?? Carbon::parse($leave->ngay)->format('Y-m-d');
			$gioBatDau = array_key_exists('gio_bat_dau', $payload) ? $payload['gio_bat_dau'] : $leave->gio_bat_dau;
			$gioKetThuc = array_key_exists('gio_ket_thuc', $payload) ? $payload['gio_ket_thuc'] : $leave->gio_ket_thuc;

			if (array_key_exists('ngay', $payload)) {
				$this->validationService->assertDateIsTodayOrFuture($ngay, 'ngay', 'Ngày nghỉ bác sĩ');
			}

			$this->validationService->assertLeaveBusinessRules($doctorId, $ngay, $gioBatDau, $gioKetThuc, $leave->id);

			$appointments = $this->getAppointmentsAffectedByLeave($doctorId, $ngay, $gioBatDau, $gioKetThuc);
			$this->validationService->assertLeaveCancellationConfirmed($payload, $appointments);

			$data = [];
			$fillable = ['bac_si_id', 'ngay', 'gio_bat_dau', 'gio_ket_thuc', 'ly_do', 'trang_thai'];
			foreach ($fillable as $field) {
				if (array_key_exists($field, $payload)) {
					$data[$field] = $payload[$field];
				}
			}

			$leave->update($data);

			$summary = $this->cancelAppointmentsForLeave($appointments, $doctorId, $ngay);
			$leave->setAttribute('thong_tin_huy_lich_hen', $summary);

			return $leave->refresh()->load('bacSi:id,ma_bac_si,ho_ten,hoc_vi,trang_thai');
		});
	}

	public function softDeleteDoctorLeave(int $id): BacSiNghi
	{
		$leave = BacSiNghi::query()->find($id);
		if ($leave === null) {
			throw ValidationException::withMessages([
				'id' => ['Bản ghi nghỉ bác sĩ không tồn tại.'],
			]);
		}

		$leave->update(['trang_thai' => 'huy']);

		return $leave->refresh()->load('bacSi:id,ma_bac_si,ho_ten,hoc_vi,trang_thai');
	}

	public function getHolidays(array $filters): LengthAwarePaginator
	{
		$pageSize = $this->resolvePageSize($filters['pageSize'] ?? null);
		[$fromDate, $toDate] = $this->resolveDateRange(
			$filters,
			now()->startOfYear()->format('Y-m-d'),
			now()->endOfYear()->format('Y-m-d'),
		);

		return NgayNghiLe::query()
			->whereBetween('ngay', [$fromDate, $toDate])
			->when(!empty($filters['ten']), function ($query) use ($filters) {
				$query->where('ten_ngay_nghi', 'like', '%' . trim((string) $filters['ten']) . '%');
			})
			->when(!empty($filters['trang_thai']), function ($query) use ($filters) {
				$query->where('trang_thai', (string) $filters['trang_thai']);
			})
			->orderBy('ngay')
			->paginate($pageSize);
	}

	public function createHoliday(array $payload): NgayNghiLe
	{
		$this->validationService->assertDateIsTodayOrFuture($payload['ngay'], 'ngay', 'Ngày nghỉ lễ');
		$this->validationService->assertHolidayDateUnique($payload['ngay'], null);

		return DB::transaction(function () use ($payload) {
			$nextStatus = (string) ($payload['trang_thai'] ?? 'hoat_dong');
			$appointments = collect();

			if ($nextStatus === 'hoat_dong') {
				$appointments = $this->getAppointmentsAffectedByHoliday($payload['ngay']);
				$this->validationService->assertHolidayCancellationConfirmed($payload, $appointments);
			}

			$holiday = NgayNghiLe::query()->create([
				'ten_ngay_nghi' => $payload['ten_ngay_nghi'],
				'ngay' => $payload['ngay'],
				'mo_ta' => $payload['mo_ta'] ?? null,
				'trang_thai' => $nextStatus,
			]);

			if ($nextStatus === 'hoat_dong') {
				$summary = $this->cancelAppointmentsForHoliday($appointments, $payload['ngay'], $payload['ten_ngay_nghi']);
				$holiday->setAttribute('thong_tin_huy_lich_hen', $summary);
			}

			return $holiday;
		});
	}

	public function updateHoliday(int $id, array $payload): NgayNghiLe
	{
		return DB::transaction(function () use ($id, $payload) {
			$holiday = NgayNghiLe::query()->lockForUpdate()->find($id);
			if ($holiday === null) {
				throw ValidationException::withMessages([
					'id' => ['Ngày nghỉ lễ không tồn tại.'],
				]);
			}

			$nextDate = $payload['ngay'] ?? Carbon::parse($holiday->ngay)->format('Y-m-d');
			if (array_key_exists('ngay', $payload)) {
				$this->validationService->assertDateIsTodayOrFuture($nextDate, 'ngay', 'Ngày nghỉ lễ');
			}
			$this->validationService->assertHolidayDateUnique($nextDate, $holiday->id);

			$nextStatus = (string) ($payload['trang_thai'] ?? $holiday->trang_thai);
			$appointments = collect();
			$cancellationSummary = null;
			if ($nextStatus === 'hoat_dong') {
				$appointments = $this->getAppointmentsAffectedByHoliday($nextDate);
				$this->validationService->assertHolidayCancellationConfirmed($payload, $appointments);
			}

			$data = [];
			$fillable = ['ten_ngay_nghi', 'ngay', 'mo_ta', 'trang_thai'];
			foreach ($fillable as $field) {
				if (array_key_exists($field, $payload)) {
					$data[$field] = $payload[$field];
				}
			}

			$holiday->update($data);

			if ($nextStatus === 'hoat_dong') {
				$holidayName = $data['ten_ngay_nghi'] ?? $holiday->ten_ngay_nghi;
				$cancellationSummary = $this->cancelAppointmentsForHoliday($appointments, $nextDate, (string) $holidayName);
			}

			$holiday = $holiday->refresh();
			if ($cancellationSummary !== null) {
				$holiday->setAttribute('thong_tin_huy_lich_hen', $cancellationSummary);
			}

			return $holiday;
		});
	}

	public function softDeleteHoliday(int $id): NgayNghiLe
	{
		$holiday = NgayNghiLe::query()->find($id);
		if ($holiday === null) {
			throw ValidationException::withMessages([
				'id' => ['Ngày nghỉ lễ không tồn tại.'],
			]);
		}

		$holiday->update(['trang_thai' => 'huy']);

		return $holiday->refresh();
	}

	private function buildAssignmentCandidates(array $payload, int $repeatWeeks): array
	{
		$weekStart = Carbon::parse($payload['tuan_bat_dau'])->startOfWeek(Carbon::MONDAY);
		$templateIds = collect($payload['mau_ca'])
			->pluck('lich_lam_viec_id')
			->map(fn($id) => (int) $id)
			->unique()
			->values();

		/** @var Collection<int, LichLamViec> $templates */
		$templates = LichLamViec::query()
			->whereIn('id', $templateIds->all())
			->get()
			->keyBy('id');

		if ($templates->count() !== $templateIds->count()) {
			throw ValidationException::withMessages([
				'mau_ca' => ['Một hoặc nhiều mẫu ca không tồn tại.'],
			]);
		}

		$candidates = [];
		foreach (range(0, $repeatWeeks - 1) as $weekIndex) {
			foreach ($payload['mau_ca'] as $itemIndex => $selected) {
				$template = $templates->get((int) $selected['lich_lam_viec_id']);
				if ($template === null) {
					continue;
				}

				$targetDate = $weekStart
					->copy()
					->addWeeks($weekIndex)
					->addDays(((int) $template->thu_trong_tuan) - 1)
					->format('Y-m-d');

				$candidates[] = [
					'candidate_key' => sprintf(
						'%d-%d-%d-%s',
						$weekIndex + 1,
						$itemIndex + 1,
						(int) $template->id,
						$targetDate,
					),
					'week_index' => $weekIndex + 1,
					'ngay_lam_viec' => $targetDate,
					'lich_lam_viec_id' => (int) $template->id,
					'ten_ca' => $template->ten_ca,
					'thu_trong_tuan' => (int) $template->thu_trong_tuan,
					'gio_bat_dau' => (string) $template->gio_bat_dau,
					'gio_ket_thuc' => (string) $template->gio_ket_thuc,
					'phong_kham_id' => $selected['phong_kham_id'] ?? null,
					'ghi_chu' => $selected['ghi_chu'] ?? null,
				];
			}
		}

		usort($candidates, function (array $left, array $right) {
			return strcmp(
				$left['ngay_lam_viec'] . ' ' . $left['gio_bat_dau'] . ' ' . $left['candidate_key'],
				$right['ngay_lam_viec'] . ' ' . $right['gio_bat_dau'] . ' ' . $right['candidate_key'],
			);
		});

		return $candidates;
	}

	private function evaluateAssignmentCandidates(int $doctorId, string $doctorName, array $candidates, int $repeatWeeks): array
	{
		if (empty($candidates)) {
			return [
				'preview_items' => [],
				'blocking_conflicts' => [],
				'warnings' => [],
				'summary' => [
					'total_weeks_applied' => $repeatWeeks,
					'total_candidates' => 0,
					'shifts_creatable' => 0,
					'shifts_skipped' => 0,
					'shifts_blocked' => 0,
					'skipped_breakdown' => [
						'doctor_leave' => 0,
						'holiday' => 0,
						'existing_schedule' => 0,
					],
				],
			];
		}

		$dateValues = collect($candidates)->pluck('ngay_lam_viec');
		$fromDate = (string) $dateValues->min();
		$toDate = (string) $dateValues->max();

		$holidaysByDate = NgayNghiLe::query()
			->whereBetween('ngay', [$fromDate, $toDate])
			->where('trang_thai', 'hoat_dong')
			->get()
			->keyBy(fn(NgayNghiLe $holiday) => Carbon::parse($holiday->ngay)->format('Y-m-d'));

		$leavesByDate = BacSiNghi::query()
			->where('bac_si_id', $doctorId)
			->whereBetween('ngay', [$fromDate, $toDate])
			->where('trang_thai', 'hoat_dong')
			->get()
			->groupBy(fn(BacSiNghi $leave) => Carbon::parse($leave->ngay)->format('Y-m-d'));

		$doctorAssignmentsByDate = LichLamViecBacSi::query()
			->with([
				'lichLamViec:id,ten_ca,gio_bat_dau,gio_ket_thuc',
				'phongKham:id,ma_phong,ten_phong',
			])
			->where('bac_si_id', $doctorId)
			->whereBetween('ngay_lam_viec', [$fromDate, $toDate])
			->whereIn('trang_thai', ['hoat_dong', 'tam_ngung'])
			->get()
			->groupBy(fn(LichLamViecBacSi $assignment) => Carbon::parse($assignment->ngay_lam_viec)->format('Y-m-d'));

		$roomIds = collect($candidates)
			->pluck('phong_kham_id')
			->filter()
			->map(fn($id) => (int) $id)
			->unique()
			->values();

		$roomAssignmentsByDateAndRoom = collect();
		$roomInfoMap = collect();
		if ($roomIds->isNotEmpty()) {
			$roomInfoMap = PhongKham::query()
				->whereIn('id', $roomIds->all())
				->get(['id', 'ma_phong', 'ten_phong'])
				->keyBy('id');

			$roomAssignmentsByDateAndRoom = LichLamViecBacSi::query()
				->with(['lichLamViec:id,ten_ca,gio_bat_dau,gio_ket_thuc', 'bacSi:id,ho_ten'])
				->whereIn('phong_kham_id', $roomIds->all())
				->whereBetween('ngay_lam_viec', [$fromDate, $toDate])
				->whereIn('trang_thai', ['hoat_dong', 'tam_ngung'])
				->get()
				->groupBy(function (LichLamViecBacSi $assignment) {
					$dateKey = Carbon::parse($assignment->ngay_lam_viec)->format('Y-m-d');
					return $dateKey . '|' . (int) $assignment->phong_kham_id;
				});
		}

		$previewItems = [];
		$blockingConflicts = [];
		$warnings = [];
		$plannedByDate = [];
		$creatableCount = 0;
		$skippedReasonCount = [
			'doctor_leave' => 0,
			'holiday' => 0,
			'existing_schedule' => 0,
		];

		foreach ($candidates as $candidate) {
			$dateKey = $candidate['ngay_lam_viec'];
			$start = $candidate['gio_bat_dau'];
			$end = $candidate['gio_ket_thuc'];
			$roomId = $candidate['phong_kham_id'] ? (int) $candidate['phong_kham_id'] : null;

			$plannedStatus = 'se_tao';
			$reason = null;
			$message = null;
			$conflictDetail = null;

			$holiday = $holidaysByDate->get($dateKey);
			if ($holiday !== null) {
				$plannedStatus = 'bo_qua';
				$reason = 'holiday';
				$message = 'Ngày làm việc trùng ngày nghỉ lễ, hệ thống sẽ bỏ qua.';
			}

			$leavesInDate = $leavesByDate->get($dateKey, collect());
			if ($plannedStatus === 'se_tao' && $this->conflictCheckerService->hasLeaveOverlap($leavesInDate, $start, $end)) {
				$plannedStatus = 'bo_qua';
				$reason = 'doctor_leave';
				$message = 'Bác sĩ có lịch nghỉ trong khung thời gian này, hệ thống sẽ bỏ qua.';
			}

			$assignmentsInDate = $doctorAssignmentsByDate->get($dateKey, collect());
			$existingExact = $assignmentsInDate->first(function (LichLamViecBacSi $assignment) use ($candidate) {
				return (int) $assignment->lich_lam_viec_id === (int) $candidate['lich_lam_viec_id']
					&& in_array($assignment->trang_thai, ['hoat_dong', 'tam_ngung'], true);
			});

			if ($plannedStatus === 'se_tao' && $existingExact !== null) {
				$plannedStatus = 'bo_qua';
				$reason = 'existing_schedule';
				$message = 'Ca làm việc đã tồn tại cho bác sĩ trong ngày này, hệ thống sẽ bỏ qua.';
			}

			if ($plannedStatus === 'se_tao') {
				$doctorOverlap = $assignmentsInDate->first(function (LichLamViecBacSi $assignment) use ($existingExact, $start, $end) {
					if ($assignment->trang_thai !== 'hoat_dong' || $assignment->lichLamViec === null) {
						return false;
					}

					if ($existingExact !== null && (int) $assignment->id === (int) $existingExact->id) {
						return false;
					}

					return $this->conflictCheckerService->timesOverlap(
						$start,
						$end,
						(string) $assignment->lichLamViec->gio_bat_dau,
						(string) $assignment->lichLamViec->gio_ket_thuc,
					);
				});

				if ($doctorOverlap !== null) {
					$plannedStatus = 'chan';
					$reason = 'overlap_shift';
					$message = 'Ca làm việc bị chồng chéo với lịch hiện có của bác sĩ.';
					$conflictDetail = [
						'bac_si_xung_dot' => [
							[
								'id' => $doctorId,
								'ho_ten' => $doctorName,
							]
						],
						'phong_kham_xung_dot' => $doctorOverlap->phongKham ? [
							[
								'id' => $doctorOverlap->phongKham->id,
								'ma_phong' => $doctorOverlap->phongKham->ma_phong,
								'ten_phong' => $doctorOverlap->phongKham->ten_phong,
							]
						] : [],
						'ca_xung_dot' => [
							[
								'loai' => 'lich_hien_co',
								'id' => $doctorOverlap->id,
								'ten_ca' => $doctorOverlap->lichLamViec?->ten_ca,
								'gio_bat_dau' => $doctorOverlap->lichLamViec?->gio_bat_dau,
								'gio_ket_thuc' => $doctorOverlap->lichLamViec?->gio_ket_thuc,
							]
						],
					];
					$blockingConflicts[] = [
						'candidate_key' => $candidate['candidate_key'],
						'ngay_lam_viec' => $dateKey,
						'khung_gio' => [
							'gio_bat_dau' => $start,
							'gio_ket_thuc' => $end,
						],
						'loai' => 'overlap_shift',
						'thong_diep' => $message,
						...$conflictDetail,
					];
				}
			}

			if ($plannedStatus === 'se_tao' && $roomId !== null) {
				$roomKey = $dateKey . '|' . $roomId;
				$roomAssignments = $roomAssignmentsByDateAndRoom->get($roomKey, collect());
				$roomOverlap = $roomAssignments->first(function (LichLamViecBacSi $assignment) use ($start, $end) {
					if ($assignment->trang_thai !== 'hoat_dong' || $assignment->lichLamViec === null) {
						return false;
					}

					return $this->conflictCheckerService->timesOverlap(
						$start,
						$end,
						(string) $assignment->lichLamViec->gio_bat_dau,
						(string) $assignment->lichLamViec->gio_ket_thuc,
					);
				});

				if ($roomOverlap !== null) {
					$plannedStatus = 'chan';
					$reason = 'room_conflict';
					$message = 'Phòng khám bị trùng với ca làm việc khác trong cùng khung giờ.';
					$selectedRoom = $roomInfoMap->get($roomId);
					$conflictDetail = [
						'bac_si_xung_dot' => [
							[
								'id' => $roomOverlap->bacSi?->id,
								'ho_ten' => $roomOverlap->bacSi?->ho_ten,
							]
						],
						'phong_kham_xung_dot' => [
							[
								'id' => $selectedRoom?->id,
								'ma_phong' => $selectedRoom?->ma_phong,
								'ten_phong' => $selectedRoom?->ten_phong,
							]
						],
						'ca_xung_dot' => [
							[
								'loai' => 'lich_hien_co',
								'id' => $roomOverlap->id,
								'ten_ca' => $roomOverlap->lichLamViec?->ten_ca,
								'gio_bat_dau' => $roomOverlap->lichLamViec?->gio_bat_dau,
								'gio_ket_thuc' => $roomOverlap->lichLamViec?->gio_ket_thuc,
							]
						],
					];
					$blockingConflicts[] = [
						'candidate_key' => $candidate['candidate_key'],
						'ngay_lam_viec' => $dateKey,
						'khung_gio' => [
							'gio_bat_dau' => $start,
							'gio_ket_thuc' => $end,
						],
						'loai' => 'room_conflict',
						'thong_diep' => $message,
						...$conflictDetail,
					];
				}
			}

			if ($plannedStatus === 'se_tao') {
				$plannedInDate = $plannedByDate[$dateKey] ?? [];
				foreach ($plannedInDate as $planned) {
					if ($this->conflictCheckerService->timesOverlap($start, $end, $planned['gio_bat_dau'], $planned['gio_ket_thuc'])) {
						$plannedStatus = 'chan';
						$reason = 'overlap_shift';
						$message = 'Ca làm việc bị chồng chéo với ca đã chọn trong cùng đợt gán.';
						$conflictDetail = [
							'bac_si_xung_dot' => [
								[
									'id' => $doctorId,
									'ho_ten' => $doctorName,
								]
							],
							'phong_kham_xung_dot' => $planned['phong_kham'] ? [$planned['phong_kham']] : [],
							'ca_xung_dot' => [
								[
									'loai' => 'trong_dot_gan',
									'candidate_key' => $planned['candidate_key'],
									'ten_ca' => $planned['ten_ca'],
									'gio_bat_dau' => $planned['gio_bat_dau'],
									'gio_ket_thuc' => $planned['gio_ket_thuc'],
								]
							],
						];
						$blockingConflicts[] = [
							'candidate_key' => $candidate['candidate_key'],
							'ngay_lam_viec' => $dateKey,
							'khung_gio' => [
								'gio_bat_dau' => $start,
								'gio_ket_thuc' => $end,
							],
							'loai' => 'overlap_shift',
							'thong_diep' => $message,
							...$conflictDetail,
						];
						break;
					}
				}

				if ($plannedStatus === 'se_tao' && $roomId !== null) {
					foreach ($plannedInDate as $planned) {
						if (
							$planned['phong_kham_id'] !== null
							&& (int) $planned['phong_kham_id'] === $roomId
							&& $this->conflictCheckerService->timesOverlap($start, $end, $planned['gio_bat_dau'], $planned['gio_ket_thuc'])
						) {
							$plannedStatus = 'chan';
							$reason = 'room_conflict';
							$message = 'Phòng khám bị trùng giữa các ca đang chọn trong cùng đợt gán.';
							$selectedRoom = $roomInfoMap->get($roomId);
							$conflictDetail = [
								'bac_si_xung_dot' => [
									[
										'id' => $doctorId,
										'ho_ten' => $doctorName,
									]
								],
								'phong_kham_xung_dot' => [
									[
										'id' => $selectedRoom?->id,
										'ma_phong' => $selectedRoom?->ma_phong,
										'ten_phong' => $selectedRoom?->ten_phong,
									]
								],
								'ca_xung_dot' => [
									[
										'loai' => 'trong_dot_gan',
										'candidate_key' => $planned['candidate_key'],
										'ten_ca' => $planned['ten_ca'],
										'gio_bat_dau' => $planned['gio_bat_dau'],
										'gio_ket_thuc' => $planned['gio_ket_thuc'],
									]
								],
							];
							$blockingConflicts[] = [
								'candidate_key' => $candidate['candidate_key'],
								'ngay_lam_viec' => $dateKey,
								'khung_gio' => [
									'gio_bat_dau' => $start,
									'gio_ket_thuc' => $end,
								],
								'loai' => 'room_conflict',
								'thong_diep' => $message,
								...$conflictDetail,
							];
							break;
						}
					}
				}
			}

			if ($plannedStatus === 'se_tao') {
				$creatableCount++;
				$plannedByDate[$dateKey][] = [
					'candidate_key' => $candidate['candidate_key'],
					'ten_ca' => $candidate['ten_ca'],
					'gio_bat_dau' => $start,
					'gio_ket_thuc' => $end,
					'phong_kham_id' => $roomId,
					'phong_kham' => $roomId !== null ? [
						'id' => $roomInfoMap->get($roomId)?->id,
						'ma_phong' => $roomInfoMap->get($roomId)?->ma_phong,
						'ten_phong' => $roomInfoMap->get($roomId)?->ten_phong,
					] : null,
				];
			}

			if ($plannedStatus === 'bo_qua') {
				$skippedReasonCount[$reason] = ($skippedReasonCount[$reason] ?? 0) + 1;
				$warnings[] = [
					'candidate_key' => $candidate['candidate_key'],
					'ngay_lam_viec' => $dateKey,
					'ly_do' => $reason,
					'thong_diep' => $message,
				];
			}

			$previewItems[] = [
				...$candidate,
				'trang_thai_du_kien' => $plannedStatus,
				'ly_do' => $reason,
				'thong_diep' => $message,
				'chi_tiet_xung_dot' => $conflictDetail,
			];
		}

		$skippedCount = count(array_filter($previewItems, fn(array $item) => $item['trang_thai_du_kien'] === 'bo_qua'));
		$blockedCount = count(array_filter($previewItems, fn(array $item) => $item['trang_thai_du_kien'] === 'chan'));

		return [
			'preview_items' => $previewItems,
			'blocking_conflicts' => $blockingConflicts,
			'warnings' => $warnings,
			'summary' => [
				'total_weeks_applied' => $repeatWeeks,
				'total_candidates' => count($candidates),
				'shifts_creatable' => $creatableCount,
				'shifts_skipped' => $skippedCount,
				'shifts_blocked' => $blockedCount,
				'skipped_breakdown' => [
					'doctor_leave' => $skippedReasonCount['doctor_leave'] ?? 0,
					'holiday' => $skippedReasonCount['holiday'] ?? 0,
					'existing_schedule' => $skippedReasonCount['existing_schedule'] ?? 0,
				],
			],
		];
	}

	private function getAppointmentsAffectedByLeave(
		int $doctorId,
		string $ngay,
		?string $gioBatDau,
		?string $gioKetThuc,
	): Collection {
		$isFullDay = empty($gioBatDau) && empty($gioKetThuc);

		$appointments = LichHen::query()
			->with('khungGioKham:id,gio_bat_dau,gio_ket_thuc,trang_thai')
			->where('bac_si_id', $doctorId)
			->whereDate('ngay_hen', $ngay)
			->whereIn('trang_thai', self::LEAVE_CANCELLED_APPOINTMENT_STATUSES)
			->lockForUpdate()
			->get();

		if ($isFullDay) {
			return $appointments;
		}

		return $appointments
			->filter(function (LichHen $appointment) use ($gioBatDau, $gioKetThuc) {
				if ($appointment->khungGioKham === null) {
					return false;
				}

				if (empty($appointment->khungGioKham->gio_bat_dau) || empty($appointment->khungGioKham->gio_ket_thuc)) {
					return false;
				}

				return $this->conflictCheckerService->timesOverlap(
					(string) $gioBatDau,
					(string) $gioKetThuc,
					(string) $appointment->khungGioKham->gio_bat_dau,
					(string) $appointment->khungGioKham->gio_ket_thuc,
				);
			})
			->values();
	}

	private function getAppointmentsAffectedByAssignmentDeactivation(int $assignmentId): Collection
	{
		return LichHen::query()
			->with('khungGioKham:id,lich_lam_viec_bac_si_id,gio_bat_dau,gio_ket_thuc,trang_thai')
			->whereIn('trang_thai', self::ASSIGNMENT_DEACTIVATION_CANCELLED_APPOINTMENT_STATUSES)
			->whereHas('khungGioKham', function ($query) use ($assignmentId) {
				$query->where('lich_lam_viec_bac_si_id', $assignmentId);
			})
			->lockForUpdate()
			->get();
	}

	private function getAppointmentsAffectedByHoliday(string $ngay): Collection
	{
		return LichHen::query()
			->with('khungGioKham:id,lich_lam_viec_bac_si_id,gio_bat_dau,gio_ket_thuc,trang_thai')
			->whereDate('ngay_hen', $ngay)
			->whereIn('trang_thai', self::HOLIDAY_CANCELLED_APPOINTMENT_STATUSES)
			->whereHas('khungGioKham.lichLamViecBacSi', function ($query) use ($ngay) {
				$query
					->whereDate('ngay_lam_viec', $ngay)
					->where('trang_thai', 'hoat_dong');
			})
			->lockForUpdate()
			->get();
	}

	private function cancelAppointmentsForAssignmentDeactivation(Collection $appointments, LichLamViecBacSi $assignment): array
	{
		if ($appointments->isEmpty()) {
			return [
				'so_luong_lich_hen_bi_huy' => 0,
				'ma_lich_hen_bi_huy' => [],
				'thong_bao' => null,
			];
		}

		$appointmentIds = $appointments->pluck('id')->filter()->values();
		$slotIds = $appointments->pluck('khung_gio_id')->filter()->unique()->values();
		$ngayLamViec = Carbon::parse($assignment->ngay_lam_viec)->format('Y-m-d');
		$cancelReasonNote = "Lịch hẹn bị hủy do ca làm việc bác sĩ ngày {$ngayLamViec} đã được tạm ngưng/hủy bởi quản trị viên.";

		if ($slotIds->isNotEmpty()) {
			KhungGioKham::query()
				->whereIn('id', $slotIds->all())
				->lockForUpdate()
				->update(['trang_thai' => 'trong']);
		}

		if ($appointmentIds->isNotEmpty()) {
			LichHen::query()
				->whereIn('id', $appointmentIds->all())
				->update([
					'trang_thai' => 'da_huy',
					'ly_do_huy_id' => null,
					'ly_do_huy_khac' => $cancelReasonNote,
				]);
		}

		$cancelledCodes = $appointments
			->pluck('ma_lich_hen')
			->filter()
			->values()
			->all();

		$cancelledCount = $appointmentIds->count();

		return [
			'so_luong_lich_hen_bi_huy' => $cancelledCount,
			'ma_lich_hen_bi_huy' => $cancelledCodes,
			'thong_bao' => "Đã hủy {$cancelledCount} lịch hẹn do ca làm việc đã được tạm ngưng/hủy.",
			'lich_lam_viec_bac_si_id' => (int) $assignment->id,
			'ngay_lam_viec' => $ngayLamViec,
		];
	}

	private function cancelAppointmentsForHoliday(Collection $appointments, string $ngay, string $holidayName): array
	{
		if ($appointments->isEmpty()) {
			return [
				'so_luong_lich_hen_bi_huy' => 0,
				'ma_lich_hen_bi_huy' => [],
				'thong_bao' => null,
			];
		}

		$appointmentIds = $appointments->pluck('id')->filter()->values();
		$slotIds = $appointments->pluck('khung_gio_id')->filter()->unique()->values();
		$cancelReasonNote = "Lịch hẹn bị hủy do ngày nghỉ toàn viện ({$holidayName}) vào ngày {$ngay}.";

		if ($slotIds->isNotEmpty()) {
			KhungGioKham::query()
				->whereIn('id', $slotIds->all())
				->lockForUpdate()
				->update(['trang_thai' => 'trong']);
		}

		if ($appointmentIds->isNotEmpty()) {
			LichHen::query()
				->whereIn('id', $appointmentIds->all())
				->update([
					'trang_thai' => 'da_huy',
					'ly_do_huy_id' => null,
					'ly_do_huy_khac' => $cancelReasonNote,
				]);
		}

		$cancelledCodes = $appointments
			->pluck('ma_lich_hen')
			->filter()
			->values()
			->all();

		$cancelledCount = $appointmentIds->count();

		return [
			'so_luong_lich_hen_bi_huy' => $cancelledCount,
			'ma_lich_hen_bi_huy' => $cancelledCodes,
			'thong_bao' => "Đã hủy {$cancelledCount} lịch hẹn do ngày nghỉ toàn viện.",
			'ngay' => $ngay,
			'ten_ngay_nghi' => $holidayName,
		];
	}

	private function cancelAppointmentsForLeave(Collection $appointments, int $doctorId, string $ngay): array
	{
		if ($appointments->isEmpty()) {
			return [
				'so_luong_lich_hen_bi_huy' => 0,
				'ma_lich_hen_bi_huy' => [],
				'thong_bao' => null,
			];
		}

		$appointmentIds = $appointments->pluck('id')->filter()->values();
		$slotIds = $appointments->pluck('khung_gio_id')->filter()->unique()->values();
		$cancelReasonNote = "Lịch hẹn bị hủy do bác sĩ nghỉ (điều phối bởi quản trị viên) vào ngày {$ngay}.";

		if ($slotIds->isNotEmpty()) {
			KhungGioKham::query()
				->whereIn('id', $slotIds->all())
				->lockForUpdate()
				->update(['trang_thai' => 'trong']);
		}

		if ($appointmentIds->isNotEmpty()) {
			LichHen::query()
				->whereIn('id', $appointmentIds->all())
				->update([
					'trang_thai' => 'da_huy',
					'ly_do_huy_id' => null,
					'ly_do_huy_khac' => $cancelReasonNote,
				]);
		}

		$cancelledCodes = $appointments
			->pluck('ma_lich_hen')
			->filter()
			->values()
			->all();

		$cancelledCount = count($cancelledCodes);

		return [
			'so_luong_lich_hen_bi_huy' => $cancelledCount,
			'ma_lich_hen_bi_huy' => $cancelledCodes,
			'thong_bao' => "Đã hủy {$cancelledCount} lịch hẹn bị ảnh hưởng bởi lịch nghỉ của bác sĩ.",
			'bac_si_id' => $doctorId,
			'ngay' => $ngay,
		];
	}

	private function generateShiftCode(string $gioBatDau, string $gioKetThuc, int $thuTrongTuan): string
	{
		$shiftPrefix = $this->resolveShiftTypeCode($gioBatDau);
		$weekdayCode = $this->resolveWeekdayCode($thuTrongTuan);
		$prefix = "CA-{$shiftPrefix}-{$weekdayCode}";

		for ($attempt = 0; $attempt < 10; $attempt++) {
			$salt = config('app.key') . '|' . microtime(true) . '|' . random_int(100000, 999999);
			$hashInput = "{$gioBatDau}|{$gioKetThuc}|{$thuTrongTuan}|{$salt}";
			$suffix = strtoupper(substr(hash('sha1', $hashInput), 0, 8));
			$code = "{$prefix}-{$suffix}";

			$exists = LichLamViec::query()->where('ma_ca', $code)->exists();
			if (!$exists) {
				return $code;
			}
		}

		throw ValidationException::withMessages([
			'ma_ca' => ['Không thể tạo mã ca duy nhất. Vui lòng thử lại.'],
		]);
	}

	private function resolveShiftTypeCode(string $gioBatDau): string
	{
		[$hour, $minute] = array_map('intval', explode(':', $gioBatDau));
		$totalMinutes = ($hour * 60) + $minute;

		if ($totalMinutes >= 7 * 60 && $totalMinutes < 12 * 60) {
			return 'SANG';
		}

		if ($totalMinutes >= 13 * 60 && $totalMinutes < 18 * 60) {
			return 'CHIEU';
		}

		return $totalMinutes < 13 * 60 ? 'SANG' : 'CHIEU';
	}

	private function resolveWeekdayCode(int $thuTrongTuan): string
	{
		$map = [
			1 => 'T2',
			2 => 'T3',
			3 => 'T4',
			4 => 'T5',
			5 => 'T6',
			6 => 'T7',
			7 => 'CN',
		];

		return $map[$thuTrongTuan] ?? 'T2';
	}

	private function getTemplateById(int $id): LichLamViec
	{
		$template = LichLamViec::query()->find($id);
		if ($template === null) {
			throw ValidationException::withMessages([
				'id' => ['Mẫu ca làm việc không tồn tại.'],
			]);
		}

		return $template;
	}

	private function resolveDateRange(array $filters, string $defaultFrom, string $defaultTo): array
	{
		$fromDate = Carbon::parse($filters['tu_ngay'] ?? $defaultFrom)->format('Y-m-d');
		$toDate = Carbon::parse($filters['den_ngay'] ?? $defaultTo)->format('Y-m-d');

		if ($fromDate > $toDate) {
			throw ValidationException::withMessages([
				'tu_ngay' => ['tu_ngay phải nhỏ hơn hoặc bằng den_ngay.'],
			]);
		}

		return [$fromDate, $toDate];
	}

	private function resolvePageSize(mixed $pageSize): int
	{
		$size = (int) ($pageSize ?? self::DEFAULT_PAGE_SIZE);
		if ($size <= 0) {
			$size = self::DEFAULT_PAGE_SIZE;
		}

		return min($size, 100);
	}

	public function getSystemConfigs(array $filters): array
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
}
