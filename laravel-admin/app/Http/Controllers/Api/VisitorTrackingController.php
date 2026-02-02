<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VisitorTrackingController extends Controller
{
    /**
     * Track a new visitor.
     */
    public function track(Request $request)
    {
        try {
            $validated = $request->validate([
                'ip_address' => 'nullable|string|max:45',
                'country' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'region' => 'nullable|string|max:255',
                'timezone' => 'nullable|string|max:255',
                'isp' => 'nullable|string|max:255',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'device_type' => 'nullable|string|max:50',
                'browser' => 'nullable|string|max:100',
                'browser_version' => 'nullable|string|max:50',
                'os' => 'nullable|string|max:100',
                'os_version' => 'nullable|string|max:50',
                'platform' => 'nullable|string|max:100',
                'language' => 'nullable|string|max:50',
                'screen_resolution' => 'nullable|string|max:50',
                'viewport' => 'nullable|string|max:50',
                'user_agent' => 'nullable|string',
                'referrer' => 'nullable|string|max:500',
                'page_url' => 'nullable|string',
            ]);

            // If IP not provided, get from request
            if (empty($validated['ip_address'])) {
                $validated['ip_address'] = $request->ip();
            }

            Visitor::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Visitor tracked successfully'
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Visitor tracking failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to track visitor'
            ], 500);
        }
    }

    /**
     * Get visitor statistics (public endpoint for display).
     */
    public function stats()
    {
        $totalVisitors = Visitor::count();
        $todayVisitors = Visitor::whereDate('created_at', today())->count();
        $countries = Visitor::distinct('country')
            ->whereNotNull('country')
            ->where('country', '!=', 'Unknown')
            ->count('country');

        return response()->json([
            'total_visitors' => $totalVisitors,
            'today_visitors' => $todayVisitors,
            'countries' => $countries,
        ]);
    }
}
