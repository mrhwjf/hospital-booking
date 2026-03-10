<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lich_lam_viec', function (Blueprint $table) {

            $table->id();

            $table->string('ma_ca')->unique();

            $table->string('ten_ca');

            $table->tinyInteger('thu_trong_tuan');

            $table->time('gio_bat_dau');

            $table->time('gio_ket_thuc');

            $table->integer('thoi_luong_kham')->default(60);

            $table->text('ghi_chu')->nullable();

            $table->enum('trang_thai', ['hoat_dong', 'tam_ngung', 'huy'])->default('hoat_dong');

            $table->timestamps();

            $table->index('thu_trong_tuan');
            $table->index('trang_thai');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lich_lam_viec');
    }
};
