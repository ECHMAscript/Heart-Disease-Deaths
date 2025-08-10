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

const wrapper = document.querySelector(".wrapper");
const table = document.querySelector(".table");


function getHeartData() {
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
    // console.log(heartData.data);

    let resultList = []



    for (let i = 0; i < 10; i++) {
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


    for (let i = 0; i < resultList.length; i++) {
      console.log(resultList[i]);
        let newRow = resultList[i].generateTableRow();
        table.insertAdjacentHTML("beforeend", newRow);
    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });
};


  

getHeartData()

