let GameState = {
  season: 2026,
  stageIndex: 0,
  userTeamId: null,
  teams: [],
  players: [],
  coaches: [],
  academyProspects: [], // Pibes de 12 a 15 años (GC2/GC3/SSL) descubiertos o cargados
  customNameQueue: [],  // Cola de nombres escritos por el usuario esperando aparecer
  nationalTables: {},   // Tablas simuladas de Liga Argentina, Chilena, etc.
  news: [],
  currentOpponentId: null,
  selectedCompView: "rlcs_regional"
};

// INICIALIZACIÓN
window.onload = () => {
  document.getElementById("hero-logo").innerHTML = Graphics.renderTrophy("rlcs_worlds", 68);
  updateCustomCrestPreview();
  renderSetupTeams();
  if (localStorage.getItem("rl_career_save_v1")) {
    document.getElementById("btn-continue-save").style.display = "inline-block";
  }
};

function switchSetupTab(tab) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".setup-panel").forEach(p => p.classList.remove("active"));
  event.target.classList.add("active");
  document.getElementById("setup-" + tab).classList.add("active");
}

function renderSetupTeams() {
  const filter = document.getElementById("setup-region-filter").value;
  const grid = document.getElementById("setup-team-grid");
  grid.innerHTML = "";

  InitialData.teams
    .filter(t => filter === "ALL" || t.region === filter)
    .forEach(team => {
      const roster = InitialData.players.filter(p => p.teamId === team.id);
      const avgOvr = Math.round(roster.reduce((a, b) => a + b.ovr, 0) / (roster.length || 1));
      const card = document.createElement("div");
      card.className = "team-select-card";
      card.innerHTML = `
        ${Graphics.renderCrest(team, 62)}
        <h3>${team.name}</h3>
        <span class="badge">${team.region} • OVR ${avgOvr}</span>
        <div class="roster-mini">${roster.map(p => p.name).join(" • ")}</div>
      `;
      card.onclick = () => startCareer(team.id);
      grid.appendChild(card);
    });
}

function updateCustomCrestPreview() {
  const mockTeam = {
    tag: document.getElementById("custom-team-tag").value || "ORG",
    color1: document.getElementById("custom-color-1").value,
    color2: document.getElementById("custom-color-2").value,
    shape: document.getElementById("custom-crest-shape").value,
    logoUrl: document.getElementById("custom-logo-url").value
  };
  document.getElementById("custom-crest-preview").innerHTML = Graphics.renderCrest(mockTeam, 90);
}

function startWithCustomTeam() {
  const name = document.getElementById("custom-team-name").value.trim() || "Custom Esports";
  const tag = document.getElementById("custom-team-tag").value.trim().toUpperCase() || "CST";
  const region = document.getElementById("custom-team-region").value;
  const shape = document.getElementById("custom-crest-shape").value;
  const color1 = document.getElementById("custom-color-1").value;
  const color2 = document.getElementById("custom-color-2").value;
  const logoUrl = document.getElementById("custom-logo-url").value.trim();

  const customTeam = {
    id: "custom_user",
    name, tag, region, color1, color2, shape, logoUrl,
    budget: 180000,
    points: 0
  };

  initBaseState();
  GameState.teams.push(customTeam);
  GameState.userTeamId = "custom_user";

  // Generamos 3 jugadores iniciales para el club fundado
  const regionCountry = { SAM: "AR", EU: "FR", NA: "US", MENA: "SA" }[region] || "AR";
  for (let i = 1; i <= 3; i++) {
    const pName = generateUniqueName();
    GameState.players.push({
      id: "u_init_" + i,
      name: pName,
      country: regionCountry,
      age: 17 + i,
      ovr: 85 + i,
      pot: 90 + i,
      mec: 86 + i,
      rot: 85 + i,
      def: 84 + i,
      teamId: "custom_user",
      starter: true,
      value: 55000
    });
  }

  addNews(`¡${name} (${tag}) debuta oficialmente en la región ${region} de la RLCS!`);
  launchGameUI();
}

function startCareer(teamId) {
  initBaseState();
  GameState.userTeamId = teamId;
  const userTeam = getUserTeam();
  addNews(`Asumiste la dirección deportiva de ${userTeam.name} para la temporada ${GameState.season}.`);
  launchGameUI();
}

function initBaseState() {
  GameState.season = 2026;
  GameState.stageIndex = 0;
  GameState.teams = JSON.parse(JSON.stringify(InitialData.teams));
  GameState.players = JSON.parse(JSON.stringify(InitialData.players));
  GameState.coaches = JSON.parse(JSON.stringify(InitialData.coaches));
  GameState.academyProspects = [];
  GameState.customNameQueue = [];
  GameState.news = [];
  buildNationalTables();
  spawnInitialProspects();
}

