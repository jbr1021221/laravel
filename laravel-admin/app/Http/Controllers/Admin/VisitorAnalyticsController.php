<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitorAnalyticsController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display the analytics dashboard.
     */
    public function index()
    {
        return view('admin.analytics.index');
    }

    /**
     * Get overview statistics.
     */
    public function getStats()
    {
        $totalVisitors = Visitor::count();
        
        // Growth calculation (last 24h vs previous 24h)
        $last24h = Visitor::where('created_at', '>=', now()->subDay())->count();
        $previous24h = Visitor::whereBetween('created_at', [
            now()->subDays(2),
            now()->subDay()
        ])->count();
        
        $growth = $previous24h > 0 
            ? round((($last24h - $previous24h) / $previous24h) * 100, 1)
            : 0;

        $countries = Visitor::uniqueCountriesCount();
        $deviceStats = Visitor::deviceStats();

        return response()->json([
            'total_visitors' => $totalVisitors,
            'growth' => $growth,
            'countries' => $countries,
            'desktop_users' => $deviceStats['Desktop'] ?? 0,
            'mobile_users' => $deviceStats['Mobile'] ?? 0,
            'tablet_users' => $deviceStats['Tablet'] ?? 0,
        ]);
    }

    /**
     * Get all visitors with optional search.
     */
    public function getVisitors(Request $request)
    {
        $query = Visitor::query()->orderBy('created_at', 'desc');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('browser', 'like', "%{$search}%")
                  ->orWhere('os', 'like', "%{$search}%")
                  ->orWhere('isp', 'like', "%{$search}%");
            });
        }

        $visitors = $query->paginate(50);

        return response()->json($visitors);
    }

    /**
     * Get top locations.
     */
    public function getTopLocations()
    {
        $locations = Visitor::select('country', DB::raw('count(*) as count'))
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        $total = Visitor::count();

        return response()->json([
            'locations' => $locations,
            'total' => $total
        ]);
    }

    /**
     * Get chart data for visualizations.
     */
    public function getChartData()
    {
        // Last 7 days visitor trends
        $trends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->startOfDay();
            $count = Visitor::whereDate('created_at', $date)->count();
            $trends[] = [
                'date' => $date->format('M d'),
                'count' => $count
            ];
        }

        // Device distribution
        $devices = Visitor::select('device_type', DB::raw('count(*) as count'))
            ->whereNotNull('device_type')
            ->groupBy('device_type')
            ->get();

        // Browser distribution
        $browsers = Visitor::select('browser', DB::raw('count(*) as count'))
            ->whereNotNull('browser')
            ->groupBy('browser')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        // OS distribution
        $oses = Visitor::select('os', DB::raw('count(*) as count'))
            ->whereNotNull('os')
            ->groupBy('os')
            ->get();

        return response()->json([
            'trends' => $trends,
            'devices' => $devices,
            'browsers' => $browsers,
            'oses' => $oses
        ]);
    }

    /**
     * Get ISP data.
     */
    public function getIspData()
    {
        $isps = Visitor::select('isp', DB::raw('count(*) as count'))
            ->whereNotNull('isp')
            ->where('isp', '!=', 'Unknown')
            ->groupBy('isp')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        $total = Visitor::count();

        return response()->json([
            'isps' => $isps,
            'total' => $total
        ]);
    }

    /**
     * Export visitors data to CSV.
     */
    public function exportCsv()
    {
        $visitors = Visitor::orderBy('created_at', 'desc')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="visitors_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function() use ($visitors) {
            $file = fopen('php://output', 'w');
            
            // CSV Headers
            fputcsv($file, [
                'Timestamp', 
                'IP Address', 
                'Country', 
                'City', 
                'Region',
                'Timezone',
                'Device Type', 
                'Browser', 
                'Browser Version',
                'OS', 
                'OS Version',
                'ISP',
                'Platform',
                'Language',
                'Screen Resolution',
                'Viewport',
                'Referrer',
                'Page URL'
            ]);

            // CSV Data
            foreach ($visitors as $visitor) {
                fputcsv($file, [
                    $visitor->created_at->format('Y-m-d H:i:s'),
                    $visitor->ip_address,
                    $visitor->country,
                    $visitor->city,
                    $visitor->region,
                    $visitor->timezone,
                    $visitor->device_type,
                    $visitor->browser,
                    $visitor->browser_version,
                    $visitor->os,
                    $visitor->os_version,
                    $visitor->isp,
                    $visitor->platform,
                    $visitor->language,
                    $visitor->screen_resolution,
                    $visitor->viewport,
                    $visitor->referrer,
                    $visitor->page_url,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
