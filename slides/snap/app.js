const presentation = document.querySelector("#presentation");
const deck = document.querySelector("#deck");
const slides = [...document.querySelectorAll(".slide")];
const currentSlide = document.querySelector("#currentSlide");
const totalSlides = document.querySelector("#totalSlides");
const progressBar = document.querySelector("#progressBar");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const overviewButton = document.querySelector("#overviewButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const toast = document.querySelector("#toast");
const sectionTitle = document.querySelector("#sectionTitle");

let activeIndex = 0;
let overview = false;
let touchStartX = 0;
let toastTimer;

if (new URLSearchParams(window.location.search).has("capture")) {
  presentation.classList.add("is-capture");
}

const pad = (value) => String(value).padStart(2, "0");

function indexFromHash() {
  const value = Number(window.location.hash.replace("#", ""));
  return Number.isInteger(value) && value >= 1 && value <= slides.length ? value - 1 : 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1600);
}

function render(index, updateHash = true) {
  activeIndex = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });

  currentSlide.textContent = pad(activeIndex + 1);
  totalSlides.textContent = pad(slides.length);
  sectionTitle.textContent = slides[activeIndex].dataset.title;
  progressBar.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
  prevButton.disabled = activeIndex === 0;
  nextButton.disabled = activeIndex === slides.length - 1;

  if (updateHash) {
    history.replaceState(null, "", `#${activeIndex + 1}`);
  }
}

function move(delta) {
  if (overview) return;
  render(activeIndex + delta);
}

function toggleOverview(force) {
  overview = typeof force === "boolean" ? force : !overview;
  presentation.classList.toggle("is-overview", overview);
  overviewButton.classList.toggle("is-active", overview);
  overviewButton.setAttribute("aria-label", overview ? "关闭总览" : "打开总览");

  if (overview) {
    slides.forEach((slide) => {
      slide.setAttribute("aria-hidden", "false");
      slide.tabIndex = 0;
    });
    slides[activeIndex].scrollIntoView({ block: "center", inline: "center" });
  } else {
    slides.forEach((slide) => { slide.tabIndex = -1; });
    render(activeIndex, false);
  }
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    showToast("当前浏览器不允许全屏");
  }
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (["arrowright", "arrowdown", " ", "pagedown"].includes(key)) {
    event.preventDefault();
    move(1);
  } else if (["arrowleft", "arrowup", "pageup"].includes(key)) {
    event.preventDefault();
    move(-1);
  } else if (key === "home") {
    render(0);
  } else if (key === "end") {
    render(slides.length - 1);
  } else if (key === "o" || (key === "escape" && overview)) {
    toggleOverview();
  } else if (key === "f") {
    toggleFullscreen();
  }
});

prevButton.addEventListener("click", () => move(-1));
nextButton.addEventListener("click", () => move(1));
overviewButton.addEventListener("click", () => toggleOverview());
fullscreenButton.addEventListener("click", toggleFullscreen);

deck.addEventListener("click", (event) => {
  if (!overview) return;
  const slide = event.target.closest(".slide");
  if (!slide) return;
  render(slides.indexOf(slide));
  toggleOverview(false);
});

deck.addEventListener("keydown", (event) => {
  if (!overview || !["Enter", " "].includes(event.key)) return;
  const slide = event.target.closest(".slide");
  if (!slide) return;
  event.preventDefault();
  render(slides.indexOf(slide));
  toggleOverview(false);
});

deck.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

deck.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1);
}, { passive: true });

window.addEventListener("hashchange", () => render(indexFromHash(), false));

document.addEventListener("fullscreenchange", () => {
  const fullscreen = Boolean(document.fullscreenElement);
  fullscreenButton.classList.toggle("is-active", fullscreen);
  fullscreenButton.setAttribute("aria-label", fullscreen ? "退出全屏" : "进入全屏");
  fullscreenButton.title = fullscreen ? "退出全屏（F）" : "全屏（F）";
});

slides.forEach((slide, index) => {
  slide.style.setProperty("--slide-index", index);
  slide.tabIndex = -1;
});

render(indexFromHash(), false);
