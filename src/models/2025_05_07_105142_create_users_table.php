<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->string('id')->primary();

            $table->string('username')->unique();
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            $table->foreignId('statut_id')
                  ->constrained('status_types')
                  ->onDelete('RESTRICT')
                  ->onUpdate('CASCADE');

            $table->dateTime('last_connexion')->nullable(); // Changé ici

            $table->rememberToken()->nullable();

            $table->timestamps();

            $table->index('statut_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
