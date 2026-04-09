<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dich_vu', function (Blueprint $table) {
            $table->id();
            $table->string('ma_dich_vu', 50)->unique();
            $table->string('ten_dich_vu', 200);

            $table->foreignId('chuyen_khoa_id')->constrained('chuyen_khoa');

            $table->text('mo_ta')->nullable();

            $table->decimal('gia_dich_vu', 12, 0)->default(0);

            $table->integer('thoi_gian_du_kien')->nullable();

            $table->text('yeu_cau_dac_biet')->nullable();

            $table->enum('trang_thai', ['hoat_dong', 'tam_ngung'])->default('hoat_dong');

            $table->enum('loai_dich_vu', [
                'kham_benh',
                'xet_nghiem',
                'chan_doan_hinh_anh',
                'thu_thuat',
                'phau_thuat',
                'khac'
            ]);

            $table->timestamps();

            $table->index('chuyen_khoa_id');
            $table->index('trang_thai');
            $table->index('ten_dich_vu');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dich_vu');
    }
};
