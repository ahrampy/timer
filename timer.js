const changeDisplay = (timeStr) {
  
}

const timerKickoff = (mins = 0, secs = 0) => {
  let duration = mins * 60 + secs * 6;
  let start = Date.now(),
    diff,
    hours,
    minutes,
    seconds,
    interval;
  function timer() {
    // get the number of seconds that have elapsed since
    // startTimer() was called
    diff = duration - (((Date.now() - start) / 1000) | 0);

    // does the same job as parseInt truncates the float
    // var h = Math.floor(d / 3600);
    // var m = Math.floor((d % 3600) / 60);
    // var s = Math.floor((d % 3600) % 60);
    hours = Math.floor(diff / 3600) | 0;
    minutes = Math.floor((diff % 3600) / 60) | 0;
    seconds = Math.floor((diff % 3600) % 60) | 0;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // display.textContent = minutes + ":" + seconds;
    if (hours === "00") {
      console.log(minutes + ":" + seconds);
    } else {
      console.log(hours + ":" + minutes + ":" + seconds);
    }

    if (diff <= 0) {
      // add one second so that the count down starts at the full duration
      // example 05:00 not 04:59
      start = Date.now() + 1000;
    }
    if (hours === "00" && minutes === "00" && seconds === "00") {
      console.log("done");
      clearInterval(interval);
    }
  }
  // we don't want to wait a full second before the timer starts
  timer();
  interval = setInterval(timer, 1000);
};

const timer = (minutes = 0, seconds = 0) => {
  let countdown = minutes * 60 + seconds * 6;
  // let hours = Math.floor(countdown / 60)
  let mins = Math.floor(countdown / 60);
  let secs = countdown % 60;
  console.log(mins, secs);
};

const startTimer = (e) => {
  e.preventDefault();
  const main = document.querySelector("#main");
  let regex = /^(-?\d+)*\.?(\d+)?$/;
  let match = main.value.match(regex);
  if (!match) {
    main.placeholder = "NaN";
  } else if (match[1] < 0 || match[2] > 9) {
    main.placeholder = "plz";
  } else {
    main.placeholder = "";
    timerKickoff(match[1], match[2]);
  }
  main.value = "";
};

const addListeners = () => {
  const form = document.querySelector("#timerForm");
  form.addEventListener("submit", startTimer);
};

window.addEventListener("load", addListeners);
