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
    nationalTeamCode: null,
    history: []
  },
  facilities: {
    gamingHouse: 1,
    academy: 1,
    marketing: 1
  },
  tacticalBoard: {
    style: "balanced",
    boostPriority: "balanced",
    strikerRole: "All-Round",
    playmakerRole: "Infield Passer",
    thirdManRole: "Goal-Line Anchor"
  },
  hiredScouts: [],
  scoutReports: [],
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
  pendingJobOffer: null,
  pendingNationalOffer: null,
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
  animFrameId: null,
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
  zeroSecOffered: false,
  simState: null
};

let ActiveNegotiationPlayerId = null;
let CombinePool = [];

// INICIALIZACIÓN
window.onload = () => {
  document.getElementById("hero-logo").innerHTML = Graphics.renderTrophy("rlcs_worlds", 68);
  updateCustomCrestPreview();
  renderSetupTeams();
  if (
    localStorage.getItem("rl_career_save_v7") ||
    localStorage.getItem("rl_career_save_v6") ||
    localStorage.getItem("rl_career_save_v5")
  ) {
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
      goals: 0, assists: 0, saves: 0, matches: 0,
      careerGoals: 0, careerAssists: 0, careerSaves: 0, careerTitles: 0,
      clubHistory: [name],
      streak: 0
    });
  }

  runAIManagement();
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
  runAIManagement();
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
  GameState.players = JSON.parse(JSON.stringify(InitialData.players)).map(p => ({
    ...p,
    matches: p.matches || 0,
    careerGoals: p.careerGoals || 0,
    careerAssists: p.careerAssists || 0,
    careerSaves: p.careerSaves || 0,
    careerTitles: p.careerTitles || 0,
    clubHistory: p.teamId ? [InitialData.teams.find(t => t.id === p.teamId)?.name || "Club"] : ["Agente Libre"]
  }));
  GameState.coaches = JSON.parse(JSON.stringify(InitialData.coaches));
  GameState.academyProspects = [];
  GameState.customNameQueue = [];
  GameState.hiredScouts = [];
  GameState.scoutReports = [];
  GameState.trophiesWon = [];
  GameState.championsHistory = [];
  GameState.awardsHistory = [];
  GameState.hallOfFame = [];
  GameState.headToHead = {};
  GameState.careerStats = { wins: 0, losses: 0, youthSales: 0 };
  GameState.facilities = { gamingHouse: 1, academy: 1, marketing: 1 };
  GameState.tacticalBoard = {
    style: "balanced",
    boostPriority: "balanced",
    strikerRole: "All-Round",
    playmakerRole: "Infield Passer",
    thirdManRole: "Goal-Line Anchor"
  };
  GameState.metaPatch = InitialData.metaPatches[0];
  GameState.activeSponsor = null;
  GameState.bootcampActive = false;
  GameState.weeklyPrepDone = false;
  GameState.prepBonus = { ovr: 0, chem: 0 };
  GameState.incomingOffer = null;
  GameState.pendingJobOffer = null;
  GameState.pendingNationalOffer = null;
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
    userBonus += ((GameState.facilities?.gamingHouse || 1) - 1) * 0.6;
  }
  return Math.round(base + chemBonus + coachBonus + userBonus);
}

function addNews(text, type = "normal") {
  GameState.news.unshift({ text, type, season: GameState.season });
  if (GameState.news.length > 60) GameState.news.pop();
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
  document.getElementById("top-season").textContent = `${GameState.season} • ${(GameState.metaPatch || "").split(":")[0]}`;
  document.getElementById("top-stage").textContent = stage.compName;
  document.getElementById("top-budget").textContent = "$" + team.budget.toLocaleString();
  document.getElementById("top-points").textContent = `${team.points} pts • Conf. ${GameState.manager.confidence}%`;

  renderOffice();
  renderCompetitionView();
  renderSquadAndCoach();
  renderAcademy();
  renderMarket();
  renderNationalTab();
  renderCareerTab();
  renderAwardsAndTrophies();
  populateEditorTeams();
}

// SISTEMA SUIZO Y LLAVES
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

