const piecesContainer = document.getElementById('pieces');
const board = document.getElementById('board');
const message = document.getElementById('message');
const replayButton = document.getElementById('replay');
const resetButton = document.getElementById('reset');

const images = [
  'rose-flower.jpg',
  'photo-rose.jpeg',
  'rose bicolore.jpg',
  'rose clair.webp',
  'rosebleu.jpg',
  'rosejaune.jpg',
  'rose-noire.jpeg',
];
let currentImageIndex = 0;

function getCurrentImage() {
  return images[currentImageIndex];
}

function createPuzzle() {
  piecesContainer.innerHTML = '';
  board.innerHTML = '';
  message.textContent = '';

  const positions = [];
  for (let i = 0; i < 9; i++) positions.push(i);

  positions.sort(() => Math.random() - 0.5);

  positions.forEach((pos) => {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    
    piece.style.backgroundImage = `url('${getCurrentImage()}')`;
    piece.style.backgroundPosition = `${-(pos % 3) * 100}px ${-Math.floor(pos / 3) * 100}px`;
    piece.setAttribute('draggable', true);
    piece.dataset.position = pos;
    piecesContainer.appendChild(piece);
  });

  for (let i = 0; i < 9; i++) {
    const zone = document.createElement('div');
    zone.classList.add('drop-zone');
    zone.dataset.correct = i;
    board.appendChild(zone);
  }
}

let draggedPiece = null;

document.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('piece')) {
    draggedPiece = e.target;
  }
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  if (e.target.classList.contains('drop-zone')) {
    e.target.innerHTML = ''; 
    e.target.appendChild(draggedPiece);

    checkWin();
  }
});

function checkWin() {
  const zones = document.querySelectorAll('.drop-zone');
  let correct = 0;

  zones.forEach((zone) => {
    const piece = zone.querySelector('.piece');
    if (piece && piece.dataset.position == zone.dataset.correct) {
      correct++;
    }
  });

  if (correct === 9) {
    message.textContent = "🎉 Bravo, puzzle terminé !";
    
    setTimeout(() => {
      
      currentImageIndex = (currentImageIndex + 1) % images.length;
      message.textContent = " Nouvelle image — on recommence !";
      
      createPuzzle();
    }, 1200);
  }
}

replayButton.addEventListener('click', () => {

  
  const introForm = document.getElementById('intro-form');
  const puzzleArea = document.getElementById('puzzle-area');

  if (introForm && puzzleArea) {
    
    puzzleArea.style.display = 'none';
    introForm.style.display = '';
    message.textContent = '';
    if (resetButton) resetButton.style.display = 'none';
    
  } else {
    
    message.textContent = '';
    createPuzzle();
  }
});

const introForm = document.getElementById('intro-form');
const startBtn = document.getElementById('start-puzzle');
const puzzleArea = document.getElementById('puzzle-area');

if (startBtn && introForm && puzzleArea) {
  
  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const name = nameInput ? nameInput.value.trim() : '';
    const emailInput = document.getElementById('email');
    const email = emailInput ? emailInput.value.trim() : '';

    
    const emailLettersOnly = /^[A-Za-z]+@([A-Za-z]+\.)+[A-Za-z]{2,}$/;

    if (!name) {
      
      alert("Merci d'indiquer ton nom pour commencer.");
      if (nameInput) nameInput.focus();
      return;
    }

    
    if (email) {
      if (!emailLettersOnly.test(email)) {
        alert("L'email doit être composé uniquement de lettres (ex: prenom@domaine.com). Merci de corriger.");
        if (emailInput) emailInput.focus();
        return;
      }
    }

    
    introForm.style.display = 'none';
    puzzleArea.style.display = '';

    
    message.textContent = `Bienvenue ${name} ! Bon puzzle 😊`;
    
    if (resetButton) resetButton.style.display = '';
    createPuzzle();
  });
} else {
   
  createPuzzle();
  
  if (resetButton) resetButton.style.display = '';
}

if (resetButton) {
  resetButton.addEventListener('click', () => {
    message.textContent = '🔁 Puzzle réinitialisé';
    createPuzzle();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    const puzzleAreaEl = document.getElementById('puzzle-area');
    if (puzzleAreaEl && getComputedStyle(puzzleAreaEl).display !== 'none') {
      message.textContent = '🔁 Puzzle réinitialisé (touche R)';
      createPuzzle();
    }
  }
});