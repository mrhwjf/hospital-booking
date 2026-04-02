<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('nguoi_dung', function (Blueprint $table) {
			$table->id();
			$table->string('email')->unique();
			$table->string('ho_ten')->nullable();
			$table->string('mat_khau');
			$table->foreignId('vai_tro_id')->constrained('vai_tro')->restrictOnDelete();
			$table->string('hinh_anh')->nullable();
			$table->string('hinh_anh_public_id')->nullable();
			$table->enum('trang_thai', ['hoat_dong', 'tam_khoa', 'khoa'])->default('hoat_dong');
			$table->timestamp('lan_dang_nhap_cuoi')->nullable();
			$table->timestamps();

			$table->index('vai_tro_id');
			$table->index('trang_thai');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('nguoi_dung');
	}
};
