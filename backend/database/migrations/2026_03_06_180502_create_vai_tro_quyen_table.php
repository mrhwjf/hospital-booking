<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('vai_tro_quyen', function (Blueprint $table) {
			$table->id();
			$table->foreignId('vai_tro_id')->constrained('vai_tro')->cascadeOnDelete();
			$table->foreignId('quyen_id')->constrained('quyen')->cascadeOnDelete();
			$table->timestamp('created_at')->useCurrent();

			$table->unique(['vai_tro_id', 'quyen_id']);
			$table->index('vai_tro_id');
			$table->index('quyen_id');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('vai_tro_quyen');
	}
};
