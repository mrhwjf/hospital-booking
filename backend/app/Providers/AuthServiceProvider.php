<?php

namespace App\Providers;

use App\Models\BenhNhan;
use App\Models\BacSiNghi;
use App\Models\BacSi;
use App\Models\CauHinhHeThong;
use App\Models\LichHen;
use App\Models\LichLamViec;
use App\Models\LichLamViecBacSi;
use App\Models\NgayNghiLe;
use App\Models\NhanVien;
use App\Models\NguoiDung;
use App\Models\PhieuKham;
use App\Models\PhongKham;
use App\Models\Quyen;
use App\Models\TaiLieuHoSo;
use App\Models\VaiTro;
use App\Policies\BacSiNghiPolicy;
use App\Policies\BacSiPolicy;
use App\Policies\CauHinhHeThongPolicy;
use App\Policies\BenhNhanPolicy;
use App\Policies\LichHenPolicy;
use App\Policies\LichLamViecBacSiPolicy;
use App\Policies\LichLamViecPolicy;
use App\Policies\NgayNghiLePolicy;
use App\Policies\NguoiDungPolicy;
use App\Policies\PhieuKhamPolicy;
use App\Policies\PhongKhamPolicy;
use App\Policies\QuyenPolicy;
use App\Policies\TaiLieuHoSoPolicy;
use App\Policies\NhanVienPolicy;
use App\Policies\VaiTroPolicy;
// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        BacSi::class => BacSiPolicy::class,
        BacSiNghi::class => BacSiNghiPolicy::class,
        BenhNhan::class => BenhNhanPolicy::class,
        CauHinhHeThong::class => CauHinhHeThongPolicy::class,
        LichHen::class => LichHenPolicy::class,
        LichLamViec::class => LichLamViecPolicy::class,
        LichLamViecBacSi::class => LichLamViecBacSiPolicy::class,
        NgayNghiLe::class => NgayNghiLePolicy::class,
        PhieuKham::class => PhieuKhamPolicy::class,
        PhongKham::class => PhongKhamPolicy::class,
        Quyen::class => QuyenPolicy::class,
        TaiLieuHoSo::class => TaiLieuHoSoPolicy::class,
        NguoiDung::class => NguoiDungPolicy::class,
        NhanVien::class => NhanVienPolicy::class,
        VaiTro::class => VaiTroPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
