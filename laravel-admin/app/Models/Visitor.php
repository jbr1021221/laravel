<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ip_address',
        'country',
        'city',
        'region',
        'timezone',
        'isp',
        'latitude',
        'longitude',
        'device_type',
        'browser',
        'browser_version',
        'os',
        'os_version',
        'platform',
        'language',
        'screen_resolution',
        'viewport',
        'user_agent',
        'referrer',
        'page_url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get visitors from last N days
     */
    public static function fromLastDays(int $days = 7)
    {
        return static::where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Get unique countries count
     */
    public static function uniqueCountriesCount()
    {
        return static::distinct('country')
            ->whereNotNull('country')
            ->where('country', '!=', 'Unknown')
            ->count('country');
    }

    /**
     * Get device statistics
     */
    public static function deviceStats()
    {
        return static::selectRaw('device_type, COUNT(*) as count')
            ->groupBy('device_type')
            ->get()
            ->pluck('count', 'device_type');
    }
}
