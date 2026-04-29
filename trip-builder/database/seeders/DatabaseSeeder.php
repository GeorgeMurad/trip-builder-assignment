<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Model::unguarded(function () {
            $this->call([
                AirlineSeeder::class,
                AirportSeeder::class,
                FlightSeeder::class,
            ]);
        });
    }
}
