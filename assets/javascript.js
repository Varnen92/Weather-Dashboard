var cityForm = document.querySelector('#city-input')
var cityName = document.querySelector('#city')
var cityCard = document.querySelector('#city-body')
var today = new Date()
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

// City search functionaility
var citySearch = function (event) {
    event.preventDefault()

    var city = cityName.value.trim();

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
            response.json().then(function (data) {
                getCityInfo(data)
            })
        } else {
            alert("Not a valid city name!")
        }
    })
        .catch(function (error) {
            alert("Unable to connect to Weather Dashboard! Please try again later!")
        })
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
            })
        } else {
            alert("Not a valid city name!")
        }
    })
        .catch(function (error) {
            alert("Unable to connect to Weather Dashboard!")
        })
}


var displayWeather = function (cityInfo) {
    console.log(cityInfo)

    cityCard.textContent = ""
    // gatheres elements all required for Weather snapshot
    var cityName = document.createElement("h3")
    cityName.textContent = cityInfo.name + " " + date
    cityCard.appendChild(cityName)

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



// Event listeners
cityForm.addEventListener("submit", citySearch)