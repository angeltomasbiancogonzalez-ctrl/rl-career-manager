/* ==========================================================================
   RL CAREER MANAGER v8.0 — MOTOR PRINCIPAL (js/engine.js) — PARTE 1 DE 4
   Estado global, Inicio de Carrera (Club Oficial / Fundado), Guardado/Carga,
   Navegación, Cálculos de Equipo, Química y Eventos Dinámicos.
   ========================================================================== */

const SAVE_KEY = "rl_career_manager_v8_save";

let GameState = {
  initialized: false,
  season: 1,
  week: 1,
  scheduleIndex: 0,
  userTeamId: null,
  selectedSetupTeamId: null,
  compViewMode: "USER_LEAGUE",

  manager: {
    name: "Tomy",
    country: "AR",
    specialty: "SCOUT",
    level: 1,
    xp: 0,
    reputation: 65,
    titlesWon: 0,
    nationalTeamCode: null,
    history: []
  },

  facilities: {
    gamingHouse: 1,
    academyCenter: 1,
    analyticsLab: 1
  },

  teams: [],
  players: [],
  coaches: [],
  sponsors: [],
  activeSponsorId: null,
  scouts: [],
  hiredScoutIds: [],
  academy: [],
  nationalLeagues: [],
  nationalTables: {},

  standings: {},
  swiss: null,
  bracket: null,
  currentOpponentId: null,

  weeklyPrepUsed: false,
  currentMetaIndex: 0,
  news: [],
  trophies: [],
  awardsHistory: [],
  pendingIncomingOffer: null,
  pendingLockerEvent: null,
  pendingJobOffer: null,
  pendingChampionStarTeamId: null,
  negotiatingPlayerId: null,
  combinePool: []
};

let LiveMatch = {
  active: false,
  homeTeamId: null,
  awayTeamId: null,
  format: "Bo5",
  winsNeeded: 3,
  homeSeries: 0,
  awaySeries: 0,
  mapNumber: 1,
  homeGoals: 0,
  awayGoals: 0,
  secondsLeft: 300,
  isOvertime: false,
  speedMultiplier: 1,
  tactic: "BALANCED",
  timeoutUsed: false,
  zeroSecondPending: false,
  timerInterval: null,
  animFrameId: null,
  pitch: null
};

// ==========================================================================
// 1. ARRANQUE Y PANTALLA DE CONFIGURACIÓN (FIX DE UNIÓN A CLUB)
// ==========================================================================

window.addEventListener("DOMContentLoaded", () => {
  checkExistingSave();
  setSetupMode("existing");
  renderSetupTeams();
  updateCustomCrestPreview();
});

function checkExistingSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  const banner = document.getElementById("save-banner");
  const info = document.getElementById("save-banner-info");
  if (!banner) return;

  if (!raw) {
    banner.classList.add("hidden");
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.userTeamId && Array.isArray(parsed.teams)) {
      const team = parsed.teams.find(t => t.id === parsed.userTeamId);
      const clubName = team ? team.name : "Club Guardado";
      if (info) {
        info.textContent = `Mánager ${parsed.manager?.name || "Tomy"} • ${clubName} • Temporada ${parsed.season || 1}, Semana ${parsed.week || 1}`;
      }
      banner.classList.remove("hidden");
    } else {
      banner.classList.add("hidden");
    }
  } catch (e) {
    banner.classList.add("hidden");
  }
}

function setSetupMode(mode) {
  const btnEx = document.getElementById("btn-mode-existing");
  const btnCu = document.getElementById("btn-mode-custom");
  const panEx = document.getElementById("panel-existing");
  const panCu = document.getElementById("panel-custom");

  if (!btnEx || !btnCu || !panEx || !panCu) return;

  if (mode === "custom") {
    btnEx.classList.remove("active");
    btnCu.classList.add("active");
    panEx.classList.remove("active");
    panCu.classList.add("active");
    updateCustomCrestPreview();
  } else {
    btnCu.classList.remove("active");
    btnEx.classList.add("active");
    panCu.classList.remove("active");
    panEx.classList.add("active");
  }
}

function renderSetupTeams() {
  const grid = document.getElementById("setup-teams-grid");
  if (!grid || typeof InitialData === "undefined") return;

  const regionFilter = document.getElementById("filter-region")?.value || "ALL";
  const divFilter = document.getElementById("filter-division")?.value || "ALL";

  const filtered = InitialData.teams.filter(team => {
    const okReg = regionFilter === "ALL" || team.region === regionFilter;
    const okDiv = divFilter === "ALL" || team.division === divFilter;
    return okReg && okDiv;
  });

  if (!filtered.some(t => t.id === GameState.selectedSetupTeamId) && filtered.length > 0) {
    GameState.selectedSetupTeamId = filtered[0].id;
  }

  grid.innerHTML = "";

  filtered.forEach(team => {
    const roster = InitialData.players.filter(p => p.teamId === team.id);
    const avgOvr = roster.length
      ? Math.round(roster.reduce((acc, p) => acc + p.ovr, 0) / roster.length)
      : 82;
    const names = roster.map(p => p.name).join(" • ") || "Plantilla por completar";
    const isSelected = GameState.selectedSetupTeamId === team.id;

    const card = document.createElement("div");
    card.className = `team-select-card ${isSelected ? "selected" : ""}`;
    card.dataset.teamId = team.id;
    card.onclick = () => selectSetupTeam(team.id);

    card.innerHTML = `
      ${Graphics.renderCrest(team, 62)}
      <h3>${team.name}</h3>
      <div style="margin:4px 0;">${Graphics.renderDivisionBadge(team.division)}</div>
      <div class="meta">${team.region} • OVR ${avgOvr} • <span class="money">$${team.budget.toLocaleString()}</span></div>
      <div class="roster-preview">${names}</div>
    `;
    grid.appendChild(card);
  });

  updateSelectedClubLabel();
}

function selectSetupTeam(teamId) {
  GameState.selectedSetupTeamId = teamId;
  document.querySelectorAll(".team-select-card").forEach(card => {
    card.classList.toggle("selected", card.dataset.teamId === teamId);
  });
  updateSelectedClubLabel();
}

function updateSelectedClubLabel() {
  const lbl = document.getElementById("selected-club-label");
  if (!lbl) return;
  const team = InitialData.teams.find(t => t.id === GameState.selectedSetupTeamId);
  if (team) {
    lbl.textContent = `Club elegido: ${team.name} [${team.tag}] (${team.region} • ${team.division})`;
  } else {
    lbl.textContent = "Seleccioná un club para comenzar";
  }
}

function updateCustomCrestPreview() {
  const box = document.getElementById("custom-crest-preview");
  if (!box) return;

  const name = (document.getElementById("custom-name")?.value || "La Plata Knights").trim();
  const tag = (document.getElementById("custom-tag")?.value || "LPK").trim().toUpperCase().slice(0, 4);
  const region = document.getElementById("custom-region")?.value || "SAM";
  const division = document.getElementById("custom-division")?.value || "CHALLENGER";
  const shape = document.getElementById("custom-shape")?.value || "shield";
  const pattern = document.getElementById("custom-pattern")?.value || "sash";
  const color1 = document.getElementById("custom-color1")?.value || "#00a8ff";
  const color2 = document.getElementById("custom-color2")?.value || "#ffffff";

  const previewTeam = {
    id: "custom_preview",
    name,
    tag: tag || "RL",
    shape,
    pattern,
    color1,
    color2,
    stars: 0
  };

  box.innerHTML = Graphics.renderCrest(previewTeam, 68);

  const titleEl = document.getElementById("preview-club-title");
  const subEl = document.getElementById("preview-club-sub");
  if (titleEl) titleEl.textContent = `${name || "Mi Club"} [${tag || "RL"}]`;
  if (subEl) subEl.textContent = `Región ${region} • División ${division} • 3 titulares listos para competir`;
}

function getManagerFormData() {
  const name = (document.getElementById("mgr-name")?.value || "Tomy").trim() || "Tomy";
  const country = document.getElementById("mgr-country")?.value || "AR";
  const specialty = document.getElementById("mgr-specialty")?.value || "SCOUT";
  return { name, country, specialty };
}

function initBaseDatabase() {
  const mgr = getManagerFormData();
  GameState.initialized = true;
  GameState.season = 1;
  GameState.week = 1;
  GameState.scheduleIndex = 0;
  GameState.compViewMode = "USER_LEAGUE";

  GameState.manager = {
    name: mgr.name,
    country: mgr.country,
    specialty: mgr.specialty,
    level: 1,
    xp: 0,
    reputation: 68,
    titlesWon: 0,
    nationalTeamCode: null,
    history: []
  };

  GameState.facilities = {
    gamingHouse: 1,
    academyCenter: 1,
    analyticsLab: 1
  };

  GameState.teams = JSON.parse(JSON.stringify(InitialData.teams));
  GameState.players = JSON.parse(JSON.stringify(InitialData.players));
  GameState.coaches = JSON.parse(JSON.stringify(InitialData.coaches));
  GameState.sponsors = JSON.parse(JSON.stringify(InitialData.sponsors));
  GameState.scouts = JSON.parse(JSON.stringify(InitialData.scouts));
  GameState.nationalLeagues = JSON.parse(JSON.stringify(InitialData.nationalLeagues));

  GameState.activeSponsorId = null;
  GameState.hiredScoutIds = [];
  GameState.academy = [];
  GameState.standings = {};
  GameState.swiss = null;
  GameState.bracket = null;
  GameState.currentOpponentId = null;
  GameState.weeklyPrepUsed = false;
  GameState.currentMetaIndex = 0;
  GameState.news = [];
  GameState.trophies = [];
  GameState.awardsHistory = [];
  GameState.pendingIncomingOffer = null;
  GameState.pendingLockerEvent = null;
  GameState.pendingJobOffer = null;
  GameState.pendingChampionStarTeamId = null;

  normalizePlayerCareerFields();
  initStandingsForAllTeams();
  buildNationalTables();
}

function normalizePlayerCareerFields() {
  GameState.players.forEach(p => {
    if (typeof p.stamina !== "number") p.stamina = 100;
    if (typeof p.streak !== "number") p.streak = 0;
    if (typeof p.goals !== "number") p.goals = 0;
    if (typeof p.assists !== "number") p.assists = 0;
    if (typeof p.saves !== "number") p.saves = 0;
    if (typeof p.matches !== "number") p.matches = 0;
    if (!p.role) p.role = "Playmaker";
    if (!p.personality) p.personality = "Trabajador Silencioso";
  });
}

function initStandingsForAllTeams() {
  GameState.standings = {};
  GameState.teams.forEach(t => {
    GameState.standings[t.id] = {
      teamId: t.id,
      points: 0,
      seriesW: 0,
      seriesL: 0,
      mapsW: 0,
      mapsL: 0
    };
  });
}

function buildNationalTables() {
  GameState.nationalTables = {};
  GameState.nationalLeagues.forEach(lg => {
    GameState.nationalTables[lg.id] = lg.clubs.map(clubName => ({
      clubName,
      pj: 0,
      pg: 0,
      pp: 0,
      pts: 0
    }));
  });
}

function recordManagerClubJoin(team) {
  if (!team) return;
  GameState.manager.history.push({
    season: GameState.season,
    clubId: team.id,
    clubName: team.name,
    region: team.region,
    division: team.division,
    note: "Firma como Head Manager"
  });
}

function seedInitialAcademy(team) {
  const regionCountryMap = {
    SAM: ["AR", "BR", "CL"],
    EU: ["FR", "GB", "ES", "DE"],
    NA: ["US", "CA"],
    MENA: ["SA", "MA"]
  };
  const poolCountries = regionCountryMap[team.region] || ["AR", "FR", "US"];
  const templates = InitialData.youthTemplates.slice(0, 3);

  templates.forEach((tpl, idx) => {
    const country = poolCountries[idx % poolCountries.length];
    const potBonus = GameState.manager.specialty === "SCOUT" ? 3 : 0;
    const pot = Math.min(99, tpl.potMin + Math.floor(Math.random() * (tpl.potMax - tpl.potMin + 1)) + potBonus);
    const archetype = InitialData.youthArchetypes[idx % InitialData.youthArchetypes.length];

    GameState.academy.push({
      id: `acad_init_${Date.now()}_${idx}`,
      teamId: team.id,
      name: generateUniqueName(),
      country,
      age: tpl.age,
      rank: tpl.rank,
      ovr: tpl.ovr,
      pot,
      archetype,
      role: idx === 0 ? "Striker" : idx === 1 ? "Playmaker" : "Third Man",
      loanedToLeagueId: null,
      loanedToClub: null
    });
  });
}

// FUNCIÓN 1 DE INICIO: UNIRSE A CLUB EXISTENTE (GARANTIZADA)
function startCareerExisting() {
  initBaseDatabase();

  let chosenId = GameState.selectedSetupTeamId;
  if (!chosenId || !GameState.teams.some(t => t.id === chosenId)) {
    chosenId = GameState.teams[0].id;
  }

  GameState.userTeamId = chosenId;
  const userTeam = getUserTeam();

  if (GameState.manager.specialty === "FINANCE" && userTeam) {
    userTeam.budget = Math.round(userTeam.budget * 1.15);
  }

  recordManagerClubJoin(userTeam);
  seedInitialAcademy(userTeam);
  initSwissForCurrentEvent();
  pickNextOpponent();

  addNews(`📢 ${GameState.manager.name} asume oficialmente como Director Deportivo de ${userTeam.name} (${userTeam.region} • ${userTeam.division}).`);
  launchGameScreen();
  saveGame(false);
}

// FUNCIÓN 2 DE INICIO: FUNDAR CLUB PROPIO (GARANTIZADA)
function startCareerCustom() {
  initBaseDatabase();

  const name = (document.getElementById("custom-name")?.value || "La Plata Knights").trim() || "La Plata Knights";
  const tag = ((document.getElementById("custom-tag")?.value || "LPK").trim().toUpperCase().slice(0, 4)) || "LPK";
  const region = document.getElementById("custom-region")?.value || "SAM";
  const division = document.getElementById("custom-division")?.value || "CHALLENGER";
  const shape = document.getElementById("custom-shape")?.value || "shield";
  const pattern = document.getElementById("custom-pattern")?.value || "sash";
  const color1 = document.getElementById("custom-color1")?.value || "#00a8ff";
  const color2 = document.getElementById("custom-color2")?.value || "#ffffff";
  const car = document.getElementById("custom-car")?.value || "Fennec";
  const arena = document.getElementById("custom-arena")?.value || "Champions Field";

  const baseBudget = division === "PRO" ? 520000 : 340000;
  const finalBudget = GameState.manager.specialty === "FINANCE" ? Math.round(baseBudget * 1.15) : baseBudget;
  const baseOvr = division === "PRO" ? 86 : 80;

  const newTeamId = `club_custom_${Date.now()}`;
  const newTeam = {
    id: newTeamId,
    name,
    tag,
    region,
    division,
    budget: finalBudget,
    rep: division === "PRO" ? 86 : 78,
    stars: 0,
    car,
    arena,
    color1,
    color2,
    shape,
    pattern
  };

  GameState.teams.push(newTeam);
  GameState.userTeamId = newTeamId;

  GameState.standings[newTeamId] = {
    teamId: newTeamId,
    points: 0,
    seriesW: 0,
    seriesL: 0,
    mapsW: 0,
    mapsL: 0
  };

  const roles = ["Striker", "Playmaker", "Third Man"];
  for (let i = 0; i < 3; i++) {
    const ovr = baseOvr + (i === 0 ? 2 : i === 1 ? 1 : 0);
    GameState.players.push({
      id: `p_custom_${Date.now()}_${i}`,
      name: generateUniqueName(),
      country: GameState.manager.country,
      age: 18 + i,
      ovr,
      pot: Math.min(97, ovr + 7),
      mec: ovr + 1,
      rot: ovr,
      def: ovr - 1,
      role: roles[i],
      personality: i === 0 ? "Promesa Ambiciosa" : "Trabajador Silencioso",
      contractYears: 3,
      teamId: newTeamId,
      starter: true,
      value: ovr * 2600,
      goals: 0,
      assists: 0,
      saves: 0,
      matches: 0,
      streak: 0,
      stamina: 100
    });
  }

  recordManagerClubJoin(newTeam);
  seedInitialAcademy(newTeam);
  initSwissForCurrentEvent();
  pickNextOpponent();

  addNews(`🏛️ ¡Fundación histórica! ${newTeam.name} [${newTeam.tag}] debuta en ${region} (${division}) bajo el mando de ${GameState.manager.name}.`, "prodigy");
  launchGameScreen();
  saveGame(false);
}

function launchGameScreen() {
  const setup = document.getElementById("setup-screen");
  const game = document.getElementById("game-screen");
  if (setup) setup.classList.remove("active");
  if (game) game.classList.add("active");

  populateEditorTeams();
  refreshAllUI();
}

function saveGame(showAlert = false) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(GameState));
    if (showAlert) {
      addNews("💾 Partida guardada correctamente en el navegador.");
      renderNewsFeed();
    }
  } catch (e) {
    console.error("Error guardando partida:", e);
  }
}

function loadSavedGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const loaded = JSON.parse(raw);
    if (!loaded || !loaded.userTeamId) return;
    GameState = Object.assign(GameState, loaded);
    normalizePlayerCareerFields();
    if (!GameState.currentOpponentId) pickNextOpponent();
    launchGameScreen();
  } catch (e) {
    alert("No se pudo cargar la partida guardada.");
  }
}

