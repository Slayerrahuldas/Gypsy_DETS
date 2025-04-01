let filterButton1Active = false;
let filterButton2Active = false;
let jsonData = [];

async function fetchData() {
    try {
        const response = await fetch("json/data.json");
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

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1;
        row.appendChild(serialCell);

        const columns = ["HUL Code", "Party Name", "Shikhar Outlet", "DETS ME Name", "DETS Beat", "FNB ME Name", "FNB Beat", "ECO", "SHIKHAR"];
        columns.forEach((key) => {
            const cell = document.createElement("td");
            cell.textContent = item[key] !== 0 ? item[key] : "-";
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

function applyFilters() {
    let filteredData = jsonData.filter((row) => {
        const filterValues = {
            "DETS ME Name": document.getElementById("filter-dets-me-name").value,
            "DETS Beat": document.getElementById("filter-dets-beat").value,
            "FNB ME Name": document.getElementById("filter-fnb-me-name").value,
            "FNB Beat": document.getElementById("filter-fnb-beat").value
        };
        const searchQuery = document.getElementById("search-bar").value.toLowerCase();

        return (
            (filterValues["DETS ME Name"] === "" || row["DETS ME Name"] === filterValues["DETS ME Name"]) &&
            (filterValues["DETS Beat"] === "" || row["DETS Beat"] === filterValues["DETS Beat"]) &&
            (filterValues["FNB ME Name"] === "" || row["FNB ME Name"] === filterValues["FNB ME Name"]) &&
            (filterValues["FNB Beat"] === "" || row["FNB Beat"] === filterValues["FNB Beat"]) &&
            (searchQuery === "" ||
                row["HUL Code"].toLowerCase().includes(searchQuery) ||
                row["Party Name"].toLowerCase().includes(searchQuery)) &&
            (!filterButton1Active || row["ECO"] < 1000) &&
            (!filterButton2Active || row["SHIKHAR"] < 500)
        );
    });

    populateTable(filteredData);
    updateDropdowns(filteredData);
}

function updateDropdowns(filteredData) {
    const dropdowns = {
        "filter-dets-me-name": { header: "DETS ME Name", values: new Set() },
        "filter-dets-beat": { header: "DETS Beat", values: new Set() },
        "filter-fnb-me-name": { header: "FNB ME Name", values: new Set() },
        "filter-fnb-beat": { header: "FNB Beat", values: new Set() }
    };

    filteredData.forEach((row) => {
        Object.keys(dropdowns).forEach((id) => {
            if (row[dropdowns[id].header]) dropdowns[id].values.add(row[dropdowns[id].header]);
        });
    });

    Object.keys(dropdowns).forEach((id) => {
        populateSelectDropdown(id, dropdowns[id].values, dropdowns[id].header);
    });
}

function populateSelectDropdown(id, optionsSet, headerName) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = `<option value="">${headerName}</option>`;

    optionsSet.forEach((option) => {
        dropdown.innerHTML += `<option value="${option}">${option}</option>`;
    });
}

function resetFilters() {
    filterButton1Active = filterButton2Active = false;
    document.getElementById("search-bar").value = "";
    document.querySelectorAll("select").forEach((dropdown) => (dropdown.value = ""));
    applyFilters();
}

function initialize() {
    document.getElementById("reset-button").addEventListener("click", resetFilters);
    document.getElementById("search-bar").addEventListener("input", applyFilters);
    document.querySelectorAll("select").forEach((dropdown) => dropdown.addEventListener("change", applyFilters));
    applyFilters();
}

fetchData();
