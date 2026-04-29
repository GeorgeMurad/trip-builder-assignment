<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AirlineController;
use App\Http\Controllers\AirportController;
use App\Http\Controllers\TripController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/trips/one-way', [TripController::class, 'searchOneWay']);
Route::get('/trips/round-trip', [TripController::class, 'searchRoundTrip']);
Route::get('/airports', [AirportController::class, 'index']);
Route::get('/airlines', [AirlineController::class, 'index']);