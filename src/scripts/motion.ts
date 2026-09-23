/**
 * Motion: reveals, parallax, foco de luz en tarjetas, botones magnéticos,
 * barra de progreso y estado de la cabecera. Sin librerías.
 * Todo lo no esencial se desactiva con prefers-reduced-motion (spec §9.5).
 *
 * Con navegación por View Transitions el documento no se recarga: lo que
 * depende de elementos concretos se vuelve a montar en cada página
 * (`setupPage`) y lo que escucha a window/document se registra una sola vez
 * (`setupGlobal`).
 */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/** Ejecuta `fn` como mucho una vez por frame con el último evento recibido. */
function perFrame<T>(fn: (value: T) => void): (value: T) => void {
  let queued = false;
  let last: T;
  return (value: T) => {
    last = value;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn(last);
    });
  };
}

/* ============================================================
   Por página: se vuelve a ejecutar en cada navegación
   ============================================================ */

function setupReveals() {
  /* --- Stagger dentro de grupos --- */
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 90, 540)}ms`;
    });
  });

  /* --- Titulares que suben desde detrás de una máscara ---
     El texto se envuelve en un bloque con overflow oculto; el CSS lo
     desplaza hacia arriba cuando el bloque padre entra en pantalla. */
  if (!reduced) {
    document
      .querySelectorAll<HTMLElement>(
        'h1[data-reveal], h2[data-reveal], [data-reveal] > h1, [data-reveal] > h2',
      )
      .forEach((heading) => {
        if (heading.dataset.masked === 'true') return;
        const inner = document.createElement('span');
        inner.className = 'mask-inner';
        inner.append(...heading.childNodes);
        heading.append(inner);
        heading.classList.add('mask-text');
        heading.dataset.masked = 'true';
      });
  }

  /* --- Reveals ---
     El contenido nace visible en CSS; solo se oculta cuando este script
     confirma que puede animarlo. Así un fallo de JS nunca deja la página
     en blanco. Además hay una red de seguridad por tiempo. */
  const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const showAll = () => revealEls.forEach((el) => el.classList.add('is-visible'));

  if (!reduced && revealEls.length > 0 && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );
    revealEls.forEach((el) => io.observe(el));

    // Si el observador nunca reporta (contextos sin composición), se muestra todo.
    window.setTimeout(() => {
      if (!revealEls.some((el) => el.classList.contains('is-visible'))) showAll();
    }, 2000);
  } else {
    showAll();
  }
}

function setupScrollTilt() {
  /* --- Inclinación 3D que se endereza al entrar en pantalla --- */
  if (reduced || !('IntersectionObserver' in window)) return;

  const tilted = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-tilt]'));
  for (const el of tilted) {
    const list = el.querySelector<HTMLElement>('.stack-list') ?? el;
    const flatten = () => list.style.setProperty('--tilt', '0');

    list.style.setProperty('--tilt', '1');
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            flatten();
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    // Red de seguridad: nunca dejar la pila torcida si el observador no reporta
    window.setTimeout(flatten, 2000);
  }
}

function setupRipples() {
  /* --- Onda al pulsar, desde el punto exacto del clic ---
     Cubre botones y también los controles pequeños: sin esto, las píldoras de
     filtro y el selector de idioma se quedaban sin respuesta al tacto. */
  const targets = '.btn, .filter-pill, .lang-switch, .music-toggle, .yn-btn';

  document.querySelectorAll<HTMLElement>(targets).forEach((btn) => {
    btn.classList.add('rippling');

    btn.addEventListener(
      'pointerdown',
      (ev) => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--ripple-x', `${ev.clientX - rect.left}px`);
        btn.style.setProperty('--ripple-y', `${ev.clientY - rect.top}px`);
        btn.classList.remove('is-rippling');
        // Fuerza el reinicio de la animación si se pulsa repetidamente
        void btn.offsetWidth;
        btn.classList.add('is-rippling');
      },
      { passive: true },
    );

    // Son dos capas: se limpia con la que dura más, o se cortaría el aro
    btn.addEventListener('animationend', (ev) => {
      if (ev.animationName === 'ripple-ring') btn.classList.remove('is-rippling');
    });
  });
}

function setupCards() {
  /* --- Tarjetas: foco de luz e inclinación hacia el puntero ---
     La intensidad del brillo la controla CSS (--spot-a con :hover), así se
     apaga solo al salir. Aquí se actualizan posición e inclinación, y solo
     mientras el puntero está dentro. */
  if (!finePointer) return;

  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    let inside = false;

    const move = perFrame<PointerEvent>((ev) => {
      if (!inside) return; // descarta el frame que llega tras salir
      const rect = card.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width;
      const py = (ev.clientY - rect.top) / rect.height;

      card.style.setProperty('--spot-x', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--spot-y', `${(py * 100).toFixed(1)}%`);

      if (reduced) return;
      // Máximo 4°: por encima parece un truco, no un objeto físico
      card.style.setProperty('--tilt-y', `${((px - 0.5) * 8).toFixed(2)}deg`);
      card.style.setProperty('--tilt-x', `${((0.5 - py) * 8).toFixed(2)}deg`);
    });

    const release = () => {
      inside = false;
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    };

    card.addEventListener('pointerenter', () => {
      inside = true;
    });
    card.addEventListener('pointermove', move, { passive: true });
    card.addEventListener('pointerleave', release);
    card.addEventListener('pointercancel', release);
  });
}

function setupMagnetic() {
  /* --- Botones magnéticos --- */
  if (reduced || !finePointer) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    let inside = false;

    const release = () => {
      inside = false;
      el.style.translate = '0px 0px';
    };

    const move = perFrame<PointerEvent>((ev) => {
      if (!inside) return; // el frame pendiente no debe recolocarlo tras salir
      const rect = el.getBoundingClientRect();
      const dx = (ev.clientX - (rect.left + rect.width / 2)) * 0.22;
      const dy = (ev.clientY - (rect.top + rect.height / 2)) * 0.3;
      el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    });

    el.addEventListener('pointerenter', () => {
      inside = true;
    });
    el.addEventListener('pointermove', move, { passive: true });

    // Varias salidas posibles: puntero fuera, gesto cancelado, clic que
    // navega, o el puntero abandonando la ventana sin pasar por el borde.
    el.addEventListener('pointerleave', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('blur', release);
    document.addEventListener('pointerleave', release);
    window.addEventListener('blur', release);
  });
}

function setupHeroParallax() {
  /* --- Parallax de ratón en el hero --- */
  if (reduced || !finePointer) return;

  document.querySelectorAll<HTMLElement>('[data-mouse-parallax]').forEach((sceneEl) => {
    const layers = Array.from(sceneEl.querySelectorAll<HTMLElement>('[data-mouse-depth]'));
    if (layers.length === 0) return;

    const move = perFrame<PointerEvent>((ev) => {
      const rect = sceneEl.getBoundingClientRect();
      const nx = (ev.clientX - rect.left) / rect.width - 0.5;
      const ny = (ev.clientY - rect.top) / rect.height - 0.5;
      for (const layer of layers) {
        const depth = Number.parseFloat(layer.dataset.mouseDepth ?? '10');
        layer.style.translate = `${(-nx * depth).toFixed(1)}px ${(-ny * depth).toFixed(1)}px`;
      }
    });

    sceneEl.addEventListener('pointermove', move, { passive: true });
    sceneEl.addEventListener('pointerleave', () => {
      for (const layer of layers) layer.style.translate = '0px 0px';
    });
  });
}

function setupPage() {
  setupReveals();
  setupScrollTilt();
  setupRipples();
  setupCards();
  setupMagnetic();
  setupHeroParallax();
  onScroll(null);
}

/* ============================================================
   Global: una sola vez por sesión, sobrevive a las navegaciones
   ============================================================ */

/* --- Scroll: progreso, cabecera, parallax de capas y escenario ---
   Los elementos se buscan en cada frame porque el documento se sustituye
   entero en cada navegación. */
const onScroll = perFrame(() => {
  const doc = document.documentElement;
  const y = window.scrollY;

  const max = doc.scrollHeight - window.innerHeight;
  const progress = max > 0 ? y / max : 0;

  const progressFill = document.querySelector<HTMLElement>('.progress-fill');
  if (progressFill) progressFill.style.width = `${(progress * 100).toFixed(2)}%`;

  document.querySelector<HTMLElement>('.site-header')?.classList.toggle('is-scrolled', y > 12);

  if (reduced) return;

  /* Luz guía: baja de 14vh a 82vh a lo largo de la página y serpentea de
     lado. El seno da el vaivén sin necesidad de guardar estado. */
  doc.style.setProperty('--guide-y', `${(14 + progress * 68).toFixed(2)}vh`);
  doc.style.setProperty('--guide-x', `${(50 + Math.sin(progress * Math.PI * 2.4) * 22).toFixed(2)}vw`);

  /* El fondo se mueve con el AVANCE (0→1), no con los píxeles recorridos:
     atado al scroll bruto, en una página larga los haces se iban miles de
     píxeles arriba y el fondo quedaba vacío justo a mitad de lectura. */
  const scene = document.querySelector<HTMLElement>('.bg-scene');
  scene?.style.setProperty('--scene-p', progress.toFixed(4));
  document.documentElement.style.setProperty('--scene-p', progress.toFixed(4));

  const mid = window.innerHeight / 2;
  for (const el of document.querySelectorAll<HTMLElement>('[data-parallax]')) {
    const speed = Number.parseFloat(el.dataset.parallax ?? '0.1');
    const rect = el.getBoundingClientRect();
    el.style.setProperty(
      '--parallax-y',
      `${((rect.top + rect.height / 2 - mid) * -speed).toFixed(1)}px`,
    );
  }
});

/* --- Escenario que sigue al puntero ---
   El objetivo lo fija el puntero y el valor real lo persigue con suavizado
   dentro del bucle de partículas: así el fondo llega tarde y con inercia,
   en vez de pegarse al cursor. */
const scenePointer = { tx: 0, ty: 0, x: 0, y: 0 };

/* --- Campo de partículas ---
   Polvo de marca a la deriva. Vive en un canvas dentro del escenario fijo,
   así persiste entre páginas y no se repinta con cada navegación. */
function setupParticles() {
  const canvas = document.querySelector<HTMLCanvasElement>('.particles');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const COLORS = ['98, 66, 252', '56, 130, 251', '16, 200, 252'];

  type Petal = {
    x: number;
    y: number;
    r: number;
    vx: number;
    vy: number;
    a: number;
    phase: number;
    sway: number;
    angle: number;
    spin: number;
    color: string;
    tx: number;
    ty: number;
  };

  let petals: Petal[] = [];
  let w = 0;
  let h = 0;

  /* Puntos de la palabra: se dibuja "MAI" en un lienzo aparte y se leen los
     píxeles pintados. Así la forma sale de la tipografía real y no de unas
     coordenadas escritas a mano. */
  function wordTargets(count: number): { x: number; y: number }[] {
    const off = document.createElement('canvas');
    const octx = off.getContext('2d');
    if (!octx) return [];

    off.width = Math.max(320, Math.round(w * 0.6));
    off.height = Math.round(off.width * 0.42);

    const size = Math.round(off.height * 0.78);
    octx.fillStyle = '#fff';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.font = `700 ${size}px 'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif`;
    octx.fillText('MAI', off.width / 2, off.height / 2);

    const { data } = octx.getImageData(0, 0, off.width, off.height);
    const hits: { x: number; y: number }[] = [];
    const step = 3;
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3]! > 128) hits.push({ x, y });
      }
    }
    if (hits.length === 0) return [];

    // Se reparten los puntos disponibles entre los pétalos que haya
    const scale = Math.min(w * 0.52, 560) / off.width;
    const left = (w - off.width * scale) / 2;
    const top = (h - off.height * scale) / 2;

    const picked: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const hit = hits[Math.floor((i / count) * hits.length)]!;
      picked.push({ x: left + hit.x * scale, y: top + hit.y * scale });
    }
    return picked;
  }

  const build = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Hacen falta bastantes para que la palabra se lea, pero no tantos
    // como para que el fondo parezca ruido.
    const count = Math.min(260, Math.max(120, Math.round((w * h) / 7000)));

    petals = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.1 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.04 - Math.random() * 0.1,
      a: 0.18 + Math.random() * 0.34,
      phase: Math.random() * Math.PI * 2,
      sway: 0.25 + Math.random() * 0.5,
      angle: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.004,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      tx: 0,
      ty: 0,
    }));

    const targets = wordTargets(petals.length);
    petals.forEach((petal, i) => {
      const target = targets[i];
      petal.tx = target ? target.x : petal.x;
      petal.ty = target ? target.y : petal.y;
    });
  };

  /* Ciclo: deriva libre, se juntan en la palabra, la sostienen y se sueltan.
     `gather` va de 0 (libres) a 1 (formando la palabra). */
  const FREE = 16000;
  const JOIN = 2600;
  const HOLD = 3600;
  const LEAVE = 2600;
  const CYCLE = FREE + JOIN + HOLD + LEAVE;

  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

  /* Desfase para que la primera vez no haya que esperar los 16 s enteros:
     la palabra se forma a los ~7 s de abrir y luego cada ciclo. */
  const OFFSET = FREE - 7000;

  const gatherAt = (time: number) => {
    const t = (time + OFFSET) % CYCLE;
    if (t < FREE) return 0;
    if (t < FREE + JOIN) return easeInOut((t - FREE) / JOIN);
    if (t < FREE + JOIN + HOLD) return 1;
    return 1 - easeInOut((t - FREE - JOIN - HOLD) / LEAVE);
  };

  const scene = document.querySelector<HTMLElement>('.bg-scene');

  const easeScene = () => {
    scenePointer.x += (scenePointer.tx - scenePointer.x) * 0.045;
    scenePointer.y += (scenePointer.ty - scenePointer.y) * 0.045;
    scene?.style.setProperty('--mx', `${scenePointer.x.toFixed(1)}px`);
    scene?.style.setProperty('--my', `${scenePointer.y.toFixed(1)}px`);
  };

  const draw = (time: number, gather: number) => {
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      const twinkle = 0.85 + 0.15 * Math.sin(time / 3200 + p.phase);
      // Al agruparse suben de brillo: la palabra tiene que leerse
      ctx.globalAlpha = p.a * twinkle * (1 + gather * 0.9);
      ctx.fillStyle = `rgb(${p.color})`;
      ctx.beginPath();
      // Pétalo: elipse girada, no un punto redondo
      ctx.ellipse(p.x, p.y, p.r * 1.9, p.r * 0.85, p.angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const step = (time: number) => {
    easeScene();
    const gather = gatherAt(time);

    for (const p of petals) {
      if (gather > 0.001) {
        // Cuanto más avanza el ciclo, más manda el destino
        const pull = 0.02 + gather * 0.1;
        p.x += (p.tx - p.x) * pull * gather;
        p.y += (p.ty - p.y) * pull * gather;
      }

      // La deriva nunca se apaga del todo: incluso formados, respiran
      const free = 1 - gather * 0.85;
      p.x += (p.vx + Math.sin(time / 2600 + p.phase) * p.sway * 0.35) * free;
      p.y += p.vy * free;
      p.angle += p.spin * free;

      if (p.y < -12) {
        p.y = h + 12;
        p.x = Math.random() * w;
      }
      if (p.x < -12) p.x = w + 12;
      else if (p.x > w + 12) p.x = -12;
    }

    draw(time, gather);
  };

  let raf = 0;
  const loop = (time: number) => {
    step(time);
    raf = requestAnimationFrame(loop);
  };

  const start = () => {
    if (raf || reduced) return;
    raf = requestAnimationFrame(loop);
  };

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const boot = () => {
    build();
    if (reduced) draw(0, 0);
    else start();
  };

  // La palabra se muestrea con la tipografía de marca: hay que esperarla
  if (document.fonts?.ready) void document.fonts.ready.then(boot);
  else boot();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      build();
      if (reduced) draw(0, 0);
    }, 200);
  });
}

