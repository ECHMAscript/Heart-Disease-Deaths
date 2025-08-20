class HeartData {
    #stateName;
    #stateAbbr;
    #cityName;
    #regionType;
    #deathRate;
    #deathRatePer100k;
    #sex;
    #race;
    #date;

    constructor() {}

    generateTableRow() {
        return `<tr>
            <td>${this.date || ""}</td>
            <td>${this.stateAbbr || ""}</td>
            <td>${this.cityName || ""}</td>
            <td>${this.regionType || ""}</td>
            <td>${this.deathRate || ""}</td>
            <td>${this.deathRatePer100k || ""}</td>
            <td>${this.sex || ""}</td>
            <td>${this.race || ""}</td>
        </tr>`;
}

    // GETTERS AND SETTERS

    // Getter and Setter for stateName
    get stateName() {
      return this.#stateName;
    }
    set stateName(value) {
      this.#stateName = value;
    }

    // Getter and Setter for stateAbbr
    get stateAbbr() {
      return this.#stateAbbr;
    }
    set stateAbbr(value) {
      this.#stateAbbr = value;
    }

    // Getter and Setter for cityName
    get cityName() {
      return this.#cityName;
    }
    set cityName(value) {
      this.#cityName = value;
    }

    // Getter and Setter for regionType
    get regionType() {
      return this.#regionType;
    }
    set regionType(value) {
      this.#regionType = value;
    }

    // Getter and Setter for deathRate
    get deathRate() {
      return this.#deathRate;
    }
    set deathRate(value) {
      this.#deathRate = value;
    }

    // Getter and Setter for deathRatePer100k
    get deathRatePer100k() {
      return this.#deathRatePer100k;
    }
    set deathRatePer100k(value) {
      this.#deathRatePer100k = value;
    }

    // Getter and Setter for sex
    get sex() {
      return this.#sex;
    }
    set sex(value) {
      this.#sex = value;
    }

    // Getter and Setter for race
    get race() {
      return this.#race;
    }
    set race(value) {
      this.#race = value;
    }

    // Getter and Setter for date
    get date() {
      return this.#date;
    }
    set date(value) {
      this.#date = value;
    }

}

const US_STATE_ABBR = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];
const wrapper = document.querySelector(".wrapper");
const table = wrapper.querySelector(".table tbody");
const searchBar = wrapper.querySelector(".searchbar-wrapper__input");
const searchBtn = wrapper.querySelector(".searchbar-wrapper__button");
const alphabeticalOrderBtn = wrapper.querySelector("#alphabetical-order");
const genderDropdownLIs = wrapper.querySelectorAll(".dropdown-list__list-item");
const deathRateBtn = wrapper.querySelector(".filter-options__list-item:nth-child(3)");


function addPins(stateData) {

  const purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

    stateData.forEach(state => {
        L.marker([state.coords[0], state.coords[1]],{
          icon: purpleIcon // fill color
        }).addTo(map)
                .bindPopup(`<b>${state.name}</b><br>4.5 million`);
    });
}

function addCircle(stateData) {
      stateData.forEach(state => {
          L.circleMarker([state.coords[0], state.coords[1]], {
            radius: 8,
            color: 'none',       // border color
            fillColor: 'rgb(191, 36, 238)',  // fill color
            fillOpacity: 0.8
          }).addTo(map).bindPopup("I'm a red circle!");
    });
}


