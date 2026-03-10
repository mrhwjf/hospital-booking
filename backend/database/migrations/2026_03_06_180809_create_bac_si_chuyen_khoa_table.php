<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bac_si_chuyen_khoa', function (Blueprint $table) {

            $table->id();

            $table->foreignId('bac_si_id')
                ->constrained('bac_si')
                ->cascadeOnDelete();

            $table->foreignId('chuyen_khoa_id')
                ->constrained('chuyen_khoa')
                ->cascadeOnDelete();

            $table->boolean('la_chuyen_khoa_chinh')->default(false);

            $table->text('ghi_chu')->nullable();

            $table->timestamps();

            $table->unique(['bac_si_id', 'chuyen_khoa_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bac_si_chuyen_khoa');
    }
};
