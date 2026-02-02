<?php

use App\Http\Controllers\Admin\VisitorAnalyticsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});

// Admin Analytics Routes (Protected by Auth Middleware)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    
    // Analytics Dashboard
    Route::get('/analytics', [VisitorAnalyticsController::class, 'index'])
        ->name('analytics');
    
    // Analytics API Endpoints
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/stats', [VisitorAnalyticsController::class, 'getStats'])
            ->name('stats');
        
        Route::get('/visitors', [VisitorAnalyticsController::class, 'getVisitors'])
            ->name('visitors');
        
        Route::get('/locations', [VisitorAnalyticsController::class, 'getTopLocations'])
            ->name('locations');
        
        Route::get('/charts', [VisitorAnalyticsController::class, 'getChartData'])
            ->name('charts');
        
        Route::get('/isps', [VisitorAnalyticsController::class, 'getIspData'])
            ->name('isps');
        
        Route::get('/export', [VisitorAnalyticsController::class, 'exportCsv'])
            ->name('export');
    });
});

// Authentication Routes (if using Laravel Breeze/Jetstream)
require __DIR__.'/auth.php';
