let interval = null;
let targetTime = null;
let paused = false;
let started = false;

function startCountdown() {
  if (started) {
    alert("Countdown already started. Use Pause/Resume or Reset.");
    return;
  }

  const dateVal = document.getElementById("dateInput").value;
  const timeVal = document.getElementById("timeInput").value;

  if (!dateVal || !timeVal) {
    alert("Please select both date and time (with seconds).");
    return;
  }

  const selectedTime = new Date(`${dateVal}T${timeVal}`);
  const now = new Date();

  if (selectedTime <= now) {
    alert("Please select a future date and time.");
    return;
  }

  targetTime = selectedTime;
  started = true;
  paused = false;

  startInterval();
}

function pauseOrResumeCountdown() {
  const pauseResumeBtn = document.getElementById("pauseResumeBtn");

  if (!started) return;

  if (!paused) {
    clearInterval(interval);
    paused = true;
    pauseResumeBtn.innerText = "Resume";
  } else {
    paused = false;
    pauseResumeBtn.innerText = "Pause";
    startInterval();
  }
}

function startInterval() {
  clearInterval(interval);
  interval = setInterval(updateTimerDisplay, 1000);
  updateTimerDisplay();
}

function resetCountdown() {
  clearInterval(interval);
  paused = false;
  started = false;

  document.getElementById("dateInput").value = "";
  document.getElementById("timeInput").value = "";

  document.getElementById("pauseResumeBtn").innerText = "Pause";

  ['days', 'hours', 'minutes', 'seconds'].forEach(id =>
    document.getElementById(id).innerText = '00'
  );
}

function updateTimerDisplay() {
  const now = new Date();
  const diff = targetTime - now;

  if (diff <= 0) {
    resetCountdown();
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  updateDigit("days", days);
  updateDigit("hours", hours);
  updateDigit("minutes", minutes);
  updateDigit("seconds", seconds);
}

function pad(num) {
  return num.toString().padStart(2, "0");
}

function updateDigit(id, value) {
  const el = document.getElementById(id);
  const newValue = pad(value);

  if (el.innerText !== newValue) {
    el.classList.remove("flip");
    void el.offsetWidth;
    el.innerText = newValue;
    el.classList.add("flip");
  }
}
