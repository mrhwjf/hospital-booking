<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement("UPDATE tai_lieu_ho_so SET file_public_id = CONCAT('PENDING:', ma_tai_lieu) WHERE file_public_id IS NULL OR TRIM(file_public_id) = ''");
        DB::statement('ALTER TABLE tai_lieu_ho_so MODIFY file_public_id VARCHAR(500) NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE tai_lieu_ho_so MODIFY file_public_id VARCHAR(500) NULL');
    }
};
