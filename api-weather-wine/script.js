(function () {
  const button = document.getElementById("wineButton");
  if (!button) return;

  const app = button.closest(".wine-app");
  const result = document.getElementById("result");
  const weather = document.getElementById("weather");
  const wine = document.getElementById("wine");
  const reason = document.getElementById("reason");

  window.dataLayer = window.dataLayer || [];

  // Översätter Open-Meteos väderkod till en vädertyp och en ikon
  function getSky(code, rain) {
    if (code >= 95) return { type: "storm", icon: "⛈️" };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { type: "snow", icon: "❄️" };
    if (rain > 0 || (code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { type: "rain", icon: "🌧️" };
    if (code === 45 || code === 48) return { type: "fog", icon: "🌫️" };
    if (code === 0 || code === 1) return { type: "sun", icon: "☀️" };
    return { type: "cloud", icon: "☁️" };
  }

  button.addEventListener("click", getWeather);

  async function getWeather() {
    const latitude = 59.3293;
    const longitude = 18.0686;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain,weather_code`;

    button.disabled = true;
    button.textContent = "Checking the sky…";
    result.classList.remove("show");

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("HTTP " + response.status);

      const data = await response.json();
      const temperature = data.current.temperature_2m;
      const rain = data.current.rain;
      const sky = getSky(data.current.weather_code, rain);

      let wineName;
      let wineReason;

      if (temperature < 12) {
        wineName = "Pinot Noir";
        wineReason = "A light and fruity red wine for a cold evening.";
      } else {
        wineName = "Sauvignon Blanc";
        wineReason = "A fresh and crisp wine for a warmer day.";
      }

      weather.textContent = `${sky.icon} Stockholm · ${temperature}°C · Rain: ${rain} mm`;
      wine.textContent = wineName;
      reason.textContent = wineReason;

      // Rutan byter färg efter vädret
      app.classList.remove("sky-sun", "sky-cloud", "sky-rain", "sky-snow", "sky-fog", "sky-storm");
      app.classList.add("sky-" + sky.type);

      // Resultatet tonar in
      void result.offsetWidth;
      result.classList.add("show");

      // dataLayer-event till GTM
      window.dataLayer.push({
        event: "wine_suggested",
        wine_name: wineName,
        temperature: temperature,
        rain_mm: rain,
        weather_type: sky.type
      });

    } catch (error) {
      weather.textContent = "";
      wine.textContent = "The sky is hiding right now";
      reason.textContent = "Try again in a moment.";
      result.classList.add("show");

      window.dataLayer.push({
        event: "wine_error",
        error_message: error.message
      });

    } finally {
      button.disabled = false;
      button.textContent = "Try again →";
    }
  }
})();