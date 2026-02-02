<?php

use App\Http\Controllers\Api\VisitorTrackingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Visitor Tracking Endpoint
Route::post('/track-visitor', [VisitorTrackingController::class, 'track'])
    ->middleware('throttle:60,1'); // Rate limit: 60 requests per minute

// Public Stats Endpoint (optional - for displaying on main site)
Route::get('/visitor-stats', [VisitorTrackingController::class, 'stats'])
    ->middleware('throttle:30,1'); // Rate limit: 30 requests per minute

// Authenticated API Routes (if needed)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
