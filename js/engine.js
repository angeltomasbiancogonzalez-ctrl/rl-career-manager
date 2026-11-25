let GameState = {
  season: 2026,
  scheduleIndex: 0,
  userTeamId: null,
  teams: [],
  players: [],
  coaches: [],
  academyProspects: [],
  customNameQueue: [],
  nationalTables: {},
  currentBracket: { qf: [], sf: [], gf: [] },
  trophiesWon: [],
  championsHistory: [],
  news: [],
  currentOpponentId: null,
  selectedCompView: "rlcs_regional",
  selectedRegionTab: "SAM"
};

// Estado de la serie en vivo (interactiva mapa por mapa)
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
  if (localStorage.getItem("rl_career_save_v2")) {
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
        ${Graphics.renderCrest(team, 60)}
        <h3>${team.name}</h3>
        <span class="badge">${team.region} • OVR ${avgOvr} • Rep ${team.rep}</span>
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
  document.getElementById("custom-crest-preview").innerHTML = Graphics.renderCrest(mockTeam, 86);
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
    name, tag, region, rep: 72, color1, color2, shape, logoUrl,
    budget: 220000,
    points: 0
  };

  initBaseState();
  GameState.teams.push(customTeam);
  GameState.userTeamId = "custom_user";
  GameState.selectedRegionTab = region;

  const regionCountry = { SAM: "AR", EU: "FR", NA: "US", MENA: "SA" }[region] || "AR";
  for (let i = 1; i <= 3; i++) {
    GameState.players.push({
      id: "u_init_" + i,
      name: generateUniqueName(),
      country: regionCountry,
      age: 17 + i,
      ovr: 83 + i,
      pot: 89 + i,
      mec: 84 + i,
      rot: 83 + i,
      def: 82 + i,
      teamId: "custom_user",
      starter: true,
      value: 160000
    });
  }

  addNews(`¡${name} (${tag}) funda su división de Rocket League en ${region}!`);
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
  GameState.news = [];
  buildNationalTables();
  spawnInitialProspects();
}

function buildNationalTables() {
  GameState.nationalTables = {};
  InitialData.nationalLeagues.forEach(league => {
    GameState.nationalTables[league.id] = league.clubs.map(club => ({
      club,
      pj: 0,
      pg: 0,
      pp: 0,
      dg: 0,
      pts: 0
    }));
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
      loanGoals: 0,
      loanAssists: 0
    });
  });
}

function launchGameUI() {
  document.getElementById("setup-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  generateTournamentBracket();
  pickNextOpponent();
  refreshAllUI();
  saveGame(false);
}

// HELPERS
function getUserTeam() { return GameState.teams.find(t => t.id === GameState.userTeamId); }
function getTeamById(id) { return GameState.teams.find(t => t.id === id); }
function getTeamRoster(teamId, onlyStarters = false) {
  return GameState.players.filter(p => p.teamId === teamId && (!onlyStarters || p.starter));
}
function getTeamCoach(teamId) { return GameState.coaches.find(c => c.teamId === teamId); }

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
  if (GameState.news.length > 35) GameState.news.pop();
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
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const ovr = getTeamOvr(team.id);

  document.getElementById("top-club-crest").innerHTML = Graphics.renderCrest(team, 44);
  document.getElementById("top-club-name").textContent = team.name;
  document.getElementById("top-club-meta").textContent = `${team.region} • OVR ${ovr} • Rep ${team.rep}`;
  document.getElementById("top-season").textContent = GameState.season;
  document.getElementById("top-stage").textContent = `${stage.compName}`;
  document.getElementById("top-budget").textContent = "$" + team.budget.toLocaleString();
  document.getElementById("top-points").textContent = team.points + " pts";

  renderOffice();
  renderCompetitionView();
  renderSquadAndCoach();
  renderAcademy();
  renderMarket();
  renderTrophiesTab();
  populateEditorTeams();
}

