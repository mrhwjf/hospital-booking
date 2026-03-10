<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ngay_nghi_le', function (Blueprint $table) {

            $table->id();

            $table->string('ten_ngay_nghi');

            $table->date('ngay')->unique();

            $table->text('mo_ta')->nullable();

            $table->enum('trang_thai', ['hoat_dong', 'huy'])->default('hoat_dong');

            $table->timestamp('created_at')->useCurrent();

            $table->index('trang_thai');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ngay_nghi_le');
    }
};
