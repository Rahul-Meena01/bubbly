// Game state variables
let timer = 60;
let score = 0;
let target = 0;
let playing = true;
let timerInterval;

// DOM element references for better performance
let mainElement,
  startElement,
  startBtn,
  pbtmElement,
  hitvalElement,
  timervalElement,
  scorevalElement,
  bestscorevalElement;

// Initialize DOM references and event listeners
window.addEventListener("load", () => {
  try {
    // Get DOM elements with error checking
    mainElement = document.getElementById("main");
    startElement = document.getElementById("start-screen");
    startBtn = document.getElementById("start-btn");
    pbtmElement = document.getElementById("pbtm");
    hitvalElement = document.getElementById("hitval");
    timervalElement = document.getElementById("timerval");
    scorevalElement = document.getElementById("scoreval");
    bestscorevalElement = document.getElementById("bestscoreval");

    // Validate all required elements exist
    if (
      !mainElement ||
      !startElement ||
      !startBtn ||
      !pbtmElement ||
      !hitvalElement ||
      !timervalElement ||
      !scorevalElement ||
      !bestscorevalElement
    ) {
      throw new Error("Required DOM elements not found");
    }

    // Initialize UI state
    mainElement.style.display = "none";

    // Add start button event listener
    startBtn.addEventListener("click", () => {
      startElement.style.display = "none";
      mainElement.style.display = "block";
      init();
    });

    // Load best score from localStorage
    loadBestScore();

    // Initialize click handler
    initializeClickHandler();

    // Add keyboard accessibility
    initializeKeyboardSupport();
  } catch (error) {
    console.error("Failed to initialize game:", error);
    alert("Game initialization failed. Please refresh the page.");
  }
});

function randInt() {
  return Math.floor(Math.random() * 10);
}

function makeBubbles() {
  try {
    if (!pbtmElement) {
      throw new Error("Game area element not found");
    }

    let html = "";
    const bubbleCount = 85;

    // Predefined gradient colors for better performance
    const colors = [
      "linear-gradient(135deg, #ff6a00, #ee0979)",
      "linear-gradient(135deg, #00c6ff, #0072ff)",
      "linear-gradient(135deg, #f7971e, #ffd200)",
      "linear-gradient(135deg, #43cea2, #185a9d)",
      "linear-gradient(135deg, #ff512f, #dd2476)",
    ];

    // Generate bubbles with optimized HTML
    for (let i = 0; i < bubbleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const number = randInt();
      const shadowColor =
        color.replace("linear-gradient(135deg, ", "").replace(")", "") + "80";

      html += `<div class="bubble" style="background:${color}; box-shadow: 0 4px 8px ${shadowColor};" role="button" tabindex="0" aria-label="Bubble with number ${number}">${number}</div>`;
    }

    pbtmElement.innerHTML = html;
  } catch (error) {
    console.error("Failed to create bubbles:", error);
  }
}

function newTarget() {
  try {
    target = randInt();
    if (hitvalElement) {
      hitvalElement.textContent = target;
    }
  } catch (error) {
    console.error("Failed to set new target:", error);
  }
}

function addScore(pts) {
  try {
    score += pts;
    if (score < 0) score = 0;

    if (scorevalElement) {
      scorevalElement.textContent = score;
    }
    updateBestScore();
  } catch (error) {
    console.error("Failed to update score:", error);
  }
}

function updateBestScore() {
  try {
    let best = getBestScore();
    if (score > best) {
      setBestScore(score);
      if (bestscorevalElement) {
        bestscorevalElement.textContent = score;
      }
    } else {
      if (bestscorevalElement) {
        bestscorevalElement.textContent = best;
      }
    }
  } catch (error) {
    console.error("Failed to update best score:", error);
  }
}

function getBestScore() {
  try {
    return parseInt(localStorage.getItem("bestScore")) || 0;
  } catch (error) {
    console.error("Failed to get best score from localStorage:", error);
    return 0;
  }
}

function setBestScore(newBest) {
  try {
    localStorage.setItem("bestScore", newBest.toString());
  } catch (error) {
    console.error("Failed to save best score to localStorage:", error);
  }
}

