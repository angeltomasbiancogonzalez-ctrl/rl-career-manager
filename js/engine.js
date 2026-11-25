let GameState = {
  season: "2026-27",
  userTeamId: null,
  selectedRegionTab: "SAM",
  selectedCompView: "rlcs_regional",
  metaPatch: InitialData.metaPatches[0],
  manager: {
    name: "Tomy",
    country: "AR",
    specialty: "ACADEMY",
    rep: 75,
    confidence: 80,
    nationalTeamCode: null,
    history: []
  },
  facilities: { gamingHouse: 1, academy: 1, marketing: 1 },
  tacticalBoard: { style: "balanced", boostPriority: "balanced" },
  hiredScouts: [],
  records: {
    topScorerSeason: { name: "-", val: 0 },
    biggestSale: { name: "-", val: 0 },
    bestStreak: 0,
    currentStreak: 0
  },
  headToHead: {},
  hallOfFame: [],
  teams: [],
  players: [],
  coaches: [],
  academyProspects: [],
  nationalTables: {},
  scheduleIndex: 0,
  currentOpponentId: null,
  swissStandings: [],
  currentBracket: { compName: "", qf: [], sf: [], gf: [] },
  activeSponsor: null,
  weeklyPrepDone: false,
  bootcampActive: false,
  prepBonus: { ovr: 0, chem: 0 },
  incomingOffer: null,
  lockerEvent: null,
  pendingJobOffer: null,
  pendingNationalOffer: null,
  trophiesWon: [],
  championsHistory: [],
  awardsHistory: [],
  careerStats: { wins: 0, losses: 0, youthSales: 0 },
  news: [],
  customNameQueue: []
};

let SelectedSetupTeamId = null;
let ActiveNegotiationPlayerId = null;
let CombinePool = [];

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

// INICIALIZACIÓN
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("hero-trophy-slot").innerHTML = Graphics.renderTrophy("rlcs_worlds", 68);
  renderSetupTeams();
  updateCustomCrestPreview();
  checkExistingSave();
});

function checkExistingSave() {
  const hasSave =
    localStorage.getItem("rl_career_save_v8") ||
    localStorage.getItem("rl_career_save_v7") ||
    localStorage.getItem("rl_career_save_v6");
  if (hasSave) {
    document.getElementById("continue-save-box").classList.remove("hidden");
  }
}

function setSetupMode(mode) {
  document.getElementById("btn-mode-existing").classList.toggle("active", mode === "existing");
  document.getElementById("btn-mode-create").classList.toggle("active", mode === "create");
  document.getElementById("panel-existing").classList.toggle("active", mode === "existing");
  document.getElementById("panel-create").classList.toggle("active", mode === "create");
}

function renderSetupTeams() {
  const filter = document.getElementById("region-filter").value;
  const grid = document.getElementById("teams-grid");
  const filtered = InitialData.teams.filter(t => filter === "ALL" || t.region === filter);

  grid.innerHTML = filtered.map(team => {
    const roster = InitialData.players.filter(p => p.teamId === team.id && p.starter);
    const ovr = roster.length ? Math.round(roster.reduce((s, p) => s + p.ovr, 0) / roster.length) : 80;
    const isSel = SelectedSetupTeamId === team.id;

    return `
      <div class="team-select-card ${isSel ? "selected" : ""}" onclick="selectSetupTeam('${team.id}')">
        ${Graphics.renderCrest(team, 64)}
        <h3>${team.name}</h3>
        <div class="meta">${team.region} • ${team.division} • OVR ${ovr} • ${team.car}</div>
        <div class="roster-preview">${roster.map(p => p.name).join(" • ")}</div>
      </div>
    `;
  }).join("");
}

function selectSetupTeam(teamId) {
  SelectedSetupTeamId = teamId;
  renderSetupTeams();
  document.getElementById("btn-start-existing").disabled = false;
}

function updateCustomCrestPreview() {
  const name = document.getElementById("custom-team-name").value.trim() || "Tu Nuevo Club";
  const tag = (document.getElementById("custom-team-tag").value.trim() || "TNC").toUpperCase();
  const shape = document.getElementById("custom-crest-shape").value;
  const pattern = document.getElementById("custom-crest-pattern").value;
  const color1 = document.getElementById("custom-color-1").value;
  const color2 = document.getElementById("custom-color-2").value;
  const logoUrl = document.getElementById("custom-logo-url").value.trim();

  const mock = { id: "preview", name, tag, shape, pattern, color1, color2, logoUrl, stars: 0 };
  document.getElementById("custom-crest-preview").innerHTML = Graphics.renderCrest(mock, 68);
  document.getElementById("preview-club-title").textContent = `${name} (${tag})`;
}

