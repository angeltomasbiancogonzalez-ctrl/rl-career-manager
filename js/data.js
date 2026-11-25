const InitialData = {
  // Equipos reales de RLCS por región
  teams: [
    // EUROPA (EU)
    { id: "kc", name: "Karmine Corp", tag: "KC", region: "EU", color1: "#0055ff", color2: "#ffffff", shape: "shield", budget: 250000, points: 0 },
    { id: "vit", name: "Team Vitality", tag: "VIT", region: "EU", color1: "#eab308", color2: "#111827", shape: "hexagon", budget: 240000, points: 0 },
    { id: "m8", name: "Gentle Mates", tag: "M8", region: "EU", color1: "#ec4899", color2: "#ffffff", shape: "diamond", budget: 210000, points: 0 },
    { id: "bds", name: "Team BDS", tag: "BDS", region: "EU", color1: "#f43f5e", color2: "#ffffff", shape: "shield", budget: 220000, points: 0 },
    { id: "oxg", name: "Oxygen Esports", tag: "OXG", region: "EU", color1: "#10b981", color2: "#064e3b", shape: "circle", budget: 180000, points: 0 },

    // NORTEAMÉRICA (NA)
    { id: "g2", name: "G2 Stride", tag: "G2", region: "NA", color1: "#dc2626", color2: "#ffffff", shape: "shield", budget: 240000, points: 0 },
    { id: "geng", name: "Gen.G Mobil1", tag: "GENG", region: "NA", color1: "#f59e0b", color2: "#000000", shape: "hexagon", budget: 230000, points: 0 },
    { id: "ssg", name: "Spacestation", tag: "SSG", region: "NA", color1: "#facc15", color2: "#1e293b", shape: "circle", budget: 195000, points: 0 },
    { id: "col", name: "Complexity", tag: "COL", region: "NA", color1: "#1d4ed8", color2: "#ffffff", shape: "shield", budget: 185000, points: 0 },
    { id: "nrg", name: "NRG Esports", tag: "NRG", region: "NA", color1: "#111827", color2: "#ef4444", shape: "diamond", budget: 190000, points: 0 },

    // SUDAMÉRICA (SAM)
    { id: "fur", name: "FURIA Esports", tag: "FUR", region: "SAM", color1: "#000000", color2: "#ffffff", shape: "shield", budget: 180000, points: 0 },
    { id: "kru", name: "KRÜ Esports", tag: "KRU", region: "SAM", color1: "#ec4899", color2: "#111827", shape: "hexagon", budget: 155000, points: 0 },
    { id: "sec", name: "Team Secret", tag: "SEC", region: "SAM", color1: "#1e293b", color2: "#38bdf8", shape: "diamond", budget: 150000, points: 0 },
    { id: "9z", name: "9z Team", tag: "9Z", region: "SAM", color1: "#7c3aed", color2: "#ffffff", shape: "shield", budget: 145000, points: 0 },
    { id: "lev", name: "Leviatán", tag: "LEV", region: "SAM", color1: "#0284c7", color2: "#ffffff", shape: "circle", budget: 140000, points: 0 },

    // MEDIO ORIENTE (MENA)
    { id: "flc", name: "Team Falcons", tag: "FLC", region: "MENA", color1: "#16a34a", color2: "#ffffff", shape: "shield", budget: 260000, points: 0 },
    { id: "tm", name: "Twisted Minds", tag: "TM", region: "MENA", color1: "#991b1b", color2: "#fbbf24", shape: "hexagon", budget: 175000, points: 0 },
    { id: "r1", name: "Rule One", tag: "R1", region: "MENA", color1: "#2563eb", color2: "#facc15", shape: "diamond", budget: 170000, points: 0 }
  ],

  // Jugadores reales iniciales
  players: [
    // KC
    { id: "p1", name: "vatira", country: "FR", age: 19, ovr: 94, pot: 96, mec: 95, rot: 94, def: 93, teamId: "kc", starter: true, value: 95000 },
    { id: "p2", name: "Atow.", country: "BE", age: 18, ovr: 92, pot: 95, mec: 94, rot: 90, def: 91, teamId: "kc", starter: true, value: 85000 },
    { id: "p3", name: "rise.", country: "GB", age: 21, ovr: 91, pot: 92, mec: 90, rot: 93, def: 90, teamId: "kc", starter: true, value: 80000 },
    // Vitality
    { id: "p4", name: "zen", country: "FR", age: 19, ovr: 96, pot: 98, mec: 98, rot: 95, def: 95, teamId: "vit", starter: true, value: 115000 },
    { id: "p5", name: "ExoTiiK", country: "FR", age: 22, ovr: 91, pot: 92, mec: 90, rot: 92, def: 91, teamId: "vit", starter: true, value: 78000 },
    { id: "p6", name: "Alpha54", country: "FR", age: 22, ovr: 90, pot: 91, mec: 91, rot: 89, def: 90, teamId: "vit", starter: true, value: 75000 },
    // Gentle Mates
    { id: "p7", name: "Seikoo", country: "FR", age: 21, ovr: 91, pot: 93, mec: 92, rot: 91, def: 90, teamId: "m8", starter: true, value: 80000 },
    { id: "p8", name: "itachi", country: "MA", age: 22, ovr: 90, pot: 91, mec: 89, rot: 92, def: 90, teamId: "m8", starter: true, value: 76000 },
    { id: "p9", name: "juicy", country: "FR", age: 19, ovr: 89, pot: 92, mec: 90, rot: 88, def: 89, teamId: "m8", starter: true, value: 72000 },
    // BDS
    { id: "p10", name: "M0nkey M00n", country: "FR", age: 23, ovr: 93, pot: 94, mec: 92, rot: 95, def: 93, teamId: "bds", starter: true, value: 90000 },
    { id: "p11", name: "dralii", country: "MA", age: 18, ovr: 92, pot: 96, mec: 94, rot: 91, def: 90, teamId: "bds", starter: true, value: 88000 },
    { id: "p12", name: "Radosin", country: "FR", age: 21, ovr: 89, pot: 90, mec: 89, rot: 89, def: 89, teamId: "bds", starter: true, value: 70000 },
    // OXG
    { id: "p13", name: "Joyo", country: "GB", age: 20, ovr: 90, pot: 92, mec: 93, rot: 88, def: 88, teamId: "oxg", starter: true, value: 76000 },
    { id: "p14", name: "Archie", country: "GB", age: 20, ovr: 89, pot: 91, mec: 90, rot: 89, def: 88, teamId: "oxg", starter: true, value: 71000 },
    { id: "p15", name: "Oski", country: "GB", age: 18, ovr: 90, pot: 94, mec: 92, rot: 89, def: 89, teamId: "oxg", starter: true, value: 79000 },

    // G2
    { id: "p16", name: "BeastMode", country: "US", age: 20, ovr: 93, pot: 95, mec: 94, rot: 92, def: 93, teamId: "g2", starter: true, value: 92000 },
    { id: "p17", name: "Daniel", country: "US", age: 19, ovr: 93, pot: 96, mec: 95, rot: 91, def: 93, teamId: "g2", starter: true, value: 94000 },
    { id: "p18", name: "Atomic", country: "US", age: 22, ovr: 92, pot: 93, mec: 91, rot: 94, def: 91, teamId: "g2", starter: true, value: 86000 },
    // GenG
    { id: "p19", name: "Firstkiller", country: "US", age: 21, ovr: 93, pot: 94, mec: 95, rot: 92, def: 91, teamId: "geng", starter: true, value: 90000 },
    { id: "p20", name: "ApparentlyJack", country: "GB", age: 22, ovr: 90, pot: 91, mec: 89, rot: 92, def: 90, teamId: "geng", starter: true, value: 77000 },
    { id: "p21", name: "Chronic", country: "US", age: 20, ovr: 90, pot: 92, mec: 91, rot: 90, def: 89, teamId: "geng", starter: true, value: 76000 },
    // SSG
    { id: "p22", name: "Lj", country: "US", age: 20, ovr: 91, pot: 94, mec: 93, rot: 90, def: 90, teamId: "ssg", starter: true, value: 82000 },
    { id: "p23", name: "Hockser", country: "US", age: 23, ovr: 88, pot: 89, mec: 87, rot: 89, def: 88, teamId: "ssg", starter: true, value: 65000 },
    { id: "p24", name: "Chicago", country: "US", age: 24, ovr: 88, pot: 88, mec: 87, rot: 90, def: 87, teamId: "ssg", starter: true, value: 63000 },
    // COL
    { id: "p25", name: "Reysbull", country: "CL", age: 21, ovr: 90, pot: 92, mec: 92, rot: 89, def: 89, teamId: "col", starter: true, value: 78000 },
    { id: "p26", name: "crr", country: "ES", age: 21, ovr: 90, pot: 92, mec: 91, rot: 90, def: 89, teamId: "col", starter: true, value: 77000 },
    { id: "p27", name: "DORITO", country: "ES", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, teamId: "col", starter: true, value: 66000 },
    // NRG
    { id: "p28", name: "jstn.", country: "US", age: 23, ovr: 88, pot: 89, mec: 90, rot: 87, def: 87, teamId: "nrg", starter: true, value: 66000 },
    { id: "p29", name: "GarrettG", country: "US", age: 25, ovr: 87, pot: 87, mec: 85, rot: 89, def: 88, teamId: "nrg", starter: true, value: 58000 },
    { id: "p30", name: "Frosty", country: "US", age: 18, ovr: 87, pot: 92, mec: 89, rot: 86, def: 86, teamId: "nrg", starter: true, value: 68000 },

    // FURIA
    { id: "p31", name: "yanxnz", country: "BR", age: 21, ovr: 93, pot: 95, mec: 95, rot: 92, def: 91, teamId: "fur", starter: true, value: 92000 },
    { id: "p32", name: "Lostt", country: "BR", age: 20, ovr: 91, pot: 94, mec: 93, rot: 90, def: 90, teamId: "fur", starter: true, value: 82000 },
    { id: "p33", name: "DRUFINHO", country: "BR", age: 20, ovr: 90, pot: 92, mec: 90, rot: 91, def: 89, teamId: "fur", starter: true, value: 76000 },
    // KRU
    { id: "p34", name: "shad", country: "AR", age: 23, ovr: 88, pot: 89, mec: 88, rot: 89, def: 87, teamId: "kru", starter: true, value: 64000 },
    { id: "p35", name: "ajg", country: "AR", age: 23, ovr: 88, pot: 89, mec: 87, rot: 89, def: 88, teamId: "kru", starter: true, value: 64000 },
    { id: "p36", name: "Bemmz", country: "BR", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, teamId: "kru", starter: true, value: 66000 },
    // Secret
    { id: "p37", name: "Kv1", country: "BR", age: 21, ovr: 89, pot: 91, mec: 89, rot: 89, def: 90, teamId: "sec", starter: true, value: 70000 },
    { id: "p38", name: "nxghtt", country: "BR", age: 21, ovr: 88, pot: 90, mec: 89, rot: 87, def: 88, teamId: "sec", starter: true, value: 65000 },
    { id: "p39", name: "brad", country: "BR", age: 21, ovr: 88, pot: 90, mec: 88, rot: 88, def: 88, teamId: "sec", starter: true, value: 65000 },
    // 9z
    { id: "p40", name: "Klaus", country: "AR", age: 20, ovr: 86, pot: 89, mec: 87, rot: 86, def: 85, teamId: "9z", starter: true, value: 55000 },
    { id: "p41", name: "Zhearx", country: "AR", age: 19, ovr: 85, pot: 90, mec: 87, rot: 84, def: 84, teamId: "9z", starter: true, value: 54000 },
    { id: "p42", name: "Pepe", country: "CL", age: 19, ovr: 85, pot: 89, mec: 86, rot: 85, def: 84, teamId: "9z", starter: true, value: 52000 },
    // Leviatán
    { id: "p43", name: "Pan", country: "CL", age: 20, ovr: 86, pot: 89, mec: 87, rot: 85, def: 86, teamId: "lev", starter: true, value: 55000 },
    { id: "p44", name: "Davitrox", country: "CL", age: 20, ovr: 85, pot: 88, mec: 86, rot: 85, def: 84, teamId: "lev", starter: true, value: 52000 },
    { id: "p45", name: "Lexim", country: "AR", age: 19, ovr: 85, pot: 89, mec: 86, rot: 84, def: 85, teamId: "lev", starter: true, value: 53000 },

    // Falcons
    { id: "p46", name: "trk511", country: "SA", age: 21, ovr: 94, pot: 95, mec: 95, rot: 93, def: 94, teamId: "flc", starter: true, value: 98000 },
    { id: "p47", name: "Rw9", country: "SA", age: 19, ovr: 93, pot: 96, mec: 94, rot: 92, def: 95, teamId: "flc", starter: true, value: 94000 },
    { id: "p48", name: "Kiileerrz", country: "SA", age: 19, ovr: 93, pot: 96, mec: 95, rot: 92, def: 92, teamId: "flc", starter: true, value: 93000 },
    // Twisted Minds
    { id: "p49", name: "Ahmad", country: "SA", age: 23, ovr: 90, pot: 90, mec: 91, rot: 89, def: 89, teamId: "tm", starter: true, value: 74000 },
    { id: "p50", name: "oKhaliD", country: "SA", age: 24, ovr: 89, pot: 89, mec: 88, rot: 90, def: 90, teamId: "tm", starter: true, value: 70000 },
    { id: "p51", name: "Smw.", country: "SA", age: 21, ovr: 89, pot: 91, mec: 90, rot: 89, def: 88, teamId: "tm", starter: true, value: 71000 },
    // Rule One
    { id: "p52", name: "Nwpo", country: "SA", age: 18, ovr: 92, pot: 96, mec: 95, rot: 90, def: 90, teamId: "r1", starter: true, value: 89000 },
    { id: "p53", name: "M7sn", country: "SA", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, teamId: "r1", starter: true, value: 65000 },
    { id: "p54", name: "Mesho", country: "SA", age: 20, ovr: 88, pot: 90, mec: 89, rot: 87, def: 88, teamId: "r1", starter: true, value: 65000 },

    // Agentes Libres iniciales
    { id: "p55", name: "Squishy", country: "CA", age: 25, ovr: 86, pot: 86, mec: 85, rot: 88, def: 86, teamId: null, starter: false, value: 45000 },
    { id: "p56", name: "Scrub Killa", country: "GB", age: 23, ovr: 86, pot: 87, mec: 87, rot: 85, def: 86, teamId: null, starter: false, value: 46000 },
    { id: "p57", name: "Caard", country: "BR", age: 23, ovr: 87, pot: 88, mec: 87, rot: 87, def: 87, teamId: null, starter: false, value: 50000 },
    { id: "p58", name: "Math", country: "BR", age: 22, ovr: 86, pot: 88, mec: 87, rot: 86, def: 85, teamId: null, starter: false, value: 47000 }
  ],

  // Coaches disponibles e iniciales
  coaches: [
    { id: "c1", name: "Ferra", country: "FR", ovr: 94, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "kc", salary: 35000 },
    { id: "c2", name: "Fairy Peak!", country: "FR", ovr: 92, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: "vit", salary: 30000 },
    { id: "c3", name: "Satthew", country: "US", ovr: 93, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "g2", salary: 32000 },
    { id: "c4", name: "STL", country: "BR", ovr: 90, specialty: "Analista Mecánico (+3% ataque)", teamId: "fur", salary: 26000 },
    { id: "c5", name: "d7oom-24", country: "SA", ovr: 91, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "flc", salary: 28000 },
    { id: "c6", name: "Snaski", country: "GB", ovr: 88, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: null, salary: 22000 },
    { id: "c7", name: "Chrome", country: "US", ovr: 87, specialty: "Analista Mecánico (+3% ataque)", teamId: null, salary: 20000 },
    { id: "c8", name: "Kael", country: "ES", ovr: 86, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: null, salary: 18000 },
    { id: "c9", name: "Papo", country: "AR", ovr: 84, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: null, salary: 15000 }
  ],

  // Ligas Nacionales para mandar canteranos a préstamo y traer reportes locales
  nationalLeagues: [
    {
      id: "liga_arg",
      name: "Liga Argentina de RL",
      country: "AR",
      clubs: ["9z Academy", "Leviatán Rising", "River Plate Gaming", "Boca Juniors Esports", "Malvinas Gaming", "Furious Gaming"]
    },
    {
      id: "liga_chi",
      name: "Liga Chilena de RL",
      country: "CL",
      clubs: ["KRÜ Young", "Cruzados Esports", "Rebirth Esports", "Movistar Optix", "Australs", "Santiago Wanderers RL"]
    },
    {
      id: "liga_bra",
      name: "Liga Brasileña (CBLOL RL)",
      country: "BR",
      clubs: ["FURIA Academy", "MIBR", "LOUD RL", "paiN Gaming", "INTZ", "Fluxo"]
    },
    {
      id: "liga_fra",
      name: "Rocket Baguette League (Francia)",
      country: "FR",
      clubs: ["KC Blue", "Vitality Bee", "Solary", "BDS Academy", "Monaco Esports"]
    },
    {
      id: "liga_na",
      name: "NA Challenger Series",
      country: "US",
      clubs: ["G2 Stride Academy", "Cloud9 Blue", "Shopify Rebellion", "Dignitas NA", "Team Liquid NA"]
    },
    {
      id: "liga_sa",
      name: "Saudi eLeague RL",
      country: "SA",
      clubs: ["Falcons Academy", "Al-Nassr Esports", "Al-Hilal RL", "Geekay Esports"]
    }
  ],

  // Etapas de la temporada competitiva
  seasonStages: [
    { id: "rlcs_regional", name: "Open Regional 1 (Split 1)", format: "Bo5", prize: 25000, points: 20 },
    { id: "rlcs_regional", name: "Open Regional 2 (Split 1)", format: "Bo5", prize: 25000, points: 20 },
    { id: "rlcs_regional", name: "Open Regional 3 (Split 1)", format: "Bo5", prize: 30000, points: 25 },
    { id: "paris_major",   name: "Paris Major (LAN)",          format: "Bo7", prize: 65000, points: 45 },
    { id: "rlcs_regional", name: "Open Regional 4 (Split 2)", format: "Bo5", prize: 25000, points: 20 },
    { id: "rlcs_regional", name: "Open Regional 5 (Split 2)", format: "Bo5", prize: 25000, points: 20 },
    { id: "rlcs_regional", name: "Open Regional 6 (Split 2)", format: "Bo5", prize: 30000, points: 25 },
    { id: "boston_major",  name: "Boston Major (LAN)",         format: "Bo7", prize: 65000, points: 45 },
    { id: "rlcs_worlds",   name: "RLCS World Championship",    format: "Bo7", prize: 120000, points: 0 },
    { id: "club_wc",       name: "Club World Cup",             format: "Bo7", prize: 100000, points: 0 },
    { id: "fifae_wc",      name: "FIFAe World Cup (Selecciones)", format: "Bo7", prize: 80000, points: 0 }
  ],

  // Pool de nombres realistas por si se acaban los personalizados del usuario
  newgenPrefixes: ["Kairo", "Vex", "Zynx", "Nox", "Ryze", "Sora", "Kova", "Lumen", "Axl", "Krvn", "Sh4dow", "Ronin", "Fadex", "Zekro", "Tomy", "Valen", "Luka", "Niko", "Dante", "Bauti", "Mati", "Santi", "Kyro", "Zeno", "Riven", "Jett", "Flux", "Vortex", "K1ng", "Hxnter"]
};
