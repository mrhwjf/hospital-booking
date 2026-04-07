<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
	public function up(): void
	{
		DB::statement("UPDATE phieu_kham SET trang_thai = 'dang_kham' WHERE trang_thai = 'cho_ke_don'");
		DB::statement("ALTER TABLE phieu_kham MODIFY trang_thai ENUM('tiep_nhan','dang_kham','hoan_thanh') NOT NULL DEFAULT 'tiep_nhan'");
	}

	public function down(): void
	{
		DB::statement("ALTER TABLE phieu_kham MODIFY trang_thai ENUM('tiep_nhan','dang_kham','cho_ke_don','hoan_thanh') NOT NULL DEFAULT 'tiep_nhan'");
	}
};
