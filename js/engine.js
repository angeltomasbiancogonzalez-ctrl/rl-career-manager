let GameState = {
  season: 2026,
  scheduleIndex: 0,
  userTeamId: null,
  manager: {
    name: "Tomy",
    country: "AR",
    specialty: "ACADEMY",
    rep: 72,
    confidence: 80,
    history: []
  },
  facilities: {
    gamingHouse: 1,
    academy: 1,
    marketing: 1
  },
  metaPatch: "Parche 2.40: Meta Aéreo y Flip Resets (+Bono a Strikers)",
  teams: [],
  players: [],
  coaches: [],
  academyProspects: [],
  customNameQueue: [],
  nationalTables: {},
  swissStandings: [],
  currentBracket: { qf: [], sf: [], gf: [] },
  trophiesWon: [],
  championsHistory: [],
  awardsHistory: [],
  hallOfFame: [],
  records: {
    topScorerSeason: { name: "-", val: 0 },
    biggestSale: { name: "-", val: 0 },
    bestStreak: 0,
    currentStreak: 0
  },
  headToHead: {},
  careerStats: { wins: 0, losses: 0, youthSales: 0 },
  activeSponsor: null,
  bootcampActive: false,
  weeklyPrepDone: false,
  prepBonus: { ovr: 0, chem: 0 },
  incomingOffer: null,
  lockerEvent: null,
  news: [],
  currentOpponentId: null,
  selectedCompView: "rlcs_regional",
  selectedRegionTab: "SAM"
};

let LiveMatch = {
  active: false,
  running: false,
  timerId: null,
  secondsLeft: 300,
  speedMultiplier: 1,
  homeWins: 0,
  awayWins: 0,
  winsNeeded: 3,
  gameNum: 1,
  gHome: 0,
  gAway: 0,
  tactic: "balanced",
  timeoutUsed: false,
  timeoutBoostActive: false,
  zeroSecOffered: false
};

let ActiveNegotiationPlayerId = null;
let CombinePool = [];

