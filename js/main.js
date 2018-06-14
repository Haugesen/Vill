// Loading screen
let loadingScreen = document.querySelector('.loading')

// Main content wrapper
let mainContent = document.querySelector('#wrapper')

// Input elements
let searchForm      = document.querySelector('#search-form'),
    searchField     = document.querySelector('#search'),
    timeOfDaySlider = document.querySelector('#time-slider')

// UI elements
let weatherContainer    = document.querySelector('#weather-results'),
    mainTemp            = document.querySelector('#temp-data'),
    rainFall            = document.querySelector('#rain'),
    windSpeed           = document.querySelector('#wind-speed'),
    windDirection       = document.querySelector('#wind-direction'),
    weatherDescription  = document.querySelector('#weather-description'),
    weatherIcon         = document.querySelector('#weather-icon'),
    uiTime              = document.querySelector('#time-of-day'),
    currentCity         = document.querySelector('#current-city'),
    showDay             = document.querySelector('#day'),
    showHour            = document.querySelector('#hour'),
    searchError         = document.querySelector('.error')

// Create the API URL
let api     = 'https://api.openweathermap.org/data/2.5/forecast?',
    city    = 'Oslo',
    country = 'NO',
    units   = 'metric',
    appId   = 'd7e9894821a8d103b9d3aecb718b6de3'
    apiURL  = api + 'q=' + city + ',' + country + '&units=' + units + '&APPID=' + appId  

// Get search result
searchForm.addEventListener('submit', function(e){
    
    e.preventDefault()
    city = searchField.value
    apiURL  = api + 'q=' + city + ',' + country + '&units=' + units + '&APPID=' + appId
    
    // create weather based on new API URL
    createWeather(apiURL)
    
    searchForm.reset()
    
});

// Create weather & Request JSON from API
function createWeather(apiURL){
    let request = new XMLHttpRequest()
    
    request.open('GET', apiURL)
    request.responseType = 'json'
    request.send()
    
    request.onload = function() {
        
        let jsonWeatherObj = request.response
        showWeather(jsonWeatherObj)
        
        // Remove loading screen
        loadingScreen.classList.remove('visible')
        
    }
}

// Create weather onload
window.onload = createWeather(apiURL)

// Set current time
let currentTime = 0

// get current day of the month (number)
let today       = new Date(),
    currentDay  = today.getDate()

// Show weather
function showWeather(jsonWeatherObj){
    
    // Get length of JSON object list
    let jsonListLength = jsonWeatherObj.list.length
    
    // Define the max value for time of day slider, and set it to the length of JSON list array
    timeOfDaySlider.max = jsonListLength -17

    // Update weather
    updateWeather(jsonWeatherObj)
    
    // Show current city
    currentCity.innerHTML = city
    
    // Update time
    updateTime(currentTime)
    
    // Get time of day
    timeOfDaySlider.addEventListener('input', getTimeOfDay)
    function getTimeOfDay(){
        
        // Set current time to the value of the slider
        currentTime = timeOfDaySlider.value
        
        updateTime(currentTime);
    }  
    
    // Update time
    function updateTime(currentTime){
        
        // Get Date & Time, and seperate them, then get year,month,day & hour.
        let jsonWeatherTime     = jsonWeatherObj.list[currentTime].dt_txt,
            jsonCurrentHour     = jsonWeatherTime.substr(jsonWeatherTime.indexOf(' ')+1).slice(0,5),
            jsonCurrentDate     = jsonWeatherTime.substr(0,jsonWeatherTime.indexOf(' ')),
            jsonCurrentYear     = jsonCurrentDate.slice(0,4),
            jsonCurrentMonth    = jsonCurrentDate.slice(5,7),
            jsonCurrentDay      = jsonCurrentDate.slice(-2)

        // Update time in UI
        showHour.innerHTML = jsonCurrentHour 
        
        if (jsonCurrentDay == currentDay){
            showDay.innerHTML = 'I dag'
        } else if (jsonCurrentDay == currentDay + 1){
            showDay.innerHTML = 'I morgen'
        } else {
            showDay.innerHTML = jsonCurrentDay + '.' + jsonCurrentMonth + '.' + jsonCurrentYear
        }
        
        // Update background
        changeBackground(jsonCurrentHour);
        
    }
    
    // When slider changes update and animate weather
    timeOfDaySlider.addEventListener('change', changeWeather)
    function changeWeather(){

        // Update weather
        updateWeather(jsonWeatherObj)
        // Animate weather
        animateWeather();
        
    } 
    
    timeOfDaySlider.addEventListener('mousedown', dimWeatherInfo)
    function dimWeatherInfo(){
        
        uiTime.style.transform = 'scale(1.2)'
        weatherContainer.style.opacity = '0.1'
    }  

    timeOfDaySlider.addEventListener('mouseup', unDimWeatherInfo)
    function unDimWeatherInfo(){
        
        uiTime.style.transform = 'scale(1)'
        weatherContainer.style.opacity = '1'
    }  
}

