var cityInput = $('#input-city-name');
var cityInfoEl = $('#city-card');

var cCity = document.createElement('h2');
var cTemp = document.createElement('a');
var cWind = document.createElement('a');
var cHumidity = document.createElement('a');
var cUVIndexP = document.createElement('a')
var cUVIndex = document.createElement('span');

var fDate = document.createElement('h6')
var fTemp = document.createElement('a');
var fWind = document.createElement('a');
var fHumidity = document.createElement('a');

var icon = document.createElement('img')
var Btns  = document.createElement('button');    
var today = moment();
var savedLocations;

function init() {
    savedLocations = JSON.parse(localStorage.getItem('savedLocations'));
    renderSearchHistoryBtn();
};

function handleSubmitFormSearch(event) {
    event.preventDefault();
    var name = cityInput.val().trim();
    if (name) {
        getCityWeather(name);
    } else {
        alert('Please enter the name of a city')
    };
    cityInput.val('');
};

function handleSavedBtn(event) {
    name = event.target.textContent;
    getCityWeather(name);
};

function getCityWeather(city) {
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ city +'&units=imperial&appid=4ff77886755c8b9237b9bb4bb1c1e2bf'
    $.ajax({
        url: currentUrl,
        method: 'GET',
        statusCode: {
            404: function() {
              alert( "City was not found, please enter a valid city name." ); 
            }
          }
    }).then(function (response) {
        renderCityWeather(response);
        getForecast(response.coord.lat,response.coord.lon);
    }).catch()

};

function renderCityWeather(data) {  
    today = moment();
    cCity.textContent = data.name + ' (' + today.format("L") +') ';
    cTemp.textContent = 'Temperature: ' + data.main.temp +'°F';
    cWind.textContent = 'Wind: ' + data.wind.speed + 'MPH';
    cHumidity.textContent = 'Humidity: ' + data.main.humidity + '%';

    cityInfoEl.append(cCity);
    cityInfoEl.append(cTemp);
    cityInfoEl.append(cWind);
    cityInfoEl.append(cHumidity);
    cityInfoEl.addClass('current-city');
    
    saveSearch(data.name);
};

function getForecast(lat,lon) {
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&appid=4ff77886755c8b9237b9bb4bb1c1e2bf'
    $.ajax({
        url: forecastUrl,
        method: 'GET',
    }).then(function (response) {
        renderForecast(response);
    });
    
};

function renderForecast(data) {
    cUVIndexP.textContent = '';
    cUVIndex.textContent = data.current.uvi;
    cUVIndexP.textContent = 'UV Index: ';
    if (data.current.uvi <=2) {
        cUVIndex.classList.add('low');
    } else if (data.current.uvi >=6) {
        cUVIndex.classList.add('high');
    } else {
        cUVIndex.classList.add('moderate')
    };

    cUVIndexP.append(cUVIndex);
    cityInfoEl.append(cUVIndexP);
    
    $('#5-day-forecast').text('5-Day-Forecast');
    for (var i=1; i<6; i++) {
        $('#day-'+i).empty();
    };
    
    for (var j=1; j<6; j++) {

        fDate = document.createElement('h6')
        icon = document.createElement('img')
        fTemp = document.createElement('a');
        fWind = document.createElement('a');
        fHumidity = document.createElement('a');
        
        var iconCode = data.daily[j].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        icon.setAttribute('src',iconUrl)

        today = moment();
        fDate.textContent = today.add(j, 'days').format('L');
        fTemp.textContent = 'Temp: ' +  data.daily[j].temp.day +'°F';
        fWind.textContent =  'Wind: ' + data.daily[j].wind_speed + 'MPH';
        fHumidity.textContent = 'Humidity: ' + data.daily[j].humidity + '%';
        
        $('#day-'+j).append(fDate);
        $('#day-'+j).append(icon);
        $('#day-'+j).append(fTemp);
        $('#day-'+j).append(fWind);
        $('#day-'+j).append(fHumidity);
        $('#day-'+j).addClass('p-3');
        $('#day-'+j).css({'min-height':'320px', 'width':'140px'});
    };

};

function saveSearch(city) {
    if (savedLocations.includes(city)) {
        renderSearchHistoryBtn();
        return;
    };
    savedLocations.push(city)
    localStorage.setItem('savedLocations',JSON.stringify(savedLocations));
    renderSearchHistoryBtn();
};

function renderSearchHistoryBtn() {
    
    $('#saved-btn-div').children().remove('button');
    for (var i=0; i<savedLocations.length; i++) {
        Btns = document.createElement('button');
        Btns.setAttribute('class', 'saved-btn btn btn-secondary w-100');
        Btns.textContent = savedLocations[i];
        $('#saved-btn-div').append(Btns);
    };
    if (savedLocations.length>3){
        savedLocations.shift();
    };
    
};

init();

$('#search-form-btn').on('click', handleSubmitFormSearch);
$('#saved-btn-div').on('click', handleSavedBtn);