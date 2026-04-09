<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('don_thuoc', function (Blueprint $table) {
			$table->id();
			$table->string('ma_don_thuoc', 50)->unique();
			$table->foreignId('phieu_kham_id')->unique()->constrained('phieu_kham')->cascadeOnDelete();
			$table->date('ngay_ke');
			$table->text('ghi_chu')->nullable();
			$table->enum('trang_thai', ['moi_tao', 'da_cap', 'huy'])->default('moi_tao');
			$table->timestamps();

			$table->index('ngay_ke');
			$table->index('trang_thai');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('don_thuoc');
	}
};
