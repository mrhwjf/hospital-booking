<?php

namespace App\Services;

use App\Models\BacSiNghi;
use App\Models\CauHinhHeThong;
use App\Models\KhungGioKham;
use App\Models\LichHen;
use App\Models\LichLamViecBacSi;
use App\Models\NgayNghiLe;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class BookingValidationService
{
	private const THOI_GIAN_HUY_TOI_THIEU = 'THOI_GIAN_HUY_TOI_THIEU';
	private const THOI_GIAN_DOI_TOI_THIEU = 'THOI_GIAN_DOI_TOI_THIEU';
	private const SO_NGAY_DAT_TRUOC_TOI_DA = 'SO_NGAY_DAT_TRUOC_TOI_DA';
	private const ACTIVE_APPOINTMENT_STATUSES = ['dang_cho', 'da_thanh_toan', 'da_xac_nhan'];

	public function validateCreatePayload(array $payload, ?int $allowedBookedSlotId = null): array
	{
		$ngayHen = Carbon::createFromFormat('Y-m-d', (string) $payload['ngay_hen'])->startOfDay();

		$this->validateBookingWindow($payload, $ngayHen);
		$this->validateHoliday($ngayHen);

		$slotContext = $this->resolveSlotContext($payload, $ngayHen, $allowedBookedSlotId);
		$this->validateDoctorAvailability($payload['bac_si_id'], $ngayHen, $slotContext['gio_bat_dau'], $slotContext['gio_ket_thuc']);

		if ((int) $slotContext['bac_si_id'] !== (int) $payload['bac_si_id']) {
			throw ValidationException::withMessages([
				'bac_si_id' => ['Bac si khong khop voi lich lam viec cua khung gio da chon.'],
			]);
		}

		if ((string) $slotContext['ngay_lam_viec'] !== $ngayHen->format('Y-m-d')) {
			throw ValidationException::withMessages([
				'ngay_hen' => ['Ngay hen khong khop voi ngay lam viec cua bac si.'],
			]);
		}

		return $slotContext;
	}

	public function validateCancelPayload(LichHen $lichHen): void
	{
		$this->validateAppointmentCanBeUpdated($lichHen);

		$minHours = (int) $this->getSystemConfig(self::THOI_GIAN_HUY_TOI_THIEU, 12);
		$this->validateMinimumHoursBefore($lichHen, $minHours, 'lich_hen', "Chi duoc huy lich truoc it nhat $minHours gio.");
	}

	public function validateReschedulePayload(LichHen $lichHen, array $payload): array
	{
		$this->validateAppointmentCanBeUpdated($lichHen);

		$minHours = (int) $this->getSystemConfig(self::THOI_GIAN_DOI_TOI_THIEU, 24);
		$this->validateMinimumHoursBefore($lichHen, $minHours, 'lich_hen', "Chi duoc doi lich truoc it nhat $minHours gio.");

		return $this->validateCreatePayload($payload, (int) $lichHen->khung_gio_id);
	}

	private function validateBookingWindow(array $payload, Carbon $ngayHen): void
	{
		$maxDays = (int) $this->getSystemConfig(self::SO_NGAY_DAT_TRUOC_TOI_DA, 30);

		if ($ngayHen->lt(now()->copy()->startOfDay())) {
			throw ValidationException::withMessages([
				'ngay_hen' => ['Khong the dat lich cho ngay trong qua khu.'],
			]);
		}

		if ($ngayHen->greaterThan(now()->copy()->addDays($maxDays)->startOfDay())) {
			throw ValidationException::withMessages([
				'ngay_hen' => ["Chi duoc dat lich trong vong $maxDays ngay toi da."],
			]);
		}

		$gioBatDau = $payload['gio_bat_dau'] ?? null;
		if (!empty($payload['khung_gio_id'])) {
			$slot = KhungGioKham::query()->find($payload['khung_gio_id']);
			$gioBatDau = $slot?->gio_bat_dau;
		}

		if ($gioBatDau === null) {
			return;
		}

		$appointmentAt = Carbon::createFromFormat('Y-m-d H:i:s', $ngayHen->format('Y-m-d') . ' ' . $gioBatDau);
		if ($appointmentAt->lte(now())) {
			throw ValidationException::withMessages([
				'ngay_hen' => ['Khong the dat lich cho thoi diem trong qua khu.'],
			]);
		}
	}

	private function validateHoliday(Carbon $ngayHen): void
	{
		$isHoliday = NgayNghiLe::query()
			->whereDate('ngay', $ngayHen->format('Y-m-d'))
			->where('trang_thai', 'hoat_dong')
			->exists();

		if ($isHoliday) {
			throw ValidationException::withMessages([
				'ngay_hen' => ['Ngay da chon la ngay nghi le, khong the dat lich.'],
			]);
		}
	}

	private function resolveSlotContext(array $payload, Carbon $ngayHen, ?int $allowedBookedSlotId = null): array
	{
		if (!empty($payload['khung_gio_id'])) {
			$slot = KhungGioKham::query()
				->with('lichLamViecBacSi.lichLamViec')
				->find($payload['khung_gio_id']);

			if ($slot === null || $slot->lichLamViecBacSi === null) {
				throw ValidationException::withMessages([
					'khung_gio_id' => ['Khung gio kham khong hop le.'],
				]);
			}

			if ($slot->lichLamViecBacSi->trang_thai !== 'hoat_dong') {
				throw ValidationException::withMessages([
					'khung_gio_id' => ['Lich lam viec cua khung gio khong con hoat dong.'],
				]);
			}

			if (
				in_array($slot->trang_thai, ['da_dat', 'khoa'], true) &&
				(int) $slot->id !== (int) ($allowedBookedSlotId ?? 0)
			) {
				throw ValidationException::withMessages([
					'khung_gio_id' => ['Khung gio da duoc dat hoac dang bi khoa.'],
				]);
			}

			return [
				'bac_si_id' => $slot->lichLamViecBacSi->bac_si_id,
				'ngay_lam_viec' => Carbon::parse($slot->lichLamViecBacSi->ngay_lam_viec)->format('Y-m-d'),
				'lich_lam_viec_bac_si_id' => $slot->lich_lam_viec_bac_si_id,
				'gio_bat_dau' => $slot->gio_bat_dau,
				'gio_ket_thuc' => $slot->gio_ket_thuc,
				'existing_slot_id' => $slot->id,
			];
		}

		$schedule = LichLamViecBacSi::query()
			->with('lichLamViec')
			->whereKey($payload['lich_lam_viec_bac_si_id'])
			->first();

		if ($schedule === null) {
			throw ValidationException::withMessages([
				'lich_lam_viec_bac_si_id' => ['Lich lam viec bac si khong ton tai.'],
			]);
		}

		if ($schedule->trang_thai !== 'hoat_dong') {
			throw ValidationException::withMessages([
				'lich_lam_viec_bac_si_id' => ['Lich lam viec bac si khong o trang thai hoat dong.'],
			]);
		}

		if ($schedule->lichLamViec === null) {
			throw ValidationException::withMessages([
				'lich_lam_viec_bac_si_id' => ['Khong tim thay thong tin ca lam viec cua bac si.'],
			]);
		}

		$ngayLamViec = Carbon::parse($schedule->ngay_lam_viec)->format('Y-m-d');
		if ($ngayLamViec !== $ngayHen->format('Y-m-d')) {
			throw ValidationException::withMessages([
				'ngay_hen' => ['Ngay hen khong trung voi ngay lam viec da chon.'],
			]);
		}

		$slotStart = Carbon::createFromFormat('H:i:s', $payload['gio_bat_dau']);
		$slotEnd = Carbon::createFromFormat('H:i:s', $payload['gio_ket_thuc']);
		$shiftStart = Carbon::createFromFormat('H:i:s', $schedule->lichLamViec->gio_bat_dau);
		$shiftEnd = Carbon::createFromFormat('H:i:s', $schedule->lichLamViec->gio_ket_thuc);

		if ($slotStart->lt($shiftStart) || $slotEnd->gt($shiftEnd)) {
			throw ValidationException::withMessages([
				'gio_bat_dau' => ['Khung gio da chon nam ngoai ca lam viec cua bac si.'],
			]);
		}

		$existingSlot = KhungGioKham::query()
			->where('lich_lam_viec_bac_si_id', $schedule->id)
			->where('gio_bat_dau', $payload['gio_bat_dau'])
			->first();

		if (
			$existingSlot !== null &&
			in_array($existingSlot->trang_thai, ['da_dat', 'khoa'], true) &&
			(int) $existingSlot->id !== (int) ($allowedBookedSlotId ?? 0)
		) {
			throw ValidationException::withMessages([
				'gio_bat_dau' => ['Khung gio da duoc dat hoac dang bi khoa.'],
			]);
		}

		return [
			'bac_si_id' => $schedule->bac_si_id,
			'ngay_lam_viec' => $ngayLamViec,
			'lich_lam_viec_bac_si_id' => $schedule->id,
			'gio_bat_dau' => $payload['gio_bat_dau'],
			'gio_ket_thuc' => $payload['gio_ket_thuc'],
			'existing_slot_id' => $existingSlot?->id,
		];
	}

	private function validateDoctorAvailability(int $doctorId, Carbon $ngayHen, string $gioBatDau, string $gioKetThuc): void
	{
		$activeScheduleExists = LichLamViecBacSi::query()
			->where('bac_si_id', $doctorId)
			->whereDate('ngay_lam_viec', $ngayHen->format('Y-m-d'))
			->where('trang_thai', 'hoat_dong')
			->exists();

		if (!$activeScheduleExists) {
			throw ValidationException::withMessages([
				'bac_si_id' => ['Bac si khong co lich lam viec hop le trong ngay da chon.'],
			]);
		}

		$leaves = BacSiNghi::query()
			->where('bac_si_id', $doctorId)
			->whereDate('ngay', $ngayHen->format('Y-m-d'))
			->where('trang_thai', 'hoat_dong')
			->get();

		$fullDayLeave = $leaves->contains(function (BacSiNghi $leave): bool {
			return empty($leave->gio_bat_dau) && empty($leave->gio_ket_thuc);
		});

		if ($fullDayLeave) {
			throw ValidationException::withMessages([
				'bac_si_id' => ['Bac si nghi ca ngay, khong the dat lich.'],
			]);
		}

		$slotStart = Carbon::createFromFormat('H:i:s', $gioBatDau);
		$slotEnd = Carbon::createFromFormat('H:i:s', $gioKetThuc);

		$overlapLeave = $leaves->contains(function (BacSiNghi $leave) use ($slotStart, $slotEnd): bool {
			if (empty($leave->gio_bat_dau) || empty($leave->gio_ket_thuc)) {
				return false;
			}

			$leaveStart = Carbon::createFromFormat('H:i:s', $leave->gio_bat_dau);
			$leaveEnd = Carbon::createFromFormat('H:i:s', $leave->gio_ket_thuc);

			return $slotStart->lt($leaveEnd) && $slotEnd->gt($leaveStart);
		});

		if ($overlapLeave) {
			throw ValidationException::withMessages([
				'gio_bat_dau' => ['Khung gio trung voi khoang thoi gian bac si nghi.'],
			]);
		}
	}

	private function getSystemConfig(string $key, int $default): int
	{
		return (int) (CauHinhHeThong::query()->where('khoa', $key)->value('gia_tri') ?? $default);
	}

	private function validateAppointmentCanBeUpdated(LichHen $lichHen): void
	{
		if (!in_array($lichHen->trang_thai, self::ACTIVE_APPOINTMENT_STATUSES, true)) {
			throw ValidationException::withMessages([
				'lich_hen' => ['Lich hen hien tai khong the cap nhat huy/doi lich.'],
			]);
		}
	}

	private function validateMinimumHoursBefore(LichHen $lichHen, int $minHours, string $errorKey, string $errorMessage): void
	{
		$appointmentAt = $this->resolveAppointmentDateTime($lichHen);
		if ($appointmentAt === null) {
			throw ValidationException::withMessages([
				'lich_hen' => ['Khong the xac dinh gio hen hien tai de thuc hien thao tac nay.'],
			]);
		}

		if (now()->diffInHours($appointmentAt, false) < $minHours) {
			throw ValidationException::withMessages([
				$errorKey => [$errorMessage],
			]);
		}
	}

	private function resolveAppointmentDateTime(LichHen $lichHen): ?Carbon
	{
		$lichHen->loadMissing('khungGioKham:id,gio_bat_dau');

		Log::debug('Resolving appointment datetime', [
			'ngay_hen' => $lichHen->ngay_hen,
			'khung_gio_kham' => $lichHen->khungGioKham,
			'gio_bat_dau' => $lichHen->khungGioKham?->gio_bat_dau,
		]);

		if ($lichHen->khungGioKham === null || empty($lichHen->khungGioKham->gio_bat_dau)) {
			Log::warning('Appointment time could not be resolved', [
				'lich_hen_id' => $lichHen->id ?? null,
			]);
			return null;
		}

		return Carbon::createFromFormat(
			'Y-m-d H:i:s',
			Carbon::parse($lichHen->ngay_hen)->format('Y-m-d') . ' ' . $lichHen->khungGioKham->gio_bat_dau,
		);
	}
}