function buildNationalTables() {
  GameState.nationalTables = {};
  InitialData.nationalLeagues.forEach(league => {
    GameState.nationalTables[league.id] = league.clubs.map(club => ({
      club,
      pts: Math.floor(Math.random() * 12),
      gf: Math.floor(Math.random() * 20) + 10
    })).sort((a, b) => b.pts - a.pts);
  });
}

function spawnInitialProspects() {
  const starters = [
    { name: "TomyRL", country: "AR", age: 13, rank: "GC3", pot: 95 },
    { name: "Kirox", country: "CL", age: 12, rank: "GC2", pot: 94 },
    { name: "Zynx", country: "FR", age: 14, rank: "SSL", pot: 96 }
  ];
  starters.forEach((s, idx) => {
    GameState.academyProspects.push({
      id: "acad_" + Date.now() + "_" + idx,
      name: s.name,
      country: s.country,
      age: s.age,
      rank: s.rank,
      ovr: s.rank === "SSL" ? 81 : (s.rank === "GC3" ? 77 : 73),
      pot: s.pot,
      loanLeagueId: null,
      loanClub: null,
      scoutedByUser: true
    });
  });
}

function launchGameUI() {
  document.getElementById("setup-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  pickNextOpponent();
  refreshAllUI();
  saveGame(false);
}

// HELPERS
function getUserTeam() {
  return GameState.teams.find(t => t.id === GameState.userTeamId);
}

function getTeamById(id) {
  return GameState.teams.find(t => t.id === id);
}

function getTeamRoster(teamId, onlyStarters = false) {
  return GameState.players.filter(p => p.teamId === teamId && (!onlyStarters || p.starter));
}

function getTeamCoach(teamId) {
  return GameState.coaches.find(c => c.teamId === teamId);
}

function getTeamOvr(teamId) {
  const starters = getTeamRoster(teamId, true);
  if (starters.length === 0) return 75;
  const base = starters.reduce((sum, p) => sum + p.ovr, 0) / starters.length;
  const coach = getTeamCoach(teamId);
  const coachBonus = coach ? (coach.ovr - 80) * 0.15 : 0;
  return Math.round(base + coachBonus);
}

function addNews(text, type = "normal") {
  GameState.news.unshift({ text, type, season: GameState.season });
  if (GameState.news.length > 30) GameState.news.pop();
}

// NAVEGACIÓN DE PESTAÑAS
function switchGameTab(tabId) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".game-tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.nav-btn[data-tab="${tabId}"]`).classList.add("active");
  document.getElementById("tab-" + tabId).classList.add("active");
  refreshAllUI();
}

function refreshAllUI() {
  const team = getUserTeam();
  const stage = InitialData.seasonStages[GameState.stageIndex];
  const ovr = getTeamOvr(team.id);

  document.getElementById("top-club-crest").innerHTML = Graphics.renderCrest(team, 46);
  document.getElementById("top-club-name").textContent = team.name;
  document.getElementById("top-club-meta").textContent = `${team.region} • OVR ${ovr}`;
  document.getElementById("top-season").textContent = GameState.season;
  document.getElementById("top-stage").textContent = stage.name;
  document.getElementById("top-budget").textContent = "$" + team.budget.toLocaleString();
  document.getElementById("top-points").textContent = team.points + " pts";

  renderOffice();
  renderCompetitionView();
  renderSquadAndCoach();
  renderAcademy();
  renderMarket();
  populateEditorTeams();
}

// 1. OFICINA Y PARTIDOS
function pickNextOpponent() {
  const userTeam = getUserTeam();
  const stage = InitialData.seasonStages[GameState.stageIndex];
  let pool = [];

  if (stage.id === "rlcs_regional") {
    pool = GameState.teams.filter(t => t.region === userTeam.region && t.id !== userTeam.id);
  } else {
    // Majors, Worlds, Club WC, FIFAe: rivales internacionales
    pool = GameState.teams.filter(t => t.id !== userTeam.id);
  }

  if (pool.length === 0) pool = GameState.teams.filter(t => t.id !== userTeam.id);
  const opp = pool[Math.floor(Math.random() * pool.length)];
  GameState.currentOpponentId = opp.id;
}

