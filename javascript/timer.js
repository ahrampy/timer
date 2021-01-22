const globals = {
  // dom eles
  form: null,
  timerInput: null,
  timerDiv: null,
  clearBtn: null,
  audioBtn: null,
  audioIcon: null,

  // internal
  interval: null,
  muted: false,
};

const assets = {
  ding: null,
};

const changeDisplay = (timeStr) => {
  // console.log(globals.timerDiv);
  globals.timerDiv.innerHTML = timeStr;
};

const timerKickoff = (mins = 0, secs = 0) => {
  let duration = mins * 60 + secs * 6;
  let start = Date.now(),
    diff,
    hours,
    minutes,
    seconds,
    display;
  function timer() {
    // get the number of seconds that have elapsed since timerKickoff() was called
    diff = duration - (((Date.now() - start) / 1000) | 0);

    // does the same job as parseInt truncates the float
    hours = Math.floor(diff / 3600) | 0;
    minutes = Math.floor((diff % 3600) / 60) | 0;
    seconds = Math.floor((diff % 3600) % 60) | 0;

    // format
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (hours === "00" || hours <= 0) {
      display = minutes + ":" + seconds;
    } else {
      display = hours + ":" + minutes + ":" + seconds;
    }

    changeDisplay(display);

    if (diff <= 0) {
      clearInterval(globals.interval);
      if (!globals.muted) assets.ding.play();
    }
  }
  // we don't want to wait a full second before the timer starts
  timer();
  globals.interval = setInterval(timer, 1000);
};

const startTimer = (e) => {
  e.preventDefault();
  // select for any combo of valid minutes or minutes fractions with decimals
  let regex = /^(-?\d+)*\.?(\d+)?$/;
  let match = globals.timerInput.value.match(regex);
  if (!match) {
    // do not accept non-number inputs
    globals.timerInput.placeholder = "NaN";
  } else if (match[1] < 0 || match[2] > 9) {
    // get sassy if the minute or decimal places are invalid
    globals.timerInput.placeholder = "plz";
  } else {
    // start timer
    globals.timerInput.placeholder = "";
    globals.timerInput.style.display = "none";
    globals.timerDiv.style.display = "block";
    globals.clearBtn.style.opacity = "100";
    timerKickoff(match[1], match[2]);
  }
  globals.timerInput.value = "";
};

const stopTimer = (e) => {
  e.preventDefault();
  globals.timerInput.style.display = "block";
  globals.timerDiv.style.display = "none";
  globals.clearBtn.style.opacity = "0";
  clearInterval(globals.interval);
};

const toggleAudioIcon = (e) => {
  // e.preventDefault();
  if (globals.muted) {
    globals.audioImg.src = "images/audio.png";
    globals.muted = false;
  } else {
    globals.audioImg.src = "images/no-audio.png";
    globals.muted = true;
  }
};

const addDomEles = () => {
  globals.form = document.querySelector("#timerForm");
  globals.timerInput = document.querySelector("#timerInput");
  globals.timerDiv = document.querySelector("#timerClock");
  globals.clearBtn = document.querySelector("#stop-timer");
  globals.audioBtn = document.querySelector("#audio-btn");
  globals.audioImg = document.querySelector("#audio-icon");
};

const addListeners = () => {
  globals.form.addEventListener("submit", startTimer);
  globals.clearBtn.addEventListener("click", stopTimer);
  globals.audioBtn.addEventListener("click", toggleAudioIcon);
};

const loadAudio = () => {
  assets.ding = new Audio("../audio/low-ding.mp3");
};

const init = () => {
  addDomEles();
  addListeners();
  loadAudio();
};

window.addEventListener("load", init);
