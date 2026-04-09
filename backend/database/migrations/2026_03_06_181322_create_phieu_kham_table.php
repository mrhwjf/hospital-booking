<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('phieu_kham', function (Blueprint $table) {
			$table->id();
			$table->string('ma_phieu_kham', 50)->unique();
			$table->foreignId('lich_hen_id')->nullable()->unique()->constrained('lich_hen')->restrictOnDelete();
			$table->foreignId('benh_nhan_id')->constrained('benh_nhan')->restrictOnDelete();
			$table->foreignId('bac_si_id')->constrained('bac_si')->restrictOnDelete();
			$table->foreignId('nguoi_tao_id')->nullable()->constrained('nguoi_dung')->nullOnDelete();
			$table->timestamp('thoi_gian_tiep_nhan')->nullable();

			$table->integer('mach')->nullable();
			$table->decimal('nhiet_do', 3, 1)->nullable();
			$table->string('huyet_ap', 10)->nullable();
			$table->decimal('can_nang', 5, 2)->nullable();
			$table->decimal('chieu_cao', 5, 2)->nullable();

			$table->text('trieu_chung')->nullable();
			$table->text('ket_qua_kham')->nullable();
			$table->string('chan_doan', 500)->nullable();
			$table->string('ma_icd10_chinh', 10)->nullable();
			$table->enum('tinh_trang', ['nhe', 'trung_binh', 'nang'])->nullable();
			$table->text('huong_dieu_tri')->nullable();
			$table->text('loi_dan')->nullable();
			$table->date('hen_tai_kham')->nullable();
			$table->text('ghi_chu_noi_bo')->nullable();

			$table->enum('trang_thai', ['tiep_nhan', 'dang_kham', 'hoan_thanh'])->default('tiep_nhan');
			$table->timestamps();

			$table->index('benh_nhan_id');
			$table->index('bac_si_id');
			$table->index('nguoi_tao_id');
			$table->index('ma_icd10_chinh');
			$table->index('trang_thai');
			$table->index(['benh_nhan_id', 'created_at']);
			$table->index('chan_doan');

			$table->foreign('ma_icd10_chinh')->references('ma_icd10')->on('icd10')->nullOnDelete()->cascadeOnUpdate();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('phieu_kham');
	}
};
