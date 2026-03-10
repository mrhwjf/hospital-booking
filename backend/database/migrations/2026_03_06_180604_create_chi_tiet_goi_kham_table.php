<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chi_tiet_goi_kham', function (Blueprint $table) {

            $table->id();

            $table->foreignId('goi_kham_id')
                  ->constrained('goi_kham')
                  ->cascadeOnDelete();

            $table->foreignId('dich_vu_id')
                  ->constrained('dich_vu');

            $table->integer('thu_tu_hien_thi')->default(0);

            $table->timestamps();

            $table->unique(['goi_kham_id','dich_vu_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chi_tiet_goi_kham');
    }
};