<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement('ALTER TABLE tai_lieu_ho_so MODIFY ma_tai_lieu VARCHAR(80) NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE tai_lieu_ho_so MODIFY ma_tai_lieu VARCHAR(20) NOT NULL');
    }
};
