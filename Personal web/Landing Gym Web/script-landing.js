const countdownDuration = 60 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

// Calculate the target time (current time + countdown duration)
const countdownTime = new Date().getTime() + countdownDuration;

function updateTimer() {
  const now = new Date().getTime(); // Get current time
  const timeLeft = countdownTime - now; // Calculate time difference

  // Check if the time left is greater than zero
  if (timeLeft > 0) {
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Update the timer values in the HTML
    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  } else {
    // If the countdown has ended, display "00:00:00:00"
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
  }
}

// Call the updateTimer function every second
setInterval(updateTimer, 1000);

// Get all modal and button elements
const openModalBtns = document.querySelectorAll(".openModalBtn");
const modals = document.querySelectorAll(".modal");
const closeBtns = document.querySelectorAll(".close-btn");

// Open the correct modal when button is clicked
openModalBtns.forEach((button, index) => {
  button.addEventListener("click", () => {
    modals[index].style.display = "block";
  });
});

// Close the correct modal when the 'x' button is clicked
closeBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    modals[index].style.display = "none";
  });
});

// Close the modal if the user clicks outside the modal content
window.addEventListener("click", (event) => {
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

