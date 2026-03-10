<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('chuyen_khoa', function (Blueprint $table) {
			$table->foreign('truong_khoa_id')
				->references('id')
				->on('bac_si')
				->nullOnDelete()
				->cascadeOnUpdate();
		});
	}

	public function down(): void
	{
		Schema::table('chuyen_khoa', function (Blueprint $table) {
			$table->dropForeign(['truong_khoa_id']);
		});
	}
};