function resetCareer() {
  if (!confirm("¿Seguro que querés salir al menú principal? (Asegurate de haber guardado tu progreso)")) return;
  if (LiveMatch.timerInterval) clearInterval(LiveMatch.timerInterval);
  if (LiveMatch.animFrameId) cancelAnimationFrame(LiveMatch.animFrameId);
  LiveMatch.active = false;

  document.getElementById("game-screen")?.classList.remove("active");
  document.getElementById("setup-screen")?.classList.add("active");
  checkExistingSave();
  renderSetupTeams();
}

// ==========================================================================
// 2. NAVEGACIÓN, SELECTORES Y CÁLCULOS DE EQUIPO
// ==========================================================================

function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === tabId);
  });

  if (tabId === "tab-leagues") renderCompetitionView();
  if (tabId === "tab-squad") renderSquadAndCoach();
  if (tabId === "tab-academy") renderAcademy();
  if (tabId === "tab-market") renderMarket();
  if (tabId === "tab-national") renderNationalTab();
  if (tabId === "tab-career") renderCareerTab();
  if (tabId === "tab-awards") renderAwardsAndTrophies();
  if (tabId === "tab-editor") populateEditorTeams();
}

function getUserTeam() {
  return GameState.teams.find(t => t.id === GameState.userTeamId) || GameState.teams[0];
}

function getTeamById(teamId) {
  return GameState.teams.find(t => t.id === teamId) || null;
}

function getTeamRoster(teamId, onlyStarters = false) {
  return GameState.players.filter(p => p.teamId === teamId && (!onlyStarters || p.starter));
}

function getTeamCoach(teamId) {
  return GameState.coaches.find(c => c.teamId === teamId) || null;
}

function getTeamOvr(teamId) {
  let starters = getTeamRoster(teamId, true);
  if (starters.length === 0) {
    starters = getTeamRoster(teamId, false).slice(0, 3);
  }
  if (starters.length === 0) return 75;

  const base = starters.reduce((sum, p) => {
    const streakBonus = (p.streak || 0) >= 3 ? 2 : (p.streak || 0) <= -3 ? -2 : 0;
    const staminaFactor = (p.stamina ?? 100) < 55 ? -2 : 0;
    return sum + p.ovr + streakBonus + staminaFactor;
  }, 0) / starters.length;

  const coach = getTeamCoach(teamId);
  const coachBonus = coach ? Math.max(0, Math.round((coach.ovr - 85) * 0.35)) : 0;
  const chem = getTeamChemistry(teamId);
  const chemBonus = chem >= 90 ? 2 : chem >= 80 ? 1 : 0;

  return Math.min(99, Math.round(base + coachBonus + chemBonus));
}

function getTeamChemistry(teamId) {
  let starters = getTeamRoster(teamId, true);
  if (starters.length === 0) starters = getTeamRoster(teamId, false).slice(0, 3);
  if (starters.length === 0) return 70;

  let chem = 74;

  // Diversidad de roles tácticos (Striker + Playmaker + Third Man)
  const uniqueRoles = new Set(starters.map(p => p.role));
  if (uniqueRoles.size === 3) chem += 10;
  else if (uniqueRoles.size === 2) chem += 5;

  // Misma nacionalidad o región cercana
  const countries = new Set(starters.map(p => p.country));
  if (countries.size === 1) chem += 7;
  else if (countries.size === 2) chem += 3;

  // Líderes natos y coach
  const leaders = starters.filter(p => p.personality === "Líder Nato").length;
  chem += leaders * 3;

  const coach = getTeamCoach(teamId);
  if (coach && coach.specialty.includes("Química")) chem += 6;

  if (teamId === GameState.userTeamId) {
    chem += (GameState.facilities.gamingHouse - 1) * 2;
  }

  return Math.max(50, Math.min(100, chem));
}

function addNews(text, type = "normal") {
  GameState.news.unshift({
    text,
    type,
    stamp: `T${GameState.season} • S${GameState.week}`
  });
  if (GameState.news.length > 45) GameState.news.pop();
}

function formatClock(sec) {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
}

function refreshAllUI() {
  const userTeam = getUserTeam();
  if (!userTeam) return;

  const hudCrest = document.getElementById("hud-crest");
  if (hudCrest) hudCrest.innerHTML = Graphics.renderCrest(userTeam, 48);

  const clubNameEl = document.getElementById("hud-club-name");
  if (clubNameEl) clubNameEl.textContent = `${userTeam.name} [${userTeam.tag}]`;

  const clubSubEl = document.getElementById("hud-club-sub");
  if (clubSubEl) clubSubEl.textContent = `${userTeam.region} • ${userTeam.division} • ${userTeam.arena}`;

  const st = GameState.standings[userTeam.id] || { points: 0 };
  const ovr = getTeamOvr(userTeam.id);
  const chem = getTeamChemistry(userTeam.id);

  document.getElementById("hud-season").textContent = `T${GameState.season} • Sem ${GameState.week}`;
  document.getElementById("hud-budget").textContent = `$${userTeam.budget.toLocaleString()}`;
  document.getElementById("hud-points").textContent = `${st.points} pts`;
  document.getElementById("hud-ovr-chem").textContent = `${ovr} • ${chem}%`;
  document.getElementById("hud-manager").textContent = `${GameState.manager.name} (Nv.${GameState.manager.level})`;

  const currentEvent = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];
  document.getElementById("ticker-meta").textContent = InitialData.metaPatches[GameState.currentMetaIndex % InitialData.metaPatches.length];
  document.getElementById("ticker-event").textContent = `${currentEvent.compName} — ${currentEvent.roundName}`;

  renderMatchCenter();
  renderNewsFeed();
  renderDynamicEventsBanner();
  updateWeeklyPrepUI();
}

function renderMatchCenter() {
  const userTeam = getUserTeam();
  if (!GameState.currentOpponentId) pickNextOpponent();
  const oppTeam = getTeamById(GameState.currentOpponentId) || GameState.teams.find(t => t.id !== userTeam.id);
  const ev = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];

  document.getElementById("match-comp-title").textContent = ev.compName;
  document.getElementById("match-round-title").textContent = `${ev.roundName} • Mejor de ${ev.format === "Bo7" ? "7 (Bo7)" : "5 (Bo5)"}`;
  document.getElementById("match-prize-badge").textContent = `Premio: $${ev.prize.toLocaleString()} (+${ev.points} pts)`;

  const homeCrest = document.getElementById("match-home-crest");
  const awayCrest = document.getElementById("match-away-crest");
  if (homeCrest) {
    homeCrest.innerHTML = Graphics.renderCrest(userTeam, 68);
    homeCrest.onclick = () => openClubDetailModal(userTeam.id);
  }
  if (awayCrest && oppTeam) {
    awayCrest.innerHTML = Graphics.renderCrest(oppTeam, 68);
    awayCrest.onclick = () => openClubDetailModal(oppTeam.id);
  }

  document.getElementById("match-home-name").textContent = userTeam.name;
  document.getElementById("match-home-ovr").textContent = `OVR ${getTeamOvr(userTeam.id)}`;
  document.getElementById("match-away-name").textContent = oppTeam ? oppTeam.name : "Rival";
  document.getElementById("match-away-ovr").textContent = `OVR ${oppTeam ? getTeamOvr(oppTeam.id) : 85}`;
  document.getElementById("match-arena-name").textContent = userTeam.arena;
}

function renderNewsFeed() {
  const feed = document.getElementById("news-feed");
  if (!feed) return;
  feed.innerHTML = GameState.news.map(item => `
    <div class="news-item ${item.type || ""}">
      <small class="muted">[${item.stamp}]</small> ${item.text}
    </div>
  `).join("");
}

function updateWeeklyPrepUI() {
  const status = document.getElementById("prep-status");
  const btns = ["btn-prep-mec", "btn-prep-chem", "btn-prep-rest"];
  if (status) {
    status.textContent = GameState.weeklyPrepUsed ? "Entrenamiento completado" : "Disponible esta semana";
  }
  btns.forEach(id => {
    const b = document.getElementById(id);
    if (b) b.disabled = GameState.weeklyPrepUsed;
  });
}

function doWeeklyPrep(type) {
  if (GameState.weeklyPrepUsed) return;
  const roster = getTeamRoster(GameState.userTeamId, false);
  GameState.weeklyPrepUsed = true;

  if (type === "MEC") {
    roster.forEach(p => {
      p.mec = Math.min(99, p.mec + 1);
      if (Math.random() < 0.45 && p.ovr < p.pot) p.ovr += 1;
    });
    addNews("🎯 Sesión intensiva de mecánicas: tus jugadores mejoraron su control aéreo y definición.");
  } else if (type === "CHEM") {
    roster.forEach(p => {
      p.rot = Math.min(99, p.rot + 1);
      p.streak = Math.min(5, (p.streak || 0) + 1);
    });
    addNews("🤝 Scrims tácticos completados: la rotación y química del equipo subieron.");
  } else if (type === "REST") {
    roster.forEach(p => {
      p.stamina = 100;
    });
    addNews("🔋 Jornada de descanso y fisioterapia: toda la plantilla recuperó el 100% de energía.");
  }

  refreshAllUI();
  saveGame(false);
}

function renderDynamicEventsBanner() {
  const box = document.getElementById("dynamic-events-banner");
  if (!box) return;
  let html = "";

  if (GameState.pendingIncomingOffer) {
    const off = GameState.pendingIncomingOffer;
    html += `
      <div class="event-alert">
        <div>
          <strong>📩 Oferta de Traspaso Recibida:</strong> ${off.buyerName} ofrece <span class="money">$${off.amount.toLocaleString()}</span> por <strong>${off.playerName}</strong> (OVR ${off.ovr}).
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn-success btn-sm" onclick="acceptIncomingOffer()">Aceptar Venta</button>
          <button class="btn-danger-outline btn-sm" onclick="rejectIncomingOffer()">Rechazar</button>
        </div>
      </div>
    `;
  }

  if (GameState.pendingLockerEvent) {
    const ev = GameState.pendingLockerEvent;
    html += `
      <div class="event-alert">
        <div>
          <strong>🎙️ Situación en el Vestuario:</strong> ${ev.text}
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn-primary btn-sm" onclick="resolveLockerEvent('SUPPORT')">Respaldar al Jugador</button>
          <button class="btn-secondary btn-sm" onclick="resolveLockerEvent('DISCIPLINE')">Exigir Disciplina</button>
        </div>
      </div>
    `;
  }

  box.innerHTML = html;
}

function acceptIncomingOffer() {
  const off = GameState.pendingIncomingOffer;
  if (!off) return;
  const player = GameState.players.find(p => p.id === off.playerId);
  const userTeam = getUserTeam();
  if (player && userTeam) {
    userTeam.budget += off.amount;
    player.teamId = off.buyerId;
    player.starter = false;
    addNews(`💸 Venta cerrada: ${player.name} fue transferido a ${off.buyerName} por $${off.amount.toLocaleString()}.`);
  }
  GameState.pendingIncomingOffer = null;
  refreshAllUI();
  saveGame(false);
}

function rejectIncomingOffer() {
  if (GameState.pendingIncomingOffer) {
    addNews(`🛡️ Rechazaste la oferta de ${GameState.pendingIncomingOffer.buyerName} por ${GameState.pendingIncomingOffer.playerName}.`);
  }
  GameState.pendingIncomingOffer = null;
  refreshAllUI();
}

function resolveLockerEvent(choice) {
  const ev = GameState.pendingLockerEvent;
  if (!ev) return;
  const player = GameState.players.find(p => p.id === ev.playerId);
  if (player) {
    if (choice === "SUPPORT") {
      player.streak = Math.min(5, (player.streak || 0) + 2);
      addNews(`🤝 Respaldaste a ${player.name} y respondió entrando en racha positiva.`);
    } else {
      player.rot = Math.min(99, player.rot + 1);
      addNews(`📋 Impusiste disciplina táctica a ${player.name}, mejorando su orden en cancha.`);
    }
  }
  GameState.pendingLockerEvent = null;
  refreshAllUI();
}

/* ==========================================================================
   RL CAREER MANAGER v8.0 — MOTOR PRINCIPAL (js/engine.js) — PARTE 2 DE 4
   Fase Suiza, Llaves Eliminatorias, Ruedas de Prensa, Ceremonia de Campeón,
   Eventos Aleatorios, Cierre de Temporada (Ascensos/Descensos) y Scouting Combine.
   ========================================================================== */

// ==========================================================================
// 3. FASE SUIZA, LLAVES ELIMINATORIAS Y EMPOBRECIMIENTO / EMPAREJAMIENTO
// ==========================================================================

function getEventEligibleTeams(ev) {
  const userTeam = getUserTeam();
  if (!userTeam) return GameState.teams;

  // En Regionales juegan los clubes de tu misma Región y División
  if (ev.compId === "rlcs_regional") {
    const pool = GameState.teams.filter(
      t => t.region === userTeam.region && t.division === userTeam.division
    );
    return pool.length >= 2 ? pool : GameState.teams;
  }

  // En Majors, EWC y Mundial juegan los mejores de Pro Division + tu club
  const proPool = GameState.teams.filter(
    t => t.division === "PRO" || t.id === userTeam.id
  );
  return proPool.length >= 2 ? proPool : GameState.teams;
}

function initSwissForCurrentEvent() {
  const ev = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];
  const pool = getEventEligibleTeams(ev);

  GameState.swiss = {
    compId: ev.compId,
    compName: ev.compName,
    rows: pool.map(t => ({
      teamId: t.id,
      w: 0,
      l: 0,
      diff: 0
    }))
  };
}

function updateSwissStandings(winnerId, loserId, mapDiff = 1) {
  if (!GameState.swiss) initSwissForCurrentEvent();
  const wRow = GameState.swiss.rows.find(r => r.teamId === winnerId);
  const lRow = GameState.swiss.rows.find(r => r.teamId === loserId);

  if (wRow) {
    wRow.w += 1;
    wRow.diff += Math.max(1, mapDiff);
  }
  if (lRow) {
    lRow.l += 1;
    lRow.diff -= Math.max(1, mapDiff);
  }

  // Simular resultados de los demás equipos del grupo suizo
  const otherRows = GameState.swiss.rows.filter(
    r => r.teamId !== winnerId && r.teamId !== loserId
  );
  for (let i = 0; i + 1 < otherRows.length; i += 2) {
    const a = otherRows[i];
    const b = otherRows[i + 1];
    const ovrA = getTeamOvr(a.teamId) + (Math.random() * 8 - 4);
    const ovrB = getTeamOvr(b.teamId) + (Math.random() * 8 - 4);
    if (ovrA >= ovrB) {
      a.w += 1;
      a.diff += 1;
      b.l += 1;
      b.diff -= 1;
    } else {
      b.w += 1;
      b.diff += 1;
      a.l += 1;
      a.diff -= 1;
    }
  }
}

function generateTournamentBracket() {
  const ev = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];
  const userTeam = getUserTeam();
  let pool = getEventEligibleTeams(ev);

  // Ordenar por tabla suiza o puntos RLCS y tomar 8 clasificados
  const sorted = [...pool].sort((a, b) => {
    const sa = GameState.swiss?.rows.find(r => r.teamId === a.id);
    const sb = GameState.swiss?.rows.find(r => r.teamId === b.id);
    if (sa && sb && sb.w !== sa.w) return sb.w - sa.w;
    return (GameState.standings[b.id]?.points || 0) - (GameState.standings[a.id]?.points || 0);
  });

  const top8 = sorted.slice(0, 8);
  while (top8.length < 8) {
    const filler = GameState.teams.find(t => !top8.some(x => x.id === t.id));
    if (!filler) break;
    top8.push(filler);
  }

  // Garantizar que el club del usuario esté en cuartos
  if (userTeam && !top8.some(t => t.id === userTeam.id)) {
    top8[top8.length - 1] = userTeam;
  }

  const qf = [
    { id: "QF1", homeId: top8[0].id, awayId: top8[7].id, homeScore: 0, awayScore: 0, winnerId: null },
    { id: "QF2", homeId: top8[3].id, awayId: top8[4].id, homeScore: 0, awayScore: 0, winnerId: null },
    { id: "QF3", homeId: top8[1].id, awayId: top8[6].id, homeScore: 0, awayScore: 0, winnerId: null },
    { id: "QF4", homeId: top8[2].id, awayId: top8[5].id, homeScore: 0, awayScore: 0, winnerId: null }
  ];

  const sf = [
    { id: "SF1", homeId: null, awayId: null, homeScore: 0, awayScore: 0, winnerId: null },
    { id: "SF2", homeId: null, awayId: null, homeScore: 0, awayScore: 0, winnerId: null }
  ];

  const gf = [
    { id: "GF1", homeId: null, awayId: null, homeScore: 0, awayScore: 0, winnerId: null }
  ];

  GameState.bracket = {
    compId: ev.compId,
    compName: ev.compName,
    qf,
    sf,
    gf
  };
}

function simulateAIMatchInBracket(match) {
  if (!match || match.winnerId || !match.homeId || !match.awayId) return;
  const ovrH = getTeamOvr(match.homeId) + (Math.random() * 8 - 4);
  const ovrA = getTeamOvr(match.awayId) + (Math.random() * 8 - 4);
  if (ovrH >= ovrA) {
    match.homeScore = 4;
    match.awayScore = Math.floor(Math.random() * 4);
    match.winnerId = match.homeId;
  } else {
    match.awayScore = 4;
    match.homeScore = Math.floor(Math.random() * 4);
    match.winnerId = match.awayId;
  }
}

