<div class="charts-grid">
    <div class="chart-card">
        <div class="chart-header">
            <h3>Browser Distribution</h3>
            <p>Popular browsers</p>
        </div>
        <div class="chart-container">
            <canvas id="browserChart"></canvas>
        </div>
    </div>

    <div class="chart-card">
        <div class="chart-header">
            <h3>Operating Systems</h3>
            <p>OS breakdown</p>
        </div>
        <div class="chart-container">
            <canvas id="osChart"></canvas>
        </div>
    </div>
</div>

<div class="table-card">
    <div class="table-header">
        <h3>ISP Distribution</h3>
        <p>Internet Service Providers</p>
    </div>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>ISP</th>
                    <th>Visitors</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody id="ispTable">
                <tr>
                    <td colspan="3" class="loading-cell">Loading data...</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
