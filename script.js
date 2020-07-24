//function to get a search value
function getSearchVal() {
    var searchValue = document.querySelector("#search-value").value;
    searchWeather(searchValue);
    makeRow(searchValue);    
}
//collect our search history into a list
//make the search history clickable and give it a search value when clicked
function makeRow(searchValue) {
    var liEl = document.createElement("li")
    liEl.classList.add("list-group-item", "list-group-item-action");
    var text = searchValue;
    liEl.textContent = text;
    var historyEl = document.querySelector('.history');
    console.log(event.target)
    historyEl.onclick = function() {
        console.log(event.target.tagName)
        if (event.target.tagName == "LI"){
        searchWeather(event.target.textContent)
        }
    }
    historyEl.appendChild(liEl);
};
//fetch the open weather api for current weather
function searchWeather(searchValue) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=fe51b9fd82b656131cd4dc56a05cb096&units=imperial")
    //return a json response
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
    //clear any old content
        todayEl = document.querySelector("#today");
        todayEl.textContent = " ";
        //html elements and bootstrap classes for the current weather
        var titleEl = document.createElement("h3")
        titleEl.classList.add("card-title");
        titleEl.textContent = data.name + " (" + new Date().toLocaleDateString() + ")";
        var cardEl = document.createElement("div");
        cardEl.classList.add("card");
        var windEl = document.createElement("p");
        windEl.classList.add("card-text");
        var humidEl = document.createElement("p");
        humidEl.classList.add("card-text");
        var tempEl = document.createElement("p");
        tempEl.classList.add("card-text");
        humidEl.textContent = "Humidity: " + data.main.humidity + " %";
        tempEl.textContent = "Temperature: " + data.main.temp + " °F";
        var cardBodyEl = document.createElement("div");
        cardBodyEl.classList.add("card-body");
        var imgEl = document.createElement("img");
        imgEl.setAttribute("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        //appendages
        titleEl.appendChild(imgEl)
        cardBodyEl.appendChild(titleEl);
        cardBodyEl.appendChild(tempEl);
        cardBodyEl.appendChild(humidEl);
        cardBodyEl.appendChild(windEl);
        cardEl.appendChild(cardBodyEl);
        todayEl.appendChild(cardEl);  
        //give the forecast a value of the search input value
        getForecast(searchValue);
        //set UV index to search location's coordinates
        getUVIndex(data.coord.lat, data.coord.lon);
    }
)}
//we need to fetch api for the forecast and write in the function for that to attach to the search value
function getForecast(searchValue) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=fe51b9fd82b656131cd4dc56a05cb096&units=imperial")
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        console.log(data)
        var forecastEl = document.querySelector("#forecast");
        forecastEl.innerHTML = "<h4 class=\"mt-3\">5-Day Forecast:</h4>";
        forecastRowEl = document.createElement("div");
        forecastRowEl.className = "\"row\"";
        for (var i = 0; i < data.list.length; i++) {
            // only look at forecasts around 3:00pm
            if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
        //add in html elements for the bootstrap card
        var colEl = document.createElement("div");
        colEl.classList.add("col-md-2");
        var cardEl = document.createElement("div");
        cardEl.classList.add("card", "bg-dark", "text-white");
        var windEl = document.createElement("p");
        windEl.classList.add("card-text");
        windEl.textContent = "Wind Speed: " + data.list[i].wind.speed + " MPH";
        var humidityEl = document.createElement("p");
        humidityEl.classList.add("card-text");
        humidityEl.textContent = "Humidity : " + data.list[i].main.humidity + " %";
        var bodyEl = document.createElement("div");
        bodyEl.classList.add("card-body", "p-2");
        var titleEl = document.createElement("div");
        titleEl.classList.add("card-title");
        titleEl.textContent = new Date(data.list[i].dt_txt).toLocaleDateString()
        var imgEl = document.createElement("img")
        imgEl.setAttribute("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png" )
        var p1El = document.createElement("p");
        p1El.classList.add("card-text");
        p1El.textContent = "Temp: " + data.list[i].main.temp_max + " °F";
        var p2El = document.createElement("p");
        p2El.classList.add("card-text");
        p2El.textContent = "Humidity: " + data.list[i].main.humidity + " %";
        //append to page
        colEl.appendChild(cardEl);
        bodyEl.appendChild(titleEl);
        bodyEl.appendChild(imgEl);
        bodyEl.appendChild(windEl);
        bodyEl.appendChild(humidityEl);
        bodyEl.appendChild(p1El);
        bodyEl.appendChild(p2El);
        cardEl.appendChild(bodyEl);
        forecastEl.appendChild(colEl);
            }
        }     
    });
}
//then we need to fetch the uv index and apply it to the lattitude and longitude
function getUVIndex(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/uvi?appid=fe51b9fd82b656131cd4dc56a05cb096&lat=" + lat + "&lon=" + lon)
    .then(function(response){
        return response.json();
    }).then(function(data){
        var bodyEl = document.querySelector(".card-body");
        var uvEl = document.createElement("p");
        uvEl.textContent = "UV Index: "
        var buttonEl = document.createElement("span");
        buttonEl.classList.add("btn", "btn-sm");
        buttonEl.innerHTML = data.value;   
        //if uv index is under 3 the color will represent success
        if (data.value < 3) {
            buttonElEl.classList.add("btn-success");
        } //if uv index is over 3 but under 7 color will represent warning
        else if (data.value < 7) {
            buttonEl.classList.add("btn-warning")
        } //if over 7 color represents danger!
        else {
            buttonEl.classList.add("btn-danger");
        }
        bodyEl.appendChild(uvEl);
        uvEl.appendChild(buttonEl);
    })
}
//we need to listen for clicks
document.querySelector("#search-button").addEventListener("click", getSearchVal);c