function renderOffice() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId) || GameState.teams[0];
  const stage = InitialData.seasonStages[GameState.stageIndex];

  document.getElementById("next-event-title").textContent = `${stage.name} (${stage.format})`;
  document.getElementById("next-event-trophy").innerHTML = Graphics.renderTrophy(stage.id, 44);

  const isFIFAe = stage.id === "fifae_wc";
  const homeTitle = isFIFAe ? `Selección ${Graphics.countryNames[getTeamRoster(userTeam.id, true)[0]?.country] || "Nacional"}` : userTeam.name;
  const awayTitle = isFIFAe ? `Selección ${Graphics.countryNames[getTeamRoster(opp.id, true)[0]?.country] || "Rival"}` : opp.name;

  document.getElementById("next-match-box").innerHTML = `
    <div class="vs-team">
      ${Graphics.renderCrest(userTeam, 64)}
      <strong>${homeTitle}</strong>
      <span class="badge">OVR ${getTeamOvr(userTeam.id)}</span>
    </div>
    <div class="vs-center">
      <div class="vs-badge">VS</div>
      <div class="muted">${stage.format} • Premio $${stage.prize.toLocaleString()}</div>
    </div>
    <div class="vs-team">
      ${Graphics.renderCrest(opp, 64)}
      <strong>${awayTitle}</strong>
      <span class="badge">OVR ${getTeamOvr(opp.id)}</span>
    </div>
  `;

  const newsEl = document.getElementById("news-feed");
  newsEl.innerHTML = GameState.news.map(n => `
    <div class="news-item ${n.type}">
      <small class="muted">[Temp. ${n.season}]</small> ${n.text}
    </div>
  `).join("");
}

function playNextSeries(instant) {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonStages[GameState.stageIndex];
  const winsNeeded = stage.format === "Bo7" ? 4 : 3;

  let homeWins = 0;
  let awayWins = 0;
  const logs = [];

  const homeOvr = getTeamOvr(userTeam.id);
  const awayOvr = getTeamOvr(opp.id);
  const homeStarters = getTeamRoster(userTeam.id, true);
  const awayStarters = getTeamRoster(opp.id, true);
  const coach = getTeamCoach(userTeam.id);

  // Bono si el coach es Estratega LAN en Majors o Mundiales
  let lanBonus = 0;
  if (coach && coach.specialty.includes("Estratega LAN") && stage.id !== "rlcs_regional") {
    lanBonus = 3;
    logs.push(`<strong>[Coach ${coach.name}]</strong> Prepara la pizarra táctica de LAN (+3 OVR efectivo).`);
  }

  let gameNum = 1;
  while (homeWins < winsNeeded && awayWins < winsNeeded) {
    const diff = (homeOvr + lanBonus) - awayOvr;
    const homeChance = Math.min(0.85, Math.max(0.15, 0.50 + diff * 0.035));
    const homeScores = Math.floor(Math.random() * 4) + 1;
    const awayScores = Math.floor(Math.random() * 4) + 1;

    if (Math.random() < homeChance) {
      homeWins++;
      const g = Math.max(homeScores, awayScores + 1);
      const a = Math.min(awayScores, g - 1);
      const mvp = homeStarters[Math.floor(Math.random() * homeStarters.length)]?.name || "Delantero";
      logs.push(`Juego ${gameNum}: <strong>${userTeam.tag} ${g} - ${a} ${opp.tag}</strong> (Gol clave de ${mvp})`);
    } else {
      awayWins++;
      const g = Math.max(awayScores, homeScores + 1);
      const a = Math.min(homeScores, g - 1);
      const mvp = awayStarters[Math.floor(Math.random() * awayStarters.length)]?.name || "Rival";
      logs.push(`Juego ${gameNum}: ${userTeam.tag} ${a} - ${g} <strong>${opp.tag}</strong> (Anotó ${mvp})`);
    }
    gameNum++;
  }

  const feed = document.getElementById("live-match-feed");
  feed.classList.remove("hidden");
  feed.innerHTML = logs.map(l => `<div>${l}</div>`).join("");

  finalizeSeriesResult(homeWins, awayWins);
}

function openManualResultModal() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonStages[GameState.stageIndex];
  document.getElementById("manual-match-label").textContent = `${userTeam.name} vs ${opp.name} (${stage.format})`;
  document.getElementById("manual-modal").classList.remove("hidden");
}

function closeManualResultModal() {
  document.getElementById("manual-modal").classList.add("hidden");
}

