function initPage() {
    const history = document.getElementById("history");
    const UV = document.getElementById("UV");
    const Wind = document.getElementById("wind-speed");
    const Humidity = document.getElementById("humidity");
    const Temp = document.getElementById("temperature");
    const Pic = document.getElementById("current-picture");
    const name = document.getElementById("city");
    const clear = document.getElementById("clear-history");
    const search = document.getElementById("search-button");
    const city = document.getElementById("enter-city");
    var fiveday = document.getElementById("5-day");
    var tweather = document.getElementById("t-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    const APIKey = "84b79da5e5d7c92085660485702f4ce8";
    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {
                
                tweather.classList.remove("d-none");

                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                name.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                Pic.setAttribute("src", "https:/openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                Pic.setAttribute("alt", response.data.weather[0].description);
                Temp.innerHTML = "Temperature: " + k2f(response.data.main.temp) + "&#176F";
                Humidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                Wind.innerHTML = "Wind Speed: " + response.data.wind.speed + "MPH";

                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt-1";
                axios.get(UVQueryURL)
                .then(function (response) {
                    let UVIndex = document.createElement("span");
                    if(response.data[0].value < 4){
                        UVIndex.setAttribute("class","badge badge-success");
                    }
                    else if (response.data[0].value < 8) {
                        UVIndex.setAttribute("class","badge badge-warning");
                    }
                    else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }
                    console.log(response.data[0].value)
                    UVIndex.innerHTML = response.data[0].value;
                    UV.append(UVIndex);
                });

                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(forecastQueryURL)
                .then(function (response) {
                    fiveday.classList.remove("d-none");

                    const forecast = document.querySelectorAll(".forecast");
                    for (i = 0; i < forecast.length; i++) {
                        forecast[i].innerHTML = "";
                        const forecastIndex = i * 8 + 4;
                        const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                        const forecastDay = forecastDate.getDate();
                        const forecastMonth = forecastDate.getMonth();
                        const forecastYear =forecastDate.getFullYear();
                        const forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecast[i].append(forecastDateEl);

                        const forecastWeather = document.createElement("img");
                        forecastWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                        forecastWeather.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                        forecast[i].append(forecastWeather);
                        const forecastTemp = document.createElement("p");
                        forecastTemp.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + "&#176F";
                        forecast[i].append(forecastTemp);
                        const forecastHumidity = document.createElement("p");
                        forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                        forecast[i].append(forecastHumidity);
                    }
                });
            });
    }
    search.addEventListener("click", function () {
        const searchTerm = city.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    clear.addEventListener("click", function () {
        localStorage.clear();
        searchHistory.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
        history.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function(){
            getWeather(historyItem.value);
            })
            history.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
}

initPage();