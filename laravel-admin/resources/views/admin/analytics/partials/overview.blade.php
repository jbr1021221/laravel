<!-- Stats Cards -->
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        </div>
        <div class="stat-content">
            <div class="stat-label">Total Visitors</div>
            <div class="stat-value" id="totalVisitors">0</div>
            <div class="stat-change positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <span id="visitorGrowth">+0%</span>
            </div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
        </div>
        <div class="stat-content">
            <div class="stat-label">Countries</div>
            <div class="stat-value" id="totalCountries">0</div>
            <div class="stat-info">Unique locations</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
        </div>
        <div class="stat-content">
            <div class="stat-label">Desktop Users</div>
            <div class="stat-value" id="desktopUsers">0</div>
            <div class="stat-info">Device type</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
        </div>
        <div class="stat-content">
            <div class="stat-label">Mobile Users</div>
            <div class="stat-value" id="mobileUsers">0</div>
            <div class="stat-info">Device type</div>
        </div>
    </div>
</div>

<!-- Charts -->
<div class="charts-grid">
    <div class="chart-card">
        <div class="chart-header">
            <h3>Visitor Trends</h3>
            <p>Last 7 days</p>
        </div>
        <div class="chart-container">
            <canvas id="visitorTrendsChart"></canvas>
        </div>
    </div>

    <div class="chart-card">
        <div class="chart-header">
            <h3>Device Distribution</h3>
            <p>All time</p>
        </div>
        <div class="chart-container">
            <canvas id="deviceChart"></canvas>
        </div>
    </div>
</div>

<!-- Top Locations -->
<div class="table-card">
    <div class="table-header">
        <h3>Top Locations</h3>
        <p>Most active countries</p>
    </div>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Country</th>
                    <th>Visitors</th>
                    <th>Percentage</th>
                    <th>Chart</th>
                </tr>
            </thead>
            <tbody id="topLocationsTable">
                <tr>
                    <td colspan="4" class="loading-cell">Loading data...</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