function getManagerFormData() {
  return {
    name: (document.getElementById("mgr-name-input").value.trim() || "Tomy"),
    country: document.getElementById("mgr-country-select").value,
    specialty: document.getElementById("mgr-specialty-select").value
  };
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

function seedInitialAcademy() {
  const userTeam = getUserTeam();
  const otherClubs = GameState.teams.filter(t => t.id !== userTeam.id);

  const startersYouth = [
    { id: "acad_init_1", name: "ValenRL", country: "AR", age: 14, rank: "SSL", archetype: "Freestyler Mecánico", ovr: 76, pot: 96, ownerTeamId: userTeam.id, isUserAcademy: true, loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0 },
    { id: "acad_init_2", name: "MateoFlip", country: "CL", age: 15, rank: "GC3", archetype: "Cerebro Táctico", ovr: 73, pot: 92, ownerTeamId: userTeam.id, isUserAcademy: true, loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0 },
    { id: "acad_init_3", name: "LukaWall", country: "BR", age: 15, rank: "GC2", archetype: "Muralla Defensiva", ovr: 71, pot: 90, ownerTeamId: userTeam.id, isUserAcademy: true, loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0 }
  ];

  const worldYouth = [
    { id: "acad_w_1", name: "NoaZen", country: "FR", age: 14, rank: "SSL", archetype: "Freestyler Mecánico", ovr: 77, pot: 97, ownerTeamId: otherClubs[0]?.id || userTeam.id, isUserAcademy: false, loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0 },
    { id: "acad_w_2", name: "TariqPro", country: "SA", age: 15, rank: "GC3", archetype: "Especialista 1v1", ovr: 74, pot: 94, ownerTeamId: otherClubs[1]?.id || userTeam.id, isUserAcademy: false, loanLeagueId: null, loanClub: null, loanGoals: 0, loanAssists: 0 }
  ];

  GameState.academyProspects = [...startersYouth, ...worldYouth];
}

function buildNationalTables() {
  GameState.nationalTables = {};
  InitialData.nationalLeagues.forEach(lg => {
    GameState.nationalTables[lg.id] = lg.clubs.map((club, idx) => ({
      club,
      pj: 6,
      pg: Math.max(1, 5 - Math.floor(idx / 2)),
      pp: Math.min(5, 1 + Math.floor(idx / 2)),
      dg: (5 - idx) * 2,
      pts: Math.max(3, (6 - idx) * 3)
    }));
  });
}

function normalizePlayerCareerFields(p) {
  const club = getTeamById(p.teamId);
  return {
    ...p,
    role: p.role || "Striker",
    personality: p.personality || "Equilibrado",
    contractYears: p.contractYears ?? 2,
    stamina: p.stamina ?? 100,
    matches: p.matches ?? 0,
    careerGoals: p.careerGoals ?? (p.goals || 0),
    careerAssists: p.careerAssists ?? (p.assists || 0),
    careerSaves: p.careerSaves ?? (p.saves || 0),
    careerTitles: p.careerTitles ?? 0,
    clubHistory: p.clubHistory || (club ? [club.name] : ["Agente Libre"]),
    streak: p.streak ?? 0
  };
}

function startCareerExisting() {
  if (!SelectedSetupTeamId) return;
  const mgrForm = getManagerFormData();
  const chosenTeam = InitialData.teams.find(t => t.id === SelectedSetupTeamId);

  GameState = {
    ...GameState,
    season: "2026-27",
    userTeamId: chosenTeam.id,
    selectedRegionTab: chosenTeam.region,
    metaPatch: InitialData.metaPatches[0],
    manager: { ...mgrForm, rep: 78, confidence: 82, nationalTeamCode: null, history: [] },
    facilities: { gamingHouse: 1, academy: 1, marketing: 1 },
    tacticalBoard: { style: "balanced", boostPriority: "balanced" },
    hiredScouts: [],
    records: { topScorerSeason: { name: "-", val: 0 }, biggestSale: { name: "-", val: 0 }, bestStreak: 0, currentStreak: 0 },
    headToHead: {},
    hallOfFame: [],
    teams: InitialData.teams.map(t => ({ ...t, points: 0, stars: t.stars || 0 })),
    players: InitialData.players.map(p => ({ ...p })),
    coaches: InitialData.coaches.map(c => ({ ...c })),
    scheduleIndex: 0,
    weeklyPrepDone: false,
    bootcampActive: false,
    prepBonus: { ovr: 0, chem: 0 },
    incomingOffer: null,
    lockerEvent: null,
    pendingJobOffer: null,
    pendingNationalOffer: null,
    trophiesWon: [],
    championsHistory: [],
    awardsHistory: [],
    careerStats: { wins: 0, losses: 0, youthSales: 0 },
    news: []
  };

  GameState.players = GameState.players.map(normalizePlayerCareerFields);
  recordManagerClubJoin(chosenTeam);
  seedInitialAcademy();
  buildNationalTables();
  initSwissForCurrentEvent();
  generateTournamentBracket();
  pickNextOpponent();
  addNews(`¡Arranca tu carrera como DT de ${chosenTeam.name} (${chosenTeam.region} • ${chosenTeam.division})!`, "prodigy");
  launchGameScreen();
}

function startCareerCustom() {
  const mgrForm = getManagerFormData();
  const name = document.getElementById("custom-team-name").value.trim() || "La Plata Esports";
  const tag = (document.getElementById("custom-team-tag").value.trim() || "LPE").toUpperCase();
  const region = document.getElementById("custom-team-region").value;
  const shape = document.getElementById("custom-crest-shape").value;
  const pattern = document.getElementById("custom-crest-pattern").value;
  const color1 = document.getElementById("custom-color-1").value;
  const color2 = document.getElementById("custom-color-2").value;
  const logoUrl = document.getElementById("custom-logo-url").value.trim();
  const car = document.getElementById("custom-car").value;
  const budget = parseInt(document.getElementById("custom-budget").value) || 320000;

  const customTeamId = "custom_" + Date.now();
  const newTeam = {
    id: customTeamId, name, tag, region, division: "CHALLENGER",
    budget, rep: 72, stars: 0, car, arena: "Arena Fundacional",
    color1, color2, shape, pattern, logoUrl, points: 0
  };

  const regionCountry = { SAM: "AR", EU: "FR", NA: "US", MENA: "SA" }[region] || "AR";
  const rookies = [
    { id: "rk_1_" + Date.now(), name: generateUniqueName(), country: regionCountry, age: 16, ovr: 79, pot: 92, mec: 81, rot: 78, def: 77, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 3, teamId: customTeamId, starter: true, stamina: 100, value: 140000, goals: 0, assists: 0, saves: 0, matches: 0, careerGoals: 0, careerAssists: 0, careerSaves: 0, careerTitles: 0, clubHistory: [name], streak: 0 },
    { id: "rk_2_" + Date.now(), name: generateUniqueName(), country: regionCountry, age: 17, ovr: 78, pot: 89, mec: 78, rot: 80, def: 77, role: "Playmaker", personality: "Líder Nato", contractYears: 3, teamId: customTeamId, starter: true, stamina: 100, value: 125000, goals: 0, assists: 0, saves: 0, matches: 0, careerGoals: 0, careerAssists: 0, careerSaves: 0, careerTitles: 0, clubHistory: [name], streak: 0 },
    { id: "rk_3_" + Date.now(), name: generateUniqueName(), country: regionCountry, age: 18, ovr: 78, pot: 88, mec: 76, rot: 79, def: 81, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 3, teamId: customTeamId, starter: true, stamina: 100, value: 125000, goals: 0, assists: 0, saves: 0, matches: 0, careerGoals: 0, careerAssists: 0, careerSaves: 0, careerTitles: 0, clubHistory: [name], streak: 0 }
  ];

  GameState = {
    ...GameState,
    season: "2026-27",
    userTeamId: customTeamId,
    selectedRegionTab: region,
    metaPatch: InitialData.metaPatches[0],
    manager: { ...mgrForm, rep: 72, confidence: 80, nationalTeamCode: null, history: [] },
    facilities: { gamingHouse: 1, academy: 1, marketing: 1 },
    tacticalBoard: { style: "balanced", boostPriority: "balanced" },
    hiredScouts: [],
    records: { topScorerSeason: { name: "-", val: 0 }, biggestSale: { name: "-", val: 0 }, bestStreak: 0, currentStreak: 0 },
    headToHead: {},
    hallOfFame: [],
    teams: [...InitialData.teams.map(t => ({ ...t, points: 0, stars: t.stars || 0 })), newTeam],
    players: [...InitialData.players.map(normalizePlayerCareerFields), ...rookies],
    coaches: InitialData.coaches.map(c => ({ ...c })),
    scheduleIndex: 0,
    weeklyPrepDone: false,
    bootcampActive: false,
    prepBonus: { ovr: 0, chem: 0 },
    incomingOffer: null,
    lockerEvent: null,
    pendingJobOffer: null,
    pendingNationalOffer: null,
    trophiesWon: [],
    championsHistory: [],
    awardsHistory: [],
    careerStats: { wins: 0, losses: 0, youthSales: 0 },
    news: []
  };

  recordManagerClubJoin(newTeam);
  seedInitialAcademy();
  buildNationalTables();
  initSwissForCurrentEvent();
  generateTournamentBracket();
  pickNextOpponent();
  addNews(`¡Fundaste ${name} (${tag}) en RLCS Challenger (${region})! El ascenso a Pro es tu meta.`, "prodigy");
  launchGameScreen();
}

function launchGameScreen() {
  document.getElementById("setup-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  refreshAllUI();
  saveGame(false);
}

// NAVEGACIÓN Y HELPERS
function switchTab(tabId, btnEl) {
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  if (btnEl) btnEl.classList.add("active");

  if (tabId === "tab-competitions") renderCompetitionView();
  if (tabId === "tab-squad") renderSquadAndCoach();
  if (tabId === "tab-academy") renderAcademy();
  if (tabId === "tab-market") renderMarket();
  if (tabId === "tab-national") renderNationalTab();
  if (tabId === "tab-career") renderCareerTab();
  if (tabId === "tab-awards") renderAwardsAndTrophies();
  if (tabId === "tab-editor") populateEditorTeams();
}

function getUserTeam() { return GameState.teams.find(t => t.id === GameState.userTeamId); }
function getTeamById(id) { return GameState.teams.find(t => t.id === id); }
function getTeamRoster(teamId, startersOnly = false) {
  const list = GameState.players.filter(p => p.teamId === teamId);
  return startersOnly ? list.filter(p => p.starter).slice(0, 3) : list;
}
function getTeamCoach(teamId) { return GameState.coaches.find(c => c.teamId === teamId); }

function getTeamOvr(teamId) {
  const starters = getTeamRoster(teamId, true);
  if (!starters.length) return 75;
  let avg = starters.reduce((s, p) => {
    const stamFactor = ((p.stamina ?? 100) < 45) ? -2 : 0;
    const streakFactor = (p.streak >= 3) ? 2 : 0;
    return s + p.ovr + stamFactor + streakFactor;
  }, 0) / starters.length;

  if (teamId === GameState.userTeamId) {
    avg += (GameState.prepBonus?.ovr || 0);
    if (GameState.bootcampActive) avg += 1.5;
    if (GameState.manager.specialty === "TACTICIAN") avg += 2;
    avg += ((GameState.facilities?.gamingHouse || 1) - 1) * 0.6;
  }
  return Math.min(99, Math.max(65, Math.round(avg)));
}

function getTeamChemistry(teamId) {
  const starters = getTeamRoster(teamId, true);
  if (starters.length < 2) return 75;
  let chem = 78;
  const countries = starters.map(p => p.country);
  if (new Set(countries).size === 1) chem += 8;
  else if (new Set(countries).size === 2) chem += 4;

  const roles = starters.map(p => p.role);
  if (new Set(roles).size === 3) chem += 5;

  const coach = getTeamCoach(teamId);
  if (coach && coach.specialty.includes("Química")) chem += 6;
  if (teamId === GameState.userTeamId) chem += (GameState.prepBonus?.chem || 0);

  return Math.min(100, Math.max(55, chem));
}

function addNews(text, type = "info") {
  GameState.news.unshift({ text, type, time: `Temp. ${GameState.season}` });
  if (GameState.news.length > 45) GameState.news.pop();
}

function formatClock(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// FASE SUIZA Y LLAVES ELIMINATORIAS
function initSwissForCurrentEvent() {
  const userTeam = getUserTeam();
  const sameDiv = GameState.teams.filter(t => t.region === userTeam.region && t.division === userTeam.division && t.id !== userTeam.id);
  const pool = [userTeam, ...sameDiv.slice(0, 7)];
  GameState.swissStandings = pool.map(t => ({ teamId: t.id, teamName: t.name, w: 0, l: 0 }));
}

function updateSwissStandings(userWon, oppId) {
  const uRow = GameState.swissStandings.find(r => r.teamId === GameState.userTeamId);
  const oRow = GameState.swissStandings.find(r => r.teamId === oppId);
  if (uRow) { if (userWon) uRow.w++; else uRow.l++; }
  if (oRow) { if (!userWon) oRow.w++; else oRow.l++; }

  GameState.swissStandings.forEach(r => {
    if (r.teamId !== GameState.userTeamId && r.teamId !== oppId && r.w + r.l < 3) {
      if (Math.random() > 0.5) r.w++; else r.l++;
    }
  });
  GameState.swissStandings.sort((a, b) => b.w - a.w || a.l - b.l);
}

function generateTournamentBracket() {
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId) || GameState.teams.find(t => t.id !== userTeam.id);
  const others = GameState.teams.filter(t => t.id !== userTeam.id && t.id !== opp.id);

  const qf = [
    { home: userTeam, away: opp, scoreH: "-", scoreA: "-", winner: null },
    { home: others[0] || opp, away: others[1] || userTeam, scoreH: "-", scoreA: "-", winner: null },
    { home: others[2] || opp, away: others[3] || userTeam, scoreH: "-", scoreA: "-", winner: null },
    { home: others[4] || opp, away: others[5] || userTeam, scoreH: "-", scoreA: "-", winner: null }
  ];
  GameState.currentBracket = {
    compName: stage.compName,
    qf,
    sf: [{ home: null, away: null, scoreH: "-", scoreA: "-", winner: null }, { home: null, away: null, scoreH: "-", scoreA: "-", winner: null }],
    gf: [{ home: null, away: null, scoreH: "-", scoreA: "-", winner: null }]
  };
}

function updateBracketProgress(userWon, opp, hWins, aWins) {
  const b = GameState.currentBracket;
  const userTeam = getUserTeam();
  const winner = userWon ? userTeam : opp;

  if (b.qf && b.qf[0]) {
    b.qf[0].scoreH = hWins; b.qf[0].scoreA = aWins; b.qf[0].winner = winner;
    b.qf.slice(1).forEach(m => {
      const w = (getTeamOvr(m.home.id) + Math.random() * 6) >= (getTeamOvr(m.away.id) + Math.random() * 6) ? m.home : m.away;
      m.scoreH = 3; m.scoreA = Math.floor(Math.random() * 2) + 1; m.winner = w;
    });
    b.sf[0].home = b.qf[0].winner;
    b.sf[0].away = b.qf[1].winner;
    b.sf[1].home = b.qf[2].winner;
    b.sf[1].away = b.qf[3].winner;
  }

  if (b.sf && b.sf[0] && b.sf[0].home && b.sf[0].away) {
    if (b.sf[0].home.id === userTeam.id || b.sf[0].away.id === userTeam.id) {
      b.sf[0].scoreH = hWins; b.sf[0].scoreA = aWins; b.sf[0].winner = winner;
    }
    if (b.sf[1].home && b.sf[1].away) {
      const w2 = (getTeamOvr(b.sf[1].home.id) + Math.random() * 5) >= (getTeamOvr(b.sf[1].away.id) + Math.random() * 5) ? b.sf[1].home : b.sf[1].away;
      b.sf[1].scoreH = 4; b.sf[1].scoreA = 2; b.sf[1].winner = w2;
    }
    if (b.sf[0].winner && b.sf[1].winner) {
      b.gf[0].home = b.sf[0].winner;
      b.gf[0].away = b.sf[1].winner;
    }
  }
}

function pickNextOpponent() {
  const userTeam = getUserTeam();
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];
  let pool = [];

  if (stage.compId === "rlcs_regional") {
    pool = GameState.teams.filter(t => t.id !== userTeam.id && t.region === userTeam.region && t.division === userTeam.division);
  } else if (stage.compId === "rlcs_worlds" || stage.compId === "ewc") {
    pool = [...GameState.teams.filter(t => t.id !== userTeam.id && t.division === "PRO")].sort((a, b) => b.rep - a.rep).slice(0, 8);
  } else {
    pool = GameState.teams.filter(t => t.id !== userTeam.id && t.division === "PRO");
  }

  if (!pool.length) pool = GameState.teams.filter(t => t.id !== userTeam.id);
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  GameState.currentOpponentId = chosen.id;
}

// REFRESH GENERAL DE UI
function refreshAllUI() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[InitialData.seasonSchedule.length - 1];
  const ovr = getTeamOvr(userTeam.id);
  const chem = getTeamChemistry(userTeam.id);

  document.getElementById("hud-crest").innerHTML = Graphics.renderCrest(userTeam, 48);
  document.getElementById("hud-team-name").textContent = userTeam.name;
  document.getElementById("hud-team-meta").textContent = `${userTeam.region} • ${userTeam.division} • ${userTeam.car || "Fennec"}`;
  document.getElementById("hud-season").textContent = GameState.season;
  document.getElementById("hud-budget").textContent = `$${userTeam.budget.toLocaleString()}`;
  document.getElementById("hud-points").textContent = `${userTeam.points} pts`;
  document.getElementById("hud-chem-ovr").textContent = `${chem}% / ${ovr}`;
  document.getElementById("hud-manager-info").textContent = `${GameState.manager.name} (${GameState.manager.rep})`;

  document.getElementById("hud-meta-patch").textContent = GameState.metaPatch;
  document.getElementById("hud-next-event").textContent = `${stage.compName} — ${stage.roundName}`;

  document.getElementById("match-stage-title").textContent = `${stage.compName} — ${stage.roundName}`;
  document.getElementById("match-format-badge").textContent = stage.format === "Bo7" ? "Al Mejor de 7 (Bo7)" : "Al Mejor de 5 (Bo5)";
  document.getElementById("match-home-crest").innerHTML = Graphics.renderCrest(userTeam, 68);
  document.getElementById("match-home-name").textContent = userTeam.name;
  document.getElementById("match-home-ovr").textContent = `OVR ${ovr} • ${userTeam.car || "Fennec"}`;

  if (opp) {
    const h2h = GameState.headToHead[opp.id] || { w: 0, l: 0 };
    const awayCrestEl = document.getElementById("match-away-crest");
    awayCrestEl.innerHTML = Graphics.renderCrest(opp, 68);
    awayCrestEl.onclick = () => openClubDetailModal(opp.id);
    document.getElementById("match-away-name").innerHTML = `<span class="clickable-link" onclick="openClubDetailModal('${opp.id}')">${opp.name}</span>`;
    document.getElementById("match-away-ovr").textContent = `OVR ${getTeamOvr(opp.id)} • ${opp.car || "Octane"}`;
    document.getElementById("match-h2h-label").textContent = `Historial vs Rival: ${h2h.w}V - ${h2h.l}D`;
  }

  const mult = userTeam.division === "CHALLENGER" && stage.compId === "rlcs_regional" ? 0.55 : 1;
  document.getElementById("match-prize-label").textContent = `Premio: +$${Math.round(stage.prize * mult).toLocaleString()} | +${stage.points} pts`;

  updateWeeklyPrepUI();
  renderDynamicEventsBanner();

  document.getElementById("news-feed").innerHTML = GameState.news.map(n => `
    <div class="news-item ${n.type}">
      <small class="muted">[${n.time}]</small> ${n.text}
    </div>
  `).join("");
}

