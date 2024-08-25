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
  { word1: 'One Piece', word2: 'Naruto', word1Image: 'images/onepiece.jpeg', word2Image: 'images/naruto.jpeg' },
  { word1: 'Mbappe', word2: 'Haaland', word1Image: 'images/mbappe.jpeg', word2Image: 'images/haaland.jpg' },
  { word1: 'Robert Downey Jr.', word2: 'Chris Evans', word1Image: 'images/rdj.jpg', word2Image: 'images/chris-evans.jpeg' },
  { word1: 'Doja Cat', word2: 'Sabrina Carpenter', word1Image: 'images/doja-cat.jpeg', word2Image: 'images/sabrina.jpeg' }
];

let leaderboard = {};
let playerName = '';
let score = 0;
let timeLeft = 15;
let timerInterval;
let shuffledWords = [];
let currentWordPair = {};

// Load the leaderboard from localStorage
function loadLeaderboard() {
  const storedLeaderboard = localStorage.getItem('leaderboard');
  if (storedLeaderboard) {
    leaderboard = JSON.parse(storedLeaderboard);
  }
}

// Save the leaderboard to localStorage
function saveLeaderboard() {
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Start the game
function startGame() {
  playerName = document.getElementById('player-name').value.trim();

  if (!playerName) {
    alert("Please enter your name.");
    return;
  }

  document.getElementById('player-input').classList.add('hidden');
  document.getElementById('game-content').classList.remove('hidden');

  score = 0;
  shuffledWords = [...words];
  shuffleArray(shuffledWords);

  loadLeaderboard();
  updateLeaderboard();
  
  nextRound();
}

// Update the leaderboard
function updateLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard-list');
  leaderboardList.innerHTML = '';
  Object.keys(leaderboard)
    .sort((a, b) => leaderboard[b] - leaderboard[a])
    .forEach(player => {
      const li = document.createElement('li');
      li.innerText = `${player}: ${leaderboard[player]}`;
      leaderboardList.appendChild(li);
    });
}

// Load the next round
function nextRound() {
  if (shuffledWords.length === 0) {
    endGame();  // Call endGame when rounds are done
    return;
  }

  currentWordPair = shuffledWords.pop();
  const correctOnLeft = Math.random() < 0.5;

  const word1Text = correctOnLeft ? currentWordPair.word1 : currentWordPair.word2;
  const word2Text = correctOnLeft ? currentWordPair.word2 : currentWordPair.word1;
  const word1Image = correctOnLeft ? currentWordPair.word1Image : currentWordPair.word2Image;
  const word2Image = correctOnLeft ? currentWordPair.word2Image : currentWordPair.word1Image;

  document.getElementById('word1-text').innerText = word1Text;
  document.getElementById('word2-text').innerText = word2Text;
  document.getElementById('word1-image').src = word1Image;
  document.getElementById('word2-image').src = word2Image;

  currentWordPair.correctOnLeft = correctOnLeft;

  document.getElementById('word1-popularity').style.visibility = 'hidden';
  document.getElementById('word2-popularity').style.visibility = 'hidden';

  timeLeft = 15;
  document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

// Update the timer during the game round
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;
  } else {
    clearInterval(timerInterval);
    document.getElementById('result').innerText = 'Time\'s up! Incorrect!';
    setTimeout(nextRound, 2000);
  }
}

// Handle when the player chooses a word
function chooseWord(selectedWord) {
  clearInterval(timerInterval);

  const isCorrect = (selectedWord === 'word1' && currentWordPair.correctOnLeft) || 
                    (selectedWord === 'word2' && !currentWordPair.correctOnLeft);

  document.getElementById('result').innerText = isCorrect ? 'Correct!' : 'Incorrect!';
  if (isCorrect) score++;

  document.getElementById('score').innerText = `Score: ${score}`;
  
  const word1Popularity = currentWordPair.correctOnLeft ? wordPopularity[currentWordPair.word1] : wordPopularity[currentWordPair.word2];
  const word2Popularity = currentWordPair.correctOnLeft ? wordPopularity[currentWordPair.word2] : wordPopularity[currentWordPair.word1];

  document.getElementById('word1-popularity').innerText = `Popularity: ${word1Popularity}`;
  document.getElementById('word2-popularity').innerText = `Popularity: ${word2Popularity}`;
  document.getElementById('word1-popularity').style.visibility = 'visible';
  document.getElementById('word2-popularity').style.visibility = 'visible';

  setTimeout(() => {
    document.getElementById('result').innerText = '';
    nextRound();
  }, 2000);
}

// End the game and show the final score
function endGame() {
  leaderboard[playerName] = score;
  saveLeaderboard();
  updateLeaderboard();

  // Hide the game content and show the game-over section
  document.getElementById('game-content').classList.add('hidden');
  document.getElementById('game-over').classList.add('visible'); // Show game-over section
  document.getElementById('final-score').innerText = `Congratulations! Your final score is ${score}`;
}

// Restart the game
function restartGame() {
  // Hide the game-over section and reset the game
  document.getElementById('game-over').classList.remove('visible'); // Hide game-over section
  document.getElementById('player-input').classList.remove('hidden'); // Show player input screen
  document.getElementById('player-name').value = ''; // Clear player name input
  score = 0;
  updateLeaderboard();
}


// Event listeners for word clicks and buttons
document.getElementById('word1').addEventListener('click', () => chooseWord('word1'));
document.getElementById('word2').addEventListener('click', () => chooseWord('word2'));
document.getElementById('play-again').addEventListener('click', restartGame);
document.getElementById('start-game').addEventListener('click', startGame);

// Global event listener for "Enter" key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    // Check which screen is active
    if (!document.getElementById('player-input').classList.contains('hidden')) {
      // If on the player input screen, start the game
      startGame();
    } else if (!document.getElementById('game-over').classList.contains('hidden')) {
      // If on the game over screen, restart the game
      restartGame();
    }
  }
});

