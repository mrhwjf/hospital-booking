<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bac_si', function (Blueprint $table) {

            $table->id();

            $table->string('ma_bac_si', 20)->unique();

            $table->foreignId('nguoi_dung_id')
                ->unique()
                ->constrained('nguoi_dung');

            $table->string('ho_ten');

            $table->string('so_dien_thoai');

            $table->enum('hoc_vi', ['bac_si', 'thac_si', 'tien_si', 'pgs', 'gs'])->default('bac_si');

            $table->string('chung_chi_hanh_nghe');

            $table->integer('kinh_nghiem')->nullable();

            $table->text('gioi_thieu')->nullable();

            $table->enum('trang_thai', ['hoat_dong', 'tam_nghi', 'nghi_viec'])->default('hoat_dong');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bac_si');
    }
};
