let GameState = {
  season: 2026,
  scheduleIndex: 0,
  userTeamId: null,
  teams: [],
  players: [],
  coaches: [],
  academyProspects: [], // Incluye tus canteranos y los de otros clubes del mundo
  customNameQueue: [],
  nationalTables: {},
  currentBracket: { qf: [], sf: [], gf: [] },
  trophiesWon: [],
  championsHistory: [],
  awardsHistory: [],
  hallOfFame: [],
  activeSponsor: null,
  bootcampActive: false,
  incomingOffer: null,
  news: [],
  currentOpponentId: null,
  selectedCompView: "rlcs_regional",
  selectedRegionTab: "SAM"
};

let LiveMatch = {
  active: false,
  homeWins: 0,
  awayWins: 0,
  winsNeeded: 3,
  gameNum: 1,
  tactic: "balanced",
  timeoutUsed: false,
  timeoutBoostActive: false
};

let ActiveNegotiationPlayerId = null;

// INICIALIZACIÓN
window.onload = () => {
  document.getElementById("hero-logo").innerHTML = Graphics.renderTrophy("rlcs_worlds", 68);
  updateCustomCrestPreview();
  renderSetupTeams();
  if (localStorage.getItem("rl_career_save_v3")) {
    document.getElementById("btn-continue-save").style.display = "inline-block";
  }
};

function switchSetupTab(tab, btn) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".setup-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
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
        ${Graphics.renderCrest(team, 64)}
        <h3>${team.name}</h3>
        <span class="badge">${team.region} • OVR ${avgOvr} • ⭐ ${team.stars || 0}</span>
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
    pattern: document.getElementById("custom-crest-pattern").value,
    logoUrl: document.getElementById("custom-logo-url").value,
    stars: 0
  };
  document.getElementById("custom-crest-preview").innerHTML = Graphics.renderCrest(mockTeam, 88);
}

function startWithCustomTeam() {
  const name = document.getElementById("custom-team-name").value.trim() || "Custom Esports";
  const tag = document.getElementById("custom-team-tag").value.trim().toUpperCase() || "CST";
  const region = document.getElementById("custom-team-region").value;
  const shape = document.getElementById("custom-crest-shape").value;
  const pattern = document.getElementById("custom-crest-pattern").value;
  const color1 = document.getElementById("custom-color-1").value;
  const color2 = document.getElementById("custom-color-2").value;
  const logoUrl = document.getElementById("custom-logo-url").value.trim();

  const customTeam = {
    id: "custom_user",
    name, tag, region, rep: 72, stars: 0, color1, color2, shape, pattern, logoUrl,
    budget: 240000,
    points: 0
  };

  initBaseState();
  GameState.teams.push(customTeam);
  GameState.userTeamId = "custom_user";
  GameState.selectedRegionTab = region;

  const regionCountry = { SAM: "AR", EU: "FR", NA: "US", MENA: "SA" }[region] || "AR";
  const roles = ["Striker", "Playmaker", "Third Man"];
  for (let i = 0; i < 3; i++) {
    GameState.players.push({
      id: "u_init_" + i,
      name: generateUniqueName(),
      country: regionCountry,
      age: 18 + i,
      ovr: 84 + i,
      pot: 90 + i,
      mec: 85 + i,
      rot: 84 + i,
      def: 83 + i,
      role: roles[i],
      contractYears: 2,
      teamId: "custom_user",
      starter: true,
      value: 170000,
      goals: 0, assists: 0, saves: 0, streak: 0
    });
  }

  addNews(`¡${name} (${tag}) debuta oficialmente en la región ${region} de la RLCS!`);
  launchGameUI();
}

function startCareer(teamId) {
  initBaseState();
  GameState.userTeamId = teamId;
  const userTeam = getUserTeam();
  GameState.selectedRegionTab = userTeam.region;
  addNews(`Asumiste como General Manager de ${userTeam.name} para la Temporada ${GameState.season}.`);
  launchGameUI();
}

function initBaseState() {
  GameState.season = 2026;
  GameState.scheduleIndex = 0;
  GameState.teams = JSON.parse(JSON.stringify(InitialData.teams));
  GameState.players = JSON.parse(JSON.stringify(InitialData.players));
  GameState.coaches = JSON.parse(JSON.stringify(InitialData.coaches));
  GameState.academyProspects = [];
  GameState.customNameQueue = [];
  GameState.trophiesWon = [];
  GameState.championsHistory = [];
  GameState.awardsHistory = [];
  GameState.hallOfFame = [];
  GameState.activeSponsor = null;
  GameState.bootcampActive = false;
  GameState.incomingOffer = null;
  GameState.news = [];
  buildNationalTables();
  spawnInitialProspects();
}

function buildNationalTables() {
  GameState.nationalTables = {};
  InitialData.nationalLeagues.forEach(league => {
    GameState.nationalTables[league.id] = league.clubs.map(club => ({
      club, pj: 0, pg: 0, pp: 0, dg: 0, pts: 0
    }));
  });
}

function spawnInitialProspects() {
  const starters = [
    { name: "TomyRL", country: "AR", age: 13, rank: "GC3", pot: 96, ownerId: "USER" },
    { name: "Kirox", country: "CL", age: 12, rank: "GC2", pot: 94, ownerId: "USER" },
    { name: "Zynx", country: "FR", age: 14, rank: "SSL", pot: 96, ownerId: "kc" },
    { name: "Dante", country: "BR", age: 13, rank: "GC3", pot: 93, ownerId: "fur" }
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
      ownerTeamId: s.ownerId === "USER" ? null : s.ownerId, // null = pertenece al usuario
      isUserAcademy: s.ownerId === "USER",
      loanLeagueId: null,
      loanClub: null,
      loanGoals: 0,
      loanAssists: 0
    });
  });
}

function launchGameUI() {
  // Asegurar que los canteranos iniciales del usuario tengan su ID real
  GameState.academyProspects.forEach(p => {
    if (p.isUserAcademy) p.ownerTeamId = GameState.userTeamId;
  });
  document.getElementById("setup-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  generateTournamentBracket();
  pickNextOpponent();
  refreshAllUI();
  saveGame(false);
}

// HELPERS Y CÁLCULO DE QUÍMICA / OVR
function getUserTeam() { return GameState.teams.find(t => t.id === GameState.userTeamId); }
function getTeamById(id) { return GameState.teams.find(t => t.id === id); }
function getTeamRoster(teamId, onlyStarters = false) {
  return GameState.players.filter(p => p.teamId === teamId && (!onlyStarters || p.starter));
}
function getTeamCoach(teamId) { return GameState.coaches.find(c => c.teamId === teamId); }

function getTeamChemistry(teamId) {
  const starters = getTeamRoster(teamId, true);
  if (starters.length < 3) return 70;
  let chem = 78;

  // Bono por combinación de roles tácticos (Striker + Playmaker + Third Man)
  const rolesSet = new Set(starters.map(p => p.role || "Striker"));
  if (rolesSet.size === 3) chem += 12;
  else if (rolesSet.size === 2) chem += 5;

  // Bono por compartir nacionalidad
  const countries = starters.map(p => p.country);
  if (countries[0] === countries[1] && countries[1] === countries[2]) chem += 8;
  else if (new Set(countries).size === 2) chem += 4;

  if (teamId === GameState.userTeamId && GameState.bootcampActive) chem += 3;
  return Math.min(100, chem);
}

function getTeamOvr(teamId) {
  const starters = getTeamRoster(teamId, true);
  if (starters.length === 0) return 75;
  const base = starters.reduce((sum, p) => sum + p.ovr + (p.streak >= 3 ? 2 : 0), 0) / starters.length;
  const chemBonus = (getTeamChemistry(teamId) - 80) * 0.1;
  const coach = getTeamCoach(teamId);
  const coachBonus = coach ? (coach.ovr - 80) * 0.15 : 0;
  const campBonus = (teamId === GameState.userTeamId && GameState.bootcampActive) ? 2 : 0;
  return Math.round(base + chemBonus + coachBonus + campBonus);
}

function addNews(text, type = "normal") {
  GameState.news.unshift({ text, type, season: GameState.season });
  if (GameState.news.length > 40) GameState.news.pop();
}

// NAVEGACIÓN
function switchGameTab(tabId) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".game-tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.nav-btn[data-tab="${tabId}"]`).classList.add("active");
  document.getElementById("tab-" + tabId).classList.add("active");
  refreshAllUI();
}

