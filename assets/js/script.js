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
                <p>Temperature:${Math.round(data.main.temp - 273.15)}°C </p>
                <p>Wind speed: ${data.wind.speed} mph</p>
                <p>Humidity: ${data.main.humidity} </p>
            </div>
            `
        })
    }
});