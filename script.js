let timer = 60;
let score = 0;
let target = 0;
let playing = true;
let timerInterval;

window.addEventListener("load", () => {
  const main = document.getElementById("main");
  const start = document.getElementById("start-screen");
  main.style.display = "none";
  document.getElementById("start-btn").addEventListener("click", () => {
    start.style.display = "none";
    main.style.display = "block";
    init();
  });
});

function randInt() {
  return Math.floor(Math.random() * 10);
}

function makeBubbles() {
  let html = "";
  for (let i = 0; i < 85; i++) {
    // Random gradient color for variety
    const colors = [
      "linear-gradient(135deg, #ff6a00, #ee0979)",
      "linear-gradient(135deg, #00c6ff, #0072ff)",
      "linear-gradient(135deg, #f7971e, #ffd200)",
      "linear-gradient(135deg, #43cea2, #185a9d)",
      "linear-gradient(135deg, #ff512f, #dd2476)",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    html += `<div class="bubble" style="background:${color}; box-shadow: 0 4px 8px ${color
      .replace("linear-gradient(135deg, ", "")
      .replace(")", "")}80;">${randInt()}</div>`;
  }
  document.getElementById("pbtm").innerHTML = html;
}

function newTarget() {
  target = randInt();
  document.getElementById("hitval").textContent = target;
}

function addScore(pts) {
  score += pts;
  if (score < 0) score = 0;
  document.getElementById("scoreval").textContent = score;
  updateBestScore();
}

function updateBestScore() {
  let best = localStorage.getItem("bestScore") || 0;
  if (score > best) {
    localStorage.setItem("bestScore", score);
    document.getElementById("bestscoreval").textContent = score;
  } else {
    document.getElementById("bestscoreval").textContent = best;
  }
}

function startTimer() {
  const t = document.getElementById("timerval");
  clearInterval(timerInterval); // clear any previous timer
  timerInterval = setInterval(() => {
    if (timer > 0 && playing) {
      timer--;
      t.textContent = timer;
    } else {
      clearInterval(timerInterval);
      playing = false;
      document.getElementById("pbtm").innerHTML = `
        <div id="gameover-screen" class="fade-in">
          <h1>Game Over</h1>
          <p>Your final score is</p>
          <div class="final-score">${score}</div>
          <p class="message">Great effort! Try again to beat your best score!</p>
          <button id="restart-btn">Restart Game</button>
          <div class="confetti"></div>
        </div>
      `;
    }
  }, 1000);
}

// Bubble click handler
document.getElementById("pbtm").addEventListener("click", function (e) {
  if (!playing) return;
  const el = e.target;
  if (el.classList.contains("bubble")) {
    const val = Number(el.textContent);
    if (val === target) {
      el.style.animation = "pop 0.3s forwards";
      addScore(10);
      setTimeout(() => {
        makeBubbles();
        newTarget();
      }, 300);
    } else {
      addScore(-20);
      el.classList.add("wrong");
      setTimeout(() => {
        el.classList.remove("wrong");
      }, 300);
    }
  }
});

document.getElementById("pbtm").addEventListener("click", function (e) {
  if (e.target && e.target.id === "restart-btn") {
    init();
  }
});

function init() {
  timer = 60;
  score = 0;
  playing = true;
  document.getElementById("scoreval").textContent = score;
  document.getElementById("timerval").textContent = timer;
  makeBubbles();
  newTarget();
  updateBestScore();
  startTimer();
}

window.onload = () => {
  document.getElementById("main").style.display = "none";
};
