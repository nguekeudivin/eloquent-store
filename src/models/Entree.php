<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;


class Entree extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'entrees';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'caisse_id',
        'categorie_entree_id',
        'date_heure_mouvement',
        'montant',
        'source_motif',
        'description',
        'reference_externe',
        'date_enregistrement',
        'enregistre_par_admin_id',
    ];

    protected $casts = [
        'caisse_id' => 'int',
        'categorie_entree_id' => 'int',
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

    public function categorie_entree(): BelongsTo
    {
        return $this->belongsTo(CategorieEntree::class, 'categorie_entree_id');
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
}
