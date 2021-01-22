const globals = {
  // dom eles
  body: null,
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

// const changeBackground = (duration, hours, minutes, seconds) => {
//   globals.body.style.background = `linear-gradient(
//     ${seconds % 10}deg,
//     rgba(255, 141, 1, 0.886) ${0}%,
//     rgba(255, 225, 0, 0.838) ${minutes + 30}%,
//     rgba(50, 167, 0, 0.79) ${100}%
//   )`;
// };

const changeDisplay = (timeStr) => {
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
    diff = duration - (((Date.now() - start) / 1000) | 0);

    hours = Math.floor(diff / 3600) | 0;
    minutes = Math.floor((diff % 3600) / 60) | 0;
    seconds = Math.floor((diff % 3600) % 60) | 0;

    // changeBackground(duration, hours, minutes, seconds);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (hours === "00" || hours <= 0) {
      display = minutes + ":" + seconds;
    } else {
      display = hours + ":" + minutes + ":" + seconds;
    }

    if (diff < 0) {
      clearInterval(globals.interval);
      if (!globals.muted) assets.ding.play();
    } else {
      changeDisplay(display);
    }
  }
  timer();
  globals.interval = setInterval(timer, 1000);
};

const startTimer = (e) => {
  e.preventDefault();
  // select for any combo of valid minutes or minutes fractions by decimals
  let regex = /^(-?\d+)*\.?([1-9])?$/;
  let match = globals.timerInput.value.match(regex);
  if (match) {
    globals.timerInput.placeholder = "";
    globals.timerInput.style.display = "none";
    globals.timerDiv.style.display = "block";
    globals.clearBtn.style.opacity = "100";
    timerKickoff(match[1], match[2]);
  }
  globals.timerInput.value = "";
};

const stopTimer = () => {
  globals.timerInput.style.display = "block";
  globals.timerDiv.style.display = "none";
  globals.clearBtn.style.opacity = "0";
  clearInterval(globals.interval);
  globals.timerInput.focus();
};

const toggleAudioIcon = () => {
  if (globals.muted) {
    globals.audioImg.src = "images/audio.png";
    globals.muted = false;
  } else {
    globals.audioImg.src = "images/no-audio.png";
    globals.muted = true;
  }
};

const addDomEles = () => {
  globals.body = document.querySelector("body");
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

const addBG = () => {
  // const bg = new Image();
  // bg.src = `../images/backgrounds/${Math.floor(Math.random() * 7)}.png`
  // globals.html.backgroundImage = bg;
}

const init = () => {
  addDomEles();
  addListeners();
  loadAudio();
  addBG();
  globals.timerInput.focus()
};

window.addEventListener("load", init);