// 1. OFICINA Y PREPARACIÓN SEMANAL
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
    const mediaGain = 8000 + ((GameState.facilities?.marketing || 1) - 1) * 4000;
    userTeam.budget += mediaGain;
    starters.forEach(p => p.stamina = Math.min(100, (p.stamina ?? 100) + 22));
    addNews(`🔋 Descanso y Media Day (+22% Energía y +$${mediaGain.toLocaleString()} de sponsors).`);
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
    <div class="vs-team clickable-link" onclick="openClubDetailModal('${userTeam.id}')">
      ${Graphics.renderCrest(userTeam, 64)}
      <strong>${userTeam.name}</strong>
      <span class="badge">OVR ${getTeamOvr(userTeam.id)} • ${userTeam.car || "Fennec"}</span>
    </div>
    <div class="vs-center">
      <div class="vs-badge">VS</div>
      <div class="muted">Premio: $${stage.prize.toLocaleString()}</div>
    </div>
    <div class="vs-team clickable-link" onclick="openClubDetailModal('${opp.id}')">
      ${Graphics.renderCrest(opp, 64)}
      <strong>${opp.name}</strong>
      <span class="badge">OVR ${getTeamOvr(opp.id)} • ${opp.car || "Octane"}</span>
    </div>
  `;

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
  } else if (GameState.pendingNationalOffer) {
    const n = GameState.pendingNationalOffer;
    jobBox.innerHTML = `
      <div class="offer-alert" style="border-color:#facc15;background:rgba(250,204,21,0.14);">
        <strong>🌍 ¡FEDERACIÓN NACIONAL!</strong> La <strong>${n.name}</strong> te ofrece ser su Seleccionador Nacional para la FIFAe World Cup (sin dejar tu club).
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="btn-warning btn-sm" onclick="acceptNationalOffer('${n.code}')">Aceptar Selección</button>
          <button class="btn-secondary btn-sm" onclick="GameState.pendingNationalOffer=null;refreshAllUI();">Rechazar</button>
        </div>
      </div>
    `;
  } else {
    jobBox.innerHTML = "";
  }

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
      if (!player.clubHistory) player.clubHistory = [];
      player.clubHistory.push(o.buyerName);
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

// MOTOR DE PARTIDO 2D EN VIVO CON BOOST, DEMOLICIONES Y AERIALS
function formatClock(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function initPitchSimulationState() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const homeStarters = getTeamRoster(userTeam.id, true);
  const awayStarters = getTeamRoster(opp.id, true);

  const cars = [];
  homeStarters.forEach((p, idx) => {
    cars.push({
      id: p.id, name: p.name, role: p.role || "Striker", isHome: true,
      x: 160 - idx * 35, y: 90 + idx * 90,
      tx: 250, ty: 180, boost: 45, boosting: false, demoTimer: 0
    });
  });
  awayStarters.forEach((p, idx) => {
    cars.push({
      id: p.id, name: p.name, role: p.role || "Striker", isHome: false,
      x: 480 + idx * 35, y: 90 + idx * 90,
      tx: 390, ty: 180, boost: 45, boosting: false, demoTimer: 0
    });
  });

  LiveMatch.simState = {
    ball: { x: 320, y: 180, vx: 0, vy: 0, aerial: false },
    cars,
    boostPads: [
      { x: 64, y: 42, active: true, respawn: 0 },
      { x: 320, y: 38, active: true, respawn: 0 },
      { x: 576, y: 42, active: true, respawn: 0 },
      { x: 64, y: 318, active: true, respawn: 0 },
      { x: 320, y: 322, active: true, respawn: 0 },
      { x: 576, y: 318, active: true, respawn: 0 }
    ]
  };
  renderBoostHud();
  Graphics.drawPitch2D(document.getElementById("rl-pitch-canvas"), LiveMatch.simState);
}

function renderBoostHud() {
  const hud = document.getElementById("live-boost-hud");
  if (!hud || !LiveMatch.simState) return;
  const homeCars = LiveMatch.simState.cars.filter(c => c.isHome);
  const awayCars = LiveMatch.simState.cars.filter(c => !c.isHome);
  hud.innerHTML = `
    <div style="color:#38bdf8;">${homeCars.map(c => `${c.name}: <strong>${Math.round(c.boost)}%</strong>`).join(" | ")}</div>
    <div style="color:#fb923c;">${awayCars.map(c => `${c.name}: <strong>${Math.round(c.boost)}%</strong>`).join(" | ")}</div>
  `;
}

function stepPitchAnimation() {
  if (!LiveMatch.running || !LiveMatch.simState) return;
  const st = LiveMatch.simState;
  const ball = st.ball;

  // Mover pelota con rebote en paredes
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vx *= 0.96;
  ball.vy *= 0.96;

  if (ball.x < 48) { ball.x = 48; ball.vx = Math.abs(ball.vx) + 1.5; }
  if (ball.x > 592) { ball.x = 592; ball.vx = -Math.abs(ball.vx) - 1.5; }
  if (ball.y < 30) { ball.y = 30; ball.vy = Math.abs(ball.vy) + 1.2; }
  if (ball.y > 330) { ball.y = 330; ball.vy = -Math.abs(ball.vy) - 1.2; }

  // Respawn de Boost Pads
  st.boostPads.forEach(pad => {
    if (!pad.active) {
      pad.respawn--;
      if (pad.respawn <= 0) pad.active = true;
    }
  });

  // Mover cada auto según rol y boost
  st.cars.forEach(car => {
    if (car.demoTimer > 0) {
      car.demoTimer--;
      if (car.demoTimer === 0) {
        car.x = car.isHome ? 70 : 570;
        car.y = 180;
        car.boost = 33;
      }
      return;
    }

    // Buscar pad de 100 boost si tiene poco
    let targetX = ball.x;
    let targetY = ball.y;

    if (car.boost < 28) {
      const availPad = st.boostPads.find(p => p.active && ((car.isHome && p.x < 350) || (!car.isHome && p.x > 290)));
      if (availPad) {
        targetX = availPad.x;
        targetY = availPad.y;
      }
    } else if (car.role === "Third Man") {
      targetX = car.isHome ? Math.min(340, Math.max(90, ball.x - 140)) : Math.max(300, Math.min(550, ball.x + 140));
      targetY = 180 + (ball.y - 180) * 0.45;
    } else if (car.role === "Playmaker") {
      targetX = ball.x + (car.isHome ? -35 : 35);
      targetY = ball.y > 180 ? ball.y - 55 : ball.y + 55;
    }

    const dx = targetX - car.x;
    const dy = targetY - car.y;
    const dist = Math.hypot(dx, dy) || 1;
    car.boosting = car.boost > 15 && dist > 65;
    const speed = car.boosting ? 3.8 : 2.3;

    car.x += (dx / dist) * speed;
    car.y += (dy / dist) * speed;
    if (car.boosting) car.boost = Math.max(0, car.boost - 0.45);
    else car.boost = Math.min(100, car.boost + 0.08);

    // Recoger Big Boost Pad
    st.boostPads.forEach(pad => {
      if (pad.active && Math.hypot(car.x - pad.x, car.y - pad.y) < 18) {
        pad.active = false;
        pad.respawn = 120;
        car.boost = 100;
      }
    });

    // Golpear pelota
    if (Math.hypot(car.x - ball.x, car.y - ball.y) < 19) {
      const dir = car.isHome ? 1 : -1;
      ball.vx = dir * (4.5 + Math.random() * 4);
      ball.vy = (Math.random() - 0.5) * 6;
      ball.aerial = Math.random() > 0.65;
    }
  });

  Graphics.drawPitch2D(document.getElementById("rl-pitch-canvas"), st);
  LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
}

function startLiveSeries() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];

  clearInterval(LiveMatch.timerId);
  cancelAnimationFrame(LiveMatch.animFrameId);

  LiveMatch = {
    active: true, running: false, timerId: null, animFrameId: null,
    secondsLeft: 300, speedMultiplier: 1,
    homeWins: 0, awayWins: 0,
    winsNeeded: stage.format === "Bo7" ? 4 : 3,
    gameNum: 1, gHome: 0, gAway: 0,
    tactic: GameState.tacticalBoard?.style || "balanced",
    timeoutUsed: false, timeoutBoostActive: false, zeroSecOffered: false,
    simState: null
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

  initPitchSimulationState();
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

  initPitchSimulationState();

  document.getElementById("live-map-score").textContent = "0 - 0";
  document.getElementById("live-clock").textContent = "5:00";
  document.getElementById("btn-play-next-map").classList.add("hidden");
  document.getElementById("btn-skip-map").classList.remove("hidden");
  document.getElementById("zero-second-alert").classList.add("hidden");

  logLiveEvent(`<hr style="border-color:#1e293b;margin:6px 0;"><strong>▶ KICKOFF — JUEGO ${LiveMatch.gameNum} (5:00):</strong>`);
  LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);

  LiveMatch.timerId = setInterval(() => {
    const step = 12 * LiveMatch.speedMultiplier;
    LiveMatch.secondsLeft = Math.max(0, LiveMatch.secondsLeft - step);
    document.getElementById("live-clock").textContent = formatClock(LiveMatch.secondsLeft);

    simulateTickEvent(LiveMatch.secondsLeft);
    renderBoostHud();

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
  if (GameState.manager.specialty === "TACTICIAN") homeOvr += 2;
  if (LiveMatch.timeoutBoostActive) homeOvr += 5;

  const diff = homeOvr - awayOvr;
  const homeChance = Math.min(0.84, Math.max(0.16, 0.50 + diff * 0.032));
  const eventProb = LiveMatch.tactic === "aggressive" ? 0.17 : (LiveMatch.tactic === "defensive" ? 0.09 : 0.12);
  const timeStr = formatClock(secLeft);

  // Evento de Demolición en cancha
  if (LiveMatch.simState && Math.random() < (LiveMatch.tactic === "aggressive" ? 0.10 : 0.04)) {
    const victimCar = LiveMatch.simState.cars[Math.floor(Math.random() * LiveMatch.simState.cars.length)];
    if (victimCar && victimCar.demoTimer === 0) {
      victimCar.demoTimer = 90;
      logLiveEvent(`💥 [${timeStr}] <strong>¡DEMOLICIÓN!</strong> ${victimCar.name} explotó y queda 3s fuera de rotación.`);
    }
  }

  if (Math.random() < eventProb) {
    if (Math.random() < homeChance) {
      LiveMatch.gHome++;
      const scorer = homeStarters[Math.floor(Math.random() * homeStarters.length)];
      const assister = homeStarters.find(p => p.id !== scorer?.id);
      if (scorer) { scorer.goals++; scorer.careerGoals = (scorer.careerGoals || 0) + 1; }
      if (assister && Math.random() > 0.3) { assister.assists++; assister.careerAssists = (assister.careerAssists || 0) + 1; }
      if (LiveMatch.simState) {
        LiveMatch.simState.ball.x = 580;
        LiveMatch.simState.ball.y = 180;
      }
      document.getElementById("live-map-score").textContent = `${LiveMatch.gHome} - ${LiveMatch.gAway}`;
      const shotType = Math.random() > 0.65 ? "Double Tap Aéreo" : (Math.random() > 0.5 ? "Flip Reset" : "Tiro Cruzado");
      logLiveEvent(`⏱️ [${timeStr}] ⚽ ¡GOLAZO DE <strong>${scorer?.name}</strong> (${shotType})${assister ? ` • Asist. ${assister.name}` : ""}!`);
    } else {
      LiveMatch.gAway++;
      const scorer = awayStarters[Math.floor(Math.random() * awayStarters.length)];
      const keeper = homeStarters.find(p => p.role === "Third Man") || homeStarters[0];
      if (scorer) { scorer.goals++; scorer.careerGoals = (scorer.careerGoals || 0) + 1; }
      if (keeper && Math.random() > 0.55) { keeper.saves++; keeper.careerSaves = (keeper.careerSaves || 0) + 1; }
      if (LiveMatch.simState) {
        LiveMatch.simState.ball.x = 60;
        LiveMatch.simState.ball.y = 180;
      }
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
      if (hero) { hero.goals++; hero.careerGoals = (hero.careerGoals || 0) + 1; }
      document.getElementById("live-map-score").textContent = `${LiveMatch.gHome} - ${LiveMatch.gAway}`;
      logLiveEvent(`🔥 <strong>[0:00 ZERO-SECOND DRIBBLE]</strong> ¡${hero?.name} mete un gol agónico sin que toque el suelo!`);
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
  cancelAnimationFrame(LiveMatch.animFrameId);
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
      if (homeStarters[0]) { homeStarters[0].goals++; homeStarters[0].careerGoals = (homeStarters[0].careerGoals || 0) + 1; }
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
        const sc = homeStarters[Math.floor(Math.random() * homeStarters.length)];
        const as = homeStarters.find(p => p.id !== sc.id);
        sc.goals += 2; sc.careerGoals = (sc.careerGoals || 0) + 2;
        if (as) { as.assists += 1; as.careerAssists = (as.careerAssists || 0) + 1; }
      }
    } else {
      a++;
      if (awayStarters.length) {
        const sc = awayStarters[Math.floor(Math.random() * awayStarters.length)];
        sc.goals += 2; sc.careerGoals = (sc.careerGoals || 0) + 2;
      }
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

// CIERRE DE SERIE, SIMULACIÓN MUNDIAL PARALELA Y PROGRESIÓN RLCS
function finalizeSeriesResult(homeWins, awayWins) {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const userWon = homeWins > awayWins;

  GameState.weeklyPrepDone = false;
  GameState.prepBonus = { ovr: 0, chem: 0 };

  if (!GameState.headToHead[opp.id]) GameState.headToHead[opp.id] = { w: 0, l: 0 };
  if (userWon) GameState.headToHead[opp.id].w++;
  else GameState.headToHead[opp.id].l++;

  const starters = getTeamRoster(userTeam.id, true);
  const oppStarters = getTeamRoster(opp.id, true);
  starters.forEach(p => {
    p.matches = (p.matches || 0) + 1;
    p.stamina = Math.max(25, (p.stamina ?? 100) - (10 + Math.floor(Math.random() * 8)));
    p.streak = userWon ? (p.streak || 0) + 1 : 0;
  });
  oppStarters.forEach(p => {
    p.matches = (p.matches || 0) + 1;
    p.streak = !userWon ? (p.streak || 0) + 1 : 0;
  });

  if (stage.stageType === "SWISS" || stage.stageType === "SWISS_END") {
    updateSwissStandings(userWon, opp.id);
    if (stage.stageType === "SWISS_END") generateTournamentBracket();
  } else {
    updateBracketProgress(userWon, opp, homeWins, awayWins);
  }

  if (userWon) {
    GameState.careerStats.wins++;
    GameState.records.currentStreak = (GameState.records.currentStreak || 0) + 1;
    if (GameState.records.currentStreak > (GameState.records.bestStreak || 0)) {
      GameState.records.bestStreak = GameState.records.currentStreak;
    }

    const mult = userTeam.division === "CHALLENGER" && stage.compId === "rlcs_regional" ? 0.55 : 1;
    const prizeWon = Math.round(stage.prize * mult);
    const ptsWon = stage.points;

    userTeam.budget += prizeWon;
    userTeam.points += ptsWon;
    GameState.manager.rep = Math.min(99, GameState.manager.rep + 1);
    GameState.manager.confidence = Math.min(100, GameState.manager.confidence + 3);
    addNews(`✅ Victoria ${homeWins}-${awayWins} vs ${opp.name} en ${stage.compName} (+$${prizeWon.toLocaleString()}, +${ptsWon} pts).`);

    if (stage.isFinal) {
      triggerChampionCeremony(userTeam, stage, prizeWon);
    }
  } else {
    GameState.careerStats.losses++;
    GameState.records.currentStreak = 0;
    GameState.manager.confidence = Math.max(25, GameState.manager.confidence - 4);
    const lossPts = Math.floor(stage.points * 0.35);
    userTeam.points += lossPts;
    addNews(`❌ Derrota ${homeWins}-${awayWins} ante ${opp.name} en ${stage.compName} (+${lossPts} pts).`);

    if (stage.isFinal) {
      const mvp = oppStarters[0]?.name || "MVP";
      GameState.championsHistory.unshift({
        season: GameState.season,
        compId: stage.compId,
        compName: stage.compName,
        teamId: opp.id,
        teamName: opp.name,
        mvp
      });
    }
  }

  // Simulación paralela de puntos RLCS en todas las regiones (EU, NA, SAM, MENA)
  GameState.teams.forEach(t => {
    if (t.id !== userTeam.id && t.id !== opp.id) {
      const ovrFactor = Math.max(0, getTeamOvr(t.id) - 74);
      const gain = Math.floor(Math.random() * 8) + Math.floor(ovrFactor * 0.65);
      t.points += gain;
    }
  });

  if (GameState.activeSponsor === "sp_nvidia" && getTeamChemistry(userTeam.id) > 88) {
    userTeam.budget += 20000;
    addNews(`💚 Bono Sponsor NVIDIA: +$20,000 por mantener Química superior al 88%.`);
  }

  simulateNationalLeaguesMatchday();
  advanceYouthAcademies();
  triggerRandomClubEvents();

  GameState.scheduleIndex++;
  const nextStage = InitialData.seasonSchedule[GameState.scheduleIndex];

  if (nextStage && nextStage.stageType === "SWISS") {
    initSwissForCurrentEvent();
  }

  if (nextStage && nextStage.isFinal) {
    askPreFinalPressConference(nextStage);
  }

  if (GameState.scheduleIndex >= InitialData.seasonSchedule.length) {
    handleEndOfSeason();
  } else {
    pickNextOpponent();
    refreshAllUI();
    saveGame(false);
  }
}

function askPreFinalPressConference(stage) {
  const opp = getTeamById(GameState.currentOpponentId);
  document.getElementById("press-question").textContent =
    `Periodista: "Mánager ${GameState.manager.name}, se viene la ${stage.roundName} contra ${opp ? opp.name : "un rival durísimo"}. ¿Cómo llega el roster mentalmente?"`;
  document.getElementById("press-modal").classList.remove("hidden");
}

function answerPressConference(tone) {
  document.getElementById("press-modal").classList.add("hidden");
  const starters = getTeamRoster(getUserTeam().id, true);
  if (tone === "CONFIDENT") {
    GameState.prepBonus.ovr += 1;
    addNews(`🔥 Rueda de prensa explosiva: "${GameState.manager.name} promete barrer la Final" (+1 OVR).`);
  } else if (tone === "HUMBLE") {
    GameState.prepBonus.chem += 3;
    addNews(`🤝 Rueda de prensa serena: el equipo muestra unión total (+3 Química).`);
  } else {
    starters.forEach(p => p.stamina = Math.min(100, (p.stamina ?? 100) + 12));
    addNews(`🧘 El equipo baja la presión antes de la Gran Final (+12% Energía).`);
  }
  refreshAllUI();
}

function triggerChampionCeremony(team, stage, prizeWon) {
  const starters = getTeamRoster(team.id, true);
  const mvp = [...starters].sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))[0] || starters[0];

  const isChal = team.division === "CHALLENGER" && stage.compId === "rlcs_regional";
  const compId = isChal ? "challenger_cup" : stage.compId;
  const compTitle = isChal ? stage.compName.replace("Open Regional", "Challenger League") : stage.compName;

  GameState.trophiesWon.push({ compId, compName: compTitle, season: GameState.season });
  GameState.championsHistory.unshift({
    season: GameState.season,
    compId,
    compName: compTitle,
    teamId: team.id,
    teamName: team.name,
    mvp: mvp ? mvp.name : "N/A"
  });

  starters.forEach(p => p.careerTitles = (p.careerTitles || 0) + 1);
  if (GameState.manager.history[0]) GameState.manager.history[0].titles++;

  GameState.manager.rep = Math.min(99, GameState.manager.rep + (stage.compId === "rlcs_worlds" ? 6 : 3));
  GameState.manager.confidence = 100;

  if (GameState.activeSponsor === "sp_hyperx") {
    team.budget += 30000;
    addNews("🎧 Bono Sponsor HyperX: +$30,000 por salir campeón.");
  } else if (GameState.activeSponsor === "sp_redbull" && (stage.compId.includes("major") || stage.compId === "rlcs_worlds")) {
    team.budget += 55000;
    addNews("🐂 Bono Sponsor Red Bull: +$55,000 por título Internacional LAN.");
  }

  document.getElementById("champ-trophy-icon").innerHTML = Graphics.renderTrophy(compId, 76);
  document.getElementById("champ-tournament-name").textContent = `¡CAMPEONES DE ${compTitle.toUpperCase()}!`;
  document.getElementById("champ-team-name").textContent = team.name;
  document.getElementById("champ-roster-names").textContent = `Roster Campeón: ${starters.map(p => p.name).join(" • ")}`;
  document.getElementById("champ-mvp-badge").textContent = `⭐ MVP: ${mvp ? mvp.name : "Equipo"}`;
  document.getElementById("champ-prize-text").textContent = `Premio recaudado: +$${prizeWon.toLocaleString()}`;

  const starChoice = document.getElementById("champ-star-choice");
  const closeBtn = document.getElementById("btn-close-champ-modal");
  if (stage.compId === "rlcs_worlds") {
    starChoice.classList.remove("hidden");
    closeBtn.classList.add("hidden");
  } else {
    starChoice.classList.add("hidden");
    closeBtn.classList.remove("hidden");
  }

  document.getElementById("champion-modal").classList.remove("hidden");
  addNews(`🏆 ¡${team.name} SE CONSAGRA CAMPEÓN DE ${compTitle} (${GameState.season})!`, "prodigy");
}

function confirmWorldChampionStar(addStar) {
  const userTeam = getUserTeam();
  if (addStar) {
    userTeam.stars = (userTeam.stars || 0) + 1;
    addNews(`⭐ ¡${userTeam.name} bordó su estrella mundial #${userTeam.stars} encima del escudo!`, "prodigy");
  }
  document.getElementById("champ-star-choice").classList.add("hidden");
  document.getElementById("btn-close-champ-modal").classList.remove("hidden");
  refreshAllUI();
}