function printErrorMessage(message) {
  const errorMessageContainer = wrapper.querySelector(".error-message-container");
  errorMessageContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

function removeErrorMessage() {
  const errorMessageContainer = wrapper.querySelector(".error-message-container");
  errorMessageContainer.innerHTML = "";
}

function clearTable() {
  const rows = table.querySelectorAll("tr");
  rows.forEach(row => {
  row.remove();
  });
}

function insertRow(listItem) {
    let newRow = listItem.generateTableRow();
    table.insertAdjacentHTML("beforeend", newRow);
}

function sortByCityName(list) {
  return list.sort((a, b) => a.cityName.localeCompare(b.cityName));
}

function sortByDeathRate(list) {
  return list.sort((a, b) => {
    const rateA = isNaN(Number(a.deathRate)) ? Number.NEGATIVE_INFINITY : Number(a.deathRate);
    const rateB = isNaN(Number(b.deathRate)) ? Number.NEGATIVE_INFINITY : Number(b.deathRate);
    return rateB - rateA;
  });
}

function filterByGender(gender) {
  const existingRows = getExistingTableRows();
    switch(gender) {
      case "Male":
        console.log("M");
        return existingRows.filter(item => item.sex === "Male");
        break;
      case "Female":
        console.log("F");
        return existingRows.filter(item => item.sex === "Female");
        break;
      case "Overall":
        console.log("O"); 
        return existingRows.filter(item => item.sex === "Overall");
        break;
  }
}


//要编程一些搜索功能。。。。

function search(value) {

  if (US_STATE_ABBR.includes(value.toUpperCase())) 
  {
    getHeartData(value);
    removeErrorMessage();
    clearTable();

  } else {
    printErrorMessage("Please enter a valid US state abbreviation (e.g., CA, NY, TX).");
  }
  console.log(value)
}


function getHeartData(value) {
let heartData = "";


// Connect to API using Fetch API
fetch("https://data.cdc.gov/api/views/55yu-xksw/rows.json?accessType=DOWNLOAD")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.status);
    }
    return response.json();
  })
  .then(data => {
    heartData = data;

    let resultList = []

    for (let i = 0; i < heartData.data.length; i++) {
      // console.log(heartData.data[i]);
        let heartDataObj = new HeartData();

        // console.log(heartData.data[i]);

        for (let j = 8; j < heartData.data[i].length; j++) {


            // Set properties based on the index
            switch(j) {
                case 8:
                    heartDataObj.date = heartData.data[i][j];
                    break;
                case 9:
                    heartDataObj.stateAbbr = heartData.data[i][j];
                    break;
                case 10:
                    heartDataObj.cityName = heartData.data[i][j];
                    break;
                case 11:
                    heartDataObj.regionType = heartData.data[i][j];
                    break;
                case 15:
                    heartDataObj.deathRate = heartData.data[i][j] ? heartData.data[i][j] : "Unknown";

                    break;
                case 16:
                    heartDataObj.deathRatePer100k = heartData.data[i][j] ? heartData.data[i][j] : "Unknown";
                    break;
                case 21:
                    heartDataObj.sex = heartData.data[i][j];
                    break;
                case 23:
                    heartDataObj.race = heartData.data[i][j];
                    break;
            }

            // Filter only the needed data
            if (j == 11) {
                j += 3;
            } else if (j == 16) {
                j += 4;
            } else if (j == 21) {
                j += 1;
            } else if (j == 23) {
                j += 7;
            }
        }

        resultList.push(heartDataObj);


    }


    let resultLimiter = 15;
    for (let i = 0; i < resultList.length; i++) {

      if (resultList[i].stateAbbr.includes(value.toUpperCase()) && resultLimiter > 0) {
        insertRow(resultList[i]);
        resultLimiter--;
      }

    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });
};



function getExistingTableRows() {
  let cityNames = [];
  const existingRows = table.querySelectorAll("tr");

  
  for (let i = 0; i < existingRows.length; i++) {
      const tds = existingRows[i].querySelectorAll("td");

    // Bind the data to the HeartData object
    if (tds.length === 8) { // Ensure all columns are present
      let heartDataObj = new HeartData();
      heartDataObj.date = tds[0].textContent;
      heartDataObj.stateAbbr = tds[1].textContent;
      heartDataObj.cityName = tds[2].textContent;
      heartDataObj.regionType = tds[3].textContent;
      heartDataObj.deathRate = tds[4].textContent;
      heartDataObj.deathRatePer100k = tds[5].textContent;
      heartDataObj.sex = tds[6].textContent;
      heartDataObj.race = tds[7].textContent;
      cityNames.push(heartDataObj);
    }
  }

  return cityNames;
}


searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    search(searchBar.value);
  }
});

searchBtn.addEventListener("click", (e) => {
  search(searchBar.value);
})


// Get the 
alphabeticalOrderBtn.addEventListener("click", (e) => {
  const existingRows = getExistingTableRows();

  sortByCityName(existingRows);

  clearTable();

  for (let i = 0; i < existingRows.length; i++) {
    insertRow(existingRows[i]);
  }
});


//编程那个dropdown的功能


// Loop through all of the dropdown list items
for (let i = 0; i < genderDropdownLIs.length; i++) {

  // Add a click event listener to each dropdown list item
  genderDropdownLIs[i].addEventListener("click", (e) => {

    // Filter the existing rows based on the gender
    const filteredList = filterByGender(e.target.textContent);

    // Clear the table before inserting new rows
    clearTable();

    // Insert the filtered rows into the table
    for (let i = 0; i < filteredList.length; i++) {
      insertRow(filteredList[i]);
    }
  });
}