// INICIALIZACIÓN
window.onload = () => {
  document.getElementById("hero-logo").innerHTML = Graphics.renderTrophy("rlcs_worlds", 68);
  updateCustomCrestPreview();
  renderSetupTeams();
  if (localStorage.getItem("rl_career_save_v5")) {
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
        <span class="badge">${team.region} • ${team.division} • OVR ${avgOvr}</span>
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

function readManagerSetup() {
  GameState.manager.name = document.getElementById("mgr-name-input").value.trim() || "Tomy";
  GameState.manager.country = document.getElementById("mgr-country-input").value;
  GameState.manager.specialty = document.getElementById("mgr-spec-input").value;
}

// ARRANCAR DESDE ABAJO AL FUNDAR TU PROPIO CLUB
function startWithCustomTeam() {
  initBaseState();
  readManagerSetup();

  const name = document.getElementById("custom-team-name").value.trim() || "La Plata Esports";
  const tag = document.getElementById("custom-team-tag").value.trim().toUpperCase() || "LPE";
  const region = document.getElementById("custom-team-region").value;
  const shape = document.getElementById("custom-crest-shape").value;
  const pattern = document.getElementById("custom-crest-pattern").value;
  const color1 = document.getElementById("custom-color-1").value;
  const color2 = document.getElementById("custom-color-2").value;
  const car = document.getElementById("custom-car-body").value;
  const logoUrl = document.getElementById("custom-logo-url").value.trim();

  const customTeam = {
    id: "custom_user",
    name, tag, region, division: "CHALLENGER", rep: 68, stars: 0, car, arena: "Champions Field",
    color1, color2, shape, pattern, logoUrl,
    budget: 90000,
    points: 0
  };

  GameState.teams.push(customTeam);
  GameState.userTeamId = "custom_user";
  GameState.selectedRegionTab = region;
  GameState.manager.rep = 68;
  recordManagerClubJoin(customTeam);

  // Roster inicial modesto (73-76 OVR) para arrancar desde abajo
  const regionCountry = { SAM: "AR", EU: "FR", NA: "US", MENA: "SA" }[region] || "AR";
  const roles = ["Striker", "Playmaker", "Third Man"];
  const personalities = ["Promesa Ambiciosa", "Trabajador Silencioso", "Líder Nato"];
  for (let i = 0; i < 3; i++) {
    const baseOvr = 73 + i;
    GameState.players.push({
      id: "u_init_" + i,
      name: generateUniqueName(),
      country: regionCountry,
      age: 15 + i,
      ovr: baseOvr,
      pot: 84 + i * 2,
      mec: baseOvr + 1,
      rot: baseOvr,
      def: baseOvr - 1,
      role: roles[i],
      personality: personalities[i],
      contractYears: 2,
      teamId: "custom_user",
      starter: true,
      stamina: 100,
      value: 45000 + i * 8000,
      goals: 0, assists: 0, saves: 0, streak: 0
    });
  }

  addNews(`🚀 ¡${name} (${tag}) inicia su camino desde abajo en la División Challenger de ${region}!`, "prodigy");
  launchGameUI();
}

function startCareer(teamId) {
  initBaseState();
  readManagerSetup();
  GameState.userTeamId = teamId;
  const userTeam = getUserTeam();
  GameState.selectedRegionTab = userTeam.region;
  GameState.manager.rep = Math.max(72, userTeam.rep - 4);
  recordManagerClubJoin(userTeam);
  addNews(`👔 ${GameState.manager.name} asumió como Head Manager de ${userTeam.name} (${userTeam.division}).`);
  launchGameUI();
}

function recordManagerClubJoin(team) {
  GameState.manager.history.unshift({
    teamId: team.id,
    teamName: team.name,
    region: team.region,
    fromSeason: GameState.season,
    toSeason: "Actual",
    titles: 0
  });
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
  GameState.headToHead = {};
  GameState.careerStats = { wins: 0, losses: 0, youthSales: 0 };
  GameState.facilities = { gamingHouse: 1, academy: 1, marketing: 1 };
  GameState.metaPatch = InitialData.metaPatches[0];
  GameState.activeSponsor = null;
  GameState.bootcampActive = false;
  GameState.weeklyPrepDone = false;
  GameState.prepBonus = { ovr: 0, chem: 0 };
  GameState.incomingOffer = null;
  GameState.lockerEvent = null;
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
    { name: "TomyRL", country: "AR", tpl: "GC2_13", arch: "Cerebro Táctico", isMine: true },
    { name: "Kirox", country: "CL", tpl: "C3_12", arch: "Diamante en Bruto", isMine: true },
    { name: "Zynx", country: "FR", tpl: "GC3_14", arch: "Freestyler", isMine: false, clubId: "kc" },
    { name: "Dante", country: "BR", tpl: "GC1_13", arch: "Ranked Demon 1v1", isMine: false, clubId: "fur" }
  ];
  starters.forEach((s, idx) => {
    const t = InitialData.youthTemplates.find(x => x.code === s.tpl) || InitialData.youthTemplates[0];
    const pot = Math.floor(Math.random() * (t.potMax - t.potMin + 1)) + t.potMin;
    GameState.academyProspects.push({
      id: "acad_" + Date.now() + "_" + idx,
      name: s.name, country: s.country, age: t.age, rank: t.rank, archetype: s.arch,
      ovr: t.ovr, pot, ownerTeamId: s.isMine ? null : s.clubId, isUserAcademy: s.isMine,
      loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0
    });
  });
}

function launchGameUI() {
  GameState.academyProspects.forEach(p => {
    if (p.isUserAcademy) p.ownerTeamId = GameState.userTeamId;
  });
  initSwissForCurrentEvent();
  generateTournamentBracket();
  pickNextOpponent();
  document.getElementById("setup-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  refreshAllUI();
  saveGame(false);
}

// HELPERS Y QUÍMICA AVANZADA
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

  const rolesSet = new Set(starters.map(p => p.role || "Striker"));
  if (rolesSet.size === 3) chem += 12;
  else if (rolesSet.size === 2) chem += 5;

  const countries = starters.map(p => p.country);
  if (countries[0] === countries[1] && countries[1] === countries[2]) chem += 7;
  else if (new Set(countries).size === 2) chem += 3;

  // Dinámica de personalidades / egos
  const superstars = starters.filter(p => p.personality === "Superestrella").length;
  const leaders = starters.filter(p => p.personality === "Líder Nato").length;
  if (superstars >= 3 && leaders === 0) chem -= 10;
  if (leaders >= 1) chem += 4;

  if (teamId === GameState.userTeamId) {
    if (GameState.bootcampActive) chem += 3;
    chem += (GameState.prepBonus?.chem || 0);
  }
  return Math.max(45, Math.min(100, chem));
}

function getTeamOvr(teamId) {
  const starters = getTeamRoster(teamId, true);
  if (starters.length === 0) return 70;

  const base = starters.reduce((sum, p) => {
    const stam = p.stamina ?? 100;
    const tiltPenalty = stam < 50 ? -4 : (stam < 70 ? -2 : 0);
    const fireBonus = p.streak >= 3 ? 2 : 0;
    return sum + p.ovr + fireBonus + tiltPenalty;
  }, 0) / starters.length;

  const chemBonus = (getTeamChemistry(teamId) - 80) * 0.1;
  const coach = getTeamCoach(teamId);
  const coachBonus = coach ? (coach.ovr - 80) * 0.15 : 0;

  let userBonus = 0;
  if (teamId === GameState.userTeamId) {
    if (GameState.bootcampActive) userBonus += 2;
    userBonus += (GameState.prepBonus?.ovr || 0);
    userBonus += (GameState.facilities.gamingHouse - 1) * 0.6;
  }
  return Math.round(base + chemBonus + coachBonus + userBonus);
}

function addNews(text, type = "normal") {
  GameState.news.unshift({ text, type, season: GameState.season });
  if (GameState.news.length > 50) GameState.news.pop();
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
  document.getElementById("top-club-meta").textContent = `${team.region} (${team.division}) • OVR ${ovr} • Química ${chem}%`;
  document.getElementById("top-season").textContent = `${GameState.season} • ${GameState.metaPatch.split(":")[0]}`;
  document.getElementById("top-stage").textContent = stage.compName;
  document.getElementById("top-budget").textContent = "$" + team.budget.toLocaleString();
  document.getElementById("top-points").textContent = `${team.points} pts • Conf. ${GameState.manager.confidence}%`;

  renderOffice();
  renderCompetitionView();
  renderSquadAndCoach();
  renderAcademy();
  renderMarket();
  renderCareerTab();
  renderAwardsAndTrophies();
  populateEditorTeams();
}

// SISTEMA SUIZO Y CLASIFICACIÓN REAL
function initSwissForCurrentEvent() {
  const userTeam = getUserTeam();
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  let pool = [];

  if (stage.compId === "rlcs_regional") {
    pool = GameState.teams.filter(t => t.region === userTeam.region && t.division === userTeam.division);
  } else {
    pool = [...GameState.teams].sort((a, b) => b.points - a.points || getTeamOvr(b.id) - getTeamOvr(a.id)).slice(0, 8);
  }

  while (pool.length < 8) {
    const extra = GameState.teams.find(t => !pool.includes(t));
    if (extra) pool.push(extra);
    else break;
  }
  if (!pool.some(t => t.id === userTeam.id)) pool[pool.length - 1] = userTeam;

  GameState.swissStandings = pool.map(t => ({
    teamId: t.id,
    teamName: t.name,
    tag: t.tag,
    w: 0,
    l: 0
  }));
}

function updateSwissStandings(userWon, oppId) {
  const userId = GameState.userTeamId;
  GameState.swissStandings.forEach(row => {
    if (row.teamId === userId) {
      if (userWon) row.w++; else row.l++;
    } else if (row.teamId === oppId) {
      if (!userWon) row.w++; else row.l++;
    } else {
      if (row.w < 3 && row.l < 3) {
        if (Math.random() > 0.5) row.w++; else row.l++;
      }
    }
  });
  GameState.swissStandings.sort((a, b) => b.w - a.w || a.l - b.l);
}

function generateTournamentBracket() {
  const userTeam = getUserTeam();
  const top8Ids = GameState.swissStandings.map(s => s.teamId);
  let pool = top8Ids.map(id => getTeamById(id)).filter(Boolean);
  while (pool.length < 8) {
    const extra = GameState.teams.find(t => !pool.includes(t));
    if (extra) pool.push(extra); else break;
  }
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
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

  if (stage.stageType === "QF") {
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
  } else if (stage.stageType === "SF") {
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
  } else if (stage.stageType === "GF") {
    b.gf[0].home = userTeam;
    b.gf[0].away = oppTeam;
    b.gf[0].scoreH = homeWins;
    b.gf[0].scoreA = awayWins;
  }
}

// 1. OFICINA, PREPARACIÓN SEMANAL Y PARTIDOS
function applyWeeklyPrep(type) {
  if (GameState.weeklyPrepDone) return alert("Ya elegiste la preparación semanal para esta serie.");
  const userTeam = getUserTeam();
  const starters = getTeamRoster(userTeam.id, true);
  GameState.weeklyPrepDone = true;

  if (type === "SCRIMS") {
    GameState.prepBonus = { ovr: 2, chem: 0 };
    starters.forEach(p => p.stamina = Math.max(20, (p.stamina ?? 100) - 12));
    addNews("🔥 Semana de Scrims intensos contra equipos Top (+2 OVR para el próximo partido).");
  } else if (type === "TACTICS") {
    GameState.prepBonus = { ovr: 0, chem: 4 };
    starters.forEach(p => p.stamina = Math.max(25, (p.stamina ?? 100) - 4));
    addNews("🧠 Análisis táctico y revisión de replays (+4 Química para la serie).");
  } else if (type === "REST") {
    GameState.prepBonus = { ovr: 0, chem: 0 };
    const mediaGain = 8000 + (GameState.facilities.marketing - 1) * 4000;
    userTeam.budget += mediaGain;
    starters.forEach(p => p.stamina = Math.min(100, (p.stamina ?? 100) + 22));
    addNews(`🔋 Descanso y Media Day (+22% Energía en todo el roster y +$${mediaGain.toLocaleString()} de sponsors).`);
  }
  refreshAllUI();
}

function pickNextOpponent() {
  const userTeam = getUserTeam();
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  let pool = stage.compId === "rlcs_regional"
    ? GameState.teams.filter(t => t.region === userTeam.region && t.division === userTeam.division && t.id !== userTeam.id)
    : GameState.teams.filter(t => t.id !== userTeam.id);

  if (pool.length === 0) pool = GameState.teams.filter(t => t.id !== userTeam.id);
  const opp = pool[Math.floor(Math.random() * pool.length)];
  GameState.currentOpponentId = opp.id;
}

function buyLanBootcamp() {
  const userTeam = getUserTeam();
  if (userTeam.budget < 35000) return alert("Necesitás $35,000 para organizar un Bootcamp.");
  userTeam.budget -= 35000;
  GameState.bootcampActive = true;
  addNews(`✈️ ${userTeam.name} completó un Bootcamp intensivo previo al evento LAN (+2 OVR y +3 Química).`);
  refreshAllUI();
}

function renderOffice() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId) || GameState.teams[0];
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const mySwiss = GameState.swissStandings.find(s => s.teamId === userTeam.id);

  const compDisplay = (stage.compId === "rlcs_regional" && userTeam.division === "CHALLENGER")
    ? stage.compName.replace("Open Regional", "Challenger League Split")
    : stage.compName;

  document.getElementById("next-event-title").textContent = compDisplay;
  document.getElementById("next-round-subtitle").textContent = `${stage.roundName}${mySwiss && stage.stageType.includes("SWISS") ? ` (Tu Récord: ${mySwiss.w}W-${mySwiss.l}L)` : ""} • ${stage.format}`;
  document.getElementById("next-event-trophy").innerHTML = Graphics.renderTrophy(userTeam.division === "CHALLENGER" && stage.compId === "rlcs_regional" ? "challenger_cup" : stage.compId, 44);

  document.getElementById("prep-status-text").textContent = GameState.weeklyPrepDone ? "✅ Completada" : "Pendiente (Elegí una)";

  const h2h = GameState.headToHead[opp.id] || { w: 0, l: 0 };
  const rivBanner = document.getElementById("rivalry-banner");
  if (h2h.w + h2h.l >= 3) {
    rivBanner.classList.remove("hidden");
    rivBanner.textContent = `🔥 RIVALIDAD HISTÓRICA (EL CLÁSICO) • Historial vs ${opp.name}: ${h2h.w}V - ${h2h.l}D`;
  } else {
    rivBanner.classList.add("hidden");
  }

  const isLan = stage.compId !== "rlcs_regional";
  const campBanner = document.getElementById("bootcamp-banner");
  if (isLan && !GameState.bootcampActive) campBanner.classList.remove("hidden");
  else campBanner.classList.add("hidden");

  document.getElementById("next-match-box").innerHTML = `
    <div class="vs-team">
      ${Graphics.renderCrest(userTeam, 64)}
      <strong>${userTeam.name}</strong>
      <span class="badge">OVR ${getTeamOvr(userTeam.id)} • ${userTeam.car || "Fennec"}</span>
    </div>
    <div class="vs-center">
      <div class="vs-badge">VS</div>
      <div class="muted">Premio: $${stage.prize.toLocaleString()}</div>
    </div>
    <div class="vs-team">
      ${Graphics.renderCrest(opp, 64)}
      <strong>${opp.name}</strong>
      <span class="badge">OVR ${getTeamOvr(opp.id)} • ${opp.car || "Octane"}</span>
    </div>
  `;

  // Oferta de trabajo de otro club (Estilo FIFA DT)
  const jobBox = document.getElementById("job-offer-box");
  if (GameState.pendingJobOffer) {
    const j = GameState.pendingJobOffer;
    jobBox.innerHTML = `
      <div class="offer-alert" style="border-color:#38bdf8;background:rgba(56,189,248,0.14);">
        <strong>👔 ¡OFERTA DE BANQUILLO!</strong> <strong>${j.teamName} (${j.region})</strong> quiere contratarte como su nuevo Mánager.
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="btn-primary btn-sm" onclick="acceptJobOffer('${j.teamId}')">Aceptar y Mudarse</button>
          <button class="btn-secondary btn-sm" onclick="GameState.pendingJobOffer=null;refreshAllUI();">Quedarse en ${userTeam.tag}</button>
        </div>
      </div>
    `;
  } else {
    jobBox.innerHTML = "";
  }

  // Evento de vestuario / crisis
  const lockerBox = document.getElementById("locker-event-box");
  if (GameState.lockerEvent) {
    const ev = GameState.lockerEvent;
    lockerBox.innerHTML = `
      <div class="offer-alert" style="border-color:var(--accent);background:rgba(245,158,11,0.12);">
        <strong>🎙️ VESTUARIO / CRISIS:</strong> ${ev.text}
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="btn-warning btn-sm" onclick="resolveLockerEvent(true)">${ev.yesLabel}</button>
          <button class="btn-secondary btn-sm" onclick="resolveLockerEvent(false)">${ev.noLabel}</button>
        </div>
      </div>
    `;
  } else {
    lockerBox.innerHTML = "";
  }

  // Ofertas entrantes por jugadores
  const offerBox = document.getElementById("incoming-offer-box");
  if (GameState.incomingOffer) {
    const o = GameState.incomingOffer;
    offerBox.innerHTML = `
      <div class="offer-alert">
        <strong>📩 ¡OFERTA RECIBIDA!</strong> <strong>${o.buyerName}</strong> ofrece <strong>$${o.amount.toLocaleString()}</strong> por <strong>${o.playerName}</strong>.
        <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
          <button class="btn-success btn-sm" onclick="respondIncomingOffer('ACCEPT')">Aceptar</button>
          <button class="btn-warning btn-sm" onclick="respondIncomingOffer('COUNTER')">Pedir +20%</button>
          <button class="btn-danger-outline btn-sm" onclick="respondIncomingOffer('REJECT')">Rechazar</button>
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

function resolveLockerEvent(accepted) {
  const ev = GameState.lockerEvent;
  if (!ev) return;
  const userTeam = getUserTeam();
  if (accepted) {
    if (userTeam.budget < ev.cost) return alert("Presupuesto insuficiente.");
    userTeam.budget -= ev.cost;
    const p = GameState.players.find(pl => pl.id === ev.playerId);
    if (p) { p.streak = 3; p.stamina = 100; }
    addNews(`✅ ${ev.winMsg}`);
  } else {
    addNews(`❌ ${ev.loseMsg}`);
  }
  GameState.lockerEvent = null;
  refreshAllUI();
}

function respondIncomingOffer(action) {
  const o = GameState.incomingOffer;
  if (!o) return;
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);

  if (action === "COUNTER") {
    if (Math.random() < 0.65) {
      o.amount = Math.round(o.amount * 1.2);
      addNews(`💬 ${o.buyerName} aceptó tu contraoferta ($${o.amount.toLocaleString()} por ${o.playerName}).`);
      refreshAllUI();
      return;
    } else {
      addNews(`❌ ${o.buyerName} retiró su oferta por ${o.playerName}.`);
      GameState.incomingOffer = null;
      refreshAllUI();
      return;
    }
  }

  if (action === "ACCEPT") {
    if (roster.length <= 3) return alert("Necesitás mínimo 3 jugadores.");
    const player = GameState.players.find(p => p.id === o.playerId);
    if (player) {
      userTeam.budget += o.amount;
      player.teamId = o.buyerId;
      player.starter = true;
      if (o.amount > GameState.records.biggestSale.val) {
        GameState.records.biggestSale = { name: `${player.name} -> ${o.buyerName}`, val: o.amount };
      }
      addNews(`💰 Vendiste a ${player.name} a ${o.buyerName} por $${o.amount.toLocaleString()}.`);
    }
  } else {
    addNews(`Rechazaste la oferta de ${o.buyerName} por ${o.playerName}.`);
  }
  GameState.incomingOffer = null;
  refreshAllUI();
}

// RELOJ EN VIVO ESTILO WORLD SOCCER CHAMPS
function formatClock(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function startLiveSeries() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];

  clearInterval(LiveMatch.timerId);
  LiveMatch = {
    active: true, running: false, timerId: null,
    secondsLeft: 300, speedMultiplier: 1,
    homeWins: 0, awayWins: 0,
    winsNeeded: stage.format === "Bo7" ? 4 : 3,
    gameNum: 1, gHome: 0, gAway: 0,
    tactic: "balanced", timeoutUsed: false, timeoutBoostActive: false, zeroSecOffered: false
  };

  document.getElementById("match-controls").classList.add("hidden");
  document.getElementById("live-series-panel").classList.remove("hidden");
  document.getElementById("btn-play-next-map").classList.remove("hidden");
  document.getElementById("btn-play-next-map").textContent = "Arrancar Reloj del Juego 1 (5:00)";
  document.getElementById("btn-skip-map").classList.add("hidden");
  document.getElementById("btn-finish-series").classList.add("hidden");
  document.getElementById("zero-second-alert").classList.add("hidden");
  document.getElementById("btn-timeout").disabled = false;
  document.getElementById("btn-timeout").textContent = "Timeout (1)";

  document.getElementById("live-home-name").textContent = userTeam.tag;
  document.getElementById("live-away-name").textContent = opp.tag;
  document.getElementById("live-home-series").textContent = "0";
  document.getElementById("live-away-series").textContent = "0";
  document.getElementById("live-game-label").textContent = `JUEGO 1 (${stage.format})`;
  document.getElementById("live-map-score").textContent = "0 - 0";
  document.getElementById("live-clock").textContent = "5:00";
  document.getElementById("live-events-log").innerHTML = `<div>🎙️ ¡Serie en vivo: <strong>${userTeam.name}</strong> vs <strong>${opp.name}</strong>!</div>`;
}

function toggleClockSpeed() {
  LiveMatch.speedMultiplier = LiveMatch.speedMultiplier === 1 ? 2 : 1;
  document.getElementById("btn-speed-toggle").textContent = LiveMatch.speedMultiplier === 1 ? "Vel: 1x (5s/min)" : "Vel: 2x (Rápido)";
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
  logLiveEvent(`⏸️ <strong>TIMEOUT:</strong> ${coach ? coach.name : "El DT"} ajusta las rotaciones (+5 OVR este mapa).`);
}

function logLiveEvent(html) {
  const logBox = document.getElementById("live-events-log");
  logBox.innerHTML += `<div>${html}</div>`;
  logBox.scrollTop = logBox.scrollHeight;
}

function startLiveMapTimer() {
  if (!LiveMatch.active || LiveMatch.running) return;
  LiveMatch.running = true;
  LiveMatch.secondsLeft = 300;
  LiveMatch.gHome = 0;
  LiveMatch.gAway = 0;
  LiveMatch.zeroSecOffered = false;

  document.getElementById("live-map-score").textContent = "0 - 0";
  document.getElementById("live-clock").textContent = "5:00";
  document.getElementById("btn-play-next-map").classList.add("hidden");
  document.getElementById("btn-skip-map").classList.remove("hidden");
  document.getElementById("zero-second-alert").classList.add("hidden");

  logLiveEvent(`<hr style="border-color:#1e293b;margin:6px 0;"><strong>▶ KICKOFF — JUEGO ${LiveMatch.gameNum} (5:00):</strong>`);

  LiveMatch.timerId = setInterval(() => {
    const step = 12 * LiveMatch.speedMultiplier;
    LiveMatch.secondsLeft = Math.max(0, LiveMatch.secondsLeft - step);
    document.getElementById("live-clock").textContent = formatClock(LiveMatch.secondsLeft);

    simulateTickEvent(LiveMatch.secondsLeft);

    if (LiveMatch.secondsLeft <= 24 && LiveMatch.secondsLeft > 0 && !LiveMatch.zeroSecOffered && (LiveMatch.gHome === LiveMatch.gAway || LiveMatch.gAway - LiveMatch.gHome === 1)) {
      LiveMatch.zeroSecOffered = true;
      document.getElementById("zero-second-alert").classList.remove("hidden");
    }

    if (LiveMatch.secondsLeft <= 0) {
      finishCurrentLiveMap();
    }
  }, 1000);
}

function simulateTickEvent(secLeft) {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const homeStarters = getTeamRoster(userTeam.id, true);
  const awayStarters = getTeamRoster(opp.id, true);
  const coach = getTeamCoach(userTeam.id);

  let homeOvr = getTeamOvr(userTeam.id);
  let awayOvr = getTeamOvr(opp.id);
  if (coach && coach.specialty.includes("Estratega LAN") && stage.compId !== "rlcs_regional") homeOvr += 3;
  if (GameState.manager.specialty === "TACTICIAN" && stage.format === "Bo7") homeOvr += 2;
  if (LiveMatch.timeoutBoostActive) homeOvr += 5;

  const diff = homeOvr - awayOvr;
  const homeChance = Math.min(0.84, Math.max(0.16, 0.50 + diff * 0.032));
  const eventProb = LiveMatch.tactic === "aggressive" ? 0.16 : (LiveMatch.tactic === "defensive" ? 0.09 : 0.12);

  if (Math.random() < eventProb) {
    const timeStr = formatClock(secLeft);
    if (Math.random() < homeChance) {
      LiveMatch.gHome++;
      const scorer = homeStarters[Math.floor(Math.random() * homeStarters.length)];
      const assister = homeStarters.find(p => p.id !== scorer?.id);
      if (scorer) scorer.goals++;
      if (assister && Math.random() > 0.3) assister.assists++;
      document.getElementById("live-map-score").textContent = `${LiveMatch.gHome} - ${LiveMatch.gAway}`;
      logLiveEvent(`⏱️ [${timeStr}] ⚽ ¡GOLAZO DE <strong>${scorer?.name}</strong>${assister ? ` (Asist. ${assister.name})` : ""}!`);
    } else {
      LiveMatch.gAway++;
      const scorer = awayStarters[Math.floor(Math.random() * awayStarters.length)];
      const keeper = homeStarters.find(p => p.role === "Third Man") || homeStarters[0];
      if (scorer) scorer.goals++;
      if (keeper && Math.random() > 0.55) keeper.saves++;
      document.getElementById("live-map-score").textContent = `${LiveMatch.gHome} - ${LiveMatch.gAway}`;
      logLiveEvent(`⏱️ [${timeStr}] ⚽ Gol de <strong>${scorer?.name}</strong> (${opp.tag}).`);
    }
  }
}

function triggerZeroSecondPlay(allIn) {
  document.getElementById("zero-second-alert").classList.add("hidden");
  const homeStarters = getTeamRoster(getUserTeam().id, true);
  const hero = homeStarters[0];
  if (allIn) {
    if (Math.random() < 0.52) {
      LiveMatch.gHome++;
      if (hero) hero.goals++;
      document.getElementById("live-map-score").textContent = `${LiveMatch.gHome} - ${LiveMatch.gAway}`;
      logLiveEvent(`🔥 <strong>[0:00 ZERO-SECOND DRIBBLE]</strong> ¡${hero?.name} mete un gol agónico en el segundo cero!`);
    } else {
      LiveMatch.gAway++;
      document.getElementById("live-map-score").textContent = `${LiveMatch.gHome} - ${LiveMatch.gAway}`;
      logLiveEvent(`💥 <strong>[0:00]</strong> Perdieron el balón sin arquero y ${getTeamById(GameState.currentOpponentId).tag} liquidó.`);
    }
  } else {
    logLiveEvent(`🛡️ El equipo asegura la posesión defensiva.`);
  }
}

function skipCurrentLiveMap() {
  if (!LiveMatch.running) return;
  while (LiveMatch.secondsLeft > 0) {
    LiveMatch.secondsLeft = Math.max(0, LiveMatch.secondsLeft - 24);
    simulateTickEvent(LiveMatch.secondsLeft);
  }
  finishCurrentLiveMap();
}

function finishCurrentLiveMap() {
  clearInterval(LiveMatch.timerId);
  LiveMatch.running = false;
  LiveMatch.timeoutBoostActive = false;
  document.getElementById("btn-skip-map").classList.add("hidden");
  document.getElementById("zero-second-alert").classList.add("hidden");

  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const homeStarters = getTeamRoster(userTeam.id, true);

  let otText = "";
  if (LiveMatch.gHome === LiveMatch.gAway) {
    otText = " +OT";
    const chance = Math.min(0.82, Math.max(0.18, 0.50 + (getTeamOvr(userTeam.id) - getTeamOvr(opp.id)) * 0.03));
    if (Math.random() < chance) {
      LiveMatch.gHome++;
      if (homeStarters[0]) homeStarters[0].goals++;
      logLiveEvent(`🔥 <strong>¡GOL DE ORO EN OVERTIME DE ${homeStarters[0]?.name}!</strong>`);
    } else {
      LiveMatch.gAway++;
      logLiveEvent(`💔 Gol de oro en Overtime para ${opp.tag}.`);
    }
  }

  if (LiveMatch.gHome > LiveMatch.gAway) LiveMatch.homeWins++;
  else LiveMatch.awayWins++;

  document.getElementById("live-home-series").textContent = LiveMatch.homeWins;
  document.getElementById("live-away-series").textContent = LiveMatch.awayWins;
  document.getElementById("live-map-score").textContent = `${LiveMatch.gHome} - ${LiveMatch.gAway}`;
  document.getElementById("live-clock").textContent = `0:00${otText}`;

  if (LiveMatch.homeWins >= LiveMatch.winsNeeded || LiveMatch.awayWins >= LiveMatch.winsNeeded) {
    LiveMatch.active = false;
    logLiveEvent(`<br>🏆 <strong>SERIE FINALIZADA: ${userTeam.tag} ${LiveMatch.homeWins} - ${LiveMatch.awayWins} ${opp.tag}</strong>`);
    document.getElementById("btn-finish-series").classList.remove("hidden");
  } else {
    LiveMatch.gameNum++;
    document.getElementById("live-game-label").textContent = `JUEGO ${LiveMatch.gameNum}`;
    document.getElementById("btn-play-next-map").classList.remove("hidden");
    document.getElementById("btn-play-next-map").textContent = `Arrancar Reloj del Juego ${LiveMatch.gameNum} (5:00)`;
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
  const chance = Math.min(0.85, Math.max(0.15, 0.50 + (getTeamOvr(userTeam.id) - getTeamOvr(opp.id)) * 0.035));
  const homeStarters = getTeamRoster(userTeam.id, true);
  const awayStarters = getTeamRoster(opp.id, true);

  while (h < winsNeeded && a < winsNeeded) {
    if (Math.random() < chance) {
      h++;
      if (homeStarters.length) {
        homeStarters[Math.floor(Math.random() * homeStarters.length)].goals += 2;
        homeStarters[Math.floor(Math.random() * homeStarters.length)].assists += 1;
      }
    } else {
      a++;
      if (awayStarters.length) awayStarters[Math.floor(Math.random() * awayStarters.length)].goals += 2;
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

// FINALIZACIÓN DE SERIE CON ELIMINACIÓN REAL DE LA RLCS Y AVANCE DE CALENDARIO
function finalizeSeriesResult(homeWins, awayWins) {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const won = homeWins > awayWins;

  GameState.weeklyPrepDone = false;
  GameState.prepBonus = { ovr: 0, chem: 0 };

  if (!GameState.headToHead[opp.id]) GameState.headToHead[opp.id] = { w: 0, l: 0 };
  if (won) {
    GameState.headToHead[opp.id].w++;
    GameState.careerStats.wins++;
    GameState.records.currentStreak++;
    if (GameState.records.currentStreak > GameState.records.bestStreak) {
      GameState.records.bestStreak = GameState.records.currentStreak;
    }
    GameState.manager.confidence = Math.min(100, GameState.manager.confidence + 3);
  } else {
    GameState.headToHead[opp.id].l++;
    GameState.careerStats.losses++;
    GameState.records.currentStreak = 0;
    GameState.manager.confidence = Math.max(15, GameState.manager.confidence - 5);
  }

  // Desgaste de energía en titulares y recuperación en suplentes
  const ghDiscount = (GameState.facilities.gamingHouse - 1) * 2;
  getTeamRoster(userTeam.id, false).forEach(p => {
    if (p.starter) {
      p.streak = won ? (p.streak || 0) + 1 : 0;
      p.stamina = Math.max(15, (p.stamina ?? 100) - Math.max(4, 10 - ghDiscount));
    } else {
      p.stamina = Math.min(100, (p.stamina ?? 100) + 20);
    }
  });

  if (stage.stageType.includes("SWISS")) {
    updateSwissStandings(won, opp.id);
  } else {
    updateBracketProgress(won, opp, homeWins, awayWins);
  }

  let eliminatedFromCurrentEvent = false;

  if (won) {
    userTeam.budget += stage.prize;
    userTeam.points += stage.points;
    userTeam.rep = Math.min(99, userTeam.rep + (stage.isFinal ? 3 : 1));
    GameState.manager.rep = Math.min(99, GameState.manager.rep + (stage.isFinal ? 3 : 1));
    addNews(`✅ Victoria ${homeWins}-${awayWins} vs ${opp.name} en ${stage.compName} (${stage.roundName}). +$${stage.prize.toLocaleString()}.`);

    if (stage.isFinal) {
      if (GameState.manager.history.length > 0) GameState.manager.history[0].titles++;
      if (GameState.activeSponsor?.id === "sp_hyperx") {
        userTeam.budget += 30000;
        addNews(`💼 Bono HyperX: +$30,000 por ganar el título.`);
      }
      if (GameState.activeSponsor?.id === "sp_redbull" && (stage.compId.includes("major") || stage.compId === "rlcs_worlds")) {
        userTeam.budget += 55000;
        addNews(`💼 Bono Red Bull: +$55,000 por título LAN internacional.`);
      }
      triggerChampionCeremony(stage, userTeam);
    }
  } else {
    opp.points += stage.points;
    userTeam.budget += Math.round(stage.prize * 0.25);
    addNews(`❌ Derrota ${homeWins}-${awayWins} ante ${opp.name} en ${stage.compName} (${stage.roundName}).`);

    // Si perdiste en la ronda decisiva de Suiza o en Playoffs, quedás eliminado del torneo actual
    if (stage.stageType === "SWISS_END" || stage.stageType === "QF" || stage.stageType === "SF") {
      eliminatedFromCurrentEvent = true;
      const aiWinner = GameState.teams.filter(t => t.id !== userTeam.id).sort((a, b) => getTeamOvr(b.id) - getTeamOvr(a.id))[0];
      if (aiWinner) {
        aiWinner.points += 35;
        if (stage.compId === "rlcs_worlds") {
          aiWinner.stars = (aiWinner.stars || 0) + 1;
          addNews(`⭐ ¡${aiWinner.name} ganó el Mundial RLCS y sumó una estrella dorada a su escudo!`);
        } else {
          addNews(`🏆 Eliminados de ${stage.compName}. El campeón del torneo fue ${aiWinner.name}.`);
        }
        GameState.championsHistory.unshift({
          season: GameState.season, compId: stage.compId, compName: stage.compName, winnerName: aiWinner.name
        });
      }
    } else if (stage.isFinal) {
      if (stage.compId === "rlcs_worlds") {
        opp.stars = (opp.stars || 0) + 1;
        addNews(`⭐ ¡${opp.name} conquista el Mundial RLCS y suma una estrella dorada!`);
      }
      GameState.championsHistory.unshift({
        season: GameState.season, compId: stage.compId, compName: stage.compName, winnerName: opp.name
      });
    }
  }

  // Simular stats y puntos de los demás equipos
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

  // Posibilidad de oferta de trabajo de otro club (Modo Carrera FIFA DT)
  if (!GameState.pendingJobOffer && Math.random() < 0.14) {
    const suitors = GameState.teams.filter(t => t.id !== userTeam.id && t.rep <= GameState.manager.rep + 6 && t.rep >= GameState.manager.rep - 6);
    if (suitors.length > 0) {
      const club = suitors[Math.floor(Math.random() * suitors.length)];
      GameState.pendingJobOffer = { teamId: club.id, teamName: club.name, region: club.region };
    }
  }

  // Ofertas por jugadores
  if (!GameState.incomingOffer && Math.random() < 0.18) {
    const myPlayers = getTeamRoster(userTeam.id, false);
    const buyers = GameState.teams.filter(t => t.id !== userTeam.id && t.budget > 220000);
    if (myPlayers.length > 3 && buyers.length > 0) {
      const target = myPlayers[Math.floor(Math.random() * myPlayers.length)];
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      GameState.incomingOffer = {
        playerId: target.id, playerName: target.name, buyerId: buyer.id, buyerName: buyer.name,
        amount: Math.round(target.value * 1.1)
      };
    }
  }

  // Conferencia de prensa antes de finales
  if (won && stage.stageType === "SF" && Math.random() < 0.65) {
    openPressConferenceModal();
  }

  progressAcademyStep();
  updateNationalLeaguesStep();

  const currentEventKey = stage.eventKey;
  if (eliminatedFromCurrentEvent) {
    // Avanza directamente al próximo torneo del calendario
    while (GameState.scheduleIndex < InitialData.seasonSchedule.length && InitialData.seasonSchedule[GameState.scheduleIndex].eventKey === currentEventKey) {
      GameState.scheduleIndex++;
    }
  } else {
    GameState.scheduleIndex++;
  }

  // Verificar clasificación real a Majors o Mundial RLCS
  if (GameState.scheduleIndex < InitialData.seasonSchedule.length) {
    const nextStage = InitialData.seasonSchedule[GameState.scheduleIndex];
    if (nextStage.eventKey !== currentEventKey) {
      GameState.bootcampActive = false;
      if ((nextStage.compId === "paris_major" || nextStage.compId === "boston_major" || nextStage.compId === "rlcs_worlds") && userTeam.division === "CHALLENGER") {
        addNews(`📺 Tu club está en División Challenger, así que ves ${nextStage.compName} desde afuera mientras preparás el ascenso.`, "loan");
        while (GameState.scheduleIndex < InitialData.seasonSchedule.length && InitialData.seasonSchedule[GameState.scheduleIndex].compId === nextStage.compId) {
          GameState.scheduleIndex++;
        }
      }
      if (GameState.scheduleIndex < InitialData.seasonSchedule.length) {
        initSwissForCurrentEvent();
        generateTournamentBracket();
      }
    }
  }

  if (GameState.scheduleIndex >= InitialData.seasonSchedule.length) {
    openSeasonGalaModal();
  } else {
    pickNextOpponent();
  }

  refreshAllUI();
  saveGame(false);
}

// CONFERENCIA DE PRENSA
function openPressConferenceModal() {
  const opp = getTeamById(GameState.currentOpponentId);
  document.getElementById("press-question").textContent = `Periodista: "Se viene la Gran Final ante ${opp?.name || "el rival"}. ¿Cómo llega mentalmente el equipo para definir el título?"`;
  document.getElementById("press-modal").classList.remove("hidden");
}

function answerPressConference(tone) {
  const starters = getTeamRoster(GameState.userTeamId, true);
  if (tone === "CONFIDENT") {
    GameState.prepBonus.ovr += 1;
    addNews(`🎙️ Declaración picante en conferencia de prensa (+1 OVR en la Final).`);
  } else if (tone === "HUMBLE") {
    GameState.prepBonus.chem += 3;
    addNews(`🎙️ Declaración mesurada ante la prensa (+3 Química en la Final).`);
  } else {
    starters.forEach(p => p.stamina = Math.min(100, (p.stamina ?? 100) + 12));
    addNews(`🎙️ Quitaste presión al plantel antes de la Final (+12% Energía Mental).`);
  }
  document.getElementById("press-modal").classList.add("hidden");
  refreshAllUI();
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
    addNews(`${userTeam.name} mantuvo su escudo clásico sin añadir estrella.`);
  }
  closeChampionModal();
  refreshAllUI();
}

function closeChampionModal() {
  document.getElementById("champion-modal").classList.add("hidden");
}

// GALA DE PREMIOS FIN DE TEMPORADA
function openSeasonGalaModal() {
  const finishedSeason = GameState.season;
  const allPros = [...GameState.players];

  const ballonTop = [...allPros].sort((a, b) => (b.ovr * 2 + b.goals * 1.5 + b.assists) - (a.ovr * 2 + a.goals * 1.5 + a.assists));
  const bootTop = [...allPros].sort((a, b) => b.goals - a.goals);
  const kdbTop = [...allPros].sort((a, b) => b.assists - a.assists);
  const gloveTop = [...allPros].sort((a, b) => b.saves - a.saves);
  const rookieTop = allPros.filter(p => p.age <= 18).sort((a, b) => (b.ovr + b.goals) - (a.ovr + a.goals));

  if (bootTop[0] && bootTop[0].goals > GameState.records.topScorerSeason.val) {
    GameState.records.topScorerSeason = { name: `${bootTop[0].name} (${finishedSeason})`, val: bootTop[0].goals };
  }

  const youthPool = [...GameState.academyProspects];
  const youthBallon = [...youthPool].sort((a, b) => (b.ovr + b.loanGoals) - (a.ovr + a.loanGoals))[0];
  const youthBoot = [...youthPool].sort((a, b) => b.loanGoals - a.loanGoals)[0];

  const awardEntry = {
    season: finishedSeason,
    ballonDor: ballonTop[0] ? `${ballonTop[0].name} (${getTeamById(ballonTop[0].teamId)?.tag || "FA"})` : "-",
    ballonPodium: ballonTop.slice(0, 3).map(p => p.name).join(" / "),
    goldenBoot: bootTop[0] ? `${bootTop[0].name} (${bootTop[0].goals} goles)` : "-",
    kdbAward: kdbTop[0] ? `${kdbTop[0].name} (${kdbTop[0].assists} asist.)` : "-",
    goldenGlove: gloveTop[0] ? `${gloveTop[0].name} (${gloveTop[0].saves} ataj.)` : "-",
    rookie: rookieTop[0] ? `${rookieTop[0].name} (${rookieTop[0].age} años)` : "-",
    youthBallon: youthBallon ? `${youthBallon.name} (${getTeamById(youthBallon.ownerTeamId)?.tag || "Cantera"})` : "Sin canteranos",
    youthBoot: youthBoot ? `${youthBoot.name} (${youthBoot.loanGoals} goles)` : "-"
  };

  GameState.awardsHistory.unshift(awardEntry);
  addNews(`🏆 GALA ${finishedSeason}: Rocket d'Or para ${awardEntry.ballonDor} | Premio KDB para ${awardEntry.kdbAward}.`, "prodigy");

  document.getElementById("gala-season-title").textContent = `Premios Oficiales — Temporada ${finishedSeason}`;
  document.getElementById("gala-awards-content").innerHTML = `
    <div class="gala-row">🥇 <strong>Rocket d'Or (Balón de Oro):</strong> ${awardEntry.ballonDor}<br><small class="muted">Podio Top 3: ${awardEntry.ballonPodium}</small></div>
    <div class="gala-row">⚽ <strong>Bota de Oro (Goleador):</strong> ${awardEntry.goldenBoot}</div>
    <div class="gala-row">🎯 <strong>Premio KDB (Máximo Asistidor):</strong> ${awardEntry.kdbAward}</div>
    <div class="gala-row">🧤 <strong>Guante de Oro (Atajadas):</strong> ${awardEntry.goldenGlove}</div>
    <div class="gala-row">🌟 <strong>Rookie del Año (Sub-18):</strong> ${awardEntry.rookie}</div>
    <div class="gala-row" style="border-left-color:#10b981;">🌱 <strong>Balón de Oro de Canteras:</strong> ${awardEntry.youthBallon}</div>
    <div class="gala-row" style="border-left-color:#10b981;">👟 <strong>Bota de Oro Juvenil:</strong> ${awardEntry.youthBoot}</div>
  `;

  document.getElementById("gala-modal").classList.remove("hidden");
}