// GENERACIÓN DE LLAVES / PLAYOFFS POR TORNEO
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

  // Asegurar que el equipo del usuario esté en el cuadro
  if (!pool.some(t => t.id === userTeam.id)) {
    pool[pool.length - 1] = userTeam;
  }

  GameState.currentBracket = {
    compName: stage.compName,
    qf: [
      { home: pool[0], away: pool[7], scoreH: "-", scoreA: "-" },
      { home: pool[3], away: pool[4], scoreH: "-", scoreA: "-" },
      { home: pool[1], away: pool[6], scoreH: "-", scoreA: "-" },
      { home: pool[2], away: pool[5], scoreH: "-", scoreA: "-" }
    ],
    sf: [
      { home: null, away: null, scoreH: "-", scoreA: "-" },
      { home: null, away: null, scoreH: "-", scoreA: "-" }
    ],
    gf: [
      { home: null, away: null, scoreH: "-", scoreA: "-" }
    ]
  };
}

function updateBracketProgress(userWon, oppTeam, homeWins, awayWins) {
  const userTeam = getUserTeam();
  const b = GameState.currentBracket;
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];

  // Simular cruces de otros equipos en el cuadro
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
      if (idx < 2) {
        if (idx === 0) b.sf[0].home = winner;
        else b.sf[0].away = winner;
      } else {
        if (idx === 2) b.sf[1].home = winner;
        else b.sf[1].away = winner;
      }
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

// 1. OFICINA Y PARTIDO
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

function renderOffice() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId) || GameState.teams[0];
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];

  document.getElementById("next-event-title").textContent = stage.compName;
  document.getElementById("next-round-subtitle").textContent = `${stage.roundName} • Formato ${stage.format}`;
  document.getElementById("next-event-trophy").innerHTML = Graphics.renderTrophy(stage.compId, 44);

  const isFIFAe = stage.compId === "fifae_wc";
  const homeTitle = isFIFAe ? `Selección ${Graphics.countryNames[getTeamRoster(userTeam.id, true)[0]?.country] || "Nacional"}` : userTeam.name;
  const awayTitle = isFIFAe ? `Selección ${Graphics.countryNames[getTeamRoster(opp.id, true)[0]?.country] || "Rival"}` : opp.name;

  document.getElementById("next-match-box").innerHTML = `
    <div class="vs-team">
      ${Graphics.renderCrest(userTeam, 62)}
      <strong>${homeTitle}</strong>
      <span class="badge">OVR ${getTeamOvr(userTeam.id)}</span>
    </div>
    <div class="vs-center">
      <div class="vs-badge">VS</div>
      <div class="muted">Premio ronda: $${stage.prize.toLocaleString()}</div>
    </div>
    <div class="vs-team">
      ${Graphics.renderCrest(opp, 62)}
      <strong>${awayTitle}</strong>
      <span class="badge">OVR ${getTeamOvr(opp.id)}</span>
    </div>
  `;

  document.getElementById("news-feed").innerHTML = GameState.news.map(n => `
    <div class="news-item ${n.type}">
      <small class="muted">[Temp. ${n.season}]</small> ${n.text}
    </div>
  `).join("");
}

// MODO 1: JUGAR SERIE EN VIVO (INTERACTIVO MAPA A MAPA)
function startLiveSeries() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];

  LiveMatch = {
    active: true,
    homeWins: 0,
    awayWins: 0,
    winsNeeded: stage.format === "Bo7" ? 4 : 3,
    gameNum: 1,
    tactic: "balanced",
    timeoutUsed: false,
    timeoutBoostActive: false
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
  document.getElementById("live-events-log").innerHTML = `<div>🎙️ ¡Arranca la serie entre <strong>${userTeam.name}</strong> y <strong>${opp.name}</strong>! Tocá "Jugar Siguiente Mapa".</div>`;
}

