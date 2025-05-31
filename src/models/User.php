<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    public $incrementing = false;

    protected $fillable = [
        'username',
        'email',
        'password',
        'statut_id',
        'last_connexion',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_connexion' => 'datetime', // Changé ici
        'password' => 'hashed',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public static function queryFilters(): array
    {
        return [
            'self' => function (Builder $query, $user) {
                $query->where('id', $user->id);
            },
            'mutualiste' => function (Builder $query, $user) {
                $query->where('id', $user->id);
            },
        ];
    }

    // Relations inchangées
    public function statut()
    {
        return $this->belongsTo(StatusType::class, 'statut_id');
    }

    public function admin()
    {
        return $this->hasOne(Admin::class, 'id'); // Lier users.id à admins.id
    }

    public function mutualiste()
    {
        return $this->hasOne(Mutualiste::class, 'id'); // Lier users.id à mutualistes.id
    }


    public function posts(){
        return $this->hasMany(Post::class);
    }

    // Define the relationship to roles via the user_role pivot table
    public function roles(): BelongsToMany
    {
        // role_id is integer, user_id is string (UUID)
        return $this->belongsToMany(Role::class, 'user_role', 'user_id', 'role_id')
            ->using(UserRole::class)
            ->withPivot('created_by_user_id', 'updated_by_user_id')
            ->withTimestamps();
    }

     // Method to get all permissions through roles
     public function getPermissions()
     {
         // Load roles and their permissions if not already loaded to avoid N+1 issues
         if (! $this->relationLoaded('roles') || $this->roles->isEmpty() || ! $this->roles->every(fn($role) => $role->relationLoaded('permissions'))) {
              $this->load('roles.permissions');
         }

         // Pluck permissions from all roles, flatten the collection of collections, and get unique permissions
         return $this->roles->pluck('permissions')->flatten()->unique('id')->pluck('name')->toArray(); // Use unique('id') to compare by permission ID
     }

    public function hasPermission(string $permissionName){
      return in_array($permissionName, $this->getPermissions());
    }

    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participant', 'user_id', 'conversation_id')
                    ->using(ConversationParticipant::class) // Utiliser le modèle pivot
                    ->withPivot('date_jointure', 'est_actif') // Charger les champs supplémentaires
                    ->withTimestamps(); // Gérer created_at/updated_at de la pivot
    }


}
