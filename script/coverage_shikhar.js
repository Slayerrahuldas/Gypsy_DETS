<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coverage & Shikhar</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <link rel="stylesheet" href="css/pages.css">
</head>
<body>
    <header>
        <h1><b>Coverage & Shikhar Dashboard</b></h1>
    </header>
    
    <nav class="navbar">
        <ul>
            <li><a href="index.html"><img src="images/home.png" alt="Home" width="20"></a></li>
            <li><a href="coverage_shikhar.html">Coverage & Shikhar</a></li>
            <li><a href="sales.html">Sales</a></li>
            <li><a href="launch.html">Launch</a></li>
        </ul>
    </nav>
    
    <div class="container">
        <div class="search-bar-container">
            <input type="text" id="search-bar" placeholder="Search by HUL Code or Party Name">
        </div>

        <div class="filters-container">
            <select id="filter-dets-me-name">
                <option value="">DETS ME Name</option>
            </select>
            <select id="filter-dets-beat">
                <option value="">DETS Beat</option>
            </select>
            <select id="filter-fnb-me-name">
                <option value="">FNB ME Name</option>
            </select>
            <select id="filter-fnb-beat">
                <option value="">FNB Beat</option>
            </select>
        </div>

        <div class="buttons-container">
            <button id="filter-button-1">ECO < 1000</button>
            <button id="filter-button-2">Shikhar < 500</button>
            <button id="reset-button">Reset Filters</button>
        </div>

        <table id="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>HUL Code</th>
                    <th>Party Name</th>
                    <th>Shikhar Outlet</th>
                    <th>DETS ME Name</th>
                    <th>DETS Beat</th>
                    <th>FNB ME Name</th>
                    <th>FNB Beat</th>
                    <th>ECO</th>
                    <th>SHIKHAR</th>
                </tr>
            </thead>
            <tbody id="table-body"></tbody>
        </table>
    </div>

    <script src="script/coverage_shikhar.js"></script>
</body>
</html>
