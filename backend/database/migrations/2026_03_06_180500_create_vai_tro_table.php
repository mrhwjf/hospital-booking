<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('vai_tro', function (Blueprint $table) {
			$table->id();
			$table->string('ma_vai_tro', 50)->unique();
			$table->string('ten_vai_tro', 100);
			$table->text('mo_ta')->nullable();
			$table->enum('trang_thai', ['hoat_dong', 'khoa'])->default('hoat_dong');
			$table->timestamps();

			$table->index('ma_vai_tro');
			$table->index('trang_thai');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('vai_tro');
	}
};
