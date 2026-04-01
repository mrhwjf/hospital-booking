<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VaiTroQuyenSeeder extends Seeder
{
	public function run(): void
	{
		$adminId = DB::table('vai_tro')->where('ma_vai_tro', 'ADMIN')->value('id');
		$bacSiId = DB::table('vai_tro')->where('ma_vai_tro', 'BACSI')->value('id');
		$nhanVienId = DB::table('vai_tro')->where('ma_vai_tro', 'NHANVIEN')->value('id');
		$benhNhanId = DB::table('vai_tro')->where('ma_vai_tro', 'BENHNHAN')->value('id');

		$allPermissions = DB::table('quyen')->pluck('id')->all();
		$bacSiPermissions = DB::table('quyen')->whereIn('ma_quyen', ['KHAM_BENH', 'KE_DON_THUOC', 'XEM_BAO_CAO'])->pluck('id')->all();
		$nhanVienPermissions = DB::table('quyen')->whereIn('ma_quyen', ['QUAN_LY_LICH_HEN', 'DAT_LICH_KHAM'])->pluck('id')->all();
		$benhNhanPermissions = DB::table('quyen')->whereIn('ma_quyen', ['DAT_LICH_KHAM'])->pluck('id')->all();

		$rows = [];

		foreach ($allPermissions as $permissionId) {
			if (!$adminId) {
				continue;
			}
			$rows[] = ['vai_tro_id' => $adminId, 'quyen_id' => $permissionId, 'created_at' => now()];
		}

		foreach ($bacSiPermissions as $permissionId) {
			if (!$bacSiId) {
				continue;
			}
			$rows[] = ['vai_tro_id' => $bacSiId, 'quyen_id' => $permissionId, 'created_at' => now()];
		}

		foreach ($nhanVienPermissions as $permissionId) {
			if (!$nhanVienId) {
				continue;
			}
			$rows[] = ['vai_tro_id' => $nhanVienId, 'quyen_id' => $permissionId, 'created_at' => now()];
		}

		foreach ($benhNhanPermissions as $permissionId) {
			if (!$benhNhanId) {
				continue;
			}
			$rows[] = ['vai_tro_id' => $benhNhanId, 'quyen_id' => $permissionId, 'created_at' => now()];
		}

		$rows = collect($rows)
			->filter(fn(array $row) => !is_null($row['vai_tro_id']) && !is_null($row['quyen_id']))
			->unique(fn(array $row) => $row['vai_tro_id'] . '-' . $row['quyen_id'])
			->values()
			->all();

		DB::table('vai_tro_quyen')->insertOrIgnore($rows);
	}
}
