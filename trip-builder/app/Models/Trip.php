<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trip extends Model
{
    use HasFactory;

    public function tripFlights(): HasMany
    {
        return $this->hasMany(TripFlight::class)->orderBy('segment_order');
    }

    public function flights(): BelongsToMany
    {
        return $this->belongsToMany(Flight::class, 'trip_flights')
            ->withPivot(['segment_order', 'departure_date'])
            ->withTimestamps();
    }
}
