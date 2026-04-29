<?php

namespace App\Services;

use App\Models\Flight;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class TripSearchService
{
    private const DEFAULT_LIMIT = 3;

    public function searchOneWay(
        $from,
        $to,
        $date,
        $preferredAirline = null,
        $sort = null,
        int $page = 1,
        int $limit = self::DEFAULT_LIMIT,
    ): array
    {
        $results = $this->searchFlights($from, $to, $preferredAirline)
            ->get()
            ->map(fn (Flight $flight) => $this->formatFlight($flight, $date))
            ->all();

        $results = $this->sortResults($results, $sort);
        $prices = array_column($results, 'price');

        return [
            'results' => $this->paginateResults($results, $page, $limit),
            'min_price' => $prices === [] ? null : min($prices),
            'max_price' => $prices === [] ? null : max($prices),
        ];
    }

    public function searchRoundTrip(
        $from,
        $to,
        $departureDate,
        $returnDate,
        $preferredAirline = null,
        $sort = null,
        int $page = 1,
        int $limit = self::DEFAULT_LIMIT,
    ): array
    {
        $outboundFlights = $this->searchFlights($from, $to, $preferredAirline)->get();
        $returnFlights = $this->searchFlights($to, $from, $preferredAirline)->get();

        $results = [];

        foreach ($outboundFlights as $outboundFlight) {
            foreach ($returnFlights as $returnFlight) {
                $results[] = [
                    'outbound' => $this->formatFlight($outboundFlight, $departureDate),
                    'return' => $this->formatFlight($returnFlight, $returnDate),
                    'total_price' => round((float) $outboundFlight->price + (float) $returnFlight->price, 2),
                ];

                $lastIndex = array_key_last($results);
                $results[$lastIndex]['total_duration_minutes'] =
                    $results[$lastIndex]['outbound']['duration_minutes']
                    + $results[$lastIndex]['return']['duration_minutes'];
            }
        }

        $results = $this->sortResults($results, $sort);

        $prices = array_column($results, 'total_price');

        return [
            'results' => $this->paginateResults($results, $page, $limit),
            'min_price' => $prices === [] ? null : min($prices),
            'max_price' => $prices === [] ? null : max($prices),
        ];
    }

    private function searchFlights(string $from, string $to, ?string $preferredAirline = null): Builder
    {
        return Flight::query()
            ->with(['airline', 'departureAirport', 'arrivalAirport'])
            ->whereHas('departureAirport', function ($query) use ($from) {
                $query->where('code', $from);
            })
            ->whereHas('arrivalAirport', function ($query) use ($to) {
                $query->where('code', $to);
            })
            ->when($preferredAirline, function ($query) use ($preferredAirline) {
                $query->whereHas('airline', function ($query) use ($preferredAirline) {
                    $query->where('code', $preferredAirline);
                });
            });
    }

    private function sortResults(array $results, ?string $sortBy): array
    {
        if ($sortBy === null) {
            return $results;
        }

        usort($results, function (array $first, array $second) use ($sortBy) {
            return match ($sortBy) {
                'price_asc' => $this->tripPrice($first) <=> $this->tripPrice($second),
                'price_desc' => $this->tripPrice($second) <=> $this->tripPrice($first),
                'departure_asc' => $this->departureSortValue($first) <=> $this->departureSortValue($second),
                'departure_desc' => $this->departureSortValue($second) <=> $this->departureSortValue($first),
                'duration_asc' => $this->tripDurationMinutes($first) <=> $this->tripDurationMinutes($second),
                default => 0,
            };
        });

        return $results;
    }

    private function tripPrice(array $result): float
    {
        return (float) ($result['total_price'] ?? $result['price']);
    }

    private function departureSortValue(array $result): string
    {
        $flight = $result['outbound'] ?? $result;

        return "{$flight['departure_date']} {$flight['departure_time']}";
    }

    private function tripDurationMinutes(array $result): int
    {
        return (int) ($result['total_duration_minutes'] ?? $result['duration_minutes']);
    }

    private function paginateResults(array $results, int $page, int $limit): LengthAwarePaginator
    {
        $offset = ($page - 1) * $limit;
        $items = array_slice($results, $offset, $limit);

        return new LengthAwarePaginator(
            $items,
            count($results),
            $limit,
            $page,
            ['path' => LengthAwarePaginator::resolveCurrentPath()],
        );
    }

    private function formatFlight(Flight $flight, string $date): array
    {
        $durationMinutes = $this->durationInMinutes($flight, $date);

        return [
            'flight_number' => $flight->number,
            'airline' => [
                'code' => $flight->airline->code,
                'name' => $flight->airline->name,
            ],
            'departure_airport' => $flight->departureAirport->code,
            'arrival_airport' => $flight->arrivalAirport->code,
            'departure_date' => $date,
            'departure_time' => $flight->departure_time,
            'arrival_time' => $flight->arrival_time,
            'duration_minutes' => $durationMinutes,
            'price' => (float) $flight->price,
        ];
    }

    private function durationInMinutes(Flight $flight, string $date): int
    {
        $departure = CarbonImmutable::parse(
            "{$date} {$flight->departure_time}",
            $flight->departureAirport->timezone,
        );

        $arrival = CarbonImmutable::parse(
            "{$date} {$flight->arrival_time}",
            $flight->arrivalAirport->timezone,
        );

        if ($arrival->lessThanOrEqualTo($departure)) {
            $arrival = $arrival->addDay();
        }

        return $departure->diffInMinutes($arrival);
    }
}