function updateWeeklyPrepUI() {
  const done = GameState.weeklyPrepDone;
  document.getElementById("prep-status-badge").textContent = done ? "Preparación Completada" : "Disponible";
  ["btn-prep-scrims", "btn-prep-bootcamp", "btn-prep-rest", "btn-prep-media"].forEach(id => {
    document.getElementById(id).disabled = done;
  });
}

function doWeeklyPrep(type) {
  if (GameState.weeklyPrepDone) return;
  const userTeam = getUserTeam();
  const starters = getTeamRoster(userTeam.id, true);

  if (type === "SCRIMS") {
    GameState.prepBonus.ovr += 2;
    GameState.prepBonus.chem += 2;
    addNews(`⚡ Scrims Tácticos completados: +2 OVR y +2% Química para la serie.`);
  } else if (type === "BOOTCAMP") {
    if (userTeam.budget < 18000) return alert("Necesitás $18,000 para el Bootcamp.");
    userTeam.budget -= 18000;
    GameState.prepBonus.ovr += 3;
    GameState.bootcampActive = true;
    addNews(`🏋️ Bootcamp Intensivo (-$18,000): +3 OVR para esta serie y +1.5 OVR el resto de la temporada.`);
  } else if (type === "REST") {
    starters.forEach(p => p.stamina = Math.min(100, (p.stamina ?? 100) + 20));
    addNews(`🛌 Descanso Mental: los titulares recuperaron +20% de energía.`);
  } else if (type === "MEDIA") {
    const extra = ((GameState.facilities?.marketing || 1) - 1) * 4000;
    const total = 15000 + extra;
    userTeam.budget += total;
    addNews(`📺 Media Day: ingresos por visibilidad de marca (+$${total.toLocaleString()}).`);
  }

  GameState.weeklyPrepDone = true;
  refreshAllUI();
}