function closeChampionModal() {
  document.getElementById("champion-modal").classList.add("hidden");
}

function triggerRandomClubEvents() {
  const userTeam = getUserTeam();
  const starters = getTeamRoster(userTeam.id, true);

  if (!GameState.incomingOffer && starters.length > 0 && Math.random() < 0.25) {
    const target = starters[Math.floor(Math.random() * starters.length)];
    const buyers = GameState.teams.filter(t => t.id !== userTeam.id && t.budget >= target.value * 0.8);
    if (buyers.length > 0) {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      GameState.incomingOffer = {
        buyerId: buyer.id,
        buyerName: buyer.name,
        playerId: target.id,
        playerName: target.name,
        amount: Math.round(target.value * (1.05 + Math.random() * 0.2))
      };
      addNews(`📩 ¡${buyer.name} envió una oferta por ${target.name}!`);
    }
  }

  if (!GameState.lockerEvent && starters.length > 0 && Math.random() < 0.22) {
    const p = starters[Math.floor(Math.random() * starters.length)];
    GameState.lockerEvent = {
      playerId: p.id,
      text: `${p.name} pide un bonus de rendimiento de $15,000 para renovar motivación antes de Playoffs.`,
      cost: 15000,
      yesLabel: "Pagar Bonus ($15k)",
      noLabel: "Denegar",
      winMsg: `${p.name} recibió su bonus y entra en racha ON FIRE (+2 OVR).`,
      loseMsg: `${p.name} quedó algo molesto con la directiva.`
    };
  }

  if (!GameState.pendingJobOffer && GameState.manager.rep >= 80 && Math.random() < 0.16) {
    const candidates = GameState.teams.filter(t => t.id !== userTeam.id && t.rep <= GameState.manager.rep + 6);
    if (candidates.length > 0) {
      const club = candidates[Math.floor(Math.random() * candidates.length)];
      GameState.pendingJobOffer = { teamId: club.id, teamName: club.name, region: club.region };
      addNews(`👔 Rumor de prensa: ${club.name} quiere ficharte como su nuevo Head Manager.`);
    }
  }

  // Oferta de Selección Nacional FIFAe
  if (!GameState.manager.nationalTeamCode && !GameState.pendingNationalOffer && GameState.manager.rep >= 85 && Math.random() < 0.25) {
    const eligible = InitialData.federations.filter(f => GameState.manager.rep >= f.minRep);
    if (eligible.length > 0) {
      const fed = eligible[Math.floor(Math.random() * eligible.length)];
      GameState.pendingNationalOffer = fed;
      addNews(`🌍 ¡La ${fed.name} te ofreció dirigir su Selección Nacional en la FIFAe World Cup!`, "prodigy");
    }
  }
}

// FIN DE TEMPORADA, ASCENSOS/DESCENSOS, RETIROS Y GALA
function handleEndOfSeason() {
  const userTeam = getUserTeam();
  GameState.bootcampActive = false;

  GameState.players.forEach(p => {
    if ((p.goals || 0) > GameState.records.topScorerSeason.val) {
      GameState.records.topScorerSeason = { name: `${p.name} (Temp. ${GameState.season})`, val: p.goals };
    }
  });

  // Gala de Premios Individuales
  const allActive = [...GameState.players];
  const rocketDor = [...allActive].sort((a, b) => (b.ovr * 2 + b.goals * 0.5 + b.assists * 0.4) - (a.ovr * 2 + a.goals * 0.5 + a.assists * 0.4))[0];
  const goldenBoot = [...allActive].sort((a, b) => b.goals - a.goals)[0];
  const kdbAward = [...allActive].sort((a, b) => b.assists - a.assists)[0];
  const goldenGlove = [...allActive].sort((a, b) => b.saves - a.saves)[0];
  const goldenBoy = [...allActive].filter(p => p.age <= 18).sort((a, b) => b.ovr - a.ovr)[0] || rocketDor;

  const awardEntry = {
    season: GameState.season,
    rocketDor: `${rocketDor.name} (${getTeamById(rocketDor.teamId)?.tag || "FA"})`,
    goldenBoot: `${goldenBoot.name} (${goldenBoot.goals} goles)`,
    kdbAward: `${kdbAward.name} (${kdbAward.assists} asist.)`,
    goldenGlove: `${goldenGlove.name} (${goldenGlove.saves} ataj.)`,
    goldenBoy: `${goldenBoy.name} (${goldenBoy.age} años, OVR ${goldenBoy.ovr})`
  };
  GameState.awardsHistory.unshift(awardEntry);

  document.getElementById("gala-season-title").textContent = `Temporada ${GameState.season} — Premios Oficiales`;
  document.getElementById("gala-awards-content").innerHTML = `
    <div class="gala-row">🏅 <strong>Rocket d'Or (MVP Mundial):</strong> ${awardEntry.rocketDor}</div>
    <div class="gala-row">⚽ <strong>Bota de Oro (Goleador):</strong> ${awardEntry.goldenBoot}</div>
    <div class="gala-row">🎯 <strong>Premio KDB (Máximo Asistidor):</strong> ${awardEntry.kdbAward}</div>
    <div class="gala-row">🧤 <strong>Guante de Oro (Mejor Defensor):</strong> ${awardEntry.goldenGlove}</div>
    <div class="gala-row">🌟 <strong>Golden Boy Sub-18:</strong> ${awardEntry.goldenBoy}</div>
  `;
  document.getElementById("gala-modal").classList.remove("hidden");

  // Ascensos y Descensos por Región
  ["EU", "NA", "SAM", "MENA"].forEach(reg => {
    const proTeams = GameState.teams.filter(t => t.region === reg && t.division === "PRO").sort((a, b) => b.points - a.points);
    const chalTeams = GameState.teams.filter(t => t.region === reg && t.division === "CHALLENGER").sort((a, b) => b.points - a.points);
    if (proTeams.length > 0 && chalTeams.length > 0) {
      const relegated = proTeams[proTeams.length - 1];
      const promoted = chalTeams[0];
      if (promoted.points > 0) {
        relegated.division = "CHALLENGER";
        promoted.division = "PRO";
        addNews(`🔄 Ascenso/Descenso (${reg}): ⬆️ ${promoted.name} sube a RLCS Pro | ⬇️ ${relegated.name} baja a Challenger.`);
      }
    }
  });

  // Contratos, Retiros y Progresión
  const remainingPlayers = [];
  GameState.players.forEach(p => {
    p.age++;
    p.goals = 0; p.assists = 0; p.saves = 0; p.matches = 0; p.streak = 0;
    p.stamina = 100;

    if (p.teamId) {
      p.contractYears = (p.contractYears ?? 2) - 1;
      if (p.contractYears <= 0) {
        if (p.teamId === userTeam.id) {
          addNews(`⚠️ El contrato de ${p.name} expiró y quedó Agente Libre. ¡Podés reficharlo en Mercado!`);
        }
        p.teamId = null;
        p.starter = false;
      }
    }

    if (p.age >= 26 && Math.random() < 0.45) {
      GameState.hallOfFame.unshift({ name: p.name, country: p.country, ovr: p.ovr, titles: p.careerTitles || 0, season: GameState.season });
      addNews(`🎖️ Leyenda Retirada: ${p.name} se retira del competitivo tras una carrera histórica.`);
      return;
    }

    if (p.age <= 20 && p.ovr < p.pot) p.ovr = Math.min(p.pot, p.ovr + 1);
    else if (p.age >= 24) p.ovr = Math.max(72, p.ovr - 1);
    remainingPlayers.push(p);
  });
  GameState.players = remainingPlayers;

  GameState.teams.forEach(t => { t.points = 0; });
  GameState.season++;
  GameState.scheduleIndex = 0;
  GameState.metaPatch = InitialData.metaPatches[Math.floor(Math.random() * InitialData.metaPatches.length)];
  buildNationalTables();
  runAIManagement();
  initSwissForCurrentEvent();
  generateTournamentBracket();
  pickNextOpponent();
  addNews(`📅 ¡Arranca la Temporada ${GameState.season}! Nuevo Meta: ${GameState.metaPatch}.`);
  refreshAllUI();
  saveGame(false);
}

function closeGalaModal() {
  document.getElementById("gala-modal").classList.add("hidden");
  openScoutingCombine();
}

function openScoutingCombine() {
  const userTeam = getUserTeam();
  const regionCountry = { SAM: "AR", EU: "FR", NA: "US", MENA: "SA" }[userTeam.region] || "AR";
  const roles = ["Striker", "Playmaker", "Third Man"];
  const personalities = ["Promesa Ambiciosa", "Trabajador Silencioso", "Líder Nato"];
  CombinePool = [];

  for (let i = 0; i < 3; i++) {
    const ovr = 75 + Math.floor(Math.random() * 5);
    CombinePool.push({
      id: "comb_" + Date.now() + "_" + i,
      name: generateUniqueName(),
      country: i === 0 ? regionCountry : ["FR", "US", "BR", "SA", "AR", "CL"][Math.floor(Math.random() * 6)],
      age: 15,
      ovr,
      pot: ovr + 9 + Math.floor(Math.random() * 6),
      mec: ovr + 1, rot: ovr, def: ovr - 1,
      role: roles[i % 3],
      personality: personalities[i % 3],
      contractYears: 3,
      teamId: userTeam.id,
      starter: false,
      stamina: 100,
      value: 75000,
      goals: 0, assists: 0, saves: 0, matches: 0,
      careerGoals: 0, careerAssists: 0, careerSaves: 0, careerTitles: 0,
      clubHistory: [userTeam.name],
      streak: 0
    });
  }

  document.getElementById("combine-prospects-list").innerHTML = CombinePool.map((p, idx) => `
    <div class="academy-item">
      <div>
        <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> (15 años)
        <div class="muted">OVR: <strong>${p.ovr}</strong> • Pot: <strong>${p.pot}</strong> • ${p.role} (${p.personality})</div>
      </div>
      <button class="btn-success btn-sm" onclick="draftCombineProspect(${idx})">Draftear Gratis</button>
    </div>
  `).join("");
  document.getElementById("combine-modal").classList.remove("hidden");
}

function draftCombineProspect(idx) {
  const chosen = CombinePool[idx];
  if (!chosen) return;
  GameState.players.push(chosen);
  addNews(`🎯 Draft Scouting Combine: ¡${chosen.name} (15 años, OVR ${chosen.ovr}) se suma a tu roster!`, "prodigy");
  closeCombineModal();
  refreshAllUI();
}
function closeCombineModal() { document.getElementById("combine-modal").classList.add("hidden"); }

