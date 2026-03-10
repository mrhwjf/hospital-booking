<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('chi_tiet_don_thuoc', function (Blueprint $table) {
			$table->id();
			$table->foreignId('don_thuoc_id')->constrained('don_thuoc')->cascadeOnDelete();
			$table->foreignId('thuoc_id')->constrained('thuoc')->restrictOnDelete();
			$table->integer('so_luong');
			$table->string('lieu_dung', 200);
			$table->enum('thoi_diem', ['truoc_an', 'sau_an', 'trong_an', 'khong_lien_quan'])->default('khong_lien_quan');
			$table->integer('so_ngay');
			$table->text('ghi_chu')->nullable();
			$table->timestamp('created_at')->useCurrent();

			$table->index('don_thuoc_id');
			$table->index('thuoc_id');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('chi_tiet_don_thuoc');
	}
};
