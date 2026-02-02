// =====================================================
// LARAVEL ADMIN DASHBOARD - JAVASCRIPT
// =====================================================

// Global Variables
let visitorsData = [];
let charts = {};

// Get CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// =====================================================
// API HELPER FUNCTIONS
// =====================================================

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
}

// =====================================================
// NAVIGATION
// =====================================================

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        // Update view
        const view = this.dataset.view;
        document.querySelectorAll('.view-content').forEach(content => content.classList.remove('active'));
        document.getElementById(view + 'View').classList.add('active');

        // Update header
        const titles = {
            'overview': { title: 'Overview', subtitle: 'Real-time visitor analytics and insights' },
            'visitors': { title: 'All Visitors', subtitle: 'Complete visitor log with details' },
            'analytics': { title: 'Analytics', subtitle: 'Deep dive into visitor behavior' }
        };

        document.getElementById('pageTitle').textContent = titles[view].title;
        document.getElementById('pageSubtitle').textContent = titles[view].subtitle;
    });
});

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', function () {
    this.classList.add('spinning');

    loadAllData();

    setTimeout(() => {
        this.classList.remove('spinning');
    }, 1000);
});

// =====================================================
// DATA LOADING
// =====================================================

async function loadAllData() {
    try {
        await Promise.all([
            loadStats(),
            loadVisitors(),
            loadTopLocations(),
            loadChartData(),
            loadIspData()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function loadStats() {
    try {
        const data = await fetchAPI('/admin/analytics/stats');

        document.getElementById('totalVisitors').textContent = data.total_visitors.toLocaleString();
        document.getElementById('visitorGrowth').textContent = `${data.growth > 0 ? '+' : ''}${data.growth}%`;
        document.getElementById('totalCountries').textContent = data.countries;
        document.getElementById('desktopUsers').textContent = data.desktop_users.toLocaleString();
        document.getElementById('mobileUsers').textContent = data.mobile_users.toLocaleString();

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadVisitors() {
    try {
        const data = await fetchAPI('/admin/analytics/visitors');
        visitorsData = data.data || data; // Handle both paginated and non-paginated responses

        updateVisitorsTable();
    } catch (error) {
        console.error('Error loading visitors:', error);
    }
}

async function loadTopLocations() {
    try {
        const data = await fetchAPI('/admin/analytics/locations');
        updateTopLocationsTable(data);
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

async function loadChartData() {
    try {
        const data = await fetchAPI('/admin/analytics/charts');
        updateCharts(data);
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

async function loadIspData() {
    try {
        const data = await fetchAPI('/admin/analytics/isps');
        updateIspTable(data);
    } catch (error) {
        console.error('Error loading ISP data:', error);
    }
}

// =====================================================
// UPDATE FUNCTIONS
// =====================================================

function updateVisitorsTable() {
    const tbody = document.getElementById('visitorsTable');

    if (!visitorsData || visitorsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">No visitors yet</td></tr>';
        return;
    }

    tbody.innerHTML = visitorsData.map(visitor => {
        const timestamp = new Date(visitor.created_at).toLocaleString();
        const ip = visitor.ip_address || 'Unknown';
        const location = `${visitor.city || 'Unknown'}, ${visitor.country || 'Unknown'}`;
        const device = visitor.device_type || 'Unknown';
        const browser = `${visitor.browser || 'Unknown'} ${visitor.browser_version || ''}`;
        const os = `${visitor.os || 'Unknown'} ${visitor.os_version || ''}`;
        const isp = visitor.isp || 'Unknown';

        const deviceClass = device.toLowerCase();

        return `
            <tr>
                <td>${timestamp}</td>
                <td><code>${ip}</code></td>
                <td><span class="location-badge">${location}</span></td>
                <td><span class="device-badge ${deviceClass}">${device}</span></td>
                <td>${browser}</td>
                <td>${os}</td>
                <td>${isp}</td>
            </tr>
        `;
    }).join('');
}

function updateTopLocationsTable(data) {
    const tbody = document.getElementById('topLocationsTable');
    const locations = data.locations || [];
    const total = data.total || 1;

    if (locations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading-cell">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = locations.map(location => {
        const percentage = ((location.count / total) * 100).toFixed(1);
        return `
            <tr>
                <td><strong>${location.country}</strong></td>
                <td>${location.count.toLocaleString()}</td>
                <td>${percentage}%</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill-bar" style="width: ${percentage}%"></div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateIspTable(data) {
    const tbody = document.getElementById('ispTable');
    const isps = data.isps || [];
    const total = data.total || 1;

    if (isps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="loading-cell">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = isps.map(isp => {
        const percentage = ((isp.count / total) * 100).toFixed(1);
        return `
            <tr>
                <td><strong>${isp.isp}</strong></td>
                <td>${isp.count.toLocaleString()}</td>
                <td>${percentage}%</td>
            </tr>
        `;
    }).join('');
}

// =====================================================
// CHARTS
// =====================================================

function updateCharts(data) {
    updateVisitorTrendsChart(data.trends);
    updateDeviceChart(data.devices);
    updateBrowserChart(data.browsers);
    updateOSChart(data.oses);
}

function updateVisitorTrendsChart(trends) {
    const ctx = document.getElementById('visitorTrendsChart');
    if (!ctx) return;

    const labels = trends.map(t => t.date);
    const counts = trends.map(t => t.count);

    if (charts.visitorTrends) {
        charts.visitorTrends.destroy();
    }

    charts.visitorTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Visitors',
                data: counts,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function updateDeviceChart(devices) {
    const ctx = document.getElementById('deviceChart');
    if (!ctx) return;

    const labels = devices.map(d => d.device_type);
    const data = devices.map(d => d.count);

    if (charts.device) {
        charts.device.destroy();
    }

    charts.device = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function updateBrowserChart(browsers) {
    const ctx = document.getElementById('browserChart');
    if (!ctx) return;

    const labels = browsers.map(b => b.browser);
    const data = browsers.map(b => b.count);

    if (charts.browser) {
        charts.browser.destroy();
    }

    charts.browser = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Visitors',
                data: data,
                backgroundColor: '#6366f1',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function updateOSChart(oses) {
    const ctx = document.getElementById('osChart');
    if (!ctx) return;

    const labels = oses.map(o => o.os);
    const data = oses.map(o => o.count);

    if (charts.os) {
        charts.os.destroy();
    }

    charts.os = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#6366f1', '#8b5cf6', '#ec4899',
                    '#f59e0b', '#10b981', '#3b82f6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// =====================================================
// SEARCH FUNCTIONALITY
// =====================================================

document.getElementById('searchInput').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#visitorsTable tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// =====================================================
// INITIALIZATION
// =====================================================

// Load all data on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('Laravel Admin Dashboard Loaded');
    loadAllData();

    // Auto-refresh every 30 seconds
    setInterval(loadAllData, 30000);
});