// 2. COMPETICIONES, CLUB HUB Y FICHA INDIVIDUAL DE JUGADOR
function selectCompView(viewId, btn) {
  GameState.selectedCompView = viewId;
  document.querySelectorAll(".comp-pill").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderCompetitionView();
}

function renderCompetitionView() {
  const container = document.getElementById("competition-view");
  const v = GameState.selectedCompView;
  const userTeam = getUserTeam();

  // Actualizar selector rápido de clubes
  const dirSelect = document.getElementById("club-directory-select");
  if (dirSelect && dirSelect.options.length <= 1) {
    GameState.teams.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `[${t.region}] ${t.name} (${t.division})`;
      dirSelect.appendChild(opt);
    });
  }

  if (v === "rlcs_regional") {
    const reg = GameState.selectedRegionTab || userTeam.region;
    const proTeams = GameState.teams.filter(t => t.region === reg && t.division === "PRO").sort((a, b) => b.points - a.points);
    const chalTeams = GameState.teams.filter(t => t.region === reg && t.division === "CHALLENGER").sort((a, b) => b.points - a.points);

    container.innerHTML = `
      <div class="card-header">
        <h3>RLCS 1ra División (Pro) y 2da División (Challenger) — ${reg}</h3>
        <div style="display:flex;gap:6px;">
          ${["SAM", "EU", "NA", "MENA"].map(r => `<button class="btn-sm ${r === reg ? "btn-primary" : "btn-secondary"}" onclick="GameState.selectedRegionTab='${r}';renderCompetitionView();">${r}</button>`).join("")}
        </div>
      </div>
      <h4 style="color:var(--primary);margin-top:8px;">🏆 RLCS Primera División (Pro) — Top clasifican al Major</h4>
      <table>
        <thead><tr><th>Pos</th><th>Club (Clic para inspeccionar)</th><th>OVR</th><th>Química</th><th>Puntos RLCS</th></tr></thead>
        <tbody>
          ${proTeams.map((t, i) => `
            <tr class="${t.id === userTeam.id ? "user-row" : ""}">
              <td>#${i + 1}</td>
              <td><span class="clickable-link" onclick="openClubDetailModal('${t.id}')">${Graphics.renderCrest(t, 24)} <strong>${t.name}</strong></span></td>
              <td>${getTeamOvr(t.id)}</td>
              <td>${getTeamChemistry(t.id)}%</td>
              <td><strong>${t.points} pts</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <h4 style="color:#a78bfa;margin-top:18px;">⚔️ RLCS Segunda División (Challenger) — El #1 asciende a Pro</h4>
      <table>
        <thead><tr><th>Pos</th><th>Club</th><th>OVR</th><th>Puntos Challenger</th></tr></thead>
        <tbody>
          ${chalTeams.map((t, i) => `
            <tr class="${t.id === userTeam.id ? "user-row" : ""}">
              <td>#${i + 1}</td>
              <td><span class="clickable-link" onclick="openClubDetailModal('${t.id}')">${Graphics.renderCrest(t, 24)} <strong>${t.name}</strong></span></td>
              <td>${getTeamOvr(t.id)}</td>
              <td><strong>${t.points} pts</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } else if (v === "swiss_stage") {
    container.innerHTML = `
      <h3>Fase Suiza Actual (Top 8 avanzan a Playoffs)</h3>
      <table>
        <thead><tr><th>Pos</th><th>Equipo</th><th>Victorias</th><th>Derrotas</th><th>Estado</th></tr></thead>
        <tbody>
          ${GameState.swissStandings.map((s, idx) => {
            const t = getTeamById(s.teamId);
            return `
              <tr class="${s.teamId === userTeam.id ? "user-row" : ""}">
                <td>#${idx + 1}</td>
                <td><span class="clickable-link" onclick="openClubDetailModal('${s.teamId}')">${t ? Graphics.renderCrest(t, 22) : ""} <strong>${s.teamName}</strong></span></td>
                <td><strong style="color:var(--success)">${s.w}</strong></td>
                <td><strong style="color:var(--danger)">${s.l}</strong></td>
                <td>${s.w >= 3 ? "✅ Clasificado" : (s.l >= 3 ? "❌ Eliminado" : "En Juego")}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  } else if (v === "current_bracket") {
    const b = GameState.currentBracket;
    const renderMatchBox = (m) => `
      <div class="bracket-match ${(m.home?.id === userTeam.id || m.away?.id === userTeam.id) ? "user-match" : ""}">
        <div class="b-row"><span>${m.home ? `<span class="clickable-link" onclick="openClubDetailModal('${m.home.id}')">${m.home.tag}</span>` : "TBD"}</span><strong>${m.scoreH}</strong></div>
        <div class="b-row"><span>${m.away ? `<span class="clickable-link" onclick="openClubDetailModal('${m.away.id}')">${m.away.tag}</span>` : "TBD"}</span><strong>${m.scoreA}</strong></div>
      </div>
    `;
    container.innerHTML = `
      <h3>Llaves Eliminatorias — ${b.compName || "Torneo Actual"}</h3>
      <div class="bracket-container">
        <div class="bracket-round"><h4>Cuartos de Final</h4>${b.qf.map(renderMatchBox).join("")}</div>
        <div class="bracket-round"><h4>Semifinales</h4>${b.sf.map(renderMatchBox).join("")}</div>
        <div class="bracket-round"><h4>Gran Final</h4>${b.gf.map(renderMatchBox).join("")}</div>
      </div>
    `;
  } else if (v === "majors_worlds") {
    const sorted = [...GameState.teams].sort((a, b) => b.points - a.points);
    container.innerHTML = `
      <h3>Clasificación Global Rumbo a Majors y Mundial RLCS</h3>
      <table>
        <thead><tr><th>Rank</th><th>Club</th><th>Región / Div</th><th>OVR</th><th>Puntos</th></tr></thead>
        <tbody>
          ${sorted.map((t, i) => `
            <tr class="${t.id === userTeam.id ? "user-row" : ""}">
              <td>#${i + 1}</td>
              <td><span class="clickable-link" onclick="openClubDetailModal('${t.id}')">${Graphics.renderCrest(t, 24)} ${t.name}</span></td>
              <td>${t.region} (${t.division})</td>
              <td>${getTeamOvr(t.id)}</td>
              <td><strong>${t.points}</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } else if (v === "player_stats") {
    const topPlayers = [...GameState.players]
      .filter(p => p.teamId)
      .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
      .slice(0, 18);
    container.innerHTML = `
      <h3>Tabla de Líderes Individuales (Temporada ${GameState.season})</h3>
      <table>
        <thead><tr><th>Jugador</th><th>Club</th><th>OVR</th><th>PJ</th><th>Goles</th><th>Asist.</th><th>Ataj.</th></tr></thead>
        <tbody>
          ${topPlayers.map(p => {
            const club = getTeamById(p.teamId);
            return `
              <tr class="${p.teamId === userTeam.id ? "user-row" : ""}">
                <td><strong class="clickable-link" onclick="openPlayerDetailModal('${p.id}')">${Graphics.getFlag(p.country)} ${p.name}</strong></td>
                <td><span class="clickable-link" onclick="openClubDetailModal('${p.teamId}')">${club ? club.tag : "FA"}</span></td>
                <td>${p.ovr}</td>
                <td>${p.matches || 0}</td>
                <td><strong>${p.goals}</strong></td>
                <td>${p.assists}</td>
                <td>${p.saves}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  } else if (v === "national_leagues") {
    container.innerHTML = `
      <h3>Ligas Nacionales (Argentina, Chile, Brasil, Francia, NA, MENA)</h3>
      ${InitialData.nationalLeagues.map(lg => {
        const rows = [...(GameState.nationalTables[lg.id] || [])].sort((a, b) => b.pts - a.pts || b.dg - a.dg);
        return `
          <h4 style="margin-top:16px;color:var(--primary);">${Graphics.getFlag(lg.country)} ${lg.name}</h4>
          <table>
            <thead><tr><th>Club</th><th>PJ</th><th>PG</th><th>PP</th><th>DG</th><th>Pts</th></tr></thead>
            <tbody>
              ${rows.map(r => `<tr><td>${r.club}</td><td>${r.pj}</td><td>${r.pg}</td><td>${r.pp}</td><td>${r.dg}</td><td><strong>${r.pts}</strong></td></tr>`).join("")}
            </tbody>
          </table>
        `;
      }).join("")}
    `;
  } else if (v === "fifae_wc") {
    const countries = ["FR", "SA", "US", "BR", "GB", "AR", "CL", "ES"];
    container.innerHTML = `
      <h3>FIFAe World Cup — Potencias Nacionales</h3>
      <table>
        <thead><tr><th>Selección</th><th>Trío Estelar del País</th><th>Media Nacional</th></tr></thead>
        <tbody>
          ${countries.map(c => {
            const best3 = GameState.players.filter(p => p.country === c).sort((a, b) => b.ovr - a.ovr).slice(0, 3);
            const avg = best3.length ? Math.round(best3.reduce((s, x) => s + x.ovr, 0) / best3.length) : 80;
            return `<tr><td><strong>${Graphics.getFlag(c)} ${Graphics.countryNames[c] || c}</strong></td><td>${best3.map(x => `<span class="clickable-link" onclick="openPlayerDetailModal('${x.id}')">${x.name}</span>`).join(", ") || "En formación"}</td><td><strong>${avg}</strong></td></tr>`;
          }).join("")}
        </tbody>
      </table>
    `;
  }
}

// MODAL CLUB HUB (FICHA COMPLETA DEL CLUB AL HACER CLIC EN TABLAS)
function openClubDetailModal(teamId) {
  const team = getTeamById(teamId);
  if (!team) return;
  const roster = getTeamRoster(team.id, false).sort((a, b) => (b.starter ? 1 : 0) - (a.starter ? 1 : 0) || b.ovr - a.ovr);
  const coach = getTeamCoach(team.id);
  const academy = GameState.academyProspects.filter(a => a.ownerTeamId === team.id);
  const h2h = GameState.headToHead[team.id] || { w: 0, l: 0 };
  const clubTitles = GameState.championsHistory.filter(c => c.teamId === team.id);

  document.getElementById("club-detail-content").innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;flex-wrap:wrap;">
      ${Graphics.renderCrest(team, 76)}
      <div>
        <h2 style="margin-bottom:4px;">${team.name} (${team.tag})</h2>
        <div class="muted">${team.region} • División <strong>${team.division}</strong> • Arena: ${team.arena || "Champions Field"} • Auto: ${team.car || "Fennec"}</div>
        <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
          <span class="badge">OVR: <strong>${getTeamOvr(team.id)}</strong></span>
          <span class="badge">Química: <strong>${getTeamChemistry(team.id)}%</strong></span>
          <span class="badge">Presupuesto: <strong class="money">$${team.budget.toLocaleString()}</strong></span>
          <span class="badge">Prestigio: <strong>${team.rep}</strong></span>
          ${team.id !== GameState.userTeamId ? `<span class="badge">Historial vs Vos: <strong>${h2h.w}V - ${h2h.l}D</strong></span>` : ""}
        </div>
      </div>
    </div>

    <div class="neg-box">
      <strong>👔 Cuerpo Técnico:</strong> ${coach ? `${Graphics.getFlag(coach.country)} ${coach.name} (OVR ${coach.ovr} • ${coach.specialty})` : "Sin Head Coach contratado"}
    </div>

    <h4 style="margin:12px 0 6px;color:var(--primary);">🎮 Plantilla Completa y Estadísticas de Temporada</h4>
    <table>
      <thead>
        <tr><th>Jugador</th><th>Rol</th><th>OVR/Pot</th><th>Contrato</th><th>PJ</th><th>G</th><th>A</th><th>Ataj</th><th>Acción</th></tr>
      </thead>
      <tbody>
        ${roster.map(p => `
          <tr>
            <td>
              <strong class="clickable-link" onclick="openPlayerDetailModal('${p.id}')">${Graphics.getFlag(p.country)} ${p.name}</strong>
              <div class="muted" style="font-size:0.72rem;">${p.starter ? "🟢 Titular" : "⚪ Suplente"} • ${p.age} años</div>
            </td>
            <td><span class="badge">${p.role || "Striker"}</span></td>
            <td><strong>${p.ovr}</strong> / ${p.pot}</td>
            <td>${p.contractYears ?? 2} temp.</td>
            <td>${p.matches || 0}</td>
            <td><strong>${p.goals || 0}</strong></td>
            <td>${p.assists || 0}</td>
            <td>${p.saves || 0}</td>
            <td>
              ${team.id !== GameState.userTeamId
                ? `<button class="btn-primary btn-sm" onclick="closeClubDetailModal();openNegotiationModal('${p.id}')">Fichar</button>`
                : `<span class="muted">Tu Jugador</span>`}
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <h4 style="margin:14px 0 6px;color:var(--accent);">🌱 Cantera Juvenil del Club (${academy.length})</h4>
    ${academy.length === 0
      ? `<p class="muted">Este club no tiene juveniles registrados en su academia actualmente.</p>`
      : academy.map(a => `
          <div class="academy-item" style="margin-bottom:6px;">
            <div>
              ${Graphics.renderRankBadge(a.rank)} <strong>${Graphics.getFlag(a.country)} ${a.name}</strong> (${a.age} años • ${a.archetype})
              <div class="muted">OVR: ${a.ovr} • Potencial: <strong>${a.pot}</strong></div>
            </div>
            ${team.id !== GameState.userTeamId
              ? `<button class="btn-warning btn-sm" onclick="buyRivalProspect('${a.id}');openClubDetailModal('${team.id}');">Comprar ($45k)</button>`
              : `<span class="badge">Tu Cantera</span>`}
          </div>
        `).join("")
    }

    <h4 style="margin:14px 0 6px;">🏆 Palmarés Reciente en la Carrera (${clubTitles.length} títulos)</h4>
    <div class="muted">${clubTitles.length ? clubTitles.map(c => `🏆 ${c.compName} (${c.season})`).join(" • ") : "Aún no levantó títulos en esta partida."}</div>
  `;

  document.getElementById("club-detail-modal").classList.remove("hidden");
}
function closeClubDetailModal() { document.getElementById("club-detail-modal").classList.add("hidden"); }

// MODAL FICHA INDIVIDUAL DE JUGADOR
function openPlayerDetailModal(playerId) {
  const p = GameState.players.find(pl => pl.id === playerId);
  if (!p) return;
  const club = getTeamById(p.teamId);

  document.getElementById("player-detail-content").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div>
        <h2>${Graphics.getFlag(p.country)} ${p.name}</h2>
        <div class="muted">${p.age} años • ${club ? club.name : "Agente Libre"} • Rol: <strong>${p.role || "Striker"}</strong></div>
      </div>
      <span class="ovr-pill" style="font-size:1.2rem;padding:6px 12px;">OVR ${p.ovr}</span>
    </div>

    <div class="stats-mini">
      <span>Mecánica: <strong>${p.mec}</strong></span>
      <span>Rotación: <strong>${p.rot}</strong></span>
      <span>Defensa: <strong>${p.def}</strong></span>
      <span>Potencial: <strong>${p.pot}</strong></span>
    </div>

    <div class="neg-box">
      <div><strong>Personalidad:</strong> ${p.personality || "Equilibrado"}</div>
      <div><strong>Valor de Mercado:</strong> <span class="money">$${p.value.toLocaleString()}</span> • Contrato: ${p.contractYears ?? 0} temp.</div>
    </div>

    <h4 style="margin:10px 0 6px;color:var(--primary);">📊 Estadísticas Temporada Actual (${GameState.season})</h4>
    <div class="stats-mini">
      <span>Partidos: <strong>${p.matches || 0}</strong></span>
      <span>Goles: <strong>${p.goals || 0}</strong></span>
      <span>Asistencias: <strong>${p.assists || 0}</strong></span>
      <span>Atajadas: <strong>${p.saves || 0}</strong></span>
    </div>

    <h4 style="margin:10px 0 6px;color:var(--accent);">🏛️ Historial Total de Carrera</h4>
    <div class="stats-mini">
      <span>Goles Totales: <strong>${p.careerGoals || p.goals || 0}</strong></span>
      <span>Asistencias: <strong>${p.careerAssists || p.assists || 0}</strong></span>
      <span>Atajadas: <strong>${p.careerSaves || p.saves || 0}</strong></span>
      <span>Títulos: <strong>🏆 ${p.careerTitles || 0}</strong></span>
    </div>

    <div class="muted" style="margin-top:8px;"><strong>Trayectoria de Clubes:</strong> ${(p.clubHistory || [club ? club.name : "Agente Libre"]).join(" ➔ ")}</div>
  `;

  document.getElementById("player-detail-modal").classList.remove("hidden");
}
function closePlayerDetailModal() { document.getElementById("player-detail-modal").classList.add("hidden"); }

// 3. ROSTER, PIZARRA TÁCTICA, COACH E IDENTIDAD
function renderSquadAndCoach() {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  const coach = getTeamCoach(userTeam.id);

  document.getElementById("team-chemistry-badge").textContent = `Química: ${getTeamChemistry(userTeam.id)}% • OVR: ${getTeamOvr(userTeam.id)}`;

  document.getElementById("squad-list").innerHTML = roster.map(p => {
    const stam = p.stamina ?? 100;
    const stamColor = stam >= 75 ? "#10b981" : (stam >= 50 ? "#f59e0b" : "#ef4444");
    return `
      <div class="player-card ${p.starter ? "starter" : ""}">
        <div class="player-top">
          <strong class="clickable-link" onclick="openPlayerDetailModal('${p.id}')">${Graphics.getFlag(p.country)} ${p.name} ${p.streak >= 3 ? '<span class="fire-tag">🔥 ON FIRE</span>' : ""}</strong>
          <span class="ovr-pill">${p.ovr}</span>
        </div>
        <div class="muted">${p.age} años • ${p.role || "Striker"} • Contrato: ${p.contractYears ?? 2}t</div>
        <div style="display:flex;justify-content:space-between;font-size:0.72rem;margin-top:4px;">
          <span>Energía / Mental</span><span><strong>${stam}%</strong></span>
        </div>
        <div class="stamina-bar-bg"><div class="stamina-bar-fill" style="width:${stam}%;background:${stamColor};"></div></div>
        <div class="stats-mini">
          <span>MEC ${p.mec}</span><span>ROT ${p.rot}</span><span>DEF ${p.def}</span><span>POT ${p.pot}</span>
        </div>
        <div class="muted" style="margin-bottom:8px;">PJ: ${p.matches || 0} | G: ${p.goals} | A: ${p.assists} | Ataj: ${p.saves}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="btn-sm ${p.starter ? "btn-success" : "btn-secondary"}" style="flex:1;" onclick="toggleStarter('${p.id}')">
            ${p.starter ? "Titular" : "Suplente"}
          </button>
          <button class="btn-sm btn-outline" onclick="renewPlayerContract('${p.id}')" title="Renovar contrato">+1t</button>
          <button class="btn-sm btn-danger-outline" onclick="releasePlayer('${p.id}')">Liberar</button>
        </div>
      </div>
    `;
  }).join("");

  const tb = GameState.tacticalBoard;
  document.getElementById("tactical-board-box").innerHTML = `
    <div style="background:var(--bg-dark);padding:12px;border-radius:10px;border:1px solid var(--border);">
      <strong>📋 Pizarra Táctica Base del Equipo</strong>
      <div class="form-row" style="margin-top:8px;">
        <div class="field">
          <label>Estilo en Cancha 2D</label>
          <select onchange="GameState.tacticalBoard.style=this.value;saveGame(false);">
            <option value="balanced" ${tb.style === "balanced" ? "selected" : ""}>Equilibrado</option>
            <option value="aggressive" ${tb.style === "aggressive" ? "selected" : ""}>Presión Alta & Demos</option>
            <option value="possession" ${tb.style === "possession" ? "selected" : ""}>Control & Pases</option>
            <option value="defensive" ${tb.style === "defensive" ? "selected" : ""}>Cerrojo Defensivo</option>
          </select>
        </div>
        <div class="field">
          <label>Gestión de Boost</label>
          <select onchange="GameState.tacticalBoard.boostPriority=this.value;saveGame(false);">
            <option value="balanced" ${tb.boostPriority === "balanced" ? "selected" : ""}>Distribución Pareja</option>
            <option value="starve" ${tb.boostPriority === "starve" ? "selected" : ""}>Boost Starve al Rival</option>
          </select>
        </div>
      </div>
    </div>
  `;

  document.getElementById("active-coach-box").innerHTML = coach
    ? `<div style="background:var(--bg-dark);padding:12px;border-radius:10px;border:1px solid var(--border);">
        <strong>${Graphics.getFlag(coach.country)} Coach: ${coach.name}</strong> <span class="badge">OVR ${coach.ovr}</span>
        <p class="muted" style="margin-top:4px;">${coach.specialty}</p>
      </div>`
    : `<p class="muted">No tenés Head Coach contratado. Podés fichar uno en la pestaña Mercado.</p>`;

  document.getElementById("club-identity-box").innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;">
      ${Graphics.renderCrest(userTeam, 62)}
      <div>
        <strong>${userTeam.name} (${userTeam.tag})</strong>
        <div class="muted">División: <strong>${userTeam.division}</strong> • Auto: ${userTeam.car}</div>
        <div class="muted">Estrellas Mundiales: ${"⭐".repeat(userTeam.stars || 0) || "Ninguna aún"}</div>
      </div>
    </div>
  `;
}

function renewPlayerContract(playerId) {
  const userTeam = getUserTeam();
  const p = GameState.players.find(pl => pl.id === playerId);
  if (!p) return;
  const cost = Math.round(p.value * 0.12);
  if (userTeam.budget < cost) return alert(`Necesitás $${cost.toLocaleString()} de prima de renovación.`);
  userTeam.budget -= cost;
  p.contractYears = (p.contractYears ?? 1) + 1;
  addNews(`✍️ Renovaste el contrato de ${p.name} por 1 temporada más (-$${cost.toLocaleString()}).`);
  refreshAllUI();
}

function toggleStarter(playerId) {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  const target = roster.find(p => p.id === playerId);
  if (!target) return;
  if (!target.starter && roster.filter(p => p.starter).length >= 3) {
    return alert("Ya tenés 3 titulares activos. Pasá primero a uno a suplente.");
  }
  target.starter = !target.starter;
  refreshAllUI();
}

function releasePlayer(playerId) {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  if (roster.length <= 3) return alert("No podés quedarte con menos de 3 jugadores.");
  const target = roster.find(p => p.id === playerId);
  target.teamId = null;
  target.starter = false;
  addNews(`Liberaste a ${target.name} como agente libre.`);
  refreshAllUI();
}

// 4. CANTERAS, OJEADORES Y CESIONES
function advanceYouthAcademies() {
  const userCoach = getTeamCoach(getUserTeam().id);
  const hasAcademyCoach = userCoach && userCoach.specialty.includes("Formador");
  const acadFacilityBonus = ((GameState.facilities?.academy || 1) - 1) * 0.6;
  const mgrBonus = GameState.manager.specialty === "ACADEMY" ? 0.8 : 0;

  GameState.academyProspects.forEach(p => {
    const isMine = p.ownerTeamId === GameState.userTeamId;
    const growth = p.loanLeagueId
      ? (1.7 + Math.random() * 1.1)
      : (0.75 + Math.random() * 0.9 + (isMine && hasAcademyCoach ? 0.5 : 0) + (isMine ? acadFacilityBonus + mgrBonus : 0));

    p.ovr = Math.min(p.pot, Math.round((p.ovr + growth) * 10) / 10);

    if (p.loanLeagueId) {
      p.loanGoals += Math.floor(Math.random() * 4) + 1;
      p.loanAssists += Math.floor(Math.random() * 3) + 1;
    }

    if (p.ovr >= 78 && p.rank !== "SSL") p.rank = "SSL";
    else if (p.ovr >= 75 && p.rank !== "SSL") p.rank = "GC3";
    else if (p.ovr >= 72 && (p.rank === "C3" || p.rank === "GC1")) p.rank = "GC2";
  });

  if (Math.random() < 0.45) spawnRandomWorldProspect();
}

function generateUniqueName() {
  if (GameState.customNameQueue.length > 0) return GameState.customNameQueue.shift();
  const base = InitialData.newgenPrefixes[Math.floor(Math.random() * InitialData.newgenPrefixes.length)];
  const suffix = Math.random() > 0.45 ? Math.floor(Math.random() * 99) : "";
  return base + suffix;
}

function spawnRandomWorldProspect() {
  const userTeam = getUserTeam();
  const t = InitialData.youthTemplates[Math.floor(Math.random() * InitialData.youthTemplates.length)];
  const arch = InitialData.youthArchetypes[Math.floor(Math.random() * InitialData.youthArchetypes.length)];
  const countries = ["AR", "CL", "BR", "FR", "US", "SA", "ES", "GB"];
  const country = countries[Math.floor(Math.random() * countries.length)];
  const pot = Math.floor(Math.random() * (t.potMax - t.potMin + 1)) + t.potMin;

  // Mayor chance en mi cantera si contraté ojeadores
  const myScoutBoost = (GameState.hiredScouts?.length || 0) * 0.1;
  const toUser = Math.random() < (0.35 + myScoutBoost);
  const randomClub = GameState.teams[Math.floor(Math.random() * GameState.teams.length)];
  const ownerId = toUser ? userTeam.id : randomClub.id;
  const name = generateUniqueName();

  GameState.academyProspects.push({
    id: "acad_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    name, country, age: t.age, rank: t.rank, archetype: arch,
    ovr: t.ovr, pot, ownerTeamId: ownerId, isUserAcademy: toUser,
    loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0
  });

  if (toUser && t.rank === "SSL") {
    addNews(`🌟 ¡PRODIGIO GENERACIONAL! ${name} (14 años, SSL) apareció en tu cantera.`, "prodigy");
  }
}

function hireScout(scoutId) {
  const userTeam = getUserTeam();
  const sc = InitialData.scouts.find(s => s.id === scoutId);
  if (!sc || GameState.hiredScouts.includes(scoutId)) return;
  if (userTeam.budget < sc.cost) return alert("Presupuesto insuficiente.");
  userTeam.budget -= sc.cost;
  GameState.hiredScouts.push(scoutId);
  addNews(`🔭 Contrataste a ${sc.name} para tu red global de scouting.`);
  refreshAllUI();
}

function addCustomProspectNames() {
  const raw = document.getElementById("prospect-names-input").value.trim();
  if (!raw) return;

  const dest = document.getElementById("custom-prospect-destination").value;
  const countryChoice = document.getElementById("custom-prospect-country").value;
  const rankChoice = document.getElementById("custom-prospect-rank").value;
  const archChoice = document.getElementById("custom-prospect-archetype").value;
  const userTeam = getUserTeam();

  const names = raw.split(",").map(n => n.trim()).filter(Boolean);
  names.forEach((name, i) => {
    const t = rankChoice === "AUTO"
      ? InitialData.youthTemplates[Math.floor(Math.random() * InitialData.youthTemplates.length)]
      : (InitialData.youthTemplates.find(x => x.code === rankChoice) || InitialData.youthTemplates[0]);

    const arch = archChoice === "AUTO"
      ? InitialData.youthArchetypes[Math.floor(Math.random() * InitialData.youthArchetypes.length)]
      : archChoice;

    const country = countryChoice === "RANDOM"
      ? ["AR", "CL", "BR", "FR", "US", "SA", "ES"][Math.floor(Math.random() * 7)]
      : countryChoice;

    const pot = Math.floor(Math.random() * (t.potMax - t.potMin + 1)) + t.potMin;
    const toMine = dest === "MY_ACADEMY";
    const otherTeams = GameState.teams.filter(tm => tm.id !== userTeam.id);
    const targetClub = toMine ? userTeam : otherTeams[Math.floor(Math.random() * otherTeams.length)];

    GameState.academyProspects.push({
      id: "acad_custom_" + Date.now() + "_" + i,
      name, country, age: t.age, rank: t.rank, archetype: arch,
      ovr: t.ovr, pot, ownerTeamId: targetClub.id, isUserAcademy: toMine,
      loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0
    });

    addNews(`🌱 Nuevo prodigio registrado: ${name} (${t.age} años, ${t.rank}) en la cantera de ${targetClub.name}.`, "prodigy");
  });

  document.getElementById("prospect-names-input").value = "";
  refreshAllUI();
}

function renderAcademy() {
  const userTeam = getUserTeam();
  const filter = document.getElementById("academy-filter").value;

  const scoutBox = document.getElementById("scouting-network-box");
  if (scoutBox) {
    scoutBox.innerHTML = `
      <strong>🔭 Red de Ojeadores Activos (${GameState.hiredScouts.length}/${InitialData.scouts.length})</strong>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
        ${InitialData.scouts.map(sc => {
          const hired = GameState.hiredScouts.includes(sc.id);
          return `
            <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-dark);padding:8px 10px;border-radius:8px;border:1px solid var(--border);font-size:0.8rem;">
              <div><strong>${sc.name}</strong> (Nvl ${sc.level})<div class="muted">${sc.desc}</div></div>
              ${hired ? `<span class="badge" style="color:var(--success);">Activo</span>` : `<button class="btn-outline btn-sm" onclick="hireScout('${sc.id}')">$${sc.cost.toLocaleString()}</button>`}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  const list = GameState.academyProspects.filter(p =>
    filter === "MINE" ? p.ownerTeamId === userTeam.id : p.ownerTeamId !== userTeam.id
  );

  document.getElementById("academy-players-list").innerHTML = list.length === 0
    ? `<p class="muted">No hay juveniles en esta sección todavía.</p>`
    : list.map(p => {
        const owner = getTeamById(p.ownerTeamId);
        const ovrInt = Math.floor(p.ovr);
        const sellValue = Math.round((ovrInt - 60) * 8500 + (p.pot - 85) * 14000);
        const isMine = p.ownerTeamId === userTeam.id;

        return `
          <div class="academy-item">
            <div>
              ${Graphics.renderRankBadge(p.rank)} <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> (${p.age} años)
              <div class="muted">Club: ${owner ? owner.name : "Libre"} • ${p.archetype}</div>
              <div class="muted">OVR: <strong>${ovrInt}</strong> • Potencial: <strong>${p.pot}</strong></div>
              ${p.loanLeagueId ? `<div class="money" style="font-size:0.76rem;">Cedido en ${p.loanClub} (${p.loanGoals}G, ${p.loanAssists}A)</div>` : ""}
            </div>
            <div style="display:flex;flex-direction:column;gap:5px;">
              ${isMine ? `
                <button class="btn-success btn-sm" onclick="promoteProspect('${p.id}')">Subir al Roster</button>
                ${!p.loanLeagueId ? `<button class="btn-outline btn-sm" onclick="loanProspectToLeague('${p.id}')">Ceder a Liga</button>` : `<button class="btn-secondary btn-sm" onclick="recallProspectLoan('${p.id}')">Repescar</button>`}
                <button class="btn-warning btn-sm" onclick="sellYouthProspect('${p.id}', ${sellValue})">Vender ($${(sellValue/1000).toFixed(0)}k)</button>
              ` : `
                <button class="btn-primary btn-sm" onclick="buyRivalProspect('${p.id}')">Fichar ($45k)</button>
              `}
            </div>
          </div>
        `;
      }).join("");
}

function loanProspectToLeague(id) {
  const p = GameState.academyProspects.find(x => x.id === id);
  if (!p) return;
  const league = InitialData.nationalLeagues.find(l => l.country === p.country) || InitialData.nationalLeagues[0];
  p.loanLeagueId = league.id;
  p.loanClub = league.clubs[Math.floor(Math.random() * league.clubs.length)];
  addNews(`🤝 ${p.name} fue cedido a ${p.loanClub} (${league.name}) para ganar experiencia.`, "loan");
  refreshAllUI();
}

function recallProspectLoan(id) {
  const p = GameState.academyProspects.find(x => x.id === id);
  if (!p) return;
  addNews(`🔙 Repescaste a ${p.name} desde ${p.loanClub} con OVR ${Math.floor(p.ovr)}.`);
  p.loanLeagueId = null; p.loanClub = null;
  refreshAllUI();
}

function promoteProspect(id) {
  const idx = GameState.academyProspects.findIndex(x => x.id === id);
  if (idx === -1) return;
  const p = GameState.academyProspects[idx];
  const ovr = Math.max(75, Math.floor(p.ovr));
  const userTeam = getUserTeam();

  GameState.players.push({
    id: "pro_" + Date.now(),
    name: p.name, country: p.country, age: Math.max(15, p.age),
    ovr, pot: p.pot, mec: ovr + 1, rot: ovr, def: ovr - 1,
    role: p.archetype === "Freestyler" ? "Striker" : (p.archetype === "Cerebro Táctico" ? "Third Man" : "Playmaker"),
    personality: "Promesa Ambiciosa",
    contractYears: 3,
    teamId: userTeam.id, starter: false, stamina: 100,
    value: Math.round((ovr - 65) * 24000),
    goals: 0, assists: 0, saves: 0, matches: 0,
    careerGoals: 0, careerAssists: 0, careerSaves: 0, careerTitles: 0,
    clubHistory: [userTeam.name],
    streak: 0
  });

  GameState.academyProspects.splice(idx, 1);
  addNews(`🎓 ¡${p.name} fue promovido al primer equipo de ${userTeam.name} (OVR ${ovr})!`, "prodigy");
  refreshAllUI();
}

function sellYouthProspect(id, price) {
  const idx = GameState.academyProspects.findIndex(x => x.id === id);
  if (idx === -1) return;
  const p = GameState.academyProspects[idx];
  const buyers = GameState.teams.filter(t => t.id !== GameState.userTeamId);
  const buyer = buyers[Math.floor(Math.random() * buyers.length)];

  getUserTeam().budget += price;
  GameState.careerStats.youthSales++;
  GameState.academyProspects.splice(idx, 1);
  addNews(`💰 Vendiste a la joya ${p.name} a la cantera de ${buyer.name} por $${price.toLocaleString()}.`);
  refreshAllUI();
}

function buyRivalProspect(id) {
  const userTeam = getUserTeam();
  const cost = GameState.manager.specialty === "NEGOTIATOR" ? 38000 : 45000;
  if (userTeam.budget < cost) return alert(`Necesitás $${cost.toLocaleString()} para comprar el pase juvenil.`);
  const p = GameState.academyProspects.find(x => x.id === id);
  if (!p) return;
  userTeam.budget -= cost;
  p.ownerTeamId = userTeam.id;
  p.isUserAcademy = true;
  addNews(`✍️ Fichaste al juvenil ${p.name} para tu academia por $${cost.toLocaleString()}.`);
  refreshAllUI();
}

// 5. MERCADO CON INTERCAMBIOS, CONTRATOS Y SPONSORS
function renderMarket() {
  const userTeam = getUserTeam();
  const filter = document.getElementById("market-type-filter").value;
  const listEl = document.getElementById("market-list");

  if (filter === "PLAYERS") {
    const available = GameState.players.filter(p => p.teamId !== userTeam.id).sort((a, b) => b.ovr - a.ovr);
    listEl.innerHTML = available.map(p => {
      const club = getTeamById(p.teamId);
      return `
        <div class="market-item">
          <div>
            <strong class="clickable-link" onclick="openPlayerDetailModal('${p.id}')">${Graphics.getFlag(p.country)} ${p.name}</strong> <span class="badge">OVR ${p.ovr} / Pot ${p.pot}</span>
            <div class="muted">${club ? `<span class="clickable-link" onclick="openClubDetailModal('${club.id}')">${club.name}</span>` : "Agente Libre"} • ${p.role || "Striker"} • ${p.age} años</div>
            <div class="money">Valor: $${p.value.toLocaleString()}</div>
          </div>
          <button class="btn-primary btn-sm" onclick="openNegotiationModal('${p.id}')">Negociar</button>
        </div>
      `;
    }).join("");
  } else {
    const coaches = GameState.coaches.filter(c => c.teamId !== userTeam.id);
    listEl.innerHTML = coaches.map(c => `
      <div class="market-item">
        <div>
          <strong>${Graphics.getFlag(c.country)} ${c.name}</strong> <span class="badge">OVR ${c.ovr}</span>
          <div class="muted">${c.specialty}</div>
          <div class="money">Costo: $${c.salary.toLocaleString()}</div>
        </div>
        <button class="btn-success btn-sm" onclick="hireCoach('${c.id}')">Contratar</button>
      </div>
    `).join("");
  }

  document.getElementById("sponsor-box").innerHTML = InitialData.sponsors.map(sp => {
    const active = GameState.activeSponsor === sp.id;
    return `
      <div class="market-item" style="margin-bottom:10px;">
        <div>
          <strong>${sp.name}</strong>
          <div class="muted">${sp.bonusDesc}</div>
          <div class="money">Adelanto: +$${sp.upfront.toLocaleString()}</div>
        </div>
        <button class="btn-sm ${active ? "btn-success" : "btn-outline"}" ${active ? "disabled" : ""} onclick="signSponsor('${sp.id}')">
          ${active ? "Activo" : "Firmar"}
        </button>
      </div>
    `;
  }).join("");
}

function openNegotiationModal(playerId) {
  const p = GameState.players.find(x => x.id === playerId);
  if (!p) return;
  ActiveNegotiationPlayerId = playerId;
  const club = getTeamById(p.teamId);
  const disc = GameState.manager.specialty === "NEGOTIATOR" ? 0.85 : 1;
  const suggested = Math.round((club ? p.value * 1.12 : p.value * 0.5) * disc);

  document.getElementById("neg-title").textContent = `Fichar a ${p.name} (OVR ${p.ovr})`;
  document.getElementById("neg-subtitle").textContent = club ? `Club actual: ${club.name}` : "Agente Libre";
  document.getElementById("neg-details").innerHTML = `
    <div>Edad: <strong>${p.age}</strong> • Potencial: <strong>${p.pot}</strong> • Personalidad: <strong>${p.personality || "Equilibrado"}</strong></div>
    <div>Valor estimado: <strong class="money">$${p.value.toLocaleString()}</strong></div>
  `;

  const myRoster = getTeamRoster(getUserTeam().id, false);
  const tradeSelect = document.getElementById("neg-trade-player");
  tradeSelect.innerHTML = `<option value="">Ninguno (Solo dinero)</option>` +
    myRoster.map(mp => `<option value="${mp.id}">${mp.name} (OVR ${mp.ovr} - Valúa $${mp.value.toLocaleString()})</option>`).join("");

  document.getElementById("neg-offer-amount").value = suggested;
  document.getElementById("neg-feedback").classList.add("hidden");
  document.getElementById("negotiation-modal").classList.remove("hidden");
}

function closeNegotiationModal() {
  document.getElementById("negotiation-modal").classList.add("hidden");
  ActiveNegotiationPlayerId = null;
}

function submitTransferOffer() {
  const userTeam = getUserTeam();
  const p = GameState.players.find(x => x.id === ActiveNegotiationPlayerId);
  if (!p) return;

  const cashOffer = parseInt(document.getElementById("neg-offer-amount").value) || 0;
  const tradeId = document.getElementById("neg-trade-player").value;
  const years = parseInt(document.getElementById("neg-contract-years").value) || 2;
  const rolePromise = document.getElementById("neg-role-promise").value;
  const tradePlayer = tradeId ? GameState.players.find(x => x.id === tradeId) : null;

  if (cashOffer > userTeam.budget) return alert("No tenés suficiente presupuesto en efectivo.");
  if (tradePlayer && getTeamRoster(userTeam.id, false).length <= 3) {
    return alert("Necesitás al menos 3 jugadores en tu plantilla para intercambiar uno.");
  }

  const club = getTeamById(p.teamId);
  const disc = GameState.manager.specialty === "NEGOTIATOR" ? 0.85 : 1;
  const minRequired = Math.round((club ? p.value * 1.05 : p.value * 0.45) * disc);
  const totalPackage = cashOffer + (tradePlayer ? Math.round(tradePlayer.value * 0.9) : 0);

  if (p.personality === "Superestrella" && rolePromise === "SUB") {
    const fb = document.getElementById("neg-feedback");
    fb.textContent = `❌ ${p.name} es una Superestrella y exige rol de Titular Indiscutido.`;
    fb.classList.remove("hidden");
    return;
  }

  if (totalPackage >= minRequired) {
    userTeam.budget -= cashOffer;
    if (club) {
      club.budget += cashOffer;
      if (tradePlayer) {
        tradePlayer.teamId = club.id;
        tradePlayer.starter = true;
        if (!tradePlayer.clubHistory) tradePlayer.clubHistory = [];
        tradePlayer.clubHistory.push(club.name);
      }
    }
    p.teamId = userTeam.id;
    p.starter = getTeamRoster(userTeam.id, true).length < 3;
    p.contractYears = years;
    if (!p.clubHistory) p.clubHistory = [];
    p.clubHistory.push(userTeam.name);

    addNews(tradePlayer
      ? `🔄 ¡INTERCAMBIO! Fichaste a ${p.name} (${years}t) entregando a ${tradePlayer.name} + $${cashOffer.toLocaleString()}.`
      : `✍️ ¡FICHAJE BOMBA! ${p.name} llega a ${userTeam.name} por $${cashOffer.toLocaleString()} (${years} temp.).`
    );
    closeNegotiationModal();
    refreshAllUI();
  } else {
    const fb = document.getElementById("neg-feedback");
    fb.textContent = `❌ Oferta insuficiente. El paquete total ($${totalPackage.toLocaleString()}) está por debajo de lo pedido ($${minRequired.toLocaleString()}).`;
    fb.classList.remove("hidden");
  }
}

function hireCoach(coachId) {
  const userTeam = getUserTeam();
  const coach = GameState.coaches.find(c => c.id === coachId);
  if (!coach) return;
  if (userTeam.budget < coach.salary) return alert("Presupuesto insuficiente.");
  userTeam.budget -= coach.salary;
  GameState.coaches.forEach(c => { if (c.teamId === userTeam.id) c.teamId = null; });
  coach.teamId = userTeam.id;
  addNews(`👔 Contrataste a ${coach.name} como Head Coach.`);
  refreshAllUI();
}

function signSponsor(sponsorId) {
  const sp = InitialData.sponsors.find(s => s.id === sponsorId);
  if (!sp || GameState.activeSponsor === sponsorId) return;
  GameState.activeSponsor = sponsorId;
  getUserTeam().budget += sp.upfront;
  addNews(`🤝 Firmaste patrocinio oficial con ${sp.name} (+$${sp.upfront.toLocaleString()}).`);
  refreshAllUI();
}

// 6. SELECCIONES NACIONALES FIFAe
function acceptNationalOffer(code) {
  GameState.manager.nationalTeamCode = code;
  GameState.pendingNationalOffer = null;
  const fed = InitialData.federations.find(f => f.code === code);
  addNews(`🌍 ¡Asumiste como Seleccionador Nacional de ${fed ? fed.name : code}!`, "prodigy");
  refreshAllUI();
}

function renderNationalTab() {
  const hub = document.getElementById("national-team-hub");
  const badge = document.getElementById("national-role-badge");
  const natCode = GameState.manager.nationalTeamCode;

  if (!natCode) {
    badge.textContent = "Sin Selección Activa";
    hub.innerHTML = `
      <p class="muted" style="margin-bottom:12px;">Tu Reputación actual es <strong>${GameState.manager.rep}</strong>. Cuando llegues a 85+ podrás recibir ofertas o postularte a federaciones disponibles:</p>
      <div class="academy-list">
        ${InitialData.federations.map(f => {
          const canApply = GameState.manager.rep >= f.minRep;
          return `
            <div class="academy-item">
              <div>
                <strong>${Graphics.getFlag(f.code)} ${f.name}</strong>
                <div class="muted">Reputación requerida: ${f.minRep}</div>
              </div>
              <button class="btn-sm ${canApply ? "btn-warning" : "btn-secondary"}" ${!canApply ? "disabled" : ""} onclick="acceptNationalOffer('${f.code}')">
                ${canApply ? "Asumir Selección" : "Bloqueado"}
              </button>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  const fed = InitialData.federations.find(f => f.code === natCode);
  badge.textContent = `DT de ${fed ? fed.name : natCode}`;
  const pool = GameState.players.filter(p => p.country === natCode).sort((a, b) => b.ovr - a.ovr);
  const top3 = pool.slice(0, 3);
  const natOvr = top3.length ? Math.round(top3.reduce((s, p) => s + p.ovr, 0) / top3.length) : 80;

  hub.innerHTML = `
    <div class="neg-box" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
      <div>
        <h4>${Graphics.getFlag(natCode)} ${fed ? fed.name : natCode} — Convocatoria Oficial FIFAe</h4>
        <div class="muted">Media del Trío Nacional: <strong>${natOvr} OVR</strong> • Jugadores elegibles en la base de datos: ${pool.length}</div>
      </div>
      <button class="btn-danger-outline btn-sm" onclick="GameState.manager.nationalTeamCode=null;refreshAllUI();">Renunciar a Selección</button>
    </div>
    <table>
      <thead><tr><th>Convocado</th><th>Club Actual</th><th>Rol</th><th>OVR</th><th>Goles Temp.</th></tr></thead>
      <tbody>
        ${pool.map((p, idx) => {
          const club = getTeamById(p.teamId);
          return `
            <tr class="${idx < 3 ? "user-row" : ""}">
              <td><strong class="clickable-link" onclick="openPlayerDetailModal('${p.id}')">${p.name}</strong> ${idx < 3 ? '<span class="badge" style="color:var(--success);">Titular FIFAe</span>' : ""}</td>
              <td>${club ? club.name : "Agente Libre"}</td>
              <td>${p.role || "Striker"}</td>
              <td><strong>${p.ovr}</strong></td>
              <td>${p.goals || 0}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

// 7. CARRERA DE MÁNAGER, INSTALACIONES Y CAMBIO DE EQUIPO
function renderCareerTab() {
  const userTeam = getUserTeam();
  const mgr = GameState.manager;
  const specLabels = {
    ACADEMY: "🌱 Formador de Canteras",
    TACTICIAN: "🧠 Estratega de Cancha",
    NEGOTIATOR: "💼 Negociador Tiburón"
  };

  document.getElementById("mgr-rep-badge").textContent = `Rep. DT: ${mgr.rep} • Confianza: ${mgr.confidence}%`;
  document.getElementById("manager-profile-box").innerHTML = `
    <div style="background:var(--bg-dark);padding:12px;border-radius:10px;border:1px solid var(--border);">
      <strong>${Graphics.getFlag(mgr.country)} ${mgr.name}</strong> • <span class="badge">${specLabels[mgr.specialty] || mgr.specialty}</span>
      <div class="muted" style="margin-top:6px;">
        Club Actual: <strong>${userTeam.name} (${userTeam.division})</strong> •
        Récord Series: <strong>${GameState.careerStats.wins}V - ${GameState.careerStats.losses}D</strong> •
        Títulos: <strong>${GameState.trophiesWon.length}</strong>
      </div>
    </div>
  `;

  const fac = GameState.facilities || { gamingHouse: 1, academy: 1, marketing: 1 };
  const ghCost = fac.gamingHouse * 55000;
  const acCost = fac.academy * 50000;
  const mkCost = fac.marketing * 45000;

  document.getElementById("club-facilities-box").innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div class="academy-item">
        <div><strong>🏠 Gaming House (Nvl ${fac.gamingHouse}/5)</strong><div class="muted">+0.6 OVR base al equipo</div></div>
        <button class="btn-outline btn-sm" ${fac.gamingHouse >= 5 ? "disabled" : ""} onclick="upgradeFacility('gamingHouse', ${ghCost})">${fac.gamingHouse >= 5 ? "Máx" : `$${(ghCost/1000).toFixed(0)}k`}</button>
      </div>
      <div class="academy-item">
        <div><strong>🎓 Centro de Cantera (Nvl ${fac.academy}/5)</strong><div class="muted">+Progreso juvenil anual</div></div>
        <button class="btn-outline btn-sm" ${fac.academy >= 5 ? "disabled" : ""} onclick="upgradeFacility('academy', ${acCost})">${fac.academy >= 5 ? "Máx" : `$${(acCost/1000).toFixed(0)}k`}</button>
      </div>
      <div class="academy-item">
        <div><strong>📢 Estudio Media & Sponsors (Nvl ${fac.marketing}/5)</strong><div class="muted">+$4,000 extra por Media Day</div></div>
        <button class="btn-outline btn-sm" ${fac.marketing >= 5 ? "disabled" : ""} onclick="upgradeFacility('marketing', ${mkCost})">${fac.marketing >= 5 ? "Máx" : `$${(mkCost/1000).toFixed(0)}k`}</button>
      </div>
    </div>
  `;

  document.getElementById("manager-history-list").innerHTML = mgr.history.map(h => `
    <div class="news-item">
      <strong>${h.teamName}</strong> (${h.region}) • Temp. ${h.fromSeason} - ${h.toSeason} • Títulos: <strong>${h.titles}</strong>
    </div>
  `).join("");

  const otherClubs = GameState.teams
    .filter(t => t.id !== userTeam.id)
    .sort((a, b) => b.rep - a.rep);

  document.getElementById("available-jobs-list").innerHTML = otherClubs.map(t => {
    const canSign = mgr.rep >= t.rep - 4;
    return `
      <div class="academy-item">
        <div style="display:flex;align-items:center;gap:10px;">
          ${Graphics.renderCrest(t, 40)}
          <div>
            <strong class="clickable-link" onclick="openClubDetailModal('${t.id}')">${t.name}</strong> <span class="badge">${t.region} • ${t.division}</span>
            <div class="muted">OVR ${getTeamOvr(t.id)} • Rep. Req: ${t.rep - 4} • Presup: $${(t.budget/1000).toFixed(0)}k</div>
          </div>
        </div>
        <button class="btn-sm ${canSign ? "btn-primary" : "btn-secondary"}" ${!canSign ? "disabled" : ""} onclick="acceptJobOffer('${t.id}')">
          ${canSign ? "Firmar" : `Req. ${t.rep - 4}`}
        </button>
      </div>
    `;
  }).join("");
}

function upgradeFacility(key, cost) {
  const userTeam = getUserTeam();
  if (userTeam.budget < cost) return alert("Presupuesto insuficiente.");
  userTeam.budget -= cost;
  GameState.facilities[key] = (GameState.facilities[key] || 1) + 1;
  addNews(`🏗️ Mejoraste las instalaciones del club (${key} Nivel ${GameState.facilities[key]}).`);
  refreshAllUI();
}

function acceptJobOffer(newTeamId) {
  const newTeam = getTeamById(newTeamId);
  if (!newTeam) return;
  if (GameState.manager.history[0]) {
    GameState.manager.history[0].toSeason = GameState.season;
  }
  GameState.userTeamId = newTeam.id;
  GameState.selectedRegionTab = newTeam.region;
  GameState.pendingJobOffer = null;
  GameState.incomingOffer = null;
  GameState.lockerEvent = null;
  GameState.bootcampActive = false;
  recordManagerClubJoin(newTeam);

  initSwissForCurrentEvent();
  generateTournamentBracket();
  pickNextOpponent();
  addNews(`✈️ ¡BOMBA EN EL MERCADO DE DT! ${GameState.manager.name} dejó su cargo y asumió en ${newTeam.name} (${newTeam.region}).`, "prodigy");
  refreshAllUI();
  saveGame(false);
}

// 8. VITRINA, GALAS Y RÉCORDS
function renderAwardsAndTrophies() {
  const awardsEl = document.getElementById("individual-awards-history");
  awardsEl.innerHTML = GameState.awardsHistory.length === 0
    ? `<p class="muted">Los premios individuales se entregan en la Gala al terminar cada temporada.</p>`
    : GameState.awardsHistory.map(a => `
        <div class="award-card">
          <strong>🏆 Gala Oficial Temporada ${a.season}</strong>
          <div class="muted" style="margin-top:4px;">🏅 Rocket d'Or: <strong>${a.rocketDor}</strong></div>
          <div class="muted">⚽ Bota de Oro: <strong>${a.goldenBoot}</strong></div>
          <div class="muted">🎯 Premio KDB: <strong>${a.kdbAward}</strong></div>
          <div class="muted">🧤 Guante de Oro: <strong>${a.goldenGlove}</strong></div>
          <div class="muted">🌟 Golden Boy: <strong>${a.goldenBoy}</strong></div>
        </div>
      `).join("");

  const rec = GameState.records;
  document.getElementById("all-time-records-box").innerHTML = `
    <div class="stats-mini" style="flex-direction:column;gap:4px;">
      <div>⚽ Récord Goles en 1 Temporada: <strong>${rec.topScorerSeason.name} (${rec.topScorerSeason.val})</strong></div>
      <div>💰 Venta Más Cara: <strong>${rec.biggestSale.name} ($${rec.biggestSale.val.toLocaleString()})</strong></div>
      <div>🔥 Mejor Racha Invicta: <strong>${rec.bestStreak} series seguidas</strong></div>
    </div>
  `;

  document.getElementById("hall-of-fame-list").innerHTML = GameState.hallOfFame.length === 0
    ? `<p class="muted">Aún no se retiraron leyendas en tu partida.</p>`
    : GameState.hallOfFame.map(h => `
        <div class="news-item">🎖️ <strong>${Graphics.getFlag(h.country)} ${h.name}</strong> (OVR ${h.ovr} • ${h.titles} títulos) — Retirado en ${h.season}</div>
      `).join("");

  const cabinet = document.getElementById("club-trophy-cabinet");
  if (GameState.trophiesWon.length === 0) {
    cabinet.innerHTML = `<p class="muted">Todavía no ganaste copas. ¡Ganar finales suma trofeos aquí!</p>`;
  } else {
    const grouped = {};
    GameState.trophiesWon.forEach(t => {
      if (!grouped[t.compId]) grouped[t.compId] = { compId: t.compId, compName: t.compName, seasons: [] };
      grouped[t.compId].seasons.push(t.season);
    });
    cabinet.innerHTML = Object.values(grouped).map(g => `
      <div class="trophy-item">
        ${g.seasons.length > 1 ? `<span class="trophy-count-badge">x${g.seasons.length}</span>` : ""}
        ${Graphics.renderTrophy(g.compId, 52)}
        <div style="font-size:0.84rem;font-weight:700;margin-top:6px;">${g.compName}</div>
        <div class="muted">${g.seasons.join(", ")}</div>
      </div>
    `).join("");
  }

  const filter = document.getElementById("history-comp-filter")?.value || "ALL";
  const filteredHist = GameState.championsHistory.filter(h => filter === "ALL" || h.compId === filter);

  document.getElementById("champions-history-list").innerHTML = filteredHist.length === 0
    ? `<p class="muted">Sin campeones registrados para este filtro todavía.</p>`
    : filteredHist.map(h => `
        <div class="news-item">
          🏆 <strong>[${h.season}] ${h.compName}:</strong> <span class="clickable-link" onclick="openClubDetailModal('${h.teamId}')">${h.teamName}</span> (MVP: ${h.mvp})
        </div>
      `).join("");
}

// 9. EDITOR Y IA
function populateEditorTeams() {
  const sel = document.getElementById("edit-person-team");
  const current = sel.value;
  sel.innerHTML = GameState.teams.map(t => `<option value="${t.id}">${t.name} (${t.region} - ${t.division})</option>`).join("");
  if (current) sel.value = current;
}

function createCustomPerson() {
  const name = document.getElementById("edit-person-name").value.trim();
  if (!name) return alert("Escribí un nickname.");
  const role = document.getElementById("edit-person-role").value;
  const tacticRole = document.getElementById("edit-person-tactic-role").value;
  const country = document.getElementById("edit-person-country").value;
  const age = parseInt(document.getElementById("edit-person-age").value) || 17;
  const ovr = parseInt(document.getElementById("edit-person-ovr").value) || 85;
  const pot = parseInt(document.getElementById("edit-person-pot").value) || 92;
  const teamId = document.getElementById("edit-person-team").value;
  const club = getTeamById(teamId);

  if (role === "PLAYER") {
    GameState.players.push({
      id: "cust_p_" + Date.now(), name, country, age, ovr, pot,
      mec: ovr, rot: ovr, def: ovr,
      role: tacticRole, personality: "Promesa Ambiciosa", contractYears: 2,
      teamId, starter: getTeamRoster(teamId, true).length < 3, stamina: 100,
      value: Math.round((ovr - 65) * 28000),
      goals: 0, assists: 0, saves: 0, matches: 0,
      careerGoals: 0, careerAssists: 0, careerSaves: 0, careerTitles: 0,
      clubHistory: [club ? club.name : "Agente Libre"],
      streak: 0
    });
  } else {
    GameState.coaches.push({
      id: "cust_c_" + Date.now(), name, country, ovr,
      specialty: "Estratega LAN (+4% en Majors/Mundiales)",
      teamId, salary: 70000
    });
  }
  document.getElementById("edit-person-name").value = "";
  addNews(`🛠️ Agregaste a ${name} (${ovr} OVR) en el Editor.`);
  refreshAllUI();
}

function runAIManagement() {
  GameState.teams.forEach(team => {
    if (team.id === GameState.userTeamId) return;
    const roster = getTeamRoster(team.id, false);
    if (roster.length < 3) {
      const fa = GameState.players.filter(p => !p.teamId).sort((a, b) => b.ovr - a.ovr)[0];
      if (fa) { fa.teamId = team.id; fa.starter = true; fa.contractYears = 2; }
    }
    const starters = getTeamRoster(team.id, true);
    if (starters.length < 3) {
      roster.slice(0, 3).forEach(p => p.starter = true);
    }
  });
}

function simulateNationalLeaguesMatchday() {
  InitialData.nationalLeagues.forEach(lg => {
    const table = GameState.nationalTables[lg.id];
    if (!table || table.length < 2) return;
    const i = Math.floor(Math.random() * table.length);
    let j = Math.floor(Math.random() * table.length);
    if (i === j) j = (i + 1) % table.length;
    table[i].pj++; table[j].pj++;
    if (Math.random() > 0.45) {
      table[i].pg++; table[i].pts += 3; table[i].dg += 2;
      table[j].pp++; table[j].dg -= 2;
    } else {
      table[j].pg++; table[j].pts += 3; table[j].dg += 2;
      table[i].pp++; table[i].dg -= 2;
    }
  });
}

// GUARDADO Y CARGA
function saveGame(showAlert) {
  localStorage.setItem("rl_career_save_v7", JSON.stringify(GameState));
  if (showAlert) alert("¡Carrera v7.0 guardada correctamente!");
}

function loadSavedGame() {
  const raw =
    localStorage.getItem("rl_career_save_v7") ||
    localStorage.getItem("rl_career_save_v6") ||
    localStorage.getItem("rl_career_save_v5");
  if (!raw) return;
  const loaded = JSON.parse(raw);
  GameState = { ...GameState, ...loaded };
  if (!GameState.manager) GameState.manager = { name: "Tomy", country: "AR", specialty: "ACADEMY", rep: 75, confidence: 80, nationalTeamCode: null, history: [] };
  if (!GameState.facilities) GameState.facilities = { gamingHouse: 1, academy: 1, marketing: 1 };
  if (!GameState.tacticalBoard) GameState.tacticalBoard = { style: "balanced", boostPriority: "balanced", strikerRole: "All-Round", playmakerRole: "Infield Passer", thirdManRole: "Goal-Line Anchor" };
  if (!GameState.hiredScouts) GameState.hiredScouts = [];
  if (!GameState.records) GameState.records = { topScorerSeason: { name: "-", val: 0 }, biggestSale: { name: "-", val: 0 }, bestStreak: 0, currentStreak: 0 };
  if (!GameState.headToHead) GameState.headToHead = {};
  if (!GameState.hallOfFame) GameState.hallOfFame = [];
  GameState.teams.forEach(t => { if (!t.division) t.division = "PRO"; });
  if (!GameState.swissStandings || GameState.swissStandings.length === 0) initSwissForCurrentEvent();
  if (!GameState.currentBracket || !GameState.currentBracket.qf) generateTournamentBracket();
  document.getElementById("setup-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  refreshAllUI();
}

function resetCareer() {
  if (confirm("¿Seguro que querés salir al menú principal? Guardá antes si no querés perder progreso.")) {
    clearInterval(LiveMatch.timerId);
    cancelAnimationFrame(LiveMatch.animFrameId);
    document.getElementById("game-screen").classList.remove("active");
    document.getElementById("setup-screen").classList.add("active");
  }
}