function renderDynamicEventsBanner() {
  const banner = document.getElementById("dynamic-events-banner");
  let html = "";

  if (GameState.pendingNationalOffer) {
    const fed = GameState.pendingNationalOffer;
    html += `
      <div class="event-alert" style="border-color:#10b981;background:rgba(16,185,129,0.12);">
        <div>🌍 <strong>¡OFERTA DE SELECCIÓN NACIONAL!</strong> La <strong>${fed.name}</strong> quiere que seas su DT en la FIFAe World Cup.</div>
        <div style="display:flex;gap:8px;">
          <button class="btn-success btn-sm" onclick="acceptNationalOffer('${fed.code}')">Aceptar Selección</button>
          <button class="btn-secondary btn-sm" onclick="GameState.pendingNationalOffer=null;refreshAllUI();">Rechazar</button>
        </div>
      </div>
    `;
  }

  if (GameState.incomingOffer) {
    const off = GameState.incomingOffer;
    html += `
      <div class="event-alert">
        <div>📩 <strong>Oferta de Traspaso:</strong> <strong>${off.buyerName}</strong> ofrece <span class="money">$${off.amount.toLocaleString()}</span> por <strong>${off.playerName}</strong>.</div>
        <div style="display:flex;gap:8px;">
          <button class="btn-success btn-sm" onclick="acceptIncomingOffer()">Aceptar Venta</button>
          <button class="btn-danger-outline btn-sm" onclick="rejectIncomingOffer()">Rechazar</button>
        </div>
      </div>
    `;
  }

  if (GameState.lockerEvent) {
    const ev = GameState.lockerEvent;
    html += `
      <div class="event-alert">
        <div>🔥 <strong>Vestuario:</strong> ${ev.text}</div>
        <div style="display:flex;gap:8px;">
          <button class="btn-warning btn-sm" onclick="resolveLockerEvent(true)">${ev.yesLabel}</button>
          <button class="btn-secondary btn-sm" onclick="resolveLockerEvent(false)">${ev.noLabel}</button>
        </div>
      </div>
    `;
  }

  if (GameState.pendingJobOffer) {
    const job = GameState.pendingJobOffer;
    html += `
      <div class="event-alert">
        <div>👔 <strong>Oferta de Otro Club:</strong> <strong>${job.teamName}</strong> (${job.region}) te ofrece dirigir su proyecto.</div>
        <div style="display:flex;gap:8px;">
          <button class="btn-primary btn-sm" onclick="acceptJobOffer('${job.teamId}')">Cambiar de Club</button>
          <button class="btn-secondary btn-sm" onclick="GameState.pendingJobOffer=null;refreshAllUI();">Quedarme</button>
        </div>
      </div>
    `;
  }

  banner.innerHTML = html;
}

