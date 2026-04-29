<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchOneWayTripRequest;
use App\Http\Requests\SearchRoundTripRequest;
use App\Services\TripSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class TripController extends Controller
{
    public function __construct(
        private readonly TripSearchService $tripSearchService,
    ) {
    }

    public function searchOneWay(SearchOneWayTripRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $totalPassengers = (int) $request->input('adults', 1) + (int) $request->input('children', 0);
        $cabinClass = $request->input('cabin_class', 'economy');
        $page = (int) $request->input('page', 1);
        $limit = (int) $request->input('limit', 3);
        $sortBy = $validated['sort_by'] ?? $validated['sort'] ?? null;

        $results = $this->tripSearchService->searchOneWay(
            $validated['from'],
            $validated['to'],
            $validated['departure_date'] ?? $validated['date'],
            $validated['preferred_airline'] ?? null,
            $sortBy,
            $page,
            $limit,
        );

        return $this->paginatedResponse($results, $totalPassengers, $cabinClass);
    }

    public function searchRoundTrip(SearchRoundTripRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $totalPassengers = (int) $request->input('adults', 1) + (int) $request->input('children', 0);
        $cabinClass = $request->input('cabin_class', 'economy');
        $page = (int) $request->input('page', 1);
        $limit = (int) $request->input('limit', 3);
        $sortBy = $validated['sort_by'] ?? $validated['sort'] ?? null;

        $results = $this->tripSearchService->searchRoundTrip(
            $validated['from'],
            $validated['to'],
            $validated['departure_date'],
            $validated['return_date'],
            $validated['preferred_airline'] ?? null,
            $sortBy,
            $page,
            $limit,
        );

        return $this->paginatedResponse($results, $totalPassengers, $cabinClass);
    }

    private function paginatedResponse(array $searchResults, int $totalPassengers, mixed $cabinClass): JsonResponse
    {
        /** @var LengthAwarePaginator $results */
        $results = $searchResults['results'];
        $data = $this->applyPassengerPricing($results->items(), $totalPassengers);

        return response()->json([
            'data' => $data,
            'totalTrips' => $results->total(),
            'returnedTrips' => count($data),
            'page' => $results->currentPage(),
            'totalPages' => $results->lastPage(),
            'minPrice' => $this->applyPassengerMultiplier($searchResults['min_price'], $totalPassengers),
            'maxPrice' => $this->applyPassengerMultiplier($searchResults['max_price'], $totalPassengers),
            'meta' => [
                'total_passengers' => $totalPassengers,
                'cabin_class' => $cabinClass,
            ],
        ]);
    }

    private function applyPassengerPricing(array $results, int $totalPassengers): array
    {
        return array_map(function (array $result) use ($totalPassengers) {
            $basePrice = isset($result['outbound'], $result['return'])
                ? (float) $result['total_price']
                : (float) $result['price'];

            $result['total_passengers'] = $totalPassengers;
            $result['total_price'] = round($basePrice * $totalPassengers, 2);

            return $result;
        }, $results);
    }

    private function applyPassengerMultiplier(mixed $price, int $totalPassengers): ?float
    {
        if ($price === null) {
            return null;
        }

        return round((float) $price * $totalPassengers, 2);
    }
}