function refreshAllUI() {
  const team = getUserTeam();
  if (!team) return;
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const ovr = getTeamOvr(team.id);
  const chem = getTeamChemistry(team.id);

  document.getElementById("top-club-crest").innerHTML = Graphics.renderCrest(team, 46);
  document.getElementById("top-club-name").textContent = team.name;
  document.getElementById("top-club-meta").textContent = `${team.region} • OVR ${ovr} • Química ${chem}%`;
  document.getElementById("top-season").textContent = GameState.season;
  document.getElementById("top-stage").textContent = stage.compName;
  document.getElementById("top-budget").textContent = "$" + team.budget.toLocaleString();
  document.getElementById("top-points").textContent = team.points + " pts";

  renderOffice();
  renderCompetitionView();
  renderSquadAndCoach();
  renderAcademy();
  renderMarket();
  renderAwardsAndTrophies();
  populateEditorTeams();
}

// LLAVES / PLAYOFFS
function generateTournamentBracket() {
  const userTeam = getUserTeam();
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  let pool = stage.compId === "rlcs_regional"
    ? GameState.teams.filter(t => t.region === userTeam.region)
    : [...GameState.teams].sort((a, b) => b.points - a.points || getTeamOvr(b.id) - getTeamOvr(a.id)).slice(0, 8);

  while (pool.length < 8) {
    const extra = GameState.teams.find(t => !pool.includes(t));
    if (extra) pool.push(extra);
    else break;
  }
  if (!pool.some(t => t.id === userTeam.id)) pool[pool.length - 1] = userTeam;

  GameState.currentBracket = {
    compName: stage.compName,
    qf: [
      { home: pool[0], away: pool[7], scoreH: "-", scoreA: "-" },
      { home: pool[3], away: pool[4], scoreH: "-", scoreA: "-" },
      { home: pool[1], away: pool[6], scoreH: "-", scoreA: "-" },
      { home: pool[2], away: pool[5], scoreH: "-", scoreA: "-" }
    ],
    sf: [{ home: null, away: null, scoreH: "-", scoreA: "-" }, { home: null, away: null, scoreH: "-", scoreA: "-" }],
    gf: [{ home: null, away: null, scoreH: "-", scoreA: "-" }]
  };
}

function updateBracketProgress(userWon, oppTeam, homeWins, awayWins) {
  const userTeam = getUserTeam();
  const b = GameState.currentBracket;
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];

  if (stage.roundName.includes("Cuartos")) {
    b.qf.forEach((m, idx) => {
      if (m.home.id === userTeam.id || m.away.id === userTeam.id) {
        m.scoreH = m.home.id === userTeam.id ? homeWins : awayWins;
        m.scoreA = m.away.id === userTeam.id ? homeWins : awayWins;
      } else {
        const hWin = getTeamOvr(m.home.id) + Math.random() * 6 > getTeamOvr(m.away.id) + Math.random() * 6;
        m.scoreH = hWin ? 4 : Math.floor(Math.random() * 3);
        m.scoreA = hWin ? Math.floor(Math.random() * 3) : 4;
      }
      const winner = m.scoreH > m.scoreA ? m.home : m.away;
      if (idx === 0) b.sf[0].home = winner;
      else if (idx === 1) b.sf[0].away = winner;
      else if (idx === 2) b.sf[1].home = winner;
      else b.sf[1].away = winner;
    });
  } else if (stage.roundName.includes("Semifinal")) {
    b.sf.forEach((m, idx) => {
      if (!m.home || !m.away) return;
      if (m.home.id === userTeam.id || m.away.id === userTeam.id) {
        m.scoreH = m.home.id === userTeam.id ? homeWins : awayWins;
        m.scoreA = m.away.id === userTeam.id ? homeWins : awayWins;
      } else {
        const hWin = getTeamOvr(m.home.id) + Math.random() * 6 > getTeamOvr(m.away.id) + Math.random() * 6;
        m.scoreH = hWin ? 4 : Math.floor(Math.random() * 3);
        m.scoreA = hWin ? Math.floor(Math.random() * 3) : 4;
      }
      const winner = m.scoreH > m.scoreA ? m.home : m.away;
      if (idx === 0) b.gf[0].home = winner;
      else b.gf[0].away = winner;
    });
  } else if (stage.isFinal) {
    b.gf[0].home = userTeam;
    b.gf[0].away = oppTeam;
    b.gf[0].scoreH = homeWins;
    b.gf[0].scoreA = awayWins;
  }
}

// 1. OFICINA, BOOTCAMP Y PARTIDOS
function pickNextOpponent() {
  const userTeam = getUserTeam();
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  let pool = stage.compId === "rlcs_regional"
    ? GameState.teams.filter(t => t.region === userTeam.region && t.id !== userTeam.id)
    : GameState.teams.filter(t => t.id !== userTeam.id);

  if (pool.length === 0) pool = GameState.teams.filter(t => t.id !== userTeam.id);
  const opp = pool[Math.floor(Math.random() * pool.length)];
  GameState.currentOpponentId = opp.id;
}

function buyLanBootcamp() {
  const userTeam = getUserTeam();
  if (userTeam.budget < 35000) {
    alert("Necesitás $35,000 para organizar un Bootcamp internacional.");
    return;
  }
  userTeam.budget -= 35000;
  GameState.bootcampActive = true;
  addNews(`✈️ ${userTeam.name} completó un Bootcamp intensivo previo al evento LAN (+2 OVR y +3 Química).`);
  refreshAllUI();
}