function submitManualResult() {
  const h = parseInt(document.getElementById("manual-score-home").value) || 0;
  const a = parseInt(document.getElementById("manual-score-away").value) || 0;
  closeManualResultModal();
  const feed = document.getElementById("live-match-feed");
  feed.classList.remove("hidden");
  feed.innerHTML = `<div><strong>[Resultado Real Cargado]</strong> Serie finalizada ${h} - ${a}.</div>`;
  finalizeSeriesResult(h, a);
}

function finalizeSeriesResult(homeWins, awayWins) {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonStages[GameState.stageIndex];
  const won = homeWins > awayWins;

  if (won) {
    userTeam.budget += stage.prize;
    userTeam.points += stage.points;
    addNews(`¡Victoria ${homeWins}-${awayWins} ante ${opp.name} en ${stage.name}! Ganaste $${stage.prize.toLocaleString()}.`);
  } else {
    opp.points += stage.points;
    userTeam.budget += Math.round(stage.prize * 0.25);
    addNews(`Caída ${homeWins}-${awayWins} frente a ${opp.name} en ${stage.name}.`);
  }

  // Simular resultados del resto de equipos
  GameState.teams.forEach(t => {
    if (t.id !== userTeam.id && t.id !== opp.id && Math.random() > 0.45) {
      t.points += Math.round(stage.points * 0.7);
    }
  });

  // Progreso de juveniles y actualización de ligas nacionales
  progressAcademyStep();
  updateNationalLeaguesStep();

  // Avanzar etapa o temporada
  GameState.stageIndex++;
  if (GameState.stageIndex >= InitialData.seasonStages.length) {
    advanceNewSeason();
  } else {
    pickNextOpponent();
  }

  refreshAllUI();
  saveGame(false);
}

// 2. COMPETENCIAS Y TABLAS
function selectCompView(compId, btn) {
  GameState.selectedCompView = compId;
  document.querySelectorAll(".comp-pill").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  renderCompetitionView();
}

