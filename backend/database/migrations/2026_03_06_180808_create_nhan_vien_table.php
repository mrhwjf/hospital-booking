<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('nhan_vien', function (Blueprint $table) {


            $table->id();


            $table->string('ma_nhan_vien', 20)->unique();


            $table->foreignId('nguoi_dung_id')
                ->unique()
                ->constrained('nguoi_dung');


            $table->string('ho_ten');


            $table->string('so_dien_thoai');


            $table->enum('chuc_vu', ['le_tan', 'nhan_vien_y_te', 'dieu_duong']);


            $table->date('ngay_vao_lam');


            $table->enum('trang_thai', ['hoat_dong', 'tam_khoa', 'nghi_viec'])->default('hoat_dong');


            $table->text('ghi_chu')->nullable();


            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('nhan_vien');
    }
};