function updateBracketProgress(stageType, userWon, homeMaps, awayMaps) {
  const userTeam = getUserTeam();
  if (!GameState.bracket) generateTournamentBracket();
  const br = GameState.bracket;

  if (stageType === "QF") {
    br.qf.forEach(m => {
      if (m.homeId === userTeam.id || m.awayId === userTeam.id) {
        const isHome = m.homeId === userTeam.id;
        m.homeScore = isHome ? homeMaps : awayMaps;
        m.awayScore = isHome ? awayMaps : homeMaps;
        m.winnerId = userWon ? userTeam.id : (isHome ? m.awayId : m.homeId);
      } else {
        simulateAIMatchInBracket(m);
      }
    });
    br.sf[0].homeId = br.qf[0].winnerId;
    br.sf[0].awayId = br.qf[1].winnerId;
    br.sf[1].homeId = br.qf[2].winnerId;
    br.sf[1].awayId = br.qf[3].winnerId;
  } else if (stageType === "SF") {
    // Asegurar que semifinales tengan equipos asignados
    if (!br.sf[0].homeId) {
      br.qf.forEach(simulateAIMatchInBracket);
      br.sf[0].homeId = br.qf[0].winnerId;
      br.sf[0].awayId = br.qf[1].winnerId;
      br.sf[1].homeId = br.qf[2].winnerId;
      br.sf[1].awayId = br.qf[3].winnerId;
    }
    br.sf.forEach(m => {
      if (m.homeId === userTeam.id || m.awayId === userTeam.id) {
        const isHome = m.homeId === userTeam.id;
        m.homeScore = isHome ? homeMaps : awayMaps;
        m.awayScore = isHome ? awayMaps : homeMaps;
        m.winnerId = userWon ? userTeam.id : (isHome ? m.awayId : m.homeId);
      } else {
        simulateAIMatchInBracket(m);
      }
    });
    br.gf[0].homeId = br.sf[0].winnerId;
    br.gf[0].awayId = br.sf[1].winnerId;
  } else if (stageType === "GF") {
    const finalMatch = br.gf[0];
    if (!finalMatch.homeId) {
      finalMatch.homeId = userTeam.id;
      finalMatch.awayId = GameState.currentOpponentId;
    }
    const isHome = finalMatch.homeId === userTeam.id;
    finalMatch.homeScore = isHome ? homeMaps : awayMaps;
    finalMatch.awayScore = isHome ? awayMaps : homeMaps;
    finalMatch.winnerId = userWon ? userTeam.id : (isHome ? finalMatch.awayId : finalMatch.homeId);
  }
}

function pickNextOpponent() {
  const userTeam = getUserTeam();
  const ev = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];

  // Si estamos en playoffs y ya existe rival en la llave, usarlo
  if (GameState.bracket && ["QF", "SF", "GF"].includes(ev.stageType)) {
    const list = ev.stageType === "QF" ? GameState.bracket.qf
      : ev.stageType === "SF" ? GameState.bracket.sf
      : GameState.bracket.gf;
    const myMatch = list.find(m => m.homeId === userTeam.id || m.awayId === userTeam.id);
    if (myMatch) {
      const opp = myMatch.homeId === userTeam.id ? myMatch.awayId : myMatch.homeId;
      if (opp && opp !== userTeam.id) {
        GameState.currentOpponentId = opp;
        return;
      }
    }
  }

  const eligible = getEventEligibleTeams(ev).filter(t => t.id !== userTeam.id);
  const pool = eligible.length > 0 ? eligible : GameState.teams.filter(t => t.id !== userTeam.id);
  const picked = pool[Math.floor(Math.random() * pool.length)];
  GameState.currentOpponentId = picked ? picked.id : null;
}

// ==========================================================================
// 4. RUEDAS DE PRENSA, CEREMONIA DE CAMPEÓN Y GALA DE FIN DE TEMPORADA
// ==========================================================================

function askPreFinalPressConference(eventName, oppName) {
  const modal = document.getElementById("press-modal");
  const qEl = document.getElementById("press-question");
  if (!modal || !qEl) return;

  qEl.textContent = `Periodista RLCS: "Estás a minutos de disputar la ${eventName} frente a ${oppName}. ¿Cuál es el mensaje para la hinchada y el vestuario?"`;
  modal.classList.remove("hidden");
}

function answerPressConference(tone) {
  const modal = document.getElementById("press-modal");
  if (modal) modal.classList.add("hidden");

  const roster = getTeamRoster(GameState.userTeamId, true);
  if (tone === "CONFIDENT") {
    roster.forEach(p => { p.streak = Math.min(5, (p.streak || 0) + 1); });
    GameState.manager.reputation = Math.min(99, GameState.manager.reputation + 2);
    addNews(`🎙️ Declaración explosiva de ${GameState.manager.name} en la previa: el equipo sale encendido.`);
  } else if (tone === "HUMBLE") {
    roster.forEach(p => { p.rot = Math.min(99, p.rot + 1); });
    addNews(`🎙️ ${GameState.manager.name} pidió humildad y juego colectivo antes de la Gran Final.`);
  } else {
    roster.forEach(p => { p.def = Math.min(99, p.def + 1); });
    addNews(`🎙️ Enfoque táctico de ${GameState.manager.name}: máxima concentración defensiva para la final.`);
  }
  refreshAllUI();
}

function triggerChampionCeremony(ev, championTeam, mvpPlayer) {
  const modal = document.getElementById("champion-modal");
  if (!modal || !championTeam) return;

  const isUser = championTeam.id === GameState.userTeamId;
  const trophySvg = document.getElementById("champ-trophy-svg");
  const titleEl = document.getElementById("champ-title");
  const subEl = document.getElementById("champ-subtitle");
  const mvpEl = document.getElementById("champ-mvp");
  const starBox = document.getElementById("world-star-box");

  if (trophySvg) trophySvg.innerHTML = Graphics.renderTrophy(ev.compId, 76);
  if (titleEl) titleEl.textContent = isUser ? `¡CAMPEONES DE ${ev.compName.toUpperCase()}!` : `${championTeam.name} Campeón`;
  if (subEl) subEl.textContent = `Temporada ${GameState.season} • Gloria absoluta en el escenario RLCS`;
  if (mvpEl) mvpEl.textContent = `MVP DEL TORNEO: ${mvpPlayer ? mvpPlayer.name : "Estrella del Equipo"}`;

  if (isUser) {
    GameState.trophies.push({
      compId: ev.compId,
      compName: ev.compName,
      season: GameState.season,
      mvp: mvpPlayer ? mvpPlayer.name : "Equipo"
    });
    GameState.manager.titlesWon += 1;
    GameState.manager.reputation = Math.min(99, GameState.manager.reputation + 4);
    championTeam.rep = Math.min(99, (championTeam.rep || 85) + 3);
  }

  // Si ganó el Mundial RLCS con su club, habilitar elección de estrella dorada
  if (isUser && ev.compId === "rlcs_worlds" && starBox) {
    GameState.pendingChampionStarTeamId = championTeam.id;
    starBox.classList.remove("hidden");
  } else if (starBox) {
    starBox.classList.add("hidden");
  }

  modal.classList.remove("hidden");
}

function confirmWorldChampionStar() {
  const team = getTeamById(GameState.pendingChampionStarTeamId);
  if (team) {
    team.stars = (team.stars || 0) + 1;
    addNews(`⭐ ¡ORGULLO ETERNO! ${team.name} bordó su estrella mundial #${team.stars} sobre el escudo.`, "prodigy");
  }
  GameState.pendingChampionStarTeamId = null;
  document.getElementById("world-star-box")?.classList.add("hidden");
  refreshAllUI();
  saveGame(false);
}

function closeChampionModal() {
  document.getElementById("champion-modal")?.classList.add("hidden");
  refreshAllUI();
}

function triggerRandomClubEvents() {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  if (!userTeam || roster.length === 0) return;

  // 1. Oferta entrante de club rival por un jugador nuestro (22% chance)
  if (!GameState.pendingIncomingOffer && Math.random() < 0.22) {
    const target = roster[Math.floor(Math.random() * roster.length)];
    const buyers = GameState.teams.filter(t => t.id !== userTeam.id && t.budget >= target.value * 0.9);
    if (target && buyers.length > 0) {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      const offerAmt = Math.round(target.value * (1.08 + Math.random() * 0.22));
      GameState.pendingIncomingOffer = {
        buyerId: buyer.id,
        buyerName: buyer.name,
        playerId: target.id,
        playerName: target.name,
        ovr: target.ovr,
        amount: offerAmt
      };
    }
  }

  // 2. Evento de vestuario (18% chance)
  if (!GameState.pendingLockerEvent && Math.random() < 0.18) {
    const p = roster[Math.floor(Math.random() * roster.length)];
    GameState.pendingLockerEvent = {
      playerId: p.id,
      text: `${p.name} pide mayor protagonismo ofensivo en las rotaciones de esta semana.`
    };
  }

  // 3. Oferta laboral de un gigante internacional si tenemos buena reputación (20% chance)
  if (!GameState.pendingJobOffer && GameState.manager.reputation >= 74 && Math.random() < 0.20) {
    const elites = GameState.teams.filter(t => t.id !== userTeam.id && t.rep >= 88);
    if (elites.length > 0) {
      const club = elites[Math.floor(Math.random() * elites.length)];
      GameState.pendingJobOffer = {
        teamId: club.id,
        teamName: club.name,
        region: club.region,
        division: club.division,
        budget: club.budget
      };
      addNews(`💼 Rumor de oficina: ${club.name} (${club.region}) sondeó a ${GameState.manager.name} para dirigir su proyecto.`);
    }
  }
}

// ==========================================================================
// 5. CIERRE DE TEMPORADA (ASCENSOS, DESCENSOS, BALÓN DE ORO Y PROGRESIÓN)
// ==========================================================================

function handleEndOfSeason() {
  const galaLines = [];
  const userTeam = getUserTeam();

  // 1. Calcular Premios Individuales de la Temporada
  const activePlayers = GameState.players.filter(p => p.teamId);
  const sortedByScore = [...activePlayers].sort((a, b) => {
    const scoreA = a.ovr * 2 + (a.goals || 0) * 3 + (a.assists || 0) * 2 + (a.saves || 0);
    const scoreB = b.ovr * 2 + (b.goals || 0) * 3 + (b.assists || 0) * 2 + (b.saves || 0);
    return scoreB - scoreA;
  });

  const mvpWorld = sortedByScore[0];
  const goldenBoot = [...activePlayers].sort((a, b) => (b.goals || 0) - (a.goals || 0))[0];
  const goldenGlove = [...activePlayers].sort((a, b) => (b.saves || 0) - (a.saves || 0))[0];
  const rookie = [...activePlayers].filter(p => p.age <= 19).sort((a, b) => b.ovr - a.ovr)[0];

  if (mvpWorld) {
    const tName = getTeamById(mvpWorld.teamId)?.name || "Agente Libre";
    galaLines.push(`🏆 <strong>Balón de Oro RLCS (MVP del Año):</strong> ${mvpWorld.name} (${tName}) — OVR ${mvpWorld.ovr}`);
  }
  if (goldenBoot) {
    galaLines.push(`⚽ <strong>Bota de Oro (Máximo Goleador):</strong> ${goldenBoot.name} (${goldenBoot.goals || 0} goles)`);
  }
  if (goldenGlove) {
    galaLines.push(`🧤 <strong>Guante de Oro (Mejor Defensor):</strong> ${goldenGlove.name} (${goldenGlove.saves || 0} atajadas)`);
  }
  if (rookie) {
    galaLines.push(`🌟 <strong>Rookie del Año (Sub-19):</strong> ${rookie.name} (${rookie.age} años • OVR ${rookie.ovr})`);
  }

  GameState.awardsHistory.unshift({
    season: GameState.season,
    mvp: mvpWorld ? mvpWorld.name : "-",
    scorer: goldenBoot ? `${goldenBoot.name} (${goldenBoot.goals || 0})` : "-",
    saver: goldenGlove ? `${goldenGlove.name} (${goldenGlove.saves || 0})` : "-",
    rookie: rookie ? rookie.name : "-"
  });

  // 2. Ascensos y Descensos por Región (PRO <-> CHALLENGER)
  ["EU", "NA", "SAM", "MENA"].forEach(reg => {
    const proTeams = GameState.teams
      .filter(t => t.region === reg && t.division === "PRO")
      .sort((a, b) => (GameState.standings[b.id]?.points || 0) - (GameState.standings[a.id]?.points || 0));

    const chalTeams = GameState.teams
      .filter(t => t.region === reg && t.division === "CHALLENGER")
      .sort((a, b) => (GameState.standings[b.id]?.points || 0) - (GameState.standings[a.id]?.points || 0));

    if (proTeams.length >= 2 && chalTeams.length >= 1) {
      const relegated = proTeams[proTeams.length - 1];
      const promoted = chalTeams[0];
      relegated.division = "CHALLENGER";
      promoted.division = "PRO";
      galaLines.push(`🔄 <strong>${reg}:</strong> ⬆️ Asciende <strong>${promoted.name}</strong> a PRO | ⬇️ Desciende <strong>${relegated.name}</strong> a Challenger.`);
    }
  });

  // 3. Envejecimiento, Progresión Natural y Contratos
  GameState.players.forEach(p => {
    p.age += 1;
    p.goals = 0;
    p.assists = 0;
    p.saves = 0;
    p.matches = 0;
    p.stamina = 100;

    if (p.age <= 21 && p.ovr < p.pot) {
      const gain = Math.random() < 0.75 ? 2 : 1;
      p.ovr = Math.min(p.pot, p.ovr + gain);
      p.mec = Math.min(99, p.mec + gain);
      p.rot = Math.min(99, p.rot + 1);
    } else if (p.age >= 26 && Math.random() < 0.55) {
      p.ovr = Math.max(75, p.ovr - 1);
    }

    if (p.teamId) {
      p.contractYears = Math.max(0, (p.contractYears || 1) - 1);
      if (p.contractYears === 0 && p.teamId !== userTeam.id) {
        p.teamId = null;
        p.starter = false;
      }
    }
  });

  // 4. Salarios de plantilla y reinicio de puntos para nueva temporada
  if (userTeam) {
    const wages = getTeamRoster(userTeam.id, false).length * 22000;
    userTeam.budget = Math.max(50000, userTeam.budget - wages);
    galaLines.push(`💰 <strong>Balance Financiero:</strong> Salarios anuales abonados (-$${wages.toLocaleString()}).`);
  }

  GameState.season += 1;
  GameState.week = 1;
  GameState.scheduleIndex = 0;
  GameState.currentMetaIndex = (GameState.currentMetaIndex + 1) % InitialData.metaPatches.length;

  initStandingsForAllTeams();
  buildNationalTables();
  initSwissForCurrentEvent();
  pickNextOpponent();

  const galaTitle = document.getElementById("gala-title");
  const galaBody = document.getElementById("gala-body");
  const galaModal = document.getElementById("gala-modal");

  if (galaTitle) galaTitle.textContent = `🏆 Gala Oficial Fin de Temporada ${GameState.season - 1}`;
  if (galaBody) {
    galaBody.innerHTML = galaLines.map(line => `<div class="gala-row">${line}</div>`).join("");
  }
  if (galaModal) galaModal.classList.remove("hidden");

  addNews(`🎊 Comienza la Temporada ${GameState.season} de RLCS con nuevo parche competitivo.`);
}

function closeGalaModal() {
  document.getElementById("gala-modal")?.classList.add("hidden");
  refreshAllUI();
  saveGame(false);
}

// ==========================================================================
// 6. SCOUTING COMBINE (DRAFT DE JUVENILES)
// ==========================================================================

function openScoutingCombine() {
  const userTeam = getUserTeam();
  if (!userTeam) return;
  if (userTeam.budget < 25000) {
    alert("Necesitás al menos $25,000 de presupuesto para financiar un Scouting Combine.");
    return;
  }

  userTeam.budget -= 25000;
  const regionCountries = {
    SAM: ["AR", "BR", "CL"],
    EU: ["FR", "GB", "ES", "DE", "NL"],
    NA: ["US", "CA"],
    MENA: ["SA", "MA"]
  };
  const countries = regionCountries[userTeam.region] || ["AR", "FR", "US"];

  GameState.combinePool = [];
  for (let i = 0; i < 4; i++) {
    const tpl = InitialData.youthTemplates[i % InitialData.youthTemplates.length];
    const scoutBonus = GameState.hiredScoutIds.length * 2 + (GameState.manager.specialty === "SCOUT" ? 3 : 0);
    const pot = Math.min(99, tpl.potMin + Math.floor(Math.random() * (tpl.potMax - tpl.potMin + 1)) + scoutBonus);
    const ovr = Math.min(82, tpl.ovr + Math.floor(Math.random() * 4));
    GameState.combinePool.push({
      id: `comb_${Date.now()}_${i}`,
      teamId: userTeam.id,
      name: generateUniqueName(),
      country: countries[Math.floor(Math.random() * countries.length)],
      age: tpl.age,
      rank: tpl.rank,
      ovr,
      pot,
      archetype: InitialData.youthArchetypes[i % InitialData.youthArchetypes.length],
      role: i % 3 === 0 ? "Striker" : i % 3 === 1 ? "Playmaker" : "Third Man",
      loanedToLeagueId: null,
      loanedToClub: null
    });
  }

  const list = document.getElementById("combine-list");
  if (list) {
    list.innerHTML = GameState.combinePool.map((p, idx) => `
      <div class="academy-item">
        <div>
          <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> ${Graphics.renderRankBadge(p.rank)}
          <div class="muted">${p.age} años • ${p.archetype} • Rol: ${p.role}</div>
          <div class="muted">OVR Actual: <strong>${p.ovr}</strong> | Potencial: <strong style="color:#38bdf8;">${p.pot}</strong></div>
        </div>
        <button class="btn-success btn-sm" onclick="draftCombineProspect(${idx})">Fichar a Cantera</button>
      </div>
    `).join("");
  }

  document.getElementById("combine-modal")?.classList.remove("hidden");
  refreshAllUI();
}

