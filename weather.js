const API_KEY = "c22fecf2254ca915f8a753daf425d99f"; 

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("weather-form");
    form.addEventListener("submit", handleWeatherRequest);
});

function handleWeatherRequest(event) {
    event.preventDefault();

    const cityInput = document.getElementById("city");
    const messageDiv = document.getElementById("weather-message");
    const outputDiv = document.getElementById("weather-output");

    const city = cityInput.value.trim();

    // Basic validation
    if (city === "") {
        showWeatherMessage("Please enter a city name.", "error");
        outputDiv.innerHTML = "";
        return;
    }

    // Allow letters, spaces and hyphens
    const cityPattern = /^[a-zA-Z\s\-]+$/;
    if (!cityPattern.test(city)) {
        showWeatherMessage("City name should only contain letters, spaces, or hyphens.", "error");
        outputDiv.innerHTML = "";
        return;
    }

    if (!API_KEY || API_KEY === "c22fecf2254ca915f8a753daf425d99f") {
        showWeatherMessage("Please set your OpenWeatherMap API key in weather.js.", "error");
        outputDiv.innerHTML = "";
        return;
    }

    // Build URL according to assignment + metric units
    const url = `https://api.openweathermap.org/data/2.5/forecast?mode=json&q=${encodeURIComponent(city)}&units=metric&appid=${c22fecf2254ca915f8a753daf425d99f}`;

    showWeatherMessage("Loading forecast, please wait...", "success");
    outputDiv.innerHTML = "";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found or request failed.");
            }
            return response.json();
        })
        .then(data => {
            renderWeather(data);
        })
        .catch(error => {
            showWeatherMessage(error.message, "error");
            outputDiv.innerHTML = "";
        });
}

function renderWeather(data) {
    const outputDiv = document.getElementById("weather-output");

    if (!data || !data.list || !data.list.length) {
        outputDiv.innerHTML = "<p>No forecast data available.</p>";
        return;
    }

    const cityName = data.city.name;
    const country = data.city.country;

    // Take first 5 entries (approx first day or so) for display
    const firstFive = data.list.slice(0, 5);

    let html = `
        <h3>Forecast for ${cityName}, ${country}</h3>
        <table>
            <thead>
                <tr>
                    <th>Date &amp; Time</th>
                    <th>Temperature (°C)</th>
                    <th>Feels Like (°C)</th>
                    <th>Weather</th>
                    <th>Humidity (%)</th>
                </tr>
            </thead>
            <tbody>
    `;

    firstFive.forEach(item => {
        const dateTime = item.dt_txt;
        const temp = item.main.temp.toFixed(1);
        const feelsLike = item.main.feels_like.toFixed(1);
        const description = item.weather[0].description;
        const humidity = item.main.humidity;

        html += `
            <tr>
                <td>${dateTime}</td>
                <td>${temp}</td>
                <td>${feelsLike}</td>
                <td>${description}</td>
                <td>${humidity}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    outputDiv.innerHTML = html;
    showWeatherMessage("Weather data retrieved successfully.", "success");
}

function showWeatherMessage(text, type) {
    const messageDiv = document.getElementById("weather-message");
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";
}

