var cityForm = document.querySelector('#city-input')
var cityName = document.querySelector('#city')

// City search functionaility
var citySearch = function(event) {
    event.preventDefault()

    var city = cityName.value.trim();

    if (city) {
        getCityInfo(city)
        cityName.value = ""
    } else {
        alert("Please enter a city name")
    }
}

// API for city info statistics
var getCityInfo = function (city) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=735f15cd7d0f55eecad4ccfafbaa11cd"
    fetch(apiUrl).then(function (response){
        if (response.ok) {
            response.json().then(function(){
            console.log(apiUrl)
            displayWeather()
            })
        } else {
            alert("Not a valid city name!")
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Weather Dashboard!")
    })
}

var displayWeather = function() {
    
}

// Event listeners
cityForm.addEventListener("submit", citySearch)