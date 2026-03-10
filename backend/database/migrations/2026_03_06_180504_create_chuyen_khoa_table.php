<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('chuyen_khoa', function (Blueprint $table) {
			$table->id();
			$table->string('ma_chuyen_khoa', 20)->unique();
			$table->string('ten_chuyen_khoa', 100);
			$table->text('mo_ta')->nullable();
			$table->string('hinh_anh')->nullable();
			$table->string('vi_tri', 100)->nullable();
			$table->string('so_dien_thoai', 15)->nullable();
			$table->unsignedBigInteger('truong_khoa_id')->nullable();
			$table->integer('thu_tu_hien_thi')->default(0);
			$table->enum('trang_thai', ['hoat_dong', 'tam_ngung'])->default('hoat_dong');
			$table->timestamps();

			$table->index('ten_chuyen_khoa');
			$table->index('trang_thai');
			$table->index('thu_tu_hien_thi');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('chuyen_khoa');
	}
};
