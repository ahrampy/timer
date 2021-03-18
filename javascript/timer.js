const storage = window.localStorage;

const domObj = {
  html: null,
  body: null,
  form: null,
  timerInput: null,
  timerDiv: null,
  subtractBtn: null,
  clearBtn: null,
  clearSymbol: null,
  addBtn: null,
  audioBtn: null,
  audioIcon: null,
  bgBtn: null,
  bgIcon: null,
  bgMenu: null,
};

const timeObj = {
  // hours, minutes, seconds
  time: [0, 0, 0],

  display: null,
  duration: null,
  start: null,
  diff: null,
  interval: null,
};

const themeObj = {
  river: {
    img: 1,
    main: "#e8f8f8",
    accent: "#1b3532",
  },
  mountain: {
    img: 2,
    main: "rgba(171,203,252,0.7)",
    accent: "#462b64",
  },
  window: {
    img: 3,
    main: "#6c5c64",
    accent: "#f5e2be",
  },
};

const assetsObj = {
  ding: null,
};

const checkStorage = () => {
  if (!storage.getItem("volume")) {
    storage.setItem("volume", "on");
  }
  if (!storage.getItem("theme")) {
    storage.setItem("theme", "river");
  }
  updateTheme();
  updateAudio();
};

const toggleBgMenu = () => {
  if (domObj.bgMenu.classList.contains("hidden")) {
    domObj.bgMenu.classList.remove("hidden");
    domObj.bgIcon.src = "../images/arrow-right.png";
  } else {
    domObj.bgMenu.classList.add("hidden");
    domObj.bgIcon.src = "../images/arrow-left.png";
  }
};

const updateTheme = () => {
  const currTheme = storage.getItem("theme");
  const currThemeObj = themeObj[currTheme];
  domObj.html.style.backgroundImage = `url("../images/bg-${currThemeObj.img}.png")`;
  document.querySelector(`#${currTheme}`).classList.add("hidden");
  document.documentElement.style.setProperty("--main", `${currThemeObj.main}`);
  document.documentElement.style.setProperty(
    "--accent",
    `${currThemeObj.accent}`
  );
};

const setBgOption = (e) => {
  const newTheme = e.target.id;
  const currTheme = storage.getItem("theme");
  const oldBtn = document.querySelector(`#${currTheme}`);
  const newBtn = document.querySelector(`#${newTheme}`);
  oldBtn.classList.remove("hidden");
  newBtn.classList.add("hidden");
  storage.setItem("theme", newTheme);
  updateTheme();
};

const updateAudio = () => {
  if (storage.getItem("volume") === "on") {
    domObj.audioImg.src = "images/volume-off.png";
  } else {
    domObj.audioImg.src = "images/volume-on.png";
  }
};

const toggleAudio = () => {
  if (storage.getItem("volume") === "on") {
    storage.setItem("volume", "off");
  } else {
    storage.setItem("volume", "on");
  }
  updateAudio();
};

const timerKickoff = (mins = 0, secs = 0) => {
  timeObj.duration = mins * 60 + secs * 6;
  timeObj.start = Date.now();
  timer();
  timeObj.interval = setInterval(timer, 1000);
};

function timer() {
  timeObj.diff = timeObj.duration - (((Date.now() - timeObj.start) / 1000) | 0);

  timeObj.time[0] = Math.floor(timeObj.diff / 3600) | 0;
  timeObj.time[1] = Math.floor((timeObj.diff % 3600) / 60) | 0;
  timeObj.time[2] = Math.floor((timeObj.diff % 3600) % 60) | 0;

  timeObj.time[0] =
    timeObj.time[0] < 10 ? "0" + timeObj.time[0] : timeObj.time[0];
  timeObj.time[1] =
    timeObj.time[1] < 10 ? "0" + timeObj.time[1] : timeObj.time[1];
  timeObj.time[2] =
    timeObj.time[2] < 10 ? "0" + timeObj.time[2] : timeObj.time[2];

  if (timeObj.diff <= 60) domObj.subtractBtn.style.opacity = 0;
  if (timeObj.diff === 0) {
    if (storage.getItem("volume") === "on") assetsObj.ding.play();
    domObj.subtractBtn.style.opacity = "0";
    domObj.addBtn.style.opacity = "0";
    domObj.clearSymbol.classList.remove("stop-timer-symbol");
    domObj.clearSymbol.classList.add("play-timer-symbol");
    clearInterval(timeObj.interval);
  } else if (timeObj.diff < 0) return;

  changeDisplay();
}

