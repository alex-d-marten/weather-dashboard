// Declare constants and variables
var currentWeather = [];
var excludeAlerts = 'Alerts';
var cityLat;
var cityLong;
var cityAPISearch = [];
var citySearchString;
var searchHistory = [];
var dataSet;
var dateFormat;
const searchButtonEl = $('#search');
const cityInputEl = $('#city-search');

// retrieve local storage
var retrieveHistory = function() {
    storedHistory = JSON.parse(localStorage.getItem('citySearchHistory'));

    if (storedHistory) {
        searchHistory = storedHistory;
    }
}
retrieveHistory();

// 
var callWeatherAPI = function(cityLat, cityLong) {
    currentWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=${'imperial'}&exclude=${excludeAlerts}&appid=${'94e32ddc97880c45b19a69dfc85aec8d'}`;
    fetch(currentWeather)
        .then(response => response.json())
        .then(function(data) {
            dataSet = data;
            console.log(data);
            console.log(data.current.dt)
            var dt = data.current.dt;  
            // var DateTime = data.current.dt;
            // DateTime.toLocaleString();
            // console.log(DateTime)
            dateFunction(dt);
            console.log(dateFormat)
        });
};

var callCityAPI = function(city) {
    cityAPISearch = `http://api.positionstack.com/v1/forward?access_key=${'3f39be56daa79b8f85d50e3d985d6f6d'}&query=${city}`;
    fetch(cityAPISearch)
        .then(response => response.json())
        .then(function(data) {
            cityLat = data.data[0].latitude;
            cityLong = data.data[0].longitude;
            console.log(cityLat, cityLong)
            callWeatherAPI(cityLat, cityLong);
        })

};

var dateFunction = function(date) {
    var millseconds = date * 1000;
    var dateObject = new Date(millseconds);
    dateFormat = dateObject.toLocaleDateString('en-US');
}

// function to execute when the search button is clicked
var userCitySearch = function() {
    citySearchString = cityInputEl[0].value;
    console.log(citySearchString)
    
    if(citySearchString) {
        callCityAPI(citySearchString);
        searchHistory.push(citySearchString);
        localStorage.setItem('citySearchHistory', JSON.stringify(searchHistory));
        populateHistory();
        cityInputEl[0].value = "";
    }
    else {
        alert("Please enter a city.")
    }
}

// function to render weather condition content
var renderContent = function() {
    // render current weather conditions in city searched

    // render the next 5 day forecast
}




// function to populate search history below search bar
var populateHistory = function() {
    var searchHistoryEl = $('.search-history');
    searchHistoryEl.empty();
    for(var i=0; i < searchHistory.length; i++) {
        var city = searchHistory[i];

        const buttonEl = $('<button>')
            .addClass('bg-secondary text-white rounded mt-1 mb-3 w-100 history-btn')
            .text(city)
            .attr('id', i);

        searchHistoryEl.append(buttonEl);

    }
}

populateHistory();

// search button click functionality
searchButtonEl.on('click', userCitySearch)
const historyButtonEl = $('.history-btn');

// search history button click functionality
historyButtonEl.on('click', function(event) {
    const id = event.target.id
    var city = historyButtonEl[id].textContent
    console.log(city);
    // callCityAPI(city);
})