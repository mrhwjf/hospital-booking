<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tai_lieu_ho_so', function (Blueprint $table) {
            $table->id();
            $table->string('ma_tai_lieu', 20)->unique();
            $table->foreignId('phieu_kham_id')->constrained('phieu_kham')->cascadeOnDelete();
            $table->enum('loai_tai_lieu', [
                'ket_qua_xet_nghiem',
                'ket_qua_sieu_am',
                'ket_qua_xquang',
                'ket_qua_ct_scan',
                'ket_qua_mri',
                'ket_qua_noi_soi',
                'phieu_chi_dinh',
                'bao_cao_phau_thuat',
                'giay_ra_vien',
                'khac',
            ]);
            $table->string('ten_tai_lieu', 200);
            $table->string('file_public_id', 500);
            $table->date('ngay_tao');
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->index('phieu_kham_id');
            $table->index('loai_tai_lieu');
            $table->index('ngay_tao');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tai_lieu_ho_so');
    }
};