function draftCombineProspect(idx) {
  const prospect = GameState.combinePool[idx];
  if (!prospect) return;

  GameState.academy.push(prospect);
  addNews(`🌟 ¡Nuevo talento en la cantera! ${prospect.name} (${prospect.rank}, Potencial ${prospect.pot}) se suma al club.`, "prodigy");
  closeCombineModal();
  renderAcademy();
  saveGame(false);
}

function closeCombineModal() {
  document.getElementById("combine-modal")?.classList.add("hidden");
}

/* ==========================================================================
   RL CAREER MANAGER v8.0 — MOTOR PRINCIPAL (js/engine.js) — PARTE 3 DE 4
   Motor 2D en Vista Aérea (Física Limpia y Estable), Series en Vivo (Bo5/Bo7),
   Reloj RLCS, Tiempo Extra, Jugada 0:00, Simulación Rápida y Cierre de Serie.
   ========================================================================== */

// ==========================================================================
// 7. MOTOR 2D EN VISTA AÉREA (FÍSICA SIMPLE, ESTÉTICA Y CONFIABLE)
// ==========================================================================

function createBoostPads() {
  return [
    { x: 0.14, y: 0.16, big: true, active: true, cooldown: 0 },
    { x: 0.14, y: 0.84, big: true, active: true, cooldown: 0 },
    { x: 0.50, y: 0.12, big: true, active: true, cooldown: 0 },
    { x: 0.50, y: 0.88, big: true, active: true, cooldown: 0 },
    { x: 0.86, y: 0.16, big: true, active: true, cooldown: 0 },
    { x: 0.86, y: 0.84, big: true, active: true, cooldown: 0 },
    { x: 0.32, y: 0.32, big: false, active: true, cooldown: 0 },
    { x: 0.32, y: 0.68, big: false, active: true, cooldown: 0 },
    { x: 0.68, y: 0.32, big: false, active: true, cooldown: 0 },
    { x: 0.68, y: 0.68, big: false, active: true, cooldown: 0 }
  ];
}

function initPitchSimulationState() {
  const homeRoster = getTeamRoster(LiveMatch.homeTeamId, true);
  const awayRoster = getTeamRoster(LiveMatch.awayTeamId, true);

  const homeNames = [
    homeRoster[0]?.name || "Local 1",
    homeRoster[1]?.name || "Local 2",
    homeRoster[2]?.name || "Local 3"
  ];
  const awayNames = [
    awayRoster[0]?.name || "Rival 1",
    awayRoster[1]?.name || "Rival 2",
    awayRoster[2]?.name || "Rival 3"
  ];

  LiveMatch.pitch = {
    ball: { x: 0.5, y: 0.5, vx: 0, vy: 0, lastTouchSide: null, lastTouchPlayer: null },
    homeCars: [
      { id: homeRoster[0]?.id || "h1", name: homeNames[0], role: "Striker", x: 0.34, y: 0.50, vx: 0, vy: 0, angle: 0, boost: 45, speed: 0 },
      { id: homeRoster[1]?.id || "h2", name: homeNames[1], role: "Playmaker", x: 0.24, y: 0.28, vx: 0, vy: 0, angle: 0, boost: 45, speed: 0 },
      { id: homeRoster[2]?.id || "h3", name: homeNames[2], role: "Third Man", x: 0.15, y: 0.65, vx: 0, vy: 0, angle: 0, boost: 45, speed: 0 }
    ],
    awayCars: [
      { id: awayRoster[0]?.id || "a1", name: awayNames[0], role: "Striker", x: 0.66, y: 0.50, vx: 0, vy: 0, angle: Math.PI, boost: 45, speed: 0 },
      { id: awayRoster[1]?.id || "a2", name: awayNames[1], role: "Playmaker", x: 0.76, y: 0.72, vx: 0, vy: 0, angle: Math.PI, boost: 45, speed: 0 },
      { id: awayRoster[2]?.id || "a3", name: awayNames[2], role: "Third Man", x: 0.85, y: 0.35, vx: 0, vy: 0, angle: Math.PI, boost: 45, speed: 0 }
    ],
    boostPads: createBoostPads(),
    goalBannerTimer: 0,
    lastScorerName: "",
    lastScorerSide: "HOME"
  };

  resetPositionsForKickoff();
}

function resetPositionsForKickoff() {
  const p = LiveMatch.pitch;
  if (!p) return;

  p.ball.x = 0.5;
  p.ball.y = 0.5;
  p.ball.vx = 0;
  p.ball.vy = 0;
  p.ball.lastTouchSide = null;

  const hPos = [
    { x: 0.35, y: 0.50, angle: 0 },
    { x: 0.24, y: 0.28, angle: 0.15 },
    { x: 0.13, y: 0.50, angle: 0 }
  ];
  const aPos = [
    { x: 0.65, y: 0.50, angle: Math.PI },
    { x: 0.76, y: 0.72, angle: Math.PI - 0.15 },
    { x: 0.87, y: 0.50, angle: Math.PI }
  ];

  p.homeCars.forEach((c, i) => {
    c.x = hPos[i].x;
    c.y = hPos[i].y;
    c.vx = 0;
    c.vy = 0;
    c.angle = hPos[i].angle;
    c.boost = 45;
  });

  p.awayCars.forEach((c, i) => {
    c.x = aPos[i].x;
    c.y = aPos[i].y;
    c.vx = 0;
    c.vy = 0;
    c.angle = aPos[i].angle;
    c.boost = 45;
  });
}

function renderBoostHud() {
  const bar = document.getElementById("boost-hud-bar");
  const p = LiveMatch.pitch;
  if (!bar || !p) return;

  const homeStr = p.homeCars.map(c => `${c.name}: <strong>${Math.round(c.boost)}%</strong>`).join(" | ");
  const awayStr = p.awayCars.map(c => `${c.name}: <strong>${Math.round(c.boost)}%</strong>`).join(" | ");
  bar.innerHTML = `<span>🔵 ${homeStr}</span><span>🟠 ${awayStr}</span>`;
}

function handleRealGoalScored(scoringSide, scorerCar) {
  const p = LiveMatch.pitch;
  if (!p || p.goalBannerTimer > 0) return;

  const homeTeam = getTeamById(LiveMatch.homeTeamId);
  const awayTeam = getTeamById(LiveMatch.awayTeamId);
  const scorerName = scorerCar?.name || (scoringSide === "HOME" ? homeTeam.tag : awayTeam.tag);

  if (scoringSide === "HOME") {
    LiveMatch.homeGoals += 1;
    const playerObj = GameState.players.find(pl => pl.id === scorerCar?.id);
    if (playerObj) playerObj.goals = (playerObj.goals || 0) + 1;
    // Asistencia aleatoria a otro titular
    const teammates = getTeamRoster(LiveMatch.homeTeamId, true).filter(pl => pl.id !== scorerCar?.id);
    if (teammates.length > 0 && Math.random() < 0.7) {
      const assister = teammates[Math.floor(Math.random() * teammates.length)];
      assister.assists = (assister.assists || 0) + 1;
    }
  } else {
    LiveMatch.awayGoals += 1;
    const playerObj = GameState.players.find(pl => pl.id === scorerCar?.id);
    if (playerObj) playerObj.goals = (playerObj.goals || 0) + 1;
  }

  p.goalBannerTimer = 75; // ~1.25 segundos de celebración visual
  p.lastScorerName = scorerName;
  p.lastScorerSide = scoringSide;

  updateLiveScoreboardUI();
  logLiveEvent(`⚽ <strong>¡GOL DE ${scoringSide === "HOME" ? homeTeam.tag : awayTeam.tag}!</strong> Remate de <strong>${scorerName}</strong> (${formatClock(LiveMatch.secondsLeft)})`);

  // Si estamos en Tiempo Extra, el gol termina el mapa inmediatamente (Gol de Oro)
  if (LiveMatch.isOvertime) {
    setTimeout(() => {
      if (LiveMatch.active) finishCurrentLiveMap();
    }, 850);
  }
}

function stepPitchAnimation() {
  if (!LiveMatch.active || !LiveMatch.pitch) return;

  const p = LiveMatch.pitch;
  const canvas = document.getElementById("rl-pitch-canvas");
  const homeTeam = getTeamById(LiveMatch.homeTeamId);
  const awayTeam = getTeamById(LiveMatch.awayTeamId);

  // Si está activo el cartel de gol, descontar timer y reiniciar saque al terminar
  if (p.goalBannerTimer > 0) {
    p.goalBannerTimer -= 1;
    if (p.goalBannerTimer === 0) {
      resetPositionsForKickoff();
    }
    Graphics.drawPitch2D(canvas, p, homeTeam, awayTeam);
    LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
    return;
  }

  // Pausar movimiento mientras el usuario elige jugada de 0:00
  if (LiveMatch.zeroSecondPending) {
    Graphics.drawPitch2D(canvas, p, homeTeam, awayTeam);
    LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
    return;
  }

  const dt = 0.016 * LiveMatch.speedMultiplier;

  // 1. Regeneración de pads de boost
  p.boostPads.forEach(pad => {
    if (!pad.active) {
      pad.cooldown -= dt;
      if (pad.cooldown <= 0) pad.active = true;
    }
  });

  // 2. Física del balón (movimiento fluido y rebote en paredes)
  const b = p.ball;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.vx *= Math.pow(0.985, LiveMatch.speedMultiplier);
  b.vy *= Math.pow(0.985, LiveMatch.speedMultiplier);

  // Rebote superior e inferior
  if (b.y < 0.08) {
    b.y = 0.08;
    b.vy = Math.abs(b.vy) * 0.85;
  } else if (b.y > 0.92) {
    b.y = 0.92;
    b.vy = -Math.abs(b.vy) * 0.85;
  }

  // Verificar si entró en arco izquierdo (gol visitante) o derecho (gol local)
  const inGoalMouthY = b.y >= 0.34 && b.y <= 0.66;
  if (b.x <= 0.035 && inGoalMouthY) {
    const scorer = p.awayCars.find(c => c.id === b.lastTouchPlayer) || p.awayCars[0];
    handleRealGoalScored("AWAY", scorer);
  } else if (b.x >= 0.965 && inGoalMouthY) {
    const scorer = p.homeCars.find(c => c.id === b.lastTouchPlayer) || p.homeCars[0];
    handleRealGoalScored("HOME", scorer);
  } else {
    // Rebote en paredes laterales fuera del arco
    if (b.x < 0.045) {
      b.x = 0.045;
      b.vx = Math.abs(b.vx) * 0.82;
    } else if (b.x > 0.955) {
      b.x = 0.955;
      b.vx = -Math.abs(b.vx) * 0.82;
    }
  }

  // 3. Movimiento inteligente y limpio de los 6 autos en vista aérea
  const updateTeamCars = (cars, isHome) => {
    const tacticShift = isHome
      ? (LiveMatch.tactic === "AGGRESSIVE" ? 0.08 : LiveMatch.tactic === "DEFENSIVE" ? -0.08 : 0)
      : 0;

    cars.forEach((car, idx) => {
      let targetX = b.x;
      let targetY = b.y;

      if (idx === 0) {
        // Striker: ataca directo al balón con ligero ángulo hacia el arco rival
        targetX = b.x + (isHome ? -0.015 : 0.015);
        targetY = b.y;
      } else if (idx === 1) {
        // Playmaker: acompaña la jugada por el centro-banda
        targetX = Math.max(0.12, Math.min(0.88, b.x + (isHome ? -0.10 + tacticShift : 0.10)));
        targetY = b.y < 0.5 ? Math.min(0.82, b.y + 0.18) : Math.max(0.18, b.y - 0.18);
      } else {
        // Third Man: cubre retaguardia y arco propio
        const baseDefX = isHome ? Math.max(0.09, 0.22 + tacticShift) : 0.78;
        targetX = (baseDefX * 0.7) + (b.x * 0.3);
        targetY = 0.5 + (b.y - 0.5) * 0.45;
      }

      const dx = targetX - car.x;
      const dy = targetY - car.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      const desiredAngle = Math.atan2(dy, dx);

      // Giro suave del auto hacia su objetivo
      let diff = desiredAngle - car.angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      car.angle += diff * Math.min(1, 7.5 * dt);

      // Velocidad con boost si está lejos del balón
      const usingBoost = car.boost > 8 && dist > 0.14;
      const moveSpeed = usingBoost ? 0.34 : 0.23;
      if (usingBoost) {
        car.boost = Math.max(0, car.boost - 14 * dt);
      } else {
        car.boost = Math.min(100, car.boost + 4 * dt);
      }

      car.vx = Math.cos(car.angle) * moveSpeed;
      car.vy = Math.sin(car.angle) * moveSpeed;
      car.speed = moveSpeed * 10;

      car.x = Math.max(0.05, Math.min(0.95, car.x + car.vx * dt));
      car.y = Math.max(0.08, Math.min(0.92, car.y + car.vy * dt));

      // Recoger pads de boost
      p.boostPads.forEach(pad => {
        if (pad.active && Math.hypot(car.x - pad.x, car.y - pad.y) < 0.038) {
          pad.active = false;
          pad.cooldown = pad.big ? 8 : 4;
          car.boost = Math.min(100, car.boost + (pad.big ? 65 : 20));
        }
      });

      // Contacto limpio auto -> balón
      const ballDist = Math.hypot(b.x - car.x, b.y - car.y);
      if (ballDist < 0.036) {
        const goalX = isHome ? 0.98 : 0.02;
        const goalY = 0.5 + (Math.random() * 0.22 - 0.11);
        const shotAngle = Math.atan2(goalY - b.y, goalX - b.x);
        const shotPower = 0.42 + (Math.random() * 0.16);

        b.vx = Math.cos(shotAngle) * shotPower;
        b.vy = Math.sin(shotAngle) * shotPower;
        b.x += Math.cos(shotAngle) * 0.025;
        b.y += Math.sin(shotAngle) * 0.025;
        b.lastTouchSide = isHome ? "HOME" : "AWAY";
        b.lastTouchPlayer = car.id;
      }
    });
  };

  updateTeamCars(p.homeCars, true);
  updateTeamCars(p.awayCars, false);

  // Separación suave entre autos para evitar que se encimen
  const allCars = [...p.homeCars, ...p.awayCars];
  for (let i = 0; i < allCars.length; i++) {
    for (let j = i + 1; j < allCars.length; j++) {
      const c1 = allCars[i];
      const c2 = allCars[j];
      const d = Math.hypot(c2.x - c1.x, c2.y - c1.y);
      if (d > 0 && d < 0.035) {
        const push = (0.035 - d) * 0.5;
        const ang = Math.atan2(c2.y - c1.y, c2.x - c1.x);
        c1.x -= Math.cos(ang) * push;
        c1.y -= Math.sin(ang) * push;
        c2.x += Math.cos(ang) * push;
        c2.y += Math.sin(ang) * push;
      }
    }
  }

  Graphics.drawPitch2D(canvas, p, homeTeam, awayTeam);
  renderBoostHud();

  LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
}

// ==========================================================================
// 8. CONTROL DE SERIES EN VIVO (Bo5 / Bo7) Y RELOJ DE PARTIDO
// ==========================================================================

function startLiveSeries() {
  const userTeam = getUserTeam();
  const oppTeam = getTeamById(GameState.currentOpponentId);
  const ev = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];

  if (!userTeam || !oppTeam) return;

  // Si es una Gran Final, lanzar rueda de prensa previa
  if (ev.isFinal && !LiveMatch.active) {
    askPreFinalPressConference(ev.compName, oppTeam.name);
  }

  LiveMatch.active = true;
  LiveMatch.homeTeamId = userTeam.id;
  LiveMatch.awayTeamId = oppTeam.id;
  LiveMatch.format = ev.format || "Bo5";
  LiveMatch.winsNeeded = ev.format === "Bo7" ? 4 : 3;
  LiveMatch.homeSeries = 0;
  LiveMatch.awaySeries = 0;
  LiveMatch.mapNumber = 1;
  LiveMatch.homeGoals = 0;
  LiveMatch.awayGoals = 0;
  LiveMatch.secondsLeft = 300;
  LiveMatch.isOvertime = false;
  LiveMatch.speedMultiplier = 1;
  LiveMatch.tactic = "BALANCED";
  LiveMatch.timeoutUsed = false;
  LiveMatch.zeroSecondPending = false;

  document.getElementById("pre-match-controls")?.classList.add("hidden");
  document.getElementById("live-match-panel")?.classList.remove("hidden");
  document.getElementById("btn-next-map")?.classList.add("hidden");
  document.getElementById("btn-finish-series")?.classList.add("hidden");
  document.getElementById("btn-skip-map")?.classList.remove("hidden");
  document.getElementById("zero-sec-box")?.classList.add("hidden");

  const logEl = document.getElementById("live-events-log");
  if (logEl) logEl.innerHTML = "";

  const toBtn = document.getElementById("btn-tactical-timeout");
  if (toBtn) toBtn.disabled = false;

  const spdBtn = document.getElementById("btn-speed-toggle");
  if (spdBtn) spdBtn.textContent = "⏩ Velocidad: 1x";

  updateLiveScoreboardUI();
  initPitchSimulationState();
  logLiveEvent(`🏟️ Comienza la serie (${LiveMatch.format}): <strong>${userTeam.name}</strong> vs <strong>${oppTeam.name}</strong> en ${userTeam.arena}.`);

  startLiveMapTimer();
  if (LiveMatch.animFrameId) cancelAnimationFrame(LiveMatch.animFrameId);
  LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
}

