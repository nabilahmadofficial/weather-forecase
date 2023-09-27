// Config
const API_KEY = '2e6cb081339bf569d3644bd9da544ddf';

// Cached location
let lat = localStorage.getItem('lat');
let lon = localStorage.getItem('lon');

// Page load
if (lat && lon) {
  getWeatherByLocation(lat, lon);
} else {
  getLocation();
}

// Listen for search
document.getElementById('weather-form').addEventListener('submit', e => {
  e.preventDefault();
 
  let city = document.getElementById('search-input').value;
  getWeatherByCity(city);
});


// Get location
function getLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    localStorage.setItem('lat', lat);
    localStorage.setItem('lon', lon);

    getWeatherByLocation(lat, lon);
  });
}

// Get weather by city name
async function getWeatherByCity(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  try {
    let response = await fetch(url);
    if (response.ok) {
      let data = await response.json();
      displayWeather(data);
    } else {
      console.error('Error fetching weather data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Get weather by location
async function getWeatherByLocation(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  try {
    let response = await fetch(url);
    if (response.ok) {
      let data = await response.json();
      displayWeather(data);
    } else {
      console.error('Error fetching weather data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Display weather
function displayWeather(data) {
  const weatherData = document.getElementById('weather-data');
  weatherData.innerHTML = ''; // Clear previous data

  const cityName = data.name;
  const temperature = data.main.temp;
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;

  const weatherHTML = `
  <h3>${data.name} <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></h3>
  <p><h4>${data.weather[0].description}</h4></p>
  <p><b>Temperature: </b>${data.main.temp} &deg;C</p>
  <p><b>Feels like: </b>${data.main.feels_like} &deg;C</p>
  <p><b>Humidity: </b>${data.main.humidity}%</p>
  <p><b>Wind speed:</b> ${data.wind.speed} m/s</p>
  `;

  weatherData.innerHTML = weatherHTML;
}

// ...

// Autocomplete
const input = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
const uniqueCityNames = new Set(); // To store unique city names

input.addEventListener('input', async e => {
  const query = e.target.value;
  const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${API_KEY}`;

  suggestionsList.innerHTML = '';

  if (query.trim() !== '') {
    try {
      let response = await fetch(url);
      if (response.ok) {
        let data = await response.json();
        uniqueCityNames.clear(); // Clear the set for new suggestions
        if (data.list && data.list.length > 0) {
          data.list.forEach(city => {
            uniqueCityNames.add(city.name); // Add unique city names to the set
          });

          uniqueCityNames.forEach(cityName => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = cityName;
            suggestionItem.addEventListener('click', () => {
              input.value = cityName;
              suggestionsList.innerHTML = ''; // Clear suggestions
              getWeatherByCity(cityName); // Fetch weather for the selected city
            });

            suggestionsList.appendChild(suggestionItem);
          });

          suggestionsList.style.display = 'block';
        } else {
          suggestionsList.style.display = 'none';
        }
      } else {
        console.error('Error fetching suggestions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  } else {
    suggestionsList.style.display = 'none';
  }
});

// Hide suggestions when clicking outside the input field
document.addEventListener('click', e => {
  if (e.target !== input) {
    suggestionsList.style.display = 'none';
  }
});