function acceptIncomingOffer() {
  const off = GameState.incomingOffer;
  if (!off) return;
  const userTeam = getUserTeam();
  const buyer = getTeamById(off.buyerId);
  const player = GameState.players.find(p => p.id === off.playerId);
  if (!player || getTeamRoster(userTeam.id, false).length <= 3) {
    alert("No podés vender más jugadores: necesitás al menos 3 en el club.");
    GameState.incomingOffer = null;
    refreshAllUI();
    return;
  }

  userTeam.budget += off.amount;
  if (buyer) buyer.budget = Math.max(50000, buyer.budget - off.amount);
  player.teamId = off.buyerId;
  player.starter = true;
  if (!player.clubHistory) player.clubHistory = [];
  player.clubHistory.push(off.buyerName);

  if (off.amount > GameState.records.biggestSale.val) {
    GameState.records.biggestSale = { name: `${player.name} a ${off.buyerName}`, val: off.amount };
  }

  addNews(`💸 Vendiste a ${player.name} a ${off.buyerName} por $${off.amount.toLocaleString()}.`);
  GameState.incomingOffer = null;
  refreshAllUI();
}

function rejectIncomingOffer() {
  addNews(`Rechazaste la oferta de ${GameState.incomingOffer.buyerName} por ${GameState.incomingOffer.playerName}.`);
  GameState.incomingOffer = null;
  refreshAllUI();
}

function resolveLockerEvent(accepted) {
  const ev = GameState.lockerEvent;
  if (!ev) return;
  const userTeam = getUserTeam();
  const p = GameState.players.find(pl => pl.id === ev.playerId);

  if (accepted) {
    if (userTeam.budget < ev.cost) return alert("No tenés presupuesto suficiente para pagar ese bonus.");
    userTeam.budget -= ev.cost;
    if (p) p.streak = Math.max(3, (p.streak || 0) + 2);
    addNews(`🔥 ${ev.winMsg}`);
  } else {
    addNews(`❄️ ${ev.loseMsg}`);
  }
  GameState.lockerEvent = null;
  refreshAllUI();
}

