const InitialData = {
  metaPatches: [
    "Control Aéreo & Flip Resets (+Efectividad en jugadas aéreas)",
    "Bump & Demo Meta (+Impacto de presión física y robos de boost)",
    "Juego de Pases Rápidos (+Bono por Química alta en equipo)",
    "Cerrojo Defensivo & Contraataque (+Solidez de Third Man)"
  ],

  teams: [
    // EUROPA (PRO)
    { id: "kc", name: "Karmine Corp", tag: "KC", region: "EU", division: "PRO", budget: 650000, rep: 95, stars: 0, car: "Fennec", arena: "Champions Field", color1: "#0077ff", color2: "#ffffff", shape: "shield", pattern: "split" },
    { id: "vit", name: "Team Vitality", tag: "VIT", region: "EU", division: "PRO", budget: 640000, rep: 94, stars: 2, car: "Fennec", arena: "Mannfield (Night)", color1: "#facc15", color2: "#111827", shape: "hexagon", pattern: "chevron" },
    { id: "bds", name: "Team BDS", tag: "BDS", region: "EU", division: "PRO", budget: 610000, rep: 93, stars: 2, car: "Fennec", arena: "DFH Stadium", color1: "#ec4899", color2: "#1e1b4b", shape: "shield", pattern: "sash" },
    { id: "gm8", name: "Gentle Mates Alpine", tag: "M8", region: "EU", division: "PRO", budget: 560000, rep: 90, stars: 0, car: "Fennec", arena: "Utopia Coliseum", color1: "#10b981", color2: "#064e3b", shape: "circle", pattern: "stripe" },
    { id: "oxg", name: "Oxygen Esports", tag: "OXG", region: "EU", division: "PRO", budget: 480000, rep: 86, stars: 0, car: "Octane", arena: "Neo Tokyo", color1: "#22c55e", color2: "#0f172a", shape: "diamond", pattern: "solid" },
    { id: "dig_eu", name: "Dignitas EU", tag: "DIG", region: "EU", division: "PRO", budget: 470000, rep: 85, stars: 1, car: "Octane", arena: "Champions Field", color1: "#f59e0b", color2: "#18181b", shape: "shield", pattern: "split" },
    // EUROPA (CHALLENGER - 2DA DIVISIÓN)
    { id: "sol_eu", name: "Solary", tag: "SLY", region: "EU", division: "CHALLENGER", budget: 310000, rep: 78, stars: 0, car: "Fennec", arena: "Beckwith Park", color1: "#eab308", color2: "#1e293b", shape: "circle", pattern: "split" },
    { id: "gia_eu", name: "GIANTX", tag: "GX", region: "EU", division: "CHALLENGER", budget: 320000, rep: 79, stars: 0, car: "Octane", arena: "Urban Central", color1: "#38bdf8", color2: "#090d16", shape: "hexagon", pattern: "stripe" },

    // NORTEAMÉRICA (PRO)
    { id: "g2", name: "G2 Stride", tag: "G2", region: "NA", division: "PRO", budget: 640000, rep: 94, stars: 0, car: "Fennec", arena: "DFH Stadium", color1: "#ef4444", color2: "#111827", shape: "hexagon", pattern: "stripe" },
    { id: "geng", name: "Gen.G Mobil1", tag: "GENG", region: "NA", division: "PRO", budget: 590000, rep: 91, stars: 0, car: "Fennec", arena: "Champions Field", color1: "#eab308", color2: "#090d16", shape: "shield", pattern: "sash" },
    { id: "ssg", name: "Spacestation Gaming", tag: "SSG", region: "NA", division: "PRO", budget: 530000, rep: 89, stars: 0, car: "Octane", arena: "Starbase ARC", color1: "#facc15", color2: "#1e293b", shape: "diamond", pattern: "chevron" },
    { id: "nrg", name: "NRG Esports", tag: "NRG", region: "NA", division: "PRO", budget: 510000, rep: 87, stars: 1, car: "Octane", arena: "Mannfield (Night)", color1: "#ffffff", color2: "#111827", shape: "shield", pattern: "split" },
    { id: "col", name: "Complexity Gaming", tag: "COL", region: "NA", division: "PRO", budget: 480000, rep: 86, stars: 0, car: "Fennec", arena: "Wasteland", color1: "#1d4ed8", color2: "#ffffff", shape: "circle", pattern: "stripe" },
    { id: "c9", name: "Cloud9", tag: "C9", region: "NA", division: "PRO", budget: 520000, rep: 88, stars: 1, car: "Octane", arena: "Utopia Coliseum", color1: "#38bdf8", color2: "#ffffff", shape: "hexagon", pattern: "solid" },
    // NORTEAMÉRICA (CHALLENGER)
    { id: "dig_na", name: "Shopify Rebellion", tag: "SR", region: "NA", division: "CHALLENGER", budget: 330000, rep: 80, stars: 0, car: "Fennec", arena: "Beckwith Park", color1: "#84cc16", color2: "#0f172a", shape: "shield", pattern: "sash" },
    { id: "nrg_ac", name: "Pittsburgh Knights", tag: "PK", region: "NA", division: "CHALLENGER", budget: 290000, rep: 77, stars: 0, car: "Dominus", arena: "Urban Central", color1: "#facc15", color2: "#000000", shape: "diamond", pattern: "split" },

    // SUDAMÉRICA (PRO)
    { id: "furia", name: "FURIA Esports", tag: "FUR", region: "SAM", division: "PRO", budget: 550000, rep: 91, stars: 0, car: "Fennec", arena: "Champions Field", color1: "#111827", color2: "#f8fafc", shape: "shield", pattern: "sash" },
    { id: "ts", name: "Team Secret", tag: "TS", region: "SAM", division: "PRO", budget: 440000, rep: 85, stars: 0, car: "Octane", arena: "DFH Stadium", color1: "#0f172a", color2: "#38bdf8", shape: "hexagon", pattern: "split" },
    { id: "kru", name: "KRÜ Esports", tag: "KRU", region: "SAM", division: "PRO", budget: 450000, rep: 86, stars: 0, car: "Fennec", arena: "Neo Tokyo", color1: "#ec4899", color2: "#111827", shape: "diamond", pattern: "chevron" },
    { id: "nip", name: "Ninjas in Pyjamas", tag: "NIP", region: "SAM", division: "PRO", budget: 460000, rep: 86, stars: 0, car: "Fennec", arena: "Mannfield (Night)", color1: "#a3e635", color2: "#1e1b4b", shape: "circle", pattern: "sash" },
    // SUDAMÉRICA (CHALLENGER)
    { id: "lev", name: "Leviatán Esports", tag: "LEV", region: "SAM", division: "CHALLENGER", budget: 310000, rep: 80, stars: 0, car: "Fennec", arena: "Urban Central", color1: "#0284c7", color2: "#0f172a", shape: "shield", pattern: "stripe" },
    { id: "9z", name: "9z Team", tag: "9Z", region: "SAM", division: "CHALLENGER", budget: 300000, rep: 79, stars: 0, car: "Octane", arena: "Beckwith Park", color1: "#7e22ce", color2: "#ffffff", shape: "hexagon", pattern: "solid" },

    // MENA (PRO)
    { id: "flcn", name: "Team Falcons", tag: "FLCN", region: "MENA", division: "PRO", budget: 680000, rep: 94, stars: 0, car: "Fennec", arena: "Salty Shores", color1: "#16a34a", color2: "#ffffff", shape: "shield", pattern: "chevron" },
    { id: "tm", name: "Twisted Minds", tag: "TM", region: "MENA", division: "PRO", budget: 520000, rep: 87, stars: 0, car: "Octane", arena: "Champions Field", color1: "#dc2626", color2: "#0f172a", shape: "hexagon", pattern: "split" },
    { id: "r1", name: "Rule One", tag: "R1", region: "MENA", division: "PRO", budget: 500000, rep: 86, stars: 0, car: "Fennec", arena: "Utopia Coliseum", color1: "#f97316", color2: "#111827", shape: "diamond", pattern: "stripe" },
    // MENA (CHALLENGER)
    { id: "vis", name: "Vision Esports", tag: "VIS", region: "MENA", division: "CHALLENGER", budget: 310000, rep: 79, stars: 0, car: "Octane", arena: "DFH Stadium", color1: "#06b6d4", color2: "#0f172a", shape: "circle", pattern: "split" }
  ],

  players: [
    // EU PRO
    { id: "p_vatira", name: "vatira", country: "FR", age: 19, ovr: 95, pot: 98, mec: 96, rot: 95, def: 94, role: "Playmaker", personality: "Líder Nato", contractYears: 3, teamId: "kc", starter: true, value: 490000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_atow", name: "Atow.", country: "BE", age: 18, ovr: 92, pot: 96, mec: 95, rot: 90, def: 89, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "kc", starter: true, value: 430000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_rise", name: "rise.", country: "GB", age: 21, ovr: 91, pot: 93, mec: 90, rot: 92, def: 91, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "kc", starter: true, value: 390000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_zen", name: "zen", country: "FR", age: 19, ovr: 97, pot: 99, mec: 99, rot: 96, def: 96, role: "Striker", personality: "Superestrella", contractYears: 3, teamId: "vit", starter: true, value: 580000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_alpha", name: "Alpha54", country: "FR", age: 22, ovr: 90, pot: 91, mec: 92, rot: 89, def: 88, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "vit", starter: true, value: 360000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_radosin", name: "Radosin", country: "FR", age: 21, ovr: 89, pot: 91, mec: 90, rot: 88, def: 89, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "vit", starter: true, value: 330000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_mm", name: "M0nkey M00n", country: "FR", age: 23, ovr: 94, pot: 95, mec: 93, rot: 96, def: 94, role: "Third Man", personality: "Líder Nato", contractYears: 3, teamId: "bds", starter: true, value: 470000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_dralii", name: "dralii", country: "MA", age: 18, ovr: 93, pot: 97, mec: 96, rot: 91, def: 90, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 3, teamId: "bds", starter: true, value: 450000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_exotiik", name: "ExoTiiK", country: "FR", age: 22, ovr: 91, pot: 92, mec: 90, rot: 92, def: 91, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "bds", starter: true, value: 380000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_seikoo", name: "Seikoo", country: "FR", age: 21, ovr: 91, pot: 93, mec: 93, rot: 90, def: 89, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "gm8", starter: true, value: 390000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_itachi", name: "itachi", country: "MA", age: 22, ovr: 90, pot: 91, mec: 89, rot: 92, def: 90, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "gm8", starter: true, value: 360000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_juicy", name: "juicy", country: "FR", age: 19, ovr: 89, pot: 93, mec: 91, rot: 88, def: 88, role: "Third Man", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "gm8", starter: true, value: 340000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_archie", name: "archie", country: "GB", age: 20, ovr: 89, pot: 92, mec: 91, rot: 88, def: 88, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "oxg", starter: true, value: 320000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_oski", name: "Oski", country: "PL", age: 18, ovr: 89, pot: 94, mec: 92, rot: 87, def: 87, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "oxg", starter: true, value: 330000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_joyo", name: "Joyo", country: "GB", age: 20, ovr: 89, pot: 92, mec: 94, rot: 86, def: 86, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "oxg", starter: true, value: 330000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_noly", name: "noly", country: "GB", age: 22, ovr: 88, pot: 89, mec: 87, rot: 90, def: 88, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "dig_eu", starter: true, value: 290000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_joreuz", name: "Joreuz", country: "NL", age: 21, ovr: 89, pot: 92, mec: 93, rot: 86, def: 86, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "dig_eu", starter: true, value: 310000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_ivn", name: "ivn", country: "DE", age: 21, ovr: 86, pot: 88, mec: 85, rot: 87, def: 87, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "dig_eu", starter: true, value: 250000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    // EU CHALLENGER
    { id: "p_chausette", name: "Chausette45", country: "FR", age: 24, ovr: 83, pot: 84, mec: 82, rot: 85, def: 84, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "sol_eu", starter: true, value: 180000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_kaydop", name: "Kaydop", country: "FR", age: 25, ovr: 82, pot: 83, mec: 81, rot: 84, def: 82, role: "Striker", personality: "Líder Nato", contractYears: 1, teamId: "sol_eu", starter: true, value: 165000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_aztral", name: "AztraL", country: "BE", age: 22, ovr: 84, pot: 86, mec: 88, rot: 81, def: 81, role: "Playmaker", personality: "Superestrella", contractYears: 2, teamId: "sol_eu", starter: true, value: 210000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_tox", name: "Tox", country: "DE", age: 21, ovr: 84, pot: 87, mec: 85, rot: 84, def: 83, role: "Striker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "gia_eu", starter: true, value: 205000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_crr", name: "crr", country: "ES", age: 20, ovr: 85, pot: 89, mec: 87, rot: 84, def: 83, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "gia_eu", starter: true, value: 235000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_dorito", name: "Dorito", country: "ES", age: 20, ovr: 83, pot: 87, mec: 84, rot: 83, def: 82, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "gia_eu", starter: true, value: 190000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    // NA PRO
    { id: "p_beastmode", name: "BeastMode", country: "US", age: 20, ovr: 94, pot: 97, mec: 96, rot: 93, def: 92, role: "Striker", personality: "Superestrella", contractYears: 3, teamId: "g2", starter: true, value: 475000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_daniel", name: "Daniel", country: "US", age: 18, ovr: 94, pot: 98, mec: 96, rot: 92, def: 94, role: "Third Man", personality: "Promesa Ambiciosa", contractYears: 3, teamId: "g2", starter: true, value: 480000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_atomic", name: "Atomic", country: "US", age: 21, ovr: 92, pot: 94, mec: 91, rot: 94, def: 91, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "g2", starter: true, value: 420000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_fk", name: "Firstkiller", country: "US", age: 20, ovr: 93, pot: 96, mec: 96, rot: 91, def: 91, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "geng", starter: true, value: 455000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_appjack", name: "ApparentlyJack", country: "GB", age: 21, ovr: 91, pot: 93, mec: 90, rot: 93, def: 90, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "geng", starter: true, value: 385000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_chronic", name: "Chronic", country: "US", age: 19, ovr: 90, pot: 94, mec: 92, rot: 89, def: 89, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "geng", starter: true, value: 365000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_lj", name: "LJ", country: "US", age: 20, ovr: 91, pot: 94, mec: 94, rot: 89, def: 89, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "ssg", starter: true, value: 380000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_hockser", name: "hockser", country: "US", age: 22, ovr: 88, pot: 89, mec: 87, rot: 89, def: 89, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "ssg", starter: true, value: 295000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_chicago", name: "Chicago", country: "US", age: 23, ovr: 88, pot: 89, mec: 88, rot: 89, def: 87, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "ssg", starter: true, value: 290000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_jstn", name: "jstn.", country: "US", age: 22, ovr: 88, pot: 90, mec: 91, rot: 86, def: 86, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "nrg", starter: true, value: 300000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_garrett", name: "GarrettG", country: "US", age: 24, ovr: 86, pot: 87, mec: 85, rot: 88, def: 87, role: "Third Man", personality: "Líder Nato", contractYears: 1, teamId: "nrg", starter: true, value: 255000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_frosty", name: "Frosty", country: "US", age: 17, ovr: 86, pot: 93, mec: 89, rot: 84, def: 84, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 3, teamId: "nrg", starter: true, value: 280000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_reyp", name: "Reysbull", country: "CL", age: 20, ovr: 89, pot: 92, mec: 91, rot: 88, def: 88, role: "Striker", personality: "Líder Nato", contractYears: 2, teamId: "col", starter: true, value: 335000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_ajg", name: "ajg", country: "AR", age: 21, ovr: 87, pot: 89, mec: 86, rot: 88, def: 88, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "col", starter: true, value: 275000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_diaz", name: "diaz", country: "BR", age: 17, ovr: 88, pot: 95, mec: 92, rot: 85, def: 85, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 3, teamId: "col", starter: true, value: 345000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_comm", name: "Comm", country: "US", age: 21, ovr: 88, pot: 90, mec: 88, rot: 89, def: 87, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "c9", starter: true, value: 295000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_majic", name: "Majicbear", country: "US", age: 20, ovr: 88, pot: 91, mec: 90, rot: 87, def: 87, role: "Striker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "c9", starter: true, value: 300000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_evoh", name: "Evoh", country: "US", age: 18, ovr: 87, pot: 92, mec: 90, rot: 85, def: 85, role: "Third Man", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "c9", starter: true, value: 285000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    // NA CHALLENGER
    { id: "p_2piece", name: "2Piece", country: "US", age: 19, ovr: 86, pot: 91, mec: 88, rot: 85, def: 84, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "dig_na", starter: true, value: 250000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_paar", name: "Paarth", country: "US", age: 19, ovr: 85, pot: 89, mec: 86, rot: 85, def: 84, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "dig_na", starter: true, value: 230000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_justin", name: "Memory", country: "US", age: 23, ovr: 83, pot: 84, mec: 82, rot: 84, def: 84, role: "Third Man", personality: "Líder Nato", contractYears: 1, teamId: "dig_na", starter: true, value: 185000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_cheese", name: "Cheese", country: "US", age: 19, ovr: 84, pot: 89, mec: 86, rot: 83, def: 82, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "nrg_ac", starter: true, value: 215000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_sosa", name: "sosa", country: "CA", age: 21, ovr: 82, pot: 85, mec: 82, rot: 83, def: 82, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "nrg_ac", starter: true, value: 175000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_lion", name: "LionBlaze", country: "US", age: 21, ovr: 82, pot: 85, mec: 81, rot: 82, def: 84, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "nrg_ac", starter: true, value: 175000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    // SAM PRO
    { id: "p_yanxnz", name: "yanxnz", country: "BR", age: 20, ovr: 93, pot: 96, mec: 96, rot: 91, def: 91, role: "Striker", personality: "Superestrella", contractYears: 3, teamId: "furia", starter: true, value: 440000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_lostt", name: "Lostt", country: "BR", age: 19, ovr: 91, pot: 95, mec: 94, rot: 89, def: 89, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "furia", starter: true, value: 390000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_drufinho", name: "drufinho", country: "BR", age: 20, ovr: 89, pot: 92, mec: 89, rot: 90, def: 89, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "furia", starter: true, value: 335000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_kv1", name: "kv1", country: "BR", age: 20, ovr: 89, pot: 92, mec: 89, rot: 88, def: 91, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "ts", starter: true, value: 325000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_motta", name: "Motta", country: "BR", age: 19, ovr: 88, pot: 92, mec: 90, rot: 87, def: 86, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "ts", starter: true, value: 305000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_brad", name: "Brad", country: "BR", age: 21, ovr: 87, pot: 89, mec: 87, rot: 88, def: 86, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "ts", starter: true, value: 270000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_shad", name: "Shad", country: "AR", age: 22, ovr: 87, pot: 89, mec: 87, rot: 88, def: 86, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "kru", starter: true, value: 275000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_bemmz", name: "bemmz", country: "BR", age: 20, ovr: 88, pot: 91, mec: 90, rot: 87, def: 86, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "kru", starter: true, value: 295000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_pan", name: "pan", country: "BR", age: 21, ovr: 86, pot: 88, mec: 85, rot: 87, def: 87, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "kru", starter: true, value: 245000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_swiftt", name: "Swiftt", country: "BR", age: 17, ovr: 89, pot: 95, mec: 92, rot: 87, def: 87, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 3, teamId: "nip", starter: true, value: 350000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_aztromyck", name: "AztromicK", country: "BR", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "nip", starter: true, value: 290000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_caard", name: "caard", country: "BR", age: 23, ovr: 87, pot: 88, mec: 87, rot: 88, def: 86, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "nip", starter: true, value: 265000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    // SAM CHALLENGER
    { id: "p_agues", name: "Agues", country: "AR", age: 19, ovr: 83, pot: 88, mec: 85, rot: 82, def: 81, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "lev", starter: true, value: 195000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_lexim", name: "Lexim", country: "CL", age: 20, ovr: 82, pot: 86, mec: 83, rot: 82, def: 81, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "lev", starter: true, value: 175000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_umbroken", name: "Umbroken", country: "AR", age: 21, ovr: 82, pot: 85, mec: 81, rot: 82, def: 83, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "lev", starter: true, value: 170000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_klaus", name: "Klaus", country: "AR", age: 18, ovr: 82, pot: 88, mec: 84, rot: 81, def: 80, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "9z", starter: true, value: 180000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_davitrox", name: "Davitrox", country: "CL", age: 19, ovr: 81, pot: 86, mec: 82, rot: 81, def: 80, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "9z", starter: true, value: 165000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_pekitas", name: "Pekitas", country: "AR", age: 20, ovr: 81, pot: 85, mec: 80, rot: 81, def: 82, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "9z", starter: true, value: 160000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    // MENA PRO & CHALLENGER
    { id: "p_trk", name: "trk511", country: "SA", age: 20, ovr: 94, pot: 97, mec: 96, rot: 93, def: 93, role: "Playmaker", personality: "Líder Nato", contractYears: 3, teamId: "flcn", starter: true, value: 475000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_rw9", name: "Rw9", country: "SA", age: 18, ovr: 94, pot: 98, mec: 95, rot: 92, def: 96, role: "Third Man", personality: "Superestrella", contractYears: 3, teamId: "flcn", starter: true, value: 485000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_killeerrz", name: "Kiileerrz", country: "SA", age: 18, ovr: 93, pot: 97, mec: 96, rot: 91, def: 91, role: "Striker", personality: "Superestrella", contractYears: 3, teamId: "flcn", starter: true, value: 455000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_ahmad", name: "Ahmad", country: "SA", age: 22, ovr: 89, pot: 90, mec: 91, rot: 88, def: 87, role: "Striker", personality: "Líder Nato", contractYears: 2, teamId: "tm", starter: true, value: 320000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_okhalid", name: "oKhaliD", country: "SA", age: 22, ovr: 88, pot: 89, mec: 87, rot: 90, def: 88, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "tm", starter: true, value: 295000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_senzo", name: "Senzo", country: "SA", age: 22, ovr: 87, pot: 88, mec: 86, rot: 88, def: 87, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "tm", starter: true, value: 265000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_nwpo", name: "Nwpo", country: "SA", age: 18, ovr: 91, pot: 96, mec: 95, rot: 88, def: 88, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "r1", starter: true, value: 400000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_m7sn", name: "M7sN", country: "SA", age: 20, ovr: 87, pot: 90, mec: 88, rot: 87, def: 86, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "r1", starter: true, value: 270000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_ams", name: "amS", country: "SA", age: 21, ovr: 86, pot: 88, mec: 85, rot: 87, def: 86, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "r1", starter: true, value: 245000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    { id: "p_twiz", name: "Twiz", country: "SA", age: 19, ovr: 83, pot: 88, mec: 85, rot: 82, def: 81, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "vis", starter: true, value: 190000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_venom", name: "Venom", country: "SA", age: 20, ovr: 82, pot: 86, mec: 82, rot: 82, def: 82, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "vis", starter: true, value: 175000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_b2sel", name: "B2seL", country: "SA", age: 21, ovr: 82, pot: 85, mec: 81, rot: 82, def: 83, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "vis", starter: true, value: 170000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },

    // AGENTES LIBRES
    { id: "p_fa1", name: "Extra", country: "FR", age: 22, ovr: 88, pot: 90, mec: 87, rot: 90, def: 88, role: "Playmaker", personality: "Líder Nato", contractYears: 0, teamId: null, starter: false, value: 270000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_fa2", name: "Squishy", country: "CA", age: 23, ovr: 86, pot: 87, mec: 86, rot: 87, def: 86, role: "Third Man", personality: "Líder Nato", contractYears: 0, teamId: null, starter: false, value: 230000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_fa3", name: "Scrub Killa", country: "GB", age: 21, ovr: 85, pot: 87, mec: 86, rot: 84, def: 85, role: "Striker", personality: "Superestrella", contractYears: 0, teamId: null, starter: false, value: 215000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_fa4", name: "Math", country: "BR", age: 21, ovr: 85, pot: 87, mec: 86, rot: 85, def: 84, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 0, teamId: null, starter: false, value: 210000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 },
    { id: "p_fa5", name: "AyyJayy", country: "US", age: 22, ovr: 88, pot: 90, mec: 91, rot: 86, def: 85, role: "Striker", personality: "Superestrella", contractYears: 0, teamId: null, starter: false, value: 285000, goals: 0, assists: 0, saves: 0, matches: 0, streak: 0 }
  ],

  coaches: [
    { id: "c_ferra", name: "Ferra", country: "FR", ovr: 95, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "kc", salary: 110000 },
    { id: "c_satthew", name: "Satthew", country: "US", ovr: 93, specialty: "Química Perfecta (+6 Química base)", teamId: "g2", salary: 95000 },
    { id: "c_mew", name: "Mew", country: "FR", ovr: 92, specialty: "Formador de Prodigios (+50% progreso juvenil)", teamId: "bds", salary: 90000 },
    { id: "c_eversax", name: "Eversax", country: "BE", ovr: 90, specialty: "Presión Alta (+3% en Series Bo5)", teamId: "gm8", salary: 80000 },
    { id: "c_snip", name: "SnipJz", country: "BR", ovr: 89, specialty: "Formador de Prodigios (+50% progreso juvenil)", teamId: null, salary: 68000 },
    { id: "c_chrome", name: "Chrome", country: "US", ovr: 88, specialty: "Química Perfecta (+6 Química base)", teamId: null, salary: 64000 },
    { id: "c_virge", name: "Virge", country: "GB", ovr: 89, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: null, salary: 72000 }
  ],

  sponsors: [
    { id: "sp_redbull", name: "Red Bull Gaming", upfront: 45000, bonusDesc: "+$55,000 extra cada vez que ganás un Major o Mundial.", type: "LAN" },
    { id: "sp_nvidia", name: "NVIDIA GeForce RTX", upfront: 55000, bonusDesc: "+$20,000 por serie ganada si tu Química supera 88%.", type: "CHEM" },
    { id: "sp_hyperx", name: "HyperX Esports", upfront: 35000, bonusDesc: "+$30,000 extra cada vez que ganás cualquier torneo.", type: "TITLE" }
  ],

  scouts: [
    { id: "sc_sam", name: "Ojeador Sudamérica (AR/BR/CL)", cost: 35000, level: 1, desc: "+25% chance de detectar talentos SSL/GC3 en SAM" },
    { id: "sc_eu", name: "Ojeador Europa (FR/GB/ES)", cost: 45000, level: 2, desc: "+30% chance de detectar talentos europeos" },
    { id: "sc_global", name: "Red Global Elite (NA & MENA)", cost: 65000, level: 3, desc: "Aumenta el potencial máximo de tus nuevos juveniles" }
  ],

  federations: [
    { code: "AR", name: "Selección Argentina (AFA Esports)", minRep: 85 },
    { code: "CL", name: "Selección de Chile (La Roja)", minRep: 85 },
    { code: "BR", name: "Selección de Brasil (CBF Esports)", minRep: 88 },
    { code: "FR", name: "Selección de Francia (FFF Esports)", minRep: 92 },
    { code: "US", name: "Selección de Estados Unidos", minRep: 90 },
    { code: "SA", name: "Selección de Arabia Saudita", minRep: 91 }
  ],

  nationalLeagues: [
    { id: "lg_ar", name: "Liga Argentina de Rocket League", country: "AR", clubs: ["River Plate Gaming", "Boca Juniors Gaming", "9z Academy", "Leviatán B", "Furious Gaming", "Malvinas Gaming"] },
    { id: "lg_cl", name: "Liga Chilena RLCS", country: "CL", clubs: ["Colo-Colo Esports", "Universidad de Chile", "KRÜ Academy", "Santiago Wanderers", "Australs", "Cruzados"] },
    { id: "lg_br", name: "Campeonato Brasileiro RL", country: "BR", clubs: ["FURIA Academy", "paiN Gaming", "LOUD RL", "MIBR", "Team Liquid BR", "w7m esports"] },
    { id: "lg_fr", name: "Rocket Baguette Ligue 1", country: "FR", clubs: ["KC Blue Stars", "Vitality Academy", "Solary", "Gentle Mates B", "GO", "MCES"] },
    { id: "lg_na", name: "NA Collegiate & Challengers", country: "US", clubs: ["Northwood Blue", "Akron Zips", "G2 Next", "Spacestation B", "NRG Academy", "Boise State"] },
    { id: "lg_mena", name: "Saudi eLeague", country: "SA", clubs: ["Falcons Academy", "Al-Nassr Esports", "Al-Hilal Esports", "Twisted B", "Geekay", "01 Esports"] }
  ],

  seasonSchedule: [
    { compId: "rlcs_regional", compName: "RLCS Open Regional #1", roundName: "Fase Suiza — Ronda 1", stageType: "SWISS", format: "Bo5", prize: 22000, points: 12, isFinal: false },
    { compId: "rlcs_regional", compName: "RLCS Open Regional #1", roundName: "Fase Suiza — Ronda 2", stageType: "SWISS", format: "Bo5", prize: 25000, points: 14, isFinal: false },
    { compId: "rlcs_regional", compName: "RLCS Open Regional #1", roundName: "Fase Suiza — Ronda Decisiva", stageType: "SWISS_END", format: "Bo5", prize: 30000, points: 16, isFinal: false },
    { compId: "rlcs_regional", compName: "RLCS Open Regional #1", roundName: "Cuartos de Final", stageType: "QF", format: "Bo7", prize: 35000, points: 18, isFinal: false },
    { compId: "rlcs_regional", compName: "RLCS Open Regional #1", roundName: "Semifinal", stageType: "SF", format: "Bo7", prize: 45000, points: 22, isFinal: false },
    { compId: "rlcs_regional", compName: "RLCS Open Regional #1", roundName: "Gran Final Regional #1", stageType: "GF", format: "Bo7", prize: 75000, points: 32, isFinal: true },

    { compId: "rlcs_major1", compName: "RLCS Major 1 (Copenhague LAN)", roundName: "Fase Suiza Major", stageType: "SWISS_END", format: "Bo5", prize: 55000, points: 30, isFinal: false },
    { compId: "rlcs_major1", compName: "RLCS Major 1 (Copenhague LAN)", roundName: "Semifinal Major 1", stageType: "SF", format: "Bo7", prize: 75000, points: 42, isFinal: false },
    { compId: "rlcs_major1", compName: "RLCS Major 1 (Copenhague LAN)", roundName: "Gran Final Major 1", stageType: "GF", format: "Bo7", prize: 140000, points: 65, isFinal: true },

    { compId: "rlcs_regional", compName: "RLCS Open Regional #2", roundName: "Fase Suiza Regional #2", stageType: "SWISS_END", format: "Bo5", prize: 32000, points: 18, isFinal: false },
    { compId: "rlcs_regional", compName: "RLCS Open Regional #2", roundName: "Gran Final Regional #2", stageType: "GF", format: "Bo7", prize: 80000, points: 35, isFinal: true },

    { compId: "rlcs_major2", compName: "RLCS Major 2 (Londres LAN)", roundName: "Semifinal Major 2", stageType: "SF", format: "Bo7", prize: 85000, points: 48, isFinal: false },
    { compId: "rlcs_major2", compName: "RLCS Major 2 (Londres LAN)", roundName: "Gran Final Major 2", stageType: "GF", format: "Bo7", prize: 150000, points: 70, isFinal: true },

    { compId: "ewc", compName: "Esports World Cup (Riad)", roundName: "Semifinal EWC", stageType: "SF", format: "Bo7", prize: 95000, points: 40, isFinal: false },
    { compId: "ewc", compName: "Esports World Cup (Riad)", roundName: "Gran Final EWC", stageType: "GF", format: "Bo7", prize: 180000, points: 65, isFinal: true },

    { compId: "rlcs_worlds", compName: "RLCS World Championship", roundName: "Cuartos de Final Mundial", stageType: "QF", format: "Bo7", prize: 110000, points: 60, isFinal: false },
    { compId: "rlcs_worlds", compName: "RLCS World Championship", roundName: "Semifinal Mundial", stageType: "SF", format: "Bo7", prize: 150000, points: 80, isFinal: false },
    { compId: "rlcs_worlds", compName: "RLCS World Championship", roundName: "GRAN FINAL MUNDIAL RLCS", stageType: "GF", format: "Bo7", prize: 300000, points: 130, isFinal: true }
  ],

  youthTemplates: [
    { rank: "SSL", code: "SSL", age: 14, ovr: 76, potMin: 94, potMax: 99 },
    { rank: "GC3", code: "GC3", age: 15, ovr: 73, potMin: 90, potMax: 95 },
    { rank: "GC2", code: "GC2", age: 15, ovr: 70, potMin: 86, potMax: 91 },
    { rank: "C3",  code: "C3",  age: 14, ovr: 65, potMin: 81, potMax: 87 }
  ],

  youthArchetypes: ["Freestyler Mecánico", "Cerebro Táctico", "Muralla Defensiva", "Especialista 1v1"],

  newgenPrefixes: [
    "Kairo", "Zentox", "Vortex", "Nyx", "Luka", "Santi", "Tomi", "Thiago",
    "Mati", "Kylian", "Zeyn", "Fenix", "Drako", "Aether", "Rami", "Bauti",
    "Ciro", "Dante", "Ezra", "Gael", "Iker", "Jano", "Kobe", "Milo"
  ]
};
