// Declare constants and variables
var forecastWeather;
var cityLat;
var cityLong;
var cityAPISearch = [];
var citySearchString;
var searchHistory = [];
var dataSet;
var dateFormatCurrent;
var dateFormatForecast = [];
var dtForecast;

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
    var currentWeatherAPICall = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=${'imperial'}&exclude=${'alerts,hourly,minutely'}&appid=${'94e32ddc97880c45b19a69dfc85aec8d'}`;
    fetch(currentWeatherAPICall)
        .then(response => response.json())
        .then(function(data) {
            dataSet = data;
            console.log(dataSet)

            let currentWeather = {
                temp: dataSet.current.temp,
                wind: dataSet.current.wind_speed,
                humidity: dataSet.current.humidity,
                uvi: dataSet.current.uvi
            };

            var dtCurrent = data.current.dt;
            dtForecast = data.daily;
            var millsecondsCurrent = dtCurrent * 1000;
            var dateObjectCurrent = new Date(millsecondsCurrent);
            dateFormatCurrent = dateObjectCurrent.toLocaleDateString('en-US');

            renderContent(currentWeather, dataSet);

            for(var i=1; i < 6; i++) {
                var millsecondsForecast = dtForecast[i].dt * 1000;
                var dateObjectForecast = new Date(millsecondsForecast);
                currentDate = dateObjectForecast.toLocaleDateString('en-US');
                dateFormatForecast.push(currentDate);
            }
        });
        
};

var callCityAPI = function(city) {
    cityAPISearch = `http://api.positionstack.com/v1/forward?access_key=${'3f39be56daa79b8f85d50e3d985d6f6d'}&query=${city}`;
    fetch(cityAPISearch)
        .then(response => response.json())
        .then(function(data) {
            cityLat = data.data[0].latitude;
            cityLong = data.data[0].longitude;
            callWeatherAPI(cityLat, cityLong);
        })

};

// function to execute when the search button is clicked
var userCitySearch = function() {
    citySearchString = cityInputEl[0].value;
    
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
var renderContent = function(currentWeather, dataSet) {
    // $('#current-weather-container').empty();
    // render current weather conditions in city searched
    const h2El = $('<h2>');
    const divEl = $('<div>');
    const pEl1 = $('<p>');
    const pEl2 = $('<p>');
    const pEl3 = $('<p>');
    const pEl4 = $('<p>');
    
    const brEl = $('<br>');

    divEl.addClass("current-weather mt-2 border border-dark p-2");

    h2El
        .addClass("fw-bold current-location")
        .text(citySearchString + ' ' + dateFormatCurrent)
        .append(`<img src="http://openweathermap.org/img/wn/${dataSet.current.weather[0].icon}@2x.png" width="75" height="75" />`);
    divEl.append(h2El);

    pEl1
        .addClass("fw-bold")
        .text('Temp: ' + `${currentWeather.temp}` + '\u00B0F')
    divEl.append(pEl1);
    
    pEl2
        .addClass('fw-bold')
        .text('Wind: ' + `${currentWeather.wind}` + 'MPH')
    divEl.append(pEl2);

    pEl3
        .addClass('fw-bold')
        .text('Humidity: ' + `${currentWeather.humidity}`+ '%')
    divEl.append(pEl3);

    pEl4
        .addClass('fw-bold')
        .text('UVI: ' + `${currentWeather.uvi}`)
    divEl.append(pEl4);
    $('#current-weather-container').prepend(divEl);
    

    // render the next 5 day forecast
}


// function to populate search history below search bar
var populateHistory = function() {
    var searchHistoryEl = $('.search-history');
    // searchHistoryEl.empty();
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

