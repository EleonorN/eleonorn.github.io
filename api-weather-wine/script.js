(function () {
  const button = document.getElementById("wineButton");
  if (!button) return;

  const app = button.closest(".wine-app");
  const result = document.getElementById("result");
  const weather = document.getElementById("weather");
  const wine = document.getElementById("wine");
  const reason = document.getElementById("reason");

  window.dataLayer = window.dataLayer || [];

  // Vinlistan. Varje vin passar en eller flera vädertyper och ett temperaturspann.
  // min är inklusive, max är exklusive.
  const WINES = [
    // Sol – varmt
    { name: "Provence Rosé", reason: "Pale, dry and made for sunshine.", sky: ["sun"], min: 18, max: 99 },
    { name: "Vermentino", reason: "Citrus and sea salt for a hot, bright day.", sky: ["sun"], min: 18, max: 99 },
    { name: "Albariño", reason: "Crisp and zesty when the sun is at its strongest.", sky: ["sun"], min: 18, max: 99 },
    { name: "Picpoul de Pinet", reason: "Sharp and lemony, straight from the fridge.", sky: ["sun"], min: 18, max: 99 },
    { name: "Verdejo", reason: "Green apple and grass for a warm, lazy day.", sky: ["sun", "cloud"], min: 18, max: 99 },

    // Sol – milt
    { name: "Sauvignon Blanc", reason: "A fresh and crisp wine for a warmer day.", sky: ["sun", "cloud"], min: 12, max: 18 },
    { name: "Grüner Veltliner", reason: "Peppery and light for mild sunshine.", sky: ["sun", "cloud"], min: 12, max: 18 },
    { name: "Chablis", reason: "Flinty and precise for a clear, mild day.", sky: ["sun"], min: 12, max: 18 },
    { name: "Sancerre", reason: "Bright and mineral, like the light outside.", sky: ["sun"], min: 12, max: 18 },

    // Sol – kallt
    { name: "Crémant", reason: "Cold sunshine deserves bubbles.", sky: ["sun"], min: -99, max: 12 },
    { name: "Beaujolais", reason: "Light red with a chill, for a crisp sunny day.", sky: ["sun"], min: -99, max: 12 },
    { name: "Dry Riesling", reason: "Steely and clean for cold, clear air.", sky: ["sun"], min: -99, max: 12 },
    { name: "Cabernet Franc", reason: "Leafy and cool-toned, for low winter sun.", sky: ["sun"], min: -99, max: 12 },

    // Moln
    { name: "Pinot Grigio", reason: "Easy and unbothered, just like the grey sky.", sky: ["cloud"], min: 18, max: 99 },
    { name: "Soave", reason: "Soft almond and pear under a flat grey sky.", sky: ["cloud"], min: 12, max: 99 },
    { name: "Chenin Blanc", reason: "Rounded and soft under a cloudy sky.", sky: ["cloud", "fog"], min: 12, max: 99 },
    { name: "Barbera", reason: "Juicy acidity to lift a grey afternoon.", sky: ["cloud"], min: -99, max: 12 },
    { name: "Gamay", reason: "Bright red fruit against the clouds.", sky: ["cloud", "rain"], min: -99, max: 12 },
    { name: "Dolcetto", reason: "Dark and easygoing when the sun stays hidden.", sky: ["cloud"], min: -99, max: 12 },
    { name: "Côtes du Rhône", reason: "Warm spice for a dull, cool day.", sky: ["cloud"], min: -99, max: 12 },

    // Regn – svalt
    { name: "Pinot Noir", reason: "A light and fruity red wine for a cold evening.", sky: ["rain", "fog"], min: -99, max: 12 },
    { name: "Chianti Classico", reason: "Cherry and herbs while the rain keeps going.", sky: ["rain"], min: -99, max: 14 },
    { name: "Merlot", reason: "Soft and warming when it pours outside.", sky: ["rain"], min: -99, max: 14 },

    // Regn – milt
    { name: "Valpolicella", reason: "Fresh red fruit for a warm summer rain.", sky: ["rain"], min: 12, max: 99 },
    { name: "Dry Rosé", reason: "Rain in warm air still calls for something pink.", sky: ["rain"], min: 12, max: 99 },
    { name: "Bardolino", reason: "Light enough to drink while watching the drizzle.", sky: ["rain"], min: 12, max: 99 },
    { name: "Vinho Verde", reason: "Slightly fizzy, for rain that isn't cold.", sky: ["rain"], min: 12, max: 99 },

    // Snö
    { name: "Amarone", reason: "Rich and raisiny for a snowy night.", sky: ["snow"], min: -99, max: 99 },
    { name: "Barolo", reason: "Tannic and serious, built for the cold.", sky: ["snow"], min: -99, max: 99 },
    { name: "Rioja Reserva", reason: "Vanilla, leather and warmth in the snow.", sky: ["snow"], min: -99, max: 99 },
    { name: "Tawny Port", reason: "Nuts and caramel by the window while it snows.", sky: ["snow"], min: -99, max: 99 },

    // Dimma
    { name: "Nebbiolo", reason: "Grown in fog, best enjoyed in it.", sky: ["fog"], min: -99, max: 99 },
    { name: "Barbaresco", reason: "Rose and tar, as moody as the haze.", sky: ["fog"], min: -99, max: 99 },
    { name: "Grenache", reason: "Warm spice to cut through the haze.", sky: ["fog"], min: -99, max: 99 },

    // Åska
    { name: "Syrah", reason: "Dark pepper and smoke to match the thunder.", sky: ["storm"], min: -99, max: 99 },
    { name: "Malbec", reason: "Bold and inky while the storm rolls in.", sky: ["storm"], min: -99, max: 99 },
    { name: "Zinfandel", reason: "Big, jammy and loud, like the weather.", sky: ["storm"], min: -99, max: 99 },
    { name: "Châteauneuf-du-Pape", reason: "Something substantial for a dramatic sky.", sky: ["storm"], min: -99, max: 99 }
  ];

  // Kommer ihåg senaste vinet så att Try again ger något nytt
  let lastWine = null;

  // Översätter Open-Meteos väderkod till en vädertyp och en ikon
  function getSky(code, rain) {
    if (code >= 95) return { type: "storm", icon: "⛈️" };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { type: "snow", icon: "❄️" };
    if (rain > 0 || (code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { type: "rain", icon: "🌧️" };
    if (code === 45 || code === 48) return { type: "fog", icon: "🌫️" };
    if (code === 0 || code === 1) return { type: "sun", icon: "☀️" };
    return { type: "cloud", icon: "☁️" };
  }

  // Väljer ett vin som matchar väder och temperatur, helst inte samma som förra gången
  function pickWine(skyType, temperature) {
    let candidates = WINES.filter(function (w) {
      return w.sky.indexOf(skyType) !== -1 && temperature >= w.min && temperature < w.max;
    });

    // Inget som matchar temperaturen? Ta alla viner för vädertypen.
    if (!candidates.length) {
      candidates = WINES.filter(function (w) {
        return w.sky.indexOf(skyType) !== -1;
      });
    }

    // Fortfarande tomt? Ta hela listan.
    if (!candidates.length) candidates = WINES;

    // Undvik att upprepa förra vinet om det finns fler att välja på
    const fresh = candidates.filter(function (w) {
      return w.name !== lastWine;
    });
    const pool = fresh.length ? fresh : candidates;

    const choice = pool[Math.floor(Math.random() * pool.length)];
    lastWine = choice.name;
    return choice;
  }

  // Vädret hämtas en gång och sparas, så att fler vinförslag kan visas direkt.
  // Efter tio minuter hämtas det på nytt så att det inte hinner bli inaktuellt.
  const WEATHER_MAX_AGE = 10 * 60 * 1000;
  let cachedWeather = null;
  let cachedAt = 0;

  button.addEventListener("click", suggestWine);

  async function suggestWine() {
    const isFresh = cachedWeather && Date.now() - cachedAt < WEATHER_MAX_AGE;

    if (!isFresh) {
      // Knappen behåller sin text under hämtningen och dimmas bara ner
      button.disabled = true;

      try {
        cachedWeather = await fetchWeather();
        cachedAt = Date.now();
      } catch (error) {
        button.disabled = false;
        button.textContent = "Try again →";
        showError(error);
        return;
      }

      button.disabled = false;
      button.textContent = "Find another wine →";
    }

    showWine(cachedWeather);
  }

  async function fetchWeather() {
    const latitude = 59.3293;
    const longitude = 18.0686;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain,weather_code`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP " + response.status);

    const data = await response.json();
    return {
      temperature: data.current.temperature_2m,
      rain: data.current.rain,
      sky: getSky(data.current.weather_code, data.current.rain)
    };
  }

  function showWine(current) {
    const pick = pickWine(current.sky.type, current.temperature);

    weather.textContent = `${current.sky.icon} Stockholm · ${current.temperature}°C · Rain: ${current.rain} mm`;
    wine.textContent = pick.name;
    reason.textContent = pick.reason;

    // Rutan byter färg efter vädret
    app.classList.remove("sky-sun", "sky-cloud", "sky-rain", "sky-snow", "sky-fog", "sky-storm");
    app.classList.add("sky-" + current.sky.type);

    // Resultatet tonar in, även när det bara är vinet som byts
    result.classList.remove("show");
    void result.offsetWidth;
    result.classList.add("show");

    // dataLayer-event till GTM
    window.dataLayer.push({
      event: "wine_suggested",
      wine_name: pick.name,
      temperature: current.temperature,
      rain_mm: current.rain,
      weather_type: current.sky.type
    });
  }

  function showError(error) {
    weather.textContent = "";
    wine.textContent = "The sky is hiding right now";
    reason.textContent = "Try again in a moment.";
    result.classList.add("show");

    window.dataLayer.push({
      event: "wine_error",
      error_message: error.message
    });
  }
})();
