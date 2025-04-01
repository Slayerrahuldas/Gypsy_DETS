// Track the state of filter buttons
let filterButton1Active = false;
let filterButton2Active = false;
let jsonData = []; // Global variable to hold fetched JSON data

// Function to fetch data from JSON file
async function fetchData() {
    try {
        const response = await fetch("json/data.json"); // Ensure correct path
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        initialize(); // Populate the table and filters after fetching data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to populate the table with dynamic numbering
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing data

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Add row number (dynamic numbering)
        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1; // Start from 1
        row.appendChild(serialCell);

        // Add data cells
        for (const key in item) {
            const cell = document.createElement("td");
            cell.textContent = item[key];
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    });
}

// Function to apply all filters and update the table
function applyFilters() {
    let filteredData = jsonData.filter((row) => {
        const filterValues = {
            "KIOSK ME Name": document.getElementById("filter-kiosk-me-name").value,
            "KIOSK Beat": document.getElementById("filter-kiosk-beat").value,
            "NUTS ME Name": document.getElementById("filter-nuts-me-name").value,
            "NUTS Beat": document.getElementById("filter-nuts-beat").value
        };
        const searchQuery = document.getElementById("search-bar").value.toLowerCase();

        return (
            (filterValues["KIOSK ME Name"] === "" || row["KIOSK ME Name"] === filterValues["KIOSK ME Name"]) &&
            (filterValues["KIOSK Beat"] === "" || row["KIOSK Beat"] === filterValues["KIOSK Beat"]) &&
            (filterValues["NUTS ME Name"] === "" || row["NUTS ME Name"] === filterValues["NUTS ME Name"]) &&
            (filterValues["NUTS Beat"] === "" || row["NUTS Beat"] === filterValues["NUTS Beat"]) &&
            (searchQuery === "" ||
                row["HUL Code"].toLowerCase().includes(searchQuery) ||
                row["Party Name"].toLowerCase().includes(searchQuery)) &&
            (!filterButton1Active || row["ECO"] < 1000) &&
            (!filterButton2Active || (row["SHIKHAR"] < 500 && row["Shikhar Outlet"] === "YES"))
        );
    });

    populateTable(filteredData);
    updateDropdowns(filteredData);
}

// Function to update dropdown options dynamically
function updateDropdowns(filteredData) {
    const dropdowns = {
        "filter-kiosk-me-name": { header: "KIOSK ME Name", values: new Set() },
        "filter-kiosk-beat": { header: "KIOSK Beat", values: new Set() },
        "filter-nuts-me-name": { header: "NUTS ME Name", values: new Set() },
        "filter-nuts-beat": { header: "NUTS Beat", values: new Set() }
    };

    filteredData.forEach((row) => {
        if (row["KIOSK ME Name"]) dropdowns["filter-kiosk-me-name"].values.add(row["KIOSK ME Name"]);
        if (row["KIOSK Beat"]) dropdowns["filter-kiosk-beat"].values.add(row["KIOSK Beat"]);
        if (row["NUTS ME Name"]) dropdowns["filter-nuts-me-name"].values.add(row["NUTS ME Name"]);
        if (row["NUTS Beat"]) dropdowns["filter-nuts-beat"].values.add(row["NUTS Beat"]);
    });

    Object.keys(dropdowns).forEach((id) => {
        populateSelectDropdown(id, dropdowns[id].values, dropdowns[id].header);
    });
}

// Function to populate a single dropdown with a header as the default placeholder
function populateSelectDropdown(id, optionsSet, headerName) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value;
    dropdown.innerHTML = `<option value="">Select ${headerName}</option>`; // Column name as default

    optionsSet.forEach((option) => {
        dropdown.innerHTML += `<option value="${option}" ${option === selectedValue ? "selected" : ""}>${option}</option>`;
    });
}

// Function to reset filters
function resetFilters() {
    filterButton1Active = filterButton2Active = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";
    document.getElementById("filter-button-2").style.backgroundColor = "blue";

    document.getElementById("search-bar").value = "";
    document.querySelectorAll("select").forEach((dropdown) => (dropdown.value = ""));

    applyFilters();
}

// Debounce function to optimize search performance
function debounce(func, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

// Initialize the table and filters
function initialize() {
    document.getElementById("reset-button").addEventListener("click", resetFilters);
    document.getElementById("search-bar").addEventListener("input", debounce(applyFilters));
    document.querySelectorAll("select").forEach((dropdown) => dropdown.addEventListener("change", applyFilters));

    document.getElementById("filter-button-1").addEventListener("click", () => {
        filterButton1Active = !filterButton1Active;
        document.getElementById("filter-button-1").style.backgroundColor = filterButton1Active ? "green" : "blue";
        applyFilters();
    });

    document.getElementById("filter-button-2").addEventListener("click", () => {
        filterButton2Active = !filterButton2Active;
        document.getElementById("filter-button-2").style.backgroundColor = filterButton2Active ? "green" : "blue";
        applyFilters();
    });

    populateTable(jsonData);
    applyFilters();
}

// Fetch data and initialize the page
fetchData();
