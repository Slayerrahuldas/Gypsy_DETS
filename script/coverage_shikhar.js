// Track filter button states
let filterButton1Active = false;
let filterButton2Active = false;
let jsonData = []; // Global variable to hold fetched data

// Fetch data from JSON file
async function fetchData() {
    try {
        const response = await fetch("json/data.json"); // Ensure correct path
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        updateDropdowns(jsonData); // Populate dropdowns BEFORE initializing
        initialize(); // Initialize event listeners and table
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Populate table with dynamic numbering
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing data

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Row number
        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1;
        row.appendChild(serialCell);

        // Data cells
        for (const key in item) {
            const cell = document.createElement("td");
            cell.textContent = item[key];
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    });
}

// Apply filters and update table
function applyFilters() {
    const filterValues = {
        "DETS ME Name": document.getElementById("filter-deets-me-name").value,
        "DETS Beat": document.getElementById("filter-deets-beat").value,
        "FnR ME Name": document.getElementById("filter-fnr-me-name").value,
        "FnR Beat": document.getElementById("filter-fnr-beat").value,
        "NUTS ME Name": document.getElementById("filter-nuts-me-name").value,
        "NUTS Beat": document.getElementById("filter-nuts-beat").value
    };
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();

    let filteredData = jsonData.filter((row) => 
        (!filterValues["DETS ME Name"] || row["DETS ME Name"] === filterValues["DETS ME Name"]) &&
        (!filterValues["DETS Beat"] || row["DETS Beat"] === filterValues["DETS Beat"]) &&
        (!filterValues["FnR ME Name"] || row["FnR ME Name"] === filterValues["FnR ME Name"]) &&
        (!filterValues["FnR Beat"] || row["FnR Beat"] === filterValues["FnR Beat"]) &&
        (!filterValues["NUTS ME Name"] || row["NUTS ME Name"] === filterValues["NUTS ME Name"]) &&
        (!filterValues["NUTS Beat"] || row["NUTS Beat"] === filterValues["NUTS Beat"]) &&
        (!searchQuery || row["HUL Code"].toLowerCase().includes(searchQuery) ||
         row["Party Name"].toLowerCase().includes(searchQuery)) &&
        (!filterButton1Active || row["ECO"] < 1000) &&
        (!filterButton2Active || (row["SHIKHAR"] < 500 && row["Shikhar Outlet"] === "YES"))
    );

    populateTable(filteredData);
}

// Update dropdown options dynamically
function updateDropdowns(data) {
    const dropdowns = {
        "filter-deets-me-name": { header: "DETS ME Name", values: new Set() },
        "filter-deets-beat": { header: "DETS Beat", values: new Set() },
        "filter-fnr-me-name": { header: "FnR ME Name", values: new Set() },
        "filter-fnr-beat": { header: "FnR Beat", values: new Set() },
        "filter-nuts-me-name": { header: "NUTS ME Name", values: new Set() },
        "filter-nuts-beat": { header: "NUTS Beat", values: new Set() }
    };

    data.forEach((row) => {
        if (row["DETS ME Name"]) dropdowns["filter-deets-me-name"].values.add(row["DETS ME Name"]);
        if (row["DETS Beat"]) dropdowns["filter-deets-beat"].values.add(row["DETS Beat"]);
        if (row["FnR ME Name"]) dropdowns["filter-fnr-me-name"].values.add(row["FnR ME Name"]);
        if (row["FnR Beat"]) dropdowns["filter-fnr-beat"].values.add(row["FnR Beat"]);
        if (row["NUTS ME Name"]) dropdowns["filter-nuts-me-name"].values.add(row["NUTS ME Name"]);
        if (row["NUTS Beat"]) dropdowns["filter-nuts-beat"].values.add(row["NUTS Beat"]);
    });

    Object.keys(dropdowns).forEach((id) => {
        populateSelectDropdown(id, dropdowns[id].values, dropdowns[id].header);
    });
}

// Populate a single dropdown with a header
function populateSelectDropdown(id, optionsSet, headerName) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = `<option value="">${headerName}</option>`; // Default option

    optionsSet.forEach((option) => {
        dropdown.innerHTML += `<option value="${option}">${option}</option>`;
    });
}

// Reset all filters
function resetFilters() {
    filterButton1Active = filterButton2Active = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";
    document.getElementById("filter-button-2").style.backgroundColor = "blue";

    document.getElementById("search-bar").value = "";
    document.querySelectorAll("select").forEach((dropdown) => (dropdown.value = ""));

    applyFilters();
}

// Debounce function for better performance
function debounce(func, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

// Initialize event listeners
function initialize() {
    document.getElementById("reset-button").addEventListener("click", resetFilters);
    document.getElementById("search-bar").addEventListener("input", debounce(applyFilters));
    document.querySelectorAll("select").forEach((dropdown) => dropdown.addEventListener("change", applyFilters));

    document.getElementById("filter-button-1").addEventListener("click", () => {
        filterButton1Active = !filterButton1Active;
        applyFilters();
    });

    document.getElementById("filter-button-2").addEventListener("click", () => {
        filterButton2Active = !filterButton2Active;
        applyFilters();
    });

    applyFilters();
}

// Fetch data when page loads
window.onload = fetchData;