function updateLiveScoreboardUI() {
  const homeTeam = getTeamById(LiveMatch.homeTeamId);
  const awayTeam = getTeamById(LiveMatch.awayTeamId);

  document.getElementById("sb-home-tag").textContent = homeTeam ? homeTeam.tag : "HOME";
  document.getElementById("sb-away-tag").textContent = awayTeam ? awayTeam.tag : "AWAY";
  document.getElementById("sb-home-series").textContent = LiveMatch.homeSeries;
  document.getElementById("sb-away-series").textContent = LiveMatch.awaySeries;
  document.getElementById("sb-game-label").textContent = `MAPA ${LiveMatch.mapNumber} (${LiveMatch.format})`;
  document.getElementById("sb-home-goals").textContent = LiveMatch.homeGoals;
  document.getElementById("sb-away-goals").textContent = LiveMatch.awayGoals;
  document.getElementById("sb-clock").textContent = LiveMatch.isOvertime
    ? `+${formatClock(Math.abs(LiveMatch.secondsLeft))} OT`
    : formatClock(LiveMatch.secondsLeft);
}

function toggleClockSpeed() {
  LiveMatch.speedMultiplier = LiveMatch.speedMultiplier === 1 ? 2 : LiveMatch.speedMultiplier === 2 ? 4 : 1;
  const btn = document.getElementById("btn-speed-toggle");
  if (btn) btn.textContent = `⏩ Velocidad: ${LiveMatch.speedMultiplier}x`;
}

function changeLiveTactic(tactic) {
  LiveMatch.tactic = tactic;
  const names = {
    BALANCED: "Equilibrado",
    AGGRESSIVE: "Presión Alta",
    DEFENSIVE: "Cerrojo Defensivo"
  };
  logLiveEvent(`📋 Ajuste táctico en vivo: <strong>${names[tactic] || tactic}</strong>.`);
}

function useTacticalTimeout() {
  if (LiveMatch.timeoutUsed || !LiveMatch.active) return;
  LiveMatch.timeoutUsed = true;
  const btn = document.getElementById("btn-tactical-timeout");
  if (btn) btn.disabled = true;

  if (LiveMatch.pitch) {
    LiveMatch.pitch.homeCars.forEach(c => { c.boost = 100; });
  }
  logLiveEvent(`⏸️ <strong>Tiempo Muerto pedido por ${GameState.manager.name}:</strong> Todo el equipo recarga 100% de boost y ordena la rotación.`);
}

function logLiveEvent(htmlText) {
  const logEl = document.getElementById("live-events-log");
  if (!logEl) return;
  const div = document.createElement("div");
  div.innerHTML = htmlText;
  logEl.prepend(div);
}

function startLiveMapTimer() {
  if (LiveMatch.timerInterval) clearInterval(LiveMatch.timerInterval);

  LiveMatch.timerInterval = setInterval(() => {
    if (!LiveMatch.active || LiveMatch.zeroSecondPending) return;
    if (LiveMatch.pitch && LiveMatch.pitch.goalBannerTimer > 0) return;

    const step = 4 * LiveMatch.speedMultiplier;

    if (!LiveMatch.isOvertime) {
      LiveMatch.secondsLeft -= step;
      if (Math.random() < 0.25) simulateTickEvent();

      if (LiveMatch.secondsLeft <= 0) {
        LiveMatch.secondsLeft = 0;
        updateLiveScoreboardUI();

        // Si van empatados al llegar a 0:00, ofrecer jugada aérea o ir a Tiempo Extra
        if (LiveMatch.homeGoals === LiveMatch.awayGoals) {
          LiveMatch.zeroSecondPending = true;
          document.getElementById("zero-sec-box")?.classList.remove("hidden");
        } else {
          finishCurrentLiveMap();
        }
        return;
      }
    } else {
      // Tiempo Extra (cuenta hacia arriba hasta que caiga un gol)
      LiveMatch.secondsLeft -= step;
      if (Math.random() < 0.35) {
        const homeAdvantage = getTeamOvr(LiveMatch.homeTeamId) >= getTeamOvr(LiveMatch.awayTeamId);
        const side = (Math.random() < (homeAdvantage ? 0.56 : 0.44)) ? "HOME" : "AWAY";
        const cars = side === "HOME" ? LiveMatch.pitch.homeCars : LiveMatch.pitch.awayCars;
        handleRealGoalScored(side, cars[0]);
        return;
      }
    }

    updateLiveScoreboardUI();
  }, 450);
}

function simulateTickEvent() {
  const homeTeam = getTeamById(LiveMatch.homeTeamId);
  const awayTeam = getTeamById(LiveMatch.awayTeamId);
  const hCars = LiveMatch.pitch?.homeCars || [];
  const aCars = LiveMatch.pitch?.awayCars || [];

  const roll = Math.random();
  if (roll < 0.35 && hCars.length > 0) {
    const p = hCars[Math.floor(Math.random() * hCars.length)];
    const pObj = GameState.players.find(pl => pl.id === p.id);
    if (pObj) pObj.saves = (pObj.saves || 0) + 1;
    logLiveEvent(`🧤 Gran atajada de <strong>${p.name}</strong> (${homeTeam.tag}) sobre la línea.`);
  } else if (roll < 0.65 && aCars.length > 0) {
    const p = aCars[Math.floor(Math.random() * aCars.length)];
    logLiveEvent(`⚡ <strong>${p.name}</strong> (${awayTeam.tag}) intenta un double tap que pega en el travesaño.`);
  } else if (hCars.length > 0) {
    const p = hCars[0];
    logLiveEvent(`🚀 <strong>${p.name}</strong> gana el desafío aéreo en mitad de cancha.`);
  }
}

function triggerZeroSecondPlay(choice) {
  LiveMatch.zeroSecondPending = false;
  document.getElementById("zero-sec-box")?.classList.add("hidden");

  const homeCars = LiveMatch.pitch?.homeCars || [];
  const awayCars = LiveMatch.pitch?.awayCars || [];
  const roll = Math.random();

  if (choice === "AIR" && roll < 0.42) {
    logLiveEvent("🔥 <strong>¡INCREÍBLE GOL EN EL SEGUNDO 0:00!</strong> Jugada aérea imposible.");
    handleRealGoalScored("HOME", homeCars[0]);
    setTimeout(() => finishCurrentLiveMap(), 700);
    return;
  } else if (choice === "PASS" && roll < 0.36) {
    logLiveEvent("🎯 <strong>¡PASE DE ÚLTIMO SEGUNDO Y GOL!</strong> Definición quirúrgica en 0:00.");
    handleRealGoalScored("HOME", homeCars[1] || homeCars[0]);
    setTimeout(() => finishCurrentLiveMap(), 700);
    return;
  } else if (roll > 0.84) {
    logLiveEvent("😱 ¡Contraataque rival en el segundo 0:00 y gol agonizante!");
    handleRealGoalScored("AWAY", awayCars[0]);
    setTimeout(() => finishCurrentLiveMap(), 700);
    return;
  }

  // El balón toca el suelo -> Tiempo Extra (Gol de Oro)
  LiveMatch.isOvertime = true;
  LiveMatch.secondsLeft = 0;
  resetPositionsForKickoff();
  updateLiveScoreboardUI();
  logLiveEvent("⏱️ El balón tocó el suelo en 0:00. <strong>¡COMIENZA EL TIEMPO EXTRA (GOL DE ORO)!</strong>");
}

function skipCurrentLiveMap() {
  if (!LiveMatch.active) return;

  const ovrH = getTeamOvr(LiveMatch.homeTeamId) + (LiveMatch.tactic === "AGGRESSIVE" ? 1 : 0);
  const ovrA = getTeamOvr(LiveMatch.awayTeamId);

  if (LiveMatch.homeGoals === LiveMatch.awayGoals) {
    const winChance = Math.max(0.25, Math.min(0.78, 0.5 + (ovrH - ovrA) * 0.03));
    if (Math.random() < winChance) {
      LiveMatch.homeGoals += 1;
    } else {
      LiveMatch.awayGoals += 1;
    }
  }
  finishCurrentLiveMap();
}

function finishCurrentLiveMap() {
  if (LiveMatch.timerInterval) clearInterval(LiveMatch.timerInterval);
  LiveMatch.zeroSecondPending = false;
  document.getElementById("zero-sec-box")?.classList.add("hidden");

  const homeTeam = getTeamById(LiveMatch.homeTeamId);
  const awayTeam = getTeamById(LiveMatch.awayTeamId);
  const homeWonMap = LiveMatch.homeGoals > LiveMatch.awayGoals;

  if (homeWonMap) {
    LiveMatch.homeSeries += 1;
    logLiveEvent(`✅ <strong>Mapa ${LiveMatch.mapNumber} para ${homeTeam.name}</strong> (${LiveMatch.homeGoals} - ${LiveMatch.awayGoals}).`);
  } else {
    LiveMatch.awaySeries += 1;
    logLiveEvent(`❌ <strong>Mapa ${LiveMatch.mapNumber} para ${awayTeam.name}</strong> (${LiveMatch.homeGoals} - ${LiveMatch.awayGoals}).`);
  }

  updateLiveScoreboardUI();

  const seriesOver = LiveMatch.homeSeries >= LiveMatch.winsNeeded || LiveMatch.awaySeries >= LiveMatch.winsNeeded;

  document.getElementById("btn-skip-map")?.classList.add("hidden");
  if (seriesOver) {
    document.getElementById("btn-next-map")?.classList.add("hidden");
    document.getElementById("btn-finish-series")?.classList.remove("hidden");
    logLiveEvent(`🏁 <strong>SERIE FINALIZADA: ${homeTeam.tag} ${LiveMatch.homeSeries} - ${LiveMatch.awaySeries} ${awayTeam.tag}</strong>`);
  } else {
    document.getElementById("btn-next-map")?.classList.remove("hidden");
  }
}

function startNextLiveMap() {
  LiveMatch.mapNumber += 1;
  LiveMatch.homeGoals = 0;
  LiveMatch.awayGoals = 0;
  LiveMatch.secondsLeft = 300;
  LiveMatch.isOvertime = false;
  LiveMatch.zeroSecondPending = false;

  document.getElementById("btn-next-map")?.classList.add("hidden");
  document.getElementById("btn-skip-map")?.classList.remove("hidden");

  resetPositionsForKickoff();
  updateLiveScoreboardUI();
  logLiveEvent(`▶️ Comienza el <strong>Mapa ${LiveMatch.mapNumber}</strong>.`);
  startLiveMapTimer();
}

function closeLiveSeries() {
  const userWon = LiveMatch.homeSeries > LiveMatch.awaySeries;
  const hMaps = LiveMatch.homeSeries;
  const aMaps = LiveMatch.awaySeries;

  if (LiveMatch.timerInterval) clearInterval(LiveMatch.timerInterval);
  if (LiveMatch.animFrameId) cancelAnimationFrame(LiveMatch.animFrameId);
  LiveMatch.active = false;

  document.getElementById("live-match-panel")?.classList.add("hidden");
  document.getElementById("pre-match-controls")?.classList.remove("hidden");

  finalizeSeriesResult(userWon, hMaps, aMaps);
}

// ==========================================================================
// 9. SIMULACIÓN RÁPIDA Y CIERRE OFICIAL DE SERIE
// ==========================================================================

function simulateSeriesInstant() {
  const userTeam = getUserTeam();
  const oppTeam = getTeamById(GameState.currentOpponentId);
  const ev = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];
  if (!userTeam || !oppTeam) return;

  const winsNeeded = ev.format === "Bo7" ? 4 : 3;
  const tacticBonus = GameState.manager.specialty === "TACTIC" ? 3 : 0;
  const ovrH = getTeamOvr(userTeam.id) + tacticBonus;
  const ovrA = getTeamOvr(oppTeam.id);

  const mapWinProb = Math.max(0.22, Math.min(0.82, 0.5 + (ovrH - ovrA) * 0.032));
  let hMaps = 0;
  let aMaps = 0;

  while (hMaps < winsNeeded && aMaps < winsNeeded) {
    if (Math.random() < mapWinProb) hMaps += 1;
    else aMaps += 1;
  }

  // Registrar estadísticas individuales básicas de la serie simulada
  const starters = getTeamRoster(userTeam.id, true);
  starters.forEach(p => {
    p.matches = (p.matches || 0) + (hMaps + aMaps);
    p.goals = (p.goals || 0) + Math.floor(Math.random() * 4);
    p.assists = (p.assists || 0) + Math.floor(Math.random() * 3);
    p.saves = (p.saves || 0) + Math.floor(Math.random() * 4);
  });

  finalizeSeriesResult(hMaps > aMaps, hMaps, aMaps);
}

function finalizeSeriesResult(userWon, hMaps, aMaps) {
  const userTeam = getUserTeam();
  const oppTeam = getTeamById(GameState.currentOpponentId);
  const ev = InitialData.seasonSchedule[GameState.scheduleIndex] || InitialData.seasonSchedule[0];

  if (!userTeam || !oppTeam || !ev) return;

  const userSt = GameState.standings[userTeam.id];
  const oppSt = GameState.standings[oppTeam.id];

  // Actualizar tabla de posiciones
  if (userWon) {
    userSt.seriesW += 1;
    userSt.points += ev.points;
    oppSt.seriesL += 1;
    oppSt.points += Math.round(ev.points * 0.25);
    userTeam.budget += ev.prize;
    GameState.manager.xp += 35;
    if (GameState.manager.xp >= GameState.manager.level * 100) {
      GameState.manager.level += 1;
      GameState.manager.xp = 0;
    }

    // Bonus de Sponsor activo
    const sp = GameState.sponsors.find(s => s.id === GameState.activeSponsorId);
    if (sp) {
      let bonus = 0;
      if (sp.type === "CHEM" && getTeamChemistry(userTeam.id) >= 88) bonus = 20000;
      if (sp.type === "PLAYOFF" && ["QF", "SF", "GF"].includes(ev.stageType)) bonus = 15000;
      if (sp.type === "LAN" && ev.isFinal && ev.compId !== "rlcs_regional") bonus = 55000;
      if (sp.type === "TITLE" && ev.isFinal) bonus = 30000;
      if (bonus > 0) {
        userTeam.budget += bonus;
        addNews(`🤝 Bonus de patrocinador (${sp.name}): +$${bonus.toLocaleString()} acreditados al club.`);
      }
    }

    addNews(`✅ Victoria de <strong>${userTeam.name}</strong> (${hMaps}-${aMaps}) ante ${oppTeam.name} en ${ev.roundName}. (+$${ev.prize.toLocaleString()} | +${ev.points} pts)`);
  } else {
    userSt.seriesL += 1;
    userSt.points += Math.round(ev.points * 0.25);
    oppSt.seriesW += 1;
    oppSt.points += ev.points;
    userTeam.budget += Math.round(ev.prize * 0.35);

    addNews(`❌ Derrota de <strong>${userTeam.name}</strong> (${hMaps}-${aMaps}) frente a ${oppTeam.name} en ${ev.roundName}.`);
  }

  userSt.mapsW += hMaps;
  userSt.mapsL += aMaps;
  oppSt.mapsW += aMaps;
  oppSt.mapsL += hMaps;

  // Actualizar fatiga y racha de titulares
  const starters = getTeamRoster(userTeam.id, true);
  starters.forEach(p => {
    p.stamina = Math.max(45, (p.stamina ?? 100) - 9);
    p.streak = userWon
      ? Math.min(5, (p.streak || 0) + 1)
      : Math.max(-5, (p.streak || 0) - 1);
  });

  // Simular resultados de la jornada para los otros clubes de la liga
  const otherTeams = GameState.teams.filter(t => t.id !== userTeam.id && t.id !== oppTeam.id);
  for (let i = 0; i + 1 < otherTeams.length; i += 2) {
    const t1 = otherTeams[i];
    const t2 = otherTeams[i + 1];
    const s1 = GameState.standings[t1.id];
    const s2 = GameState.standings[t2.id];
    if (!s1 || !s2) continue;

    if (getTeamOvr(t1.id) + (Math.random() * 8 - 4) >= getTeamOvr(t2.id)) {
      s1.seriesW += 1;
      s1.points += ev.points;
      s2.seriesL += 1;
      s2.points += Math.round(ev.points * 0.25);
    } else {
      s2.seriesW += 1;
      s2.points += ev.points;
      s1.seriesL += 1;
      s1.points += Math.round(ev.points * 0.25);
    }
  }

  // Actualizar Fase Suiza o Llave Eliminatoria
  if (ev.stageType === "SWISS" || ev.stageType === "SWISS_END") {
    updateSwissStandings(userWon ? userTeam.id : oppTeam.id, userWon ? oppTeam.id : userTeam.id, Math.abs(hMaps - aMaps));
    if (ev.stageType === "SWISS_END") {
      generateTournamentBracket();
    }
  } else if (["QF", "SF", "GF"].includes(ev.stageType)) {
    updateBracketProgress(ev.stageType, userWon, hMaps, aMaps);
  }

  // Si era la Gran Final del torneo, disparar ceremonia de campeón
  if (ev.isFinal) {
    const champTeam = userWon ? userTeam : oppTeam;
    const champRoster = getTeamRoster(champTeam.id, true);
    const mvp = [...champRoster].sort((a, b) => b.ovr - a.ovr)[0];
    triggerChampionCeremony(ev, champTeam, mvp);
    GameState.bracket = null;
    GameState.swiss = null;
  }

  // Avanzar semana, academias, ligas nacionales y mercado IA
  GameState.week += 1;
  GameState.weeklyPrepUsed = false;
  advanceYouthAcademies();
  simulateNationalLeaguesMatchday();
  runAIManagement();
  triggerRandomClubEvents();

  // Avanzar al siguiente evento del calendario o cerrar temporada
  GameState.scheduleIndex += 1;
  if (GameState.scheduleIndex >= InitialData.seasonSchedule.length) {
    handleEndOfSeason();
  } else {
    const nextEv = InitialData.seasonSchedule[GameState.scheduleIndex];
    if (nextEv.stageType === "SWISS" && !GameState.swiss) {
      initSwissForCurrentEvent();
    }
    pickNextOpponent();
  }

  refreshAllUI();
  saveGame(false);
}

