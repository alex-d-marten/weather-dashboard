var currentWeather = [];
var excludeAlerts = 'Alerts';

var testWeatherAPI = function() {
    currentWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${38.7521}&lon=${121.2880}&exclude=${excludeAlerts}&appid=${APIKey}`;
    console.log(currentWeather);
};


testWeatherAPI();




// https://api.openweathermap.org/data/2.5/onecall?lat=38.7521&lon=121.2880&exclude=Alerts&appid=APIKey


