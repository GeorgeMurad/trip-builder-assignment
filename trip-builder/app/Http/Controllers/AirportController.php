<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AirportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('q', ''));

        $airports = Airport::query()
            ->select(['code', 'name', 'city', 'city_code', 'country_code'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%");
                });
            })
            ->orderBy('code')
            ->limit(10)
            ->get()
            ->map(fn (Airport $airport) => [
                'code' => $airport->code,
                'name' => $airport->name,
                'city' => $airport->city,
                'city_code' => $airport->city_code,
                'country_code' => $airport->country_code,
            ]);

        return response()->json($airports);
    }
}
