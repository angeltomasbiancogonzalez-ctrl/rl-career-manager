/* ==========================================================================
   RL CAREER MANAGER v8.0 — MOTOR GRÁFICO & CANCHA 2D (js/graphics.js)
   ========================================================================== */

const Graphics = {
  // 1. BANDERAS Y NOMBRES DE PAÍSES
  countryFlags: {
    FR: "🇫🇷", BE: "🇧🇪", GB: "🇬🇧", MA: "🇲🇦", PL: "🇵🇱", NL: "🇳🇱",
    DE: "🇩🇪", ES: "🇪🇸", IT: "🇮🇹", US: "🇺🇸", CA: "🇨🇦", CL: "🇨🇱",
    AR: "🇦🇷", BR: "🇧🇷", SA: "🇸🇦"
  },

  countryNames: {
    FR: "Francia", BE: "Bélgica", GB: "Reino Unido", MA: "Marruecos",
    PL: "Polonia", NL: "Países Bajos", DE: "Alemania", ES: "España",
    IT: "Italia", US: "Estados Unidos", CA: "Canadá", CL: "Chile",
    AR: "Argentina", BR: "Brasil", SA: "Arabia Saudita"
  },

  getFlag(code) {
    return this.countryFlags[code] || "🌐";
  },

  getCountryName(code) {
    return this.countryNames[code] || code || "Internacional";
  },

  // 2. ESCUDOS SVG CON ESTRELLAS PROPORCIONADAS (FIX v8.0)
  renderCrest(team, size = 56) {
    if (!team) return "";
    const c1 = team.color1 || "#00a8ff";
    const c2 = team.color2 || "#ffffff";
    const tag = (team.tag || "RL").slice(0, 4).toUpperCase();
    const shape = team.shape || "shield";
    const pattern = team.pattern || "split";
    const starsCount = Math.min(8, Math.max(0, Number(team.stars) || 0));
    const uid = `crest_${(team.id || tag).replace(/[^a-zA-Z0-9]/g, "")}_${Math.floor(Math.random() * 100000)}`;

    let starsHtml = "";
    if (starsCount > 0) {
      let dots = "";
      for (let i = 0; i < starsCount; i++) {
        dots += `<span class="crest-star-dot" title="Campeón Mundial"></span>`;
      }
      starsHtml = `<div class="crest-stars">${dots}</div>`;
    }

    let pathD = "M50 6 L88 20 L88 54 C88 76 69 90 50 96 C31 90 12 76 12 54 L12 20 Z";
    if (shape === "hexagon") {
      pathD = "M50 5 L90 27 L90 73 L50 95 L10 73 L10 27 Z";
    } else if (shape === "circle") {
      pathD = "M50 6 A44 44 0 1 1 49.9 6 Z";
    } else if (shape === "diamond") {
      pathD = "M50 4 L92 50 L50 96 L8 50 Z";
    }

    let patternSvg = "";
    if (pattern === "split") {
      patternSvg = `<rect x="50" y="0" width="50" height="100" fill="${c2}" opacity="0.92"/>`;
    } else if (pattern === "sash") {
      patternSvg = `<polygon points="0,78 78,0 100,0 100,22 22,100 0,100" fill="${c2}" opacity="0.92"/>`;
    } else if (pattern === "stripe") {
      patternSvg = `<rect x="36" y="0" width="28" height="100" fill="${c2}" opacity="0.92"/>`;
    } else if (pattern === "chevron") {
      patternSvg = `<polygon points="0,34 50,68 100,34 100,54 50,88 0,54" fill="${c2}" opacity="0.92"/>`;
    }

    const fontSize = tag.length >= 4 ? 22 : tag.length === 3 ? 26 : 30;

    return `
      <div class="crest-wrapper" style="width:${size}px;">
        ${starsHtml}
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="${uid}">
              <path d="${pathD}" />
            </clipPath>
          </defs>
          <g clip-path="url(#${uid})">
            <rect x="0" y="0" width="100" height="100" fill="${c1}" />
            ${patternSvg}
            <rect x="0" y="0" width="100" height="100" fill="rgba(0,0,0,0.16)" />
          </g>
          <path d="${pathD}" fill="none" stroke="#e2e8f0" stroke-width="4.5" />
          <rect x="18" y="37" width="64" height="26" rx="6" fill="rgba(6,9,17,0.78)" />
          <text x="50" y="55" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-weight="900" font-size="${fontSize}">
            ${tag}
          </text>
        </svg>
      </div>
    `;
  },

  // 3. TROFEOS VECTORIALES POR COMPETICIÓN
  renderTrophy(compId = "rlcs_regional", size = 64) {
    let primary = "#38bdf8";
    let secondary = "#0284c7";
    let label = "RLCS";

    if (compId === "rlcs_worlds") {
      primary = "#facc15";
      secondary = "#d97706";
      label = "WORLDS";
    } else if (compId === "rlcs_major1" || compId === "rlcs_major2") {
      primary = "#f472b6";
      secondary = "#db2777";
      label = "MAJOR";
    } else if (compId === "ewc") {
      primary = "#34d399";
      secondary = "#059669";
      label = "EWC";
    } else if (compId === "fifae") {
      primary = "#fbbf24";
      secondary = "#b45309";
      label = "FIFAe";
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 18 H72 L66 52 C64 63 57 68 50 68 C43 68 36 63 34 52 Z" fill="${primary}" stroke="#ffffff" stroke-width="2.5"/>
        <path d="M28 24 C15 24 14 42 29 46" fill="none" stroke="${primary}" stroke-width="4"/>
        <path d="M72 24 C85 24 86 42 71 46" fill="none" stroke="${primary}" stroke-width="4"/>
        <rect x="44" y="68" width="12" height="14" fill="${secondary}"/>
        <rect x="32" y="82" width="36" height="10" rx="3" fill="#1e293b" stroke="${primary}" stroke-width="2"/>
        <text x="50" y="44" text-anchor="middle" fill="#090d16" font-family="Inter, sans-serif" font-weight="900" font-size="11">${label}</text>
      </svg>
    `;
  },

  // 4. BADGES DE RANGO JUVENIL Y DIVISIÓN
  renderRankBadge(rank = "GC2") {
    const map = {
      SSL: { bg: "#fdf2f8", color: "#db2777", border: "#f472b6", label: "SSL" },
      GC3: { bg: "#450a0a", color: "#fca5a5", border: "#ef4444", label: "GC3" },
      GC2: { bg: "#450a0a", color: "#f87171", border: "#dc2626", label: "GC2" },
      C3:  { bg: "#2e1065", color: "#d8b4fe", border: "#a855f7", label: "C3" }
    };
    const cfg = map[rank] || map.GC2;
    return `<span style="display:inline-block; padding:2px 7px; border-radius:6px; font-size:0.72rem; font-weight:900; background:${cfg.bg}; color:${cfg.color}; border:1px solid ${cfg.border};">${cfg.label}</span>`;
  },

  renderDivisionBadge(division = "PRO") {
    if (division === "PRO") {
      return `<span style="display:inline-block; padding:2px 8px; border-radius:999px; font-size:0.7rem; font-weight:800; background:rgba(0,168,255,0.16); color:#38bdf8; border:1px solid #0284c7;">PRO DIVISION</span>`;
    }
    return `<span style="display:inline-block; padding:2px 8px; border-radius:999px; font-size:0.7rem; font-weight:800; background:rgba(245,158,11,0.16); color:#fbbf24; border:1px solid #d97706;">CHALLENGER</span>`;
  },

  // 5. DIBUJO DE AUTO EN VISTA AÉREA (TOP-DOWN)
  _drawTopDownCar(ctx, car, primaryColor, accentColor) {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle || 0);

    // Llama de boost si está acelerando
    if ((car.boost || 0) > 15 && (car.speed || 0) > 1.2) {
      this._drawBoostFlame(ctx, car.boost);
    }

    // Sombra suave debajo del auto
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.roundRect(-14, -8, 28, 18, 5);
    ctx.fill();

    // 4 Ruedas negras en vista aérea
    ctx.fillStyle = "#090d16";
    ctx.fillRect(-11, -11, 7, 3);
    ctx.fillRect(5, -11, 7, 3);
    ctx.fillRect(-11, 8, 7, 3);
    ctx.fillRect(5, 8, 7, 3);

    // Chasis principal
    ctx.fillStyle = primaryColor;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(-13, -8, 26, 16, 4);
    ctx.fill();
    ctx.stroke();

    // Franja deportiva / techo
    ctx.fillStyle = accentColor;
    ctx.fillRect(-7, -3, 15, 6);

    // Parabrisas delantero (indica claramente hacia dónde mira el auto)
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(3, -6);
    ctx.lineTo(9, -4.5);
    ctx.lineTo(9, 4.5);
    ctx.lineTo(3, 6);
    ctx.closePath();
    ctx.fill();

    // Alerón trasero
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-14.5, -7, 3, 14);

    ctx.restore();

    // Etiqueta limpia con nombre y mini barra de boost arriba del auto
    ctx.save();
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(car.name || "Bot", car.x, car.y - 16);

    const bw = 24;
    const pct = Math.max(0, Math.min(100, car.boost || 0)) / 100;
    ctx.fillStyle = "rgba(15,23,42,0.85)";
    ctx.fillRect(car.x - bw / 2, car.y - 14, bw, 3);
    ctx.fillStyle = pct > 0.35 ? "#f59e0b" : "#ef4444";
    ctx.fillRect(car.x - bw / 2, car.y - 14, bw * pct, 3);
    ctx.restore();
  },

  _drawBoostFlame(ctx, boostAmount) {
    const flameLen = boostAmount > 60 ? 15 : 10;
    ctx.save();
    ctx.fillStyle = boostAmount > 60 ? "#38bdf8" : "#f97316";
    ctx.beginPath();
    ctx.moveTo(-14, -3.5);
    ctx.lineTo(-14 - flameLen, 0);
    ctx.lineTo(-14, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 6. PADS DE BOOST EN EL CAMPO
  _drawBoostPads(ctx, pads, W, H) {
    if (!Array.isArray(pads)) return;
    pads.forEach(pad => {
      const px = pad.x * W;
      const py = pad.y * H;
      const r = pad.big ? 7 : 4;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      if (pad.active) {
        ctx.fillStyle = pad.big ? "#facc15" : "#f59e0b";
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = pad.big ? 8 : 4;
      } else {
        ctx.fillStyle = "rgba(148, 163, 184, 0.25)";
      }
      ctx.fill();
      ctx.restore();
    });
  },

  // 7. BALÓN DE ROCKET LEAGUE
  _drawBall(ctx, ball, W, H) {
    const bx = ball.x * W;
    const by = ball.y * H;
    const r = 11;

    ctx.save();
    // Sombra
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.arc(bx + 2, by + 3, r, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo metálico del balón
    const grad = ctx.createRadialGradient(bx - 3, by - 3, 2, bx, by, r);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.65, "#cbd5e1");
    grad.addColorStop(1, "#475569");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();

    // Aro luminoso según mitad de cancha
    ctx.strokeStyle = ball.x < 0.5 ? "#38bdf8" : "#f97316";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bx, by, r - 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },

  // 8. CARTEL DE GOL EN CANCHA
  _drawGoalCelebration(ctx, W, H, scorerName, teamColor) {
    ctx.save();
    ctx.fillStyle = "rgba(6, 9, 17, 0.72)";
    ctx.fillRect(0, H * 0.34, W, H * 0.32);

    ctx.strokeStyle = teamColor || "#facc15";
    ctx.lineWidth = 3;
    ctx.strokeRect(18, H * 0.34, W - 36, H * 0.32);

    ctx.fillStyle = "#facc15";
    ctx.font = "900 28px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚽ ¡GOOOOL!", W / 2, H * 0.48);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Inter, sans-serif";
    ctx.fillText(`Anotado por ${scorerName || "Delantero"}`, W / 2, H * 0.58);
    ctx.restore();
  },

  // 9. RENDERIZADO PRINCIPAL DE LA CANCHA 2D EN VISTA AÉREA
  drawPitch2D(canvas, pitchState, homeTeam, awayTeam) {
    if (!canvas || !pitchState) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const homeColor = (homeTeam && homeTeam.color1) || "#00a8ff";
    const homeAccent = (homeTeam && homeTeam.color2) || "#ffffff";
    const awayColor = (awayTeam && awayTeam.color1) || "#f97316";
    const awayAccent = (awayTeam && awayTeam.color2) || "#111827";

    // Césped sintético oscuro de estadio RLCS
    const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
    bgGrad.addColorStop(0, "#0b1e36");
    bgGrad.addColorStop(0.5, "#0d2438");
    bgGrad.addColorStop(1, "#2a1714");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Franjas verticales sutiles de césped
    ctx.fillStyle = "rgba(255,255,255,0.025)";
    const stripes = 10;
    const stripeW = W / stripes;
    for (let i = 0; i < stripes; i += 2) {
      ctx.fillRect(i * stripeW, 0, stripeW, H);
    }

    // Líneas reglamentarias de cancha
    const pad = 22;
    ctx.strokeStyle = "rgba(226, 232, 240, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

    // Línea de medio campo y círculo central
    ctx.beginPath();
    ctx.moveTo(W / 2, pad);
    ctx.lineTo(W / 2, H - pad);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 46, 0, Math.PI * 2);
    ctx.stroke();

    // Áreas y porterías (izquierda = Local, derecha = Visitante)
    const goalH = 104;
    const goalY = (H - goalH) / 2;

    // Portería Izquierda (Local)
    ctx.fillStyle = homeColor;
    ctx.globalAlpha = 0.28;
    ctx.fillRect(4, goalY, pad - 4, goalH);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = homeColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(4, goalY, pad - 4, goalH);

    // Portería Derecha (Visitante)
    ctx.fillStyle = awayColor;
    ctx.globalAlpha = 0.28;
    ctx.fillRect(W - pad, goalY, pad - 4, goalH);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = awayColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(W - pad, goalY, pad - 4, goalH);

    // Pads de boost
    this._drawBoostPads(ctx, pitchState.boostPads, W, H);

    // Autos Locales (vista aérea)
    (pitchState.homeCars || []).forEach(c => {
      this._drawTopDownCar(
        ctx,
        { ...c, x: c.x * W, y: c.y * H },
        homeColor,
        homeAccent
      );
    });

    // Autos Visitantes (vista aérea)
    (pitchState.awayCars || []).forEach(c => {
      this._drawTopDownCar(
        ctx,
        { ...c, x: c.x * W, y: c.y * H },
        awayColor,
        awayAccent
      );
    });

    // Balón
    if (pitchState.ball) {
      this._drawBall(ctx, pitchState.ball, W, H);
    }

    // Banner de gol si hay celebración activa
    if (pitchState.goalBannerTimer > 0) {
      this._drawGoalCelebration(
        ctx,
        W,
        H,
        pitchState.lastScorerName,
        pitchState.lastScorerSide === "HOME" ? homeColor : awayColor
      );
    }
  }
};
