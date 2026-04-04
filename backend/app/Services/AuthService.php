<?php

namespace App\Services;

use App\Mail\WelcomeMail;
use App\Models\BenhNhan;
use App\Models\NguoiDung;
use App\Models\VaiTro;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Đăng nhập người dùng, trả về token Sanctum + thông tin cơ bản.
     */
    public function login(string $email, string $password): array
    {
        $nguoiDung = NguoiDung::with('vaiTro')->where('email', $email)->first();

        if (! $nguoiDung || ! Hash::check($password, $nguoiDung->mat_khau)) {
            throw ValidationException::withMessages([
                'email' => ['Email hoặc mật khẩu không chính xác.'],
            ]);
        }

        if ($nguoiDung->trang_thai !== 'hoat_dong') {
            throw ValidationException::withMessages([
                'email' => ['Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.'],
            ]);
        }

        $nguoiDung->update(['lan_dang_nhap_cuoi' => now()]);

        $token = $nguoiDung->createToken('auth-token')->plainTextToken;

        return [
            'token'     => $token,
            'nguoi_dung' => [
                'id'       => $nguoiDung->id,
                'email'    => $nguoiDung->email,
                'vai_tro'  => $nguoiDung->vaiTro?->ma_vai_tro,
                'hinh_anh' => $nguoiDung->hinh_anh,
            ],
        ];
    }

    /**
     * Đăng ký tài khoản bệnh nhân mới.
     * Tạo đồng thời bản ghi nguoi_dung + benh_nhan trong một transaction.
     */
    public function dangKyBenhNhan(array $data): array
    {
        $vaiTroBenhNhan = VaiTro::where('ma_vai_tro', 'BENHNHAN')->firstOrFail();

        $result = DB::transaction(function () use ($data, $vaiTroBenhNhan) {
            $nguoiDung = NguoiDung::create([
                'email'      => $data['email'],
                'mat_khau'   => Hash::make($data['mat_khau']),
                'vai_tro_id' => $vaiTroBenhNhan->id,
                'trang_thai' => 'hoat_dong',
            ]);

            // Tạo mã bệnh nhân tự tăng: BN0001, BN0002, ...
            $soThuTu = BenhNhan::max('id') + 1;
            $maBenhNhan = 'BN' . str_pad($soThuTu, 4, '0', STR_PAD_LEFT);

            BenhNhan::create([
                'ma_benh_nhan'  => $maBenhNhan,
                'nguoi_dung_id' => $nguoiDung->id,
                'ho_ten'        => $data['ho_ten'],
                'ngay_sinh'     => $data['ngay_sinh'],
                'gioi_tinh'     => $data['gioi_tinh'],
                'so_dien_thoai' => $data['so_dien_thoai'],
                'email'         => $data['email'],
                'so_cccd'       => $data['so_cccd'] ?? null,
                'trang_thai'    => 'hoat_dong',
            ]);

            $nguoiDung->update(['lan_dang_nhap_cuoi' => now()]);
            $token = $nguoiDung->createToken('auth-token')->plainTextToken;

            return [
                'token' => $token,
                'email' => $nguoiDung->email,
                'ho_ten' => $data['ho_ten'],
                'nguoi_dung' => [
                    'id'       => $nguoiDung->id,
                    'email'    => $nguoiDung->email,
                    'vai_tro'  => 'BENHNHAN',
                    'hinh_anh' => null,
                ],
            ];
        });

        try {
            Mail::to($result['email'])->send(new WelcomeMail($result['ho_ten']));
            Log::info('Đã gửi welcome mail thành công.', [
                'email' => $result['email'],
                'nguoi_dung_id' => $result['nguoi_dung']['id'] ?? null,
            ]);
        } catch (\Throwable $e) {
            Log::warning('Gui welcome mail that bai sau dang ky.', [
                'email' => $result['email'],
                'error' => $e->getMessage(),
            ]);
        }

        unset($result['email'], $result['ho_ten']);

        return $result;
    }
}
