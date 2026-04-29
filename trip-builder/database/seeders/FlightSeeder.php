<?php

namespace Database\Seeders;

use App\Models\Airline;
use App\Models\Airport;
use App\Models\Flight;
use Illuminate\Database\Seeder;

class FlightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $airlines = Airline::whereIn('code', ['AC', 'WS', 'PD', 'AF'])
            ->get()
            ->keyBy('code');

        $airports = Airport::whereIn('code', ['YUL', 'YVR', 'YYZ', 'YYC', 'YOW', 'CDG'])
            ->get()
            ->keyBy('code');

            $flights = [

                // =========================
                // YUL ↔ YVR (ALL airlines)
                // =========================
            
                ['number' => 'AC301', 'airline_code' => 'AC', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YVR', 'departure_time' => '07:35', 'arrival_time' => '10:05', 'price' => 273],
                ['number' => 'AC302', 'airline_code' => 'AC', 'departure_airport_code' => 'YVR', 'arrival_airport_code' => 'YUL', 'departure_time' => '11:30', 'arrival_time' => '19:11', 'price' => 220],
            
                ['number' => 'WS301', 'airline_code' => 'WS', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YVR', 'departure_time' => '08:30', 'arrival_time' => '11:00', 'price' => 250],
                ['number' => 'WS302', 'airline_code' => 'WS', 'departure_airport_code' => 'YVR', 'arrival_airport_code' => 'YUL', 'departure_time' => '14:00', 'arrival_time' => '21:00', 'price' => 240],
            
                ['number' => 'PD301', 'airline_code' => 'PD', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YVR', 'departure_time' => '06:45', 'arrival_time' => '09:20', 'price' => 260],
                ['number' => 'PD302', 'airline_code' => 'PD', 'departure_airport_code' => 'YVR', 'arrival_airport_code' => 'YUL', 'departure_time' => '12:10', 'arrival_time' => '19:35', 'price' => 255],
            
                ['number' => 'AF301', 'airline_code' => 'AF', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YVR', 'departure_time' => '15:30', 'arrival_time' => '18:05', 'price' => 310],
                ['number' => 'AF302', 'airline_code' => 'AF', 'departure_airport_code' => 'YVR', 'arrival_airport_code' => 'YUL', 'departure_time' => '20:00', 'arrival_time' => '03:25', 'price' => 299],
            
            
                // =========================
                // YUL ↔ YYZ (ALL airlines)
                // =========================
            
                ['number' => 'AC101', 'airline_code' => 'AC', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YYZ', 'departure_time' => '08:00', 'arrival_time' => '09:15', 'price' => 150],
                ['number' => 'AC102', 'airline_code' => 'AC', 'departure_airport_code' => 'YYZ', 'arrival_airport_code' => 'YUL', 'departure_time' => '18:00', 'arrival_time' => '19:15', 'price' => 140],
            
                ['number' => 'WS101', 'airline_code' => 'WS', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YYZ', 'departure_time' => '09:00', 'arrival_time' => '10:20', 'price' => 145],
                ['number' => 'WS102', 'airline_code' => 'WS', 'departure_airport_code' => 'YYZ', 'arrival_airport_code' => 'YUL', 'departure_time' => '17:00', 'arrival_time' => '18:20', 'price' => 140],
            
                ['number' => 'PD101', 'airline_code' => 'PD', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YYZ', 'departure_time' => '07:30', 'arrival_time' => '08:50', 'price' => 135],
                ['number' => 'PD102', 'airline_code' => 'PD', 'departure_airport_code' => 'YYZ', 'arrival_airport_code' => 'YUL', 'departure_time' => '16:30', 'arrival_time' => '17:50', 'price' => 130],
            
            
                // =========================
                // YUL ↔ YOW (FIXED 🔥)
                // =========================
            
                ['number' => 'AC401', 'airline_code' => 'AC', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YOW', 'departure_time' => '09:00', 'arrival_time' => '10:00', 'price' => 130],
                ['number' => 'AC402', 'airline_code' => 'AC', 'departure_airport_code' => 'YOW', 'arrival_airport_code' => 'YUL', 'departure_time' => '18:00', 'arrival_time' => '19:00', 'price' => 125],
            
                ['number' => 'WS401', 'airline_code' => 'WS', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YOW', 'departure_time' => '10:00', 'arrival_time' => '11:00', 'price' => 120],
                ['number' => 'WS402', 'airline_code' => 'WS', 'departure_airport_code' => 'YOW', 'arrival_airport_code' => 'YUL', 'departure_time' => '19:00', 'arrival_time' => '20:00', 'price' => 118],
            
            
                // =========================
                // YUL ↔ YYC
                // =========================
            
                ['number' => 'WS203', 'airline_code' => 'WS', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'YYC', 'departure_time' => '09:00', 'arrival_time' => '11:30', 'price' => 210],
                ['number' => 'WS204', 'airline_code' => 'WS', 'departure_airport_code' => 'YYC', 'arrival_airport_code' => 'YUL', 'departure_time' => '13:00', 'arrival_time' => '19:00', 'price' => 205],
            
            
                // =========================
                // YOW ↔ YYZ
                // =========================
            
                ['number' => 'PD503', 'airline_code' => 'PD', 'departure_airport_code' => 'YOW', 'arrival_airport_code' => 'YYZ', 'departure_time' => '07:00', 'arrival_time' => '08:00', 'price' => 120],
                ['number' => 'PD504', 'airline_code' => 'PD', 'departure_airport_code' => 'YYZ', 'arrival_airport_code' => 'YOW', 'departure_time' => '17:00', 'arrival_time' => '18:00', 'price' => 115],
            
            
                // =========================
                // YUL ↔ CDG
                // =========================
            
                ['number' => 'AF347', 'airline_code' => 'AF', 'departure_airport_code' => 'YUL', 'arrival_airport_code' => 'CDG', 'departure_time' => '22:00', 'arrival_time' => '11:00', 'price' => 650],
                ['number' => 'AF348', 'airline_code' => 'AF', 'departure_airport_code' => 'CDG', 'arrival_airport_code' => 'YUL', 'departure_time' => '13:00', 'arrival_time' => '15:30', 'price' => 620],
            ];

        foreach ($flights as $flight) {
            Flight::updateOrCreate(
                ['number' => $flight['number']],
                [
                    'airline_id' => $airlines[$flight['airline_code']]->id,
                    'departure_airport_id' => $airports[$flight['departure_airport_code']]->id,
                    'arrival_airport_id' => $airports[$flight['arrival_airport_code']]->id,
                    'departure_time' => $flight['departure_time'],
                    'arrival_time' => $flight['arrival_time'],
                    'price' => $flight['price'],
                ],
            );
        }
    }
}
