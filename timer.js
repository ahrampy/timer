const startTimer = (e) => {
  e.preventDefault();
  const main = document.querySelector("#main");
  console.log(main.value);
};

const addListeners = () => {
  const form = document.querySelector("#timerForm");
  form.addEventListener("submit", startTimer);
};

window.addEventListener("load", addListeners);