function updateWeather(jsonWeatherObj){
    
    setTimeout(function(){
    
    // Store json weather values in variables
    let jsonTemp                = jsonWeatherObj.list[currentTime].main.temp,
        jsonWeatherDescription  = jsonWeatherObj.list[currentTime].weather[0].description,
        jsonWindSpeed           = jsonWeatherObj.list[currentTime].wind.speed,
        jsonWindDirection       = jsonWeatherObj.list[currentTime].wind.deg,
        jsonWeatherCondition    = jsonWeatherObj.list[currentTime].weather[0].main,
        jsonWeatherIcon         = jsonWeatherObj.list[currentTime].weather[0].icon
    
    // Display weather values in UI
    mainTemp.innerHTML              = parseInt(jsonTemp) + '&deg;'
    weatherDescription.innerHTML    = jsonWeatherDescription
    windSpeed.innerHTML             = jsonWindSpeed + ' m/s'
    windDirection.innerHTML         = jsonWindDirection
    
    
    // Display wind direction as descriptive strings instead of degrees    
    if (jsonWindDirection >= 337.5 || jsonWindDirection <= 22.5) {
        windDirection.innerHTML = 'Nord' 
    } 
    if (jsonWindDirection >= 22.5 && jsonWindDirection <= 67.5) {
        windDirection.innerHTML = 'Nordøst'
    } 
    if (jsonWindDirection >= 67.5 && jsonWindDirection <= 112.5) {
        windDirection.innerHTML = 'Øst'
    } 
    if (jsonWindDirection >= 112.5 && jsonWindDirection <= 157.5) {
        windDirection.innerHTML = 'Sørøst'
    } 
    if (jsonWindDirection >= 157.5 && jsonWindDirection <= 202.5) {
        windDirection.innerHTML = 'Sør'
    } 
    if (jsonWindDirection >= 202.5 && jsonWindDirection <= 247.5) {
        windDirection.innerHTML = 'Sørvest'
    } 
    if (jsonWindDirection >= 247.5 && jsonWindDirection <= 292.5) {
        windDirection.innerHTML = 'Vest'   
    } 
    if (jsonWindDirection >= 292.5 && jsonWindDirection <= 337.5) {
        windDirection.innerHTML = 'Nordvest'  
    }
    
    // Display rain if rain contains a value
    if (jsonWeatherObj.list[currentTime].rain['3h']){
        
        rainFall.innerHTML = jsonWeatherObj.list[currentTime].rain['3h'].toFixed(2) + ' mm'
        
    } else {
        rainFall.innerHTML = '0 mm'
    }   
        
    // Display correct daily/nightly weather icons & weather descriptions
    if (jsonWeatherIcon === '01d') {
        weatherIcon.className = 'clear-sky'
        weatherDescription.innerHTML = 'Ahoy! knallvær i sikte.'
    } 
    if (jsonWeatherIcon === '01n') {
        weatherIcon.className = 'clear-sky-night'
        weatherDescription.innerHTML = 'Ahoy! knallvær i sikte.'
    } 
    if (jsonWeatherIcon === '02d') {
        weatherIcon.className = 'few-clouds'
        weatherDescription.innerHTML = 'Noe småskyer, ellers soleklart!' 
    } 
    if (jsonWeatherIcon === '02n') {
        weatherIcon.className = 'few-clouds-night'
        weatherDescription.innerHTML = 'Noe småskyer, ellers måneklart!' 
    } 
    if (jsonWeatherIcon === '03d') {
        weatherIcon.className = 'scattered-clouds'
        weatherDescription.innerHTML = 'Overskyet, men enda håp!'
    } 
    if (jsonWeatherIcon === '03n') { 
        weatherIcon.className = 'scattered-clouds-night'
        weatherDescription.innerHTML = 'Overskyet, men enda håp!' 
    } 
    if (jsonWeatherIcon === '04d' || jsonWeatherIcon === '04n') {
        weatherIcon.className = 'broken-clouds'
        weatherDescription.innerHTML = 'Det ser bekmørkt ut.'
    } 
    if (jsonWeatherIcon === '09d' || jsonWeatherIcon === '09n') {
        weatherIcon.className = 'shower-rain'
        weatherDescription.innerHTML = 'Øse pøse! På med sydvesten.'
    } 
    if (jsonWeatherIcon === '10d') {
        weatherIcon.className = 'rain'
        weatherDescription.innerHTML = 'Noe nedbør er å forvente.'
    } 
    if (jsonWeatherIcon === '10n') {
        weatherIcon.className = 'rain-night'
        weatherDescription.innerHTML = 'Noe nedbør er å forvente.'
    } 
    if (jsonWeatherIcon === '11d' || jsonWeatherIcon === '11n') {
        weatherIcon.className = 'thunderstorm'
        weatherDescription.innerHTML = 'Det kan smelle litt!'
    } 
    if (jsonWeatherIcon === '13d' || jsonWeatherIcon === '13n') { 
        weatherIcon.className = 'snow'
        weatherDescription.innerHTML = 'Det snør, det snør..'
    } 
    if (jsonWeatherIcon === '50d' || jsonWeatherIcon === '50n') {
        weatherIcon.className = 'mist'
        weatherDescription.innerHTML = 'Hva skjuler seg i tåka?' 
    }
        
    }, 250);

}

// Animate weather info
function animateWeather(){
    
    weatherContainer.className = 'animate';
    
    setTimeout(function(){ 
            weatherContainer.className = '';
    }, 500);   
}    

// Handle error
window.addEventListener('error', function (e) {
    
    var error = e.error;
    
    if (error == "TypeError: Cannot read property 'length' of undefined"){
        searchError.classList.add('visible')
        
        setTimeout(function(){
            searchError.classList.remove('visible')
        }, 2500)
    }
});

// Change background gradient based on night/day
function changeBackground(jsonCurrentHour){

    if (jsonCurrentHour >= '21:00' || jsonCurrentHour < '09:00'){
        mainContent.className = 'night'     
    } else {     
        mainContent.className = 'day'    
    } 
}