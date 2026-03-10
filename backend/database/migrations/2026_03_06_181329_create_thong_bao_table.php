<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('thong_bao', function (Blueprint $table) {
			$table->id();
			$table->foreignId('nguoi_nhan_id')->constrained('nguoi_dung')->cascadeOnDelete();
			$table->string('tieu_de', 200);
			$table->text('noi_dung');
			$table->enum('loai', ['lich_hen', 'he_thong', 'nhac_nho']);
			$table->string('lien_ket')->nullable();
			$table->boolean('da_doc')->default(false);
			$table->timestamp('created_at')->useCurrent();

			$table->index('nguoi_nhan_id');
			$table->index('da_doc');
			$table->index('loai');
			$table->index('created_at');
			$table->index(['nguoi_nhan_id', 'da_doc']);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('thong_bao');
	}
};