const changeDisplay = () => {
  if (timeObj.time[0] === "00" || timeObj.time[0] <= 0) {
    timeObj.display = timeObj.time[1] + ":" + timeObj.time[2];
  } else {
    timeObj.display =
      timeObj.time[0] + ":" + timeObj.time[1] + ":" + timeObj.time[2];
  }

  domObj.timerDiv.innerHTML = timeObj.display;
};

const startTimer = (e) => {
  e.preventDefault();

  // select for any int or a float with one decimal
  let regex = /^(-?\d+)*\.?([1-9])?$/;

  let match = domObj.timerInput.value.match(regex);
  if (match) {
    domObj.timerInput.placeholder = "";
    domObj.timerInput.style.display = "none";
    domObj.timerDiv.style.display = "block";
    domObj.clearSymbol.classList.remove("play-timer-symbol");
    domObj.clearSymbol.classList.add("stop-timer-symbol");
    domObj.subtractBtn.style.opacity = "100";
    domObj.clearBtn.style.opacity = "100";
    domObj.addBtn.style.opacity = "100";
    timerKickoff(match[1], match[2]);
  }
  domObj.timerInput.value = "";
};

const removeTime = () => {
  if (timeObj.duration > 60) {
    timeObj.duration -= 60;
    timer();
  }
};

const addTime = () => {
  timeObj.duration += 60;
  if (timeObj.duration > 60) domObj.subtractBtn.style.opacity = 100;
  timer();
};

const stopTimer = () => {
  clearInterval(timeObj.interval);
  domObj.timerInput.style.display = "block";
  domObj.timerDiv.style.display = "none";
  domObj.subtractBtn.style.opacity = "0";
  domObj.clearSymbol.classList.remove("stop-timer-symbol");
  domObj.clearSymbol.classList.add("play-timer-symbol");
  domObj.clearBtn.style.opacity = "0";
  domObj.addBtn.style.opacity = "0";
  domObj.timerInput.focus();
};

const addDomEles = () => {
  domObj.html = document.querySelector("html");
  domObj.body = document.querySelector("body");
  domObj.form = document.querySelector("#timerForm");
  domObj.timerInput = document.querySelector("#timerInput");
  domObj.timerDiv = document.querySelector("#timerClock");
  domObj.subtractBtn = document.querySelector("#subtract-time-btn");
  domObj.clearBtn = document.querySelector("#clear-timer-btn");
  domObj.clearSymbol = document.querySelector("#clear-timer-symbol");
  domObj.addBtn = document.querySelector("#add-time-btn");
  domObj.audioBtn = document.querySelector("#audio-btn");
  domObj.audioImg = document.querySelector("#audio-icon");
  domObj.bgBtn = document.querySelector("#bg-btn");
  domObj.bgIcon = document.querySelector("#bg-icon");
  domObj.bgMenu = document.querySelector(".bg-menu");
  domObj.bgOptions = document.querySelectorAll(".bg-option");
};

const addListeners = () => {
  domObj.form.addEventListener("submit", startTimer);
  domObj.subtractBtn.addEventListener("click", removeTime);
  domObj.clearBtn.addEventListener("click", stopTimer);
  domObj.addBtn.addEventListener("click", addTime);
  domObj.audioBtn.addEventListener("click", toggleAudio);
  domObj.bgBtn.addEventListener("click", toggleBgMenu);
  domObj.bgOptions.forEach((option) => {
    option.addEventListener("click", setBgOption);
  });
};

const loadAudio = () => {
  assetsObj.ding = new Audio("../audio/low-ding.mp3");
};

const init = () => {
  addDomEles();
  addListeners();
  loadAudio();
  checkStorage();
  domObj.timerInput.focus();
};

window.addEventListener("load", init);
