var cityNameInputForm = $('#input-city-name');
var cityInfoEl = $('#city-card');
//adding variables defining each aspect I want pulled up
var currentCity = document.createElement('h2');
var currentTemp = document.createElement('p');
var currentWind = document.createElement('p');
var currentHumidity = document.createElement('p');
var currentUVIndexP = document.createElement('p')
var currentUVIndex = document.createElement('span');
var futureDate = document.createElement('h6')
var icon = document.createElement('img')
var futureTemp = document.createElement('p');
var futureWind = document.createElement('p');
var futureHumidity = document.createElement('p');
var savedBtns  = document.createElement('button');    

var today = moment();
var savedCities;

function init() {
    savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    renderSearchHistoryBtn();
};

function handleSubmitFormSearch(event) {
    event.preventDefault();
    var cityName = cityNameInputForm.val().trim();
    if (cityName) {
        getCityWeather(cityName);
    } else {
        alert('Please enter a city name') //alert set in case no city is entered
    };
    cityNameInputForm.val('');
};

function handleSavedBtn(event) {
    cityName = event.target.textContent;
    getCityWeather(cityName);
};
// added the function for the weather api to pull the info from their api for the city in question
function getCityWeather(city) {
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ city +'&units=imperial&appid=4ff77886755c8b9237b9bb4bb1c1e2bf'
    $.ajax({
        url: currentUrl,
        method: 'GET',
        statusCode: {
            404: function() {
              alert( "City name not found. Please enter a valid city." ); //second alert in case a city that is not recognized is entered
            }
          }
    }).then(function (response) {
        renderCityWeather(response);
        getForecast(response.coord.lat,response.coord.lon);
    }).catch()

};

function renderCityWeather(data) {  
    today = moment();
    currentCity.textContent = data.name + ' (' + today.format("L") +') ';
    currentTemp.textContent = 'Temp: ' + data.main.temp +'°F';
    currentWind.textContent = 'Wind: ' + data.wind.speed + 'MPH';
    currentHumidity.textContent = 'Humidity: ' + data.main.humidity + '%';

    cityInfoEl.append(currentCity);
    cityInfoEl.append(currentTemp);
    cityInfoEl.append(currentWind);
    cityInfoEl.append(currentHumidity);
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
    currentUVIndexP.textContent = '';
    currentUVIndex.textContent = data.current.uvi;
    currentUVIndexP.textContent = 'UV Index: ';
    if (data.current.uvi <=2) {
        currentUVIndex.classList.add('low');
    } else if (data.current.uvi >=6) {
        currentUVIndex.classList.add('high');
    } else {
        currentUVIndex.classList.add('moderate')
    };

    currentUVIndexP.append(currentUVIndex);
    cityInfoEl.append(currentUVIndexP);
    
    $('#5-day-forecast').text('5-Day-Forecast');
    for (var i=1; i<6; i++) {
        $('#day-'+i).empty();
    };
    
    for (var j=1; j<6; j++) {

        futureDate = document.createElement('h6')
        icon = document.createElement('img')
        futureTemp = document.createElement('p');
        futureWind = document.createElement('p');
        futureHumidity = document.createElement('p');
        var iconCode = data.daily[j].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        icon.setAttribute('src',iconUrl)
        today = moment();
        futureDate.textContent = today.add(j, 'days').format('L');
        futureTemp.textContent = 'Temp: ' +  data.daily[j].temp.day +'°F';
        futureWind.textContent =  'Wind: ' + data.daily[j].wind_speed + 'MPH';
        futureHumidity.textContent = 'Humidity: ' + data.daily[j].humidity + '%';
        
        $('#day-'+j).append(futureDate);
        $('#day-'+j).append(icon);
        $('#day-'+j).append(futureTemp);
        $('#day-'+j).append(futureWind);
        $('#day-'+j).append(futureHumidity);
        $('#day-'+j).addClass('p-3');
        $('#day-'+j).css({'min-height':'320px', 'width':'140px'});
    };

};

function saveSearch(city) {
    if (savedCities.includes(city)) {
        renderSearchHistoryBtn();
        return;
    };
    savedCities.push(city)
    localStorage.setItem('savedCities',JSON.stringify(savedCities));
    renderSearchHistoryBtn();
};

function renderSearchHistoryBtn() {
    
    $('#saved-btn-div').children().remove('button');
    for (var i=0; i<savedCities.length; i++) {
        savedBtns = document.createElement('button');
        savedBtns.setAttribute('class', 'saved-btn btn btn-secondary w-100');
        savedBtns.textContent = savedCities[i];
        $('#saved-btn-div').append(savedBtns);
    };
    if (savedCities.length>3){
        savedCities.shift();
    };
    
};

init();

$('#search-form-btn').on('click', handleSubmitFormSearch);
$('#saved-btn-div').on('click', handleSavedBtn);