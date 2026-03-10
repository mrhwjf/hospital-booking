<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lich_lam_viec_bac_si', function (Blueprint $table) {

            $table->id();

            $table->foreignId('bac_si_id')->constrained('bac_si')->cascadeOnDelete();

            $table->foreignId('lich_lam_viec_id')->constrained('lich_lam_viec');

            $table->foreignId('phong_kham_id')
                ->nullable()
                ->constrained('phong_kham')
                ->nullOnDelete();

            $table->date('ngay_lam_viec');

            $table->text('ghi_chu')->nullable();

            $table->enum('trang_thai', ['hoat_dong', 'tam_ngung', 'huy'])->default('hoat_dong');

            $table->timestamps();

            $table->unique(
                ['bac_si_id', 'ngay_lam_viec', 'lich_lam_viec_id'],
                'uniq_bacsi_ngay_lich'
            );
            $table->index('bac_si_id');
            $table->index('ngay_lam_viec');
            $table->index('trang_thai');
            $table->index('phong_kham_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lich_lam_viec_bac_si');
    }
};
