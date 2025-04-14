const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const darkToggle = document.getElementById("dark-mode-toggle");
const message = document.getElementById("message");
const result = document.getElementById("result");
const leaderboard = document.getElementById("leaderboard");
const visitorCounter = document.getElementById("visitor-counter");

let startTime, timeoutID, isGreen = false;
let times = JSON.parse(localStorage.getItem("reactionTimes")) || [];

// --- Load visitor count from CountAPI
fetch("https://api.countapi.xyz/hit/reactiongame/demo")
  .then(res => res.json())
  .then(data => {
    visitorCounter.textContent = `Visitors: ${data.value}`;
  });

// --- Load best score
let bestScore = localStorage.getItem("bestScore");
if (bestScore) {
  result.innerHTML = `Best Reaction Time: <strong>${bestScore} ms</strong>`;
}

// --- Dark Mode Toggle
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// --- Start Game
startBtn.addEventListener("click", () => {
  result.textContent = "";
  message.textContent = "Wait for green...";
  gameArea.style.backgroundColor = "#ddd";
  isGreen = false;

  const delay = Math.floor(Math.random() * 3000) + 2000;
  timeoutID = setTimeout(() => {
    gameArea.classList.add("active");
    message.textContent = "CLICK NOW!";
    startTime = Date.now();
    isGreen = true;
    new Audio("start.mp3").play();
  }, delay);
});

// --- Game Click
gameArea.addEventListener("click", () => {
  if (!isGreen) {
    clearTimeout(timeoutID);
    message.textContent = "Too soon! Try again.";
    new Audio("fail.mp3").play();
  } else {
    const reactionTime = Date.now() - startTime;
    new Audio("click.mp3").play();
    message.textContent = "Click 'Start' to play again.";
    gameArea.classList.remove("active");
    isGreen = false;

    // Save best score
    let best = localStorage.getItem("bestScore");
    if (!best || reactionTime < best) {
      localStorage.setItem("bestScore", reactionTime);
      best = reactionTime;
    }
    result.innerHTML = `Your reaction time: <strong>${reactionTime} ms</strong><br>Best Reaction Time: <strong>${best} ms</strong>`;

    // Update leaderboard
    times.push(reactionTime);
    times.sort((a, b) => a - b);
    times = times.slice(0, 5);
    localStorage.setItem("reactionTimes", JSON.stringify(times));
    renderLeaderboard();
  }
});

// --- Reset Best Score
resetBtn.addEventListener("click", () => {
  localStorage.removeItem("bestScore");
  localStorage.removeItem("reactionTimes");
  result.textContent = "Best Reaction Time has been reset.";
  leaderboard.innerHTML = "";
});

// --- Leaderboard
function renderLeaderboard() {
  leaderboard.innerHTML = times.map(t => `<li>${t} ms</li>`).join("");
}
renderLeaderboard();