function loadBestScore() {
  try {
    const best = getBestScore();
    if (bestscorevalElement) {
      bestscorevalElement.textContent = best;
    }
  } catch (error) {
    console.error("Failed to load best score:", error);
  }
}

function startTimer() {
  try {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
      if (timer > 0 && playing) {
        timer--;
        if (timervalElement) {
          timervalElement.textContent = timer;
        }
      } else {
        // Game over
        clearInterval(timerInterval);
        playing = false;
        showGameOverScreen();
      }
    }, 1000);
  } catch (error) {
    console.error("Failed to start timer:", error);
  }
}

function showGameOverScreen() {
  try {
    if (!pbtmElement) {
      throw new Error("Game area element not found");
    }

    const finalScore = score;
    const bestScore = getBestScore();
    const isNewBest = finalScore > bestScore;

    pbtmElement.innerHTML = `
      <div id="gameover-screen" class="fade-in">
        <h1>Game Over</h1>
        <p>Your final score is</p>
        <div class="final-score">${finalScore}</div>
        ${isNewBest ? '<p class="new-best">🎉 New Best Score! 🎉</p>' : ""}
        <p class="message">Great effort! Try again to beat your best score!</p>
        <button id="restart-btn" aria-label="Restart the game">Restart Game</button>
        <div class="confetti"></div>
      </div>
    `;
  } catch (error) {
    console.error("Failed to show game over screen:", error);
  }
}

// Initialize click handler after DOM is ready
function initializeClickHandler() {
  try {
    if (!pbtmElement) {
      throw new Error("Game area element not found");
    }

    // Unified click handler for bubbles and restart button
    pbtmElement.addEventListener("click", function (e) {
      const el = e.target;

      // Handle restart button click
      if (el && el.id === "restart-btn") {
        init();
        return;
      }

      // Handle bubble clicks (only when game is playing)
      if (!playing || !el.classList.contains("bubble")) return;

      const val = Number(el.textContent);
      if (val === target) {
        // Correct bubble clicked
        el.style.animation = "pop 0.3s forwards";
        addScore(10);
        setTimeout(() => {
          makeBubbles();
          newTarget();
        }, 300);
      } else {
        // Wrong bubble clicked
        addScore(-20);
        el.classList.add("wrong");
        setTimeout(() => {
          el.classList.remove("wrong");
        }, 300);
      }
    });
  } catch (error) {
    console.error("Failed to initialize click handler:", error);
  }
}

function init() {
  try {
    // Reset game state
    timer = 60;
    score = 0;
    playing = true;

    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Update UI elements
    if (scorevalElement) {
      scorevalElement.textContent = score;
    }
    if (timervalElement) {
      timervalElement.textContent = timer;
    }

    // Initialize game
    makeBubbles();
    newTarget();
    updateBestScore();
    startTimer();
  } catch (error) {
    console.error("Failed to initialize game:", error);
  }
}

// Keyboard accessibility support
function initializeKeyboardSupport() {
  try {
    document.addEventListener("keydown", function (e) {
      // Only handle keyboard events when game is playing
      if (!playing) return;

      // Handle number keys (0-9)
      if (e.key >= "0" && e.key <= "9") {
        const targetNumber = parseInt(e.key);
        if (targetNumber === target) {
          // Find and click the first matching bubble
          const bubbles = document.querySelectorAll(".bubble");
          for (let bubble of bubbles) {
            if (parseInt(bubble.textContent) === targetNumber) {
              bubble.click();
              break;
            }
          }
        } else {
          // Wrong number pressed - find a bubble with that number and show wrong feedback
          const bubbles = document.querySelectorAll(".bubble");
          for (let bubble of bubbles) {
            if (parseInt(bubble.textContent) === targetNumber) {
              bubble.classList.add("wrong");
              addScore(-20);
              setTimeout(() => {
                bubble.classList.remove("wrong");
              }, 300);
              break;
            }
          }
        }
      }

      // Handle Enter key for restart button
      if (e.key === "Enter" && e.target && e.target.id === "restart-btn") {
        e.target.click();
      }
    });
  } catch (error) {
    console.error("Failed to initialize keyboard support:", error);
  }
}
