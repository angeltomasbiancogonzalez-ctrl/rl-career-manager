const InitialData = {
  teams: [
    // EUROPA (6 RLCS Pro + 2 Challenger)
    { id: "kc", name: "Karmine Corp", tag: "KC", region: "EU", division: "PRO", rep: 94, stars: 0, car: "Fennec", arena: "Champions Field", color1: "#0055ff", color2: "#ffffff", shape: "modern", budget: 480000, points: 0 },
    { id: "vit", name: "Team Vitality", tag: "VIT", region: "EU", division: "PRO", rep: 95, stars: 2, car: "Fennec", arena: "Mannfield (Night)", color1: "#eab308", color2: "#111827", shape: "hexagon", budget: 500000, points: 0 },
    { id: "m8", name: "Gentle Mates", tag: "M8", region: "EU", division: "PRO", rep: 89, stars: 0, car: "Fennec", arena: "DFH Stadium", color1: "#ec4899", color2: "#ffffff", shape: "diamond", budget: 390000, points: 0 },
    { id: "bds", name: "Team BDS", tag: "BDS", region: "EU", division: "PRO", rep: 93, stars: 2, car: "Fennec", arena: "Utopia Coliseum", color1: "#f43f5e", color2: "#ffffff", shape: "shield", budget: 450000, points: 0 },
    { id: "oxg", name: "Oxygen Esports", tag: "OXG", region: "EU", division: "PRO", rep: 85, stars: 0, car: "Octane", arena: "Beckwith Park", color1: "#10b981", color2: "#064e3b", shape: "circle", budget: 310000, points: 0 },
    { id: "dig", name: "Dignitas EU", tag: "DIG", region: "EU", division: "PRO", rep: 84, stars: 1, car: "Octane", arena: "Neo Tokyo", color1: "#f59e0b", color2: "#000000", shape: "shield", budget: 290000, points: 0 },
    { id: "sol", name: "Solary", tag: "SLY", region: "EU", division: "CHALLENGER", rep: 76, stars: 0, car: "Fennec", arena: "Mannfield (Night)", color1: "#eab308", color2: "#0284c7", shape: "circle", budget: 150000, points: 0 },
    { id: "mon", name: "Monaco Esports", tag: "MON", region: "EU", division: "CHALLENGER", rep: 74, stars: 0, car: "Octane", arena: "Utopia Coliseum", color1: "#dc2626", color2: "#ffffff", shape: "shield", budget: 135000, points: 0 },

    // NORTEAMÉRICA (6 RLCS Pro + 2 Challenger)
    { id: "g2", name: "G2 Stride", tag: "G2", region: "NA", division: "PRO", rep: 94, stars: 0, car: "Octane", arena: "Champions Field", color1: "#dc2626", color2: "#ffffff", shape: "shield", budget: 470000, points: 0 },
    { id: "geng", name: "Gen.G Mobil1", tag: "GENG", region: "NA", division: "PRO", rep: 91, stars: 0, car: "Fennec", arena: "Mannfield (Night)", color1: "#f59e0b", color2: "#000000", shape: "hexagon", budget: 420000, points: 0 },
    { id: "ssg", name: "Spacestation", tag: "SSG", region: "NA", division: "PRO", rep: 87, stars: 0, car: "Octane", arena: "Starbase ARC", color1: "#facc15", color2: "#1e293b", shape: "circle", budget: 350000, points: 0 },
    { id: "col", name: "Complexity", tag: "COL", region: "NA", division: "PRO", rep: 86, stars: 0, car: "Fennec", arena: "DFH Stadium", color1: "#1d4ed8", color2: "#ffffff", shape: "shield", budget: 330000, points: 0 },
    { id: "nrg", name: "NRG Esports", tag: "NRG", region: "NA", division: "PRO", rep: 86, stars: 1, car: "Octane", arena: "Champions Field", color1: "#111827", color2: "#ef4444", shape: "diamond", budget: 320000, points: 0 },
    { id: "c9", name: "Cloud9", tag: "C9", region: "NA", division: "PRO", rep: 85, stars: 1, car: "Octane", arena: "Utopia Coliseum", color1: "#0284c7", color2: "#ffffff", shape: "circle", budget: 310000, points: 0 },
    { id: "sr", name: "Shopify Rebellion", tag: "SR", region: "NA", division: "CHALLENGER", rep: 78, stars: 0, car: "Fennec", arena: "DFH Stadium", color1: "#10b981", color2: "#111827", shape: "modern", budget: 170000, points: 0 },
    { id: "tsm", name: "TSM RL", tag: "TSM", region: "NA", division: "CHALLENGER", rep: 75, stars: 0, car: "Octane", arena: "Neo Tokyo", color1: "#111827", color2: "#ffffff", shape: "hexagon", budget: 145000, points: 0 },

    // SUDAMÉRICA (6 RLCS Pro + 2 Challenger)
    { id: "fur", name: "FURIA Esports", tag: "FUR", region: "SAM", division: "PRO", rep: 91, stars: 0, car: "Fennec", arena: "Champions Field", color1: "#000000", color2: "#ffffff", shape: "shield", budget: 360000, points: 0 },
    { id: "kru", name: "KRÜ Esports", tag: "KRU", region: "SAM", division: "PRO", rep: 84, stars: 0, car: "Octane", arena: "Mannfield (Night)", color1: "#ec4899", color2: "#111827", shape: "hexagon", budget: 250000, points: 0 },
    { id: "sec", name: "Team Secret", tag: "SEC", region: "SAM", division: "PRO", rep: 85, stars: 0, car: "Fennec", arena: "DFH Stadium", color1: "#1e293b", color2: "#38bdf8", shape: "diamond", budget: 260000, points: 0 },
    { id: "9z", name: "9z Team", tag: "9Z", region: "SAM", division: "PRO", rep: 81, stars: 0, car: "Octane", arena: "Estadio Único LP", color1: "#7c3aed", color2: "#ffffff", shape: "shield", budget: 210000, points: 0 },
    { id: "lev", name: "Leviatán", tag: "LEV", region: "SAM", division: "PRO", rep: 80, stars: 0, car: "Fennec", arena: "AquaDome", color1: "#0284c7", color2: "#ffffff", shape: "circle", budget: 200000, points: 0 },
    { id: "nip", name: "Ninjas in Pyjamas", tag: "NIP", region: "SAM", division: "PRO", rep: 83, stars: 0, car: "Fennec", arena: "Neo Tokyo", color1: "#84cc16", color2: "#111827", shape: "hexagon", budget: 240000, points: 0 },
    { id: "mal", name: "Malvinas Gaming", tag: "MVG", region: "SAM", division: "CHALLENGER", rep: 74, stars: 0, car: "Octane", arena: "Champions Field", color1: "#0284c7", color2: "#facc15", shape: "shield", budget: 110000, points: 0 },
    { id: "uc", name: "U. Católica RL", tag: "UC", region: "SAM", division: "CHALLENGER", rep: 73, stars: 0, car: "Fennec", arena: "Utopia Coliseum", color1: "#1d4ed8", color2: "#ffffff", shape: "modern", budget: 105000, points: 0 },

    // MEDIO ORIENTE (4 RLCS Pro + 2 Challenger)
    { id: "flc", name: "Team Falcons", tag: "FLC", region: "MENA", division: "PRO", rep: 94, stars: 0, car: "Fennec", arena: "Salty Shores", color1: "#16a34a", color2: "#ffffff", shape: "modern", budget: 550000, points: 0 },
    { id: "tm", name: "Twisted Minds", tag: "TM", region: "MENA", division: "PRO", rep: 86, stars: 0, car: "Octane", arena: "Deadeye Canyon", color1: "#991b1b", color2: "#fbbf24", shape: "hexagon", budget: 320000, points: 0 },
    { id: "r1", name: "Rule One", tag: "R1", region: "MENA", division: "PRO", rep: 87, stars: 0, car: "Fennec", arena: "Champions Field", color1: "#2563eb", color2: "#facc15", shape: "diamond", budget: 340000, points: 0 },
    { id: "gk", name: "Geekay Esports", tag: "GK", region: "MENA", division: "PRO", rep: 81, stars: 0, car: "Octane", arena: "Mannfield (Night)", color1: "#f97316", color2: "#ffffff", shape: "circle", budget: 220000, points: 0 },
    { id: "aln", name: "Al-Nassr Esports", tag: "NSR", region: "MENA", division: "CHALLENGER", rep: 76, stars: 0, car: "Fennec", arena: "Salty Shores", color1: "#facc15", color2: "#1d4ed8", shape: "shield", budget: 180000, points: 0 },
    { id: "alh", name: "Al-Hilal RL", tag: "HIL", region: "MENA", division: "CHALLENGER", rep: 75, stars: 0, car: "Octane", arena: "Champions Field", color1: "#1d4ed8", color2: "#ffffff", shape: "circle", budget: 175000, points: 0 }
  ],

  players: [
    // EU PRO
    { id: "p1", name: "vatira", country: "FR", age: 19, ovr: 94, pot: 96, mec: 95, rot: 94, def: 93, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "kc", starter: true, stamina: 100, value: 820000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p2", name: "Atow.", country: "BE", age: 18, ovr: 92, pot: 95, mec: 94, rot: 90, def: 91, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "kc", starter: true, stamina: 100, value: 710000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p3", name: "rise.", country: "GB", age: 21, ovr: 91, pot: 92, mec: 90, rot: 93, def: 90, role: "Playmaker", personality: "Superestrella", contractYears: 2, teamId: "kc", starter: true, stamina: 100, value: 640000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p4", name: "zen", country: "FR", age: 19, ovr: 96, pot: 98, mec: 98, rot: 95, def: 95, role: "Striker", personality: "Líder Nato", contractYears: 3, teamId: "vit", starter: true, stamina: 100, value: 950000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p5", name: "ExoTiiK", country: "FR", age: 22, ovr: 91, pot: 92, mec: 90, rot: 92, def: 91, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "vit", starter: true, stamina: 100, value: 620000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p6", name: "Alpha54", country: "FR", age: 22, ovr: 90, pot: 91, mec: 91, rot: 89, def: 90, role: "Third Man", personality: "Superestrella", contractYears: 1, teamId: "vit", starter: true, stamina: 100, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p7", name: "Seikoo", country: "FR", age: 21, ovr: 91, pot: 93, mec: 92, rot: 91, def: 90, role: "Striker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "m8", starter: true, stamina: 100, value: 630000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p8", name: "itachi", country: "MA", age: 22, ovr: 90, pot: 91, mec: 89, rot: 92, def: 90, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "m8", starter: true, stamina: 100, value: 570000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p9", name: "juicy", country: "FR", age: 19, ovr: 89, pot: 92, mec: 90, rot: 88, def: 89, role: "Third Man", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "m8", starter: true, stamina: 100, value: 510000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p10", name: "M0nkey M00n", country: "FR", age: 23, ovr: 93, pot: 94, mec: 92, rot: 95, def: 93, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "bds", starter: true, stamina: 100, value: 780000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p11", name: "dralii", country: "MA", age: 18, ovr: 92, pot: 96, mec: 94, rot: 91, def: 90, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 3, teamId: "bds", starter: true, stamina: 100, value: 740000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p12", name: "Radosin", country: "FR", age: 21, ovr: 89, pot: 90, mec: 89, rot: 89, def: 89, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 1, teamId: "bds", starter: true, stamina: 100, value: 490000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p13", name: "Joyo", country: "GB", age: 20, ovr: 90, pot: 92, mec: 93, rot: 88, def: 88, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "oxg", starter: true, stamina: 100, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p14", name: "Archie", country: "GB", age: 20, ovr: 89, pot: 91, mec: 90, rot: 89, def: 88, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "oxg", starter: true, stamina: 100, value: 490000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p15", name: "Oski", country: "GB", age: 18, ovr: 90, pot: 94, mec: 92, rot: 89, def: 89, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "oxg", starter: true, stamina: 100, value: 600000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p59", name: "noly", country: "GB", age: 23, ovr: 87, pot: 88, mec: 86, rot: 89, def: 87, role: "Playmaker", personality: "Líder Nato", contractYears: 1, teamId: "dig", starter: true, stamina: 100, value: 370000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p60", name: "Joreuz", country: "NL", age: 21, ovr: 88, pot: 90, mec: 90, rot: 87, def: 87, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "dig", starter: true, stamina: 100, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p61", name: "ivn", country: "DE", age: 21, ovr: 86, pot: 88, mec: 86, rot: 87, def: 86, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "dig", starter: true, stamina: 100, value: 330000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // EU CHALLENGER
    { id: "p73", name: "Kaydop", country: "FR", age: 26, ovr: 81, pot: 81, mec: 79, rot: 84, def: 81, role: "Third Man", personality: "Líder Nato", contractYears: 1, teamId: "sol", starter: true, stamina: 100, value: 110000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p74", name: "Chausette45", country: "FR", age: 24, ovr: 80, pot: 80, mec: 79, rot: 82, def: 80, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 1, teamId: "sol", starter: true, stamina: 100, value: 95000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p75", name: "Yujin", country: "FR", age: 16, ovr: 80, pot: 89, mec: 83, rot: 78, def: 78, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "sol", starter: true, stamina: 100, value: 140000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p76", name: "Mtzr", country: "FR", age: 17, ovr: 79, pot: 87, mec: 81, rot: 78, def: 78, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "mon", starter: true, stamina: 100, value: 115000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p77", name: "Kérian", country: "FR", age: 21, ovr: 78, pot: 81, mec: 78, rot: 79, def: 78, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "mon", starter: true, stamina: 100, value: 90000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p78", name: "Ekon", country: "FR", age: 22, ovr: 78, pot: 80, mec: 77, rot: 79, def: 78, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "mon", starter: true, stamina: 100, value: 85000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // NA PRO
    { id: "p16", name: "BeastMode", country: "US", age: 20, ovr: 93, pot: 95, mec: 94, rot: 92, def: 93, role: "Striker", personality: "Líder Nato", contractYears: 2, teamId: "g2", starter: true, stamina: 100, value: 790000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p17", name: "Daniel", country: "US", age: 19, ovr: 93, pot: 96, mec: 95, rot: 91, def: 93, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 3, teamId: "g2", starter: true, stamina: 100, value: 810000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p18", name: "Atomic", country: "US", age: 22, ovr: 92, pot: 93, mec: 91, rot: 94, def: 91, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "g2", starter: true, stamina: 100, value: 700000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p19", name: "Firstkiller", country: "US", age: 21, ovr: 93, pot: 94, mec: 95, rot: 92, def: 91, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "geng", starter: true, stamina: 100, value: 780000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p20", name: "ApparentlyJack", country: "GB", age: 22, ovr: 90, pot: 91, mec: 89, rot: 92, def: 90, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "geng", starter: true, stamina: 100, value: 570000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p21", name: "Chronic", country: "US", age: 20, ovr: 90, pot: 92, mec: 91, rot: 90, def: 89, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "geng", starter: true, stamina: 100, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p22", name: "Lj", country: "US", age: 20, ovr: 91, pot: 94, mec: 93, rot: 90, def: 90, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "ssg", starter: true, stamina: 100, value: 640000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p23", name: "Hockser", country: "US", age: 23, ovr: 88, pot: 89, mec: 87, rot: 89, def: 88, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 1, teamId: "ssg", starter: true, stamina: 100, value: 420000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p24", name: "Chicago", country: "US", age: 24, ovr: 88, pot: 88, mec: 87, rot: 90, def: 87, role: "Playmaker", personality: "Líder Nato", contractYears: 1, teamId: "ssg", starter: true, stamina: 100, value: 400000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p25", name: "Reysbull", country: "CL", age: 21, ovr: 90, pot: 92, mec: 92, rot: 89, def: 89, role: "Striker", personality: "Líder Nato", contractYears: 2, teamId: "col", starter: true, stamina: 100, value: 570000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p26", name: "crr", country: "ES", age: 21, ovr: 90, pot: 92, mec: 91, rot: 90, def: 89, role: "Playmaker", personality: "Superestrella", contractYears: 2, teamId: "col", starter: true, stamina: 100, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p27", name: "DORITO", country: "ES", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "col", starter: true, stamina: 100, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p28", name: "jstn.", country: "US", age: 23, ovr: 88, pot: 89, mec: 90, rot: 87, def: 87, role: "Striker", personality: "Superestrella", contractYears: 1, teamId: "nrg", starter: true, stamina: 100, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p29", name: "GarrettG", country: "US", age: 25, ovr: 87, pot: 87, mec: 85, rot: 89, def: 88, role: "Third Man", personality: "Líder Nato", contractYears: 1, teamId: "nrg", starter: true, stamina: 100, value: 350000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p30", name: "Frosty", country: "US", age: 18, ovr: 87, pot: 92, mec: 89, rot: 86, def: 86, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "nrg", starter: true, stamina: 100, value: 440000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p62", name: "comm", country: "US", age: 21, ovr: 87, pot: 89, mec: 87, rot: 88, def: 87, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "c9", starter: true, stamina: 100, value: 380000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p63", name: "Aqua", country: "US", age: 19, ovr: 87, pot: 91, mec: 89, rot: 86, def: 86, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "c9", starter: true, stamina: 100, value: 410000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p64", name: "Evoh", country: "US", age: 19, ovr: 86, pot: 90, mec: 88, rot: 85, def: 85, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "c9", starter: true, stamina: 100, value: 360000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // NA CHALLENGER
    { id: "p79", name: "2Piece", country: "US", age: 19, ovr: 83, pot: 87, mec: 84, rot: 82, def: 82, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "sr", starter: true, stamina: 100, value: 165000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p80", name: "Paarth", country: "US", age: 20, ovr: 82, pot: 85, mec: 82, rot: 82, def: 81, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "sr", starter: true, stamina: 100, value: 140000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p81", name: "Retals", country: "US", age: 22, ovr: 83, pot: 84, mec: 81, rot: 85, def: 83, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "sr", starter: true, stamina: 100, value: 155000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p82", name: "Wahvey", country: "US", age: 18, ovr: 80, pot: 87, mec: 82, rot: 79, def: 79, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "tsm", starter: true, stamina: 100, value: 125000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p83", name: "creamz", country: "US", age: 19, ovr: 79, pot: 84, mec: 80, rot: 79, def: 78, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "tsm", starter: true, stamina: 100, value: 105000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p84", name: "hockE", country: "US", age: 20, ovr: 79, pot: 83, mec: 78, rot: 80, def: 79, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "tsm", starter: true, stamina: 100, value: 100000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // SAM PRO
    { id: "p31", name: "yanxnz", country: "BR", age: 21, ovr: 93, pot: 95, mec: 95, rot: 92, def: 91, role: "Striker", personality: "Superestrella", contractYears: 2, teamId: "fur", starter: true, stamina: 100, value: 790000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p32", name: "Lostt", country: "BR", age: 20, ovr: 91, pot: 94, mec: 93, rot: 90, def: 90, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "fur", starter: true, stamina: 100, value: 640000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p33", name: "DRUFINHO", country: "BR", age: 20, ovr: 90, pot: 92, mec: 90, rot: 91, def: 89, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "fur", starter: true, stamina: 100, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p34", name: "shad", country: "AR", age: 23, ovr: 88, pot: 89, mec: 88, rot: 89, def: 87, role: "Striker", personality: "Líder Nato", contractYears: 2, teamId: "kru", starter: true, stamina: 100, value: 410000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p35", name: "ajg", country: "AR", age: 23, ovr: 88, pot: 89, mec: 87, rot: 89, def: 88, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "kru", starter: true, stamina: 100, value: 410000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p36", name: "Bemmz", country: "BR", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "kru", starter: true, stamina: 100, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p37", name: "Kv1", country: "BR", age: 21, ovr: 89, pot: 91, mec: 89, rot: 89, def: 90, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "sec", starter: true, stamina: 100, value: 490000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p38", name: "nxghtt", country: "BR", age: 21, ovr: 88, pot: 90, mec: 89, rot: 87, def: 88, role: "Striker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "sec", starter: true, stamina: 100, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p39", name: "brad", country: "BR", age: 21, ovr: 88, pot: 90, mec: 88, rot: 88, def: 88, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "sec", starter: true, stamina: 100, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p40", name: "Klaus", country: "AR", age: 20, ovr: 86, pot: 89, mec: 87, rot: 86, def: 85, role: "Striker", personality: "Líder Nato", contractYears: 2, teamId: "9z", starter: true, stamina: 100, value: 330000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p41", name: "Zhearx", country: "AR", age: 19, ovr: 85, pot: 90, mec: 87, rot: 84, def: 84, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "9z", starter: true, stamina: 100, value: 310000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p42", name: "Pepe", country: "CL", age: 19, ovr: 85, pot: 89, mec: 86, rot: 85, def: 84, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "9z", starter: true, stamina: 100, value: 300000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p43", name: "Pan", country: "CL", age: 20, ovr: 86, pot: 89, mec: 87, rot: 85, def: 86, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "lev", starter: true, stamina: 100, value: 330000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p44", name: "Davitrox", country: "CL", age: 20, ovr: 85, pot: 88, mec: 86, rot: 85, def: 84, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "lev", starter: true, stamina: 100, value: 300000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p45", name: "Lexim", country: "AR", age: 19, ovr: 85, pot: 89, mec: 86, rot: 84, def: 85, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "lev", starter: true, stamina: 100, value: 305000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p65", name: "Aztromick", country: "BR", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, role: "Playmaker", personality: "Líder Nato", contractYears: 2, teamId: "nip", starter: true, stamina: 100, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p66", name: "Motta", country: "BR", age: 19, ovr: 88, pot: 92, mec: 90, rot: 87, def: 87, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "nip", starter: true, stamina: 100, value: 460000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p67", name: "swiftt", country: "BR", age: 18, ovr: 87, pot: 92, mec: 89, rot: 86, def: 86, role: "Third Man", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "nip", starter: true, stamina: 100, value: 420000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // SAM CHALLENGER
    { id: "p85", name: "Agus", country: "AR", age: 18, ovr: 78, pot: 84, mec: 79, rot: 78, def: 77, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "mal", starter: true, stamina: 100, value: 85000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p86", name: "Tano", country: "AR", age: 19, ovr: 77, pot: 82, mec: 77, rot: 78, def: 77, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "mal", starter: true, stamina: 100, value: 75000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p87", name: "Fede", country: "AR", age: 20, ovr: 77, pot: 81, mec: 76, rot: 78, def: 78, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "mal", starter: true, stamina: 100, value: 72000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p88", name: "Benja", country: "CL", age: 17, ovr: 77, pot: 85, mec: 79, rot: 76, def: 76, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "uc", starter: true, stamina: 100, value: 80000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p89", name: "Matías", country: "CL", age: 18, ovr: 76, pot: 82, mec: 76, rot: 77, def: 76, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "uc", starter: true, stamina: 100, value: 70000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p90", name: "Seba", country: "CL", age: 19, ovr: 76, pot: 81, mec: 75, rot: 77, def: 77, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "uc", starter: true, stamina: 100, value: 68000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // MENA PRO & CHALLENGER
    { id: "p46", name: "trk511", country: "SA", age: 21, ovr: 94, pot: 95, mec: 95, rot: 93, def: 94, role: "Playmaker", personality: "Líder Nato", contractYears: 3, teamId: "flc", starter: true, stamina: 100, value: 840000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p47", name: "Rw9", country: "SA", age: 19, ovr: 93, pot: 96, mec: 94, rot: 92, def: 95, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 3, teamId: "flc", starter: true, stamina: 100, value: 810000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p48", name: "Kiileerrz", country: "SA", age: 19, ovr: 93, pot: 96, mec: 95, rot: 92, def: 92, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 3, teamId: "flc", starter: true, stamina: 100, value: 800000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p49", name: "Ahmad", country: "SA", age: 23, ovr: 90, pot: 90, mec: 91, rot: 89, def: 89, role: "Striker", personality: "Líder Nato", contractYears: 2, teamId: "tm", starter: true, stamina: 100, value: 530000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p50", name: "oKhaliD", country: "SA", age: 24, ovr: 89, pot: 89, mec: 88, rot: 90, def: 90, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 1, teamId: "tm", starter: true, stamina: 100, value: 470000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p51", name: "Smw.", country: "SA", age: 21, ovr: 89, pot: 91, mec: 90, rot: 89, def: 88, role: "Playmaker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "tm", starter: true, stamina: 100, value: 490000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p52", name: "Nwpo", country: "SA", age: 18, ovr: 92, pot: 96, mec: 95, rot: 90, def: 90, role: "Striker", personality: "Superestrella", contractYears: 3, teamId: "r1", starter: true, stamina: 100, value: 750000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p53", name: "M7sn", country: "SA", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "r1", starter: true, stamina: 100, value: 420000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p54", name: "Mesho", country: "SA", age: 20, ovr: 88, pot: 90, mec: 89, rot: 87, def: 88, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "r1", starter: true, stamina: 100, value: 420000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p68", name: "Senzo", country: "SA", age: 23, ovr: 86, pot: 87, mec: 86, rot: 87, def: 86, role: "Third Man", personality: "Líder Nato", contractYears: 2, teamId: "gk", starter: true, stamina: 100, value: 310000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p69", name: "T7LM", country: "SA", age: 21, ovr: 86, pot: 88, mec: 87, rot: 85, def: 86, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "gk", starter: true, stamina: 100, value: 320000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p70", name: "ix.", country: "SA", age: 19, ovr: 85, pot: 89, mec: 86, rot: 85, def: 84, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "gk", starter: true, stamina: 100, value: 300000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p91", name: "venom", country: "SA", age: 19, ovr: 80, pot: 85, mec: 81, rot: 79, def: 80, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "aln", starter: true, stamina: 100, value: 115000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p92", name: "Ams", country: "SA", age: 20, ovr: 79, pot: 83, mec: 79, rot: 80, def: 79, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "aln", starter: true, stamina: 100, value: 100000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p93", name: "Zez0nix", country: "SA", age: 21, ovr: 79, pot: 82, mec: 78, rot: 80, def: 79, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "aln", starter: true, stamina: 100, value: 95000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p94", name: "sus.", country: "SA", age: 18, ovr: 79, pot: 85, mec: 80, rot: 78, def: 79, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 2, teamId: "alh", starter: true, stamina: 100, value: 105000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p95", name: "Nadr", country: "SA", age: 20, ovr: 78, pot: 82, mec: 78, rot: 79, def: 78, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 2, teamId: "alh", starter: true, stamina: 100, value: 90000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p96", name: "imkhaled", country: "SA", age: 19, ovr: 78, pot: 83, mec: 77, rot: 79, def: 78, role: "Third Man", personality: "Trabajador Silencioso", contractYears: 2, teamId: "alh", starter: true, stamina: 100, value: 88000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // Agentes libres
    { id: "p55", name: "Squishy", country: "CA", age: 25, ovr: 84, pot: 84, mec: 83, rot: 86, def: 84, role: "Playmaker", personality: "Líder Nato", contractYears: 0, teamId: null, starter: false, stamina: 100, value: 130000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p56", name: "Scrub Killa", country: "GB", age: 23, ovr: 83, pot: 84, mec: 84, rot: 82, def: 83, role: "Striker", personality: "Superestrella", contractYears: 0, teamId: null, starter: false, stamina: 100, value: 120000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p57", name: "Caard", country: "BR", age: 23, ovr: 84, pot: 85, mec: 84, rot: 84, def: 84, role: "Third Man", personality: "Líder Nato", contractYears: 0, teamId: null, starter: false, stamina: 100, value: 135000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p71", name: "Royales", country: "AR", age: 21, ovr: 79, pot: 84, mec: 80, rot: 79, def: 78, role: "Playmaker", personality: "Trabajador Silencioso", contractYears: 0, teamId: null, starter: false, stamina: 100, value: 65000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p72", name: "Pancho", country: "CL", age: 20, ovr: 78, pot: 84, mec: 79, rot: 78, def: 77, role: "Third Man", personality: "Promesa Ambiciosa", contractYears: 0, teamId: null, starter: false, stamina: 100, value: 58000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p97", name: "Lauti", country: "AR", age: 17, ovr: 76, pot: 85, mec: 78, rot: 75, def: 75, role: "Striker", personality: "Promesa Ambiciosa", contractYears: 0, teamId: null, starter: false, stamina: 100, value: 45000, goals: 0, assists: 0, saves: 0, streak: 0 }
  ],

  coaches: [
    { id: "c1", name: "Ferra", country: "FR", ovr: 94, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "kc", salary: 140000 },
    { id: "c2", name: "Fairy Peak!", country: "FR", ovr: 92, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: "vit", salary: 120000 },
    { id: "c3", name: "Satthew", country: "US", ovr: 93, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "g2", salary: 130000 },
    { id: "c4", name: "STL", country: "BR", ovr: 90, specialty: "Analista Mecánico (+3% ataque)", teamId: "fur", salary: 105000 },
    { id: "c5", name: "d7oom-24", country: "SA", ovr: 91, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "flc", salary: 115000 },
    { id: "c6", name: "Snaski", country: "GB", ovr: 88, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: null, salary: 75000 },
    { id: "c7", name: "Chrome", country: "US", ovr: 87, specialty: "Analista Mecánico (+3% ataque)", teamId: null, salary: 68000 },
    { id: "c8", name: "Kael", country: "ES", ovr: 86, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: null, salary: 60000 },
    { id: "c9", name: "Papo", country: "AR", ovr: 82, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: null, salary: 38000 }
  ],

  sponsors: [
    { id: "sp_hyperx", name: "HyperX Gaming", upfront: 40000, bonusDesc: "+$30,000 por cada título ganado" },
    { id: "sp_redbull", name: "Red Bull Esports", upfront: 60000, bonusDesc: "+$55,000 al ganar un Major o Mundial" },
    { id: "sp_nvidia", name: "NVIDIA GeForce", upfront: 75000, bonusDesc: "+$20,000 si mantenés Química > 88%" }
  ],

  metaPatches: [
    "Parche 2.40: Meta Aéreo y Flip Resets (+Bono a Strikers)",
    "Parche 2.45: Meta Físico y Demoliciones (+Bono a Presión Alta)",
    "Parche 2.50: Meta Control y Posesión (+Bono a Playmakers y Química)",
    "Parche 2.55: Meta Defensivo y Contraataque (+Bono a Third Man)"
  ],

  youthTemplates: [
    { code: "C3_12", age: 12, rank: "C3", ovr: 66, potMin: 89, potMax: 95 },
    { code: "GC1_13", age: 13, rank: "GC1", ovr: 69, potMin: 90, potMax: 96 },
    { code: "GC1_14", age: 14, rank: "GC1", ovr: 71, potMin: 91, potMax: 96 },
    { code: "GC2_12", age: 12, rank: "GC2", ovr: 72, potMin: 90, potMax: 95 },
    { code: "GC2_13", age: 13, rank: "GC2", ovr: 74, potMin: 90, potMax: 95 },
    { code: "GC3_13", age: 13, rank: "GC3", ovr: 76, potMin: 91, potMax: 97 },
    { code: "GC3_14", age: 14, rank: "GC3", ovr: 78, potMin: 91, potMax: 97 },
    { code: "SSL_14", age: 14, rank: "SSL", ovr: 81, potMin: 93, potMax: 98 }
  ],

  youthArchetypes: ["Freestyler", "Cerebro Táctico", "Ranked Demon 1v1", "Diamante en Bruto"],

  nationalLeagues: [
    { id: "liga_chi", name: "Liga Chilena de RL (Primera División)", country: "CL", clubs: ["Cobresal Esports", "Universidad Católica RL", "Palestino Gaming", "Everton Viña RL", "Santiago Morning", "Coquimbo Unido", "Deportes Iquique", "Rangers Talca"] },
    { id: "liga_arg", name: "Liga Argentina de RL (LVP / AFA Esports)", country: "AR", clubs: ["9z Academy", "Leviatán Rising", "River Plate Gaming", "Boca Juniors Esports", "Estudiantes LP Esports", "Gimnasia LP Gaming", "Racing Club RL", "Independiente Esports"] },
    { id: "liga_bra", name: "Liga Brasileña (CBLOL Rocket League)", country: "BR", clubs: ["FURIA Academy", "MIBR", "LOUD RL", "paiN Gaming", "INTZ", "Fluxo"] },
    { id: "liga_fra", name: "Rocket Baguette League (Francia)", country: "FR", clubs: ["KC Blue", "Vitality Bee", "Solary", "BDS Academy", "Monaco Esports"] },
    { id: "liga_na", name: "NA Challenger Series", country: "US", clubs: ["G2 Stride Academy", "Cloud9 Blue", "Shopify Rebellion", "Dignitas NA", "TSM RL"] },
    { id: "liga_sa", name: "Saudi eLeague RL", country: "SA", clubs: ["Falcons Academy", "Al-Nassr Esports", "Al-Hilal RL", "Al-Ittihad Gaming"] }
  ],

  seasonSchedule: [
    // SPLIT 1 - OPEN 1
    { compId: "rlcs_regional", eventKey: "O1", compName: "Open Regional 1", roundName: "Fase Suiza • Ronda 1 (0-0)", format: "Bo5", stageType: "SWISS", isFinal: false, prize: 8000, points: 6 },
    { compId: "rlcs_regional", eventKey: "O1", compName: "Open Regional 1", roundName: "Fase Suiza • Ronda 2", format: "Bo5", stageType: "SWISS", isFinal: false, prize: 8000, points: 6 },
    { compId: "rlcs_regional", eventKey: "O1", compName: "Open Regional 1", roundName: "Fase Suiza • Ronda Decisiva", format: "Bo5", stageType: "SWISS_END", isFinal: false, prize: 10000, points: 8 },
    { compId: "rlcs_regional", eventKey: "O1", compName: "Open Regional 1", roundName: "Playoffs • Cuartos de Final", format: "Bo7", stageType: "QF", isFinal: false, prize: 16000, points: 14 },
    { compId: "rlcs_regional", eventKey: "O1", compName: "Open Regional 1", roundName: "Playoffs • Semifinal", format: "Bo7", stageType: "SF", isFinal: false, prize: 24000, points: 20 },
    { compId: "rlcs_regional", eventKey: "O1", compName: "Open Regional 1", roundName: "Gran Final • Open Regional 1", format: "Bo7", stageType: "GF", isFinal: true, prize: 42000, points: 32 },

    // SPLIT 1 - OPEN 2
    { compId: "rlcs_regional", eventKey: "O2", compName: "Open Regional 2", roundName: "Fase Suiza • Ronda 1 (0-0)", format: "Bo5", stageType: "SWISS", isFinal: false, prize: 8000, points: 6 },
    { compId: "rlcs_regional", eventKey: "O2", compName: "Open Regional 2", roundName: "Fase Suiza • Ronda Decisiva", format: "Bo5", stageType: "SWISS_END", isFinal: false, prize: 10000, points: 8 },
    { compId: "rlcs_regional", eventKey: "O2", compName: "Open Regional 2", roundName: "Playoffs • Semifinal", format: "Bo7", stageType: "SF", isFinal: false, prize: 24000, points: 20 },
    { compId: "rlcs_regional", eventKey: "O2", compName: "Open Regional 2", roundName: "Gran Final • Open Regional 2", format: "Bo7", stageType: "GF", isFinal: true, prize: 42000, points: 32 },

    // MAJOR 1
    { compId: "paris_major", eventKey: "M1", compName: "Paris Major (LAN)", roundName: "Fase Suiza LAN (Accor Arena)", format: "Bo5", stageType: "SWISS_END", isFinal: false, prize: 25000, points: 18 },
    { compId: "paris_major", eventKey: "M1", compName: "Paris Major (LAN)", roundName: "Cuartos de Final LAN", format: "Bo7", stageType: "QF", isFinal: false, prize: 40000, points: 28 },
    { compId: "paris_major", eventKey: "M1", compName: "Paris Major (LAN)", roundName: "Semifinal LAN", format: "Bo7", stageType: "SF", isFinal: false, prize: 60000, points: 42 },
    { compId: "paris_major", eventKey: "M1", compName: "Paris Major (LAN)", roundName: "Gran Final — Paris Major", format: "Bo7", stageType: "GF", isFinal: true, prize: 120000, points: 70 },

    // SPLIT 2 - OPEN 3
    { compId: "rlcs_regional", eventKey: "O3", compName: "Open Regional 3", roundName: "Fase Suiza • Ronda 1 (0-0)", format: "Bo5", stageType: "SWISS", isFinal: false, prize: 9000, points: 7 },
    { compId: "rlcs_regional", eventKey: "O3", compName: "Open Regional 3", roundName: "Fase Suiza • Ronda Decisiva", format: "Bo5", stageType: "SWISS_END", isFinal: false, prize: 12000, points: 9 },
    { compId: "rlcs_regional", eventKey: "O3", compName: "Open Regional 3", roundName: "Playoffs • Semifinal", format: "Bo7", stageType: "SF", isFinal: false, prize: 26000, points: 22 },
    { compId: "rlcs_regional", eventKey: "O3", compName: "Open Regional 3", roundName: "Gran Final • Open Regional 3", format: "Bo7", stageType: "GF", isFinal: true, prize: 46000, points: 36 },

    // MAJOR 2
    { compId: "boston_major", eventKey: "M2", compName: "Boston Major (LAN)", roundName: "Fase Suiza LAN (Agganis Arena)", format: "Bo5", stageType: "SWISS_END", isFinal: false, prize: 25000, points: 18 },
    { compId: "boston_major", eventKey: "M2", compName: "Boston Major (LAN)", roundName: "Cuartos de Final LAN", format: "Bo7", stageType: "QF", isFinal: false, prize: 40000, points: 28 },
    { compId: "boston_major", eventKey: "M2", compName: "Boston Major (LAN)", roundName: "Semifinal LAN", format: "Bo7", stageType: "SF", isFinal: false, prize: 60000, points: 42 },
    { compId: "boston_major", eventKey: "M2", compName: "Boston Major (LAN)", roundName: "Gran Final — Boston Major", format: "Bo7", stageType: "GF", isFinal: true, prize: 120000, points: 70 },

    // MUNDIAL RLCS
    { compId: "rlcs_worlds", eventKey: "WC", compName: "RLCS World Championship", roundName: "Main Event • Fase Suiza", format: "Bo5", stageType: "SWISS_END", isFinal: false, prize: 40000, points: 0 },
    { compId: "rlcs_worlds", eventKey: "WC", compName: "RLCS World Championship", roundName: "Cuartos de Final Mundial", format: "Bo7", stageType: "QF", isFinal: false, prize: 75000, points: 0 },
    { compId: "rlcs_worlds", eventKey: "WC", compName: "RLCS World Championship", roundName: "Semifinal Mundial", format: "Bo7", stageType: "SF", isFinal: false, prize: 110000, points: 0 },
    { compId: "rlcs_worlds", eventKey: "WC", compName: "RLCS World Championship", roundName: "GRAN FINAL MUNDIAL RLCS", format: "Bo7", stageType: "GF", isFinal: true, prize: 260000, points: 0 },

    // CLUB WORLD CUP & FIFAe WORLD CUP
    { compId: "club_wc", eventKey: "CWC", compName: "Club World Cup", roundName: "Semifinal • Club World Cup", format: "Bo7", stageType: "SF", isFinal: false, prize: 80000, points: 0 },
    { compId: "club_wc", eventKey: "CWC", compName: "Club World Cup", roundName: "GRAN FINAL — Club World Cup", format: "Bo7", stageType: "GF", isFinal: true, prize: 220000, points: 0 },

    { compId: "fifae_wc", eventKey: "FIFAe", compName: "FIFAe World Cup (Selecciones)", roundName: "Semifinal • Copa de Naciones", format: "Bo7", stageType: "SF", isFinal: false, prize: 65000, points: 0 },
    { compId: "fifae_wc", eventKey: "FIFAe", compName: "FIFAe World Cup (Selecciones)", roundName: "GRAN FINAL — FIFAe World Cup", format: "Bo7", stageType: "GF", isFinal: true, prize: 160000, points: 0 }
  ],

  newgenPrefixes: ["Kairo", "Vex", "Zynx", "Nox", "Ryze", "Sora", "Kova", "Lumen", "Axl", "Krvn", "Sh4dow", "Ronin", "Fadex", "Zekro", "Tomy", "Valen", "Luka", "Niko", "Dante", "Bauti", "Mati", "Santi", "Kyro", "Zeno", "Riven", "Jett", "Flux", "Vortex", "K1ng", "Hxnter"]
};
