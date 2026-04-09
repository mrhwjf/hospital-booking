<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('goi_kham', function (Blueprint $table) {

            $table->id();

            $table->string('ma_goi_kham', 50)->unique();
            $table->string('ten_goi_kham', 200);

            $table->text('mo_ta')->nullable();

            $table->decimal('gia_goi_kham', 12, 0)->default(0);

            $table->integer('thoi_gian_du_kien')->nullable();

            $table->enum('trang_thai', ['hoat_dong', 'tam_ngung'])->default('hoat_dong');

            $table->timestamps();

            $table->index('trang_thai');
            $table->index('ten_goi_kham');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goi_kham');
    }
};