/* ==========================================================================
   RL CAREER MANAGER v8.0 — MOTOR PRINCIPAL (js/engine.js) — PARTE 4 DE 4
   Ligas & Club Hub, Ficha de Club/Jugador, Plantilla, Cantera, Cesiones,
   Mercado/Intercambios, FIFAe, Carrera/Instalaciones, Vitrina, Editor e IA.
   ========================================================================== */

// ==========================================================================
// 10. LIGAS, TABLAS REGIONALES, LLAVES Y LIGAS NACIONALES (ACCESO DIRECTO)
// ==========================================================================

function selectCompView(mode) {
  GameState.compViewMode = mode || "USER_LEAGUE";
  document.querySelectorAll(".comp-pill").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.comp === GameState.compViewMode);
  });
  renderCompetitionView();
}

function renderDivisionTableHtml(region, division, title) {
  const userTeam = getUserTeam();
  const teams = GameState.teams
    .filter(t => t.region === region && t.division === division)
    .sort((a, b) => (GameState.standings[b.id]?.points || 0) - (GameState.standings[a.id]?.points || 0));

  if (teams.length === 0) return "";

  const rows = teams.map((t, idx) => {
    const st = GameState.standings[t.id] || { points: 0, seriesW: 0, seriesL: 0, mapsW: 0, mapsL: 0 };
    const isUser = userTeam && t.id === userTeam.id;
    let zoneBadge = "";
    if (division === "PRO" && idx < 2) zoneBadge = `<span class="badge" style="color:#38bdf8;">Major</span>`;
    if (division === "PRO" && idx === teams.length - 1 && teams.length >= 2) zoneBadge = `<span class="badge" style="color:#ef4444;">Descenso</span>`;
    if (division === "CHALLENGER" && idx === 0) zoneBadge = `<span class="badge" style="color:#10b981;">Ascenso</span>`;

    return `
      <tr class="${isUser ? "user-row" : ""}">
        <td><strong>#${idx + 1}</strong></td>
        <td style="display:flex; align-items:center; gap:8px;">
          ${Graphics.renderCrest(t, 28)}
          <span class="clickable-link" onclick="openClubDetailModal('${t.id}')">${t.name}</span>
          ${zoneBadge}
        </td>
        <td>${getTeamOvr(t.id)}</td>
        <td>${st.seriesW}G - ${st.seriesL}P</td>
        <td>${st.mapsW} - ${st.mapsL}</td>
        <td><strong>${st.points} pts</strong></td>
      </tr>
    `;
  }).join("");

  return `
    <div style="margin-bottom:18px;">
      <h4 style="margin-bottom:6px; color:var(--primary);">${title}</h4>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Club</th>
            <th>OVR</th>
            <th>Series</th>
            <th>Mapas</th>
            <th>Puntos RLCS</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderBracketHtml(br) {
  if (!br) return `<p class="muted">Las llaves eliminatorias se generan automáticamente al cerrar la Fase Suiza.</p>`;
  const userId = GameState.userTeamId;

  const renderMatchCard = (m) => {
    const h = getTeamById(m.homeId);
    const a = getTeamById(m.awayId);
    const isUser = m.homeId === userId || m.awayId === userId;
    return `
      <div class="bracket-match ${isUser ? "user-match" : ""}">
        <div class="b-row">
          <span>${h ? h.name : "Por definir"}</span>
          <strong>${m.winnerId ? m.homeScore : "-"}</strong>
        </div>
        <div class="b-row">
          <span>${a ? a.name : "Por definir"}</span>
          <strong>${m.winnerId ? m.awayScore : "-"}</strong>
        </div>
      </div>
    `;
  };

  return `
    <h4 style="margin:14px 0 6px;">⚔️ Cuadro de Playoffs — ${br.compName}</h4>
    <div class="bracket-container">
      <div class="bracket-round">
        <h4>Cuartos de Final</h4>
        ${br.qf.map(renderMatchCard).join("")}
      </div>
      <div class="bracket-round">
        <h4>Semifinales</h4>
        ${br.sf.map(renderMatchCard).join("")}
      </div>
      <div class="bracket-round">
        <h4>Gran Final</h4>
        ${br.gf.map(renderMatchCard).join("")}
      </div>
    </div>
  `;
}

function renderCompetitionView() {
  const container = document.getElementById("comp-view-content");
  if (!container) return;
  const userTeam = getUserTeam();
  const mode = GameState.compViewMode || "USER_LEAGUE";

  if (mode === "NATIONAL") {
    const blocks = GameState.nationalLeagues.map(lg => {
      const table = [...(GameState.nationalTables[lg.id] || [])].sort((a, b) => b.pts - a.pts);
      const rows = table.map((row, idx) => `
        <tr>
          <td>#${idx + 1}</td>
          <td><strong>${row.clubName}</strong></td>
          <td>${row.pj}</td>
          <td>${row.pg}G - ${row.pp}P</td>
          <td><strong>${row.pts} pts</strong></td>
        </tr>
      `).join("");
      return `
        <div style="margin-bottom:18px;">
          <h4>${Graphics.getFlag(lg.country)} ${lg.name}</h4>
          <table>
            <thead><tr><th>Pos</th><th>Club Nacional</th><th>PJ</th><th>Record</th><th>Pts</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    }).join("");
    container.innerHTML = blocks;
    return;
  }

  const targetRegion = mode === "USER_LEAGUE" ? (userTeam?.region || "SAM") : mode;
  const regionNames = {
    EU: "🇪🇺 Europa (RLCS EU)",
    NA: "🇺🇸 Norteamérica (RLCS NA)",
    SAM: "🌎 Sudamérica (RLCS SAM)",
    MENA: "🏜️ Medio Oriente & Norte de África (RLCS MENA)"
  };

  let html = `<h3 style="margin-bottom:12px;">${regionNames[targetRegion] || targetRegion}</h3>`;
  html += renderDivisionTableHtml(targetRegion, "PRO", "🏆 Primera División — RLCS Pro Division");
  html += renderDivisionTableHtml(targetRegion, "CHALLENGER", "⚔️ Segunda División — RLCS Challenger League");

  if (mode === "USER_LEAGUE") {
    if (GameState.swiss && GameState.swiss.rows.length > 0) {
      const swissRows = [...GameState.swiss.rows]
        .sort((a, b) => b.w - a.w || b.diff - a.diff)
        .map((r, i) => {
          const t = getTeamById(r.teamId);
          return `
            <tr class="${r.teamId === userTeam.id ? "user-row" : ""}">
              <td>#${i + 1}</td>
              <td>${t ? t.name : r.teamId}</td>
              <td><strong>${r.w} - ${r.l}</strong></td>
              <td>${r.diff >= 0 ? "+" + r.diff : r.diff}</td>
            </tr>
          `;
        }).join("");
      html += `
        <div style="margin-top:16px;">
          <h4>📊 Clasificación Fase Suiza Actual (${GameState.swiss.compName})</h4>
          <table>
            <thead><tr><th>Pos</th><th>Equipo</th><th>Record (G-P)</th><th>Dif. Mapas</th></tr></thead>
            <tbody>${swissRows}</tbody>
          </table>
        </div>
      `;
    }
    html += renderBracketHtml(GameState.bracket);
  }

  container.innerHTML = html;
}

// ==========================================================================
// 11. FICHAS INTERACTIVAS DE CLUB Y JUGADOR
// ==========================================================================

