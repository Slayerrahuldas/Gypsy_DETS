let filterButtonActive = false;
let jsonData = [];

async function fetchData() {
  try {
    const response = await fetch("json/launch.json");
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
    row.appendChild(createCell(data.length - index)); // Reverse row number

    ["HUL Code", "HUL Outlet Name", "ME Name", "BEAT", "BasePack Code", "BasePack Desc", "Target (VMQ)", "Achv Qty", "Status"].forEach(key => {
      row.appendChild(createCell(item[key]));
    });

    tableBody.appendChild(row);
  });
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value === 0 ? "0" : value ?? "";
  return cell;
}

function applyFilters() {
  const meName = getFilterValue("filter-me-name");
  const selectedBeats = getMultiSelectValues("filter-beat");
  const selectedBasePacks = getMultiSelectValues("filter-basepack-desc");
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();

  let filteredData = jsonData.filter(row => {
    const matchesMe = !meName || row["ME Name"] === meName;
    const matchesBeat = selectedBeats.length === 0 || selectedBeats.includes(row["BEAT"]);
    const matchesBasePack = selectedBasePacks.length === 0 || selectedBasePacks.includes(row["BasePack Desc"]);
    const matchesSearch =
      !searchTerm ||
      row["HUL Code"].toLowerCase().includes(searchTerm) ||
      row["HUL Outlet Name"].toLowerCase().includes(searchTerm);

    return matchesMe && matchesBeat && matchesBasePack && matchesSearch;
  });

  if (filterButtonActive) {
    filteredData = filteredData.filter(row => row["Status"] === "Pending");
  }

  populateTable(filteredData);
  updateDropdowns(filteredData);
}

function getFilterValue(id) {
  return document.getElementById(id).value;
}

function getMultiSelectValues(id) {
  const select = document.getElementById(id);
  return Array.from(select.selectedOptions).map(option => option.value);
}

function updateDropdowns(filteredData) {
  populateDropdown("filter-me-name", getUniqueValues(jsonData, "ME Name"), "ME Name");
  populateDropdown("filter-beat", getUniqueValues(jsonData, "BEAT"));
  populateDropdown("filter-basepack-desc", getUniqueValues(jsonData, "BasePack Desc"));
}

function getUniqueValues(data, key) {
  return [...new Set(data.map(item => item[key]).filter(Boolean))];
}

function populateDropdown(id, options, defaultText = null) {
  const dropdown = document.getElementById(id);
  const currentSelection = Array.from(dropdown.selectedOptions).map(opt => opt.value);
  dropdown.innerHTML = "";

  if (!dropdown.multiple && defaultText) {
    dropdown.appendChild(new Option(defaultText, "", true));
  }

  options.forEach(option => {
    const opt = new Option(option, option);
    if (currentSelection.includes(option)) opt.selected = true;
    dropdown.appendChild(opt);
  });
}

// 📌 Event Listeners
document.getElementById("reset-button").addEventListener("click", () => {
  filterButtonActive = false;
  document.getElementById("filter-button-1").style.backgroundColor = "blue";
  document.getElementById("search-bar").value = "";

  document.getElementById("filter-me-name").selectedIndex = 0;
  ["filter-beat", "filter-basepack-desc"].forEach(id => {
    const select = document.getElementById(id);
    Array.from(select.options).forEach(option => option.selected = false);
  });

  applyFilters();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-beat").addEventListener("change", applyFilters);
document.getElementById("filter-basepack-desc").addEventListener("change", applyFilters);

document.getElementById("filter-button-1").addEventListener("click", () => {
  filterButtonActive = !filterButtonActive;
  document.getElementById("filter-button-1").style.backgroundColor = filterButtonActive ? "green" : "blue";
  applyFilters();
});

// 🚀 Initialize everything
function initialize() {
  populateTable(jsonData);
  updateDropdowns(jsonData);
}

fetchData();
