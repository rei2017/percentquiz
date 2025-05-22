let x, y, correctPercent;
let currentQuestion = 0;
let correctCount = 0;

// Helper: Round to 2 significant figures using your rules
function roundTo2SigFigs(num) {
  if (num < 10) return Number(num.toFixed(1));
  else if (num < 100) return Math.round(num);
  else return Math.round(num / 10) * 10;
}

// Main function to generate new question
function generateQuestion() {
  // Stop generating if we've already done 10 questions
  if (currentQuestion >= 10) return;

  // Generate X
  let base = Math.pow(10, Math.random() * 3);
  x = roundTo2SigFigs(base);

  // Generate Y with random percent increase between 1% and ~31.6%
  let percentIncrease, rawY;
  do {
    const factor = Math.pow(10, Math.random() * 1.5); // 10^U[0,1.5]
    percentIncrease = factor / 100; // Convert to 0.01 to ~0.316
    rawY = x * (1 + percentIncrease);
    y = roundTo2SigFigs(rawY);
  } while (y <= x); // Make sure Y is meaningfully larger

  // Calculate percent difference
  correctPercent = ((y - x) / x) * 100;

  // Update interface
  document.getElementById("question").textContent = `${x} → ${y}`;
  document.getElementById("subtext").textContent = "estimate percent change";
  document.getElementById("answer").value = "";
  document.getElementById("answer").disabled = false;
  document.getElementById("answer").focus();
  document.querySelectorAll("button").forEach(btn => btn.disabled = false);

  // Update question counter (e.g., "Question 4 of 10")
  document.getElementById("score").textContent = `Question ${currentQuestion + 1} of 10`;

  // Update current score display at bottom (e.g., "Score: 2/3")
  document.getElementById("finalScore").textContent = `Score: ${correctCount}/${currentQuestion}`;
}

// Check the user's input
function checkAnswer() {
  const inputEl = document.getElementById("answer");
  const value = inputEl.value.trim();

  // Don't proceed if input is empty
  if (value === "") return;

  const userInput = Number(value);
  if (isNaN(userInput)) {
    document.getElementById("result").textContent = "❌ Please enter a valid number.";
    return;
  }

  // Check if within ±12% of the correct percentage
  const lowerBound = correctPercent * 0.88;
  const upperBound = correctPercent * 1.12;
  const isCorrect = userInput >= lowerBound && userInput <= upperBound;
  const roundedAnswer = correctPercent.toFixed(1);

  if (isCorrect) {
    correctCount++;
    document.getElementById("result").textContent = `✅ Correct, that is within 12% of ${roundedAnswer}%`;
  } else {
    document.getElementById("result").textContent = `❌ Sorry, answer is ${roundedAnswer}%`;
  }

  currentQuestion++;

  // Update score at bottom after this round
  document.getElementById("finalScore").textContent = `Score: ${correctCount}/${currentQuestion}`;

  // End game if 10 questions reached
  if (currentQuestion === 10) {
    document.getElementById("score").textContent = `🎉 Great job! You got ${correctCount} out of 10 correct!`;
    document.getElementById("question").textContent = "🎯 Quiz Complete!";
    document.getElementById("subtext").textContent = "";
    document.getElementById("answer").disabled = true;
    document.querySelectorAll("button").forEach(btn => btn.disabled = true);
  }
}

// Startup logic
document.addEventListener("DOMContentLoaded", () => {
  generateQuestion();

  // Pressing Enter submits, but only if there's a value
  document.getElementById("answer").addEventListener("keypress", function(event) {
    if (event.key === "Enter" && this.value.trim() !== "") {
      checkAnswer();
    }
  });

  // Ctrl+Enter skips to next question (only if quiz not done)
  document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "Enter" && currentQuestion < 10) {
      generateQuestion();
    }
  });
});
