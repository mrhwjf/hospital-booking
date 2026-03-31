<?php

namespace App\Services\Admin;

use App\Models\BacSiNghi;
use App\Models\LichLamViecBacSi;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class AdminScheduleConflictCheckerService
{
	public function assertRoomConflictFree(
		int $roomId,
		string $ngay,
		string $gioBatDau,
		string $gioKetThuc,
		?int $ignoreAssignmentId = null,
	): void {
		$conflict = LichLamViecBacSi::query()
			->with('lichLamViec:id,gio_bat_dau,gio_ket_thuc')
			->where('phong_kham_id', $roomId)
			->whereDate('ngay_lam_viec', $ngay)
			->where('trang_thai', 'hoat_dong')
			->when($ignoreAssignmentId !== null, function ($query) use ($ignoreAssignmentId) {
				$query->where('id', '!=', $ignoreAssignmentId);
			})
			->get()
			->first(function (LichLamViecBacSi $assignment) use ($gioBatDau, $gioKetThuc) {
				if ($assignment->lichLamViec === null) {
					return false;
				}

				return $this->timesOverlap(
					$gioBatDau,
					$gioKetThuc,
					(string) $assignment->lichLamViec->gio_bat_dau,
					(string) $assignment->lichLamViec->gio_ket_thuc,
				);
			});

		if ($conflict !== null) {
			throw ValidationException::withMessages([
				'phong_kham_id' => ['Phòng khám bị trùng với ca làm việc khác trong cùng khung giờ.'],
			]);
		}
	}

	public function hasLeaveOverlap(Collection $leaves, string $shiftStart, string $shiftEnd): bool
	{
		return $leaves->contains(function (BacSiNghi $leave) use ($shiftStart, $shiftEnd): bool {
			if (empty($leave->gio_bat_dau) && empty($leave->gio_ket_thuc)) {
				return true;
			}

			if (empty($leave->gio_bat_dau) || empty($leave->gio_ket_thuc)) {
				return false;
			}

			return $this->timesOverlap(
				$shiftStart,
				$shiftEnd,
				(string) $leave->gio_bat_dau,
				(string) $leave->gio_ket_thuc,
			);
		});
	}

	public function timesOverlap(string $startA, string $endA, string $startB, string $endB): bool
	{
		return $startA < $endB && $startB < $endA;
	}
}
