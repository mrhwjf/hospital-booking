<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

/**
 * This "Seeder" is not meant to be run as part of normal seeding. 
 * Instead, it serves as a utility to dump the current database contents into a text file for debugging or record-keeping purposes. 
 * It iterates through all tables in the database and writes their contents in a tab-separated format to a file named "database_dump.txt" in the storage/app directory.
 */
class DatabaseDumpSeeder extends Seeder
{
	/**
	 * Run the database dump seeder.
	 */
	public function run(): void
	{
		$outputFile = storage_path('app/database_dump.txt');

		// Ensure directory exists
		File::ensureDirectoryExists(dirname($outputFile));

		// Open file for writing
		$fh = fopen($outputFile, 'w');
		if (!$fh) {
			$this->command->error("Cannot open file $outputFile for writing");
			return;
		}

		$database = env('DB_DATABASE');

		// Get all tables with lowercase name
		$tables = DB::select("SELECT LOWER(table_name) AS table_name FROM information_schema.tables WHERE table_schema = ?", [$database]);

		foreach ($tables as $tableObj) {
			$table = $tableObj->table_name; // guaranteed lowercase
			fwrite($fh, "===== Table: $table =====\n");

			$rows = DB::table($table)->get()->toArray();

			if (empty($rows)) {
				fwrite($fh, "(empty table)\n\n");
				continue;
			}

			// Write column headers
			$columns = array_keys((array) $rows[0]);
			fwrite($fh, implode("\t", $columns) . "\n");

			// Write each row
			foreach ($rows as $row) {
				$line = [];
				foreach ($columns as $col) {
					$line[] = str_replace("\t", " ", (string) $row->$col); // replace tabs in data
				}
				fwrite($fh, implode("\t", $line) . "\n");
			}

			fwrite($fh, "\n"); // empty line between tables
		}

		fclose($fh);
		$this->command->info("Database dump written to $outputFile");
	}
}