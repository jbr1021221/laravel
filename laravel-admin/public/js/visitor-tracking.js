// =====================================================
// VISITOR TRACKING FOR LARAVEL
// =====================================================

/**
 * Track visitor information and send to Laravel API
 */
async function trackVisitor() {
    try {
        // Get device and browser information
        const userAgent = navigator.userAgent;
        const deviceInfo = getDeviceInfo(userAgent);

        // Get IP address and location with multiple fallbacks
        let ipData = await getLocationData();

        // Prepare visitor data
        const visitorData = {
            ip_address: ipData.ip,
            country: ipData.country,
            city: ipData.city,
            region: ipData.region,
            timezone: ipData.timezone,
            isp: ipData.isp,
            latitude: ipData.latitude,
            longitude: ipData.longitude,
            device_type: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            browser_version: deviceInfo.browserVersion,
            os: deviceInfo.os,
            os_version: deviceInfo.osVersion,
            platform: navigator.platform || 'Unknown',
            language: navigator.language || 'Unknown',
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            user_agent: userAgent,
            referrer: document.referrer || 'Direct',
            page_url: window.location.href
        };

        // Send to Laravel API
        const response = await fetch('/api/track-visitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(visitorData)
        });

        if (response.ok) {
            console.log('✅ Visitor tracked successfully');
        } else {
            console.warn('⚠️ Visitor tracking failed:', response.status);
        }

    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

/**
 * Get location data from IP geolocation services
 */
async function getLocationData() {
    let ipData = {
        ip: 'Unknown',
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        timezone: 'Unknown',
        isp: 'Unknown',
        latitude: null,
        longitude: null
    };

    // Try multiple IP geolocation services for reliability
    let locationFetched = false;

    // Method 1: Try ip-api.com (free, no key needed, 45 req/min)
    if (!locationFetched) {
        try {
            const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query');
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    ipData = {
                        ip: data.query || 'Unknown',
                        country: data.country || 'Unknown',
                        city: data.city || 'Unknown',
                        region: data.regionName || 'Unknown',
                        timezone: data.timezone || 'Unknown',
                        isp: data.isp || data.org || 'Unknown',
                        latitude: data.lat || null,
                        longitude: data.lon || null
                    };
                    locationFetched = true;
                }
            }
        } catch (e) {
            console.warn('ip-api.com failed, trying next service...');
        }
    }

    // Method 2: Try ipapi.co (free, 1000/day)
    if (!locationFetched) {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const data = await response.json();
                if (data.ip && !data.error) {
                    ipData = {
                        ip: data.ip || 'Unknown',
                        country: data.country_name || 'Unknown',
                        city: data.city || 'Unknown',
                        region: data.region || 'Unknown',
                        timezone: data.timezone || 'Unknown',
                        isp: data.org || 'Unknown',
                        latitude: data.latitude || null,
                        longitude: data.longitude || null
                    };
                    locationFetched = true;
                }
            }
        } catch (e) {
            console.warn('ipapi.co failed');
        }
    }

    // Fallback: At least get timezone from browser
    if (ipData.timezone === 'Unknown') {
        try {
            ipData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
        } catch (e) {
            // Ignore
        }
    }

    return ipData;
}

/**
 * Parse user agent to extract device information
 */
function getDeviceInfo(userAgent) {
    const ua = userAgent.toLowerCase();

    // Detect device type
    let deviceType = 'Desktop';
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        deviceType = 'Tablet';
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        deviceType = 'Mobile';
    }

    // Detect browser
    let browser = 'Unknown';
    let browserVersion = 'Unknown';

    if (ua.includes('firefox')) {
        browser = 'Firefox';
        browserVersion = ua.match(/firefox\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('edg')) {
        browser = 'Edge';
        browserVersion = ua.match(/edg\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('chrome')) {
        browser = 'Chrome';
        browserVersion = ua.match(/chrome\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('safari')) {
        browser = 'Safari';
        browserVersion = ua.match(/version\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('opera') || ua.includes('opr')) {
        browser = 'Opera';
        browserVersion = ua.match(/(?:opera|opr)\/([0-9.]+)/)?.[1] || 'Unknown';
    }

    // Detect OS
    let os = 'Unknown';
    let osVersion = 'Unknown';

    if (ua.includes('windows')) {
        os = 'Windows';
        if (ua.includes('windows nt 10.0')) osVersion = '10/11';
        else if (ua.includes('windows nt 6.3')) osVersion = '8.1';
        else if (ua.includes('windows nt 6.2')) osVersion = '8';
        else if (ua.includes('windows nt 6.1')) osVersion = '7';
    } else if (ua.includes('mac os')) {
        os = 'macOS';
        osVersion = ua.match(/mac os x ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
    } else if (ua.includes('android')) {
        os = 'Android';
        osVersion = ua.match(/android ([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
        os = 'iOS';
        osVersion = ua.match(/os ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
    } else if (ua.includes('linux')) {
        os = 'Linux';
    }

    return {
        deviceType,
        browser,
        browserVersion,
        os,
        osVersion
    };
}

// Auto-track on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackVisitor);
} else {
    trackVisitor();
}
