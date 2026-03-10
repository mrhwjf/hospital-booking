<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('icd10', function (Blueprint $table) {
			$table->string('ma_icd10', 10)->primary();
			$table->string('ten_chan_doan', 255);
			$table->string('nhom_chuong', 20)->nullable();
			$table->text('mo_ta')->nullable();
			$table->enum('trang_thai', ['hoat_dong', 'an'])->default('hoat_dong');
			$table->timestamps();

			$table->index('ten_chan_doan');
			$table->index('nhom_chuong');
			$table->index('trang_thai');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('icd10');
	}
};
