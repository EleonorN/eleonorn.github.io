const button = document.getElementById("wineButton");
const weather = document.getElementById("weather");
const wine = document.getElementById("wine");
const reason = document.getElementById("reason");

button.addEventListener("click", getWeather);

async function getWeather() {

  const latitude = 59.3293;
  const longitude = 18.0686;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain,weather_code`;

  const response = await fetch(url);

  const data = await response.json();

  const temperature = data.current.temperature_2m;
  const rain = data.current.rain;
  const weatherCode = data.current.weather_code;

  weather.textContent =
    `Stockholm · ${temperature}°C · Rain: ${rain} mm`;

  if (temperature < 12) {

    wine.textContent = "Pinot Noir";

    reason.textContent =
      "A light and fruity red wine for a cold evening.";

  } else {

    wine.textContent = "Sauvignon Blanc";

    reason.textContent =
      "A fresh and crisp wine for a warmer day.";

  }
}