function changeLiveTactic() {
  LiveMatch.tactic = document.getElementById("live-tactic-select").value;
  logLiveEvent(`📋 Cambiaste la táctica del equipo a: <strong>${LiveMatch.tactic.toUpperCase()}</strong>.`);
}

function useTacticalTimeout() {
  if (LiveMatch.timeoutUsed) return;
  LiveMatch.timeoutUsed = true;
  LiveMatch.timeoutBoostActive = true;
  const coach = getTeamCoach(getUserTeam().id);
  const coachName = coach ? coach.name : "El cuerpo técnico";
  document.getElementById("btn-timeout").disabled = true;
  document.getElementById("btn-timeout").textContent = "Timeout Usado";
  logLiveEvent(`⏸️ <strong>TIMEOUT TÁCTICO:</strong> ${coachName} reacomoda las rotaciones (+5 OVR para el próximo mapa).`);
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

  // Simular goles minuto a minuto del mapa de 5 minutos
  let gHome = 0;
  let gAway = 0;
  const minutes = ["4:12", "3:05", "1:48", "0:34"];
  logLiveEvent(`<hr style="border-color:#1e293b;margin:6px 0;"><strong>▶ JUEGO ${LiveMatch.gameNum} EN MARCHA:</strong>`);

  minutes.forEach(min => {
    if (Math.random() < 0.65) {
      if (Math.random() < homeChance) {
        gHome++;
        const scorer = homeStarters[Math.floor(Math.random() * homeStarters.length)]?.name || "Delantero";
        const shotType = ["Flip Reset", "Double Tap", "Tiro al ángulo", "Pase de contraataque"][Math.floor(Math.random() * 4)];
        logLiveEvent(`⏱️ [${min}] ⚽ ¡GOL DE <strong>${scorer}</strong> (${userTeam.tag})! (${shotType})`);
      } else {
        gAway++;
        const scorer = awayStarters[Math.floor(Math.random() * awayStarters.length)]?.name || "Rival";
        logLiveEvent(`⏱️ [${min}] ⚽ Gol de <strong>${scorer}</strong> (${opp.tag}).`);
      }
    }
  });

  // Desempate Overtime si van empatados
  let otText = "";
  if (gHome === gAway) {
    otText = " (OVERTIME +1:14)";
    if (Math.random() < homeChance + tacticSwing * 0.02) {
      gHome++;
      const hero = homeStarters[0]?.name || "Capitán";
      logLiveEvent(`🔥 <strong>¡GOL DE ORO EN OVERTIME DE ${hero}!</strong>`);
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
    const won = LiveMatch.homeWins > LiveMatch.awayWins;
    logLiveEvent(`<br>🏆 <strong>SERIE FINALIZADA: ${userTeam.tag} ${LiveMatch.homeWins} - ${LiveMatch.awayWins} ${opp.tag}</strong> (${won ? "VICTORIA" : "DERROTA"})`);
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

// MODO 2: SIMULAR RÁPIDO (INSTANTÁNEO)
function simulateSeriesInstant() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const winsNeeded = stage.format === "Bo7" ? 4 : 3;

  let h = 0, a = 0;
  const diff = getTeamOvr(userTeam.id) - getTeamOvr(opp.id);
  const chance = Math.min(0.85, Math.max(0.15, 0.50 + diff * 0.035));

  while (h < winsNeeded && a < winsNeeded) {
    if (Math.random() < chance) h++;
    else a++;
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

  if (won) {
    userTeam.budget += stage.prize;
    userTeam.points += stage.points;
    userTeam.rep = Math.min(99, userTeam.rep + (stage.isFinal ? 3 : 1));
    addNews(`✅ Victoria ${homeWins}-${awayWins} vs ${opp.name} en ${stage.compName} (${stage.roundName}). +$${stage.prize.toLocaleString()}.`);

    // SI ERA LA GRAN FINAL DEL TORNEO -> PANTALLA DE CAMPEÓN
    if (stage.isFinal) {
      triggerChampionCeremony(stage, userTeam);
    }
  } else {
    opp.points += stage.points;
    userTeam.budget += Math.round(stage.prize * 0.25);
    addNews(`❌ Derrota ${homeWins}-${awayWins} ante ${opp.name} en ${stage.compName} (${stage.roundName}).`);
    if (stage.isFinal) {
      GameState.championsHistory.unshift({
        season: GameState.season,
        compId: stage.compId,
        compName: stage.compName,
        winnerName: opp.name
      });
    }
  }

  // Simular puntos de los demás equipos
  GameState.teams.forEach(t => {
    if (t.id !== userTeam.id && t.id !== opp.id && Math.random() > 0.45) {
      t.points += Math.round(stage.points * 0.75);
    }
  });

  progressAcademyStep();
  updateNationalLeaguesStep();

  const prevComp = stage.compName;
  GameState.scheduleIndex++;

  if (GameState.scheduleIndex >= InitialData.seasonSchedule.length) {
    advanceNewSeason();
  } else {
    const nextStage = InitialData.seasonSchedule[GameState.scheduleIndex];
    if (nextStage.compName !== prevComp) {
      generateTournamentBracket();
    }
    pickNextOpponent();
  }

  refreshAllUI();
  saveGame(false);
}

// CEREMONIA DE CAMPEÓN
function triggerChampionCeremony(stage, team) {
  const starters = getTeamRoster(team.id, true);
  const mvp = [...starters].sort((a, b) => b.ovr - a.ovr)[0]?.name || "Capitán";

  GameState.trophiesWon.push({
    season: GameState.season,
    compId: stage.compId,
    compName: stage.compName
  });

  GameState.championsHistory.unshift({
    season: GameState.season,
    compId: stage.compId,
    compName: stage.compName,
    winnerName: team.name
  });

  document.getElementById("champ-trophy-icon").innerHTML = Graphics.renderTrophy(stage.compId, 86);
  document.getElementById("champ-tournament-name").textContent = `${stage.compName} ${GameState.season}`;
  document.getElementById("champ-team-name").textContent = team.name;
  document.getElementById("champ-roster-names").textContent = starters.map(p => p.name).join(" • ");
  document.getElementById("champ-mvp-badge").textContent = `MVP DEL TORNEO: ${mvp}`;
  document.getElementById("champ-prize-text").textContent = `Premio ganado: +$${stage.prize.toLocaleString()}`;
  document.getElementById("champion-modal").classList.remove("hidden");
}

function closeChampionModal() {
  document.getElementById("champion-modal").classList.add("hidden");
}

// 2. COMPETENCIAS, LLAVES Y LIGAS
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
      <div class="card-header">
        <h3>Cuadro de Playoffs — ${b.compName || "Torneo Actual"}</h3>
      </div>
      <div class="bracket-container">
        <div class="bracket-round">
          <h4>CUARTOS DE FINAL</h4>
          ${b.qf.map(renderMatchBox).join("")}
        </div>
        <div class="bracket-round">
          <h4>SEMIFINALES</h4>
          ${b.sf.map(renderMatchBox).join("")}
        </div>
        <div class="bracket-round">
          <h4>GRAN FINAL</h4>
          ${b.gf.map(renderMatchBox).join("")}
        </div>
      </div>
    `;
    return;
  }

  if (compId === "national_leagues") {
    let html = `<h3>Ligas Nacionales Oficiales (Destino de Canteranos Cedidos)</h3><p class="muted">Cada fecha se simula en paralelo con tus partidos. Tus cedidos suman goles, asistencias y suben de media.</p>`;
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
      <div class="card-header">
        <h3>${Graphics.renderTrophy("fifae_wc", 32)} FIFAe World Cup — Selecciones Nacionales</h3>
      </div>
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
      <div class="card-header">
        <h3>${Graphics.renderTrophy("rlcs_worlds", 32)} Ranking Global RLCS (Clasificación a Majors, Worlds y Club WC)</h3>
      </div>
      <table>
        <thead><tr><th>#</th><th>Organización</th><th>Región</th><th>OVR</th><th>Puntos RLCS</th></tr></thead>
        <tbody>
          ${globalTop.map((t, idx) => `
            <tr class="${t.id === GameState.userTeamId ? "user-row" : ""}">
              <td>${idx + 1}</td>
              <td style="display:flex;align-items:center;gap:8px;">${Graphics.renderCrest(t, 26)} ${t.name}</td>
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

  // TABLAS REGIONALES RLCS SEPARADAS POR REGIÓN
  const reg = GameState.selectedRegionTab;
  const regTeams = GameState.teams
    .filter(t => t.region === reg)
    .sort((a, b) => b.points - a.points || getTeamOvr(b.id) - getTeamOvr(a.id));

  view.innerHTML = `
    <div class="card-header">
      <h3>${Graphics.renderTrophy("rlcs_regional", 30)} Tabla Regional RLCS — Región ${reg}</h3>
      <div style="display:flex;gap:6px;">
        ${["SAM", "EU", "NA", "MENA"].map(r => `
          <button class="btn-sm ${r === reg ? "btn-primary" : "btn-secondary"}" onclick="changeRegionSubTab('${r}')">${r}</button>
        `).join("")}
      </div>
    </div>
    <table>
      <thead><tr><th>Pos</th><th>Equipo</th><th>OVR</th><th>Prestigio</th><th>Puntos RLCS</th></tr></thead>
      <tbody>
        ${regTeams.map((t, idx) => `
          <tr class="${t.id === GameState.userTeamId ? "user-row" : ""}">
            <td>${idx + 1}</td>
            <td style="display:flex;align-items:center;gap:8px;">${Graphics.renderCrest(t, 28)} ${t.name}</td>
            <td>${getTeamOvr(t.id)}</td>
            <td>${t.rep}</td>
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
  document.getElementById("squad-list").innerHTML = roster.map(p => `
    <div class="player-card ${p.starter ? "starter" : ""}">
      <div class="player-top">
        <strong>${Graphics.getFlag(p.country)} ${p.name}</strong>
        <span class="ovr-pill">${p.ovr}</span>
      </div>
      <div class="muted">${p.age} años • Pot. ${p.pot}</div>
      <div class="stats-mini">
        <div><span>MEC</span><br><strong>${p.mec}</strong></div>
        <div><span>ROT</span><br><strong>${p.rot}</strong></div>
        <div><span>DEF</span><br><strong>${p.def}</strong></div>
      </div>
      <div style="display:flex;gap:6px;margin-top:8px;">
        <button class="btn-secondary btn-sm" onclick="toggleStarter('${p.id}')">${p.starter ? "Titular" : "Hacer Titular"}</button>
        <button class="btn-danger-outline btn-sm" onclick="sellPlayer('${p.id}')">Vender ($${Math.round(p.value * 0.75).toLocaleString()})</button>
      </div>
    </div>
  `).join("");

  const coach = getTeamCoach(userTeam.id);
  const coachBox = document.getElementById("active-coach-box");
  coachBox.innerHTML = coach ? `
    <div class="player-card starter">
      <div class="player-top">
        <strong>${Graphics.getFlag(coach.country)} ${coach.name}</strong>
        <span class="ovr-pill">${coach.ovr}</span>
      </div>
      <p class="muted" style="margin-top:6px;">${coach.specialty}</p>
      <p class="muted">Costo: $${coach.salary.toLocaleString()}</p>
    </div>
  ` : `<p class="muted">Sin Head Coach activo. Contratá uno en la pestaña Mercado.</p>`;
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
  addNews(`Vendiste el pase de ${p.name} por $${gain.toLocaleString()}.`);
  refreshAllUI();
}

// 4. CANTERA, PRODIGIOS Y CESIONES
function addCustomProspectNames() {
  const raw = document.getElementById("prospect-names-input").value;
  const country = document.getElementById("custom-prospect-country").value;
  const rankPref = document.getElementById("custom-prospect-rank").value;
  const names = raw.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
  if (names.length === 0) return;

  names.forEach(name => GameState.customNameQueue.push({ name, country, rankPref }));
  document.getElementById("prospect-names-input").value = "";
  addNews(`Guardaste ${names.length} nombres en tu lista de scouting juvenil.`, "prodigy");
  triggerProspectDiscovery();
  refreshAllUI();
}

function triggerProspectDiscovery() {
  const countries = ["AR", "CL", "BR", "FR", "US", "SA", "ES", "GB"];
  let name, country, rank;
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
  const age = rank === "GC2" ? 12 : (rank === "GC3" ? 13 : 14);
  const ovr = rank === "SSL" ? 81 : (rank === "GC3" ? 77 : 73);
  const pot = Math.floor(Math.random() * 8) + 91;

  GameState.academyProspects.push({
    id: "acad_" + Date.now() + "_" + Math.random(),
    name, country, age, rank, ovr, pot,
    loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0
  });
  addNews(`¡Radar Ranked! Apareció ${name} (${age} años, ${rank}) con potencial ${pot}.`, "prodigy");
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
  const userTeam = getUserTeam();
  GameState.players.push({
    id: "pro_" + Date.now(),
    name: p.name, country: p.country, age: p.age, ovr: p.ovr, pot: p.pot,
    mec: p.ovr + 2, rot: p.ovr - 1, def: p.ovr - 1,
    teamId: userTeam.id, starter: false, value: p.ovr * 3500
  });
  GameState.academyProspects.splice(idx, 1);
  addNews(`¡${p.name} (15 años, OVR ${p.ovr}) fue ascendido al primer equipo!`, "prodigy");
  refreshAllUI();
}

function progressAcademyStep() {
  const coach = getTeamCoach(getUserTeam().id);
  const formadorBonus = (coach && coach.specialty.includes("Formador")) ? 1 : 0;

  GameState.academyProspects.forEach(p => {
    if (p.loanLeagueId) {
      p.loanGoals += Math.floor(Math.random() * 5) + 2;
      p.loanAssists += Math.floor(Math.random() * 4) + 1;
      if (Math.random() < 0.45) {
        p.ovr = Math.min(p.pot, p.ovr + 1 + formadorBonus);
        if (p.ovr >= 76 && p.rank === "GC2") p.rank = "GC3";
        if (p.ovr >= 80 && p.rank === "GC3") p.rank = "SSL";
      }
      if (Math.random() < 0.25) {
        const league = InitialData.nationalLeagues.find(l => l.id === p.loanLeagueId);
        const newLocal = GameState.customNameQueue.length > 0 ? GameState.customNameQueue.shift().name : generateUniqueName();
        GameState.academyProspects.push({
          id: "acad_net_" + Date.now() + Math.random(),
          name: newLocal, country: league.country, age: 13, rank: "GC3",
          ovr: 77, pot: Math.floor(Math.random() * 7) + 91,
          loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0
        });
        addNews(`¡Scouting Local! ${p.name} (en ${p.loanClub}) recomendó a ${newLocal} (13 años, GC3).`, "loan");
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

  document.getElementById("academy-players-list").innerHTML = GameState.academyProspects.map(p => `
    <div class="academy-item">
      <div>
        <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> ${Graphics.renderRankBadge(p.rank)}
        <div class="muted">${p.age} años • OVR ${p.ovr} (Pot. ${p.pot})</div>
        ${p.loanClub ? `<span class="badge">Cedido en ${p.loanClub} (${p.loanGoals}G / ${p.loanAssists}A)</span>` : `<span class="muted">En tu Academia</span>`}
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${!p.loanLeagueId ? `
          <select onchange="sendProspectOnLoan('${p.id}', this.value)" style="margin:0;padding:5px;font-size:0.78rem;">
            <option value="">Ceder a Liga...</option>
            ${InitialData.nationalLeagues.map(l => `<option value="${l.id}">${l.name}</option>`).join("")}
          </select>
        ` : ""}
        <button class="btn-primary btn-sm" onclick="promoteProspectToFirstTeam('${p.id}')">Subir al Primer Equipo</button>
      </div>
    </div>
  `).join("");
}

// 5. MERCADO CON NEGOCIACIÓN REALISTA
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
          <div class="muted">${p.age} años • Pot. ${p.pot} • ${currentClub}</div>
          <div class="money" style="font-size:0.85rem;">Valor estimado: $${p.value.toLocaleString()}</div>
        </div>
        <button class="btn-primary btn-sm" onclick="openNegotiationModal('${p.id}')">Negociar</button>
      </div>
    `;
  }).join("");
}

function openNegotiationModal(playerId) {
  const p = GameState.players.find(x => x.id === playerId);
  if (!p) return;
  ActiveNegotiationPlayerId = playerId;
  const club = p.teamId ? getTeamById(p.teamId).name : "Agente Libre";

  document.getElementById("neg-title").textContent = `Negociar por ${p.name} (OVR ${p.ovr})`;
  document.getElementById("neg-subtitle").textContent = `Club actual: ${club} • Valor de mercado: $${p.value.toLocaleString()}`;
  document.getElementById("neg-details").innerHTML = `
    <div>• Edad: <strong>${p.age} años</strong> | Potencial: <strong>${p.pot}</strong></div>
    <div>• Exigencia de prestigio mínimo: <strong>${p.ovr >= 92 ? "88+ (Club Top Mundial)" : "75+"}</strong></div>
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
  const role = document.getElementById("neg-role-promise").value;
  const fb = document.getElementById("neg-feedback");
  fb.classList.remove("hidden");

  if (offer > userTeam.budget) {
    fb.textContent = "❌ No tenés suficiente presupuesto en caja para respaldar esa oferta.";
    return;
  }

  // Chequeo de prestigio para superestrellas
  if (p.ovr >= 92 && userTeam.rep < 86 && offer < p.value * 1.25) {
    fb.textContent = `⚠️ ${p.name} duda del proyecto deportivo (Prestigio del club: ${userTeam.rep}/86). Necesitás ganar más torneos o subir la oferta un 25% por encima de su valor.`;
    return;
  }

  const ratio = offer / p.value;
  const roleBonus = role === "STARTER" ? 0.12 : -0.15;
  const acceptScore = ratio + roleBonus;

  if (acceptScore >= 1.02) {
    userTeam.budget -= offer;
    p.teamId = userTeam.id;
    p.starter = role === "STARTER" && getTeamRoster(userTeam.id, true).length < 3;
    addNews(`🤝 ¡ACUERDO CERRADO! ${userTeam.name} fichó a ${p.name} (OVR ${p.ovr}) tras negociar por $${offer.toLocaleString()}.`);
    closeNegotiationModal();
    refreshAllUI();
  } else if (acceptScore >= 0.85) {
    const counter = Math.round(p.value * 1.08);
    fb.textContent = `💬 Contraoferta recibida: El entorno de ${p.name} pide $${counter.toLocaleString()} y rol de Titular para firmar hoy.`;
  } else {
    fb.textContent = `❌ Oferta rechazada de plano. La propuesta económica está muy lejos de las pretensiones.`;
  }
}

function hireCoach(coachId) {
  const userTeam = getUserTeam();
  const c = GameState.coaches.find(x => x.id === coachId);
  if (!c) return;
  if (userTeam.budget < c.salary) {
    alert("Presupuesto insuficiente para contratar a " + c.name);
    return;
  }
  const old = getTeamCoach(userTeam.id);
  if (old) old.teamId = null;
  userTeam.budget -= c.salary;
  c.teamId = userTeam.id;
  addNews(`${userTeam.name} contrató a ${c.name} como Head Coach.`);
  refreshAllUI();
}

// 6. VITRINA DE TROFEOS
function renderTrophiesTab() {
  const cabinet = document.getElementById("club-trophy-cabinet");
  cabinet.innerHTML = GameState.trophiesWon.length
    ? GameState.trophiesWon.map(t => `
        <div class="trophy-item">
          ${Graphics.renderTrophy(t.compId, 52)}
          <h4 style="margin-top:6px;font-size:0.88rem;">${t.compName}</h4>
          <span class="badge">Temp. ${t.season}</span>
        </div>
      `).join("")
    : `<p class="muted">Todavía no hay trofeos en la vitrina. ¡Ganá una Gran Final para inaugurarla!</p>`;

  const hist = document.getElementById("champions-history-list");
  hist.innerHTML = GameState.championsHistory.length
    ? GameState.championsHistory.map(h => `
        <div class="news-item prodigy">
          <strong>[Temp. ${h.season}] ${h.compName}:</strong> Campeón <strong>${h.winnerName}</strong>
        </div>
      `).join("")
    : `<p class="muted">Aún no finalizaron torneos en esta partida.</p>`;
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
      id: "c_custom_" + Date.now(), name, country, ovr,
      specialty: "Formador de Talento (+35% progreso juvenil)", teamId, salary: ovr * 900
    });
  } else {
    GameState.players.push({
      id: "p_custom_" + Date.now(), name, country, age, ovr, pot,
      mec: ovr + 1, rot: ovr, def: ovr - 1, teamId,
      starter: teamId ? getTeamRoster(teamId, true).length < 3 : false,
      value: ovr * 4500
    });
  }
  document.getElementById("edit-person-name").value = "";
  addNews(`Se añadió a ${name} a la base de datos.`);
  refreshAllUI();
}

// CAMBIO DE TEMPORADA
function advanceNewSeason() {
  GameState.season++;
  GameState.scheduleIndex = 0;
  addNews(`=== INICIO DE LA TEMPORADA ${GameState.season} ===`, "prodigy");

  GameState.teams.forEach(t => t.points = 0);
  buildNationalTables();

  GameState.academyProspects.forEach(p => {
    p.age++;
    p.ovr = Math.min(p.pot, p.ovr + 2);
  });

  GameState.players = GameState.players.filter(p => {
    p.age++;
    if (p.age <= 21 && p.ovr < p.pot) {
      p.ovr = Math.min(p.pot, p.ovr + Math.floor(Math.random() * 2) + 1);
      p.mec = Math.min(99, p.mec + 1);
    }
    if (p.age >= 26 && Math.random() < 0.45) {
      addNews(`${p.name} se retira como jugador profesional a los ${p.age} años.`);
      if (Math.random() < 0.5) {
        GameState.coaches.push({
          id: "c_ret_" + Date.now() + Math.random(),
          name: p.name, country: p.country, ovr: Math.max(82, p.ovr - 3),
          specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: null, salary: 75000
        });
      }
      return false;
    }
    return true;
  });

  triggerProspectDiscovery();
  triggerProspectDiscovery();
  generateTournamentBracket();
  pickNextOpponent();
}

function saveGame(notify) {
  localStorage.setItem("rl_career_save_v2", JSON.stringify(GameState));
  if (notify) alert("Partida v2.0 guardada correctamente.");
}

function loadSavedGame() {
  const raw = localStorage.getItem("rl_career_save_v2");
  if (!raw) return;
  GameState = JSON.parse(raw);
  launchGameUI();
}

function resetCareer() {
  if (confirm("¿Seguro que querés reiniciar y volver al menú?")) {
    localStorage.removeItem("rl_career_save_v2");
    location.reload();
  }
}