// Add a click event listener to the death rate button

deathRateBtn.addEventListener("click", (e) => {
  const existingRows = getExistingTableRows();

  // Sort the existing rows by death rate
  const sortedList = sortByDeathRate(existingRows);

  // Clear the table before inserting new rows
  clearTable();

  // Insert the sorted rows into the table
  for (let i = 0; i < sortedList.length; i++) {
    insertRow(sortedList[i]);
  }
});


// 编程地图的功能
const states = [
  { name: "Alabama", coords: [32.806671, -86.791130] },
  { name: "Alaska", coords: [61.370716, -152.404419] },
  { name: "Arizona", coords: [33.729759, -111.431221] },
  { name: "Arkansas", coords: [34.969704, -92.373123] },
  { name: "California", coords: [36.116203, -119.681564] },
  { name: "Colorado", coords: [39.059811, -105.311104] },
  { name: "Connecticut", coords: [41.597782, -72.755371] },
  { name: "Delaware", coords: [39.318523, -75.507141] },
  { name: "Florida", coords: [27.766279, -81.686783] },
  { name: "Georgia", coords: [33.040619, -83.643074] },
  { name: "Hawaii", coords: [21.094318, -157.498337] },
  { name: "Idaho", coords: [44.240459, -114.478828] },
  { name: "Illinois", coords: [40.349457, -88.986137] },
  { name: "Indiana", coords: [39.849426, -86.258278] },
  { name: "Iowa", coords: [42.011539, -93.210526] },
  { name: "Kansas", coords: [38.526600, -96.726486] },
  { name: "Kentucky", coords: [37.668140, -84.670067] },
  { name: "Louisiana", coords: [31.169546, -91.867805] },
  { name: "Maine", coords: [44.693947, -69.381927] },
  { name: "Maryland", coords: [39.063946, -76.802101] },
  { name: "Massachusetts", coords: [42.230171, -71.530106] },
  { name: "Michigan", coords: [43.326618, -84.536095] },
  { name: "Minnesota", coords: [45.694454, -93.900192] },
  { name: "Mississippi", coords: [32.741646, -89.678696] },
  { name: "Missouri", coords: [38.456085, -92.288368] },
  { name: "Montana", coords: [46.921925, -110.454353] },
  { name: "Nebraska", coords: [41.125370, -98.268082] },
  { name: "Nevada", coords: [38.313515, -117.055374] },
  { name: "New Hampshire", coords: [43.452492, -71.563896] },
  { name: "New Jersey", coords: [40.298904, -74.521011] },
  { name: "New Mexico", coords: [34.840515, -106.248482] },
  { name: "New York", coords: [42.165726, -74.948051] },
  { name: "North Carolina", coords: [35.630066, -79.806419] },
  { name: "North Dakota", coords: [47.528912, -99.784012] },
  { name: "Ohio", coords: [40.388783, -82.764915] },
  { name: "Oklahoma", coords: [35.565342, -96.928917] },
  { name: "Oregon", coords: [44.572021, -122.070938] },
  { name: "Pennsylvania", coords: [40.590752, -77.209755] },
  { name: "Rhode Island", coords: [41.680893, -71.511780] },
  { name: "South Carolina", coords: [33.856892, -80.945007] },
  { name: "South Dakota", coords: [44.299782, -99.438828] },
  { name: "Tennessee", coords: [35.747845, -86.692345] },
  { name: "Texas", coords: [31.054487, -97.563461] },
  { name: "Utah", coords: [40.150032, -111.862434] },
  { name: "Vermont", coords: [44.045876, -72.710686] },
  { name: "Virginia", coords: [37.769337, -78.169968] },
  { name: "Washington", coords: [47.400902, -121.490494] },
  { name: "West Virginia", coords: [38.491226, -80.954456] },
  { name: "Wisconsin", coords: [44.268543, -89.616508] },
  { name: "Wyoming", coords: [42.755966, -107.302490] },
  { name: "District of Columbia", coords: [38.897438, -77.026817] }
];


const map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false,
    touchZoom: false,
    doubleClickZoom: false,
    dragging: false
}).setView([39.8283, -98.5795], 4);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

addPins(states);

// addCircle(states);

