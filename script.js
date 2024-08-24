const wordPopularity = {
  'One Piece': 95,
  'Naruto': 93,
  'Mbappe': 89,
  'Haaland': 87,
  'Robert Downey Jr.': 92,
  'Chris Evans': 91,
  'Doja Cat': 88,
  'Sabrina Carpenter': 81
};

const words = [
  // Adding local images for each word
  { word1: 'One Piece', word2: 'Naruto', word1Image: 'images/one-piece.jpeg', word2Image: 'images/naruto.jpeg' },
  { word1: 'Mbappe', word2: 'Haaland', word1Image: 'images/mbappe.jpeg', word2Image: 'images/haaland.jpg' },
  { word1: 'Robert Downey Jr.', word2: 'Chris Evans', word1Image: 'images/rdj.jpg', word2Image: 'images/chris-evans.jpeg' },
  { word1: 'Doja Cat', word2: 'Sabrina Carpenter', word1Image: 'images/doja-cat.jpeg', word2Image: 'images/sabrina.jpeg' }
];

let shuffledWords = [];
let currentWordPair = {};
let score = 0;
let timerInterval;
let timeLeft = 15;

// Function to shuffle the word pairs
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to start the game
function startGame() {
  // Reset the timer and UI elements
  timeLeft = 15;
  document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;
  document.getElementById('result').innerText = '';

  // Hide popularity scores before the player chooses
  document.getElementById('word1-popularity').style.visibility = 'hidden';
  document.getElementById('word2-popularity').style.visibility = 'hidden';

  // Check if there are any words left in the shuffled list
  if (shuffledWords.length === 0) {
    document.getElementById('result').innerText = 'Game Over! Please Restart the Game.';
    return;
  }

  // Pick the next word pair from the shuffled list
  currentWordPair = shuffledWords.pop();

  // Get the popularity of the words (but don't show it yet)
  const word1Popularity = wordPopularity[currentWordPair.word1];
  const word2Popularity = wordPopularity[currentWordPair.word2];

  // Update the UI with the new words and images
  document.getElementById('word1-text').innerText = currentWordPair.word1;
  document.getElementById('word2-text').innerText = currentWordPair.word2;
  document.getElementById('word1-image').src = currentWordPair.word1Image;
  document.getElementById('word2-image').src = currentWordPair.word2Image;

  // Prepare to display the popularity after the choice
  document.getElementById('word1-popularity').innerText = `Popularity: ${word1Popularity}`;
  document.getElementById('word2-popularity').innerText = `Popularity: ${word2Popularity}`;

  // Start the countdown timer
  clearInterval(timerInterval);  // Clear any previous interval
  timerInterval = setInterval(updateTimer, 1000);
}

// Function to update the timer
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;
  } else {
    // Time's up, answer is incorrect by default
    clearInterval(timerInterval);
    document.getElementById('result').innerText = 'Time\'s Up! Incorrect!';
    // Reveal the popularity numbers after time's up
    document.getElementById('word1-popularity').style.visibility = 'visible';
    document.getElementById('word2-popularity').style.visibility = 'visible';
    // Move to the next round automatically after a short delay
    setTimeout(startGame, 2000);
  }
}

// Function to handle the player's choice
function chooseWord(chosenWord) {
  clearInterval(timerInterval); // Stop the timer

  const word1 = currentWordPair.word1;
  const word2 = currentWordPair.word2;
  const word1Popularity = wordPopularity[word1];
  const word2Popularity = wordPopularity[word2];

  let result = '';
  if (chosenWord === 'word1' && word1Popularity > word2Popularity) {
    result = 'Correct!';
    score++;
  } else if (chosenWord === 'word2' && word2Popularity > word1Popularity) {
    result = 'Correct!';
    score++;
  } else {
    result = 'Incorrect!';
  }

  // Display the result and update the score
  document.getElementById('result').innerText = result;
  document.getElementById('score').innerText = `Score: ${score}`;

  // Reveal the popularity numbers after the choice is made
  document.getElementById('word1-popularity').style.visibility = 'visible';
  document.getElementById('word2-popularity').style.visibility = 'visible';

  // Move to the next round after a short delay
  setTimeout(startGame, 2000);
}

// Function to restart the game
function restartGame() {
  // Reset the game state
  shuffledWords = [...words];
  shuffleArray(shuffledWords); // Shuffle the word pairs
  score = 0;

  document.getElementById('score').innerText = `Score: ${score}`;
  document.getElementById('result').innerText = '';

  // Start the first round
  startGame();
}

// Start the game for the first time when the page loads
restartGame();
