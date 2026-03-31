<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class NguoiDungSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('nguoi_dung')->upsert([
            [
                'email' => 'doctor1@gmail.com',
                'mat_khau' => Hash::make('123456'),
                'vai_tro_id' => 2,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'doctor2@gmail.com',
                'mat_khau' => Hash::make('123456'),
                'vai_tro_id' => 2,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'doctor3@gmail.com',
                'mat_khau' => Hash::make('123456'),
                'vai_tro_id' => 2,
                'trang_thai' => 'hoat_dong',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['email'], ['mat_khau', 'vai_tro_id', 'trang_thai', 'updated_at']);
    }
}