// 1. MOTOR 2D REAL EN VIVO, KICKOFF Y CIERRE DE SERIE
function resetPositionsForKickoff() {
  if (!LiveMatch.simState) return;
  const st = LiveMatch.simState;
  st.ball = {
    x: 320, y: 180,
    vx: (Math.random() - 0.5) * 1.1,
    vy: (Math.random() - 0.5) * 1.1,
    aerial: false,
    lastTouch: null,
    prevTouch: null
  };

  const homeKickoff = [
    { x: 225, y: 180 },
    { x: 165, y: 115 },
    { x: 75, y: 180 }
  ];
  const awayKickoff = [
    { x: 415, y: 180 },
    { x: 475, y: 245 },
    { x: 565, y: 180 }
  ];

  let hIdx = 0, aIdx = 0;
  st.cars.forEach(car => {
    car.demoTimer = 0;
    car.boost = 33;
    if (car.isHome) {
      const pos = homeKickoff[hIdx++] || { x: 120, y: 180 };
      car.x = pos.x; car.y = pos.y; car.angle = 0;
    } else {
      const pos = awayKickoff[aIdx++] || { x: 520, y: 180 };
      car.x = pos.x; car.y = pos.y; car.angle = Math.PI;
    }
  });
}

function initPitchSimulationState() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const homeStarters = getTeamRoster(userTeam.id, true);
  const awayStarters = getTeamRoster(opp.id, true);

  const cars = [];
  homeStarters.forEach((p, idx) => {
    cars.push({
      id: p.id, name: p.name, ovr: p.ovr, mec: p.mec, def: p.def,
      role: p.role || "Striker", carBody: userTeam.car || "Fennec",
      isHome: true, slotIdx: idx,
      x: 160, y: 180, angle: 0, boost: 33, boosting: false, demoTimer: 0
    });
  });
  awayStarters.forEach((p, idx) => {
    cars.push({
      id: p.id, name: p.name, ovr: p.ovr, mec: p.mec, def: p.def,
      role: p.role || "Striker", carBody: opp.car || "Octane",
      isHome: false, slotIdx: idx,
      x: 480, y: 180, angle: Math.PI, boost: 33, boosting: false, demoTimer: 0
    });
  });

  LiveMatch.simState = {
    ball: { x: 320, y: 180, vx: 0, vy: 0, aerial: false, lastTouch: null, prevTouch: null },
    cars,
    goalBannerTimer: 0,
    goalBannerText: "",
    boostPads: [
      { x: 64, y: 42, active: true, respawn: 0 },
      { x: 320, y: 38, active: true, respawn: 0 },
      { x: 576, y: 42, active: true, respawn: 0 },
      { x: 64, y: 318, active: true, respawn: 0 },
      { x: 320, y: 322, active: true, respawn: 0 },
      { x: 576, y: 318, active: true, respawn: 0 }
    ]
  };
  resetPositionsForKickoff();
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

function handleRealGoalScored(scoringHome) {
  const st = LiveMatch.simState;
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const timeStr = formatClock(LiveMatch.secondsLeft);

  const homeCars = st.cars.filter(c => c.isHome);
  const awayCars = st.cars.filter(c => !c.isHome);

  if (scoringHome) {
    LiveMatch.gHome++;
    const scorerCar = (st.ball.lastTouch && st.ball.lastTouch.isHome)
      ? st.ball.lastTouch
      : homeCars[Math.floor(Math.random() * homeCars.length)];
    const assisterCar = (st.ball.prevTouch && st.ball.prevTouch.isHome && st.ball.prevTouch.id !== scorerCar?.id)
      ? st.ball.prevTouch
      : null;

    const pScorer = GameState.players.find(p => p.id === scorerCar?.id);
    const pAssist = GameState.players.find(p => p.id === assisterCar?.id);
    if (pScorer) { pScorer.goals++; pScorer.careerGoals = (pScorer.careerGoals || 0) + 1; }
    if (pAssist) { pAssist.assists++; pAssist.careerAssists = (pAssist.careerAssists || 0) + 1; }

    const shotType = st.ball.aerial ? "Flip Reset / Aéreo" : "Remate al Arco";
    st.goalBannerText = `⚽ ¡GOL DE ${(scorerCar?.name || userTeam.tag).toUpperCase()}!`;
    st.goalBannerTimer = 55;
    logLiveEvent(`⏱️ [${timeStr}] ⚽ ¡GOLAZO DE <strong>${scorerCar?.name}</strong> (${shotType})${pAssist ? ` • Asist. ${pAssist.name}` : ""}!`);
  } else {
    LiveMatch.gAway++;
    const scorerCar = (st.ball.lastTouch && !st.ball.lastTouch.isHome)
      ? st.ball.lastTouch
      : awayCars[Math.floor(Math.random() * awayCars.length)];

    const pScorer = GameState.players.find(p => p.id === scorerCar?.id);
    if (pScorer) { pScorer.goals++; pScorer.careerGoals = (pScorer.careerGoals || 0) + 1; }

    st.goalBannerText = `⚽ GOL DE ${(scorerCar?.name || opp.tag).toUpperCase()}`;
    st.goalBannerTimer = 55;
    logLiveEvent(`⏱️ [${timeStr}] ⚽ Gol de <strong>${scorerCar?.name}</strong> (${opp.tag}).`);
  }

  document.getElementById("live-map-score").textContent = `${LiveMatch.gHome} - ${LiveMatch.gAway}`;
}

