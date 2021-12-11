// Declare constants and variables
var forecastWeather;
var cityLat;
var cityLong;
var cityAPISearch = [];
var citySearchString;
var searchHistory = [];
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

// function to gather weather conditions based on the city lat and long provided from the geocoding api
var callWeatherAPI = function(cityLat, cityLong) {
    var currentWeatherAPICall = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=${'imperial'}&exclude=${'alerts,hourly,minutely'}&appid=${'94e32ddc97880c45b19a69dfc85aec8d'}`;
    fetch(currentWeatherAPICall)
        .then(response => response.json())
        .then(function(data) {
            let currentWeather = {
                temp: data.current.temp,
                wind: data.current.wind_speed,
                humidity: data.current.humidity,
                uvi: data.current.uvi
            };

            var dtCurrent = data.current.dt;
            dtForecast = data.daily;
            var millsecondsCurrent = dtCurrent * 1000;
            var dateObjectCurrent = new Date(millsecondsCurrent);
            dateFormatCurrent = dateObjectCurrent.toLocaleDateString('en-US');
            renderCurrentWeatherContent(currentWeather, data);

            for(var i=1; i < 6; i++) {
                var millsecondsForecast = dtForecast[i].dt * 1000;
                var dateObjectForecast = new Date(millsecondsForecast);
                currentDate = dateObjectForecast.toLocaleDateString('en-US');
                dateFormatForecast.push(currentDate);
            }
            renderForecastContent(data, dateFormatForecast);
        });
};

// function to gather city lat and long to use in the openweather api
var callCityAPI = function(city) {
    cityAPISearch = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=94e32ddc97880c45b19a69dfc85aec8d`;
    fetch(cityAPISearch)
        .then(response => response.json())
        .then(function(data) {
            cityLat = data[0].lat;
            cityLong = data[0].lon;
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

// function to render current weather condition content
var renderCurrentWeatherContent = function(currentWeather, data) {
    $('#current-weather-container').empty();
    // render current weather conditions in city searched
    const h2El = $('<h2>');
    const divEl = $('<div>');
    const pEl1 = $('<p>');
    const pEl2 = $('<p>');
    const pEl3 = $('<p>');
    const pEl4 = $('<p>');

    divEl.addClass("current-weather mt-2 border border-dark p-2");

    h2El
        .addClass("fw-bold current-location")
        .text(citySearchString + ' ' + dateFormatCurrent)
        .append(`<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" width="75" height="75" />`);
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

    if(currentWeather.uvi <= 2) {
        pEl4.addClass('text-success');
    }
    else if(currentWeather.uvi <= 5) {
        pEl4.addClass('text-warning')
    }
    else {
        pEl4.addClass('text-danger')
    }

    divEl.append(pEl4);
    $('#current-weather-container').prepend(divEl);
}

// function to render the forecast content on the page
var renderForecastContent = function(data, forecastDates) {
    const divForecastEl = $('<div>');
    const divForecastBlocksEl = $('<div>');
    const h3El = $('<h3>');

    // start loop at 1 as first value in daily array is the current date
    for(var i = 1; i < 6; i++) {
        const h4El = $('<h4>');
        const divForecastDayEl = $('<div>');
        const pEl1 = $('<p>');
        const pEl2 = $('<p>');
        const pEl3 = $('<p>');
        let imageString;

        h4El.text(forecastDates[i-1]);
        imageString = `<img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" width="75" height="75" />`
        pEl1.text('Temp: ' + `${data.daily[i].temp.day}` + '\u00B0F')
        pEl2.text('Wind: ' + `${data.daily[i].wind_speed}` + 'MPH')
        pEl3.text('Humidity: ' + `${data.daily[i].humidity}` + '%')

        divForecastDayEl
            .addClass('p-2 forecast-day')
            .append(h4El, imageString, pEl1, pEl2, pEl3) 

        divForecastBlocksEl
            .addClass('d-sm-flex flex-sm-column d-md-flex flex-md-row justify-content-md-between forecast-blocks')
            .append(divForecastDayEl)

        h3El
            .addClass('fw-bold')
            .text('5-Day Forecast:')
        divForecastEl
            .addClass('mt-3 forecast')
            .append(h3El, divForecastBlocksEl)

        $('#current-weather-container').append(divForecastEl);
    }
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
    $('.history-btn').on('click', historyButtonClicked)
}
populateHistory();

// search button click functionality
searchButtonEl.on('click', userCitySearch)

var historyButtonClicked = function(event) {
    const id = event.target.id
    var city = $('.history-btn')[id].textContent
    citySearchString = city;
    callCityAPI(city);
}

// search history button click functionality
$('.history-btn').on('click', historyButtonClicked)