function renderOffice() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId) || GameState.teams[0];
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];

  document.getElementById("next-event-title").textContent = stage.compName;
  document.getElementById("next-round-subtitle").textContent = `${stage.roundName} • Formato ${stage.format}`;
  document.getElementById("next-event-trophy").innerHTML = Graphics.renderTrophy(stage.compId, 44);

  const isLan = stage.compId !== "rlcs_regional";
  const campBanner = document.getElementById("bootcamp-banner");
  if (isLan && !GameState.bootcampActive) campBanner.classList.remove("hidden");
  else campBanner.classList.add("hidden");

  const isFIFAe = stage.compId === "fifae_wc";
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
      <div class="muted">Premio: $${stage.prize.toLocaleString()}</div>
    </div>
    <div class="vs-team">
      ${Graphics.renderCrest(opp, 64)}
      <strong>${awayTitle}</strong>
      <span class="badge">OVR ${getTeamOvr(opp.id)}</span>
    </div>
  `;

  // Ofertas recibidas por tus jugadores
  const offerBox = document.getElementById("incoming-offer-box");
  if (GameState.incomingOffer) {
    const o = GameState.incomingOffer;
    offerBox.innerHTML = `
      <div class="offer-alert">
        <strong>📩 ¡OFERTA RECIBIDA!</strong> <strong>${o.buyerName}</strong> ofrece <strong>$${o.amount.toLocaleString()}</strong> por tu jugador <strong>${o.playerName}</strong>.
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="btn-success btn-sm" onclick="respondIncomingOffer(true)">Aceptar Venta</button>
          <button class="btn-danger-outline btn-sm" onclick="respondIncomingOffer(false)">Rechazar</button>
        </div>
      </div>
    `;
  } else {
    offerBox.innerHTML = "";
  }

  document.getElementById("news-feed").innerHTML = GameState.news.map(n => `
    <div class="news-item ${n.type}">
      <small class="muted">[Temp. ${n.season}]</small> ${n.text}
    </div>
  `).join("");
}

function respondIncomingOffer(accept) {
  const o = GameState.incomingOffer;
  if (!o) return;
  if (accept) {
    const userTeam = getUserTeam();
    const roster = getTeamRoster(userTeam.id, false);
    if (roster.length <= 3) {
      alert("No podés venderlo porque te quedarías con menos de 3 jugadores.");
      return;
    }
    const player = GameState.players.find(p => p.id === o.playerId);
    if (player) {
      userTeam.budget += o.amount;
      player.teamId = o.buyerId;
      player.starter = true;
      addNews(`💰 Vendiste a ${player.name} a ${o.buyerName} por $${o.amount.toLocaleString()}.`);
    }
  } else {
    addNews(`Rechazaste la oferta de ${o.buyerName} por ${o.playerName}.`);
  }
  GameState.incomingOffer = null;
  refreshAllUI();
}

// EN VIVO MAPA POR MAPA
function startLiveSeries() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];

  LiveMatch = {
    active: true, homeWins: 0, awayWins: 0,
    winsNeeded: stage.format === "Bo7" ? 4 : 3,
    gameNum: 1, tactic: "balanced", timeoutUsed: false, timeoutBoostActive: false
  };

  document.getElementById("match-controls").classList.add("hidden");
  document.getElementById("live-series-panel").classList.remove("hidden");
  document.getElementById("btn-play-next-map").classList.remove("hidden");
  document.getElementById("btn-finish-series").classList.add("hidden");
  document.getElementById("btn-timeout").disabled = false;
  document.getElementById("btn-timeout").textContent = "Pedir Timeout (1 disp.)";

  document.getElementById("live-home-name").textContent = userTeam.tag;
  document.getElementById("live-away-name").textContent = opp.tag;
  document.getElementById("live-home-series").textContent = "0";
  document.getElementById("live-away-series").textContent = "0";
  document.getElementById("live-game-label").textContent = `JUEGO 1 (${stage.format})`;
  document.getElementById("live-map-score").textContent = "0 - 0";
  document.getElementById("live-clock").textContent = "5:00";
  document.getElementById("live-events-log").innerHTML = `<div>🎙️ ¡Serie en vivo: <strong>${userTeam.name}</strong> vs <strong>${opp.name}</strong>!</div>`;
}

function changeLiveTactic() {
  LiveMatch.tactic = document.getElementById("live-tactic-select").value;
  logLiveEvent(`📋 Táctica ajustada a: <strong>${LiveMatch.tactic.toUpperCase()}</strong>.`);
}

function useTacticalTimeout() {
  if (LiveMatch.timeoutUsed) return;
  LiveMatch.timeoutUsed = true;
  LiveMatch.timeoutBoostActive = true;
  const coach = getTeamCoach(getUserTeam().id);
  document.getElementById("btn-timeout").disabled = true;
  document.getElementById("btn-timeout").textContent = "Timeout Usado";
  logLiveEvent(`⏸️ <strong>TIMEOUT:</strong> ${coach ? coach.name : "El Coach"} ajusta las rotaciones (+5 OVR este mapa).`);
}

function logLiveEvent(html) {
  const logBox = document.getElementById("live-events-log");
  logBox.innerHTML += `<div>${html}</div>`;
  logBox.scrollTop = logBox.scrollHeight;
}

function playNextLiveMap() {
  if (!LiveMatch.active) return;

  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const homeStarters = getTeamRoster(userTeam.id, true);
  const awayStarters = getTeamRoster(opp.id, true);
  const coach = getTeamCoach(userTeam.id);

  let homeOvr = getTeamOvr(userTeam.id);
  let awayOvr = getTeamOvr(opp.id);

  if (coach && coach.specialty.includes("Estratega LAN") && stage.compId !== "rlcs_regional") homeOvr += 3;
  if (LiveMatch.timeoutBoostActive) {
    homeOvr += 5;
    LiveMatch.timeoutBoostActive = false;
  }

  let tacticSwing = LiveMatch.tactic === "aggressive" ? 1 : (LiveMatch.tactic === "defensive" ? -0.5 : 0);
  const diff = homeOvr - awayOvr;
  const homeChance = Math.min(0.86, Math.max(0.14, 0.50 + diff * 0.035));

  let gHome = 0, gAway = 0;
  const minutes = ["4:18", "3:11", "1:52", "0:29"];
  logLiveEvent(`<hr style="border-color:#1e293b;margin:6px 0;"><strong>▶ JUEGO ${LiveMatch.gameNum}:</strong>`);

  minutes.forEach(min => {
    if (Math.random() < 0.68) {
      if (Math.random() < homeChance) {
        gHome++;
        const scorer = homeStarters[Math.floor(Math.random() * homeStarters.length)];
        const assister = homeStarters.find(p => p.id !== scorer?.id);
        if (scorer) scorer.goals++;
        if (assister && Math.random() > 0.3) assister.assists++;
        logLiveEvent(`⏱️ [${min}] ⚽ ¡GOL DE <strong>${scorer?.name}</strong>${assister ? ` (Asist. ${assister.name})` : ""}!`);
      } else {
        gAway++;
        const scorer = awayStarters[Math.floor(Math.random() * awayStarters.length)];
        const keeper = homeStarters.find(p => p.role === "Third Man") || homeStarters[0];
        if (scorer) scorer.goals++;
        if (keeper && Math.random() > 0.5) keeper.saves++;
        logLiveEvent(`⏱️ [${min}] ⚽ Gol de <strong>${scorer?.name}</strong> (${opp.tag}).`);
      }
    }
  });

  let otText = "";
  if (gHome === gAway) {
    otText = " (OVERTIME)";
    if (Math.random() < homeChance + tacticSwing * 0.02) {
      gHome++;
      const hero = homeStarters[0];
      if (hero) hero.goals++;
      logLiveEvent(`🔥 <strong>¡GOL DE ORO EN OVERTIME DE ${hero?.name}!</strong>`);
    } else {
      gAway++;
      logLiveEvent(`💔 Gol de oro en Overtime para ${opp.tag}.`);
    }
  }

  if (gHome > gAway) LiveMatch.homeWins++;
  else LiveMatch.awayWins++;

  document.getElementById("live-home-series").textContent = LiveMatch.homeWins;
  document.getElementById("live-away-series").textContent = LiveMatch.awayWins;
  document.getElementById("live-map-score").textContent = `${gHome} - ${gAway}`;
  document.getElementById("live-clock").textContent = `0:00${otText}`;

  if (LiveMatch.homeWins >= LiveMatch.winsNeeded || LiveMatch.awayWins >= LiveMatch.winsNeeded) {
    LiveMatch.active = false;
    logLiveEvent(`<br>🏆 <strong>SERIE FINALIZADA: ${userTeam.tag} ${LiveMatch.homeWins} - ${LiveMatch.awayWins} ${opp.tag}</strong>`);
    document.getElementById("btn-play-next-map").classList.add("hidden");
    document.getElementById("btn-finish-series").classList.remove("hidden");
  } else {
    LiveMatch.gameNum++;
    document.getElementById("live-game-label").textContent = `SIGUIENTE: JUEGO ${LiveMatch.gameNum}`;
  }
}

function closeLiveSeriesPanel() {
  document.getElementById("live-series-panel").classList.add("hidden");
  document.getElementById("match-controls").classList.remove("hidden");
  finalizeSeriesResult(LiveMatch.homeWins, LiveMatch.awayWins);
}

function simulateSeriesInstant() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const winsNeeded = stage.format === "Bo7" ? 4 : 3;

  let h = 0, a = 0;
  const diff = getTeamOvr(userTeam.id) - getTeamOvr(opp.id);
  const chance = Math.min(0.85, Math.max(0.15, 0.50 + diff * 0.035));
  const homeStarters = getTeamRoster(userTeam.id, true);
  const awayStarters = getTeamRoster(opp.id, true);

  while (h < winsNeeded && a < winsNeeded) {
    if (Math.random() < chance) {
      h++;
      if (homeStarters[0]) homeStarters[Math.floor(Math.random() * homeStarters.length)].goals += 2;
      if (homeStarters[1]) homeStarters[Math.floor(Math.random() * homeStarters.length)].assists += 1;
    } else {
      a++;
      if (awayStarters[0]) awayStarters[Math.floor(Math.random() * awayStarters.length)].goals += 2;
    }
  }
  finalizeSeriesResult(h, a);
}

function openManualResultModal() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  document.getElementById("manual-match-label").textContent = `${userTeam.name} vs ${opp.name} (${stage.format})`;
  document.getElementById("manual-modal").classList.remove("hidden");
}
function closeManualResultModal() { document.getElementById("manual-modal").classList.add("hidden"); }
function submitManualResult() {
  const h = parseInt(document.getElementById("manual-score-home").value) || 0;
  const a = parseInt(document.getElementById("manual-score-away").value) || 0;
  closeManualResultModal();
  finalizeSeriesResult(h, a);
}

function finalizeSeriesResult(homeWins, awayWins) {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const won = homeWins > awayWins;

  updateBracketProgress(won, opp, homeWins, awayWins);

  // Actualizar racha (streak) de los titulares
  getTeamRoster(userTeam.id, true).forEach(p => {
    p.streak = won ? (p.streak || 0) + 1 : 0;
  });

  if (won) {
    userTeam.budget += stage.prize;
    userTeam.points += stage.points;
    userTeam.rep = Math.min(99, userTeam.rep + (stage.isFinal ? 3 : 1));
    addNews(`✅ Victoria ${homeWins}-${awayWins} vs ${opp.name} en ${stage.compName} (${stage.roundName}). +$${stage.prize.toLocaleString()}.`);

    if (stage.isFinal) {
      // Bonos de sponsor por título
      if (GameState.activeSponsor?.id === "sp_hyperx") {
        userTeam.budget += 30000;
        addNews(`💼 Bono HyperX: +$30,000 por ganar el título.`);
      }
      triggerChampionCeremony(stage, userTeam);
    }
  } else {
    opp.points += stage.points;
    userTeam.budget += Math.round(stage.prize * 0.25);
    addNews(`❌ Derrota ${homeWins}-${awayWins} ante ${opp.name} en ${stage.compName} (${stage.roundName}).`);
    if (stage.isFinal) {
      if (stage.compId === "rlcs_worlds") {
        opp.stars = (opp.stars || 0) + 1;
        addNews(`⭐ ¡${opp.name} conquista el Mundial RLCS y suma una estrella dorada a su escudo!`);
      }
      GameState.championsHistory.unshift({
        season: GameState.season, compId: stage.compId, compName: stage.compName, winnerName: opp.name
      });
    }
  }

  // Simular estadísticas y puntos de los demás equipos del mundo
  GameState.teams.forEach(t => {
    if (t.id !== userTeam.id && t.id !== opp.id) {
      if (Math.random() > 0.45) t.points += Math.round(stage.points * 0.75);
      const st = getTeamRoster(t.id, true);
      if (st.length) {
        st[Math.floor(Math.random() * st.length)].goals += Math.floor(Math.random() * 4) + 1;
        st[Math.floor(Math.random() * st.length)].assists += Math.floor(Math.random() * 3) + 1;
        st[Math.floor(Math.random() * st.length)].saves += Math.floor(Math.random() * 4) + 1;
      }
    }
  });

  // Posibilidad de recibir una oferta de otro club por uno de tus jugadores
  if (!GameState.incomingOffer && Math.random() < 0.22) {
    const myPlayers = getTeamRoster(userTeam.id, false);
    const buyers = GameState.teams.filter(t => t.id !== userTeam.id && t.budget > 250000);
    if (myPlayers.length > 3 && buyers.length > 0) {
      const target = myPlayers[Math.floor(Math.random() * myPlayers.length)];
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      GameState.incomingOffer = {
        playerId: target.id,
        playerName: target.name,
        buyerId: buyer.id,
        buyerName: buyer.name,
        amount: Math.round(target.value * 1.1)
      };
    }
  }

  progressAcademyStep();
  updateNationalLeaguesStep();

  const prevComp = stage.compName;
  GameState.scheduleIndex++;

  if (GameState.scheduleIndex >= InitialData.seasonSchedule.length) {
    advanceNewSeason();
  } else {
    const nextStage = InitialData.seasonSchedule[GameState.scheduleIndex];
    if (nextStage.compName !== prevComp) {
      GameState.bootcampActive = false;
      generateTournamentBracket();
    }
    pickNextOpponent();
  }

  refreshAllUI();
  saveGame(false);
}

// CEREMONIA DE CAMPEÓN + ELECCIÓN DE ESTRELLA RLCS
function triggerChampionCeremony(stage, team) {
  const starters = getTeamRoster(team.id, true);
  const mvp = [...starters].sort((a, b) => b.ovr - a.ovr)[0]?.name || "Capitán";

  GameState.trophiesWon.push({ season: GameState.season, compId: stage.compId, compName: stage.compName });
  GameState.championsHistory.unshift({ season: GameState.season, compId: stage.compId, compName: stage.compName, winnerName: team.name });

  document.getElementById("champ-trophy-icon").innerHTML = Graphics.renderTrophy(stage.compId, 86);
  document.getElementById("champ-tournament-name").textContent = `${stage.compName} ${GameState.season}`;
  document.getElementById("champ-team-name").textContent = team.name;
  document.getElementById("champ-roster-names").textContent = starters.map(p => p.name).join(" • ");
  document.getElementById("champ-mvp-badge").textContent = `MVP DEL TORNEO: ${mvp}`;
  document.getElementById("champ-prize-text").textContent = `Premio ganado: +$${stage.prize.toLocaleString()}`;

  const starBox = document.getElementById("champ-star-choice");
  const closeBtn = document.getElementById("btn-close-champ-modal");
  if (stage.compId === "rlcs_worlds") {
    starBox.classList.remove("hidden");
    closeBtn.classList.add("hidden");
  } else {
    starBox.classList.add("hidden");
    closeBtn.classList.remove("hidden");
  }

  document.getElementById("champion-modal").classList.remove("hidden");
}

function confirmWorldChampionStar(addStar) {
  const userTeam = getUserTeam();
  if (addStar) {
    userTeam.stars = (userTeam.stars || 0) + 1;
    addNews(`⭐ ¡${userTeam.name} bordó su estrella #${userTeam.stars} encima del escudo tras ganar el Mundial RLCS!`);
  } else {
    addNews(`${userTeam.name} decidió mantener su escudo clásico sin añadir estrella.`);
  }
  closeChampionModal();
  refreshAllUI();
}

