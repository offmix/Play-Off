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
  },
  {
    id: 21,
    title: "Burnin' Rubber 5 XS",
    genre: 'racing',
    path: "Games/Burnin' Rubber 5 XS.html",
    thumb: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20360%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23182642%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23246c78%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22640%22%20height%3D%22360%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22320%22%20cy%3D%22180%22%20r%3D%2274%22%20fill%3D%22%23fff%22%20fill-opacity%3D%22.12%22%2F%3E%3Cpath%20d%3D%22M270%20168h22m-11-11v22m49-9h.1m18%200h.1%22%20stroke%3D%22%23fff%22%20stroke-width%3D%2210%22%20stroke-linecap%3D%22round%22%2F%3E%3Ctext%20x%3D%22320%22%20y%3D%22270%22%20fill%3D%22%23fff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20text-anchor%3D%22middle%22%3EPLAY%3C%2Ftext%3E%3C%2Fsvg%3E"

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
