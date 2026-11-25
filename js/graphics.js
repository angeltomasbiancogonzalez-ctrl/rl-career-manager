const Graphics = {
  countryFlags: {
    FR: "🇫🇷", SA: "🇸🇦", US: "🇺🇸", BR: "🇧🇷", GB: "🇬🇧",
    AR: "🇦🇷", CL: "🇨🇱", ES: "🇪🇸", DE: "🇩🇪", NL: "🇳🇱",
    BE: "🇧🇪", MA: "🇲🇦", CA: "🇨🇦", MX: "🇲🇽", UY: "🇺🇾",
    CO: "🇨🇴", PE: "🇵🇪", JP: "🇯🇵", AU: "🇦🇺", IT: "🇮🇹",
    PT: "🇵🇹", SE: "🇸🇪", NO: "🇳🇴", PL: "🇵🇱", KW: "🇰🇼",
    AE: "🇦🇪", JO: "🇯🇴", QA: "🇶🇦"
  },

  countryNames: {
    FR: "Francia", SA: "Arabia Saudita", US: "Estados Unidos", BR: "Brasil",
    GB: "Reino Unido", AR: "Argentina", CL: "Chile", ES: "España",
    DE: "Alemania", NL: "Países Bajos", BE: "Bélgica", MA: "Marruecos",
    CA: "Canadá", MX: "México", UY: "Uruguay", CO: "Colombia",
    PE: "Perú", JP: "Japón", AU: "Australia", IT: "Italia",
    PT: "Portugal", SE: "Suecia", NO: "Noruega", PL: "Polonia"
  },

  getFlag(code) {
    return this.countryFlags[code] || "🌐";
  },

  // ESCUDO VECTORIAL DE CLUB CON ESTRELLAS MUNDIALES
  renderCrest(team, size = 56) {
    if (!team) return "";
    const starsCount = team.stars || 0;
    const starsHtml = starsCount > 0
      ? `<div class="crest-stars" title="${starsCount} Mundial(es) RLCS">${"⭐".repeat(Math.min(starsCount, 5))}</div>`
      : "";

    if (team.logoUrl && team.logoUrl.trim().startsWith("http")) {
      return `
        <div class="crest-wrapper" style="width:${size}px;">
          ${starsHtml}
          <img src="${team.logoUrl.trim()}" alt="${team.tag}"
            style="width:${size}px;height:${size}px;object-fit:contain;border-radius:10px;background:#0f172a;padding:3px;border:2px solid ${team.color1 || "#00a8ff"};"
            onerror="this.style.display='none'" />
        </div>
      `;
    }

    const c1 = team.color1 || "#00a8ff";
    const c2 = team.color2 || "#ffffff";
    const shape = team.shape || "shield";
    const pattern = team.pattern || "solid";
    const tag = (team.tag || "RL").slice(0, 4).toUpperCase();
    const uid = `g_${(team.id || tag).replace(/[^a-zA-Z0-9]/g, "")}_${Math.floor(Math.random() * 9999)}`;

    let shapePath = "M50 6 L90 22 L84 68 L50 95 L16 68 L10 22 Z";
    if (shape === "hexagon") shapePath = "M50 5 L91 28 L91 72 L50 95 L9 72 L9 28 Z";
    else if (shape === "circle") shapePath = "M50 6 A44 44 0 1 0 50 94 A44 44 0 1 0 50 6 Z";
    else if (shape === "diamond") shapePath = "M50 4 L94 50 L50 96 L6 50 Z";

    let patternOverlay = "";
    if (pattern === "split") {
      patternOverlay = `<rect x="50" y="0" width="50" height="100" fill="${c2}" opacity="0.88" />`;
    } else if (pattern === "stripe") {
      patternOverlay = `<rect x="38" y="0" width="24" height="100" fill="${c2}" opacity="0.9" />`;
    } else if (pattern === "sash") {
      patternOverlay = `<polygon points="0,15 22,0 100,85 78,100" fill="${c2}" opacity="0.88" />`;
    } else if (pattern === "chevron") {
      patternOverlay = `<polygon points="10,42 50,72 90,42 90,62 50,90 10,62" fill="${c2}" opacity="0.88" />`;
    }

    const fontSize = tag.length <= 2 ? 27 : (tag.length === 3 ? 22 : 18);

    return `
      <div class="crest-wrapper" style="width:${size}px;">
        ${starsHtml}
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.45));">
          <defs>
            <clipPath id="clip_${uid}">
              <path d="${shapePath}" />
            </clipPath>
          </defs>
          <g clip-path="url(#clip_${uid})">
            <rect x="0" y="0" width="100" height="100" fill="${c1}" />
            ${patternOverlay}
            <rect x="0" y="34" width="100" height="32" fill="rgba(6, 9, 17, 0.78)" />
          </g>
          <path d="${shapePath}" fill="none" stroke="${c2}" stroke-width="4.5" />
          <text x="50" y="57" text-anchor="middle" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-weight="900" font-size="${fontSize}" letter-spacing="1">${tag}</text>
        </svg>
      </div>
    `;
  },

  // TROFEOS VECTORIALES
  renderTrophy(compId, size = 48) {
    let primary = "#38bdf8";
    let secondary = "#0284c7";
    let label = "RLCS";

    if (compId === "rlcs_worlds") {
      primary = "#facc15"; secondary = "#ca8a04"; label = "WORLDS";
    } else if (compId === "rlcs_major1" || compId === "rlcs_major2") {
      primary = "#e2e8f0"; secondary = "#94a3b8"; label = "MAJOR";
    } else if (compId === "ewc") {
      primary = "#f59e0b"; secondary = "#b45309"; label = "EWC";
    } else if (compId === "fifae_wc") {
      primary = "#10b981"; secondary = "#047857"; label = "FIFAe";
    } else if (compId === "challenger_cup") {
      primary = "#a78bfa"; secondary = "#6d28d9"; label = "CHAL";
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:inline-block;vertical-align:middle;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.5));">
        <path d="M26 22 L12 22 C12 42 22 48 30 48" fill="none" stroke="${secondary}" stroke-width="5" stroke-linecap="round" />
        <path d="M74 22 L88 22 C88 42 78 48 70 48" fill="none" stroke="${secondary}" stroke-width="5" stroke-linecap="round" />
        <path d="M26 16 L74 16 L68 54 C65 66 35 66 32 54 Z" fill="${primary}" stroke="${secondary}" stroke-width="3" />
        <rect x="44" y="62" width="12" height="18" fill="${secondary}" />
        <rect x="30" y="80" width="40" height="10" rx="3" fill="${primary}" stroke="${secondary}" stroke-width="2.5" />
        <text x="50" y="42" text-anchor="middle" fill="#0f172a" font-family="Inter, Arial, sans-serif" font-weight="900" font-size="13">${label}</text>
      </svg>
    `;
  },

  // BADGE DE RANGO COMPETITIVO (CANTERA)
  renderRankBadge(rank) {
    const map = {
      SSL: { bg: "linear-gradient(135deg,#ffffff,#e879f9)", color: "#1e1b4b", text: "SSL" },
      GC3: { bg: "#dc2626", color: "#fff", text: "GC III" },
      GC2: { bg: "#ef4444", color: "#fff", text: "GC II" },
      GC1: { bg: "#f87171", color: "#111", text: "GC I" },
      C3:  { bg: "#9333ea", color: "#fff", text: "C III" }
    };
    const r = map[rank] || { bg: "#334155", color: "#fff", text: rank };
    return `<span style="display:inline-block;padding:2px 7px;border-radius:6px;font-size:0.72rem;font-weight:800;background:${r.bg};color:${r.color};">${r.text}</span>`;
  },

  // SILUETAS REALES DE AUTOS (FENNEC, OCTANE, DOMINUS)
  _drawCarBody(ctx, carType, isHome) {
    const bodyColor = isHome ? "#0284c7" : "#ea580c";
    const accentColor = isHome ? "#38bdf8" : "#fdba74";

    ctx.fillStyle = "#090d16";
    ctx.fillRect(-10, -9.5, 6, 2.5);
    ctx.fillRect(4, -9.5, 6, 2.5);
    ctx.fillRect(-10, 7, 6, 2.5);
    ctx.fillRect(4, 7, 6, 2.5);

    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.6;

    if (carType === "Dominus") {
      ctx.beginPath();
      ctx.roundRect(-14, -7, 28, 14, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accentColor;
      ctx.fillRect(-11, -2, 22, 4);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(2, -5.5, 5, 11);
    } else if (carType === "Octane") {
      ctx.beginPath();
      ctx.moveTo(-12, -7);
      ctx.lineTo(6, -7);
      ctx.lineTo(13, -4);
      ctx.lineTo(13, 4);
      ctx.lineTo(6, 7);
      ctx.lineTo(-12, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accentColor;
      ctx.fillRect(-13.5, -7.5, 3, 15);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, -4.5, 5.5, 9);
    } else {
      ctx.beginPath();
      ctx.roundRect(-12, -7.5, 24, 15, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accentColor;
      ctx.fillRect(-8, -5.5, 16, 2);
      ctx.fillRect(-8, 3.5, 16, 2);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(2.5, -5.5, 5, 11);
    }

    ctx.fillStyle = "#fef08a";
    ctx.fillRect(11.5, -5, 1.8, 2.5);
    ctx.fillRect(11.5, 2.5, 1.8, 2.5);
  },

  // RENDERIZADOR DE LA CANCHA 2D EN VIVO (v8.0)
  drawPitch2D(canvas, simState) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const now = Date.now() * 0.005;

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "#08162b");
    grad.addColorStop(0.5, "#0d2238");
    grad.addColorStop(1, "#29140d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.025)";
    for (let x = 36; x < W - 36; x += 56) {
      ctx.fillRect(x, 18, 28, H - 36);
    }

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0284c7";
    ctx.strokeRect(36, 18, W / 2 - 36, H - 36);
    ctx.strokeStyle = "#ea580c";
    ctx.strokeRect(W / 2, 18, W / 2 - 36, H - 36);

    ctx.strokeStyle = "rgba(148,163,184,0.38)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2, 18);
    ctx.lineTo(W / 2, H - 18);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "900 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
    ctx.fillText("BLUE SIDE", 160, 34);
    ctx.fillStyle = "rgba(251, 146, 60, 0.25)";
    ctx.fillText("ORANGE SIDE", W - 160, 34);

    // Áreas y Arcos (Azul izquierda, Naranja derecha)
    ctx.strokeStyle = "#0ea5e9";
    ctx.strokeRect(36, H / 2 - 75, 65, 150);
    ctx.fillStyle = "rgba(14, 165, 233, 0.35)";
    ctx.fillRect(14, H / 2 - 44, 22, 88);
    ctx.strokeRect(14, H / 2 - 44, 22, 88);

    ctx.strokeStyle = "#f97316";
    ctx.strokeRect(W - 101, H / 2 - 75, 65, 150);
    ctx.fillStyle = "rgba(249, 115, 22, 0.35)";
    ctx.fillRect(W - 36, H / 2 - 44, 22, 88);
    ctx.strokeRect(W - 36, H / 2 - 44, 22, 88);

    // 6 Big Boost Pads (100% Boost)
    const pads = simState?.boostPads || [
      { x: 64, y: 42, active: true }, { x: W / 2, y: 38, active: true }, { x: W - 64, y: 42, active: true },
      { x: 64, y: H - 42, active: true }, { x: W / 2, y: H - 38, active: true }, { x: W - 64, y: H - 42, active: true }
    ];
    pads.forEach(pad => {
      if (pad.active) {
        const pulse = 9 + Math.sin(now) * 2;
        ctx.beginPath();
        ctx.arc(pad.x, pad.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(250, 204, 21, 0.22)";
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(pad.x, pad.y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = pad.active ? "#facc15" : "rgba(250,204,21,0.16)";
      ctx.fill();
      if (pad.active) {
        ctx.strokeStyle = "#fef08a";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    if (!simState) return;

    // Dibujar Autos con ángulo real, estela supersonic y boost
    (simState.cars || []).forEach(car => {
      if (car.demoTimer > 0) {
        ctx.beginPath();
        ctx.arc(car.x, car.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(239, 68, 68, 0.28)";
        ctx.fill();
        ctx.fillStyle = "#fca5a5";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("💥 DEMO", car.x, car.y + 4);
        return;
      }

      const angle = car.angle ?? (car.isHome ? 0 : Math.PI);

      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(angle);

      if (car.boosting && car.boost > 5) {
        const trailGrad = ctx.createLinearGradient(-12, 0, -36, 0);
        trailGrad.addColorStop(0, car.isHome ? "rgba(56, 189, 248, 0.85)" : "rgba(251, 146, 60, 0.85)");
        trailGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.moveTo(-12, -5);
        ctx.lineTo(-34 - Math.random() * 8, 0);
        ctx.lineTo(-12, 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fef9c3";
        ctx.beginPath();
        ctx.moveTo(-12, -2.5);
        ctx.lineTo(-20 - Math.random() * 4, 0);
        ctx.lineTo(-12, 2.5);
        ctx.closePath();
        ctx.fill();
      }

      this._drawCarBody(ctx, car.carBody || (car.isHome ? "Fennec" : "Octane"), car.isHome);
      ctx.restore();

      ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
      ctx.fillRect(car.x - 14, car.y - 17, 28, 4);
      ctx.fillStyle = car.boost > 25 ? "#facc15" : "#ef4444";
      ctx.fillRect(car.x - 14, car.y - 17, (car.boost / 100) * 28, 4);

      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(2, 6, 23, 0.9)";
      ctx.fillText(car.name, car.x + 1, car.y + 22);
      ctx.fillStyle = car.isHome ? "#bae6fd" : "#fed7aa";
      ctx.fillText(car.name, car.x, car.y + 21);
    });

    // Estela y dibujo de la Pelota
    const ball = simState.ball || { x: W / 2, y: H / 2, vx: 0, vy: 0, aerial: false };
    const speed = Math.hypot(ball.vx || 0, ball.vy || 0);
    if (speed > 2.2) {
      const trailColor = ball.lastTouch
        ? (ball.lastTouch.isHome ? "rgba(56, 189, 248, 0.35)" : "rgba(251, 146, 60, 0.35)")
        : "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y);
      ctx.lineTo(ball.x - ball.vx * 5.5, ball.y - ball.vy * 5.5);
      ctx.strokeStyle = trailColor;
      ctx.lineWidth = ball.aerial ? 14 : 10;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    const radius = ball.aerial ? 12 : 9.5;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = ball.aerial ? "rgba(250, 204, 21, 0.38)" : "rgba(255, 255, 255, 0.18)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#f8fafc";
    ctx.fill();
    ctx.strokeStyle = ball.aerial ? "#facc15" : "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius * 0.45, 0, Math.PI * 2);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Onda expansiva y cartel dorado de ¡GOOOL!
    if (simState.goalBannerTimer > 0) {
      const blastRadius = (56 - simState.goalBannerTimer) * 5;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, blastRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = "rgba(2, 6, 23, 0.84)";
      ctx.fillRect(W / 2 - 180, H / 2 - 30, 360, 60);
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(W / 2 - 180, H / 2 - 30, 360, 60);

      ctx.fillStyle = "#facc15";
      ctx.font = "900 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(simState.goalBannerText || "¡GOOOOL!", W / 2, H / 2 + 6);
    }
  }
};
