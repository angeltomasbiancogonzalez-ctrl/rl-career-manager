const Graphics = {
  // Banderas por código de país
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

  // Genera el escudo SVG del club o usa una URL si el usuario subió su propia imagen
  renderCrest(team, size = 56) {
    if (!team) return "";
    if (team.logoUrl && team.logoUrl.trim() !== "") {
      return `<img src="${team.logoUrl}" alt="${team.tag}" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:8px;" />`;
    }

    const c1 = team.color1 || "#00a8ff";
    const c2 = team.color2 || "#ffffff";
    const shape = team.shape || "shield";
    const tag = (team.tag || "RL").slice(0, 4).toUpperCase();

    let bgPath = "";
    if (shape === "hexagon") {
      bgPath = `<polygon points="50,4 93,27 93,73 50,96 7,73 7,27" fill="${c1}" stroke="${c2}" stroke-width="6"/>`;
    } else if (shape === "circle") {
      bgPath = `<circle cx="50" cy="50" r="44" fill="${c1}" stroke="${c2}" stroke-width="6"/>`;
    } else if (shape === "diamond") {
      bgPath = `<polygon points="50,4 95,50 50,96 5,50" fill="${c1}" stroke="${c2}" stroke-width="6"/>`;
    } else {
      // Escudo clásico
      bgPath = `<path d="M12,10 H88 V48 C88,74 50,94 50,94 C50,94 12,74 12,48 Z" fill="${c1}" stroke="${c2}" stroke-width="6"/>`;
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        ${bgPath}
        <path d="M22,22 H78" stroke="${c2}" stroke-width="3" stroke-opacity="0.4"/>
        <text x="50" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="25" fill="${c2}" text-anchor="middle" stroke="#000" stroke-width="1.2">${tag}</text>
      </svg>
    `;
  },

  // Genera los trofeos vectoriales de cada competencia
  renderTrophy(compId, size = 48) {
    const palettes = {
      rlcs_regional: { main: "#38bdf8", trim: "#0284c7", label: "RLCS" },
      paris_major:   { main: "#e879f9", trim: "#a21caf", label: "PARIS" },
      boston_major:  { main: "#f87171", trim: "#b91c1c", label: "BOSTON" },
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

  // Insignia visual para rangos de cantera (GC2, GC3, SSL)
  renderRankBadge(rank) {
    const labels = {
      GC2: "GC II",
      GC3: "GC III",
      SSL: "SSL"
    };
    return `<span class="rank-badge rank-${rank}">⬡ ${labels[rank] || rank}</span>`;
  }
};
