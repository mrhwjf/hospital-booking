<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bac_si_nghi', function (Blueprint $table) {

            $table->id();

            $table->foreignId('bac_si_id')
                ->constrained('bac_si')
                ->cascadeOnDelete();

            $table->date('ngay');

            $table->time('gio_bat_dau')->nullable();

            $table->time('gio_ket_thuc')->nullable();

            $table->text('ly_do')->nullable();

            $table->enum('trang_thai', ['hoat_dong', 'huy'])->default('hoat_dong');

            $table->timestamp('created_at')->useCurrent();

            $table->index(['bac_si_id', 'ngay']);
            $table->index('trang_thai');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bac_si_nghi');
    }
};
