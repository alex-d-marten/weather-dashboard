var currentWeather = [];
var excludeAlerts = 'Alerts';
var cityLat;
var cityLong;
var cityAPISearch = [];
var citySearchString;
var searchHistory = [];
const searchButtonEl = $('#search');
const cityInputEl = $('#city-search');


var retrieveHistory = function() {
    storedHistory = JSON.parse(localStorage.getItem('citySearchHistory'));

    if (storedHistory) {
        searchHistory = storedHistory;
    }
}

retrieveHistory();

var testWeatherAPI = function(cityLat, cityLong) {
    currentWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=${'imperial'}&exclude=${excludeAlerts}&appid=${'94e32ddc97880c45b19a69dfc85aec8d'}`;
    fetch(currentWeather)
        .then(response => response.json())
        .then(function(data) {
            console.log(data);
        });
};

var testCityAPI = function(city) {
    cityAPISearch = `http://api.positionstack.com/v1/forward?access_key=${'3f39be56daa79b8f85d50e3d985d6f6d'}&query=${city}`;
    fetch(cityAPISearch)
        .then(response => response.json())
        .then(function(data) {
            cityLat = data.data[0].latitude;
            cityLong = data.data[0].longitude;
            console.log(cityLat, cityLong)
            testWeatherAPI(cityLat, cityLong);
        })

};

var userCitySearch = function() {
    citySearchString = cityInputEl[0].value;
    console.log(citySearchString)
    
    if(citySearchString) {
        // testCityAPI(citySearchString);
        searchHistory.push(citySearchString);
        localStorage.setItem('citySearchHistory', JSON.stringify(searchHistory));
        cityInputEl[0].value = "";
    }
    else {
        alert("Please enter a city.")
    }
}


// testCityAPI(citySearchString);
// https://api.openweathermap.org/data/2.5/onecall?lat=38.7521&lon=121.2880&exclude=Alerts&appid=APIKey

searchButtonEl.on('click', userCitySearch)