/* =========================
   CONFIGURACIÓN CLIMA
========================= */
const LAT = 14.546;
const LON = -90.662;
const TIMEZONE = "America/Guatemala";
const TARGET_DATE = "2026-05-16";

function mapWeatherCode(code) {
    const map = {
        0: ["Despejado", "☀️"],
        1: ["Principalmente despejado", "🌤️"],
        2: ["Parcialmente nublado", "⛅"],
        3: ["Nublado", "☁️"],
        45: ["Niebla", "🌫️"],
        48: ["Escarcha", "🌫️"],
        51: ["Llovizna ligera", "🌦️"],
        53: ["Llovizna moderada", "🌧️"],
        55: ["Llovizna intensa", "🌧️"],
        61: ["Lluvia ligera", "🌧️"],
        63: ["Lluvia", "🌧️"],
        65: ["Lluvia fuerte", "🌧️"],
        80: ["Chubascos", "⛈️"],
        95: ["Tormenta", "⛈️"]
    };
    return map[code] || ["Sin datos", "❓"];
}

async function fetchForecastForDate(lat, lon, date) {
    const dailyParams = [
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "windspeed_10m_max",
        "weathercode"
    ].join(",");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=${TIMEZONE}&daily=${dailyParams}&start_date=${date}&end_date=${date}`;

    const resp = await fetch(url);
    const data = await resp.json();
    return data.daily;
}

async function initWeatherWidget() {
    try {
        const daily = await fetchForecastForDate(LAT, LON, TARGET_DATE);
        const idx = 0;
        document.getElementById("temp").textContent = `${daily.temperature_2m_max[idx]}° / ${daily.temperature_2m_min[idx]}°`;
        document.getElementById("prec").textContent = `${daily.precipitation_sum[idx]} mm`;
        document.getElementById("wind").textContent = `${daily.windspeed_10m_max[idx]} km/h`;
        document.getElementById("hum").textContent = "—%";
    } catch (e) {
        console.error("Error clima:", e);
    }
}

window.addEventListener("load", initWeatherWidget);
setInterval(initWeatherWidget, 3 * 60 * 60 * 1000);

/* =========================
   ANIMACIONES SCROLL
========================= */
const scrollElements = document.querySelectorAll('.scroll-section');

const elementInView = (el, dividend = 1.25) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
};

const handleScrollAnimation = () => {
    scrollElements.forEach(el => {
        if (elementInView(el)) el.classList.add('section-visible');
    });
};

window.addEventListener('scroll', handleScrollAnimation);
document.addEventListener('DOMContentLoaded', handleScrollAnimation);

/* =========================
   CONTADOR
========================= */
const countdown = () => {
    const eventDate = new Date('May 16, 2026 14:30:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) return;

    document.getElementById('days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById('hours').innerText = Math.floor((distance / (1000 * 60 * 60)) % 24);
    document.getElementById('minutes').innerText = Math.floor((distance / (1000 * 60)) % 60);
    document.getElementById('seconds').innerText = Math.floor((distance / 1000) % 60);
};

setInterval(countdown, 1000);
countdown();

/* =========================
   PERSONALIZACIÓN URL
========================= */
function obtenerParametroURL(nombre) {
    return new URLSearchParams(window.location.search).get(nombre);
}

document.addEventListener('DOMContentLoaded', () => {
    const nombreInvitado = obtenerParametroURL('nombre');
    const cuposDisponibles = obtenerParametroURL('cupos');

    if (nombreInvitado) {
        document.getElementById('nombre-personalizado').textContent =
            nombreInvitado.replace(/_/g, ' ');
    }

    if (cuposDisponibles) {
        document.getElementById('solo-numero-cupos').textContent = cuposDisponibles;
    }
});

/* =========================
    INTRO CON DOBLE VIDEO
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const loopVideo = document.getElementById("intro-video");
    const overlay = document.getElementById("intro-overlay");
    const music = document.getElementById("background-music");

    document.body.style.overflow = "hidden";

    const transitionVideo = document.createElement("video");
    transitionVideo.src = "https://www.dropbox.com/scl/fi/n1jbxbq62qblcxqhxpde8/V1p.mp4?rlkey=ex3jzisuenzwtsojhu0hlliut&raw=1";
    transitionVideo.playsInline = true;
    transitionVideo.autoplay = false;
    transitionVideo.style.position = "fixed";
    transitionVideo.style.inset = "0";
    transitionVideo.style.width = "100%";
    transitionVideo.style.height = "100%";
    transitionVideo.style.objectFit = "cover";
    transitionVideo.style.zIndex = "10000";
    transitionVideo.style.display = "none";

    document.body.appendChild(transitionVideo);

    overlay.addEventListener("click", () => {

        loopVideo.pause();
        loopVideo.style.display = "none";

        transitionVideo.style.display = "block";
        transitionVideo.play();

        transitionVideo.onended = () => {
            transitionVideo.classList.add("fade-out");

            setTimeout(() => {
                transitionVideo.remove();
                overlay.remove();
                music.play().catch(()=>{});
                document.body.style.overflow = "auto";
            }, 1000);
        };

    }, { once: true });
});

/* =========================
   VIDEO SECCIÓN 3
========================= */
const seccion3 = document.getElementById('seccion3');
const videoSeccion3 = document.getElementById('video-seccion3');

if (seccion3 && videoSeccion3) {
    const observerVideo = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                videoSeccion3.style.display = 'block';
                videoSeccion3.play().catch(()=>{});
            } else {
                videoSeccion3.pause();
                videoSeccion3.style.display = 'none';
            }
        });
    }, { threshold: 0.5 });

    observerVideo.observe(seccion3);
}