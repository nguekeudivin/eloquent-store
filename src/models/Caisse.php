<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\Entree;
use App\Models\Sortie;


class Caisse extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'devise',
    ];

    protected $casts = [
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

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }

    public function entrees(): HasMany
    {
        return $this->hasMany(Entree::class, 'caisse_id');
    }

    public function sorties(): HasMany
    {
        return $this->hasMany(Sortie::class, 'caisse_id');
    }

    /**
     * Calcule le solde actuel de la caisse.
     *
     * @return float
     */
    public function getSoldeActuel(): float
    {
        $totalEntrees = $this->entrees()->sum('montant');
        $totalSorties = $this->sorties()->sum('montant');

        return $totalEntrees - $totalSorties;
    }

}
