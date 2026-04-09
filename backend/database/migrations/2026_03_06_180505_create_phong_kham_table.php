<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('phong_kham', function (Blueprint $table) {
			$table->id();
			$table->string('ma_phong', 50)->unique();
			$table->string('ten_phong', 100);
			$table->foreignId('chuyen_khoa_id')->nullable()->constrained('chuyen_khoa')->nullOnDelete();
			$table->string('vi_tri', 100);
			$table->text('trang_thiet_bi')->nullable();
			$table->enum('trang_thai', ['hoat_dong', 'bao_tri', 'ngung_su_dung'])->default('hoat_dong');
			$table->text('ghi_chu')->nullable();
			$table->timestamps();

			$table->index('chuyen_khoa_id');
			$table->index('trang_thai');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('phong_kham');
	}
};
