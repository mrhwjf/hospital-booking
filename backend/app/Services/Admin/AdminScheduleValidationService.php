<?php

namespace App\Services\Admin;

use App\Models\BacSi;
use App\Models\BacSiNghi;
use App\Models\NgayNghiLe;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class AdminScheduleValidationService
{
	public function __construct(private readonly AdminScheduleConflictCheckerService $conflictChecker)
	{
	}

	public function assertDateIsTodayOrFuture(string $ngay, string $field, string $label): void
	{
		$targetDate = Carbon::parse($ngay)->startOfDay();
		if ($targetDate->lt(now()->startOfDay())) {
			throw ValidationException::withMessages([
				$field => ["{$label} không được nằm trong quá khứ."],
			]);
		}
	}

	public function validateShiftTimeWindow(string $gioBatDau, string $gioKetThuc): void
	{
		if ($gioBatDau >= $gioKetThuc) {
			throw ValidationException::withMessages([
				'gio_bat_dau' => ['Giờ bắt đầu phải nhỏ hơn giờ kết thúc.'],
			]);
		}
	}

	public function assertHolidayDateUnique(string $ngay, ?int $ignoreHolidayId): void
	{
		$isExists = NgayNghiLe::query()
			->whereDate('ngay', $ngay)
			->when($ignoreHolidayId !== null, function ($query) use ($ignoreHolidayId) {
				$query->where('id', '!=', $ignoreHolidayId);
			})
			->exists();

		if ($isExists) {
			throw ValidationException::withMessages([
				'ngay' => ['Ngày nghỉ lễ đã tồn tại.'],
			]);
		}
	}

	public function assertLeaveBusinessRules(
		int $doctorId,
		string $ngay,
		?string $gioBatDau,
		?string $gioKetThuc,
		?int $ignoreLeaveId,
	): void {
		$doctor = BacSi::query()->find($doctorId);
		if ($doctor === null) {
			throw ValidationException::withMessages([
				'bac_si_id' => ['Bác sĩ không tồn tại.'],
			]);
		}

		$isFullDay = empty($gioBatDau) && empty($gioKetThuc);
		if (!$isFullDay) {
			if (empty($gioBatDau) || empty($gioKetThuc)) {
				throw ValidationException::withMessages([
					'gio_bat_dau' => ['Nghỉ theo giờ yêu cầu cả giờ bắt đầu và giờ kết thúc.'],
				]);
			}

			$this->validateShiftTimeWindow($gioBatDau, $gioKetThuc);
		}

		$overlappedLeaves = BacSiNghi::query()
			->where('bac_si_id', $doctorId)
			->whereDate('ngay', $ngay)
			->where('trang_thai', 'hoat_dong')
			->when($ignoreLeaveId !== null, function ($query) use ($ignoreLeaveId) {
				$query->where('id', '!=', $ignoreLeaveId);
			})
			->get();

		$hasLeaveOverlap = $overlappedLeaves->contains(function (BacSiNghi $leave) use ($isFullDay, $gioBatDau, $gioKetThuc): bool {
			$existingFullDay = empty($leave->gio_bat_dau) && empty($leave->gio_ket_thuc);
			if ($isFullDay || $existingFullDay) {
				return true;
			}

			return $this->conflictChecker->timesOverlap(
				(string) $gioBatDau,
				(string) $gioKetThuc,
				(string) $leave->gio_bat_dau,
				(string) $leave->gio_ket_thuc,
			);
		});

		if ($hasLeaveOverlap) {
			throw ValidationException::withMessages([
				'ngay' => ['Bác sĩ đã có lịch nghỉ trùng thời gian trong ngày này.'],
			]);
		}
	}

	public function assertLeaveCancellationConfirmed(array $payload, Collection $appointments): void
	{
		if ($appointments->isEmpty()) {
			return;
		}

		$isConfirmed = filter_var($payload['xac_nhan_huy_lich_hen'] ?? false, FILTER_VALIDATE_BOOLEAN);
		if ($isConfirmed) {
			return;
		}

		$affectedCount = $appointments->count();
		throw ValidationException::withMessages([
			'xac_nhan_huy_lich_hen' => [
				"Có {$affectedCount} lịch hẹn sẽ bị ảnh hưởng. Gửi xac_nhan_huy_lich_hen=true để xác nhận tạo lịch nghỉ và tự động hủy các lịch hẹn liên quan.",
			],
		]);
	}
}
