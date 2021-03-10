const global = {
  // dom eles
  body: null,
  form: null,
  timerInput: null,
  timerDiv: null,
  subtractBtn: null,
  clearBtn: null,
  addBtn: null,
  audioBtn: null,
  audioIcon: null,

  // time
  display: null,
  duration: null,
  start: null,
  diff: null,
  time: [0, 0, 0],

  // internal
  interval: null,
  muted: false,
};

const assets = {
  ding: null,
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

  if (global.diff <= 60) global.subtractBtn.style.opacity = 0;
  if (global.diff === 0) {
    if (!global.muted) assets.ding.play();
    clearInterval(global.interval);
  }

  if (global.diff < 0) return;

  changeDisplay();
}

const changeDisplay = () => {
  if (global.time[0] === "00" || global.time[0] <= 0) {
    global.display = global.time[1] + ":" + global.time[2];
  } else {
    global.display =
      global.time[0] + ":" + global.time[1] + ":" + global.time[2];
  }

  global.timerDiv.innerHTML = global.display;
};

const startTimer = (e) => {
  e.preventDefault();

  // select for any combo of valid minutes or minutes fractions by decimals
  let regex = /^(-?\d+)*\.?([1-9])?$/;

  let match = global.timerInput.value.match(regex);
  if (match) {
    global.timerInput.placeholder = "";
    global.timerInput.style.display = "none";
    global.timerDiv.style.display = "block";
    global.subtractBtn.style.opacity = "100";
    global.clearBtn.style.opacity = "100";
    global.addBtn.style.opacity = "100";
    timerKickoff(match[1], match[2]);
  }
  global.timerInput.value = "";
};

const removeTime = () => {
  if (global.duration > 60) {
    global.duration -= 60;
    timer();
  }
};

const addTime = () => {
  global.duration += 60;
  if (global.duration > 60) global.subtractBtn.style.opacity = 100;
  timer();
};

const stopTimer = () => {
  clearInterval(global.interval);
  global.timerInput.style.display = "block";
  global.timerDiv.style.display = "none";
  global.subtractBtn.style.opacity = "0";
  global.clearBtn.style.opacity = "0";
  global.addBtn.style.opacity = "0";
  global.timerInput.focus();
};

const toggleAudioIcon = () => {
  if (global.muted) {
    global.audioImg.src = "images/audio.png";
    global.muted = false;
  } else {
    global.audioImg.src = "images/no-audio.png";
    global.muted = true;
  }
};

const addDomEles = () => {
  global.body = document.querySelector("body");
  global.form = document.querySelector("#timerForm");
  global.timerInput = document.querySelector("#timerInput");
  global.timerDiv = document.querySelector("#timerClock");
  global.subtractBtn = document.querySelector("#subtract-time-btn");
  global.clearBtn = document.querySelector("#stop-timer");
  global.addBtn = document.querySelector("#add-time-btn");
  global.audioBtn = document.querySelector("#audio-btn");
  global.audioImg = document.querySelector("#audio-icon");
};

const addListeners = () => {
  global.form.addEventListener("submit", startTimer);
  global.subtractBtn.addEventListener("click", removeTime);
  global.clearBtn.addEventListener("click", stopTimer);
  global.addBtn.addEventListener("click", addTime);
  global.audioBtn.addEventListener("click", toggleAudioIcon);
};

const loadAudio = () => {
  assets.ding = new Audio("../audio/low-ding.mp3");
};

const init = () => {
  addDomEles();
  addListeners();
  loadAudio();
  global.timerInput.focus();
};

window.addEventListener("load", init);
