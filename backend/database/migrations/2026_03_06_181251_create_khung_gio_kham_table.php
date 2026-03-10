<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('khung_gio_kham', function (Blueprint $table) {

            $table->id();

            $table->foreignId('lich_lam_viec_bac_si_id')
                ->constrained('lich_lam_viec_bac_si')
                ->cascadeOnDelete();

            $table->time('gio_bat_dau');

            $table->time('gio_ket_thuc');

            $table->enum('trang_thai', ['trong', 'da_dat', 'khoa'])->default('trong');

            $table->timestamps();

            $table->unique(['lich_lam_viec_bac_si_id', 'gio_bat_dau']);
            $table->index('trang_thai');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('khung_gio_kham');
    }
};