function closeGalaModal() {
  document.getElementById("gala-modal").classList.add("hidden");
  advanceNewSeason();
  openPreseasonCombineModal();
}

// SCOUTING COMBINE DE PRETEMPORADA
function openPreseasonCombineModal() {
  const countries = ["AR", "CL", "BR", "FR", "US", "SA", "ES", "GB"];
  const roles = ["Striker", "Playmaker", "Third Man"];
  CombinePool = [];

  for (let i = 0; i < 4; i++) {
    const name = generateUniqueName();
    const country = countries[Math.floor(Math.random() * countries.length)];
    const ovr = 76 + Math.floor(Math.random() * 6);
    const pot = 87 + Math.floor(Math.random() * 9);
    CombinePool.push({
      id: "comb_" + Date.now() + "_" + i,
      name, country, age: 15, ovr, pot,
      mec: ovr + 2, rot: ovr - 1, def: ovr - 1,
      role: roles[i % 3], personality: "Promesa Ambiciosa", contractYears: 3,
      teamId: GameState.userTeamId, starter: false, stamina: 100,
      value: ovr * 3500, goals: 0, assists: 0, saves: 0, streak: 0
    });
  }

  document.getElementById("combine-prospects-list").innerHTML = CombinePool.map((p, idx) => `
    <div class="academy-item">
      <div>
        <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> <span class="badge">15 años • OVR ${p.ovr} (Pot. ${p.pot})</span>
        <div class="muted">Rol: ${p.role}</div>
      </div>
      <button class="btn-success btn-sm" onclick="draftCombinePlayer(${idx})">Elegir</button>
    </div>
  `).join("");

  document.getElementById("combine-modal").classList.remove("hidden");
}

