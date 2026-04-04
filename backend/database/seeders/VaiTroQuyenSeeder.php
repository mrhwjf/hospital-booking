<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VaiTroQuyenSeeder extends Seeder
{
	public function run(): void
	{
		$roleIds = DB::table('vai_tro')->pluck('id', 'ma_vai_tro');
		$permissionIds = DB::table('quyen')->pluck('id', 'ma_quyen');

		$adminExcludedResources = [
			'benh_nhan',
			'tai_lieu_ho_so',
			'don_thuoc',
			'chi_dinh',
			'phieu_kham',
		];

		$adminPermissions = collect(array_keys($permissionIds->all()))
			->filter(function (string $permissionCode) use ($adminExcludedResources): bool {
				$resource = explode(':', $permissionCode)[0] ?? '';
				return !in_array($resource, $adminExcludedResources, true);
			})
			->values()
			->all();

		$rolePermissionMap = [
			'ADMIN' => $adminPermissions,
			'BACSI' => [
				'nguoi_dung:read',
				'nguoi_dung:change_password',
				'nguoi_dung:change_email',
				'nguoi_dung:avatar',
				'benh_nhan:read',
				'benh_nhan:update',
				'bac_si:read',
				'ngay_nghi_le:read',
				'bac_si_nghi:read',
				'lich_lam_viec:read',
				'lich_lam_viec_bac_si:read',
				'phieu_kham:read',
				'phieu_kham:update',
				'phieu_kham:trang_thai',
				'chi_dinh:create',
				'chi_dinh:read',
				'chi_dinh:update',
				'chi_dinh:delete',
				'chi_dinh:trang_thai',
				'don_thuoc:create',
				'don_thuoc:read',
				'don_thuoc:update',
				'don_thuoc:delete',
				'tai_lieu_ho_so:create',
				'tai_lieu_ho_so:read',
				'tai_lieu_ho_so:update',
				'tai_lieu_ho_so:delete',
				'tai_lieu_ho_so:update_file',
				'tai_lieu_ho_so:read_file',
				'tai_lieu_ho_so:delete_file',
				'nghiep_vu:kham_benh',
			],
			'NHANVIEN' => [
				'nguoi_dung:read',
				'nguoi_dung:change_password',
				'nguoi_dung:change_email',
				'nguoi_dung:avatar',
				'lich_hen:create',
				'lich_hen:read',
				'lich_hen:update',
				'lich_hen:dat_lich',
				'lich_hen:huy_lich',
				'lich_hen:sua_lich',
				'lich_hen:lich_su',
				'lich_hen:checkin',
				'benh_nhan:create',
				'benh_nhan:read',
				'nhan_vien:read',
				'bac_si:read',
				'ngay_nghi_le:read',
				'bac_si_nghi:read',
				'lich_lam_viec:read',
				'lich_lam_viec_bac_si:read',
				'phieu_kham:create',
				'nghiep_vu:quan_ly_lich_hen',
			],
			'BENHNHAN' => [
				'nguoi_dung:read',
				'nguoi_dung:change_password',
				'nguoi_dung:change_email',
				'nguoi_dung:avatar',
				'lich_hen:read',
				'lich_hen:update',
				'lich_hen:dat_lich',
				'lich_hen:huy_lich',
				'lich_hen:sua_lich',
				'lich_hen:lich_su',
				'benh_nhan:read',
				'benh_nhan:update',
				'bac_si:read',
				'ngay_nghi_le:read',
				'bac_si_nghi:read',
				'lich_lam_viec:read',
				'lich_lam_viec_bac_si:read',
				'phieu_kham:read',
				'don_thuoc:read',
				'tai_lieu_ho_so:read',
				'chi_dinh:read',
				'nghiep_vu:dat_lich',
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
