let jsonData = [];

async function fetchData() {
    try {
        const response = await fetch("json/sales.json");
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        initialize();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    const totalColumns = ["LYRR", "JQRR", "L3M", "MTD"];
    let totals = { LYRR: 0, JQRR: 0, L3M: 0, MTD: 0 };

    data.forEach(item => {
        totalColumns.forEach(key => {
            totals[key] += parseFloat(item[key]) || 0;
        });
    });

    // Create total row
    const totalRow = document.createElement("tr");
    totalRow.style.fontWeight = "bold";
    totalRow.style.backgroundColor = "#f2f2f2";

    totalRow.innerHTML = `
        <td>Total</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>${totals.LYRR}</td>
        <td>${totals.JQRR}</td>
        <td>${totals.L3M}</td>
        <td>${totals.MTD}</td>
    `;
    tableBody.appendChild(totalRow);

    // Populate data rows
    const totalRows = data.length;
    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${totalRows - index}</td>
            <td>${item["HUL Code"] || "-"}</td>
            <td>${item["HUL Outlet Name"] || "-"}</td>
            <td>${item["Beat"] || "-"}</td>
            <td>${item["LYRR"] || 0}</td>
            <td>${item["JQRR"] || 0}</td>
            <td>${item["L3M"] || 0}</td>
            <td>${item["MTD"] || 0}</td>
        `;
        tableBody.appendChild(row);
    });
}

function applyFilters() {
    let filteredData = [...jsonData];

    const meName = document.getElementById("filter-me-name").value;
    const day = document.getElementById("filter-day").value;
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();

    if (meName) {
        filteredData = filteredData.filter(row => row["ME Name"] === meName);
    }

    if (day) {
        filteredData = filteredData.filter(row => row["Day"] === day);
    }

    if (searchQuery) {
        filteredData = filteredData.filter(row =>
            row["HUL Code"]?.toLowerCase().includes(searchQuery) ||
            row["HUL Outlet Name"]?.toLowerCase().includes(searchQuery)
        );
    }

    populateTable(filteredData);
    updateDropdowns(filteredData);
}

function updateDropdowns(filteredData) {
    const meSet = new Set();
    const daySet = new Set();

    filteredData.forEach(row => {
        if (row["ME Name"]) meSet.add(row["ME Name"]);
        if (row["Day"]) daySet.add(row["Day"]);
    });

    populateDropdown("filter-me-name", meSet, "ME Name");
    populateDropdown("filter-day", daySet, "Day");
}

function populateDropdown(id, optionsSet, headerName) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value;
    dropdown.innerHTML = `<option value="">${headerName}</option>`;

    Array.from(optionsSet).sort().forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        if (option === selectedValue) opt.selected = true;
        dropdown.appendChild(opt);
    });
}

// Reset
document.getElementById("reset-button").addEventListener("click", () => {
    document.getElementById("search-bar").value = "";
    document.getElementById("filter-me-name").selectedIndex = 0;
    document.getElementById("filter-day").selectedIndex = 0;
    applyFilters();
});

// Listeners
document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-day").addEventListener("change", applyFilters);

// Initialize
function initialize() {
    populateTable(jsonData);
    applyFilters();
}

fetchData();
