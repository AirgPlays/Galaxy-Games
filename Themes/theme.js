/* theme.js - AUTO theme + override + music + snow */
/* NOTE: adjust paths if your site uses subfolders */

/* ---------- CONFIG ---------- */
const themeFolder = "/Themes/theme-files/"; // path to css files
const musicMap = {
  christmas: "/Images/themes/christmas.mp3",
  halloween: "/Images/themes/halloween.mp3",
  thanksgiving: "/Images/themes/thanksgiving.mp3",
  valentines: "/Images/themes/valentines.mp3",
  easter: "/Images/themes/easter.mp3"
};
/* Date ranges (inclusive). Adjust as needed */
function getAutoTheme() {
  const d = new Date();
  const m = d.getMonth() + 1; // 1-12
  const day = d.getDate();

  // Christmas: Dec 1-25
  if (m === 12 && day >= 1 && day <= 25) return "christmas";
  // Halloween: Oct 1-31
  if (m === 10 && day >= 1 && day <= 31) return "halloween";
  // Thanksgiving: Nov 1-30 (you can customize)
  if (m === 11 && day >= 1 && day <= 30) return "thanksgiving";
  // Valentines: Feb 1-14
  if (m === 2 && day >= 1 && day <= 14) return "valentines";
  // Easter - simple approx (Mar 20 - Apr 10)
  if ((m === 3 && day >= 20) || (m === 4 && day <= 10)) return "easter";

  return "default";
}

/* ---------- APPLY THEME ---------- */
function applyThemeClass(themeName) {
  // remove any old theme body classes
  document.body.classList.remove("default","christmas","halloween","thanksgiving","valentines","easter");
  document.body.classList.add(themeName);
}

/* append stylesheet for small overrides (not required but keeps CSS modular) */
function loadThemeCSS(name) {
  // remove existing theme <link id="theme-css">
  const old = document.getElementById("theme-css");
  if (old) old.remove();

  const href = themeFolder + name + ".css";
  const link = document.createElement("link");
  link.id = "theme-css";
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

/* ---------- MUSIC ---------- */
function playThemeMusicIfEnabled(themeName) {
  const audio = document.getElementById("themeAudio");
  const enabled = localStorage.getItem("themeMusicEnabled") === "1";
  if (!enabled) { audio.pause(); audio.src = ""; return; }

  const src = musicMap[themeName];
  if (!src) { audio.pause(); audio.src = ""; return; }
  if (audio.src && audio.src.includes(src)) return;
  audio.src = src;
  audio.loop = true;
  audio.volume = 0.5;
  audio.play().catch(()=>{/* ignore autoplay block */});
}

/* ---------- SNOW (Christmas) ---------- */
function spawnSnow() {
  // small, lightweight snow using CSS animation + few elements
  if (document.getElementById("theme-snow")) return;
  const container = document.createElement("div");
  container.id = "theme-snow";
  container.style.position = "fixed";
  container.style.left = 0;
  container.style.top = 0;
  container.style.pointerEvents = "none";
  container.style.zIndex = 99990;
  container.style.width = "100%";
  container.style.height = "100%";
  document.body.appendChild(container);

  // create N snowflakes
  const N = 30;
  for (let i=0;i<N;i++){
    const s = document.createElement("div");
    s.className = "tf-snow";
    const left = Math.random()*100;
    const delay = Math.random()*-20;
    const dur = 8 + Math.random()*10;
    s.style.left = left + "%";
    s.style.top = "-5%";
    s.style.opacity = (0.4 + Math.random()*0.6).toFixed(2);
    s.style.fontSize = (8 + Math.random()*18) + "px";
    s.style.transform = `translateX(0)`;
    s.style.animation = `tf-snow-fall ${dur}s linear ${delay}s infinite`;
    s.textContent = "❅";
    container.appendChild(s);
  }

  // minimal CSS injection for snow
  if (!document.getElementById("theme-snow-style")) {
    const st = document.createElement("style");
    st.id = "theme-snow-style";
    st.textContent = `
      @keyframes tf-snow-fall {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(120vh) rotate(360deg); }
      }
      .tf-snow { position:absolute; will-change:transform; user-select:none; }
    `;
    document.head.appendChild(st);
  }
}
function removeSnow() {
  const el = document.getElementById("theme-snow");
  if (el) el.remove();
}

/* ---------- INITIALIZE ---------- */
function initThemeSystem() {
  // find override in localStorage
  const override = localStorage.getItem("themeOverride");
  const auto = getAutoTheme();
  const theme = override || auto || "default";

  applyThemeClass(theme);
  loadThemeCSS(theme);
  playThemeMusicIfEnabled(theme);

  // special extras
  if (theme === "christmas") spawnSnow(); else removeSnow();
}

/* ---------- UI HOOKS (panel) ---------- */
document.addEventListener("DOMContentLoaded", ()=>{

  // init theme
  initThemeSystem();

  // panel toggle button
  const toggle = document.getElementById("themeToggleBtn");
  const panel = document.getElementById("themePanel");
  const box = document.getElementById("themeBox");
  if (toggle && panel) {
    panel.style.display = "none";
    toggle.addEventListener("click", ()=>{
      const showing = panel.style.display !== "none";
      panel.style.display = showing ? "none" : "block";
    });
  }

  // theme buttons
  document.querySelectorAll(".theme-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const name = btn.dataset.theme;
      if (!name) return;
      localStorage.setItem("themeOverride", name);
      // apply immediately
      applyThemeClass(name);
      loadThemeCSS(name);
      playThemeMusicIfEnabled(name);
      if (name === "christmas") spawnSnow(); else removeSnow();
    });
  });

  // reset button
  const reset = document.getElementById("resetTheme");
  if (reset) {
    reset.addEventListener("click", ()=>{
      localStorage.removeItem("themeOverride");
      initThemeSystem();
    });
  }

  // music checkbox
  const musicCb = document.getElementById("musicCheckbox");
  if (musicCb) {
    const enabled = localStorage.getItem("themeMusicEnabled") === "1";
    musicCb.checked = enabled;
    musicCb.addEventListener("change", ()=>{
      localStorage.setItem("themeMusicEnabled", musicCb.checked ? "1" : "0");
      initThemeSystem();
    });
  }
});


