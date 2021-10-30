var cityForm = document.querySelector('#city-input')
var cityName = document.querySelector('#city')
var cityCard = document.querySelector('#city-body')
var cityFuture = document.querySelector('#future-date-holders')
var cityStorage = document.querySelector('#city-search')
var cityPast = document.querySelector('#city-history-block')
var currentCity = ""

var today = new Date()
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var cityHistory = []

const btn = document.querySelector('.btn')


// City search functionaility
var citySearch = function (event) {
    event.preventDefault()
    var city = cityName.value.trim();
    currentCity = city
    if (city) {
        getCityCoordinates(city)
        cityName.value = ""

    } else {
        alert("Please enter a city name")
    }
}

// API to grab lat and long of city
var getCityCoordinates = function (city) {

    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=735f15cd7d0f55eecad4ccfafbaa11cd"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            console.log(apiUrl)
            cityHistory.push(city)

            response.json().then(function (data) {
                if (data.length === 0) {
                    cityHistory.pop()
                    alert("Invalid city was entered, please try again!")
                } else {
                    historyWeather(city)
                    getCityInfo(data)
                }
            })
        } else {
            alert("Not a valid city name!")
        }
    })
      /*   .catch(function (error) {
            alert("Unable to connect to Weather Dashboard! Please try again later!")
        }) */
}

// API for city daily info statistics
var getCityInfo = function (city) {
    var lat = city[0].lat
    var long = city[0].lon

    var oneCallApi = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=735f15cd7d0f55eecad4ccfafbaa11cd"

    fetch(oneCallApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data)
                futureWeather(data)
            })
        } else {
            alert("Not a valid city name!")
        }
    })
      /*   .catch(function (error) {
            alert("Unable to connect to Weather Dashboard!")
        }) */
}


// displays weather for current day
var displayWeather = function (cityInfo) {
    console.log(cityInfo)
    cityCard.textContent = ""

    var weatherIcon = document.createElement("img")
    weatherIcon.src = "https://openweathermap.org/img/wn/" + cityInfo.current.weather[0].icon + "@2x.png"

    // gatheres elements all required for Weather snapshot
    var cityName = document.createElement("span")
    cityName.classList = "display-5"
    cityName.textContent = currentCity + " " + date
    cityCard.appendChild(cityName)
    cityCard.appendChild(weatherIcon)

    var cityTemp = document.createElement("span")
    cityTemp.classList = "d-block p-2 lead"
    cityTemp.textContent = " Temperature: " + cityInfo.current.temp + "\u00B0 F "
    cityCard.appendChild(cityTemp)

    var cityWind = document.createElement("span")
    cityWind.classList = "d-block p-2 lead"
    cityWind.textContent = "Wind: " + cityInfo.current.wind_speed + " MPH"
    cityCard.appendChild(cityWind)

    var cityHumid = document.createElement("span")
    cityHumid.classList = "d-block p-2 lead"
    cityHumid.textContent = "Humidity: " + cityInfo.current.humidity + " %"
    cityCard.appendChild(cityHumid)

    if (cityInfo.current.uvi <= 2) {
        var cityUv = document.createElement("span")
        cityUv.classList = "d-block p-2 lead bg-success w-25 text-white"
        cityUv.textContent = "UV Index: " + cityInfo.current.uvi
        cityCard.appendChild(cityUv)
    } else if (cityInfo.current.uvi > 2 && cityInfo.current.uvi <= 8) {
        var cityUv = document.createElement("span")
        cityUv.classList = "d-block p-2 lead bg-warning w-25"
        cityUv.textContent = "UV Index: " + cityInfo.current.uvi
        cityCard.appendChild(cityUv)
    } else {
        var cityUv = document.createElement("span")
        cityUv.classList = "d-block p-2 lead bg-danger text-white w-25"
        cityUv.textContent = "UV Index: " + cityInfo.current.uvi
        cityCard.appendChild(cityUv)
    }

}

// displays weather for future dates
var futureWeather = function (cityInfo) {
    cityInfo.daily.length = 5
    cityFuture.textContent = ""

    for (let i = 0; i < cityInfo.daily.length; i++) {

        var forecastBlock = document.createElement("div")
        forecastBlock.classList = "card bg-secondary text-white m-3"

        var dateFuture = new Date(cityInfo.daily[i].dt * 1000)
        dateFuture = dateFuture.toLocaleDateString()

        var showFuture = document.createElement("span")
        showFuture.textContent = dateFuture
        forecastBlock.appendChild(showFuture)

        var weatherIcon = document.createElement("img")
        weatherIcon.src = "https://openweathermap.org/img/wn/" + cityInfo.daily[i].weather[0].icon + ".png"
        weatherIcon.classList = "weather-icon"
        forecastBlock.appendChild(weatherIcon)

        var cityTemp = document.createElement("span")
        cityTemp.classList = "d-block p-2 lead"
        cityTemp.textContent = " Temperature: " + cityInfo.daily[i].temp.day + "\u00B0 F"
        forecastBlock.appendChild(cityTemp)

        var cityWind = document.createElement("span")
        cityWind.classList = "d-block p-2 lead"
        cityWind.textContent = "Wind: " + cityInfo.daily[i].wind_speed + " MPH"
        forecastBlock.appendChild(cityWind)

        var cityHumid = document.createElement("span")
        cityHumid.classList = "d-block p-2 lead"
        cityHumid.textContent = "Humidity: " + cityInfo.daily[i].humidity + " %"
        forecastBlock.appendChild(cityHumid)

        // appends all info to each daily forecast block
        cityFuture.appendChild(forecastBlock)

    }
}


var historyWeather = function () {
    cityPast.textContent = ""

    for (let i = 0; i < cityHistory.length; i++) {

        var historyBlock = document.createElement("div")

        var searchHistory = document.createElement("button")
        searchHistory.classList = "btn btn-secondary m-1 cityButton"
        searchHistory.dataset.city = cityHistory[i]
        searchHistory.textContent = cityHistory[i]
        searchHistory.addEventListener("click", function (e) {
            cityName.value = e.target.dataset.city
            citySearch(e)
        })
        cityHistory = [...new Set(cityHistory)]
        historyBlock.appendChild(searchHistory)
        cityPast.appendChild(historyBlock)
    }
}

// Event listeners
cityForm.addEventListener("submit", citySearch)



