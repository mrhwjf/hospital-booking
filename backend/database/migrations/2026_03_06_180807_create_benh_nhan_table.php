<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('benh_nhan', function (Blueprint $table) {

            $table->id();

            $table->string('ma_benh_nhan', 50)->unique();

            $table->foreignId('nguoi_dung_id')
                ->nullable()
                ->unique()
                ->constrained('nguoi_dung')
                ->nullOnDelete();

            $table->string('ho_ten');
            $table->date('ngay_sinh');

            $table->enum('gioi_tinh', ['nam', 'nu', 'khac']);

            $table->string('so_dien_thoai', 15);

            $table->string('email')->nullable();

            $table->string('so_cccd', 12)->nullable()->unique();

            $table->text('dia_chi')->nullable();

            $table->string('nguoi_lien_he')->nullable();
            $table->string('sdt_nguoi_lien_he')->nullable();

            $table->enum('nhom_mau', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])->nullable();

            $table->text('tien_su_di_ung')->nullable();
            $table->text('tien_su_benh')->nullable();

            $table->text('ghi_chu')->nullable();

            $table->enum('trang_thai', ['hoat_dong', 'khoa'])->default('hoat_dong');

            $table->timestamps();

            $table->index('so_dien_thoai');
            $table->index('ho_ten');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('benh_nhan');
    }
};