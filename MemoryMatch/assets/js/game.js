(function () {
  const ICONS = ["🍎","🍌","🍇","🍉","🍓","🍒","🥝","🍍"];
  const gridEl = document.getElementById('grid');
  const movesEl = document.getElementById('moves');
  const matchesEl = document.getElementById('matches');
  const messageEl = document.getElementById('message');
  const resetBtn = document.getElementById('resetBtn');

  let cardsData = [];
  let flipped = [];
  let matchedCount = 0;
  let moves = 0;
  let lock = false;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildGame() {
    cardsData = shuffle([...ICONS, ...ICONS]);
    flipped = [];
    matchedCount = 0;
    moves = 0;
    lock = false;
    movesEl.textContent = 0;
    matchesEl.textContent = 0;
    messageEl.textContent = "";
    gridEl.innerHTML = "";

    cardsData.forEach((icon, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.index = idx;
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-back"></div>
          <div class="card-face card-front">${icon}</div>
        </div>
      `;
      card.addEventListener('click', () => handleFlip(card, idx));
      gridEl.appendChild(card);
    });
  }

  function handleFlip(card, idx) {
    if (lock) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flipped.length === 2) return;

    card.classList.add('flipped');
    flipped.push({ card, idx });

    if (flipped.length === 2) {
      moves++;
      movesEl.textContent = moves;
      lock = true;

      const [first, second] = flipped;
      if (cardsData[first.idx] === cardsData[second.idx]) {
        setTimeout(() => {
          first.card.classList.add('matched');
          second.card.classList.add('matched');
          matchedCount++;
          matchesEl.textContent = matchedCount;
          flipped = [];
          lock = false;
          if (matchedCount === ICONS.length) {
            messageEl.textContent = "🎉 Solved in " + moves + " moves!";
          }
        }, 400);
      } else {
        setTimeout(() => {
          first.card.classList.remove('flipped');
          second.card.classList.remove('flipped');
          flipped = [];
          lock = false;
        }, 800);
      }
    }
  }

  resetBtn.addEventListener('click', buildGame);
  buildGame();
})();