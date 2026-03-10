<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lich_hen', function (Blueprint $table) {

            $table->id();

            $table->string('ma_lich_hen')->unique();

            $table->foreignId('benh_nhan_id')->constrained('benh_nhan');

            $table->foreignId('bac_si_id')->constrained('bac_si');

            $table->foreignId('chuyen_khoa_id')->constrained('chuyen_khoa');

            $table->foreignId('khung_gio_id')
                ->nullable()
                ->unique()
                ->constrained('khung_gio_kham')
                ->nullOnDelete();

            $table->date('ngay_hen');

            $table->text('ly_do_kham')->nullable();

            $table->enum('trang_thai', [
                'dang_cho',
                'da_thanh_toan',
                'da_xac_nhan',
                'da_hoan_tat',
                'da_huy',
                'khong_den'
            ])->default('dang_cho');

            $table->foreignId('nguoi_tao_id')
                ->nullable()
                ->constrained('nguoi_dung')
                ->nullOnDelete();

            $table->time('gio_den_thuc_te')->nullable();

            $table->foreignId('nguoi_tiep_nhan_id')
                ->nullable()
                ->constrained('nguoi_dung')
                ->nullOnDelete();

            $table->foreignId('ly_do_huy_id')
                ->nullable()
                ->constrained('ly_do_huy')
                ->nullOnDelete();

            $table->text('ly_do_huy_khac')->nullable();

            $table->text('ghi_chu')->nullable();
            $table->text('ghi_chu_noi_bo')->nullable();

            $table->timestamps();

            $table->index('ngay_hen');
            $table->index('trang_thai');
            $table->index('benh_nhan_id');
            $table->index('bac_si_id');
            $table->index('chuyen_khoa_id');
            $table->index(['bac_si_id', 'ngay_hen']);
            $table->index(['benh_nhan_id', 'ngay_hen']);
            $table->index('nguoi_tao_id');
            $table->index('nguoi_tiep_nhan_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lich_hen');
    }
};