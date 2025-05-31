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
        Schema::create('entrees', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->unsignedBigInteger('caisse_id');
            $table->unsignedBigInteger('categorie_entree_id')->nullable();

            $table->dateTime('date_heure_mouvement');
            $table->decimal('montant', 10, 2);
            $table->string('source_motif');
            $table->text('description')->nullable();
            $table->string('reference_externe')->nullable();

            $table->dateTime('date_enregistrement');
            $table->uuid('enregistre_par_admin_id');

            $table->timestamps();

            $table->uuid('created_by_user_id')->nullable();
            $table->uuid('updated_by_user_id')->nullable();

            $table->foreign('caisse_id')->references('id')->on('caisses')->onDelete('restrict');
            $table->foreign('categorie_entree_id')->references('id')->on('categorie_entrees')->onDelete('set null');
            $table->foreign('enregistre_par_admin_id')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by_user_id')->references('id')->on('users')->onDelete('set null');

            $table->index('caisse_id');
            $table->index('categorie_entree_id');
            $table->index('date_heure_mouvement');
            $table->index('enregistre_par_admin_id');
            $table->index('created_by_user_id');
            $table->index('updated_by_user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrees');
    }
};
