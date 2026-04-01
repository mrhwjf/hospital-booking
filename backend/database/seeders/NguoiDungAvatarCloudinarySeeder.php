<?php

namespace Database\Seeders;

use Cloudinary\Cloudinary;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Throwable;

class NguoiDungAvatarCloudinarySeeder extends Seeder
{
    public function run(): void
    {
        $cloudName = (string) config('cloudinary.cloud_name');
        $apiKey = (string) config('cloudinary.api_key');
        $apiSecret = (string) config('cloudinary.api_secret');

        if ($cloudName === '' || $apiKey === '' || $apiSecret === '') {
            $this->command?->warn('Bo qua NguoiDungAvatarCloudinarySeeder: chua cau hinh CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.');
            return;
        }

        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => $cloudName,
                'api_key' => $apiKey,
                'api_secret' => $apiSecret,
            ],
        ]);

        $users = DB::table('nguoi_dung')->select('id', 'email')->orderBy('id')->get();
        $now = now();

        foreach ($users as $user) {
            $seed = rawurlencode((string) $user->email);
            $sourceUrl = "https://api.dicebear.com/9.x/initials/png?seed={$seed}&radius=50&backgroundType=gradientLinear";

            try {
                $result = $cloudinary->uploadApi()->upload(
                    $sourceUrl,
                    [
                        'public_id' => "hospital_booking/user_avatars/user_{$user->id}",
                        'overwrite' => true,
                        'invalidate' => true,
                        'resource_type' => 'image',
                        'type' => 'upload',
                    ]
                );

                DB::table('nguoi_dung')
                    ->where('id', $user->id)
                    ->update([
                        'hinh_anh' => $result['secure_url'] ?? null,
                        'updated_at' => $now,
                    ]);
            } catch (Throwable $e) {
                $this->command?->warn("Khong upload duoc avatar Cloudinary cho user #{$user->id}: {$e->getMessage()}");
            }
        }
    }
}
