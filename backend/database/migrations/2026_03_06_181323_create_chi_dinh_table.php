<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration {
    public function up(): void
    {
        Schema::create('chi_dinh', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phieu_kham_id')->constrained('phieu_kham')->cascadeOnDelete();
            $table->foreignId('bac_si_id')->constrained('bac_si')->restrictOnDelete();
            $table->foreignId('dich_vu_id')->nullable()->constrained('dich_vu')->restrictOnDelete();
            $table->foreignId('goi_kham_id')->nullable()->constrained('goi_kham')->restrictOnDelete();
            $table->integer('so_luong')->default(1);
            $table->enum('trang_thai', ['cho_thuc_hien', 'da_hoan_thanh', 'huy'])->default('cho_thuc_hien');
            $table->date('ngay_chi_dinh');
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->index('phieu_kham_id');
            $table->index('bac_si_id');
            $table->index('dich_vu_id');
            $table->index('goi_kham_id');
            $table->index('trang_thai');
            $table->index('ngay_chi_dinh');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chi_dinh');
    }
};
