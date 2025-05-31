<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Caisse;
use App\Models\CategorieSortie;
use App\Models\User;
use Illuminate\Support\Carbon;


class Sortie extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sorties';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'caisse_id',
        'categorie_sortie_id',
        'date_heure_mouvement',
        'montant',
        'beneficiaire_motif',
        'description',
        'reference_externe',
        'date_enregistrement',
        'enregistre_par_admin_id',
    ];

    protected $casts = [
        'caisse_id' => 'int',
        'categorie_sortie_id' => 'int',
        'date_heure_mouvement' => 'datetime',
        'montant' => 'decimal:2',
        'date_enregistrement' => 'datetime',
        'enregistre_par_admin_id' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

     protected $guarded = [
         'id',
         'created_by_user_id',
         'updated_by_user_id',
         'created_at',
         'updated_at',
     ];

    public function caisse(): BelongsTo
    {
        return $this->belongsTo(Caisse::class, 'caisse_id');
    }

    public function categorie_sortie(): BelongsTo
    {
        return $this->belongsTo(CategorieSortie::class, 'categorie_sortie_id');
    }

    public function enregistreParAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enregistre_par_admin_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }

     /**
     * Enregistre un mouvement de sortie d'argent d'une caisse.
     *
     * @param array $data Les données de la sortie.
     * @param string $adminId L'ID de l'admin qui enregistre.
     * @return Sortie Le modèle Sortie créé.
     */
    // public static function enregistrer(array $data, string $adminId): Sortie
    // {
        // $data['enregistre_par_admin_id'] = $adminId;
        // $data['date_enregistrement'] = now();
        // return self::create($data);
    // }

    public static function queryFilters(): array
    {
        return [
            'caisse' => function (\Illuminate\Database\Eloquent\Builder $query, int $caisseId) {
                $query->where('caisse_id', $caisseId);
            },
            'categorie' => function (\Illuminate\Database\Eloquent\Builder $query, int $categorieId) {
                 $query->where('categorie_sortie_id', $categorieId);
            },
             'enregistre_par' => function (\Illuminate\Database\Eloquent\Builder $query, string $adminId) {
                 $query->where('enregistre_par_admin_id', $adminId);
             },
             'date_mouvement_after' => function (\Illuminate\Database\Eloquent\Builder $query, string $date) {
                 $query->where('date_heure_mouvement', '>=', $date);
             },
              'date_mouvement_before' => function (\Illuminate\Database\Eloquent\Eloquent\Builder $query, string $date) {
                 $query->where('date_heure_mouvement', '<=', $date);
             },
             'date_enregistrement_after' => function (\Illuminate\Database\Eloquent\Builder $query, string $date) {
                 $query->where('date_enregistrement', '>=', $date);
             },
              'date_enregistrement_before' => function (\Illuminate\Database\Eloquent\Eloquent\Builder $query, string $date) {
                 $query->where('date_enregistrement', '<=', $date);
             },
        ];
    }
}
