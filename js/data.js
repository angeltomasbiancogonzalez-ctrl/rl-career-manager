const InitialData = {
  teams: [
    // EUROPA
    { id: "kc", name: "Karmine Corp", tag: "KC", region: "EU", rep: 94, stars: 0, car: "Fennec", arena: "Champions Field", color1: "#0055ff", color2: "#ffffff", shape: "modern", budget: 480000, points: 0 },
    { id: "vit", name: "Team Vitality", tag: "VIT", region: "EU", rep: 95, stars: 2, car: "Fennec", arena: "Mannfield (Night)", color1: "#eab308", color2: "#111827", shape: "hexagon", budget: 500000, points: 0 },
    { id: "m8", name: "Gentle Mates", tag: "M8", region: "EU", rep: 89, stars: 0, car: "Fennec", arena: "DFH Stadium", color1: "#ec4899", color2: "#ffffff", shape: "diamond", budget: 390000, points: 0 },
    { id: "bds", name: "Team BDS", tag: "BDS", region: "EU", rep: 93, stars: 2, car: "Fennec", arena: "Utopia Coliseum", color1: "#f43f5e", color2: "#ffffff", shape: "shield", budget: 450000, points: 0 },
    { id: "oxg", name: "Oxygen Esports", tag: "OXG", region: "EU", rep: 85, stars: 0, car: "Octane", arena: "Beckwith Park", color1: "#10b981", color2: "#064e3b", shape: "circle", budget: 310000, points: 0 },
    { id: "dig", name: "Dignitas EU", tag: "DIG", region: "EU", rep: 84, stars: 1, car: "Octane", arena: "Neo Tokyo", color1: "#f59e0b", color2: "#000000", shape: "shield", budget: 290000, points: 0 },

    // NORTEAMÉRICA
    { id: "g2", name: "G2 Stride", tag: "G2", region: "NA", rep: 94, stars: 0, car: "Octane", arena: "Champions Field", color1: "#dc2626", color2: "#ffffff", shape: "shield", budget: 470000, points: 0 },
    { id: "geng", name: "Gen.G Mobil1", tag: "GENG", region: "NA", rep: 91, stars: 0, car: "Fennec", arena: "Mannfield (Night)", color1: "#f59e0b", color2: "#000000", shape: "hexagon", budget: 420000, points: 0 },
    { id: "ssg", name: "Spacestation", tag: "SSG", region: "NA", rep: 87, stars: 0, car: "Octane", arena: "Starbase ARC", color1: "#facc15", color2: "#1e293b", shape: "circle", budget: 350000, points: 0 },
    { id: "col", name: "Complexity", tag: "COL", region: "NA", rep: 86, stars: 0, car: "Fennec", arena: "DFH Stadium", color1: "#1d4ed8", color2: "#ffffff", shape: "shield", budget: 330000, points: 0 },
    { id: "nrg", name: "NRG Esports", tag: "NRG", region: "NA", rep: 86, stars: 1, car: "Octane", arena: "Champions Field", color1: "#111827", color2: "#ef4444", shape: "diamond", budget: 320000, points: 0 },
    { id: "c9", name: "Cloud9", tag: "C9", region: "NA", rep: 85, stars: 1, car: "Octane", arena: "Utopia Coliseum", color1: "#0284c7", color2: "#ffffff", shape: "circle", budget: 310000, points: 0 },

    // SUDAMÉRICA
    { id: "fur", name: "FURIA Esports", tag: "FUR", region: "SAM", rep: 91, stars: 0, car: "Fennec", arena: "Champions Field", color1: "#000000", color2: "#ffffff", shape: "shield", budget: 360000, points: 0 },
    { id: "kru", name: "KRÜ Esports", tag: "KRU", region: "SAM", rep: 84, stars: 0, car: "Octane", arena: "Mannfield (Night)", color1: "#ec4899", color2: "#111827", shape: "hexagon", budget: 250000, points: 0 },
    { id: "sec", name: "Team Secret", tag: "SEC", region: "SAM", rep: 85, stars: 0, car: "Fennec", arena: "DFH Stadium", color1: "#1e293b", color2: "#38bdf8", shape: "diamond", budget: 260000, points: 0 },
    { id: "9z", name: "9z Team", tag: "9Z", region: "SAM", rep: 81, stars: 0, car: "Octane", arena: "Estadio Único LP", color1: "#7c3aed", color2: "#ffffff", shape: "shield", budget: 210000, points: 0 },
    { id: "lev", name: "Leviatán", tag: "LEV", region: "SAM", rep: 80, stars: 0, car: "Fennec", arena: "AquaDome", color1: "#0284c7", color2: "#ffffff", shape: "circle", budget: 200000, points: 0 },
    { id: "nip", name: "Ninjas in Pyjamas", tag: "NIP", region: "SAM", rep: 83, stars: 0, car: "Fennec", arena: "Neo Tokyo", color1: "#84cc16", color2: "#111827", shape: "hexagon", budget: 240000, points: 0 },

    // MEDIO ORIENTE
    { id: "flc", name: "Team Falcons", tag: "FLC", region: "MENA", rep: 94, stars: 0, car: "Fennec", arena: "Salty Shores", color1: "#16a34a", color2: "#ffffff", shape: "modern", budget: 550000, points: 0 },
    { id: "tm", name: "Twisted Minds", tag: "TM", region: "MENA", rep: 86, stars: 0, car: "Octane", arena: "Deadeye Canyon", color1: "#991b1b", color2: "#fbbf24", shape: "hexagon", budget: 320000, points: 0 },
    { id: "r1", name: "Rule One", tag: "R1", region: "MENA", rep: 87, stars: 0, car: "Fennec", arena: "Champions Field", color1: "#2563eb", color2: "#facc15", shape: "diamond", budget: 340000, points: 0 },
    { id: "gk", name: "Geekay Esports", tag: "GK", region: "MENA", rep: 81, stars: 0, car: "Octane", arena: "Mannfield (Night)", color1: "#f97316", color2: "#ffffff", shape: "circle", budget: 220000, points: 0 }
  ],

  players: [
    // EU
    { id: "p1", name: "vatira", country: "FR", age: 19, ovr: 94, pot: 96, mec: 95, rot: 94, def: 93, role: "Third Man", contractYears: 2, teamId: "kc", starter: true, value: 820000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p2", name: "Atow.", country: "BE", age: 18, ovr: 92, pot: 95, mec: 94, rot: 90, def: 91, role: "Striker", contractYears: 2, teamId: "kc", starter: true, value: 710000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p3", name: "rise.", country: "GB", age: 21, ovr: 91, pot: 92, mec: 90, rot: 93, def: 90, role: "Playmaker", contractYears: 2, teamId: "kc", starter: true, value: 640000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p4", name: "zen", country: "FR", age: 19, ovr: 96, pot: 98, mec: 98, rot: 95, def: 95, role: "Striker", contractYears: 3, teamId: "vit", starter: true, value: 950000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p5", name: "ExoTiiK", country: "FR", age: 22, ovr: 91, pot: 92, mec: 90, rot: 92, def: 91, role: "Playmaker", contractYears: 2, teamId: "vit", starter: true, value: 620000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p6", name: "Alpha54", country: "FR", age: 22, ovr: 90, pot: 91, mec: 91, rot: 89, def: 90, role: "Third Man", contractYears: 1, teamId: "vit", starter: true, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p7", name: "Seikoo", country: "FR", age: 21, ovr: 91, pot: 93, mec: 92, rot: 91, def: 90, role: "Striker", contractYears: 2, teamId: "m8", starter: true, value: 630000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p8", name: "itachi", country: "MA", age: 22, ovr: 90, pot: 91, mec: 89, rot: 92, def: 90, role: "Playmaker", contractYears: 2, teamId: "m8", starter: true, value: 570000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p9", name: "juicy", country: "FR", age: 19, ovr: 89, pot: 92, mec: 90, rot: 88, def: 89, role: "Third Man", contractYears: 2, teamId: "m8", starter: true, value: 510000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p10", name: "M0nkey M00n", country: "FR", age: 23, ovr: 93, pot: 94, mec: 92, rot: 95, def: 93, role: "Third Man", contractYears: 2, teamId: "bds", starter: true, value: 780000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p11", name: "dralii", country: "MA", age: 18, ovr: 92, pot: 96, mec: 94, rot: 91, def: 90, role: "Striker", contractYears: 3, teamId: "bds", starter: true, value: 740000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p12", name: "Radosin", country: "FR", age: 21, ovr: 89, pot: 90, mec: 89, rot: 89, def: 89, role: "Playmaker", contractYears: 1, teamId: "bds", starter: true, value: 490000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p13", name: "Joyo", country: "GB", age: 20, ovr: 90, pot: 92, mec: 93, rot: 88, def: 88, role: "Striker", contractYears: 2, teamId: "oxg", starter: true, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p14", name: "Archie", country: "GB", age: 20, ovr: 89, pot: 91, mec: 90, rot: 89, def: 88, role: "Third Man", contractYears: 2, teamId: "oxg", starter: true, value: 490000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p15", name: "Oski", country: "GB", age: 18, ovr: 90, pot: 94, mec: 92, rot: 89, def: 89, role: "Playmaker", contractYears: 2, teamId: "oxg", starter: true, value: 600000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p59", name: "noly", country: "GB", age: 23, ovr: 87, pot: 88, mec: 86, rot: 89, def: 87, role: "Playmaker", contractYears: 1, teamId: "dig", starter: true, value: 370000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p60", name: "Joreuz", country: "NL", age: 21, ovr: 88, pot: 90, mec: 90, rot: 87, def: 87, role: "Striker", contractYears: 2, teamId: "dig", starter: true, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p61", name: "ivn", country: "DE", age: 21, ovr: 86, pot: 88, mec: 86, rot: 87, def: 86, role: "Third Man", contractYears: 2, teamId: "dig", starter: true, value: 330000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // NA
    { id: "p16", name: "BeastMode", country: "US", age: 20, ovr: 93, pot: 95, mec: 94, rot: 92, def: 93, role: "Striker", contractYears: 2, teamId: "g2", starter: true, value: 790000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p17", name: "Daniel", country: "US", age: 19, ovr: 93, pot: 96, mec: 95, rot: 91, def: 93, role: "Third Man", contractYears: 3, teamId: "g2", starter: true, value: 810000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p18", name: "Atomic", country: "US", age: 22, ovr: 92, pot: 93, mec: 91, rot: 94, def: 91, role: "Playmaker", contractYears: 2, teamId: "g2", starter: true, value: 700000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p19", name: "Firstkiller", country: "US", age: 21, ovr: 93, pot: 94, mec: 95, rot: 92, def: 91, role: "Striker", contractYears: 2, teamId: "geng", starter: true, value: 780000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p20", name: "ApparentlyJack", country: "GB", age: 22, ovr: 90, pot: 91, mec: 89, rot: 92, def: 90, role: "Playmaker", contractYears: 2, teamId: "geng", starter: true, value: 570000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p21", name: "Chronic", country: "US", age: 20, ovr: 90, pot: 92, mec: 91, rot: 90, def: 89, role: "Third Man", contractYears: 2, teamId: "geng", starter: true, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p22", name: "Lj", country: "US", age: 20, ovr: 91, pot: 94, mec: 93, rot: 90, def: 90, role: "Striker", contractYears: 2, teamId: "ssg", starter: true, value: 640000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p23", name: "Hockser", country: "US", age: 23, ovr: 88, pot: 89, mec: 87, rot: 89, def: 88, role: "Third Man", contractYears: 1, teamId: "ssg", starter: true, value: 420000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p24", name: "Chicago", country: "US", age: 24, ovr: 88, pot: 88, mec: 87, rot: 90, def: 87, role: "Playmaker", contractYears: 1, teamId: "ssg", starter: true, value: 400000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p25", name: "Reysbull", country: "CL", age: 21, ovr: 90, pot: 92, mec: 92, rot: 89, def: 89, role: "Striker", contractYears: 2, teamId: "col", starter: true, value: 570000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p26", name: "crr", country: "ES", age: 21, ovr: 90, pot: 92, mec: 91, rot: 90, def: 89, role: "Playmaker", contractYears: 2, teamId: "col", starter: true, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p27", name: "DORITO", country: "ES", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, role: "Third Man", contractYears: 2, teamId: "col", starter: true, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p28", name: "jstn.", country: "US", age: 23, ovr: 88, pot: 89, mec: 90, rot: 87, def: 87, role: "Striker", contractYears: 1, teamId: "nrg", starter: true, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p29", name: "GarrettG", country: "US", age: 25, ovr: 87, pot: 87, mec: 85, rot: 89, def: 88, role: "Third Man", contractYears: 1, teamId: "nrg", starter: true, value: 350000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p30", name: "Frosty", country: "US", age: 18, ovr: 87, pot: 92, mec: 89, rot: 86, def: 86, role: "Playmaker", contractYears: 2, teamId: "nrg", starter: true, value: 440000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p62", name: "comm", country: "US", age: 21, ovr: 87, pot: 89, mec: 87, rot: 88, def: 87, role: "Playmaker", contractYears: 2, teamId: "c9", starter: true, value: 380000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p63", name: "Aqua", country: "US", age: 19, ovr: 87, pot: 91, mec: 89, rot: 86, def: 86, role: "Striker", contractYears: 2, teamId: "c9", starter: true, value: 410000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p64", name: "Evoh", country: "US", age: 19, ovr: 86, pot: 90, mec: 88, rot: 85, def: 85, role: "Third Man", contractYears: 2, teamId: "c9", starter: true, value: 360000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // SAM
    { id: "p31", name: "yanxnz", country: "BR", age: 21, ovr: 93, pot: 95, mec: 95, rot: 92, def: 91, role: "Striker", contractYears: 2, teamId: "fur", starter: true, value: 790000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p32", name: "Lostt", country: "BR", age: 20, ovr: 91, pot: 94, mec: 93, rot: 90, def: 90, role: "Playmaker", contractYears: 2, teamId: "fur", starter: true, value: 640000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p33", name: "DRUFINHO", country: "BR", age: 20, ovr: 90, pot: 92, mec: 90, rot: 91, def: 89, role: "Third Man", contractYears: 2, teamId: "fur", starter: true, value: 560000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p34", name: "shad", country: "AR", age: 23, ovr: 88, pot: 89, mec: 88, rot: 89, def: 87, role: "Striker", contractYears: 2, teamId: "kru", starter: true, value: 410000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p35", name: "ajg", country: "AR", age: 23, ovr: 88, pot: 89, mec: 87, rot: 89, def: 88, role: "Third Man", contractYears: 2, teamId: "kru", starter: true, value: 410000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p36", name: "Bemmz", country: "BR", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, role: "Playmaker", contractYears: 2, teamId: "kru", starter: true, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p37", name: "Kv1", country: "BR", age: 21, ovr: 89, pot: 91, mec: 89, rot: 89, def: 90, role: "Third Man", contractYears: 2, teamId: "sec", starter: true, value: 490000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p38", name: "nxghtt", country: "BR", age: 21, ovr: 88, pot: 90, mec: 89, rot: 87, def: 88, role: "Striker", contractYears: 2, teamId: "sec", starter: true, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p39", name: "brad", country: "BR", age: 21, ovr: 88, pot: 90, mec: 88, rot: 88, def: 88, role: "Playmaker", contractYears: 2, teamId: "sec", starter: true, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p40", name: "Klaus", country: "AR", age: 20, ovr: 86, pot: 89, mec: 87, rot: 86, def: 85, role: "Striker", contractYears: 2, teamId: "9z", starter: true, value: 330000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p41", name: "Zhearx", country: "AR", age: 19, ovr: 85, pot: 90, mec: 87, rot: 84, def: 84, role: "Playmaker", contractYears: 2, teamId: "9z", starter: true, value: 310000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p42", name: "Pepe", country: "CL", age: 19, ovr: 85, pot: 89, mec: 86, rot: 85, def: 84, role: "Third Man", contractYears: 2, teamId: "9z", starter: true, value: 300000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p43", name: "Pan", country: "CL", age: 20, ovr: 86, pot: 89, mec: 87, rot: 85, def: 86, role: "Striker", contractYears: 2, teamId: "lev", starter: true, value: 330000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p44", name: "Davitrox", country: "CL", age: 20, ovr: 85, pot: 88, mec: 86, rot: 85, def: 84, role: "Playmaker", contractYears: 2, teamId: "lev", starter: true, value: 300000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p45", name: "Lexim", country: "AR", age: 19, ovr: 85, pot: 89, mec: 86, rot: 84, def: 85, role: "Third Man", contractYears: 2, teamId: "lev", starter: true, value: 305000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p65", name: "Aztromick", country: "BR", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, role: "Playmaker", contractYears: 2, teamId: "nip", starter: true, value: 430000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p66", name: "Motta", country: "BR", age: 19, ovr: 88, pot: 92, mec: 90, rot: 87, def: 87, role: "Striker", contractYears: 2, teamId: "nip", starter: true, value: 460000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p67", name: "swiftt", country: "BR", age: 18, ovr: 87, pot: 92, mec: 89, rot: 86, def: 86, role: "Third Man", contractYears: 2, teamId: "nip", starter: true, value: 420000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // MENA
    { id: "p46", name: "trk511", country: "SA", age: 21, ovr: 94, pot: 95, mec: 95, rot: 93, def: 94, role: "Playmaker", contractYears: 3, teamId: "flc", starter: true, value: 840000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p47", name: "Rw9", country: "SA", age: 19, ovr: 93, pot: 96, mec: 94, rot: 92, def: 95, role: "Third Man", contractYears: 3, teamId: "flc", starter: true, value: 810000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p48", name: "Kiileerrz", country: "SA", age: 19, ovr: 93, pot: 96, mec: 95, rot: 92, def: 92, role: "Striker", contractYears: 3, teamId: "flc", starter: true, value: 800000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p49", name: "Ahmad", country: "SA", age: 23, ovr: 90, pot: 90, mec: 91, rot: 89, def: 89, role: "Striker", contractYears: 2, teamId: "tm", starter: true, value: 530000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p50", name: "oKhaliD", country: "SA", age: 24, ovr: 89, pot: 89, mec: 88, rot: 90, def: 90, role: "Third Man", contractYears: 1, teamId: "tm", starter: true, value: 470000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p51", name: "Smw.", country: "SA", age: 21, ovr: 89, pot: 91, mec: 90, rot: 89, def: 88, role: "Playmaker", contractYears: 2, teamId: "tm", starter: true, value: 490000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p52", name: "Nwpo", country: "SA", age: 18, ovr: 92, pot: 96, mec: 95, rot: 90, def: 90, role: "Striker", contractYears: 3, teamId: "r1", starter: true, value: 750000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p53", name: "M7sn", country: "SA", age: 21, ovr: 88, pot: 90, mec: 89, rot: 88, def: 87, role: "Playmaker", contractYears: 2, teamId: "r1", starter: true, value: 420000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p54", name: "Mesho", country: "SA", age: 20, ovr: 88, pot: 90, mec: 89, rot: 87, def: 88, role: "Third Man", contractYears: 2, teamId: "r1", starter: true, value: 420000, goals: 0, assists: 0, saves: 0, streak: 0 },

    { id: "p68", name: "Senzo", country: "SA", age: 23, ovr: 86, pot: 87, mec: 86, rot: 87, def: 86, role: "Third Man", contractYears: 2, teamId: "gk", starter: true, value: 310000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p69", name: "T7LM", country: "SA", age: 21, ovr: 86, pot: 88, mec: 87, rot: 85, def: 86, role: "Striker", contractYears: 2, teamId: "gk", starter: true, value: 320000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p70", name: "ix.", country: "SA", age: 19, ovr: 85, pot: 89, mec: 86, rot: 85, def: 84, role: "Playmaker", contractYears: 2, teamId: "gk", starter: true, value: 300000, goals: 0, assists: 0, saves: 0, streak: 0 },

    // Agentes libres
    { id: "p55", name: "Squishy", country: "CA", age: 25, ovr: 86, pot: 86, mec: 85, rot: 88, def: 86, role: "Playmaker", contractYears: 0, teamId: null, starter: false, value: 190000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p56", name: "Scrub Killa", country: "GB", age: 23, ovr: 86, pot: 87, mec: 87, rot: 85, def: 86, role: "Striker", contractYears: 0, teamId: null, starter: false, value: 210000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p57", name: "Caard", country: "BR", age: 23, ovr: 87, pot: 88, mec: 87, rot: 87, def: 87, role: "Third Man", contractYears: 0, teamId: null, starter: false, value: 240000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p58", name: "Math", country: "BR", age: 22, ovr: 86, pot: 88, mec: 87, rot: 86, def: 85, role: "Striker", contractYears: 0, teamId: null, starter: false, value: 215000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p71", name: "Royales", country: "AR", age: 21, ovr: 83, pot: 87, mec: 84, rot: 83, def: 82, role: "Playmaker", contractYears: 0, teamId: null, starter: false, value: 135000, goals: 0, assists: 0, saves: 0, streak: 0 },
    { id: "p72", name: "Pancho", country: "CL", age: 20, ovr: 82, pot: 87, mec: 83, rot: 82, def: 81, role: "Third Man", contractYears: 0, teamId: null, starter: false, value: 120000, goals: 0, assists: 0, saves: 0, streak: 0 }
  ],

  coaches: [
    { id: "c1", name: "Ferra", country: "FR", ovr: 94, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "kc", salary: 140000 },
    { id: "c2", name: "Fairy Peak!", country: "FR", ovr: 92, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: "vit", salary: 120000 },
    { id: "c3", name: "Satthew", country: "US", ovr: 93, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "g2", salary: 130000 },
    { id: "c4", name: "STL", country: "BR", ovr: 90, specialty: "Analista Mecánico (+3% ataque)", teamId: "fur", salary: 105000 },
    { id: "c5", name: "d7oom-24", country: "SA", ovr: 91, specialty: "Estratega LAN (+4% en Majors/Mundiales)", teamId: "flc", salary: 115000 },
    { id: "c6", name: "Snaski", country: "GB", ovr: 88, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: null, salary: 85000 },
    { id: "c7", name: "Chrome", country: "US", ovr: 87, specialty: "Analista Mecánico (+3% ataque)", teamId: null, salary: 78000 },
    { id: "c8", name: "Kael", country: "ES", ovr: 86, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: null, salary: 70000 },
    { id: "c9", name: "Papo", country: "AR", ovr: 84, specialty: "Formador de Talento (+35% progreso juvenil)", teamId: null, salary: 55000 }
  ],

  sponsors: [
    { id: "sp_hyperx", name: "HyperX Gaming", upfront: 45000, bonusDesc: "+$30,000 por cada título ganado" },
    { id: "sp_redbull", name: "Red Bull Esports", upfront: 65000, bonusDesc: "+$55,000 al ganar un Major o Mundial" },
    { id: "sp_nvidia", name: "NVIDIA GeForce", upfront: 80000, bonusDesc: "+$20,000 si mantenés Química > 88%" }
  ],

  // Perfiles variados de juveniles (12 a 14 años, de Champion III a SSL)
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
    {
      id: "liga_chi",
      name: "Liga Chilena de RL (Primera División)",
      country: "CL",
      clubs: ["Cobresal Esports", "Universidad Católica RL", "Palestino Gaming", "Everton Viña RL", "Santiago Morning", "Coquimbo Unido", "Deportes Iquique", "Rangers Talca", "Ñublense RL", "Unión La Calera"]
    },
    {
      id: "liga_arg",
      name: "Liga Argentina de RL (LVP / AFA Esports)",
      country: "AR",
      clubs: ["9z Academy", "Leviatán Rising", "River Plate Gaming", "Boca Juniors Esports", "Estudiantes LP Esports", "Gimnasia LP Gaming", "Racing Club RL", "Independiente Esports", "Malvinas Gaming", "Furious Gaming"]
    },
    {
      id: "liga_bra",
      name: "Liga Brasileña (CBLOL Rocket League)",
      country: "BR",
      clubs: ["FURIA Academy", "MIBR", "LOUD RL", "paiN Gaming", "INTZ", "Fluxo", "KaBuM! Esports", "RED Canids"]
    },
    {
      id: "liga_fra",
      name: "Rocket Baguette League (Francia)",
      country: "FR",
      clubs: ["KC Blue", "Vitality Bee", "Solary", "BDS Academy", "Monaco Esports", "Gentle Mates Academy"]
    },
    {
      id: "liga_na",
      name: "NA Challenger Series",
      country: "US",
      clubs: ["G2 Stride Academy", "Cloud9 Blue", "Shopify Rebellion", "Dignitas NA", "Team Liquid NA", "TSM RL"]
    },
    {
      id: "liga_sa",
      name: "Saudi eLeague RL",
      country: "SA",
      clubs: ["Falcons Academy", "Al-Nassr Esports", "Al-Hilal RL", "Al-Ittihad Gaming", "Twisted Academy"]
    }
  ],

  seasonSchedule: [
    { compId: "rlcs_regional", compName: "Open Regional 1", roundName: "Fase Suiza • Ronda 1", format: "Bo5", isFinal: false, prize: 12000, points: 10 },
    { compId: "rlcs_regional", compName: "Open Regional 1", roundName: "Cuartos de Final", format: "Bo5", isFinal: false, prize: 18000, points: 15 },
    { compId: "rlcs_regional", compName: "Open Regional 1", roundName: "Semifinal", format: "Bo7", isFinal: false, prize: 25000, points: 20 },
    { compId: "rlcs_regional", compName: "Open Regional 1", roundName: "Gran Final Regional", format: "Bo7", isFinal: true, prize: 45000, points: 35 },

    { compId: "rlcs_regional", compName: "Open Regional 2", roundName: "Fase Suiza • Ronda 1", format: "Bo5", isFinal: false, prize: 12000, points: 10 },
    { compId: "rlcs_regional", compName: "Open Regional 2", roundName: "Cuartos de Final", format: "Bo5", isFinal: false, prize: 18000, points: 15 },
    { compId: "rlcs_regional", compName: "Open Regional 2", roundName: "Semifinal", format: "Bo7", isFinal: false, prize: 25000, points: 20 },
    { compId: "rlcs_regional", compName: "Open Regional 2", roundName: "Gran Final Regional", format: "Bo7", isFinal: true, prize: 45000, points: 35 },

    { compId: "paris_major", compName: "Paris Major (LAN)", roundName: "Fase de Grupos LAN", format: "Bo5", isFinal: false, prize: 25000, points: 20 },
    { compId: "paris_major", compName: "Paris Major (LAN)", roundName: "Cuartos de Final (Accor Arena)", format: "Bo7", isFinal: false, prize: 40000, points: 30 },
    { compId: "paris_major", compName: "Paris Major (LAN)", roundName: "Semifinal LAN", format: "Bo7", isFinal: false, prize: 60000, points: 45 },
    { compId: "paris_major", compName: "Paris Major (LAN)", roundName: "Gran Final — Paris Major", format: "Bo7", isFinal: true, prize: 120000, points: 75 },

    { compId: "rlcs_regional", compName: "Open Regional 3", roundName: "Fase Suiza • Ronda 1", format: "Bo5", isFinal: false, prize: 14000, points: 12 },
    { compId: "rlcs_regional", compName: "Open Regional 3", roundName: "Semifinal Regional", format: "Bo7", isFinal: false, prize: 28000, points: 22 },
    { compId: "rlcs_regional", compName: "Open Regional 3", roundName: "Gran Final Regional", format: "Bo7", isFinal: true, prize: 50000, points: 40 },

    { compId: "boston_major", compName: "Boston Major (LAN)", roundName: "Fase de Grupos LAN", format: "Bo5", isFinal: false, prize: 25000, points: 20 },
    { compId: "boston_major", compName: "Boston Major (LAN)", roundName: "Cuartos de Final (Agganis Arena)", format: "Bo7", isFinal: false, prize: 40000, points: 30 },
    { compId: "boston_major", compName: "Boston Major (LAN)", roundName: "Semifinal LAN", format: "Bo7", isFinal: false, prize: 60000, points: 45 },
    { compId: "boston_major", compName: "Boston Major (LAN)", roundName: "Gran Final — Boston Major", format: "Bo7", isFinal: true, prize: 120000, points: 75 },

    { compId: "rlcs_worlds", compName: "RLCS World Championship", roundName: "Main Event • Grupos", format: "Bo5", isFinal: false, prize: 40000, points: 0 },
    { compId: "rlcs_worlds", compName: "RLCS World Championship", roundName: "Cuartos de Final Mundial", format: "Bo7", isFinal: false, prize: 75000, points: 0 },
    { compId: "rlcs_worlds", compName: "RLCS World Championship", roundName: "Semifinal Mundial", format: "Bo7", isFinal: false, prize: 110000, points: 0 },
    { compId: "rlcs_worlds", compName: "RLCS World Championship", roundName: "GRAN FINAL MUNDIAL RLCS", format: "Bo7", isFinal: true, prize: 260000, points: 0 },

    { compId: "club_wc", compName: "Club World Cup", roundName: "Cuartos de Final • Club WC", format: "Bo7", isFinal: false, prize: 60000, points: 0 },
    { compId: "club_wc", compName: "Club World Cup", roundName: "Semifinal • Club WC", format: "Bo7", isFinal: false, prize: 95000, points: 0 },
    { compId: "club_wc", compName: "Club World Cup", roundName: "GRAN FINAL — Club World Cup", format: "Bo7", isFinal: true, prize: 220000, points: 0 },

    { compId: "fifae_wc", compName: "FIFAe World Cup (Selecciones)", roundName: "Cuartos de Final • Naciones", format: "Bo7", isFinal: false, prize: 45000, points: 0 },
    { compId: "fifae_wc", compName: "FIFAe World Cup (Selecciones)", roundName: "Semifinal • Naciones", format: "Bo7", isFinal: false, prize: 75000, points: 0 },
    { compId: "fifae_wc", compName: "FIFAe World Cup (Selecciones)", roundName: "GRAN FINAL — FIFAe World Cup", format: "Bo7", isFinal: true, prize: 160000, points: 0 }
  ],

  newgenPrefixes: ["Kairo", "Vex", "Zynx", "Nox", "Ryze", "Sora", "Kova", "Lumen", "Axl", "Krvn", "Sh4dow", "Ronin", "Fadex", "Zekro", "Tomy", "Valen", "Luka", "Niko", "Dante", "Bauti", "Mati", "Santi", "Kyro", "Zeno", "Riven", "Jett", "Flux", "Vortex", "K1ng", "Hxnter"]
};
