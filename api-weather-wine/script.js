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
    { name: "Provence Rosé", reason: "Ljus, torr och gjord för solsken.", sky: ["sun"], min: 18, max: 99 },
    { name: "Vermentino", reason: "Citrus och havssalt för en varm och ljus dag.", sky: ["sun"], min: 18, max: 99 },
    { name: "Albariño", reason: "Krispig och frisk när solen är som starkast.", sky: ["sun"], min: 18, max: 99 },
    { name: "Picpoul de Pinet", reason: "Syrlig och citronfrisk, direkt från kylen.", sky: ["sun"], min: 18, max: 99 },
    { name: "Verdejo", reason: "Grönt äpple och gräs för en varm, lat dag.", sky: ["sun", "cloud"], min: 18, max: 99 },

    // Sol – milt
    { name: "Sauvignon Blanc", reason: "Ett friskt och krispigt vin för en varmare dag.", sky: ["sun", "cloud"], min: 12, max: 18 },
    { name: "Grüner Veltliner", reason: "Pepprig och lätt för milt solsken.", sky: ["sun", "cloud"], min: 12, max: 18 },
    { name: "Chablis", reason: "Mineralisk och precis för en klar, mild dag.", sky: ["sun"], min: 12, max: 18 },
    { name: "Sancerre", reason: "Ljus och mineralisk, precis som ljuset ute.", sky: ["sun"], min: 12, max: 18 },

    // Sol – kallt
    { name: "Crémant", reason: "Kallt solsken förtjänar bubblor.", sky: ["sun"], min: -99, max: 12 },
    { name: "Beaujolais", reason: "Lätt rött, gärna lite kylt, för en klar och solig dag.", sky: ["sun"], min: -99, max: 12 },
    { name: "Torr Riesling", reason: "Stålig och ren för kall, klar luft.", sky: ["sun"], min: -99, max: 12 },
    { name: "Cabernet Franc", reason: "Gröna toner och svalka för den låga vintersolen.", sky: ["sun"], min: -99, max: 12 },

    // Moln
    { name: "Pinot Grigio", reason: "Enkel och avslappnad, precis som den grå himlen.", sky: ["cloud"], min: 18, max: 99 },
    { name: "Soave", reason: "Mjuk mandel och päron under en grå himmel.", sky: ["cloud"], min: 12, max: 99 },
    { name: "Chenin Blanc", reason: "Rund och mjuk under en molnig himmel.", sky: ["cloud", "fog"], min: 12, max: 99 },
    { name: "Barbera", reason: "Saftig syra som lyfter en grå eftermiddag.", sky: ["cloud"], min: -99, max: 12 },
    { name: "Gamay", reason: "Klar röd frukt mot molnen.", sky: ["cloud", "rain"], min: -99, max: 12 },
    { name: "Dolcetto", reason: "Mörk och lättsam när solen håller sig undan.", sky: ["cloud"], min: -99, max: 12 },
    { name: "Côtes du Rhône", reason: "Värmande kryddighet för en grå och sval dag.", sky: ["cloud"], min: -99, max: 12 },

    // Regn – svalt
    { name: "Pinot Noir", reason: "Ett lätt och fruktigt rött vin för en kall kväll.", sky: ["rain", "fog"], min: -99, max: 12 },
    { name: "Chianti Classico", reason: "Körsbär och örter medan regnet fortsätter.", sky: ["rain"], min: -99, max: 14 },
    { name: "Merlot", reason: "Mjuk och värmande när det öser ner ute.", sky: ["rain"], min: -99, max: 14 },

    // Regn – milt
    { name: "Valpolicella", reason: "Frisk röd frukt för ett varmt sommarregn.", sky: ["rain"], min: 12, max: 99 },
    { name: "Torr rosé", reason: "Regn i varm luft kräver ändå något rosa.", sky: ["rain"], min: 12, max: 99 },
    { name: "Bardolino", reason: "Lätt nog att njuta av medan duggregnet faller.", sky: ["rain"], min: 12, max: 99 },
    { name: "Vinho Verde", reason: "Lite pärlande, för regn som inte är kallt.", sky: ["rain"], min: 12, max: 99 },

    // Snö
    { name: "Amarone", reason: "Fyllig och russinaktig för en snöig kväll.", sky: ["snow"], min: -99, max: 99 },
    { name: "Barolo", reason: "Strävt och seriöst, gjort för kylan.", sky: ["snow"], min: -99, max: 99 },
    { name: "Rioja Reserva", reason: "Vanilj, läder och värme i snön.", sky: ["snow"], min: -99, max: 99 },
    { name: "Tawny Port", reason: "Nötter och kola vid fönstret medan det snöar.", sky: ["snow"], min: -99, max: 99 },

    // Dimma
    { name: "Nebbiolo", reason: "Odlad i dimma, godast i dimma.", sky: ["fog"], min: -99, max: 99 },
    { name: "Barbaresco", reason: "Ros och tjära, lika stämningsfullt som diset.", sky: ["fog"], min: -99, max: 99 },
    { name: "Grenache", reason: "Värmande kryddighet som skär genom diset.", sky: ["fog"], min: -99, max: 99 },

    // Åska
    { name: "Syrah", reason: "Svartpeppar och rök som matchar åskan.", sky: ["storm"], min: -99, max: 99 },
    { name: "Malbec", reason: "Kraftig och mörk medan ovädret drar in.", sky: ["storm"], min: -99, max: 99 },
    { name: "Zinfandel", reason: "Stor, syltig och högljudd, precis som vädret.", sky: ["storm"], min: -99, max: 99 },
    { name: "Châteauneuf-du-Pape", reason: "Något rejält för en dramatisk himmel.", sky: ["storm"], min: -99, max: 99 }
  ];

  // Kommer ihåg senaste vinet så att Försök igen ger något nytt
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
        button.textContent = "Försök igen →";
        showError(error);
        return;
      }

      button.disabled = false;
      button.textContent = "Hitta ett annat vin →";
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

    const sv = function (n) { return n.toLocaleString("sv-SE"); };
    weather.textContent = `${current.sky.icon} Stockholm · ${sv(current.temperature)} °C · Regn: ${sv(current.rain)} mm`;
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
    wine.textContent = "Himlen gömmer sig just nu";
    reason.textContent = "Försök igen om en liten stund.";
    result.classList.add("show");

    window.dataLayer.push({
      event: "wine_error",
      error_message: error.message
    });
  }
})();
