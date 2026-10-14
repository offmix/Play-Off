const games = [
  {
    id: 1,
    title: 'Brawl Stars',
    genre: 'action',
    path: 'Games/Brawl%20Stars.html',
    thumb: 'https://www.4gamer.net/games/384/G038494/20181213131/TN/001.jpg'
  },
  {
    id: 2,
    title: 'Drift Hunters',
    genre: 'racing',
    path: 'Games/Drift%20Hunters.html',
    thumb: 'https://imgs.crazygames.com/games/drift-hunters/cover-1656950639575.png?metadata=none&quality=100&width=1200&height=630&fit=crop'
  },
  {
    id: 3,
    title: 'Geometry Dash',
    genre: 'action',
    path: 'Games/Geometry%20Dash.html',
    thumb: 'https://imgs.crazygames.com/games/geometry-dash-online/cover_16x9-1732744370399.png?metadata=none&quality=60&height=7089'
  },
  {
    id: 4,
    title: 'Madalin Stunt Cars 2',
    genre: 'racing',
    path: 'Games/Madalin%20Stunt%20Cars%202',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNO5-ZGXM41qjQ_UwUKrS35OyZrHkyiFTr4rGHHO-HUQ&s=10'
  },
  {
    id: 5,
    title: 'Madalin Stunt Cars 3',
    genre: 'racing',
    path: 'Games/Madalin%20Stunt%20Cars%203.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSllDuVPEWFXX8xdCdDT5u3YfDu7bJacPQMDdrvEcRIMA&s=10'
  },
  {
    id: 6,
    title: 'Real Flight Simulator',
    genre: 'simulator',
    path: 'Games/RFS.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRitjB3E8W0JDsmXv8Y3MDUdSRuKVqbQQG63dGX3mkNNg&s=10'
  },
  {
    id: 7,
    title: 'Slope',
    genre: 'action',
    path: 'Games/Slope.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkrvwXmhXpn8cnl3DMr54X1FdOt3qb-g2A3yOh8Pn-xw&s=10'
  },
  {
    id: 8,
    title: 'Slope 2 Player',
    genre: 'action',
    path: 'Games/Slope 2 Player.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCIyOlCeQ_dhbh7Q0gL2jZJ0tkhFSc0aOJhO4EowcZHw&s'
  },
  {
    id: 9,
    title: 'Slope 3',
    genre: 'action',
    path: 'Games/Slope3.html',
    thumb: 'https://slopegame.net/data/image/game/slope-3.jpg'
  },
  {
    id: 10,
    title: 'Survivor.io',
    genre: 'iogame',
    path: 'Games/Survivor.io.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvuruXdzy2W6gxRCsvJUmSOnqOC--IASAyZFsRmnakQA&s=10'
  },
  {
    id: 11,
    title: 'GTA Vice City',
    genre: 'action',
    path: 'Games/GTA%20Vice%20City.html',
    thumb: 'https://m.media-amazon.com/images/I/81ZbKIAivOL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    id: 12,
    title: 'Paper.io',
    genre: 'iogame',
    path: 'Games/Paperio.html',
    thumb: 'https://paperio3d.org//data/image/game/paper-io-favicon.jpg'
  },
  {
    id: 13,
    title: 'Cookie Clicker',
    genre: 'casual',
    path: 'Games/CookieClicker.html',
    thumb: 'https://g.hebi.gg/cookie-clicker/cookie-clicker.jpg'
  },
  {
    id: 14,
    title: 'UnderTale',
    genre: 'casual',
    path: 'Games/Undertale.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg50zBrs6KuLnjGh0HoUCeBRySQtb_XBbUy_a0glzDV6mE6_sVVGSbSr3N&s=10'
  },
  {
    id: 15,
    title: 'Slither.io',
    genre: 'iogame',
    path: 'Games/Slither.io.html',
    thumb: 'https://imgs.crazygames.com/games/slitherio/cover-1587331280441.png?format=auto&quality=100&metadata=none&width=1200'
  },
  {
    id: 16,
    title: 'Block Blast',
    genre: 'casual',
    path: 'Games/Block Blast.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgIb7d5_g-i_ouK7U45WmMLRUCIUgEAR_5mfnxCBHvTg&s=10'
  },
  {
    id: 17,
    title: 'R.E.P.O',
    genre: 'action',
    path: 'Games/REPO.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDRgAxCe4WV_w3YhvKJxUmZn7hV_8yHmGulR1MXsoNqQ&s=10'
  },
  {
    id: 18,
    title: 'Snow.io',
    genre: 'action',
    path: 'Games/Snow.io.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtBX44GQvtdN4XRC-WirHMgiexZD_Zb-Hjh9iESyvGTw&s=10'
  },
  {
    id: 19,
    title: 'Snowride',
    genre: 'casual',
    path: 'Games/Snowride.html',
    thumb: 'https://imgs.crazygames.com/snow-rider-3d_16x9/20260120063434/snow-rider-3d_16x9-cover?metadata=none&quality=60&height=6212'
  },
  {
    id: 20,
    title: 'ちいかわパズル',
    genre: 'puzzle',
    path: 'Games/Chikawa.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbLUytF6Ea310R05pGmYL_icBYC5kdC2D7ehYNpkGSuA&s'
  }
  {
    id: 21,
    title: 'Burnin' Rubber 5 XS',
    genre: 'racing',
    path: 'Games/Burnin' Rubber 5 XS.html',
    thumb: 'data:image/jpeg;base64,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'
  }
];