function draftCombinePlayer(idx) {
  const chosen = CombinePool[idx];
  if (chosen) {
    GameState.players.push(chosen);
    addNews(`🎯 Drafteaste a ${chosen.name} (15 años, OVR ${chosen.ovr}) en el Scouting Combine.`, "prodigy");
  }
  closeCombineModal();
  refreshAllUI();
}

function closeCombineModal() {
  document.getElementById("combine-modal").classList.add("hidden");
  refreshAllUI();
}

// 2. COMPETENCIAS, SUIZA, LLAVES Y LIGAS
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

  if (compId === "swiss_stage") {
    view.innerHTML = `
      <div class="card-header"><h3>Fase Suiza Actual (Clasifican los mejores récords a Playoffs)</h3></div>
      <table>
        <thead><tr><th>Pos</th><th>Equipo</th><th>Victorias (W)</th><th>Derrotas (L)</th><th>Estado</th></tr></thead>
        <tbody>
          ${GameState.swissStandings.map((s, idx) => `
            <tr class="${s.teamId === GameState.userTeamId ? "user-row" : ""}">
              <td>${idx + 1}</td>
              <td><strong>${s.teamName}</strong></td>
              <td>${s.w}</td>
              <td>${s.l}</td>
              <td>${idx < 4 ? '<span class="badge" style="color:#10b981;">Zona Playoffs</span>' : '<span class="muted">En juego</span>'}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    return;
  }

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
              <tr><td>${i + 1}</td><td><strong>${row.club}</strong></td><td>${row.pj}</td><td>${row.pg}</td><td>${row.pp}</td><td>${row.dg > 0 ? "+" + row.dg : row.dg}</td><td><strong>${row.pts}</strong></td></tr>
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
            <tr><td><strong>${Graphics.getFlag(r.code)} ${Graphics.countryNames[r.code]}</strong></td><td>${r.top3.map(p => `${p.name} (${p.ovr})`).join(" • ")}</td><td><span class="badge">OVR ${r.avg}</span></td></tr>
          `).join("")}
        </tbody>
      </table>
    `;
    return;
  }

  if (compId === "majors_worlds") {
    const globalTop = [...GameState.teams].filter(t => t.division === "PRO").sort((a, b) => b.points - a.points || getTeamOvr(b.id) - getTeamOvr(a.id));
    view.innerHTML = `
      <div class="card-header"><h3>${Graphics.renderTrophy("rlcs_worlds", 32)} Ranking Mundial RLCS (Primera División)</h3></div>
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
  const regPro = GameState.teams.filter(t => t.region === reg && t.division === "PRO").sort((a, b) => b.points - a.points || getTeamOvr(b.id) - getTeamOvr(a.id));
  const regChal = GameState.teams.filter(t => t.region === reg && t.division === "CHALLENGER").sort((a, b) => b.points - a.points || getTeamOvr(b.id) - getTeamOvr(a.id));

  view.innerHTML = `
    <div class="card-header">
      <h3>${Graphics.renderTrophy("rlcs_regional", 30)} RLCS Primera División y Challenger — ${reg}</h3>
      <div style="display:flex;gap:6px;">
        ${["SAM", "EU", "NA", "MENA"].map(r => `
          <button class="btn-sm ${r === reg ? "btn-primary" : "btn-secondary"}" onclick="changeRegionSubTab('${r}')">${r}</button>
        `).join("")}
      </div>
    </div>
    <h4>Primera División RLCS (Top 2 clasifican a Majors • Último desciende)</h4>
    <table>
      <thead><tr><th>Pos</th><th>Equipo</th><th>OVR</th><th>Estrellas</th><th>Puntos RLCS</th></tr></thead>
      <tbody>
        ${regPro.map((t, idx) => `
          <tr class="${t.id === GameState.userTeamId ? "user-row" : ""}">
            <td>${idx + 1}</td>
            <td style="display:flex;align-items:center;gap:8px;">${Graphics.renderCrest(t, 28)} ${t.name}</td>
            <td>${getTeamOvr(t.id)}</td>
            <td>${"⭐".repeat(t.stars || 0) || "-"}</td>
            <td><strong>${t.points} pts</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <h4 style="margin-top:18px;">División Challenger (El 1.º asciende a Primera RLCS)</h4>
    <table>
      <thead><tr><th>Pos</th><th>Equipo</th><th>OVR</th><th>Puntos Challenger</th></tr></thead>
      <tbody>
        ${regChal.map((t, idx) => `
          <tr class="${t.id === GameState.userTeamId ? "user-row" : ""}">
            <td>${idx + 1}</td>
            <td style="display:flex;align-items:center;gap:8px;">${Graphics.renderCrest(t, 28)} ${t.name}</td>
            <td>${getTeamOvr(t.id)}</td>
            <td><strong>${t.points} pts</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// 3. PLANTILLA, ENERGÍA Y COACH
function renderSquadAndCoach() {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  document.getElementById("team-chemistry-badge").textContent = `Química: ${getTeamChemistry(userTeam.id)}%`;

  document.getElementById("squad-list").innerHTML = roster.map(p => {
    const stam = p.stamina ?? 100;
    const stamColor = stam < 50 ? "#ef4444" : (stam < 75 ? "#f59e0b" : "#10b981");
    return `
      <div class="player-card ${p.starter ? "starter" : ""}">
        <div class="player-top">
          <strong>${Graphics.getFlag(p.country)} ${p.name} ${p.streak >= 3 ? `<span class="fire-tag">🔥 ON FIRE</span>` : ""}</strong>
          <span class="ovr-pill">${p.ovr}</span>
        </div>
        <div class="muted" style="margin-bottom:4px;">${p.age} años • ${p.role || "Striker"} • <em>${p.personality || "Equilibrado"}</em></div>
        <div style="font-size:0.74rem;color:${stamColor};">Energía Mental: ${stam}% ${stam < 50 ? "(⚠️ TILTEADO)" : ""}</div>
        <div class="stamina-bar-bg"><div class="stamina-bar-fill" style="width:${stam}%;background:${stamColor};"></div></div>
        <div class="stats-mini">
          <div><span>MEC</span><br><strong>${p.mec}</strong></div>
          <div><span>ROT</span><br><strong>${p.rot}</strong></div>
          <div><span>DEF</span><br><strong>${p.def}</strong></div>
        </div>
        <div class="muted" style="font-size:0.76rem;">Temp: ${p.goals}G • ${p.assists}A • Contrato: ${p.contractYears || 1}t</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
          <button class="btn-secondary btn-sm" onclick="toggleStarter('${p.id}')">${p.starter ? "Titular" : "Subir Titular"}</button>
          <button class="btn-outline btn-sm" onclick="renewPlayerContract('${p.id}')">Renovar</button>
          ${!p.starter ? `<button class="btn-warning btn-sm" onclick="loanProPlayer('${p.id}')">Ceder 1t</button>` : ""}
          <button class="btn-danger-outline btn-sm" onclick="sellPlayer('${p.id}')">Vender</button>
        </div>
      </div>
    `;
  }).join("");

  const coach = getTeamCoach(userTeam.id);
  document.getElementById("active-coach-box").innerHTML = coach ? `
    <div class="player-card starter">
      <div class="player-top">
        <strong>${Graphics.getFlag(coach.country)} ${coach.name}</strong>
        <span class="ovr-pill">${coach.ovr}</span>
      </div>
      <p class="muted" style="margin-top:6px;">${coach.specialty}</p>
    </div>
  ` : `<p class="muted">Sin Head Coach activo.</p>`;

  document.getElementById("club-identity-box").innerHTML = `
    <h4>Identidad de la Organización</h4>
    <div class="field" style="margin-top:8px;">
      <label>Auto Signature del Roster</label>
      <select onchange="updateClubIdentity('car', this.value)">
        ${["Fennec", "Octane", "Dominus"].map(c => `<option value="${c}" ${userTeam.car === c ? "selected" : ""}>${c}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label>Arena Local</label>
      <select onchange="updateClubIdentity('arena', this.value)">
        ${["Champions Field", "Mannfield (Night)", "DFH Stadium", "Estadio Único LP", "Neo Tokyo"].map(a => `<option value="${a}" ${userTeam.arena === a ? "selected" : ""}>${a}</option>`).join("")}
      </select>
    </div>
  `;
}

function updateClubIdentity(field, val) {
  getUserTeam()[field] = val;
  refreshAllUI();
}

function loanProPlayer(playerId) {
  const userTeam = getUserTeam();
  const p = GameState.players.find(pl => pl.id === playerId);
  const targets = GameState.teams.filter(t => t.id !== userTeam.id);
  const dest = targets[Math.floor(Math.random() * targets.length)];
  if (!p || !dest) return;
  p.teamId = dest.id;
  p.starter = true;
  p.ovr = Math.min(p.pot, p.ovr + 2);
  addNews(`🔄 Cediste a préstamo a ${p.name} a ${dest.name} (+2 OVR).`);
  refreshAllUI();
}

function renewPlayerContract(playerId) {
  const userTeam = getUserTeam();
  const p = GameState.players.find(pl => pl.id === playerId);
  const fee = Math.round(p.value * 0.12);
  if (userTeam.budget < fee) return alert("Presupuesto insuficiente.");
  userTeam.budget -= fee;
  p.contractYears = (p.contractYears || 1) + 2;
  addNews(`✍️ Renovaste el contrato de ${p.name} por 2 temporadas más ($${fee.toLocaleString()}).`);
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
  if (roster.length <= 3) return alert("Necesitás mínimo 3 jugadores para competir.");
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
  const archPref = document.getElementById("custom-prospect-archetype").value;

  const names = raw.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
  if (names.length === 0) return;

  names.forEach(name => GameState.customNameQueue.push({ name, destination, country, rankPref, archPref }));
  document.getElementById("prospect-names-input").value = "";
  addNews(`Inscribiste ${names.length} prodigios en el radar juvenil (${destination === "MY_ACADEMY" ? "Mi Cantera" : "Canteras Aleatorias"}).`, "prodigy");

  while (GameState.customNameQueue.length > 0) {
    triggerProspectDiscovery();
  }
  refreshAllUI();
}

function triggerProspectDiscovery() {
  const countries = ["AR", "CL", "BR", "FR", "US", "SA", "ES", "GB"];
  let name, country, tpl, archetype, destination;

  if (GameState.customNameQueue.length > 0) {
    const custom = GameState.customNameQueue.shift();
    name = custom.name;
    destination = custom.destination;
    country = custom.country === "RANDOM" ? countries[Math.floor(Math.random() * countries.length)] : custom.country;
    tpl = custom.rankPref === "AUTO"
      ? InitialData.youthTemplates[Math.floor(Math.random() * InitialData.youthTemplates.length)]
      : InitialData.youthTemplates.find(t => t.code === custom.rankPref) || InitialData.youthTemplates[0];
    archetype = custom.archPref === "AUTO"
      ? InitialData.youthArchetypes[Math.floor(Math.random() * InitialData.youthArchetypes.length)]
      : custom.archPref;
  } else {
    name = generateUniqueName();
    destination = Math.random() > 0.5 ? "MY_ACADEMY" : "RANDOM_ACADEMY";
    country = countries[Math.floor(Math.random() * countries.length)];
    tpl = InitialData.youthTemplates[Math.floor(Math.random() * InitialData.youthTemplates.length)];
    archetype = InitialData.youthArchetypes[Math.floor(Math.random() * InitialData.youthArchetypes.length)];
  }

  const pot = Math.floor(Math.random() * (tpl.potMax - tpl.potMin + 1)) + tpl.potMin;
  let ownerTeamId = GameState.userTeamId;
  let isUserAcademy = true;

  if (destination === "RANDOM_ACADEMY") {
    const otherTeams = GameState.teams.filter(t => t.id !== GameState.userTeamId);
    const randomClub = otherTeams[Math.floor(Math.random() * otherTeams.length)];
    ownerTeamId = randomClub.id;
    isUserAcademy = false;
    addNews(`🌍 ¡Cantera Global! ${name} (${tpl.age} años, ${tpl.rank}, ${archetype}) entró en la academia de ${randomClub.name}.`, "prodigy");
  } else {
    addNews(`🌟 ¡Mi Cantera! Reclutaste a ${name} (${tpl.age} años, ${tpl.rank}, ${archetype}, Pot. ${pot}).`, "prodigy");
  }

  GameState.academyProspects.push({
    id: "acad_" + Date.now() + "_" + Math.random(),
    name, country, age: tpl.age, rank: tpl.rank, archetype,
    ovr: tpl.ovr, pot, ownerTeamId, isUserAcademy,
    loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0
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

function poachRivalProspect(prospectId) {
  const userTeam = getUserTeam();
  const p = GameState.academyProspects.find(x => x.id === prospectId);
  if (!p || p.isUserAcademy) return;
  const fee = p.ovr * 950;
  if (userTeam.budget < fee) return alert(`Necesitás $${fee.toLocaleString()} de cláusula de formación.`);
  userTeam.budget -= fee;
  p.ownerTeamId = userTeam.id;
  p.isUserAcademy = true;
  addNews(`🤝 ¡Fichaje Juvenil! Pagaste $${fee.toLocaleString()} y trajiste a ${p.name} a tu cantera.`, "prodigy");
  refreshAllUI();
}

function promoteProspectToFirstTeam(prospectId) {
  const idx = GameState.academyProspects.findIndex(x => x.id === prospectId);
  if (idx === -1) return;
  const p = GameState.academyProspects[idx];
  if (!p.isUserAcademy) return;
  if (p.age < 15) return alert(`${p.name} tiene ${p.age} años. La edad mínima RLCS es 15 años.`);

  const roleMap = {
    "Freestyler": "Striker",
    "Ranked Demon 1v1": "Striker",
    "Cerebro Táctico": "Third Man",
    "Diamante en Bruto": "Playmaker"
  };
  GameState.players.push({
    id: "pro_" + Date.now(),
    name: p.name, country: p.country, age: p.age, ovr: p.ovr, pot: p.pot,
    mec: p.archetype === "Freestyler" ? p.ovr + 4 : p.ovr + 1,
    rot: p.archetype === "Cerebro Táctico" ? p.ovr + 3 : p.ovr - 1,
    def: p.archetype === "Cerebro Táctico" ? p.ovr + 2 : p.ovr - 1,
    role: roleMap[p.archetype] || "Striker",
    personality: "Promesa Ambiciosa",
    contractYears: 3,
    teamId: GameState.userTeamId,
    starter: false,
    stamina: 100,
    value: p.ovr * 4200,
    goals: 0, assists: 0, saves: 0, streak: 0
  });
  GameState.academyProspects.splice(idx, 1);
  addNews(`¡${p.name} (15 años, OVR ${p.ovr}, ${p.archetype}) debuta en tu primer equipo!`, "prodigy");
  refreshAllUI();
}

function progressAcademyStep() {
  const coach = getTeamCoach(getUserTeam().id);
  const formadorBonus = (coach && coach.specialty.includes("Formador")) ? 0.08 : 0;
  const facilityBonus = (GameState.facilities.academy - 1) * 0.04;
  const mgrBonus = GameState.manager.specialty === "ACADEMY" ? 0.06 : 0;

  GameState.academyProspects.forEach(p => {
    const activeInLeague = p.loanLeagueId || !p.isUserAcademy;
    if (activeInLeague) {
      p.loanGoals += Math.floor(Math.random() * 3) + 1;
      p.loanAssists += Math.floor(Math.random() * 2) + 1;
    }
    const chance = (activeInLeague ? 0.20 : 0.12) + (p.isUserAcademy ? (formadorBonus + facilityBonus + mgrBonus) : 0);
    if (Math.random() < chance && p.ovr < p.pot) {
      p.ovr++;
      if (p.ovr >= 68 && p.rank === "C3") p.rank = "GC1";
      else if (p.ovr >= 72 && p.rank === "GC1") p.rank = "GC2";
      else if (p.ovr >= 76 && p.rank === "GC2") p.rank = "GC3";
      else if (p.ovr >= 80 && p.rank === "GC3") p.rank = "SSL";
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
      if (gA >= gB) { a.pg++; a.pts += 3; a.dg += (gA - gB + 1); b.pp++; b.dg -= (gA - gB + 1); }
      else { b.pg++; b.pts += 3; b.dg += (gB - gA); a.pp++; a.dg -= (gB - gA); }
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
    const ownerClub = getTeamById(p.ownerTeamId)?.name || "Academia Rival";
    return `
      <div class="academy-item">
        <div>
          <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> ${Graphics.renderRankBadge(p.rank)}
          <div class="muted">${p.age} años • OVR ${p.ovr} (Pot. ${p.pot}) • <em>${p.archetype || "Prodigio"}</em></div>
          <span class="badge">${p.isUserAcademy ? (p.loanClub ? `Cedido en ${p.loanClub}` : "Mi Cantera") : `Cantera de ${ownerClub}`} (${p.loanGoals}G / ${p.loanAssists}A)</span>
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
        ` : `
          <button class="btn-outline btn-sm" onclick="poachRivalProspect('${p.id}')">Fichar Juvenil ($${(p.ovr * 950).toLocaleString()})</button>
        `}
      </div>
    `;
  }).join("") : `<p class="muted">No hay juveniles registrados en esta vista todavía.</p>`;
}

// 5. MERCADO, INTERCAMBIOS (TRADES) Y SPONSORS
function renderMarket() {
  const filter = document.getElementById("market-type-filter").value;
  const list = document.getElementById("market-list");
  const userTeam = getUserTeam();

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
    const discValue = GameState.manager.specialty === "NEGOTIATOR" ? Math.round(p.value * 0.85) : p.value;
    return `
      <div class="market-item">
        <div>
          <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> <span class="badge">OVR ${p.ovr}</span>
          <div class="muted">${p.age} años • ${p.role || "Striker"} • ${currentClub}</div>
          <div class="money" style="font-size:0.85rem;">Valor: $${discValue.toLocaleString()}</div>
        </div>
        <button class="btn-primary btn-sm" onclick="openNegotiationModal('${p.id}')">Negociar / Trade</button>
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
  const discValue = GameState.manager.specialty === "NEGOTIATOR" ? Math.round(p.value * 0.85) : p.value;

  document.getElementById("neg-title").textContent = `Negociar por ${p.name} (OVR ${p.ovr})`;
  document.getElementById("neg-subtitle").textContent = `${club} • Valor Estimado: $${discValue.toLocaleString()}`;
  document.getElementById("neg-details").innerHTML = `
    <div>• Edad: <strong>${p.age} años</strong> | Rol: <strong>${p.role || "Striker"}</strong> | Potencial: <strong>${p.pot}</strong></div>
    <div>• Prestigio mínimo exigido: <strong>${p.ovr >= 92 ? "86+" : "68+"}</strong></div>
  `;
  document.getElementById("neg-offer-amount").value = discValue;

  // Poblar selector de intercambio (Trade)
  const myRoster = getTeamRoster(GameState.userTeamId, false);
  const tradeSel = document.getElementById("neg-trade-player");
  tradeSel.innerHTML = `<option value="">Solo dinero (Sin jugador a cambio)</option>` +
    (p.teamId && myRoster.length > 3 ? myRoster.map(mp => `<option value="${mp.id}">Incluir a ${mp.name} (OVR ${mp.ovr} • Val. $${mp.value.toLocaleString()})</option>`).join("") : "");

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
  const tradePlayerId = document.getElementById("neg-trade-player").value;
  const years = parseInt(document.getElementById("neg-contract-years").value) || 2;
  const role = document.getElementById("neg-role-promise").value;
  const fb = document.getElementById("neg-feedback");
  fb.classList.remove("hidden");

  if (offer > userTeam.budget) {
    fb.textContent = "❌ Presupuesto insuficiente.";
    return;
  }

  const tradedPlayer = tradePlayerId ? GameState.players.find(x => x.id === tradePlayerId) : null;
  const tradeValue = tradedPlayer ? Math.round(tradedPlayer.value * 0.85) : 0;
  const totalPackage = offer + tradeValue;
  const targetValue = GameState.manager.specialty === "NEGOTIATOR" ? Math.round(p.value * 0.85) : p.value;

  if (p.ovr >= 92 && userTeam.rep < 86 && totalPackage < targetValue * 1.25) {
    fb.textContent = `⚠️ ${p.name} exige un club con prestigio 86+ (actual: ${userTeam.rep}) o una oferta 25% mayor.`;
    return;
  }

  const ratio = totalPackage / targetValue;
  const roleBonus = role === "STARTER" ? 0.12 : -0.15;
  if (ratio + roleBonus >= 1.02) {
    const oldTeamId = p.teamId;
    userTeam.budget -= offer;
    p.teamId = userTeam.id;
    p.contractYears = years;
    p.starter = role === "STARTER" && getTeamRoster(userTeam.id, true).length < 3;

    if (tradedPlayer && oldTeamId) {
      tradedPlayer.teamId = oldTeamId;
      tradedPlayer.starter = true;
      addNews(`🔄 ¡TRADE BOMBA! ${p.name} llega a ${userTeam.name} a cambio de ${tradedPlayer.name} + $${offer.toLocaleString()}.`);
    } else {
      addNews(`🤝 ¡FICHAJE CERRADO! ${p.name} firmó por ${years} temporadas ($${offer.toLocaleString()}).`);
    }
    closeNegotiationModal();
    refreshAllUI();
  } else if (ratio + roleBonus >= 0.85) {
    fb.textContent = `💬 Contraoferta: Piden un paquete total de $${Math.round(targetValue * 1.08).toLocaleString()} y rol Titular.`;
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

// 6. CARRERA DT (CAMBIAR DE EQUIPO E INSTALACIONES ESTILO FIFA DT)
function renderCareerTab() {
  const mgr = GameState.manager;
  const userTeam = getUserTeam();
  document.getElementById("mgr-rep-badge").textContent = `Reputación DT: ${mgr.rep} • Confianza: ${mgr.confidence}%`;

  const specNames = {
    ACADEMY: "Formador de Canteras (+Progreso Juvenil)",
    TACTICIAN: "Estratega de Playoffs (+2 OVR en Bo7)",
    NEGOTIATOR: "Negociador Tiburón (-15% Fichajes)"
  };

  document.getElementById("manager-profile-box").innerHTML = `
    <div class="award-card">
      <strong>${Graphics.getFlag(mgr.country)} Mánager ${mgr.name}</strong>
      <div class="muted" style="margin-top:4px;">Especialidad: ${specNames[mgr.specialty] || mgr.specialty}</div>
      <div class="muted">Récord Carrera: <strong>${GameState.careerStats.wins}V - ${GameState.careerStats.losses}D</strong> • Títulos Totales: <strong>${GameState.trophiesWon.length}</strong></div>
    </div>
  `;

  const f = GameState.facilities;
  document.getElementById("club-facilities-box").innerHTML = `
    <div class="academy-item">
      <div><strong>🏠 Gaming House (Nivel ${f.gamingHouse}/5)</strong><div class="muted">Reduce el desgaste de energía mental entre series.</div></div>
      <button class="btn-primary btn-sm" onclick="upgradeFacility('gamingHouse')">Mejorar ($${(f.gamingHouse * 45000).toLocaleString()})</button>
    </div>
    <div class="academy-item">
      <div><strong>🌱 Centro Juvenil (Nivel ${f.academy}/5)</strong><div class="muted">Aumenta la velocidad de evolución de tu cantera.</div></div>
      <button class="btn-primary btn-sm" onclick="upgradeFacility('academy')">Mejorar ($${(f.academy * 45000).toLocaleString()})</button>
    </div>
    <div class="academy-item">
      <div><strong>📢 Marketing & Decal Store (Nivel ${f.marketing}/5)</strong><div class="muted">Aumenta ingresos de sponsors y Media Days.</div></div>
      <button class="btn-primary btn-sm" onclick="upgradeFacility('marketing')">Mejorar ($${(f.marketing * 45000).toLocaleString()})</button>
    </div>
  `;

  document.getElementById("manager-history-list").innerHTML = mgr.history.map(h => `
    <div class="news-item"><strong>${h.teamName} (${h.region})</strong> • Temp. ${h.fromSeason} - ${h.toSeason} • Títulos ganados aquí: ${h.titles}</div>
  `).join("");

  // Clubes disponibles para cambiar de equipo estilo FIFA Modo Carrera
  const jobs = GameState.teams
    .filter(t => t.id !== userTeam.id)
    .sort((a, b) => b.rep - a.rep);

  document.getElementById("available-jobs-list").innerHTML = jobs.map(t => {
    const canApply = mgr.rep >= t.rep - 5;
    return `
      <div class="academy-item">
        <div style="display:flex;align-items:center;gap:10px;">
          ${Graphics.renderCrest(t, 40)}
          <div>
            <strong>${t.name}</strong> <span class="badge">${t.region} • ${t.division}</span>
            <div class="muted">OVR ${getTeamOvr(t.id)} • Presupuesto: $${t.budget.toLocaleString()} • Req. Rep DT: ${t.rep - 5}</div>
          </div>
        </div>
        ${canApply
          ? `<button class="btn-success btn-sm" onclick="acceptJobOffer('${t.id}')">Firmar Contrato</button>`
          : `<span class="muted" style="font-size:0.75rem;">🔒 Requiere más Rep.</span>`}
      </div>
    `;
  }).join("");
}

function upgradeFacility(key) {
  const userTeam = getUserTeam();
  const lvl = GameState.facilities[key];
  if (lvl >= 5) return alert("Instalación ya está al máximo (Nivel 5).");
  const cost = lvl * 45000;
  if (userTeam.budget < cost) return alert(`Necesitás $${cost.toLocaleString()}.`);
  userTeam.budget -= cost;
  GameState.facilities[key]++;
  addNews(`🏗️ Mejoraste ${key} de ${userTeam.name} a Nivel ${GameState.facilities[key]}.`);
  refreshAllUI();
}

function acceptJobOffer(newTeamId) {
  const newTeam = getTeamById(newTeamId);
  if (!newTeam) return;
  if (GameState.manager.history.length > 0) {
    GameState.manager.history[0].toSeason = GameState.season;
  }
  GameState.userTeamId = newTeam.id;
  GameState.selectedRegionTab = newTeam.region;
  GameState.manager.confidence = 82;
  GameState.pendingJobOffer = null;
  GameState.activeSponsor = null;
  recordManagerClubJoin(newTeam);

  // Transferir propiedad de "Mi Cantera" al nuevo club o mantenerla en la org anterior
  GameState.academyProspects.forEach(p => {
    if (p.isUserAcademy) {
      p.isUserAcademy = false;
    }
  });

  addNews(`👔 ¡CAMBIO DE CLUB! ${GameState.manager.name} dejó su cargo anterior y asumió como nuevo DT de ${newTeam.name} (${newTeam.region}).`, "prodigy");
  initSwissForCurrentEvent();
  generateTournamentBracket();
  pickNextOpponent();
  refreshAllUI();
}

// 7. GALAS, VITRINA Y RÉCORDS HISTÓRICOS
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
    : `<p class="muted">Los premios individuales se entregan en la Gala al finalizar cada temporada.</p>`;

  const cabinet = document.getElementById("club-trophy-cabinet");
  if (GameState.trophiesWon.length === 0) {
    cabinet.innerHTML = `<p class="muted">Aún no hay copas en tu vitrina de carrera.</p>`;
  } else {
    const grouped = {};
    GameState.trophiesWon.forEach(t => {
      if (!grouped[t.compName]) grouped[t.compName] = { compId: t.compId, compName: t.compName, years: [] };
      grouped[t.compName].years.push(t.season);
    });
    cabinet.innerHTML = Object.values(grouped).map(g => `
      <div class="trophy-item">
        <span class="trophy-count-badge">x${g.years.length}</span>
        ${Graphics.renderTrophy(g.compId, 48)}
        <h4 style="margin-top:6px;font-size:0.84rem;">${g.compName}</h4>
        <div class="muted" style="font-size:0.74rem;margin:4px 0 0;">${g.years.join(", ")}</div>
      </div>
    `).join("");
  }

  document.getElementById("all-time-records-box").innerHTML = `
    <div class="news-item">⚽ <strong>Récord Goles en 1 Temporada:</strong> ${GameState.records.topScorerSeason.name} (${GameState.records.topScorerSeason.val} goles)</div>
    <div class="news-item">💰 <strong>Venta Más Cara de Carrera:</strong> ${GameState.records.biggestSale.name} ($${GameState.records.biggestSale.val.toLocaleString()})</div>
    <div class="news-item">🔥 <strong>Mejor Racha Invicta de Series:</strong> ${GameState.records.bestStreak} series seguidas</div>
  `;

  const hofEl = document.getElementById("hall-of-fame-list");
  hofEl.innerHTML = GameState.hallOfFame.length
    ? GameState.hallOfFame.map(h => `<div class="news-item prodigy">🏛️ <strong>${h.name}</strong> — Retirado a los ${h.age} años (${h.goals}G / ${h.assists}A).</div>`).join("")
    : `<p class="muted">Los jugadores que se retiren bajo tu mando quedarán inmortalizados aquí.</p>`;

  const compFilter = document.getElementById("history-comp-filter")?.value || "ALL";
  const filteredHist = GameState.championsHistory.filter(h => compFilter === "ALL" || h.compId === compFilter);
  const hist = document.getElementById("champions-history-list");
  hist.innerHTML = filteredHist.length
    ? filteredHist.map(h => `<div class="news-item"><strong>[${h.season}] ${h.compName}:</strong> ${h.winnerName}</div>`).join("")
    : `<p class="muted">Sin campeones registrados.</p>`;
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
      mec: ovr + 1, rot: ovr, def: ovr - 1, role: tacticRole, personality: "Líder Nato",
      contractYears: 2, teamId, stamina: 100,
      starter: teamId ? getTeamRoster(teamId, true).length < 3 : false,
      value: ovr * 4500, goals: 0, assists: 0, saves: 0, streak: 0
    });
  }
  document.getElementById("edit-person-name").value = "";
  addNews(`Se añadió a ${name} a la base de datos.`);
  refreshAllUI();
}

// CAMBIO DE TEMPORADA (INCLUYE ASCENSOS/DESCENSOS Y NUEVO PARCHE META)
function advanceNewSeason() {
  if (GameState.activeSponsor?.id === "sp_nvidia" && getTeamChemistry(GameState.userTeamId) >= 88) {
    getUserTeam().budget += 20000;
    addNews(`💼 Bono NVIDIA: +$20,000 por mantener química superior al 88%.`);
  }

  // Ascensos y Descensos por región
  ["EU", "NA", "SAM", "MENA"].forEach(reg => {
    const proList = GameState.teams.filter(t => t.region === reg && t.division === "PRO").sort((a, b) => b.points - a.points);
    const chalList = GameState.teams.filter(t => t.region === reg && t.division === "CHALLENGER").sort((a, b) => b.points - a.points);
    if (proList.length > 0 && chalList.length > 0) {
      const relegated = proList[proList.length - 1];
      const promoted = chalList[0];
      if (promoted.points > 0) {
        relegated.division = "CHALLENGER";
        promoted.division = "PRO";
        addNews(`🔄 Ascenso/Descenso (${reg}): ${promoted.name} asciende a Primera RLCS y ${relegated.name} baja a Challenger.`, "prodigy");
      }
    }
  });

  GameState.season++;
  GameState.scheduleIndex = 0;
  GameState.activeSponsor = null;
  GameState.metaPatch = InitialData.metaPatches[GameState.season % InitialData.metaPatches.length];
  addNews(`=== INICIO DE LA TEMPORADA ${GameState.season} (${GameState.metaPatch}) ===`, "prodigy");

  GameState.teams.forEach(t => t.points = 0);
  buildNationalTables();

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
          mec: p.ovr + 1, rot: p.ovr, def: p.ovr - 1, role: "Striker", personality: "Promesa Ambiciosa",
          contractYears: 3, teamId: owner.id, starter: false, stamina: 100,
          value: p.ovr * 4200, goals: 0, assists: 0, saves: 0, streak: 0
        });
        addNews(`🎓 ${p.name} (15 años, OVR ${p.ovr}) fue promovido al primer equipo de ${owner.name}.`, "prodigy");
      }
      return false;
    }
    return true;
  });

  GameState.players = GameState.players.filter(p => {
    p.age++;
    p.stamina = 100;
    if (p.teamId) {
      p.contractYears = (p.contractYears || 1) - 1;
      if (p.contractYears <= 0) {
        if (p.teamId === GameState.userTeamId) addNews(`⚠️ Venció el contrato de ${p.name} y quedó como Agente Libre.`);
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
        addNews(`🏛️ ¡${p.name} se retira bajo tu dirección e ingresa al Salón de la Fama!`);
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

    p.goals = 0;
    p.assists = 0;
    p.saves = 0;
    return true;
  });

  triggerProspectDiscovery();
  triggerProspectDiscovery();
  initSwissForCurrentEvent();
  generateTournamentBracket();
  pickNextOpponent();
  refreshAllUI();
  saveGame(false);
}

function saveGame(notify) {
  localStorage.setItem("rl_career_save_v5", JSON.stringify(GameState));
  if (notify) alert("Carrera v5.0 guardada correctamente.");
}

function loadSavedGame() {
  const raw = localStorage.getItem("rl_career_save_v5");
  if (!raw) return;
  GameState = JSON.parse(raw);
  launchGameUI();
}

function resetCareer() {
  if (confirm("¿Seguro que querés reiniciar y volver al menú?")) {
    localStorage.removeItem("rl_career_save_v5");
    location.reload();
  }
}
