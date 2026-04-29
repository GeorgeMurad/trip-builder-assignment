<?php

namespace Database\Seeders;

use App\Models\Airport;
use Illuminate\Database\Seeder;

class AirportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $airports = [
            // Canada 🇨🇦
            [
                'code' => 'YUL',
                'city_code' => 'YMQ',
                'name' => 'Montreal-Trudeau International Airport',
                'city' => 'Montreal',
                'country_code' => 'CA',
                'region_code' => 'QC',
                'latitude' => 45.470600,
                'longitude' => -73.740800,
                'timezone' => 'America/Montreal',
            ],
            [
                'code' => 'YVR',
                'city_code' => 'YVR',
                'name' => 'Vancouver International Airport',
                'city' => 'Vancouver',
                'country_code' => 'CA',
                'region_code' => 'BC',
                'latitude' => 49.193900,
                'longitude' => -123.184400,
                'timezone' => 'America/Vancouver',
            ],
            [
                'code' => 'YYZ',
                'city_code' => 'YTO',
                'name' => 'Toronto Pearson International Airport',
                'city' => 'Toronto',
                'country_code' => 'CA',
                'region_code' => 'ON',
                'latitude' => 43.677700,
                'longitude' => -79.624800,
                'timezone' => 'America/Toronto',
            ],
            [
                'code' => 'YYC',
                'city_code' => 'YYC',
                'name' => 'Calgary International Airport',
                'city' => 'Calgary',
                'country_code' => 'CA',
                'region_code' => 'AB',
                'latitude' => 51.113900,
                'longitude' => -114.020300,
                'timezone' => 'America/Edmonton',
            ],
            [
                'code' => 'YOW',
                'city_code' => 'YOW',
                'name' => 'Ottawa Macdonald-Cartier International Airport',
                'city' => 'Ottawa',
                'country_code' => 'CA',
                'region_code' => 'ON',
                'latitude' => 45.322500,
                'longitude' => -75.669200,
                'timezone' => 'America/Toronto',
            ],
        
            // USA 🇺🇸
            [
                'code' => 'JFK',
                'city_code' => 'NYC',
                'name' => 'John F. Kennedy International Airport',
                'city' => 'New York',
                'country_code' => 'US',
                'region_code' => 'NY',
                'latitude' => 40.641300,
                'longitude' => -73.778100,
                'timezone' => 'America/New_York',
            ],
            [
                'code' => 'LAX',
                'city_code' => 'LAX',
                'name' => 'Los Angeles International Airport',
                'city' => 'Los Angeles',
                'country_code' => 'US',
                'region_code' => 'CA',
                'latitude' => 33.941600,
                'longitude' => -118.408500,
                'timezone' => 'America/Los_Angeles',
            ],
        
            // Europe 🇪🇺
            [
                'code' => 'CDG',
                'city_code' => 'PAR',
                'name' => 'Charles de Gaulle Airport',
                'city' => 'Paris',
                'country_code' => 'FR',
                'region_code' => 'IDF',
                'latitude' => 49.009700,
                'longitude' => 2.547900,
                'timezone' => 'Europe/Paris',
            ],
            [
                'code' => 'LHR',
                'city_code' => 'LON',
                'name' => 'Heathrow Airport',
                'city' => 'London',
                'country_code' => 'GB',
                'region_code' => 'ENG',
                'latitude' => 51.470000,
                'longitude' => -0.454300,
                'timezone' => 'Europe/London',
            ],
        ];

        foreach ($airports as $airport) {
            Airport::updateOrCreate(
                ['code' => $airport['code']],
                $airport,
            );
        }
    }
}
