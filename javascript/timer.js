const storage = window.localStorage;

const dom = {
  body: null,
  form: null,
  timerInput: null,
  timerDiv: null,
  subtractBtn: null,
  clearBtn: null,
  addBtn: null,
  audioBtn: null,
  audioIcon: null,
};

const global = {
  // time
  display: null,
  duration: null,
  start: null,
  diff: null,
  // hours, minutes, seconds
  time: [0, 0, 0],

  // internal
  interval: null,
};

const assets = {
  ding: null,
};

const checkStorage = () => {
  if (storage.getItem("volume") === undefined) {
    storage.setItem("volume", "on");
  }
  updateAudio();
};

const timerKickoff = (mins = 0, secs = 0) => {
  global.duration = mins * 60 + secs * 6;
  global.start = Date.now();
  timer();
  global.interval = setInterval(timer, 1000);
};

function timer() {
  global.diff = global.duration - (((Date.now() - global.start) / 1000) | 0);

  global.time[0] = Math.floor(global.diff / 3600) | 0;
  global.time[1] = Math.floor((global.diff % 3600) / 60) | 0;
  global.time[2] = Math.floor((global.diff % 3600) % 60) | 0;

  global.time[0] = global.time[0] < 10 ? "0" + global.time[0] : global.time[0];
  global.time[1] = global.time[1] < 10 ? "0" + global.time[1] : global.time[1];
  global.time[2] = global.time[2] < 10 ? "0" + global.time[2] : global.time[2];

  if (global.diff <= 60) dom.subtractBtn.style.opacity = 0;
  if (global.diff === 0) {
    if (storage.getItem("volume") === "on") assets.ding.play();
    dom.subtractBtn.style.opacity = "0";
    dom.addBtn.style.opacity = "0";
    dom.clearBtn.innerHTML = "new";
    clearInterval(global.interval);
  } else if (global.diff < 0) return;

  changeDisplay();
}

const changeDisplay = () => {
  if (global.time[0] === "00" || global.time[0] <= 0) {
    global.display = global.time[1] + ":" + global.time[2];
  } else {
    global.display =
      global.time[0] + ":" + global.time[1] + ":" + global.time[2];
  }

  dom.timerDiv.innerHTML = global.display;
};

const startTimer = (e) => {
  e.preventDefault();

  // select for any combo of valid minutes or minutes fractions by decimals
  let regex = /^(-?\d+)*\.?([1-9])?$/;

  let match = dom.timerInput.value.match(regex);
  if (match) {
    dom.timerInput.placeholder = "";
    dom.timerInput.style.display = "none";
    dom.timerDiv.style.display = "block";
    dom.subtractBtn.style.opacity = "100";
    dom.clearBtn.style.opacity = "100";
    dom.addBtn.style.opacity = "100";
    timerKickoff(match[1], match[2]);
  }
  dom.timerInput.value = "";
};

const removeTime = () => {
  if (global.duration > 60) {
    global.duration -= 60;
    timer();
  }
};

const addTime = () => {
  global.duration += 60;
  if (global.duration > 60) dom.subtractBtn.style.opacity = 100;
  timer();
};

const stopTimer = () => {
  clearInterval(global.interval);
  dom.timerInput.style.display = "block";
  dom.timerDiv.style.display = "none";
  dom.subtractBtn.style.opacity = "0";
  dom.clearBtn.innerHTML = "clear";
  dom.clearBtn.style.opacity = "0";
  dom.addBtn.style.opacity = "0";
  dom.timerInput.focus();
};

const updateAudio = () => {
  if (storage.getItem("volume") === "on") {
    dom.audioImg.src = "images/audio.png";
  } else {
    dom.audioImg.src = "images/no-audio.png";
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

const addDomEles = () => {
  dom.body = document.querySelector("body");
  dom.form = document.querySelector("#timerForm");
  dom.timerInput = document.querySelector("#timerInput");
  dom.timerDiv = document.querySelector("#timerClock");
  dom.subtractBtn = document.querySelector("#subtract-time-btn");
  dom.clearBtn = document.querySelector("#stop-timer");
  dom.addBtn = document.querySelector("#add-time-btn");
  dom.audioBtn = document.querySelector("#audio-btn");
  dom.audioImg = document.querySelector("#audio-icon");
};

const addListeners = () => {
  dom.form.addEventListener("submit", startTimer);
  dom.subtractBtn.addEventListener("click", removeTime);
  dom.clearBtn.addEventListener("click", stopTimer);
  dom.addBtn.addEventListener("click", addTime);
  dom.audioBtn.addEventListener("click", toggleAudio);
};

const loadAudio = () => {
  assets.ding = new Audio("../audio/low-ding.mp3");
};

const init = () => {
  addDomEles();
  addListeners();
  loadAudio();
  checkStorage();
  dom.timerInput.focus();
};

window.addEventListener("load", init);
