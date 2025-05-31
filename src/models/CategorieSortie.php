<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\Sortie;


class CategorieSortie extends Model
{
    use HasFactory;

    protected $table = 'categorie_sorties';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'libelle',
        'description',
        'est_active',
    ];

    protected $casts = [
        'est_active' => 'boolean',
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

    public function sorties(): HasMany
    {
        return $this->hasMany(Sortie::class, 'categorie_sortie_id');
    }

    /**
     * Change le statut "est_active" à false.
     *
     * @return bool Succès de la sauvegarde.
     */
    public function desactiver(): bool
    {
        $this->est_active = false;
        return $this->save();
    }

    /**
     * Change le statut "est_active" à true.
     *
     * @return bool Succès de la sauvegarde.
     */
    public function activer(): bool
    {
        $this->est_active = true;
        return $this->save();
    }

}
