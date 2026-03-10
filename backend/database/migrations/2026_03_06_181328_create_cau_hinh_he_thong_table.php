<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('cau_hinh_he_thong', function (Blueprint $table) {
			$table->id();
			$table->string('khoa', 100)->unique();
			$table->text('gia_tri');
			$table->text('mo_ta')->nullable();
			$table->string('nhom', 50)->nullable();
			$table->timestamps();

			$table->index('nhom');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('cau_hinh_he_thong');
	}
};
