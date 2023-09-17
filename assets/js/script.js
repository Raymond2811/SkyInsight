const searchForm = document.querySelector('#search-form');
const present = document.querySelector('#present');
const future = document.querySelector('#future');
const cityInput = document.querySelector('#city-input');
const apiKey = 'c5a8e528ef21ad697ebae69a55cf1a7e';
const searchHistory = document.querySelector('#search-history');
const weatherIcon = document.querySelector('#weather-icon');

const weatherIcons = {
    '01d': 'fas fa-sun',      // Clear sky (day)
    '01n': 'fas fa-moon',     // Clear sky (night)
    '02d': 'fas fa-cloud-sun', // Few clouds (day)
    '02n': 'fas fa-cloud-moon',// Few clouds (night)
    '03d': 'fas fa-cloud',    // Scattered clouds (day)
    '03n': 'fas fa-cloud',    // Scattered clouds (night)
    '04d': 'fas fa-cloud',    // Broken clouds (day)
    '04n': 'fas fa-cloud',    // Broken clouds (night)
    '09d': 'fas fa-cloud-showers-heavy',
    '09n': 'fas fa-cloud-showers-heavy',
    '10d': 'fas fa-cloud-rain',
    '10n': 'fas fa-cloud-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog',
};

searchForm.addEventListener('submit', function(e){
    e.preventDefault();
    const cityName = cityInput.value;
    const presentElement = document.getElementById('present');
    if (cityName){
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response){
            return response.json();
        })
        .then(function (data){
            console.log(data);
            
            const weatherConidtion = data.weather[0].icon;
            const iconClass = weatherIcons[weatherConidtion];
            const weatherIcon = iconClass ? `<i class="weather-icon ${iconClass}"></i>` : '';

            present.innerHTML =  `
            <div class='styled-text'>
                <h2>${data.name} (Date: ${new Date(data.dt * 1000).toLocaleDateString()}) ${weatherIcon}<h2>
                <p>Temp: ${Math.round(data.main.temp - 273.15)* 9/5 + 32}°F </p>
                <p>Wind speed: ${data.wind.speed} mph</p>
                <p>Humidity: ${data.main.humidity} %</p>
            </div>
            `;
            if (data.name) {
                presentElement.style.border = '2px solid grey';
            } else {
                presentElement.style.border = 'none';
            }
        })

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);

            future.innerHTML = '';
            const uiqueDates = {};

            const forecastHeader = document.createElement('h2');
            forecastHeader.textContent = '5-day forecast:';
            future.appendChild(forecastHeader);

            const forecastDataContainer = document.createElement('div');
            forecastDataContainer.className = 'forecast-data-container';

            for(let i = 2; i < data.list.length; i++){
                const item = data.list[i];
                const date = new Date(item.dt * 1000).toLocaleDateString();
                const temperature = Math.round(item.main.temp - 273.15)* 9/5 + 32;
                const windSpeed = item.wind.speed;
                const humidity = item.main.humidity;

                if (!uiqueDates[date]){
                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-data', 'styled-text');
                    forecastItem.style.backgroundColor = 'darkblue';
                    forecastDataContainer.appendChild(forecastItem);
                
                forecastItem.innerHTML = `
                    <h2>${date}</h2>
                    <p>Temp: ${temperature}°F</p>
                    <p>Wind speed: ${windSpeed}mph</p>
                    <p>Humidity: ${humidity}%</p>
                `;
                uiqueDates[date] = true;
                }
            }
            future.appendChild(forecastDataContainer);
        });


        const searchHistoryItem = document.createElement('li');
        searchHistoryItem.textContent = cityName;

        const existingCity = Array.from(searchHistory.children).find(function(item){
            return item.textContent === cityName;
        });

        if(!existingCity) {
            searchHistory.appendChild(searchHistoryItem);
        }
        searchHistory.addEventListener('click', function(e){
            if (e.target.tagName === 'LI'){
                const selectedCity = e.target.textContent;
                cityInput.value = selectedCity;
                searchForm.dispatchEvent(new Event('submit'));
            }
        });

        cityInput.value = '';
    }

});
