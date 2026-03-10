<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('dich_vu_lich_hen', function (Blueprint $table) {
			$table->id();
			$table->foreignId('lich_hen_id')->constrained('lich_hen')->cascadeOnDelete();
			$table->foreignId('dich_vu_id')->nullable()->constrained('dich_vu')->restrictOnDelete();
			$table->foreignId('goi_kham_id')->nullable()->constrained('goi_kham')->restrictOnDelete();
			$table->integer('so_luong')->default(1);
			$table->text('ghi_chu')->nullable();
			$table->timestamps();

			$table->unique(['lich_hen_id', 'dich_vu_id']);
			$table->unique(['lich_hen_id', 'goi_kham_id']);
			$table->index('lich_hen_id');
			$table->index('dich_vu_id');
			$table->index('goi_kham_id');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('dich_vu_lich_hen');
	}
};
