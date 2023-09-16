const searchForm = document.querySelector('#search-form');
const present = document.querySelector('#present');
const future = document.querySelector('#future');
const cityInput = document.querySelector('#city-input');
const apiKey = 'c5a8e528ef21ad697ebae69a55cf1a7e';

searchForm.addEventListener('submit', function(e){
    e.preventDefault();
    const cityName = cityInput.value;
    if (cityName){
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response){
            return response.json();
        })
        .then(function (data){
            console.log(data);
            present.innerHTML =  `
            <div class='styled-text'>
                <h2>${data.name} (Date: ${new Date(data.dt * 1000).toLocaleDateString()})<h2>
                <p>Temp:${Math.round(data.main.temp - 273.15)* 9/5 + 32}°F </p>
                <p>Wind speed: ${data.wind.speed} mph</p>
                <p>Humidity: ${data.main.humidity} </p>
            </div>
            `;
        })

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);

            future.innerHTML = '';
            const uiqueDates = {};

            for(let i = 1; i < data.list.length; i++){
                const item = data.list[i];
                const date = new Date(item.dt * 1000).toLocaleDateString();
                const temperature = Math.round(item.main.temp - 273.15)* 9/5 + 32;
                const windSpeed = item.wind.speed;
                const humidity = item.main.humidity;

                if (!uiqueDates[date]){
                    const forecastItem = document.createElement('div');
                    forecastItem.className = 'styled-text';
                
                forecastItem.innerHTML = `
                    <h2>${date}</h2>
                    <p>Temp: ${temperature}°F</p>
                    <p>Wind spead: ${windSpeed}mph</p>
                    <p>Humidity: ${humidity}%</p>
                `;
                future.appendChild(forecastItem);
                uiqueDates[date] = true;
                }
            }
        });
    }
});