function renderCompetitionView() {
  const view = document.getElementById("competition-view");
  const compId = GameState.selectedCompView;

  if (compId === "national_leagues") {
    let html = `<h3>Ligas Nacionales de Desarrollo (Destino de Cesiones)</h3><p class="muted">Tus canteranos cedidos ganan experiencia y descubren nuevos talentos locales.</p>`;
    InitialData.nationalLeagues.forEach(league => {
      const table = GameState.nationalTables[league.id] || [];
      html += `
        <h4 style="margin-top:16px;">${Graphics.getFlag(league.country)} ${league.name}</h4>
        <table>
          <thead><tr><th>Pos</th><th>Club</th><th>PJ</th><th>Pts</th></tr></thead>
          <tbody>
            ${table.map((row, i) => `<tr><td>${i + 1}</td><td>${row.club}</td><td>${GameState.stageIndex + 1}</td><td><strong>${row.pts}</strong></td></tr>`).join("")}
          </tbody>
        </table>
      `;
    });
    view.innerHTML = html;
    return;
  }

  if (compId === "fifae_wc") {
    const countries = ["FR", "US", "BR", "SA", "AR", "CL", "GB", "ES"];
    let rows = countries.map(code => {
      const top3 = GameState.players
        .filter(p => p.country === code)
        .sort((a, b) => b.ovr - a.ovr)
        .slice(0, 3);
      const avg = top3.length ? Math.round(top3.reduce((s, p) => s + p.ovr, 0) / top3.length) : 80;
      return { code, top3, avg };
    }).sort((a, b) => b.avg - a.avg);

    view.innerHTML = `
      <div class="card-header">
        <h3>${Graphics.renderTrophy("fifae_wc", 32)} FIFAe World Cup — Selecciones Nacionales</h3>
      </div>
      <p class="muted">Cada país convoca automáticamente a los 3 mejores jugadores de esa nacionalidad.</p>
      <table>
        <thead><tr><th>Selección</th><th>Trío Convocado</th><th>Media</th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td><strong>${Graphics.getFlag(r.code)} ${Graphics.countryNames[r.code]}</strong></td>
              <td>${r.top3.map(p => `${p.name} (${p.ovr})`).join(" • ") || "Sin convocados"}</td>
              <td><span class="badge">OVR ${r.avg}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    return;
  }

  // Tablas de RLCS, Majors, Worlds y Club World Cup
  const titles = {
    rlcs_regional: "Clasificación General RLCS (Puntos de Opens Regionales)",
    paris_major: "Clasificados y Ranking — Paris Major",
    boston_major: "Clasificados y Ranking — Boston Major",
    rlcs_worlds: "Camino al RLCS World Championship",
    club_wc: "Club World Cup — Ranking Mundial de Organizaciones"
  };

  const sortedTeams = [...GameState.teams].sort((a, b) => b.points - a.points || getTeamOvr(b.id) - getTeamOvr(a.id));

  view.innerHTML = `
    <div class="card-header">
      <h3>${Graphics.renderTrophy(compId, 32)} ${titles[compId]}</h3>
    </div>
    <table>
      <thead><tr><th>#</th><th>Equipo</th><th>Región</th><th>OVR</th><th>Puntos RLCS</th></tr></thead>
      <tbody>
        ${sortedTeams.map((t, idx) => `
          <tr class="${t.id === GameState.userTeamId ? "user-row" : ""}">
            <td>${idx + 1}</td>
            <td style="display:flex;align-items:center;gap:8px;">${Graphics.renderCrest(t, 28)} ${t.name}</td>
            <td>${t.region}</td>
            <td>${getTeamOvr(t.id)}</td>
            <td><strong>${t.points} pts</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// 3. PLANTILLA Y COACH
function renderSquadAndCoach() {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  const grid = document.getElementById("squad-list");

  grid.innerHTML = roster.map(p => `
    <div class="player-card ${p.starter ? "starter" : ""}">
      <div class="player-top">
        <strong>${Graphics.getFlag(p.country)} ${p.name}</strong>
        <span class="ovr-pill">${p.ovr}</span>
      </div>
      <div class="muted">${p.age} años • Potencial ${p.pot}</div>
      <div class="stats-mini">
        <div><span>MEC</span><br><strong>${p.mec}</strong></div>
        <div><span>ROT</span><br><strong>${p.rot}</strong></div>
        <div><span>DEF</span><br><strong>${p.def}</strong></div>
      </div>
      <div style="display:flex;gap:6px;margin-top:8px;">
        <button class="btn-secondary btn-sm" onclick="toggleStarter('${p.id}')">${p.starter ? "Titular" : "Hacer Titular"}</button>
        <button class="btn-danger-outline btn-sm" onclick="sellPlayer('${p.id}')">Vender ($${Math.round(p.value * 0.8).toLocaleString()})</button>
      </div>
    </div>
  `).join("");

  const coach = getTeamCoach(userTeam.id);
  const coachBox = document.getElementById("active-coach-box");
  if (coach) {
    coachBox.innerHTML = `
      <div class="player-card starter">
        <div class="player-top">
          <strong>${Graphics.getFlag(coach.country)} ${coach.name}</strong>
          <span class="ovr-pill">${coach.ovr}</span>
        </div>
        <p class="muted" style="margin-top:6px;">${coach.specialty}</p>
        <p class="muted">Salario anual: $${coach.salary.toLocaleString()}</p>
      </div>
    `;
  } else {
    coachBox.innerHTML = `<p class="muted">No tenés Head Coach contratado. Podés fichar uno en la pestaña Mercado.</p>`;
  }
}

function toggleStarter(playerId) {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  const player = roster.find(p => p.id === playerId);
  if (!player) return;

  if (!player.starter) {
    const currentStarters = roster.filter(p => p.starter);
    if (currentStarters.length >= 3) {
      currentStarters[currentStarters.length - 1].starter = false;
    }
    player.starter = true;
  } else {
    player.starter = false;
  }
  refreshAllUI();
}

function sellPlayer(playerId) {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  if (roster.length <= 3) {
    alert("Necesitás al menos 3 jugadores en el equipo para competir.");
    return;
  }
  const p = GameState.players.find(pl => pl.id === playerId);
  const gain = Math.round(p.value * 0.8);
  userTeam.budget += gain;
  p.teamId = null;
  p.starter = false;
  addNews(`Transferiste a ${p.name} por $${gain.toLocaleString()}.`);
  refreshAllUI();
}

// 4. CANTERA, CARGA DE NOMBRES PERSONALIZADOS Y CESIONES
function addCustomProspectNames() {
  const raw = document.getElementById("prospect-names-input").value;
  const country = document.getElementById("custom-prospect-country").value;
  const rankPref = document.getElementById("custom-prospect-rank").value;

  const names = raw.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
  if (names.length === 0) return;

  names.forEach(name => {
    GameState.customNameQueue.push({ name, country, rankPref });
  });

  document.getElementById("prospect-names-input").value = "";
  addNews(`Añadiste ${names.length} nombres a tu lista secreta de scouting juvenil.`, "prodigy");
  // Hacemos aparecer al primero inmediatamente en el radar para que puedas verlo
  triggerProspectDiscovery();
  refreshAllUI();
}

function triggerProspectDiscovery() {
  const countries = ["AR", "CL", "BR", "FR", "US", "SA", "ES", "GB"];
  let name, country, rank, age;

  if (GameState.customNameQueue.length > 0) {
    const custom = GameState.customNameQueue.shift();
    name = custom.name;
    country = custom.country === "RANDOM" ? countries[Math.floor(Math.random() * countries.length)] : custom.country;
    rank = custom.rankPref === "AUTO" ? ["GC2", "GC3", "SSL"][Math.floor(Math.random() * 3)] : custom.rankPref;
  } else {
    name = generateUniqueName();
    country = countries[Math.floor(Math.random() * countries.length)];
    rank = ["GC2", "GC3", "SSL"][Math.floor(Math.random() * 3)];
  }

  age = rank === "GC2" ? 12 : (rank === "GC3" ? 13 : 14);
  const ovr = rank === "SSL" ? 81 : (rank === "GC3" ? 77 : 73);
  const pot = Math.floor(Math.random() * 8) + 91; // 91 a 98 de potencial

  GameState.academyProspects.push({
    id: "acad_" + Date.now() + "_" + Math.random(),
    name, country, age, rank, ovr, pot,
    loanLeagueId: null,
    loanClub: null,
    scoutedByUser: true
  });

  addNews(`¡Radar Ranked! Apareció ${name} (${age} años, rango ${rank}) con potencial ${pot}.`, "prodigy");
}

function generateUniqueName() {
  const base = InitialData.newgenPrefixes[Math.floor(Math.random() * InitialData.newgenPrefixes.length)];
  const suffix = Math.random() > 0.6 ? Math.floor(Math.random() * 99) : "";
  return base + suffix;
}

function sendProspectOnLoan(prospectId, leagueId) {
  const p = GameState.academyProspects.find(x => x.id === prospectId);
  const league = InitialData.nationalLeagues.find(l => l.id === leagueId);
  if (!p || !league) return;

  const club = league.clubs[Math.floor(Math.random() * league.clubs.length)];
  p.loanLeagueId = league.id;
  p.loanClub = club;

  addNews(`Cediste al juvenil ${p.name} (${p.age} años) a ${club} (${league.name}) para que sume experiencia.`, "loan");
  refreshAllUI();
}

function promoteProspectToFirstTeam(prospectId) {
  const idx = GameState.academyProspects.findIndex(x => x.id === prospectId);
  if (idx === -1) return;
  const p = GameState.academyProspects[idx];

  if (p.age < 15) {
    alert(`${p.name} todavía tiene ${p.age} años. La edad mínima oficial de RLCS es 15 años (podés mandarlo cedido a una Liga Nacional mientras tanto).`);
    return;
  }

  const userTeam = getUserTeam();
  GameState.players.push({
    id: "pro_" + Date.now(),
    name: p.name,
    country: p.country,
    age: p.age,
    ovr: p.ovr,
    pot: p.pot,
    mec: p.ovr + 2,
    rot: p.ovr - 1,
    def: p.ovr - 1,
    teamId: userTeam.id,
    starter: false,
    value: p.ovr * 850
  });

  GameState.academyProspects.splice(idx, 1);
  addNews(`¡${p.name} (15 años, OVR ${p.ovr}) fue ascendido al primer equipo de ${userTeam.name}!`, "prodigy");
  refreshAllUI();
}

function progressAcademyStep() {
  const coach = getTeamCoach(getUserTeam().id);
  const formadorBonus = (coach && coach.specialty.includes("Formador")) ? 1 : 0;

  GameState.academyProspects.forEach(p => {
    if (p.loanLeagueId) {
      // Crecimiento acelerado por jugar en Liga Nacional
      p.ovr = Math.min(p.pot, p.ovr + 1 + formadorBonus);
      if (p.ovr >= 76 && p.rank === "GC2") p.rank = "GC3";
      if (p.ovr >= 80 && p.rank === "GC3") p.rank = "SSL";

      // Probabilidad de que el cedido recomiende un compañero local de esa liga
      if (Math.random() < 0.35) {
        const league = InitialData.nationalLeagues.find(l => l.id === p.loanLeagueId);
        const newLocalName = GameState.customNameQueue.length > 0
          ? GameState.customNameQueue.shift().name
          : generateUniqueName();

        GameState.academyProspects.push({
          id: "acad_net_" + Date.now() + Math.random(),
          name: newLocalName,
          country: league.country,
          age: 13,
          rank: "GC3",
          ovr: 77,
          pot: Math.floor(Math.random() * 7) + 91,
          loanLeagueId: null,
          loanClub: null,
          scoutedByUser: true
        });
        addNews(`¡Red de Scouting! ${p.name} (cedido en ${p.loanClub}) te recomendó al talento local ${newLocalName} (13 años, GC3).`, "loan");
      }
    }
  });

  // Chance de descubrir un nuevo prodigio de tu cola cada etapa
  if (GameState.customNameQueue.length > 0 && Math.random() < 0.65) {
    triggerProspectDiscovery();
  }
}

function updateNationalLeaguesStep() {
  Object.keys(GameState.nationalTables).forEach(lid => {
    GameState.nationalTables[lid].forEach(row => {
      if (Math.random() > 0.4) row.pts += 3;
    });
    GameState.nationalTables[lid].sort((a, b) => b.pts - a.pts);
  });
}

function renderAcademy() {
  const qBox = document.getElementById("queued-names-box");
  qBox.innerHTML = GameState.customNameQueue.length
    ? `<div style="width:100%;font-size:0.8rem;color:#94a3b8;">En espera de aparecer (${GameState.customNameQueue.length}):</div>` +
      GameState.customNameQueue.map(q => `<span class="queued-chip">${q.name}</span>`).join("")
    : `<span class="muted">No hay nombres en cola. Agregá algunos arriba.</span>`;

  const list = document.getElementById("academy-players-list");
  list.innerHTML = GameState.academyProspects.map(p => `
    <div class="academy-item">
      <div>
        <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> ${Graphics.renderRankBadge(p.rank)}
        <div class="muted">${p.age} años • OVR ${p.ovr} (Pot. ${p.pot})</div>
        ${p.loanClub ? `<span class="badge">Cedido en ${p.loanClub}</span>` : `<span class="muted">En tu Academia</span>`}
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${!p.loanLeagueId ? `
          <select onchange="sendProspectOnLoan('${p.id}', this.value)" style="margin:0;padding:5px;font-size:0.8rem;">
            <option value="">Ceder a Liga...</option>
            ${InitialData.nationalLeagues.map(l => `<option value="${l.id}">${l.name}</option>`).join("")}
          </select>
        ` : ""}
        <button class="btn-primary btn-sm" onclick="promoteProspectToFirstTeam('${p.id}')">Subir al Primer Equipo</button>
      </div>
    </div>
  `).join("");
}

// 5. MERCADO Y EDITOR
function renderMarket() {
  const filter = document.getElementById("market-type-filter").value;
  const list = document.getElementById("market-list");
  const userTeam = getUserTeam();

  if (filter === "COACHES") {
    list.innerHTML = GameState.coaches
      .filter(c => c.teamId !== userTeam.id)
      .map(c => `
        <div class="market-item">
          <div>
            <strong>${Graphics.getFlag(c.country)} ${c.name}</strong> <span class="badge">OVR ${c.ovr}</span>
            <div class="muted">${c.specialty}</div>
            <div class="muted">Costo fichaje: $${c.salary.toLocaleString()}</div>
          </div>
          <button class="btn-primary btn-sm" onclick="hireCoach('${c.id}')">Contratar</button>
        </div>
      `).join("");
    return;
  }

  const available = GameState.players.filter(p => p.teamId !== userTeam.id).slice(0, 18);
  list.innerHTML = available.map(p => {
    const currentClub = p.teamId ? getTeamById(p.teamId)?.tag : "Agente Libre";
    return `
      <div class="market-item">
        <div>
          <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> <span class="badge">OVR ${p.ovr}</span>
          <div class="muted">${p.age} años • Pot. ${p.pot} • ${currentClub}</div>
          <div class="money" style="font-size:0.85rem;">$${p.value.toLocaleString()}</div>
        </div>
        <button class="btn-primary btn-sm" onclick="buyPlayer('${p.id}')">Fichar</button>
      </div>
    `;
  }).join("");
}

function buyPlayer(playerId) {
  const userTeam = getUserTeam();
  const p = GameState.players.find(x => x.id === playerId);
  if (!p) return;

  if (userTeam.budget < p.value) {
    alert("No tenés presupuesto suficiente para fichar a " + p.name);
    return;
  }

  userTeam.budget -= p.value;
  p.teamId = userTeam.id;
  p.starter = getTeamRoster(userTeam.id, true).length < 3;
  addNews(`¡Fichaje bomba! ${userTeam.name} contrató a ${p.name} (OVR ${p.ovr}) por $${p.value.toLocaleString()}.`);
  refreshAllUI();
}

function hireCoach(coachId) {
  const userTeam = getUserTeam();
  const c = GameState.coaches.find(x => x.id === coachId);
  if (!c) return;

  if (userTeam.budget < c.salary) {
    alert("Presupuesto insuficiente para contratar a " + c.name);
    return;
  }

  // Liberar coach anterior si había
  const old = getTeamCoach(userTeam.id);
  if (old) old.teamId = null;

  userTeam.budget -= c.salary;
  c.teamId = userTeam.id;
  addNews(`${userTeam.name} presentó a ${c.name} como su nuevo Head Coach.`);
  refreshAllUI();
}

function populateEditorTeams() {
  const sel = document.getElementById("edit-person-team");
  sel.innerHTML = `<option value="">Agente Libre / Sin Equipo</option>` +
    GameState.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
}

function createCustomPerson() {
  const name = document.getElementById("edit-person-name").value.trim();
  const role = document.getElementById("edit-person-role").value;
  const country = document.getElementById("edit-person-country").value;
  const age = parseInt(document.getElementById("edit-person-age").value) || 16;
  const ovr = parseInt(document.getElementById("edit-person-ovr").value) || 84;
  const pot = parseInt(document.getElementById("edit-person-pot").value) || 90;
  const teamId = document.getElementById("edit-person-team").value || null;

  if (!name) return;

  if (role === "COACH") {
    GameState.coaches.push({
      id: "c_custom_" + Date.now(),
      name, country, ovr,
      specialty: "Formador de Talento (+35% progreso juvenil)",
      teamId,
      salary: ovr * 250
    });
    addNews(`Se incorporó el Head Coach personalizado ${name} (OVR ${ovr}).`);
  } else {
    GameState.players.push({
      id: "p_custom_" + Date.now(),
      name, country, age, ovr, pot,
      mec: ovr + 1, rot: ovr, def: ovr - 1,
      teamId,
      starter: teamId ? getTeamRoster(teamId, true).length < 3 : false,
      value: ovr * 800
    });
    addNews(`Se añadió al jugador personalizado ${name} (${age} años, OVR ${ovr}).`);
  }

  document.getElementById("edit-person-name").value = "";
  refreshAllUI();
}

// CAMBIO DE TEMPORADA (ENVEJECIMIENTO, RETIROS Y NUEVAS PROMESAS)
function advanceNewSeason() {
  GameState.season++;
  GameState.stageIndex = 0;
  addNews(`=== INICIO DE LA TEMPORADA ${GameState.season} ===`, "prodigy");

  // Resetear puntos RLCS
  GameState.teams.forEach(t => t.points = 0);
  buildNationalTables();

  // Envejecer canteranos
  GameState.academyProspects.forEach(p => {
    p.age++;
    p.ovr = Math.min(p.pot, p.ovr + 2);
  });

  // Envejecer pros y retirar veteranos
  GameState.players = GameState.players.filter(p => {
    p.age++;
    if (p.age <= 21 && p.ovr < p.pot) {
      p.ovr = Math.min(p.pot, p.ovr + Math.floor(Math.random() * 2) + 1);
      p.mec = Math.min(99, p.mec + 1);
    }
    if (p.age >= 26 && Math.random() < 0.45) {
      addNews(`${p.name} anuncia su retiro como jugador profesional a los ${p.age} años.`);
      // Posibilidad de volverse Coach
      if (Math.random() < 0.5) {
        GameState.coaches.push({
          id: "c_ret_" + Date.now() + Math.random(),
          name: p.name,
          country: p.country,
          ovr: Math.max(82, p.ovr - 3),
          specialty: "Estratega LAN (+4% en Majors/Mundiales)",
          teamId: null,
          salary: 22000
        });
        addNews(`¡${p.name} inicia su carrera como Head Coach contratables en el mercado!`);
      }
      return false;
    }
    return true;
  });

  // Generar 2 nuevos prodigios para la nueva temporada
  triggerProspectDiscovery();
  triggerProspectDiscovery();
  pickNextOpponent();
}

// GUARDADO LOCAL
function saveGame(notify) {
  localStorage.setItem("rl_career_save_v1", JSON.stringify(GameState));
  if (notify) alert("Partida guardada correctamente en tu navegador.");
}

function loadSavedGame() {
  const raw = localStorage.getItem("rl_career_save_v1");
  if (!raw) return;
  GameState = JSON.parse(raw);
  launchGameUI();
}

function resetCareer() {
  if (confirm("¿Seguro que querés borrar la partida actual y volver al menú?")) {
    localStorage.removeItem("rl_career_save_v1");
    location.reload();
  }
}
