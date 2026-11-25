const Graphics = {
  flags: {
    AR: "🇦🇷", CL: "🇨🇱", BR: "🇧🇷", FR: "🇫🇷", US: "🇺🇸",
    SA: "🇸🇦", ES: "🇪🇸", GB: "🇬🇧", DE: "🇩🇪", NL: "🇳🇱",
    BE: "🇧🇪", CA: "🇨🇦", MA: "🇲🇦", JP: "🇯🇵", AU: "🇦🇺"
  },

  countryNames: {
    AR: "Argentina", CL: "Chile", BR: "Brasil", FR: "Francia", US: "Estados Unidos",
    SA: "Arabia Saudita", ES: "España", GB: "Reino Unido", DE: "Alemania",
    NL: "Países Bajos", BE: "Bélgica", CA: "Canadá", MA: "Marruecos"
  },

  getFlag(code) {
    return this.flags[code] || "🌐";
  },

  renderStarsSVG(starsCount) {
    if (!starsCount || starsCount <= 0) return "";
    const count = Math.min(starsCount, 6);
    let stars = "";
    const startX = 50 - (count - 1) * 8;
    for (let i = 0; i < count; i++) {
      const cx = startX + i * 16;
      stars += `<polygon points="${cx},2 ${cx+2},6.8 ${cx+7},6.8 ${cx+3},10 ${cx+4.5},14.8 ${cx},11.8 ${cx-4.5},14.8 ${cx-3},10 ${cx-7},6.8 ${cx-2},6.8" fill="#facc15" stroke="#854d0e" stroke-width="0.8"/>`;
    }
    return stars;
  },

  renderCrest(team, size = 56) {
    if (!team) return "";
    if (team.logoUrl && team.logoUrl.trim() !== "") {
      return `<img src="${team.logoUrl}" alt="${team.tag}" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:8px;" />`;
    }

    const starsSvg = this.renderStarsSVG(team.stars || 0);
    const id = team.id || "";
    let inner = "";

    if (id === "kc") {
      inner = `
        <path d="M16,22 L50,16 L84,22 L80,62 L50,94 L20,62 Z" fill="#0055ff" stroke="#ffffff" stroke-width="4.5"/>
        <path d="M24,28 L50,23 L76,28 L72,58 L50,84 L28,58 Z" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <text x="50" y="61" font-family="Arial Black, sans-serif" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle">KC</text>
      `;
    } else if (id === "vit") {
      inner = `
        <polygon points="50,17 85,35 85,73 50,93 15,73 15,35" fill="#111827" stroke="#eab308" stroke-width="5"/>
        <polygon points="50,25 76,39 76,69 50,84 24,69 24,39" fill="#eab308"/>
        <path d="M32,42 L50,68 L68,42 L58,42 L50,55 L42,42 Z" fill="#111827"/>
      `;
    } else if (id === "m8") {
      inner = `
        <polygon points="50,16 88,54 50,94 12,54" fill="#0f172a" stroke="#ec4899" stroke-width="5"/>
        <path d="M31,68 V42 L50,58 L69,42 V68" fill="none" stroke="#ec4899" stroke-width="6.5" stroke-linejoin="round"/>
      `;
    } else if (id === "bds") {
      inner = `
        <path d="M18,22 L34,30 L50,18 L66,30 L82,22 L78,64 L50,94 L22,64 Z" fill="#e11d48" stroke="#ffffff" stroke-width="4"/>
        <text x="50" y="65" font-family="Arial Black, sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">BDS</text>
      `;
    } else if (id === "g2") {
      inner = `
        <path d="M18,22 H82 L76,68 L50,94 L24,68 Z" fill="#111827" stroke="#dc2626" stroke-width="5"/>
        <path d="M26,34 L46,46 L28,54 Z M74,34 L54,46 L72,54 Z" fill="#dc2626"/>
        <text x="50" y="76" font-family="Arial Black, sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">G2</text>
      `;
    } else if (id === "geng") {
      inner = `
        <polygon points="50,17 85,34 80,74 50,94 20,74 15,34" fill="#090d16" stroke="#f59e0b" stroke-width="5"/>
        <path d="M34,34 L42,74 M48,30 L52,78 M64,34 L58,74" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round"/>
      `;
    } else if (id === "fur") {
      inner = `
        <path d="M16,20 H84 L80,62 L50,94 L20,62 Z" fill="#09090b" stroke="#ffffff" stroke-width="4.5"/>
        <path d="M30,34 L66,46 L34,56 L70,68" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
      `;
    } else if (id === "kru") {
      inner = `
        <polygon points="50,17 86,36 86,74 50,94 14,74 14,36" fill="#111827" stroke="#f43f5e" stroke-width="5"/>
        <text x="50" y="63" font-family="Arial Black, sans-serif" font-weight="900" font-size="23" fill="#f43f5e" text-anchor="middle">KRÜ</text>
      `;
    } else if (id === "9z") {
      inner = `
        <path d="M18,20 H82 V58 C82,78 50,94 50,94 C50,94 18,78 18,58 Z" fill="#6d28d9" stroke="#ffffff" stroke-width="4.5"/>
        <text x="50" y="64" font-family="Arial Black, sans-serif" font-weight="900" font-size="27" fill="#ffffff" text-anchor="middle">9Z</text>
      `;
    } else if (id === "lev") {
      inner = `
        <circle cx="50" cy="55" r="38" fill="#0369a1" stroke="#38bdf8" stroke-width="5"/>
        <path d="M34,42 V62 C34,70 66,70 66,62 V42 M50,34 V74" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
      `;
    } else if (id === "flc") {
      inner = `
        <path d="M16,22 L50,16 L84,22 L78,66 L50,94 L22,66 Z" fill="#15803d" stroke="#ffffff" stroke-width="4.5"/>
        <path d="M26,40 L50,54 L74,40 L66,62 L50,74 L34,62 Z" fill="#ffffff"/>
      `;
    } else {
      const c1 = team.color1 || "#00a8ff";
      const c2 = team.color2 || "#ffffff";
      const shape = team.shape || "shield";
      const pattern = team.pattern || "solid";
      const tag = (team.tag || "RL").slice(0, 4).toUpperCase();
      const clipId = "clip_" + Math.random().toString(36).slice(2, 8);

      let shapePath = `<path d="M16,20 H84 V56 C84,78 50,94 50,94 C50,94 16,78 16,56 Z"`;
      if (shape === "hexagon") shapePath = `<polygon points="50,17 86,36 86,74 50,94 14,74 14,36"`;
      else if (shape === "circle") shapePath = `<circle cx="50" cy="55" r="38"`;
      else if (shape === "diamond") shapePath = `<polygon points="50,16 88,55 50,94 12,55"`;
      else if (shape === "modern") shapePath = `<path d="M18,22 L50,16 L82,22 L78,64 L50,94 L22,64 Z"`;

      let patternSvg = "";
      if (pattern === "stripes") {
        patternSvg = `<rect x="33" y="16" width="11" height="80" fill="${c2}" fill-opacity="0.35"/><rect x="56" y="16" width="11" height="80" fill="${c2}" fill-opacity="0.35"/>`;
      } else if (pattern === "diagonal") {
        patternSvg = `<polygon points="10,75 75,15 90,15 25,95" fill="${c2}" fill-opacity="0.35"/>`;
      } else if (pattern === "half") {
        patternSvg = `<rect x="50" y="16" width="40" height="80" fill="${c2}" fill-opacity="0.28"/>`;
      }

      inner = `
        <defs><clipPath id="${clipId}">${shapePath}/></clipPath></defs>
        ${shapePath} fill="${c1}" stroke="${c2}" stroke-width="5"/>
        <g clip-path="url(#${clipId})">${patternSvg}</g>
        ${shapePath} fill="none" stroke="${c2}" stroke-width="5"/>
        <text x="50" y="64" font-family="Arial Black, sans-serif" font-weight="900" font-size="22" fill="${c2}" text-anchor="middle" stroke="#000" stroke-width="1.3">${tag}</text>
      `;
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        ${starsSvg}
        ${inner}
      </svg>
    `;
  },

  renderTrophy(compId, size = 48) {
    const palettes = {
      rlcs_regional: { main: "#38bdf8", trim: "#0284c7", label: "RLCS" },
      challenger_cup:{ main: "#a78bfa", trim: "#6d28d9", label: "CHAL" },
      paris_major:   { main: "#e879f9", trim: "#a21caf", label: "PARIS" },
      boston_major:  { main: "#f87171", trim: "#b91c1c", label: "BOSTON" },
      rlcs_lcq:      { main: "#fb923c", trim: "#c2410c", label: "LCQ" },
      rlcs_worlds:   { main: "#fbbf24", trim: "#d97706", label: "WORLDS" },
      club_wc:       { main: "#34d399", trim: "#059669", label: "CWC" },
      fifae_wc:      { main: "#facc15", trim: "#ca8a04", label: "FIFAe" }
    };
    const p = palettes[compId] || palettes.rlcs_regional;

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,18 H70 L64,54 C62,66 38,66 36,54 Z" fill="${p.main}" stroke="${p.trim}" stroke-width="4"/>
        <path d="M30,24 H16 C16,42 26,46 34,46" fill="none" stroke="${p.main}" stroke-width="5"/>
        <path d="M70,24 H84 C84,42 74,46 66,46" fill="none" stroke="${p.main}" stroke-width="5"/>
        <rect x="44" y="63" width="12" height="16" fill="${p.trim}"/>
        <rect x="30" y="79" width="40" height="10" rx="3" fill="${p.main}"/>
        <text x="50" y="42" font-family="Arial, sans-serif" font-weight="800" font-size="13" fill="#0b0f19" text-anchor="middle">${p.label}</text>
      </svg>
    `;
  },

  renderRankBadge(rank) {
    const labels = { C3: "Champ III", GC1: "GC I", GC2: "GC II", GC3: "GC III", SSL: "SSL" };
    return `<span class="rank-badge rank-${rank}">⬡ ${labels[rank] || rank}</span>`;
  }
};