function closeChampionModal() {
  document.getElementById("champion-modal").classList.add("hidden");
}

// 2. COMPETENCIAS, LLAVES, LIGAS Y ESTADÍSTICAS
function selectCompView(compId, btn) {
  GameState.selectedCompView = compId;
  document.querySelectorAll(".comp-pill").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  renderCompetitionView();
}

function changeRegionSubTab(region) {
  GameState.selectedRegionTab = region;
  renderCompetitionView();
}

function renderCompetitionView() {
  const view = document.getElementById("competition-view");
  const compId = GameState.selectedCompView;

  if (compId === "player_stats") {
    const topGoals = [...GameState.players].sort((a, b) => b.goals - a.goals).slice(0, 10);
    const topAssists = [...GameState.players].sort((a, b) => b.assists - a.assists).slice(0, 10);
    view.innerHTML = `
      <div class="dashboard-grid">
        <div>
          <h3>⚽ Tabla de Goleadores (Bota de Oro)</h3>
          <table>
            <thead><tr><th>#</th><th>Jugador</th><th>Equipo</th><th>Goles</th></tr></thead>
            <tbody>
              ${topGoals.map((p, i) => `<tr><td>${i+1}</td><td>${Graphics.getFlag(p.country)} ${p.name}</td><td>${getTeamById(p.teamId)?.tag || "FA"}</td><td><strong>${p.goals}</strong></td></tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div>
          <h3>🎯 Tabla de Asistidores (Premio KDB)</h3>
          <table>
            <thead><tr><th>#</th><th>Jugador</th><th>Equipo</th><th>Asist.</th></tr></thead>
            <tbody>
              ${topAssists.map((p, i) => `<tr><td>${i+1}</td><td>${Graphics.getFlag(p.country)} ${p.name}</td><td>${getTeamById(p.teamId)?.tag || "FA"}</td><td><strong>${p.assists}</strong></td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
    return;
  }

  if (compId === "current_bracket") {
    const b = GameState.currentBracket;
    const userTeamId = GameState.userTeamId;
    const renderMatchBox = (m) => {
      if (!m.home || !m.away) return `<div class="bracket-match muted">Por definirse</div>`;
      const isUser = m.home.id === userTeamId || m.away.id === userTeamId;
      return `
        <div class="bracket-match ${isUser ? "user-match" : ""}">
          <div class="b-row ${m.scoreH > m.scoreA ? "b-win" : ""}"><span>${m.home.tag}</span><span>${m.scoreH}</span></div>
          <div class="b-row ${m.scoreA > m.scoreH ? "b-win" : ""}"><span>${m.away.tag}</span><span>${m.scoreA}</span></div>
        </div>
      `;
    };

    view.innerHTML = `
      <div class="card-header"><h3>Cuadro de Playoffs — ${b.compName || "Torneo Actual"}</h3></div>
      <div class="bracket-container">
        <div class="bracket-round"><h4>CUARTOS DE FINAL</h4>${b.qf.map(renderMatchBox).join("")}</div>
        <div class="bracket-round"><h4>SEMIFINALES</h4>${b.sf.map(renderMatchBox).join("")}</div>
        <div class="bracket-round"><h4>GRAN FINAL</h4>${b.gf.map(renderMatchBox).join("")}</div>
      </div>
    `;
    return;
  }

  if (compId === "national_leagues") {
    let html = `<h3>Ligas Nacionales Oficiales (Canteras y Cesiones)</h3>`;
    InitialData.nationalLeagues.forEach(league => {
      const table = GameState.nationalTables[league.id] || [];
      html += `
        <h4 style="margin-top:18px;">${Graphics.getFlag(league.country)} ${league.name}</h4>
        <table>
          <thead><tr><th>Pos</th><th>Club</th><th>PJ</th><th>PG</th><th>PP</th><th>DG</th><th>Pts</th></tr></thead>
          <tbody>
            ${table.map((row, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${row.club}</strong></td>
                <td>${row.pj}</td>
                <td>${row.pg}</td>
                <td>${row.pp}</td>
                <td>${row.dg > 0 ? "+" + row.dg : row.dg}</td>
                <td><strong>${row.pts}</strong></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    });
    view.innerHTML = html;
    return;
  }

  if (compId === "fifae_wc") {
    const countries = ["FR", "US", "BR", "SA", "AR", "CL", "GB", "ES"];
    const rows = countries.map(code => {
      const top3 = GameState.players.filter(p => p.country === code).sort((a, b) => b.ovr - a.ovr).slice(0, 3);
      const avg = top3.length ? Math.round(top3.reduce((s, p) => s + p.ovr, 0) / top3.length) : 80;
      return { code, top3, avg };
    }).sort((a, b) => b.avg - a.avg);

    view.innerHTML = `
      <div class="card-header"><h3>${Graphics.renderTrophy("fifae_wc", 32)} FIFAe World Cup — Selecciones Nacionales</h3></div>
      <table>
        <thead><tr><th>Selección</th><th>Trío Titular Convocado</th><th>Media</th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td><strong>${Graphics.getFlag(r.code)} ${Graphics.countryNames[r.code]}</strong></td>
              <td>${r.top3.map(p => `${p.name} (${p.ovr})`).join(" • ")}</td>
              <td><span class="badge">OVR ${r.avg}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    return;
  }

  if (compId === "majors_worlds") {
    const globalTop = [...GameState.teams].sort((a, b) => b.points - a.points || getTeamOvr(b.id) - getTeamOvr(a.id));
    view.innerHTML = `
      <div class="card-header"><h3>${Graphics.renderTrophy("rlcs_worlds", 32)} Ranking Global RLCS</h3></div>
      <table>
        <thead><tr><th>#</th><th>Organización</th><th>Región</th><th>OVR</th><th>Puntos RLCS</th></tr></thead>
        <tbody>
          ${globalTop.map((t, idx) => `
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
    return;
  }

  const reg = GameState.selectedRegionTab;
  const regTeams = GameState.teams
    .filter(t => t.region === reg)
    .sort((a, b) => b.points - a.points || getTeamOvr(b.id) - getTeamOvr(a.id));

  view.innerHTML = `
    <div class="card-header">
      <h3>${Graphics.renderTrophy("rlcs_regional", 30)} Tabla Regional RLCS — ${reg}</h3>
      <div style="display:flex;gap:6px;">
        ${["SAM", "EU", "NA", "MENA"].map(r => `
          <button class="btn-sm ${r === reg ? "btn-primary" : "btn-secondary"}" onclick="changeRegionSubTab('${r}')">${r}</button>
        `).join("")}
      </div>
    </div>
    <table>
      <thead><tr><th>Pos</th><th>Equipo</th><th>OVR</th><th>Estrellas</th><th>Puntos RLCS</th></tr></thead>
      <tbody>
        ${regTeams.map((t, idx) => `
          <tr class="${t.id === GameState.userTeamId ? "user-row" : ""}">
            <td>${idx + 1}</td>
            <td style="display:flex;align-items:center;gap:8px;">${Graphics.renderCrest(t, 30)} ${t.name}</td>
            <td>${getTeamOvr(t.id)}</td>
            <td>${"⭐".repeat(t.stars || 0) || "-"}</td>
            <td><strong>${t.points} pts</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// 3. PLANTILLA, ROLES, CONTRATOS Y COACH
function renderSquadAndCoach() {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  document.getElementById("team-chemistry-badge").textContent = `Química: ${getTeamChemistry(userTeam.id)}%`;

  document.getElementById("squad-list").innerHTML = roster.map(p => `
    <div class="player-card ${p.starter ? "starter" : ""}">
      <div class="player-top">
        <strong>${Graphics.getFlag(p.country)} ${p.name} ${p.streak >= 3 ? `<span class="fire-tag">🔥 ON FIRE</span>` : ""}</strong>
        <span class="ovr-pill">${p.ovr}</span>
      </div>
      <div class="muted">${p.age} años • ${p.role || "Striker"} • Contrato: ${p.contractYears || 1} temp.</div>
      <div class="stats-mini">
        <div><span>MEC</span><br><strong>${p.mec}</strong></div>
        <div><span>ROT</span><br><strong>${p.rot}</strong></div>
        <div><span>DEF</span><br><strong>${p.def}</strong></div>
      </div>
      <div class="muted" style="font-size:0.76rem;">Temp: ${p.goals}G • ${p.assists}A • ${p.saves}S</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
        <button class="btn-secondary btn-sm" onclick="toggleStarter('${p.id}')">${p.starter ? "Titular" : "Subir Titular"}</button>
        <button class="btn-outline btn-sm" onclick="renewPlayerContract('${p.id}')">Renovar ($${Math.round(p.value * 0.12).toLocaleString()})</button>
        <button class="btn-danger-outline btn-sm" onclick="sellPlayer('${p.id}')">Vender</button>
      </div>
    </div>
  `).join("");

  const coach = getTeamCoach(userTeam.id);
  document.getElementById("active-coach-box").innerHTML = coach ? `
    <div class="player-card starter">
      <div class="player-top">
        <strong>${Graphics.getFlag(coach.country)} ${coach.name}</strong>
        <span class="ovr-pill">${coach.ovr}</span>
      </div>
      <p class="muted" style="margin-top:6px;">${coach.specialty}</p>
      <p class="muted">Salario: $${coach.salary.toLocaleString()}</p>
    </div>
  ` : `<p class="muted">Sin Head Coach activo.</p>`;
}

function renewPlayerContract(playerId) {
  const userTeam = getUserTeam();
  const p = GameState.players.find(pl => pl.id === playerId);
  const fee = Math.round(p.value * 0.12);
  if (userTeam.budget < fee) {
    alert("No tenés presupuesto suficiente para la prima de renovación.");
    return;
  }
  userTeam.budget -= fee;
  p.contractYears = (p.contractYears || 1) + 2;
  addNews(`✍️ Renovaste el contrato de ${p.name} por 2 temporadas más.`);
  refreshAllUI();
}

function toggleStarter(playerId) {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  const player = roster.find(p => p.id === playerId);
  if (!player) return;
  if (!player.starter) {
    const starters = roster.filter(p => p.starter);
    if (starters.length >= 3) starters[starters.length - 1].starter = false;
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
    alert("Necesitás mínimo 3 jugadores para competir.");
    return;
  }
  const p = GameState.players.find(pl => pl.id === playerId);
  const gain = Math.round(p.value * 0.75);
  userTeam.budget += gain;
  p.teamId = null;
  p.starter = false;
  addNews(`Vendiste a ${p.name} por $${gain.toLocaleString()}.`);
  refreshAllUI();
}

// 4. CANTERA PROPIA VS. CANTERA ALEATORIA GLOBAL
function addCustomProspectNames() {
  const raw = document.getElementById("prospect-names-input").value;
  const destination = document.getElementById("custom-prospect-destination").value;
  const country = document.getElementById("custom-prospect-country").value;
  const rankPref = document.getElementById("custom-prospect-rank").value;

  const names = raw.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
  if (names.length === 0) return;

  names.forEach(name => GameState.customNameQueue.push({ name, destination, country, rankPref }));
  document.getElementById("prospect-names-input").value = "";
  addNews(`Inscribiste ${names.length} prodigios en el radar juvenil (${destination === "MY_ACADEMY" ? "Mi Cantera" : "Canteras Aleatorias del Mundo"}).`, "prodigy");

  // Hacer aparecer hasta 2 de inmediato para verlos en acción
  triggerProspectDiscovery();
  if (GameState.customNameQueue.length > 0) triggerProspectDiscovery();
  refreshAllUI();
}

function triggerProspectDiscovery() {
  const countries = ["AR", "CL", "BR", "FR", "US", "SA", "ES", "GB"];
  let name, country, rank, destination;

  if (GameState.customNameQueue.length > 0) {
    const custom = GameState.customNameQueue.shift();
    name = custom.name;
    destination = custom.destination;
    country = custom.country === "RANDOM" ? countries[Math.floor(Math.random() * countries.length)] : custom.country;
    rank = custom.rankPref === "AUTO" ? ["GC2", "GC3", "SSL"][Math.floor(Math.random() * 3)] : custom.rankPref;
  } else {
    name = generateUniqueName();
    destination = Math.random() > 0.5 ? "MY_ACADEMY" : "RANDOM_ACADEMY";
    country = countries[Math.floor(Math.random() * countries.length)];
    rank = ["GC2", "GC3", "SSL"][Math.floor(Math.random() * 3)];
  }

  const age = rank === "GC2" ? 12 : (rank === "GC3" ? 13 : 14);
  const ovr = rank === "SSL" ? 81 : (rank === "GC3" ? 77 : 73);
  const pot = Math.floor(Math.random() * 8) + 91;

  let ownerTeamId = GameState.userTeamId;
  let isUserAcademy = true;

  if (destination === "RANDOM_ACADEMY") {
    const otherTeams = GameState.teams.filter(t => t.id !== GameState.userTeamId);
    const randomClub = otherTeams[Math.floor(Math.random() * otherTeams.length)];
    ownerTeamId = randomClub.id;
    isUserAcademy = false;
    addNews(`🌍 ¡Cantera Global! El prodigio ${name} (${age} años, ${rank}) ingresó a la academia de ${randomClub.name}.`, "prodigy");
  } else {
    addNews(`🌟 ¡Mi Cantera! Reclutaste al prodigio ${name} (${age} años, ${rank}, Pot. ${pot}).`, "prodigy");
  }

  GameState.academyProspects.push({
    id: "acad_" + Date.now() + "_" + Math.random(),
    name, country, age, rank, ovr, pot,
    ownerTeamId,
    isUserAcademy,
    loanLeagueId: null,
    loanClub: null,
    loanGoals: 0,
    loanAssists: 0
  });
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
  addNews(`Cediste a ${p.name} (${p.age} años) a ${club} (${league.name}).`, "loan");
  refreshAllUI();
}

function promoteProspectToFirstTeam(prospectId) {
  const idx = GameState.academyProspects.findIndex(x => x.id === prospectId);
  if (idx === -1) return;
  const p = GameState.academyProspects[idx];
  if (p.age < 15) {
    alert(`${p.name} tiene ${p.age} años. La edad mínima RLCS es 15 años.`);
    return;
  }
  const roles = ["Striker", "Playmaker", "Third Man"];
  GameState.players.push({
    id: "pro_" + Date.now(),
    name: p.name, country: p.country, age: p.age, ovr: p.ovr, pot: p.pot,
    mec: p.ovr + 2, rot: p.ovr - 1, def: p.ovr - 1,
    role: roles[Math.floor(Math.random() * 3)],
    contractYears: 3,
    teamId: GameState.userTeamId,
    starter: false,
    value: p.ovr * 4200,
    goals: 0, assists: 0, saves: 0, streak: 0
  });
  GameState.academyProspects.splice(idx, 1);
  addNews(`¡${p.name} (15 años, OVR ${p.ovr}) debuta en el primer equipo!`, "prodigy");
  refreshAllUI();
}

function progressAcademyStep() {
  const coach = getTeamCoach(getUserTeam().id);
  const formadorBonus = (coach && coach.specialty.includes("Formador")) ? 1 : 0;

  GameState.academyProspects.forEach(p => {
    // Los canteranos de otros clubes o cedidos suman estadísticas juveniles
    if (p.loanLeagueId || !p.isUserAcademy) {
      p.loanGoals += Math.floor(Math.random() * 5) + 2;
      p.loanAssists += Math.floor(Math.random() * 4) + 1;
      if (Math.random() < 0.45) {
        p.ovr = Math.min(p.pot, p.ovr + 1 + (p.isUserAcademy ? formadorBonus : 0));
        if (p.ovr >= 76 && p.rank === "GC2") p.rank = "GC3";
        if (p.ovr >= 80 && p.rank === "GC3") p.rank = "SSL";
      }
    }
  });
}

function updateNationalLeaguesStep() {
  Object.keys(GameState.nationalTables).forEach(lid => {
    const table = GameState.nationalTables[lid];
    for (let i = 0; i < table.length; i += 2) {
      if (!table[i + 1]) break;
      const a = table[i], b = table[i + 1];
      a.pj++; b.pj++;
      const gA = Math.floor(Math.random() * 4) + 1;
      const gB = Math.floor(Math.random() * 4) + 1;
      if (gA >= gB) {
        a.pg++; a.pts += 3; a.dg += (gA - gB + 1);
        b.pp++; b.dg -= (gA - gB + 1);
      } else {
        b.pg++; b.pts += 3; b.dg += (gB - gA);
        a.pp++; a.dg -= (gB - gA);
      }
    }
    table.sort((a, b) => b.pts - a.pts || b.dg - a.dg);
  });
}

function renderAcademy() {
  const qBox = document.getElementById("queued-names-box");
  qBox.innerHTML = GameState.customNameQueue.length
    ? `<div style="width:100%;font-size:0.78rem;color:#94a3b8;">En espera (${GameState.customNameQueue.length}):</div>` +
      GameState.customNameQueue.map(q => `<span class="queued-chip">${q.name}</span>`).join("")
    : `<span class="muted">Sin nombres en cola.</span>`;

  const filter = document.getElementById("academy-filter").value;
  const filtered = GameState.academyProspects.filter(p => filter === "MINE" ? p.isUserAcademy : !p.isUserAcademy);

  document.getElementById("academy-players-list").innerHTML = filtered.length ? filtered.map(p => {
    const ownerClub = getTeamById(p.ownerTeamId)?.name || "Academia";
    return `
      <div class="academy-item">
        <div>
          <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> ${Graphics.renderRankBadge(p.rank)}
          <div class="muted">${p.age} años • OVR ${p.ovr} (Pot. ${p.pot}) • ${p.isUserAcademy ? "Tu Cantera" : ownerClub}</div>
          <span class="badge">${p.loanClub ? `Cedido en ${p.loanClub}` : "Liga Juvenil"} (${p.loanGoals}G / ${p.loanAssists}A)</span>
        </div>
        ${p.isUserAcademy ? `
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${!p.loanLeagueId ? `
              <select onchange="sendProspectOnLoan('${p.id}', this.value)" style="margin:0;padding:5px;font-size:0.78rem;">
                <option value="">Ceder a Liga...</option>
                ${InitialData.nationalLeagues.map(l => `<option value="${l.id}">${l.name}</option>`).join("")}
              </select>
            ` : ""}
            <button class="btn-primary btn-sm" onclick="promoteProspectToFirstTeam('${p.id}')">Subir al Primer Equipo</button>
          </div>
        ` : ""}
      </div>
    `;
  }).join("") : `<p class="muted">No hay juveniles registrados en esta vista todavía.</p>`;
}

// 5. MERCADO, NEGOCIACIÓN Y SPONSORS
function renderMarket() {
  const filter = document.getElementById("market-type-filter").value;
  const list = document.getElementById("market-list");
  const userTeam = getUserTeam();

  // Render Sponsors
  const spBox = document.getElementById("sponsor-box");
  if (GameState.activeSponsor) {
    spBox.innerHTML = `<div class="offer-alert"><strong>💼 Patrocinador Activo: ${GameState.activeSponsor.name}</strong><div class="muted">${GameState.activeSponsor.bonusDesc}</div></div>`;
  } else {
    spBox.innerHTML = InitialData.sponsors.map(sp => `
      <div class="academy-item">
        <div>
          <strong>${sp.name}</strong>
          <div class="muted">Pago inicial: $${sp.upfront.toLocaleString()} • ${sp.bonusDesc}</div>
        </div>
        <button class="btn-success btn-sm" onclick="signSponsor('${sp.id}')">Firmar</button>
      </div>
    `).join("");
  }

  if (filter === "COACHES") {
    list.innerHTML = GameState.coaches
      .filter(c => c.teamId !== userTeam.id)
      .map(c => `
        <div class="market-item">
          <div>
            <strong>${Graphics.getFlag(c.country)} ${c.name}</strong> <span class="badge">OVR ${c.ovr}</span>
            <div class="muted">${c.specialty}</div>
            <div class="muted">Contrato: $${c.salary.toLocaleString()}</div>
          </div>
          <button class="btn-primary btn-sm" onclick="hireCoach('${c.id}')">Contratar</button>
        </div>
      `).join("");
    return;
  }

  const available = GameState.players.filter(p => p.teamId !== userTeam.id);
  list.innerHTML = available.map(p => {
    const currentClub = p.teamId ? getTeamById(p.teamId)?.name : "Agente Libre";
    return `
      <div class="market-item">
        <div>
          <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> <span class="badge">OVR ${p.ovr}</span>
          <div class="muted">${p.age} años • ${p.role || "Striker"} • ${currentClub}</div>
          <div class="money" style="font-size:0.85rem;">Valor: $${p.value.toLocaleString()}</div>
        </div>
        <button class="btn-primary btn-sm" onclick="openNegotiationModal('${p.id}')">Negociar</button>
      </div>
    `;
  }).join("");
}

function signSponsor(spId) {
  const sp = InitialData.sponsors.find(s => s.id === spId);
  if (!sp) return;
  GameState.activeSponsor = sp;
  getUserTeam().budget += sp.upfront;
  addNews(`💼 Firmaste contrato de patrocinio con ${sp.name} (+$${sp.upfront.toLocaleString()}).`);
  refreshAllUI();
}

function openNegotiationModal(playerId) {
  const p = GameState.players.find(x => x.id === playerId);
  if (!p) return;
  ActiveNegotiationPlayerId = playerId;
  const club = p.teamId ? getTeamById(p.teamId).name : "Agente Libre";
  document.getElementById("neg-title").textContent = `Negociar por ${p.name} (OVR ${p.ovr})`;
  document.getElementById("neg-subtitle").textContent = `${club} • Valor: $${p.value.toLocaleString()}`;
  document.getElementById("neg-details").innerHTML = `
    <div>• Edad: <strong>${p.age} años</strong> | Rol: <strong>${p.role || "Striker"}</strong> | Potencial: <strong>${p.pot}</strong></div>
    <div>• Prestigio mínimo exigido: <strong>${p.ovr >= 92 ? "86+" : "72+"}</strong></div>
  `;
  document.getElementById("neg-offer-amount").value = p.value;
  document.getElementById("neg-feedback").classList.add("hidden");
  document.getElementById("negotiation-modal").classList.remove("hidden");
}

function closeNegotiationModal() {
  document.getElementById("negotiation-modal").classList.add("hidden");
  ActiveNegotiationPlayerId = null;
}

function submitTransferOffer() {
  const p = GameState.players.find(x => x.id === ActiveNegotiationPlayerId);
  const userTeam = getUserTeam();
  const offer = parseInt(document.getElementById("neg-offer-amount").value) || 0;
  const years = parseInt(document.getElementById("neg-contract-years").value) || 2;
  const role = document.getElementById("neg-role-promise").value;
  const fb = document.getElementById("neg-feedback");
  fb.classList.remove("hidden");

  if (offer > userTeam.budget) {
    fb.textContent = "❌ Presupuesto insuficiente.";
    return;
  }
  if (p.ovr >= 92 && userTeam.rep < 86 && offer < p.value * 1.25) {
    fb.textContent = `⚠️ ${p.name} exige un club de mayor prestigio (${userTeam.rep}/86) o una oferta 25% superior a su valor.`;
    return;
  }

  const ratio = offer / p.value;
  const roleBonus = role === "STARTER" ? 0.12 : -0.15;
  if (ratio + roleBonus >= 1.02) {
    userTeam.budget -= offer;
    p.teamId = userTeam.id;
    p.contractYears = years;
    p.starter = role === "STARTER" && getTeamRoster(userTeam.id, true).length < 3;
    addNews(`🤝 ¡FICHAJE CERRADO! ${p.name} firmó por ${years} temporadas ($${offer.toLocaleString()}).`);
    closeNegotiationModal();
    refreshAllUI();
  } else if (ratio + roleBonus >= 0.85) {
    fb.textContent = `💬 Contraoferta: Piden $${Math.round(p.value * 1.08).toLocaleString()} y rol de Titular.`;
  } else {
    fb.textContent = `❌ Oferta rechazada por ser demasiado baja.`;
  }
}

function hireCoach(coachId) {
  const userTeam = getUserTeam();
  const c = GameState.coaches.find(x => x.id === coachId);
  if (!c || userTeam.budget < c.salary) return alert("Presupuesto insuficiente.");
  const old = getTeamCoach(userTeam.id);
  if (old) old.teamId = null;
  userTeam.budget -= c.salary;
  c.teamId = userTeam.id;
  addNews(`${userTeam.name} contrató a ${c.name} como Head Coach.`);
  refreshAllUI();
}

// 6. PREMIOS INDIVIDUALES (BALÓN DE ORO, KDB, BOTA DE ORO, CANTERAS) Y VITRINA
function calculateSeasonIndividualAwards(finishedSeason) {
  const allPros = [...GameState.players];
  const ballonDor = [...allPros].sort((a, b) => (b.ovr * 2 + b.goals + b.assists) - (a.ovr * 2 + a.goals + a.assists))[0];
  const goldenBoot = [...allPros].sort((a, b) => b.goals - a.goals)[0];
  const kdbAward = [...allPros].sort((a, b) => b.assists - a.assists)[0];
  const goldenGlove = [...allPros].sort((a, b) => b.saves - a.saves)[0];
  const rookie = allPros.filter(p => p.age <= 18).sort((a, b) => b.ovr - a.ovr)[0] || ballonDor;

  // Premios de Canteras
  const youthPool = [...GameState.academyProspects];
  const youthBallon = youthPool.sort((a, b) => (b.ovr + b.loanGoals) - (a.ovr + a.loanGoals))[0];
  const youthBoot = [...GameState.academyProspects].sort((a, b) => b.loanGoals - a.loanGoals)[0];

  const awardEntry = {
    season: finishedSeason,
    ballonDor: ballonDor ? `${ballonDor.name} (${getTeamById(ballonDor.teamId)?.tag || "FA"})` : "-",
    goldenBoot: goldenBoot ? `${goldenBoot.name} (${goldenBoot.goals} goles)` : "-",
    kdbAward: kdbAward ? `${kdbAward.name} (${kdbAward.assists} asist.)` : "-",
    goldenGlove: goldenGlove ? `${goldenGlove.name} (${goldenGlove.saves} ataj.)` : "-",
    rookie: rookie ? `${rookie.name} (${rookie.age} años)` : "-",
    youthBallon: youthBallon ? `${youthBallon.name} (${getTeamById(youthBallon.ownerTeamId)?.tag || "Cantera"})` : "Sin canteranos",
    youthBoot: youthBoot ? `${youthBoot.name} (${youthBoot.loanGoals} goles)` : "-"
  };

  GameState.awardsHistory.unshift(awardEntry);
  addNews(`🏆 GALA DE PREMIOS ${finishedSeason}: Rocket d'Or para ${awardEntry.ballonDor} | Premio KDB para ${awardEntry.kdbAward} | Balón de Oro Juvenil para ${awardEntry.youthBallon}.`, "prodigy");
}

function renderAwardsAndTrophies() {
  const awardsEl = document.getElementById("individual-awards-history");
  awardsEl.innerHTML = GameState.awardsHistory.length
    ? GameState.awardsHistory.map(a => `
        <div class="award-card">
          <h4>🏆 Gala de Premios — Temporada ${a.season}</h4>
          <div style="margin-top:6px;font-size:0.86rem;line-height:1.6;">
            <div>🥇 <strong>Rocket d'Or (Balón de Oro):</strong> ${a.ballonDor}</div>
            <div>⚽ <strong>Bota de Oro:</strong> ${a.goldenBoot}</div>
            <div>🎯 <strong>Premio KDB (Máximo Asistidor):</strong> ${a.kdbAward}</div>
            <div>🧤 <strong>Guante de Oro:</strong> ${a.goldenGlove}</div>
            <div>🌟 <strong>Rookie del Año:</strong> ${a.rookie}</div>
            <hr style="border-color:var(--border);margin:6px 0;">
            <div>🌱 <strong>Balón de Oro Canteras:</strong> ${a.youthBallon}</div>
            <div>👟 <strong>Bota de Oro Juvenil:</strong> ${a.youthBoot}</div>
          </div>
        </div>
      `).join("")
    : `<p class="muted">Los premios individuales (Rocket d'Or, Bota de Oro, Premio KDB y premios de Cantera) se entregan al finalizar cada temporada.</p>`;

  const cabinet = document.getElementById("club-trophy-cabinet");
  cabinet.innerHTML = GameState.trophiesWon.length
    ? GameState.trophiesWon.map(t => `
        <div class="trophy-item">
          ${Graphics.renderTrophy(t.compId, 52)}
          <h4 style="margin-top:6px;font-size:0.86rem;">${t.compName}</h4>
          <span class="badge">Temp. ${t.season}</span>
        </div>
      `).join("")
    : `<p class="muted">Aún no hay copas en la vitrina.</p>`;

  const hofEl = document.getElementById("hall-of-fame-list");
  hofEl.innerHTML = GameState.hallOfFame.length
    ? GameState.hallOfFame.map(h => `<div class="news-item prodigy">🏛️ <strong>${h.name}</strong> — Retirado a los ${h.age} años tras hacer historia en el club (${h.goals}G / ${h.assists}A).</div>`).join("")
    : `<p class="muted">Los jugadores que se retiren en tu club quedarán inmortalizados aquí.</p>`;

  const hist = document.getElementById("champions-history-list");
  hist.innerHTML = GameState.championsHistory.length
    ? GameState.championsHistory.map(h => `<div class="news-item"><strong>[${h.season}] ${h.compName}:</strong> ${h.winnerName}</div>`).join("")
    : `<p class="muted">Sin campeones registrados aún.</p>`;
}

function populateEditorTeams() {
  const sel = document.getElementById("edit-person-team");
  sel.innerHTML = `<option value="">Agente Libre / Sin Equipo</option>` +
    GameState.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
}

function createCustomPerson() {
  const name = document.getElementById("edit-person-name").value.trim();
  const role = document.getElementById("edit-person-role").value;
  const tacticRole = document.getElementById("edit-person-tactic-role").value;
  const country = document.getElementById("edit-person-country").value;
  const age = parseInt(document.getElementById("edit-person-age").value) || 16;
  const ovr = parseInt(document.getElementById("edit-person-ovr").value) || 84;
  const pot = parseInt(document.getElementById("edit-person-pot").value) || 90;
  const teamId = document.getElementById("edit-person-team").value || null;
  if (!name) return;

  if (role === "COACH") {
    GameState.coaches.push({
      id: "c_custom_" + Date.now(), name, country, ovr,
      specialty: "Formador de Talento (+35% progreso juvenil)", teamId, salary: ovr * 900
    });
  } else {
    GameState.players.push({
      id: "p_custom_" + Date.now(), name, country, age, ovr, pot,
      mec: ovr + 1, rot: ovr, def: ovr - 1, role: tacticRole, contractYears: 2, teamId,
      starter: teamId ? getTeamRoster(teamId, true).length < 3 : false,
      value: ovr * 4500, goals: 0, assists: 0, saves: 0, streak: 0
    });
  }
  document.getElementById("edit-person-name").value = "";
  addNews(`Se añadió a ${name} a la base de datos.`);
  refreshAllUI();
}

// CAMBIO DE TEMPORADA
function advanceNewSeason() {
  const finishedSeason = GameState.season;
  calculateSeasonIndividualAwards(finishedSeason);

  // Bono de sponsor NVIDIA por química
  if (GameState.activeSponsor?.id === "sp_nvidia" && getTeamChemistry(GameState.userTeamId) >= 88) {
    getUserTeam().budget += 20000;
    addNews(`💼 Bono NVIDIA: +$20,000 por mantener química superior al 88%.`);
  }

  GameState.season++;
  GameState.scheduleIndex = 0;
  GameState.activeSponsor = null;
  addNews(`=== INICIO DE LA TEMPORADA ${GameState.season} ===`, "prodigy");

  GameState.teams.forEach(t => t.points = 0);
  buildNationalTables();

  // Envejecer canteranos y promover automáticamente a los de otros clubes cuando cumplen 15
  GameState.academyProspects = GameState.academyProspects.filter(p => {
    p.age++;
    p.ovr = Math.min(p.pot, p.ovr + 2);
    p.loanGoals = 0;
    p.loanAssists = 0;

    if (!p.isUserAcademy && p.age >= 15) {
      const owner = getTeamById(p.ownerTeamId);
      if (owner) {
        GameState.players.push({
          id: "ai_pro_" + Date.now() + Math.random(),
          name: p.name, country: p.country, age: p.age, ovr: p.ovr, pot: p.pot,
          mec: p.ovr + 1, rot: p.ovr, def: p.ovr - 1, role: "Striker", contractYears: 3,
          teamId: owner.id, starter: false, value: p.ovr * 4200,
          goals: 0, assists: 0, saves: 0, streak: 0
        });
        addNews(`🎓 El canterano ${p.name} (15 años, OVR ${p.ovr}) fue promovido al primer equipo de ${owner.name}.`, "prodigy");
      }
      return false;
    }
    return true;
  });

  // Envejecer pros, descontar contratos, resetear stats de temporada y retirar veteranos
  GameState.players = GameState.players.filter(p => {
    p.age++;
    if (p.teamId) {
      p.contractYears = (p.contractYears || 1) - 1;
      if (p.contractYears <= 0) {
        if (p.teamId === GameState.userTeamId) {
          addNews(`⚠️ Venció el contrato de ${p.name} y quedó como Agente Libre.`);
        }
        p.teamId = null;
        p.starter = false;
      }
    }

    if (p.age <= 21 && p.ovr < p.pot) {
      p.ovr = Math.min(p.pot, p.ovr + Math.floor(Math.random() * 2) + 1);
      p.mec = Math.min(99, p.mec + 1);
    }

    if (p.age >= 26 && Math.random() < 0.45) {
      if (p.teamId === GameState.userTeamId) {
        GameState.hallOfFame.push({ name: p.name, age: p.age, goals: p.goals, assists: p.assists });
        addNews(`🏛️ ¡${p.name} se retira en tu club e ingresa al Salón de la Fama de la Org!`);
      } else {
        addNews(`${p.name} anuncia su retiro del Rocket League profesional a los ${p.age} años.`);
      }
      if (Math.random() < 0.5) {
        GameState.coaches.push({
          id: "c_ret_" + Date.now() + Math.random(),
          name: p.name, country: p.country, ovr: Math.max(82, p.ovr - 3),
          specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: null, salary: 75000
        });
      }
      return false;
    }

    // Resetear estadísticas para la nueva temporada
    p.goals = 0;
    p.assists = 0;
    p.saves = 0;
    return true;
  });

  triggerProspectDiscovery();
  triggerProspectDiscovery();
  generateTournamentBracket();
  pickNextOpponent();
}

function saveGame(notify) {
  localStorage.setItem("rl_career_save_v3", JSON.stringify(GameState));
  if (notify) alert("Partida v3.0 guardada correctamente.");
}

function loadSavedGame() {
  const raw = localStorage.getItem("rl_career_save_v3");
  if (!raw) return;
  GameState = JSON.parse(raw);
  launchGameUI();
}

function resetCareer() {
  if (confirm("¿Seguro que querés reiniciar y volver al menú?")) {
    localStorage.removeItem("rl_career_save_v3");
    location.reload();
  }
}
