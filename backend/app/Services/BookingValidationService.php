<?php

namespace App\Services;

use App\Models\BacSiNghi;
use App\Models\CauHinhHeThong;
use App\Models\KhungGioKham;
use App\Models\LichLamViecBacSi;
use App\Models\NgayNghiLe;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class BookingValidationService
{
	private const THOI_GIAN_DOI_TOI_THIEU = 'THOI_GIAN_DOI_TOI_THIEU';
	private const SO_NGAY_DAT_TRUOC_TOI_DA = 'SO_NGAY_DAT_TRUOC_TOI_DA';

	public function validateCreatePayload(array $payload): array
	{
		$ngayHen = Carbon::createFromFormat('Y-m-d', (string) $payload['ngay_hen'])->startOfDay();

		$this->validateBookingWindow($payload, $ngayHen);
		$this->validateHoliday($ngayHen);

		$slotContext = $this->resolveSlotContext($payload, $ngayHen);
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

	private function validateBookingWindow(array $payload, Carbon $ngayHen): void
	{
		$maxDays = (int) $this->getSystemConfig(self::SO_NGAY_DAT_TRUOC_TOI_DA, 30);
		$hoursBefore = (int) $this->getSystemConfig(self::THOI_GIAN_DOI_TOI_THIEU, 24);

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
		if (now()->diffInHours($appointmentAt, false) < $hoursBefore) {
			throw ValidationException::withMessages([
				'ngay_hen' => ["Lich hen phai duoc dat truoc it nhat $hoursBefore gio."],
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

	private function resolveSlotContext(array $payload, Carbon $ngayHen): array
	{
		if (!empty($payload['khung_gio_id'])) {
			$slot = KhungGioKham::query()
				->with('lichLamViecBacSi')
				->find($payload['khung_gio_id']);

			if ($slot === null || $slot->lichLamViecBacSi === null) {
				throw ValidationException::withMessages([
					'khung_gio_id' => ['Khung gio kham khong hop le.'],
				]);
			}

			if (in_array($slot->trang_thai, ['da_dat', 'khoa'], true)) {
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

		$ngayLamViec = Carbon::parse($schedule->ngay_lam_viec)->format('Y-m-d');
		if ($ngayLamViec !== $ngayHen->format('Y-m-d')) {
			throw ValidationException::withMessages([
				'ngay_hen' => ['Ngay hen khong trung voi ngay lam viec da chon.'],
			]);
		}

		$existingSlot = KhungGioKham::query()
			->where('lich_lam_viec_bac_si_id', $schedule->id)
			->where('gio_bat_dau', $payload['gio_bat_dau'])
			->first();

		if ($existingSlot !== null && in_array($existingSlot->trang_thai, ['da_dat', 'khoa'], true)) {
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
}
