<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('thuoc', function (Blueprint $table) {
			$table->id();
			$table->string('ma_thuoc', 20)->unique();
			$table->string('ten_thuoc', 200);
			$table->string('hoat_chat', 200)->nullable();
			$table->enum('don_vi', ['vien', 'goi', 'ong', 'ml', 'lo', 'hop', 'chai']);
			$table->string('ham_luong', 50)->nullable();
			$table->enum('duong_dung', ['uong', 'tiem', 'truyen', 'boi', 'nho', 'xit']);
			$table->text('huong_dan_su_dung')->nullable();
			$table->enum('trang_thai', ['hoat_dong', 'ngung_su_dung'])->default('hoat_dong');
			$table->timestamps();

			$table->index('ten_thuoc');
			$table->index('hoat_chat');
			$table->index('trang_thai');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('thuoc');
	}
};