function stepPitchAnimation() {
  if (!LiveMatch.running || !LiveMatch.simState) return;
  const st = LiveMatch.simState;
  const ball = st.ball;

  if (st.goalBannerTimer > 0) {
    st.goalBannerTimer--;
    if (st.goalBannerTimer === 0) resetPositionsForKickoff();
    Graphics.drawPitch2D(document.getElementById("rl-pitch-canvas"), st);
    LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
    return;
  }

  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vx *= 0.985;
  ball.vy *= 0.985;

  const inGoalMouthY = ball.y >= 136 && ball.y <= 224;
  if (ball.x <= 36 && inGoalMouthY) {
    handleRealGoalScored(false);
    Graphics.drawPitch2D(document.getElementById("rl-pitch-canvas"), st);
    LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
    return;
  }
  if (ball.x >= 604 && inGoalMouthY) {
    handleRealGoalScored(true);
    Graphics.drawPitch2D(document.getElementById("rl-pitch-canvas"), st);
    LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
    return;
  }

  if (ball.x < 45) { ball.x = 45; ball.vx = Math.abs(ball.vx) * 0.8 + 1.2; }
  if (ball.x > 595) { ball.x = 595; ball.vx = -Math.abs(ball.vx) * 0.8 - 1.2; }
  if (ball.y < 27) { ball.y = 27; ball.vy = Math.abs(ball.vy) * 0.8 + 1.0; }
  if (ball.y > 333) { ball.y = 333; ball.vy = -Math.abs(ball.vy) * 0.8 - 1.0; }

  st.boostPads.forEach(pad => {
    if (!pad.active) {
      pad.respawn--;
      if (pad.respawn <= 0) pad.active = true;
    }
  });

  const activeHome = st.cars.filter(c => c.isHome && c.demoTimer === 0);
  const activeAway = st.cars.filter(c => !c.isHome && c.demoTimer === 0);
  const homeFirstMan = [...activeHome].sort((a, b) => Math.hypot(a.x - ball.x, a.y - ball.y) - Math.hypot(b.x - ball.x, b.y - ball.y))[0];
  const awayFirstMan = [...activeAway].sort((a, b) => Math.hypot(a.x - ball.x, a.y - ball.y) - Math.hypot(b.x - ball.x, b.y - ball.y))[0];

  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const homeSkill = getTeamOvr(userTeam.id) + (LiveMatch.timeoutBoostActive ? 5 : 0);
  const awaySkill = getTeamOvr(opp.id);

  st.cars.forEach(car => {
    if (car.demoTimer > 0) {
      car.demoTimer--;
      if (car.demoTimer === 0) {
        car.x = car.isHome ? 65 : 575;
        car.y = car.slotIdx === 0 ? 90 : 270;
        car.boost = 33;
      }
      return;
    }

    const isFirstMan = (car.id === homeFirstMan?.id) || (car.id === awayFirstMan?.id);
    let targetX = ball.x;
    let targetY = ball.y;

    if (isFirstMan) {
      targetX = ball.x + (car.isHome ? -10 : 10);
      targetY = ball.y;
    } else if (car.boost < 26) {
      const pad = st.boostPads.find(p => p.active && ((car.isHome && p.x <= 320) || (!car.isHome && p.x >= 320)));
      if (pad) {
        targetX = pad.x;
        targetY = pad.y;
      }
    } else if (car.role === "Playmaker") {
      targetX = car.isHome ? Math.min(520, ball.x + 45) : Math.max(120, ball.x - 45);
      targetY = ball.y > 180 ? 85 : 275;
    } else {
      targetX = car.isHome ? Math.max(85, Math.min(340, ball.x - 165)) : Math.min(555, Math.max(300, ball.x + 165));
      targetY = 180 + (ball.y - 180) * 0.4;
    }

    let repX = 0, repY = 0;
    st.cars.forEach(other => {
      if (other.id !== car.id && other.demoTimer === 0) {
        const dxO = car.x - other.x;
        const dyO = car.y - other.y;
        const dO = Math.hypot(dxO, dyO);
        if (dO > 0 && dO < 36) {
          repX += (dxO / dO) * (36 - dO) * 0.45;
          repY += (dyO / dO) * (36 - dO) * 0.45;
        }
      }
    });

    const dx = (targetX - car.x) + repX;
    const dy = (targetY - car.y) + repY;
    const dist = Math.hypot(dx, dy) || 1;
    car.angle = Math.atan2(dy, dx);

    car.boosting = isFirstMan && car.boost > 12 && dist > 35;
    const baseSpeed = car.isHome ? (2.3 + (homeSkill - 80) * 0.04) : (2.3 + (awaySkill - 80) * 0.04);
    const speed = car.boosting ? baseSpeed * 1.48 : baseSpeed;

    car.x = Math.max(46, Math.min(594, car.x + (dx / dist) * speed));
    car.y = Math.max(28, Math.min(332, car.y + (dy / dist) * speed));

    if (car.boosting) car.boost = Math.max(0, car.boost - 0.38);
    else car.boost = Math.min(100, car.boost + 0.06);

    st.boostPads.forEach(pad => {
      if (pad.active && Math.hypot(car.x - pad.x, car.y - pad.y) < 18) {
        pad.active = false;
        pad.respawn = 130;
        car.boost = 100;
      }
    });

    if (Math.hypot(car.x - ball.x, car.y - ball.y) < 18) {
      if (st.ball.lastTouch?.id !== car.id) {
        st.ball.prevTouch = st.ball.lastTouch;
        st.ball.lastTouch = car;
      }

      const goalX = car.isHome ? 612 : 28;
      const goalY = 180 + (Math.random() - 0.5) * 68;
      const shotAngle = Math.atan2(goalY - ball.y, goalX - ball.x);
      const power = 5.4 + (car.mec / 100) * 2.8 + (car.boosting ? 1.5 : 0);

      ball.vx = Math.cos(shotAngle) * power;
      ball.vy = Math.sin(shotAngle) * power;
      ball.aerial = car.boosting && Math.random() > 0.55;

      if ((car.isHome && ball.x < 115) || (!car.isHome && ball.x > 525)) {
        const pDef = GameState.players.find(p => p.id === car.id);
        if (pDef && Math.random() > 0.45) {
          pDef.saves++;
          pDef.careerSaves = (pDef.careerSaves || 0) + 1;
        }
      }
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
    const step = 10 * LiveMatch.speedMultiplier;
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
  const timeStr = formatClock(secLeft);
  if (LiveMatch.simState && Math.random() < (LiveMatch.tactic === "aggressive" ? 0.11 : 0.04)) {
    const victimCar = LiveMatch.simState.cars[Math.floor(Math.random() * LiveMatch.simState.cars.length)];
    if (victimCar && victimCar.demoTimer === 0) {
      victimCar.demoTimer = 95;
      logLiveEvent(`💥 [${timeStr}] <strong>¡DEMOLICIÓN!</strong> ${victimCar.name} explotó y queda 3s fuera de rotación.`);
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
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const homeStarters = getTeamRoster(userTeam.id, true);
  const awayStarters = getTeamRoster(opp.id, true);
  const chance = Math.min(0.84, Math.max(0.16, 0.50 + (getTeamOvr(userTeam.id) - getTeamOvr(opp.id)) * 0.032));

  const extraGoals = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < extraGoals; i++) {
    if (Math.random() < chance) {
      LiveMatch.gHome++;
      const sc = homeStarters[Math.floor(Math.random() * homeStarters.length)];
      if (sc) { sc.goals++; sc.careerGoals = (sc.careerGoals || 0) + 1; }
    } else {
      LiveMatch.gAway++;
      const sc = awayStarters[Math.floor(Math.random() * awayStarters.length)];
      if (sc) { sc.goals++; sc.careerGoals = (sc.careerGoals || 0) + 1; }
    }
  }
  LiveMatch.secondsLeft = 0;
  finishCurrentLiveMap();
}

function finishCurrentLiveMap() {
  clearInterval(LiveMatch.timerId);
  cancelAnimationFrame(LiveMatch.animFrameId);
  LiveMatch.running = false;
  LiveMatch.timeoutBoostActive = false;
  document.getElementById("btn-skip-map").classList.add("hidden");
  document.getElementById("zero-second-alert").classList.add("hidden");

  if (LiveMatch.gHome === LiveMatch.gAway) {
    const userTeam = getUserTeam();
    const opp = getTeamById(GameState.currentOpponentId);
    const homeStarters = getTeamRoster(userTeam.id, true);
    const awayStarters = getTeamRoster(opp.id, true);
    const chance = Math.min(0.82, Math.max(0.18, 0.50 + (getTeamOvr(userTeam.id) - getTeamOvr(opp.id)) * 0.03));
    if (Math.random() < chance) {
      LiveMatch.gHome++;
      const sc = homeStarters[Math.floor(Math.random() * homeStarters.length)];
      if (sc) { sc.goals++; sc.careerGoals = (sc.careerGoals || 0) + 1; }
      logLiveEvent(`⚡ <strong>[OVERTIME]</strong> ¡Gol de oro de <strong>${sc?.name}</strong>!`);
    } else {
      LiveMatch.gAway++;
      const sc = awayStarters[Math.floor(Math.random() * awayStarters.length)];
      if (sc) { sc.goals++; sc.careerGoals = (sc.careerGoals || 0) + 1; }
      logLiveEvent(`⚡ <strong>[OVERTIME]</strong> Gol de oro rival anotado por <strong>${sc?.name}</strong>.`);
    }
    document.getElementById("live-map-score").textContent = `${LiveMatch.gHome} - ${LiveMatch.gAway}`;
  }

  const homeWonMap = LiveMatch.gHome > LiveMatch.gAway;
  if (homeWonMap) {
    LiveMatch.homeWins++;
    logLiveEvent(`🏁 Final Juego ${LiveMatch.gameNum}: <strong>${LiveMatch.gHome} - ${LiveMatch.gAway}</strong> → Punto para tu equipo.`);
  } else {
    LiveMatch.awayWins++;
    logLiveEvent(`🏁 Final Juego ${LiveMatch.gameNum}: <strong>${LiveMatch.gHome} - ${LiveMatch.gAway}</strong> → Punto para el rival.`);
  }

  document.getElementById("live-home-series").textContent = LiveMatch.homeWins;
  document.getElementById("live-away-series").textContent = LiveMatch.awayWins;

  if (LiveMatch.homeWins >= LiveMatch.winsNeeded || LiveMatch.awayWins >= LiveMatch.winsNeeded) {
    LiveMatch.active = false;
    logLiveEvent(`🏆 <strong>SERIE TERMINADA:</strong> ${LiveMatch.homeWins} - ${LiveMatch.awayWins}`);
    document.getElementById("btn-play-next-map").classList.add("hidden");
    document.getElementById("btn-finish-series").classList.remove("hidden");
  } else {
    LiveMatch.gameNum++;
    const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
    document.getElementById("live-game-label").textContent = `JUEGO ${LiveMatch.gameNum} (${stage.format})`;
    document.getElementById("btn-play-next-map").textContent = `Arrancar Reloj del Juego ${LiveMatch.gameNum} (5:00)`;
    document.getElementById("btn-play-next-map").classList.remove("hidden");
  }
}

function closeLiveSeries() {
  const h = LiveMatch.homeWins;
  const a = LiveMatch.awayWins;
  LiveMatch.active = false;
  document.getElementById("live-series-panel").classList.add("hidden");
  document.getElementById("match-controls").classList.remove("hidden");
  finalizeSeriesResult(h, a);
}

function simulateSeriesInstant() {
  const userTeam = getUserTeam();
  const opp = getTeamById(GameState.currentOpponentId);
  const stage = InitialData.seasonSchedule[GameState.scheduleIndex];
  const winsNeeded = stage.format === "Bo7" ? 4 : 3;
  const homeStarters = getTeamRoster(userTeam.id, true);
  const awayStarters = getTeamRoster(opp.id, true);

  let diff = getTeamOvr(userTeam.id) - getTeamOvr(opp.id);
  const coach = getTeamCoach(userTeam.id);
  if (coach && coach.specialty.includes("LAN") && (stage.compId.includes("major") || stage.compId === "rlcs_worlds")) diff += 4;
  if (coach && coach.specialty.includes("Bo5") && stage.format === "Bo5") diff += 3;
  if (GameState.metaPatch.includes("Aéreo") && homeStarters.some(p => p.mec >= 92)) diff += 2;
  if (GameState.metaPatch.includes("Pases") && getTeamChemistry(userTeam.id) >= 88) diff += 2;

  const winProb = Math.min(0.86, Math.max(0.14, 0.50 + diff * 0.032));
  let h = 0, a = 0;
  while (h < winsNeeded && a < winsNeeded) {
    if (Math.random() < winProb) {
      h++;
      const sc = homeStarters[Math.floor(Math.random() * homeStarters.length)];
      if (sc) {
        const g = Math.floor(Math.random() * 2) + 1;
        sc.goals += g;
        sc.careerGoals = (sc.careerGoals || 0) + g;
      }
    } else {
      a++;
      const sc = awayStarters[Math.floor(Math.random() * awayStarters.length)];
      if (sc) {
        const g = Math.floor(Math.random() * 2) + 1;
        sc.goals += g;
        sc.careerGoals = (sc.careerGoals || 0) + g;
      }
    }
  }
  finalizeSeriesResult(h, a);
}

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
  localStorage.setItem("rl_career_save_v8", JSON.stringify(GameState));
  if (showAlert) alert("¡Carrera v8.0 guardada correctamente!");
}

function loadSavedGame() {
  const raw =
    localStorage.getItem("rl_career_save_v8") ||
    localStorage.getItem("rl_career_save_v7") ||
    localStorage.getItem("rl_career_save_v6");
  if (!raw) return;
  const loaded = JSON.parse(raw);
  GameState = { ...GameState, ...loaded };
  if (!GameState.manager) GameState.manager = { name: "Tomy", country: "AR", specialty: "ACADEMY", rep: 75, confidence: 80, nationalTeamCode: null, history: [] };
  if (!GameState.facilities) GameState.facilities = { gamingHouse: 1, academy: 1, marketing: 1 };
  if (!GameState.tacticalBoard) GameState.tacticalBoard = { style: "balanced", boostPriority: "balanced" };
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
