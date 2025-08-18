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


    let resultLimiter = 10;
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

  sortByCityName(cityNames);

  clearTable();

  for (let i = 0; i < cityNames.length; i++) {
    insertRow(cityNames[i]);
  }
});