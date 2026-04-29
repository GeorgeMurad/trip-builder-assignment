<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Tests\TestCase;

class TripSearchTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_one_way_trip_search_returns_paginated_results(): void
    {
        $response = $this->getJson('/api/trips/one-way?'.http_build_query([
            'from' => 'YUL',
            'to' => 'YVR',
            'departure_date' => $this->validDepartureDate(),
            'page' => 1,
            'limit' => 3,
        ]));

        $response
            ->assertOk()
            ->assertJsonPath('totalTrips', 4)
            ->assertJsonPath('returnedTrips', 3)
            ->assertJsonPath('page', 1)
            ->assertJsonPath('totalPages', 2)
            ->assertJsonStructure([
                'data' => [
                    [
                        'flight_number',
                        'airline' => ['code', 'name'],
                        'departure_airport',
                        'arrival_airport',
                        'departure_date',
                        'departure_time',
                        'arrival_time',
                        'duration_minutes',
                        'price',
                        'total_passengers',
                        'total_price',
                    ],
                ],
                'totalTrips',
                'returnedTrips',
                'page',
                'totalPages',
                'minPrice',
                'maxPrice',
                'meta',
            ]);
    }

    public function test_round_trip_search_returns_paginated_results(): void
    {
        $response = $this->getJson('/api/trips/round-trip?'.http_build_query([
            'from' => 'YUL',
            'to' => 'YVR',
            'departure_date' => $this->validDepartureDate(),
            'return_date' => $this->validReturnDate(),
            'page' => 1,
            'limit' => 3,
        ]));

        $response
            ->assertOk()
            ->assertJsonPath('totalTrips', 16)
            ->assertJsonPath('returnedTrips', 3)
            ->assertJsonPath('page', 1)
            ->assertJsonPath('totalPages', 6)
            ->assertJsonStructure([
                'data' => [
                    [
                        'outbound' => [
                            'flight_number',
                            'airline' => ['code', 'name'],
                            'departure_airport',
                            'arrival_airport',
                        ],
                        'return' => [
                            'flight_number',
                            'airline' => ['code', 'name'],
                            'departure_airport',
                            'arrival_airport',
                        ],
                        'total_price',
                        'total_duration_minutes',
                        'total_passengers',
                    ],
                ],
                'totalTrips',
                'returnedTrips',
                'page',
                'totalPages',
            ]);
    }

    public function test_preferred_airline_filter_restricts_results(): void
    {
        $response = $this->getJson('/api/trips/one-way?'.http_build_query([
            'from' => 'YUL',
            'to' => 'YVR',
            'departure_date' => $this->validDepartureDate(),
            'preferred_airline' => 'AC',
            'page' => 1,
            'limit' => 3,
        ]));

        $response
            ->assertOk()
            ->assertJsonPath('totalTrips', 1)
            ->assertJsonPath('data.0.airline.code', 'AC');

        $this->assertSame(
            ['AC'],
            collect($response->json('data'))->pluck('airline.code')->unique()->values()->all(),
        );
    }

    public function test_one_way_results_can_be_sorted_by_price_ascending_and_descending(): void
    {
        $baseParams = [
            'from' => 'YUL',
            'to' => 'YVR',
            'departure_date' => $this->validDepartureDate(),
            'page' => 1,
            'limit' => 4,
        ];

        $ascending = $this->getJson('/api/trips/one-way?'.http_build_query([
            ...$baseParams,
            'sort_by' => 'price_asc',
        ]));

        $descending = $this->getJson('/api/trips/one-way?'.http_build_query([
            ...$baseParams,
            'sort_by' => 'price_desc',
        ]));

        $ascending->assertOk();
        $descending->assertOk();

        $ascendingPrices = collect($ascending->json('data'))->pluck('price')->all();
        $descendingPrices = collect($descending->json('data'))->pluck('price')->all();

        $this->assertSame([250, 260, 273, 310], $ascendingPrices);
        $this->assertSame([310, 273, 260, 250], $descendingPrices);
    }

    public function test_missing_required_parameters_return_validation_errors(): void
    {
        $response = $this->getJson('/api/trips/one-way');

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['from', 'to', 'departure_date']);
    }

    public function test_departure_date_outside_allowed_range_is_rejected(): void
    {
        $response = $this->getJson('/api/trips/one-way?'.http_build_query([
            'from' => 'YUL',
            'to' => 'YVR',
            'departure_date' => now()->addDays(366)->toDateString(),
        ]));

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['departure_date']);
    }

    private function validDepartureDate(): string
    {
        return now()->addDays(30)->toDateString();
    }

    private function validReturnDate(): string
    {
        return now()->addDays(37)->toDateString();
    }
}