function openClubDetailModal(teamId) {
  const team = getTeamById(teamId);
  const body = document.getElementById("club-detail-body");
  const modal = document.getElementById("club-detail-modal");
  if (!team || !body || !modal) return;

  const roster = getTeamRoster(team.id, false);
  const coach = getTeamCoach(team.id);

  body.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; margin-bottom:14px;">
      ${Graphics.renderCrest(team, 72)}
      <div>
        <h2>${team.name} [${team.tag}]</h2>
        <div>${Graphics.renderDivisionBadge(team.division)} • ${team.region} • Arena: <strong>${team.arena}</strong></div>
        <div class="muted" style="margin-top:4px;">Auto Oficial: <strong>${team.car}</strong> • Presupuesto: <span class="money">$${team.budget.toLocaleString()}</span> • Estrellas Mundiales: <strong>${team.stars || 0} ⭐</strong></div>
      </div>
    </div>
    <h4 style="margin-bottom:8px;">🚗 Plantilla Oficial (OVR Equipo: ${getTeamOvr(team.id)} | Química: ${getTeamChemistry(team.id)}%)</h4>
    <table>
      <thead><tr><th>Jugador</th><th>Rol</th><th>Edad</th><th>OVR</th><th>POT</th><th>Contrato</th></tr></thead>
      <tbody>
        ${roster.map(p => `
          <tr>
            <td>${Graphics.getFlag(p.country)} <span class="clickable-link" onclick="closeClubDetailModal(); openPlayerDetailModal('${p.id}')">${p.name}</span> ${p.starter ? "⭐" : ""}</td>
            <td>${p.role}</td>
            <td>${p.age}</td>
            <td><strong>${p.ovr}</strong></td>
            <td>${p.pot}</td>
            <td>${p.contractYears} año(s)</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <p style="margin-top:12px;" class="muted">🧠 Head Coach: <strong>${coach ? `${coach.name} (OVR ${coach.ovr} — ${coach.specialty})` : "Sin entrenador asignado"}</strong></p>
  `;

  modal.classList.remove("hidden");
}

function closeClubDetailModal() {
  document.getElementById("club-detail-modal")?.classList.add("hidden");
}

function openPlayerDetailModal(playerId) {
  const p = GameState.players.find(pl => pl.id === playerId);
  const body = document.getElementById("player-detail-body");
  const modal = document.getElementById("player-detail-modal");
  if (!p || !body || !modal) return;

  const club = p.teamId ? getTeamById(p.teamId) : null;
  body.innerHTML = `
    <h3>${Graphics.getFlag(p.country)} ${p.name} — OVR ${p.ovr} (POT ${p.pot})</h3>
    <p class="muted" style="margin:4px 0 12px;">Club: <strong>${club ? club.name : "Agente Libre"}</strong> • Edad: ${p.age} años • Rol: <strong>${p.role}</strong> • Personalidad: ${p.personality}</p>
    <div class="neg-box">
      <div>⚡ Mecánicas: <strong>${p.mec}</strong> | 🔄 Rotación: <strong>${p.rot}</strong> | 🛡️ Defensa: <strong>${p.def}</strong></div>
      <div style="margin-top:6px;">💰 Valor de Mercado: <span class="money">$${p.value.toLocaleString()}</span> • Contrato: ${p.contractYears} temporada(s)</div>
      <div style="margin-top:6px;">📊 Temporada Actual: <strong>${p.goals || 0}</strong> Goles • <strong>${p.assists || 0}</strong> Asistencias • <strong>${p.saves || 0}</strong> Atajadas</div>
    </div>
  `;
  modal.classList.remove("hidden");
}

function closePlayerDetailModal() {
  document.getElementById("player-detail-modal")?.classList.add("hidden");
}

// ==========================================================================
// 12. PLANTILLA, TITULARES, RENOVACIONES Y CUERPO TÉCNICO
// ==========================================================================

function renderSquadAndCoach() {
  const userTeam = getUserTeam();
  const grid = document.getElementById("squad-grid");
  const coachBox = document.getElementById("current-coach-box");
  if (!userTeam || !grid) return;

  const roster = getTeamRoster(userTeam.id, false);
  const startersCount = roster.filter(p => p.starter).length;
  const chem = getTeamChemistry(userTeam.id);

  document.getElementById("squad-chemistry-info").textContent = `Química activa: ${chem}% • OVR Colectivo: ${getTeamOvr(userTeam.id)}`;
  document.getElementById("squad-count-badge").textContent = `${startersCount} / 3 Titulares`;

  grid.innerHTML = roster.map(p => {
    const stam = p.stamina ?? 100;
    const stamColor = stam > 70 ? "#10b981" : stam > 45 ? "#f59e0b" : "#ef4444";
    const renewCost = Math.round(p.value * 0.18);

    return `
      <div class="player-card ${p.starter ? "starter" : ""}">
        <div class="player-top">
          <strong class="clickable-link" onclick="openPlayerDetailModal('${p.id}')">${Graphics.getFlag(p.country)} ${p.name}</strong>
          <span class="ovr-pill">${p.ovr}</span>
        </div>
        <div class="muted">${p.role} • ${p.age} años • POT ${p.pot} ${(p.streak || 0) >= 3 ? '<span class="fire-tag">ON FIRE</span>' : ""}</div>
        <div class="stats-mini">
          <span>MEC ${p.mec}</span>
          <span>ROT ${p.rot}</span>
          <span>DEF ${p.def}</span>
        </div>
        <div class="stamina-bar-bg"><div class="stamina-bar-fill" style="width:${stam}%; background:${stamColor};"></div></div>
        <div class="muted" style="margin-bottom:8px;">Energía: ${stam}% • Contrato: ${p.contractYears} año(s)</div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="${p.starter ? "btn-success" : "btn-secondary"} btn-sm" onclick="toggleStarter('${p.id}')">
            ${p.starter ? "⭐ Titular" : "Suplente"}
          </button>
          <button class="btn-outline btn-sm" onclick="renewPlayerContract('${p.id}')">
            ✍️ Renovar ($${(renewCost / 1000).toFixed(0)}k)
          </button>
          <button class="btn-danger-outline btn-sm" onclick="releasePlayer('${p.id}')">Liberar</button>
        </div>
      </div>
    `;
  }).join("");

  if (coachBox) {
    const coach = getTeamCoach(userTeam.id);
    if (coach) {
      coachBox.innerHTML = `
        <div class="academy-item">
          <div>
            <strong>${Graphics.getFlag(coach.country)} ${coach.name}</strong> — OVR <strong>${coach.ovr}</strong>
            <div class="muted">${coach.specialty}</div>
          </div>
          <span class="badge">Activo en el Banquillo</span>
        </div>
      `;
    } else {
      coachBox.innerHTML = `<p class="muted">No tenés Head Coach contratado. Podés fichar uno en la pestaña <strong>Mercado &amp; Sponsors</strong>.</p>`;
    }
  }
}

function toggleStarter(playerId) {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  const target = roster.find(p => p.id === playerId);
  if (!target) return;

  if (target.starter) {
    if (roster.filter(p => p.starter).length <= 3 && roster.length <= 3) {
      alert("Necesitás mantener 3 titulares activos en cancha.");
      return;
    }
    target.starter = false;
  } else {
    const currentStarters = roster.filter(p => p.starter);
    if (currentStarters.length >= 3) {
      currentStarters[currentStarters.length - 1].starter = false;
    }
    target.starter = true;
  }
  renderSquadAndCoach();
  refreshAllUI();
}

function renewPlayerContract(playerId) {
  const userTeam = getUserTeam();
  const p = GameState.players.find(pl => pl.id === playerId);
  if (!userTeam || !p) return;

  const cost = Math.round(p.value * 0.18);
  if (userTeam.budget < cost) {
    alert("Presupuesto insuficiente para renovar este contrato.");
    return;
  }
  userTeam.budget -= cost;
  p.contractYears = (p.contractYears || 1) + 2;
  addNews(`✍️ ${p.name} renovó su contrato con ${userTeam.name} por 2 temporadas más (-$${cost.toLocaleString()}).`);
  renderSquadAndCoach();
  refreshAllUI();
  saveGame(false);
}

function releasePlayer(playerId) {
  const userTeam = getUserTeam();
  const roster = getTeamRoster(userTeam.id, false);
  if (roster.length <= 3) {
    alert("No podés quedarte con menos de 3 jugadores en la plantilla.");
    return;
  }
  const p = roster.find(pl => pl.id === playerId);
  if (!p) return;
  p.teamId = null;
  p.starter = false;
  addNews(`📤 ${p.name} rescindió su vínculo con ${userTeam.name} y pasa a ser Agente Libre.`);
  renderSquadAndCoach();
  refreshAllUI();
}

// ==========================================================================
// 13. CANTERA, OJEADORES Y CESIONES A LIGAS NACIONALES
// ==========================================================================

function generateUniqueName() {
  const prefix = InitialData.newgenPrefixes[Math.floor(Math.random() * InitialData.newgenPrefixes.length)];
  const suffix = Math.floor(10 + Math.random() * 89);
  return `${prefix}${suffix}`;
}

function advanceYouthAcademies() {
  const userTeam = getUserTeam();
  const coach = getTeamCoach(userTeam.id);
  const coachBoost = coach && coach.specialty.includes("Formador") ? 1.5 : 1;
  const facilityBoost = 1 + (GameState.facilities.academyCenter - 1) * 0.25;

  GameState.academy.forEach(y => {
    const loanMultiplier = y.loanedToLeagueId ? 1.45 : 1;
    const chance = 0.24 * coachBoost * facilityBoost * loanMultiplier;
    if (y.ovr < y.pot && Math.random() < chance) {
      y.ovr += 1;
    }
  });
}

function hireScout(scoutId) {
  const userTeam = getUserTeam();
  const sc = GameState.scouts.find(s => s.id === scoutId);
  if (!userTeam || !sc || GameState.hiredScoutIds.includes(scoutId)) return;

  if (userTeam.budget < sc.cost) {
    alert("Presupuesto insuficiente para contratar este ojeador.");
    return;
  }
  userTeam.budget -= sc.cost;
  GameState.hiredScoutIds.push(scoutId);
  addNews(`🔭 Contrataste a: ${sc.name}. Tu red de detección juvenil mejoró.`);
  renderAcademy();
  refreshAllUI();
}

function renderAcademy() {
  const userTeam = getUserTeam();
  const list = document.getElementById("academy-list");
  const scoutsList = document.getElementById("scouts-list");
  const rivalList = document.getElementById("rival-academy-list");
  if (!userTeam || !list) return;

  const myYouth = GameState.academy.filter(y => y.teamId === userTeam.id);

  if (myYouth.length === 0) {
    list.innerHTML = `<p class="muted">Tu academia está vacía. Usá el botón <strong>Scouting Combine</strong> para reclutar jóvenes promesas.</p>`;
  } else {
    list.innerHTML = myYouth.map(y => {
      const loanTag = y.loanedToClub ? `<span class="badge" style="color:#10b981;">Cedido: ${y.loanedToClub}</span>` : "";
      return `
        <div class="academy-item">
          <div>
            <strong>${Graphics.getFlag(y.country)} ${y.name}</strong> ${Graphics.renderRankBadge(y.rank)} ${loanTag}
            <div class="muted">${y.age} años • ${y.archetype} • OVR <strong>${y.ovr}</strong> / POT <strong>${y.pot}</strong></div>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn-success btn-sm" onclick="promoteProspect('${y.id}')">⬆️ Subir al 1er Equipo</button>
            ${y.loanedToLeagueId
              ? `<button class="btn-warning btn-sm" onclick="recallProspectLoan('${y.id}')">↩️ Repescar</button>`
              : `<button class="btn-outline btn-sm" onclick="loanProspectToLeague('${y.id}')">✈️ Ceder a Liga</button>`}
            <button class="btn-danger-outline btn-sm" onclick="sellYouthProspect('${y.id}')">💰 Vender ($${Math.round(y.ovr * 900 / 1000)}k)</button>
          </div>
        </div>
      `;
    }).join("");
  }

  if (scoutsList) {
    scoutsList.innerHTML = GameState.scouts.map(sc => {
      const hired = GameState.hiredScoutIds.includes(sc.id);
      return `
        <div class="academy-item">
          <div>
            <strong>${sc.name}</strong>
            <div class="muted">${sc.desc}</div>
          </div>
          ${hired
            ? `<span class="badge" style="color:#10b981;">Contratado</span>`
            : `<button class="btn-primary btn-sm" onclick="hireScout('${sc.id}')">Contratar ($${(sc.cost / 1000).toFixed(0)}k)</button>`}
        </div>
      `;
    }).join("");
  }

  if (rivalList) {
    const sampleRivals = [
      { id: "ry_1", name: "kuxirJr", country: "IT", rank: "SSL", ovr: 78, pot: 95, club: "Vitality Academy", price: 95000 },
      { id: "ry_2", name: "NexoSAM", country: "AR", rank: "GC3", ovr: 76, pot: 93, club: "FURIA Academy", price: 80000 }
    ];
    rivalList.innerHTML = sampleRivals.map(r => `
      <div class="academy-item">
        <div>
          <strong>${Graphics.getFlag(r.country)} ${r.name}</strong> ${Graphics.renderRankBadge(r.rank)}
          <div class="muted">${r.club} • OVR ${r.ovr} / POT ${r.pot}</div>
        </div>
        <button class="btn-outline btn-sm" onclick="buyRivalProspect('${r.name}', '${r.country}', '${r.rank}', ${r.ovr}, ${r.pot}, ${r.price})">
          Fichar ($${r.price / 1000}k)
        </button>
      </div>
    `).join("");
  }
}

function loanProspectToLeague(youthId) {
  const y = GameState.academy.find(item => item.id === youthId);
  if (!y) return;
  const lg = GameState.nationalLeagues[Math.floor(Math.random() * GameState.nationalLeagues.length)];
  const club = lg.clubs[Math.floor(Math.random() * lg.clubs.length)];
  y.loanedToLeagueId = lg.id;
  y.loanedToClub = club;
  addNews(`✈️ Cesión juvenil: ${y.name} fue cedido a ${club} (${lg.name}) para ganar experiencia competitiva.`, "loan");
  renderAcademy();
}

function recallProspectLoan(youthId) {
  const y = GameState.academy.find(item => item.id === youthId);
  if (!y) return;
  addNews(`↩️ ${y.name} regresó de su cesión en ${y.loanedToClub} con OVR ${y.ovr}.`);
  y.loanedToLeagueId = null;
  y.loanedToClub = null;
  renderAcademy();
}

function promoteProspect(youthId) {
  const idx = GameState.academy.findIndex(item => item.id === youthId);
  if (idx === -1) return;
  const y = GameState.academy[idx];
  const userTeam = getUserTeam();

  GameState.players.push({
    id: `p_grad_${Date.now()}`,
    name: y.name,
    country: y.country,
    age: Math.max(15, y.age),
    ovr: y.ovr,
    pot: y.pot,
    mec: y.ovr + 2,
    rot: y.ovr - 1,
    def: y.ovr - 1,
    role: y.role || "Striker",
    personality: "Promesa Ambiciosa",
    contractYears: 3,
    teamId: userTeam.id,
    starter: false,
    value: y.ovr * 2400,
    goals: 0,
    assists: 0,
    saves: 0,
    matches: 0,
    streak: 1,
    stamina: 100
  });

  GameState.academy.splice(idx, 1);
  addNews(`🎓 ¡Ascenso de Cantera! ${y.name} (OVR ${y.ovr}, POT ${y.pot}) firmó contrato profesional con el primer equipo.`, "prodigy");
  renderAcademy();
  refreshAllUI();
}

function sellYouthProspect(youthId) {
  const idx = GameState.academy.findIndex(item => item.id === youthId);
  if (idx === -1) return;
  const y = GameState.academy[idx];
  const userTeam = getUserTeam();
  const fee = Math.round(y.ovr * 900);

  userTeam.budget += fee;
  GameState.academy.splice(idx, 1);
  addNews(`💰 Venta de juvenil: traspasaste a ${y.name} por $${fee.toLocaleString()}.`);
  renderAcademy();
  refreshAllUI();
}

function buyRivalProspect(name, country, rank, ovr, pot, price) {
  const userTeam = getUserTeam();
  if (userTeam.budget < price) {
    alert("Presupuesto insuficiente para fichar esta promesa.");
    return;
  }
  userTeam.budget -= price;
  GameState.academy.push({
    id: `acad_buy_${Date.now()}`,
    teamId: userTeam.id,
    name,
    country,
    age: 15,
    rank,
    ovr,
    pot,
    archetype: "Freestyler Mecánico",
    role: "Striker",
    loanedToLeagueId: null,
    loanedToClub: null
  });
  addNews(`🌟 ¡Fichaje juvenil! Incorporaste a ${name} (${rank}) a la academia por $${price.toLocaleString()}.`, "prodigy");
  renderAcademy();
  refreshAllUI();
}

// ==========================================================================
// 14. MERCADO DE FICHAJES, NEGOCIACIÓN / INTERCAMBIOS, COACHES Y SPONSORS
// ==========================================================================

function renderMarket() {
  const userTeam = getUserTeam();
  const filter = document.getElementById("market-filter")?.value || "ALL";
  const pList = document.getElementById("market-players-list");
  const cList = document.getElementById("market-coaches-list");
  const sList = document.getElementById("sponsors-list");
  if (!userTeam || !pList) return;

  const candidates = GameState.players
    .filter(p => p.teamId !== userTeam.id)
    .filter(p => {
      if (filter === "FA") return !p.teamId;
      if (filter === "CLUB") return !!p.teamId;
      return true;
    })
    .sort((a, b) => b.ovr - a.ovr);

  pList.innerHTML = candidates.map(p => {
    const club = p.teamId ? getTeamById(p.teamId) : null;
    return `
      <div class="market-item">
        <div>
          <strong class="clickable-link" onclick="openPlayerDetailModal('${p.id}')">${Graphics.getFlag(p.country)} ${p.name}</strong>
          <span class="ovr-pill" style="margin-left:6px;">${p.ovr}</span>
          <div class="muted">${p.role} • ${p.age} años • ${club ? club.name : "Agente Libre"} • Valor: <span class="money">$${p.value.toLocaleString()}</span></div>
        </div>
        <button class="btn-primary btn-sm" onclick="openNegotiationModal('${p.id}')">Negociar</button>
      </div>
    `;
  }).join("");

  if (cList) {
    cList.innerHTML = GameState.coaches
      .filter(c => c.teamId !== userTeam.id)
      .map(c => `
        <div class="market-item">
          <div>
            <strong>${Graphics.getFlag(c.country)} ${c.name}</strong> (OVR ${c.ovr})
            <div class="muted">${c.specialty} • Costo: <span class="money">$${c.salary.toLocaleString()}</span></div>
          </div>
          <button class="btn-outline btn-sm" onclick="hireCoach('${c.id}')">Contratar</button>
        </div>
      `).join("");
  }

  if (sList) {
    sList.innerHTML = GameState.sponsors.map(sp => {
      const isActive = GameState.activeSponsorId === sp.id;
      return `
        <div class="market-item">
          <div>
            <strong>${sp.name}</strong> (Adelanto: <span class="money">+$${sp.upfront.toLocaleString()}</span>)
            <div class="muted">${sp.bonusDesc}</div>
          </div>
          ${isActive
            ? `<span class="badge" style="color:#10b981;">Sponsor Activo</span>`
            : `<button class="btn-success btn-sm" onclick="signSponsor('${sp.id}')">Firmar</button>`}
        </div>
      `;
    }).join("");
  }
}

function openNegotiationModal(playerId) {
  const p = GameState.players.find(pl => pl.id === playerId);
  const userTeam = getUserTeam();
  if (!p || !userTeam) return;

  GameState.negotiatingPlayerId = playerId;
  const club = p.teamId ? getTeamById(p.teamId) : null;

  document.getElementById("neg-title").textContent = club ? `Negociar Traspaso con ${club.name}` : `Firmar Agente Libre: ${p.name}`;
  document.getElementById("neg-player-info").innerHTML = `
    <strong>${Graphics.getFlag(p.country)} ${p.name}</strong> • OVR <strong>${p.ovr}</strong> (POT ${p.pot}) • Rol: ${p.role}<br/>
    Valor estimado: <span class="money">$${p.value.toLocaleString()}</span> • Tu presupuesto: <span class="money">$${userTeam.budget.toLocaleString()}</span>
  `;

  const offerInput = document.getElementById("neg-offer-amount");
  if (offerInput) offerInput.value = club ? p.value : Math.round(p.value * 0.45);

  const tradeSel = document.getElementById("neg-trade-player");
  if (tradeSel) {
    const myPlayers = getTeamRoster(userTeam.id, false);
    tradeSel.innerHTML = `<option value="">-- Solo Dinero --</option>` +
      myPlayers.map(mp => `<option value="${mp.id}">${mp.name} (OVR ${mp.ovr} • Val $${(mp.value / 1000).toFixed(0)}k)</option>`).join("");
  }

  document.getElementById("neg-feedback")?.classList.add("hidden");
  document.getElementById("negotiation-modal")?.classList.remove("hidden");
}

function closeNegotiationModal() {
  document.getElementById("negotiation-modal")?.classList.add("hidden");
  GameState.negotiatingPlayerId = null;
}

function submitTransferOffer() {
  const p = GameState.players.find(pl => pl.id === GameState.negotiatingPlayerId);
  const userTeam = getUserTeam();
  if (!p || !userTeam) return;

  const cash = Math.max(0, Number(document.getElementById("neg-offer-amount")?.value) || 0);
  const tradeId = document.getElementById("neg-trade-player")?.value || "";
  const years = Number(document.getElementById("neg-years")?.value) || 2;
  const feedback = document.getElementById("neg-feedback");

  if (cash > userTeam.budget) {
    if (feedback) {
      feedback.textContent = "No tenés suficiente presupuesto en caja para cubrir esa oferta en efectivo.";
      feedback.classList.remove("hidden");
    }
    return;
  }

  const tradePlayer = tradeId ? GameState.players.find(pl => pl.id === tradeId) : null;
  if (tradePlayer && getTeamRoster(userTeam.id, false).length <= 3 && !p.teamId) {
    if (feedback) {
      feedback.textContent = "No podés entregar un jugador si te quedarías con menos de 3 en plantilla.";
      feedback.classList.remove("hidden");
    }
    return;
  }

  const totalOfferValue = cash + (tradePlayer ? Math.round(tradePlayer.value * 0.9) : 0);
  const requiredValue = p.teamId ? Math.round(p.value * 0.95) : Math.round(p.value * 0.4);

  if (totalOfferValue < requiredValue) {
    if (feedback) {
      feedback.textContent = `Oferta rechazada. Se requiere un paquete cercano a $${requiredValue.toLocaleString()}.`;
      feedback.classList.remove("hidden");
    }
    return;
  }

  const oldTeamId = p.teamId;
  userTeam.budget -= cash;
  if (oldTeamId) {
    const seller = getTeamById(oldTeamId);
    if (seller) seller.budget += cash;
  }

  if (tradePlayer) {
    tradePlayer.teamId = oldTeamId || null;
    tradePlayer.starter = false;
  }

  p.teamId = userTeam.id;
  p.contractYears = years;
  p.starter = getTeamRoster(userTeam.id, true).length < 3;

  addNews(`🚨 ¡BOMBAZO DE MERCADO! ${userTeam.name} ficha a ${p.name} (OVR ${p.ovr})${tradePlayer ? ` en intercambio por ${tradePlayer.name}` : ""}.`, "prodigy");
  closeNegotiationModal();
  renderMarket();
  refreshAllUI();
  saveGame(false);
}

function hireCoach(coachId) {
  const userTeam = getUserTeam();
  const c = GameState.coaches.find(item => item.id === coachId);
  if (!userTeam || !c) return;

  if (userTeam.budget < c.salary) {
    alert("Presupuesto insuficiente para contratar a este Head Coach.");
    return;
  }

  GameState.coaches.forEach(item => {
    if (item.teamId === userTeam.id) item.teamId = null;
  });

  userTeam.budget -= c.salary;
  c.teamId = userTeam.id;
  addNews(`🧠 ${c.name} (OVR ${c.ovr}) es el nuevo Head Coach de ${userTeam.name}.`);
  renderMarket();
  refreshAllUI();
}

function signSponsor(sponsorId) {
  const userTeam = getUserTeam();
  const sp = GameState.sponsors.find(s => s.id === sponsorId);
  if (!userTeam || !sp) return;

  GameState.activeSponsorId = sp.id;
  userTeam.budget += sp.upfront;
  addNews(`🤝 Acuerdo comercial: ${userTeam.name} firmó con ${sp.name} (+$${sp.upfront.toLocaleString()} de adelanto).`);
  renderMarket();
  refreshAllUI();
}

// ==========================================================================
// 15. SELECCIÓN NACIONAL FIFAe, CARRERA, VITRINA, EDITOR E IA
// ==========================================================================

function acceptNationalOffer(code) {
  GameState.manager.nationalTeamCode = code;
  const fed = InitialData.federations.find(f => f.code === code);
  addNews(`🌍 ${GameState.manager.name} asumió como Seleccionador Nacional de ${fed ? fed.name : code} rumbo al Mundial FIFAe.`);
  renderNationalTab();
}

function renderNationalTab() {
  const container = document.getElementById("national-content");
  const badge = document.getElementById("national-status-badge");
  if (!container) return;

  const code = GameState.manager.nationalTeamCode;
  if (!code) {
    if (badge) badge.textContent = "Sin Selección";
    container.innerHTML = `
      <div class="squad-grid">
        ${InitialData.federations.map(f => `
          <div class="player-card">
            <h4>${Graphics.getFlag(f.code)} ${f.name}</h4>
            <p class="muted" style="margin:6px 0;">Reputación mínima sugerida: ${f.minRep}</p>
            <button class="btn-primary btn-sm" onclick="acceptNationalOffer('${f.code}')">Aceptar Cargo Nacional</button>
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  const fed = InitialData.federations.find(f => f.code === code);
  if (badge) badge.textContent = `${Graphics.getFlag(code)} ${fed ? fed.name : code}`;

  const pool = GameState.players
    .filter(p => p.country === code)
    .sort((a, b) => b.ovr - a.ovr)
    .slice(0, 6);

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
      <h4>Convocatoria Oficial — ${Graphics.getFlag(code)} ${fed ? fed.name : code}</h4>
      <button class="btn-danger-outline btn-sm" onclick="GameState.manager.nationalTeamCode = null; renderNationalTab();">Renunciar a la Selección</button>
    </div>
    <div class="squad-grid">
      ${pool.map((p, i) => `
        <div class="player-card ${i < 3 ? "starter" : ""}">
          <div class="player-top">
            <strong>${p.name}</strong>
            <span class="ovr-pill">${p.ovr}</span>
          </div>
          <div class="muted">${i < 3 ? "⭐ Titular FIFAe" : "Reserva Nacional"} • ${p.role}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCareerTab() {
  const container = document.getElementById("career-content");
  const userTeam = getUserTeam();
  if (!container || !userTeam) return;

  const fac = GameState.facilities;
  const costGH = fac.gamingHouse * 90000;
  const costAC = fac.academyCenter * 85000;

  let jobHtml = "";
  if (GameState.pendingJobOffer) {
    const jo = GameState.pendingJobOffer;
    jobHtml = `
      <div class="event-alert">
        <div><strong>💼 Oferta de Trabajo Recibida:</strong> ${jo.teamName} (${jo.region} • ${jo.division}) te ofrece ser su nuevo Director Deportivo.</div>
        <button class="btn-warning btn-sm" onclick="acceptJobOffer()">Aceptar y Cambiar de Club</button>
      </div>
    `;
  }

  container.innerHTML = `
    ${jobHtml}
    <div class="grid-2">
      <div class="card">
        <h3>👔 Trayectoria de ${GameState.manager.name}</h3>
        <p class="muted" style="margin:6px 0 12px;">Nivel ${GameState.manager.level} • Reputación: <strong>${GameState.manager.reputation}</strong> • Títulos: <strong>${GameState.manager.titlesWon}</strong></p>
        <table>
          <thead><tr><th>Temp.</th><th>Club</th><th>Región</th><th>División</th></tr></thead>
          <tbody>
            ${GameState.manager.history.map(h => `
              <tr><td>T${h.season}</td><td><strong>${h.clubName}</strong></td><td>${h.region}</td><td>${h.division}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3>🏢 Infraestructura de ${userTeam.name}</h3>
        <div class="academy-list" style="margin-top:10px;">
          <div class="academy-item">
            <div>
              <strong>🏠 Gaming House (Nivel ${fac.gamingHouse})</strong>
              <div class="muted">Aumenta la química base del equipo (+2% por nivel)</div>
            </div>
            <button class="btn-primary btn-sm" onclick="upgradeFacility('gamingHouse', ${costGH})">Mejorar ($${costGH / 1000}k)</button>
          </div>
          <div class="academy-item">
            <div>
              <strong>🌱 Centro de Alto Rendimiento Juvenil (Nivel ${fac.academyCenter})</strong>
              <div class="muted">Acelera el crecimiento semanal de la cantera</div>
            </div>
            <button class="btn-primary btn-sm" onclick="upgradeFacility('academyCenter', ${costAC})">Mejorar ($${costAC / 1000}k)</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function upgradeFacility(key, cost) {
  const userTeam = getUserTeam();
  if (!userTeam || userTeam.budget < cost) {
    alert("Presupuesto insuficiente para mejorar esta instalación.");
    return;
  }
  userTeam.budget -= cost;
  GameState.facilities[key] += 1;
  addNews(`🏗️ Infraestructura mejorada: ${key === "gamingHouse" ? "Gaming House" : "Centro Juvenil"} subió a Nivel ${GameState.facilities[key]}.`);
  renderCareerTab();
  refreshAllUI();
}

function acceptJobOffer() {
  const jo = GameState.pendingJobOffer;
  if (!jo) return;
  GameState.userTeamId = jo.teamId;
  GameState.pendingJobOffer = null;
  const newClub = getUserTeam();
  recordManagerClubJoin(newClub);
  initSwissForCurrentEvent();
  pickNextOpponent();
  addNews(`🔁 ¡Cambio de aires! ${GameState.manager.name} firmó como nuevo Mánager de ${newClub.name}.`, "prodigy");
  refreshAllUI();
  renderCareerTab();
}

function renderAwardsAndTrophies() {
  const container = document.getElementById("awards-content");
  if (!container) return;

  const grouped = {};
  GameState.trophies.forEach(tr => {
    if (!grouped[tr.compName]) grouped[tr.compName] = { compId: tr.compId, count: 0 };
    grouped[tr.compName].count += 1;
  });

  const trophyCards = Object.entries(grouped).map(([name, info]) => `
    <div class="trophy-item">
      <span class="trophy-count-badge">x${info.count}</span>
      ${Graphics.renderTrophy(info.compId, 58)}
      <div style="font-size:0.78rem; font-weight:700; margin-top:6px;">${name}</div>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="grid-2">
      <div class="card">
        <h3>🏆 Vitrina de Trofeos del Club</h3>
        <div class="trophy-cabinet">
          ${trophyCards || `<p class="muted">Todavía no ganaste trofeos. ¡Conquistá Regionales, Majors o el Mundial!</p>`}
        </div>
      </div>
      <div class="card">
        <h3>🏅 Historial Balón de Oro &amp; Premios Anuales</h3>
        <div class="academy-list" style="margin-top:10px;">
          ${GameState.awardsHistory.length === 0
            ? `<p class="muted">Los premios individuales se entregan al finalizar cada temporada.</p>`
            : GameState.awardsHistory.map(a => `
              <div class="award-card">
                <strong>Temporada ${a.season}</strong><br/>
                🏆 Balón de Oro: <strong>${a.mvp}</strong> | ⚽ Bota de Oro: <strong>${a.scorer}</strong><br/>
                🧤 Guante de Oro: <strong>${a.saver}</strong> | 🌟 Rookie: <strong>${a.rookie}</strong>
              </div>
            `).join("")}
        </div>
      </div>
    </div>
  `;
}

function populateEditorTeams() {
  const sel = document.getElementById("ed-team");
  if (!sel) return;
  sel.innerHTML = `<option value="">Agente Libre</option>` +
    GameState.teams.map(t => `<option value="${t.id}" ${t.id === GameState.userTeamId ? "selected" : ""}>${t.name} (${t.region})</option>`).join("");
}

function createCustomPerson() {
  const type = document.getElementById("ed-type")?.value || "PLAYER";
  const name = (document.getElementById("ed-name")?.value || "").trim();
  const country = document.getElementById("ed-country")?.value || "AR";
  const age = Math.max(14, Math.min(35, Number(document.getElementById("ed-age")?.value) || 18));
  const ovr = Math.max(65, Math.min(99, Number(document.getElementById("ed-ovr")?.value) || 88));
  const pot = Math.max(ovr, Math.min(99, Number(document.getElementById("ed-pot")?.value) || 94));
  const role = document.getElementById("ed-role")?.value || "Striker";
  const teamId = document.getElementById("ed-team")?.value || null;

  if (!name) {
    alert("Ingresá un nombre o nick válido.");
    return;
  }

  if (type === "COACH") {
    GameState.coaches.push({
      id: `c_ed_${Date.now()}`,
      name,
      country,
      ovr,
      specialty: "Estratega LAN (+4% en Majors/Mundiales)",
      teamId,
      salary: ovr * 900
    });
  } else {
    GameState.players.push({
      id: `p_ed_${Date.now()}`,
      name,
      country,
      age,
      ovr,
      pot,
      mec: ovr,
      rot: ovr,
      def: ovr,
      role,
      personality: "Superestrella",
      contractYears: 3,
      teamId,
      starter: teamId ? getTeamRoster(teamId, true).length < 3 : false,
      value: ovr * 3200,
      goals: 0,
      assists: 0,
      saves: 0,
      matches: 0,
      streak: 0,
      stamina: 100
    });
  }

  addNews(`✏️ Editor: ${name} (OVR ${ovr}) fue añadido a la base de datos.`);
  document.getElementById("ed-name").value = "";
  refreshAllUI();
  saveGame(false);
}

function runAIManagement() {
  // Fichajes automáticos de clubes IA que tengan menos de 3 jugadores
  GameState.teams.forEach(t => {
    if (t.id === GameState.userTeamId) return;
    const roster = getTeamRoster(t.id, false);
    if (roster.length < 3) {
      const fa = GameState.players.find(p => !p.teamId);
      if (fa) {
        fa.teamId = t.id;
        fa.starter = true;
        fa.contractYears = 2;
      }
    }
  });
}

function simulateNationalLeaguesMatchday() {
  GameState.nationalLeagues.forEach(lg => {
    const table = GameState.nationalTables[lg.id];
    if (!table || table.length < 2) return;
    for (let i = 0; i + 1 < table.length; i += 2) {
      const a = table[i];
      const b = table[i + 1];
      a.pj += 1;
      b.pj += 1;
      if (Math.random() < 0.5) {
        a.pg += 1;
        a.pts += 3;
        b.pp += 1;
      } else {
        b.pg += 1;
        b.pts += 3;
        a.pp += 1;
      }
    }
  });
}

/* ==========================================================================
   ZONA DE PARCHES — js/engine.js
   (Pegar siempre los nuevos parches debajo de esta línea)
   ========================================================================== */

// PARCHE #1: Cancha 2D sin trabas en paredes, nombres reales y freno al terminar mapa
function initPitchSimulationState() {
  let homeRoster = getTeamRoster(LiveMatch.homeTeamId, true);
  if (homeRoster.length < 3) homeRoster = getTeamRoster(LiveMatch.homeTeamId, false).slice(0, 3);

  let awayRoster = getTeamRoster(LiveMatch.awayTeamId, true);
  if (awayRoster.length < 3) awayRoster = getTeamRoster(LiveMatch.awayTeamId, false).slice(0, 3);

  const homeNames = [
    homeRoster[0]?.name || "Local 1",
    homeRoster[1]?.name || "Local 2",
    homeRoster[2]?.name || "Local 3"
  ];
  const awayNames = [
    awayRoster[0]?.name || "Visitante 1",
    awayRoster[1]?.name || "Visitante 2",
    awayRoster[2]?.name || "Visitante 3"
  ];

  LiveMatch.pitch = {
    ball: { x: 0.5, y: 0.5, vx: 0, vy: 0, lastTouchSide: null, lastTouchPlayer: null },
    homeCars: [
      { id: homeRoster[0]?.id || "h1", name: homeNames[0], role: "Striker", x: 0.34, y: 0.50, vx: 0, vy: 0, angle: 0, boost: 45, speed: 0 },
      { id: homeRoster[1]?.id || "h2", name: homeNames[1], role: "Playmaker", x: 0.24, y: 0.28, vx: 0, vy: 0, angle: 0, boost: 45, speed: 0 },
      { id: homeRoster[2]?.id || "h3", name: homeNames[2], role: "Third Man", x: 0.15, y: 0.65, vx: 0, vy: 0, angle: 0, boost: 45, speed: 0 }
    ],
    awayCars: [
      { id: awayRoster[0]?.id || "a1", name: awayNames[0], role: "Striker", x: 0.66, y: 0.50, vx: 0, vy: 0, angle: Math.PI, boost: 45, speed: 0 },
      { id: awayRoster[1]?.id || "a2", name: awayNames[1], role: "Playmaker", x: 0.76, y: 0.72, vx: 0, vy: 0, angle: Math.PI, boost: 45, speed: 0 },
      { id: awayRoster[2]?.id || "a3", name: awayNames[2], role: "Third Man", x: 0.85, y: 0.35, vx: 0, vy: 0, angle: Math.PI, boost: 45, speed: 0 }
    ],
    boostPads: createBoostPads(),
    goalBannerTimer: 0,
    lastScorerName: "",
    lastScorerSide: "HOME"
  };

  resetPositionsForKickoff();
}

function stepPitchAnimation() {
  if (!LiveMatch.active || !LiveMatch.pitch) return;

  const p = LiveMatch.pitch;
  const canvas = document.getElementById("rl-pitch-canvas");
  const homeTeam = getTeamById(LiveMatch.homeTeamId);
  const awayTeam = getTeamById(LiveMatch.awayTeamId);

  // Congelar animación si el mapa ya terminó
  const mapEnded = !document.getElementById("btn-next-map")?.classList.contains("hidden") ||
                   !document.getElementById("btn-finish-series")?.classList.contains("hidden");
  if (mapEnded) {
    Graphics.drawPitch2D(canvas, p, homeTeam, awayTeam);
    LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
    return;
  }

  if (p.goalBannerTimer > 0) {
    p.goalBannerTimer -= 1;
    if (p.goalBannerTimer === 0) resetPositionsForKickoff();
    Graphics.drawPitch2D(canvas, p, homeTeam, awayTeam);
    LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
    return;
  }

  if (LiveMatch.zeroSecondPending) {
    Graphics.drawPitch2D(canvas, p, homeTeam, awayTeam);
    LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
    return;
  }

  const dt = 0.016 * LiveMatch.speedMultiplier;

  p.boostPads.forEach(pad => {
    if (!pad.active) {
      pad.cooldown -= dt;
      if (pad.cooldown <= 0) pad.active = true;
    }
  });

  const b = p.ball;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.vx *= Math.pow(0.985, LiveMatch.speedMultiplier);
  b.vy *= Math.pow(0.985, LiveMatch.speedMultiplier);

  if (b.y < 0.09) {
    b.y = 0.09;
    b.vy = Math.abs(b.vy) * 0.85 + 0.08;
  } else if (b.y > 0.91) {
    b.y = 0.91;
    b.vy = -Math.abs(b.vy) * 0.85 - 0.08;
  }

  const inGoalMouthY = b.y >= 0.34 && b.y <= 0.66;
  if (b.x <= 0.04 && inGoalMouthY) {
    const scorer = p.awayCars.find(c => c.id === b.lastTouchPlayer) || p.awayCars[0];
    handleRealGoalScored("AWAY", scorer);
  } else if (b.x >= 0.96 && inGoalMouthY) {
    const scorer = p.homeCars.find(c => c.id === b.lastTouchPlayer) || p.homeCars[0];
    handleRealGoalScored("HOME", scorer);
  } else {
    if (b.x < 0.06) {
      b.x = 0.065;
      b.vx = Math.abs(b.vx) * 0.85 + 0.14;
      b.vy += (0.5 - b.y) * 0.45;
    } else if (b.x > 0.94) {
      b.x = 0.935;
      b.vx = -Math.abs(b.vx) * 0.85 - 0.14;
      b.vy += (0.5 - b.y) * 0.45;
    }
  }

  const updateTeamCars = (cars, isHome) => {
    const tacticShift = isHome
      ? (LiveMatch.tactic === "AGGRESSIVE" ? 0.08 : LiveMatch.tactic === "DEFENSIVE" ? -0.08 : 0)
      : 0;

    cars.forEach((car, idx) => {
      let targetX = b.x;
      let targetY = b.y;

      if (idx === 0) {
        targetX = b.x + (isHome ? -0.015 : 0.015);
        targetY = b.y;
      } else if (idx === 1) {
        targetX = Math.max(0.14, Math.min(0.86, b.x + (isHome ? -0.10 + tacticShift : 0.10)));
        targetY = b.y < 0.5 ? Math.min(0.80, b.y + 0.18) : Math.max(0.20, b.y - 0.18);
      } else {
        const baseDefX = isHome ? Math.max(0.11, 0.22 + tacticShift) : 0.78;
        targetX = (baseDefX * 0.7) + (b.x * 0.3);
        targetY = 0.5 + (b.y - 0.5) * 0.45;
      }

      const dx = targetX - car.x;
      const dy = targetY - car.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      const desiredAngle = Math.atan2(dy, dx);

      let diff = desiredAngle - car.angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      car.angle += diff * Math.min(1, 7.5 * dt);

      const usingBoost = car.boost > 8 && dist > 0.14;
      const moveSpeed = usingBoost ? 0.34 : 0.23;
      if (usingBoost) {
        car.boost = Math.max(0, car.boost - 14 * dt);
      } else {
        car.boost = Math.min(100, car.boost + 4 * dt);
      }

      car.vx = Math.cos(car.angle) * moveSpeed;
      car.vy = Math.sin(car.angle) * moveSpeed;
      car.speed = moveSpeed * 10;

      car.x = Math.max(0.075, Math.min(0.925, car.x + car.vx * dt));
      car.y = Math.max(0.10, Math.min(0.90, car.y + car.vy * dt));

      p.boostPads.forEach(pad => {
        if (pad.active && Math.hypot(car.x - pad.x, car.y - pad.y) < 0.038) {
          pad.active = false;
          pad.cooldown = pad.big ? 8 : 4;
          car.boost = Math.min(100, car.boost + (pad.big ? 65 : 20));
        }
      });

      const ballDist = Math.hypot(b.x - car.x, b.y - car.y);
      if (ballDist < 0.036) {
        const nearCorner = (b.x < 0.11 || b.x > 0.89) && (b.y < 0.32 || b.y > 0.68);
        const goalX = nearCorner ? 0.50 : (isHome ? 0.98 : 0.02);
        const goalY = nearCorner ? 0.50 : (0.5 + (Math.random() * 0.22 - 0.11));
        const shotAngle = Math.atan2(goalY - b.y, goalX - b.x);
        const shotPower = 0.44 + (Math.random() * 0.15);

        b.vx = Math.cos(shotAngle) * shotPower;
        b.vy = Math.sin(shotAngle) * shotPower;
        b.x += Math.cos(shotAngle) * 0.028;
        b.y += Math.sin(shotAngle) * 0.028;
        b.lastTouchSide = isHome ? "HOME" : "AWAY";
        b.lastTouchPlayer = car.id;
      }
    });
  };

  updateTeamCars(p.homeCars, true);
  updateTeamCars(p.awayCars, false);

  const allCars = [...p.homeCars, ...p.awayCars];
  for (let i = 0; i < allCars.length; i++) {
    for (let j = i + 1; j < allCars.length; j++) {
      const c1 = allCars[i];
      const c2 = allCars[j];
      const d = Math.hypot(c2.x - c1.x, c2.y - c1.y);
      if (d > 0 && d < 0.035) {
        const push = (0.035 - d) * 0.5;
        const ang = Math.atan2(c2.y - c1.y, c2.x - c1.x);
        c1.x -= Math.cos(ang) * push;
        c1.y -= Math.sin(ang) * push;
        c2.x += Math.cos(ang) * push;
        c2.y += Math.sin(ang) * push;
      }
    }
  }

  Graphics.drawPitch2D(canvas, p, homeTeam, awayTeam);
  renderBoostHud();

  LiveMatch.animFrameId = requestAnimationFrame(stepPitchAnimation);
}