const allGamesContainer = document.getElementById('allGamesContainer');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const noResults = document.getElementById('noResults');

let currentGenre = 'all';

const genreLabels = {
  action: 'アクション',
  racing: 'レーシング',
  casual: 'カジュアル',
  simulator: 'シミュレーター',
  iogame: 'ioゲーム',
  puzzle: 'パズル'
};

function getGenreLabel(genre) {
  return genreLabels[genre] || 'その他';
}

function createGameCard(game) {
  return `
    <a href="${game.path}" class="game-card" target="_blank" rel="noopener noreferrer" aria-label="${game.title}をプレイ">
      <div class="game-thumbnail" style="background-image: url('${game.thumb}');"></div>
      <div class="game-info">
        <h2 class="game-title">${game.title}</h2>
        <span class="game-genre">${getGenreLabel(game.genre)}</span>
        <div class="game-footer">
          <span class="game-meta">Play</span>
          <button class="play-button" type="button" aria-label="${game.title}を開始">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor"></path>
            </svg>
          </button>
        </div>
      </div>
    </a>
  `;
}

function filterAndDisplayGames() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filtered = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm) ||
      getGenreLabel(game.genre).includes(searchTerm);

    const matchesGenre = currentGenre === 'all' || game.genre === currentGenre;

    return matchesSearch && matchesGenre;
  });

  if (filtered.length === 0) {
    allGamesContainer.innerHTML = '';
    noResults.style.display = 'flex';
    return;
  }

  noResults.style.display = 'none';

  if (currentGenre === 'all') {
    const grouped = {};
    Object.keys(genreLabels).forEach((genre) => {
      grouped[genre] = [];
    });

    filtered.forEach((game) => {
      if (grouped[game.genre]) {
        grouped[game.genre].push(game);
      }
    });

    let html = '';
    Object.entries(grouped).forEach(([genre, genreGames]) => {
      if (genreGames.length > 0) {
        html += `
          <div class="genre-section">
            <div class="genre-header">
              <h2 class="genre-title">${getGenreLabel(genre)}</h2>
              <div class="genre-divider"></div>
            </div>
            <div class="games-grid">
              ${genreGames.map(createGameCard).join('')}
            </div>
          </div>
        `;
      }
    });

    allGamesContainer.innerHTML = html;
  } else {
    const html = `
      <div class="genre-section">
        <div class="genre-header">
          <h2 class="genre-title">${getGenreLabel(currentGenre)}</h2>
          <div class="genre-divider"></div>
        </div>
        <div class="games-grid">
          ${filtered.map(createGameCard).join('')}
        </div>
      </div>
    `;
    allGamesContainer.innerHTML = html;
  }
}

searchInput.addEventListener('input', filterAndDisplayGames);

categoryBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentGenre = btn.dataset.genre;
    filterAndDisplayGames();
  });
});

filterAndDisplayGames();