function setupGlobal() {
  setupParticles();

  window.addEventListener('scroll', () => onScroll(null), { passive: true });
  window.addEventListener('resize', () => onScroll(null), { passive: true });

  /* --- Puntero: luz que lo acompaña --- */
  if (reduced || !finePointer) return;

  // Solo la luz sigue al cursor. El fondo no se mueve con el ratón: al
  // desplazarse hacía que sus luces parecieran brillos sueltos vagando.
  const onPointer = perFrame<PointerEvent>((ev) => {
    const glow = document.querySelector<HTMLElement>('.cursor-glow');
    glow?.style.setProperty('--cursor-x', `${ev.clientX}px`);
    glow?.style.setProperty('--cursor-y', `${ev.clientY}px`);

    // Recorrido corto: las manchas se separan, no persiguen al cursor
    scenePointer.tx = (ev.clientX / window.innerWidth - 0.5) * 34;
    scenePointer.ty = (ev.clientY / window.innerHeight - 0.5) * 26;
  });

  window.addEventListener('pointermove', onPointer, { passive: true });

  // La luz crece sobre lo que se puede pulsar: señala el objetivo sin
  // sustituir al cursor del sistema.
  window.addEventListener(
    'pointerover',
    (ev) => {
      const target = ev.target as Element | null;
      const hot = Boolean(target?.closest?.('a, button, [role="button"], input, textarea'));
      document.querySelector('.cursor-glow')?.classList.toggle('is-hot', hot);
    },
    { passive: true },
  );

  document.addEventListener('pointerenter', () =>
    document.querySelector('.cursor-glow')?.classList.add('is-on'),
  );
  document.addEventListener('pointerleave', () =>
    document.querySelector('.cursor-glow')?.classList.remove('is-on'),
  );
  document.querySelector('.cursor-glow')?.classList.add('is-on');
}

setupGlobal();
setupPage();

/* Con ClientRouter el documento se sustituye en cada navegación y hay que
   volver a montar. Se escucha `after-swap` y no `page-load` porque este
   último también dispara en la carga inicial y duplicaría el montaje. */
document.addEventListener('astro:after-swap', setupPage);
