// OpenWeatherMap API Key
const API_KEY = '2e6cb081339bf569d3644bd9da544ddf';

// Get location on page load
navigator.geolocation.getCurrentPosition(function(position) {

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  // Call API with location
  getWeatherByLocation(lat, lon);

});


// Listen for search form submit
document.querySelector('form').addEventListener('submit', function(e){
  
  // Prevent default form submit
  e.preventDefault();

  // Get input value
  let city = document.getElementById('search-input').value;

  // Get weather for city
  getWeatherByCity(city);

});


// Get weather by city name
async function getWeatherByCity(city) {

  // API weather url
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  // Fetch data from API
  let data = await fetch(url)
                    .then(response => response.json())
                    .catch(err => console.error(err));

  // Display weather data
  displayWeather(data);

}

// Get weather by coordinates
async function getWeatherByLocation(lat, lon) {

  // API weather url
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  // Fetch data from API
  let data = await fetch(url)
                    .then(response => response.json())
                    .catch(err => console.error(err));

  // Display weather data                    
  displayWeather(data);

}

// Display weather data in UI
function displayWeather(data) {
  let html = `
    <h2>${data.name} <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></h2>
    <p>${data.weather[0].description}</p>
    <p>Temperature: ${data.main.temp} &deg;C</p>
    <p>Feels like: ${data.main.feels_like} &deg;C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind speed: ${data.wind.speed} m/s</p>
  `;

  document.getElementById('weather-data').innerHTML = html;
}