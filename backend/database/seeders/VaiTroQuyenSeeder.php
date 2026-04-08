<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VaiTroQuyenSeeder extends Seeder
{
	public function run(): void
	{
		$roleIds = DB::table('vai_tro')->pluck('id', 'ma_vai_tro');
		$permissionIds = DB::table('quyen')->pluck('id', 'ma_quyen');

		$adminExcludedResources = [
			'tai_lieu_ho_so',
			'don_thuoc',
			'chi_dinh',
			'phieu_kham',
		];

		$adminPermissions = collect(PermissionEnum::values())
			->filter(function (string $permissionCode) use ($adminExcludedResources): bool {
				$resource = explode(':', $permissionCode)[0] ?? '';
				return !in_array($resource, $adminExcludedResources, true);
			})
			->values()
			->all();

		$rolePermissionMap = [
			'ADMIN' => $adminPermissions,
			'BACSI' => [
				PermissionEnum::NGUOI_DUNG_READ->value,
				PermissionEnum::NGUOI_DUNG_CHANGE_PASSWORD->value,
				PermissionEnum::NGUOI_DUNG_CHANGE_EMAIL->value,
				PermissionEnum::NGUOI_DUNG_AVATAR->value,
				PermissionEnum::BENH_NHAN_READ->value,
				PermissionEnum::BENH_NHAN_UPDATE->value,
				PermissionEnum::BAC_SI_READ->value,
				PermissionEnum::NGAY_NGHI_LE_READ->value,
				PermissionEnum::BAC_SI_NGHI_READ->value,
				PermissionEnum::LICH_LAM_VIEC_READ->value,
				PermissionEnum::LICH_LAM_VIEC_BAC_SI_READ->value,
				PermissionEnum::PHIEU_KHAM_READ->value,
				PermissionEnum::PHIEU_KHAM_UPDATE->value,
				PermissionEnum::PHIEU_KHAM_TRANG_THAI->value,
				PermissionEnum::CHI_DINH_CREATE->value,
				PermissionEnum::CHI_DINH_READ->value,
				PermissionEnum::CHI_DINH_UPDATE->value,
				PermissionEnum::CHI_DINH_DELETE->value,
				PermissionEnum::CHI_DINH_TRANG_THAI->value,
				PermissionEnum::DON_THUOC_CREATE->value,
				PermissionEnum::DON_THUOC_READ->value,
				PermissionEnum::DON_THUOC_UPDATE->value,
				PermissionEnum::DON_THUOC_DELETE->value,
				PermissionEnum::TAI_LIEU_HO_SO_CREATE->value,
				PermissionEnum::TAI_LIEU_HO_SO_READ->value,
				PermissionEnum::TAI_LIEU_HO_SO_UPDATE->value,
				PermissionEnum::TAI_LIEU_HO_SO_DELETE->value,
				PermissionEnum::TAI_LIEU_HO_SO_UPDATE_FILE->value,
				PermissionEnum::TAI_LIEU_HO_SO_READ_FILE->value,
				PermissionEnum::TAI_LIEU_HO_SO_DELETE_FILE->value,
				PermissionEnum::NGHIEP_VU_KHAM_BENH->value,
			],
			'NHANVIEN' => [
				PermissionEnum::NGUOI_DUNG_READ->value,
				PermissionEnum::NGUOI_DUNG_CHANGE_PASSWORD->value,
				PermissionEnum::NGUOI_DUNG_CHANGE_EMAIL->value,
				PermissionEnum::NGUOI_DUNG_AVATAR->value,
				PermissionEnum::LICH_HEN_CREATE->value,
				PermissionEnum::LICH_HEN_READ->value,
				PermissionEnum::LICH_HEN_UPDATE->value,
				PermissionEnum::LICH_HEN_DAT_LICH->value,
				PermissionEnum::LICH_HEN_HUY_LICH->value,
				PermissionEnum::LICH_HEN_SUA_LICH->value,
				PermissionEnum::LICH_HEN_LICH_SU->value,
				PermissionEnum::LICH_HEN_CHECKIN->value,
				PermissionEnum::BENH_NHAN_CREATE->value,
				PermissionEnum::BENH_NHAN_READ->value,
				PermissionEnum::NHAN_VIEN_READ->value,
				PermissionEnum::BAC_SI_READ->value,
				PermissionEnum::NGAY_NGHI_LE_READ->value,
				PermissionEnum::BAC_SI_NGHI_READ->value,
				PermissionEnum::LICH_LAM_VIEC_READ->value,
				PermissionEnum::LICH_LAM_VIEC_BAC_SI_READ->value,
				PermissionEnum::PHIEU_KHAM_CREATE->value,
				PermissionEnum::NGHIEP_VU_QUAN_LY_LICH_HEN->value,
			],
			'BENHNHAN' => [
				PermissionEnum::NGUOI_DUNG_READ->value,
				PermissionEnum::NGUOI_DUNG_CHANGE_PASSWORD->value,
				PermissionEnum::NGUOI_DUNG_CHANGE_EMAIL->value,
				PermissionEnum::NGUOI_DUNG_AVATAR->value,
				PermissionEnum::LICH_HEN_READ->value,
				PermissionEnum::LICH_HEN_UPDATE->value,
				PermissionEnum::LICH_HEN_DAT_LICH->value,
				PermissionEnum::LICH_HEN_HUY_LICH->value,
				PermissionEnum::LICH_HEN_SUA_LICH->value,
				PermissionEnum::LICH_HEN_LICH_SU->value,
				PermissionEnum::BENH_NHAN_READ->value,
				PermissionEnum::BENH_NHAN_UPDATE->value,
				PermissionEnum::BAC_SI_READ->value,
				PermissionEnum::NGAY_NGHI_LE_READ->value,
				PermissionEnum::BAC_SI_NGHI_READ->value,
				PermissionEnum::LICH_LAM_VIEC_READ->value,
				PermissionEnum::LICH_LAM_VIEC_BAC_SI_READ->value,
				PermissionEnum::PHIEU_KHAM_READ->value,
				PermissionEnum::DON_THUOC_READ->value,
				PermissionEnum::TAI_LIEU_HO_SO_READ->value,
				PermissionEnum::CHI_DINH_READ->value,
				PermissionEnum::NGHIEP_VU_DAT_LICH->value,
			],
		];

		$managedRoleIds = collect(array_keys($rolePermissionMap))
			->map(fn(string $roleCode) => $roleIds[$roleCode] ?? null)
			->filter()
			->values()
			->all();

		if (!empty($managedRoleIds)) {
			DB::table('vai_tro_quyen')
				->whereIn('vai_tro_id', $managedRoleIds)
				->delete();
		}

		$rows = [];

		foreach ($rolePermissionMap as $roleCode => $permissionCodes) {
			$roleId = $roleIds[$roleCode] ?? null;
			if (is_null($roleId)) {
				continue;
			}

			foreach ($permissionCodes as $permissionCode) {
				$permissionId = $permissionIds[$permissionCode] ?? null;
				if (is_null($permissionId)) {
					continue;
				}

				$rows[] = [
					'vai_tro_id' => $roleId,
					'quyen_id' => $permissionId,
					'created_at' => now(),
				];
			}
		}

		$rows = collect($rows)
			->filter(fn(array $row) => !is_null($row['vai_tro_id']) && !is_null($row['quyen_id']))
			->unique(fn(array $row) => $row['vai_tro_id'] . '-' . $row['quyen_id'])
			->values()
			->all();

		if (empty($rows)) {
			return;
		}

		DB::table('vai_tro_quyen')->insert($rows);
	}
}
