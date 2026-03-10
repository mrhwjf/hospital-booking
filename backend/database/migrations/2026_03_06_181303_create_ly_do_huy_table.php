<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ly_do_huy', function (Blueprint $table) {

            $table->id();

            $table->string('ma_ly_do')->unique();

            $table->string('ten_ly_do');

            $table->enum('loai', ['benh_nhan', 'bac_si', 'he_thong']);

            $table->integer('thu_tu')->default(0);

            $table->enum('trang_thai', ['hoat_dong', 'an'])->default('hoat_dong');

            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ly_do_huy');
    }
};
