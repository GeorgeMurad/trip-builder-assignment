<?php

namespace Database\Seeders;

use App\Models\Airline;
use Illuminate\Database\Seeder;

class AirlineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $airlines = [
            ['code' => 'AC', 'name' => 'Air Canada'],
            ['code' => 'WS', 'name' => 'WestJet'],
            ['code' => 'PD', 'name' => 'Porter Airlines'],
            ['code' => 'TS', 'name' => 'Air Transat'],
            ['code' => 'WG', 'name' => 'Sunwing Airlines'],
            ['code' => 'AA', 'name' => 'American Airlines'],
            ['code' => 'DL', 'name' => 'Delta Air Lines'],
            ['code' => 'UA', 'name' => 'United Airlines'],
            ['code' => 'AF', 'name' => 'Air France'],
            ['code' => 'LH', 'name' => 'Lufthansa'],
            ['code' => 'BA', 'name' => 'British Airways'],
            ['code' => 'EK', 'name' => 'Emirates'],
            ['code' => 'QR', 'name' => 'Qatar Airways'],
        ];

        foreach ($airlines as $airline) {
            Airline::updateOrCreate(
                ['code' => $airline['code']],
                ['name' => $airline['name']],
            );
        }
    }
}
