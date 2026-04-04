<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class NguoiDungSeeder extends Seeder
{
    public function run(): void
    {
        $roles = DB::table('vai_tro')->pluck('id', 'ma_vai_tro');
        $defaultPassword = Hash::make('12345678');

        $sharedAvatarPublicId = 'hospital_booking/user_avatars/user_10';
        $sharedAvatarUrl = 'https://res.cloudinary.com/dq18a5avc/image/upload/q_auto/f_auto/v1774849803/hospital_booking/user_avatars/user_10.png';

        $buildUserRow = static fn(string $email, ?int $roleId, bool $useSharedAvatar = false) => [
            'email' => $email,
            'mat_khau' => $defaultPassword,
            'vai_tro_id' => $roleId,
            'hinh_anh' => $useSharedAvatar ? $sharedAvatarUrl : null,
            'hinh_anh_public_id' => $useSharedAvatar ? $sharedAvatarPublicId : null,
            'trang_thai' => 'hoat_dong',
            'lan_dang_nhap_cuoi' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $rows = [
            $buildUserRow('admin@hospital.local', $roles['ADMIN'] ?? null, true),
            $buildUserRow('doctor1@hospital.local', $roles['BACSI'] ?? null, true),
            $buildUserRow('doctor2@hospital.local', $roles['BACSI'] ?? null, true),

            $buildUserRow('staff1@hospital.local', $roles['NHANVIEN'] ?? null, true),
            $buildUserRow('staff2@hospital.local', $roles['NHANVIEN'] ?? null, true),

            $buildUserRow('patient1@hospital.local', $roles['BENHNHAN'] ?? null),
            $buildUserRow('patient2@hospital.local', $roles['BENHNHAN'] ?? null),
        ];

        foreach (range(3, 50) as $index) {
            $rows[] = $buildUserRow("doctor{$index}@hospital.local", $roles['BACSI'] ?? null, true);
            $rows[] = $buildUserRow("staff{$index}@hospital.local", $roles['NHANVIEN'] ?? null, true);
            $rows[] = $buildUserRow("patient{$index}@hospital.local", $roles['BENHNHAN'] ?? null);
        }

        // Remove rows where role doesn't exist
        $rows = array_filter($rows, fn(array $row) => !is_null($row['vai_tro_id']));

        DB::table('nguoi_dung')->upsert(
            $rows,
            ['email'],
            [
                'mat_khau',
                'vai_tro_id',
                'hinh_anh',
                'hinh_anh_public_id',
                'trang_thai',
                'lan_dang_nhap_cuoi',
                'updated_at'
            ]
        );
    }
}