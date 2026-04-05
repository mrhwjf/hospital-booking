<?php

namespace App\Providers;

use App\Models\BenhNhan;
use App\Models\LichHen;
use App\Models\PhieuKham;
use App\Models\TaiLieuHoSo;
use App\Policies\BenhNhanPolicy;
use App\Policies\LichHenPolicy;
use App\Policies\PhieuKhamPolicy;
use App\Policies\TaiLieuHoSoPolicy;
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
        BenhNhan::class => BenhNhanPolicy::class,
        LichHen::class => LichHenPolicy::class,
        PhieuKham::class => PhieuKhamPolicy::class,
        TaiLieuHoSo::class => TaiLieuHoSoPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
