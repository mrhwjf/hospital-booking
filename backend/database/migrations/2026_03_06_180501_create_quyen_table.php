<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('quyen', function (Blueprint $table) {
			$table->id();
			$table->string('ma_quyen', 50)->unique();
			$table->string('ten_quyen', 100);
			$table->text('mo_ta')->nullable();
			$table->enum('nhom_quyen', ['quan_tri', 'nguoi_dung', 'le_tan', 'bac_si', 'khac'])->nullable();
			$table->timestamp('created_at')->useCurrent();

			$table->index('ma_quyen');
			$table->index('nhom_quyen');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('quyen');
	}
};