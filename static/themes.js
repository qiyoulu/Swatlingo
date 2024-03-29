let isLightTheme = localStorage.getItem("theme") === "light";

function set_theme() {
  document.body.className = isLightTheme ? "light" : "dark";
}

function toggle_theme() {
  isLightTheme = !isLightTheme;
  localStorage.setItem("theme", isLightTheme ? "light" : "dark");
  set_theme();
}

set_theme();
