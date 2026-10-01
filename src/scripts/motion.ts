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

/** Posición del puntero en pantalla, para que las partículas se aparten. */
const pointer = { x: -9999, y: -9999, active: false };

/* --- Campo de partículas ---
   Polvo de marca a la deriva. Vive en un canvas dentro del escenario fijo,
   así persiste entre páginas y no se repinta con cada navegación. */
function setupParticles() {
  const canvas = document.querySelector<HTMLCanvasElement>('.particles');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  type Rgb = [number, number, number];

  /* Los pétalos sueltos llevan los colores del logotipo, incluido el blanco
     de la M: así, cuando se juntan, no hace falta "cambiarles" el color, solo
     terminar de colocarlos. */
  const FREE_COLORS: Rgb[] = [
    [98, 66, 252],
    [56, 130, 251],
    [16, 200, 252],
    [235, 240, 255],
  ];

  type Petal = {
    x: number;
    y: number;
    r: number;
    vx: number;
    vy: number;
    /** Deriva de reposo: tras el empujón de dispersión se vuelve a ella */
    bvx: number;
    bvy: number;
    a: number;
    phase: number;
    sway: number;
    angle: number;
    spin: number;
    free: Rgb;
    word: Rgb;
    tx: number;
    ty: number;
    /** Separación por el puntero, suavizada */
    rx: number;
    ry: number;
  };

  /* El polvo fino es lo que hace legible la palabra: muchas motas pequeñas,
     una por celda del logotipo, con su color y su transparencia. Solo existe
     mientras la palabra está formada, así que no tiene física: va de su sitio
     de salida a su destino interpolando. */
  type Mota = {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    /** Retraso de entrada, para que la palabra cuaje en vez de aparecer. */
    delay: number;
  };

  let petals: Petal[] = [];
  let motas: Mota[] = [];
  /* La palabra al máximo detalle, pintada una sola vez: una celda por píxel
     del logotipo. Son decenas de miles de celdas, demasiadas para repintar a
     60 fps, pero el resultado no cambia nunca, así que se guarda y se vuelca.
     No es "una imagen encima": es el destino final de las motas, con sus
     mismos colores y su misma rejilla. */
  let wordCanvas: HTMLCanvasElement | null = null;
  /* Dibujar mota a mota cambiando el color cada vez es lo que mata el
     rendimiento. Se agrupan por color y transparencia redondeados: un
     fillStyle y un solo trazado por grupo. */
  let grupos: { estilo: string; indices: number[] }[] = [];
  let w = 0;
  let h = 0;
  /* Lado de la celda en píxeles de pantalla. Formados, cada pétalo pinta un
     cuadrado de este tamaño, así las celdas se tocan y la palabra sale
     maciza en vez de punteada. */
  let cellPx = 10;
  let dpr = 1;
  /** Rectángulo que ocupa la palabra en pantalla; lo usa la dispersión. */
  let wordBox = { x: 0, y: 0, w: 0, h: 0 };

  /* --- El logotipo como molde ---
     Antes la palabra se redibujaba con la tipografía y se pintaba encima una
     imagen: se notaba el pegote. Ahora se leen los píxeles del propio
     logotipo de la web, y cada pétalo se queda con el color exacto del píxel
     que le toca. El resultado formado es el logotipo, letra por letra. */
  type LogoPixel = { x: number; y: number; c: Rgb; a: number };
  let logoPixels: LogoPixel[] = [];
  let logoW = 1;
  let logoH = 1;

  const readLogo = (img: HTMLImageElement) => {
    const off = document.createElement('canvas');
    // Resolución de muestreo: suficiente para el filo de las letras
    // 760 px de ancho: suficiente para celdas de 2-3 px en pantallas grandes
    const scale = Math.min(1, 760 / (img.naturalWidth || 760));
    off.width = Math.max(1, Math.round((img.naturalWidth || 398) * scale));
    off.height = Math.max(1, Math.round((img.naturalHeight || 160) * scale));
    const octx = off.getContext('2d', { willReadFrequently: true });
    if (!octx) return;
    octx.drawImage(img, 0, 0, off.width, off.height);

    let data: Uint8ClampedArray;
    try {
      data = octx.getImageData(0, 0, off.width, off.height).data;
    } catch {
      return; // lienzo contaminado: sin palabra, pero los pétalos siguen
    }

    const pixels: LogoPixel[] = [];
    let minX = off.width;
    let maxX = 0;
    let minY = off.height;
    let maxY = 0;
    for (let y = 0; y < off.height; y++) {
      for (let x = 0; x < off.width; x++) {
        const i = (y * off.width + x) * 4;
        const alfa = data[i + 3]!;
        // Hasta las motas del borde cuentan: su transparencia es el antialias
        if (alfa < 20) continue;
        pixels.push({ x, y, c: [data[i]!, data[i + 1]!, data[i + 2]!], a: alfa / 255 });
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (pixels.length === 0) return;

    logoW = maxX - minX || 1;
    logoH = maxY - minY || 1;
    logoPixels = pixels.map((px) => ({ x: px.x - minX, y: px.y - minY, c: px.c, a: px.a }));
  };

  /** Escala del logotipo en pantalla y cuánta tinta ocupa, en píxeles. */
  const wordScale = () => {
    if (logoPixels.length === 0) return { scale: 0, ink: 0 };
    const scale = Math.min((w * 0.52) / logoW, (h * 0.34) / logoH);
    return { scale, ink: logoPixels.length * scale * scale };
  };

  /** Reparte `count` destinos por el trazo del logotipo, con color y alfa. */
  function wordTargets(count: number): {
    points: { x: number; y: number; c: Rgb; a: number }[];
    cell: number;
  } {
    if (logoPixels.length === 0 || count <= 0) return { points: [], cell: 10 };

    const { scale } = wordScale();
    const left = (w - logoW * scale) / 2;
    const top = (h - logoH * scale) / 2;
    wordBox = { x: left, y: top, w: logoW * scale, h: logoH * scale };

    /* Un pétalo por celda: el paso sale de repartir el área pintada entre
       los pétalos disponibles, así se cubre el trazo sin amontonar. */
    const step = Math.max(1, Math.sqrt(logoPixels.length / count));
    const vistos = new Set<number>();
    const elegidos: LogoPixel[] = [];
    for (const px of logoPixels) {
      const cx = Math.floor(px.x / step);
      const cy = Math.floor(px.y / step);
      const clave = cy * 8192 + cx;
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      elegidos.push(px);
    }
    if (elegidos.length === 0) return { points: [], cell: 10 };

    /* Reparto a zancadas: coger los `count` primeros dejaría sin formar la
       mitad de abajo del logotipo cuando sobran celdas. */
    const points = Array.from({ length: count }, (_, i) => {
      const px = elegidos[Math.floor((i * elegidos.length) / count) % elegidos.length]!;
      return {
        x: left + px.x * scale,
        y: top + px.y * scale,
        c: px.c,
        a: px.a,
      };
    });

    /* 1.3: con celdas de dos o tres píxeles, pegarlas justo deja una
       rejilla de líneas finas entre ellas. Solapadas, el trazo es macizo. */
    return { points, cell: Math.max(1.2, step * scale * 1.3) };
  }

  /** Cuántos pétalos aguanta el aparato sin despeinarse. */
  function petalBudget() {
    const area = w * h;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
    // Más pétalos que antes: el trazo del logotipo se compone con ellos
    let count = Math.round(area / 1000);

    if (!finePointer) count = Math.round(count * 0.7); // táctil: menos GPU
    if (memory <= 2) count = Math.round(count * 0.5);
    else if (memory <= 4) count = Math.round(count * 0.75);

    return Math.min(1600, Math.max(320, count));
  }

  /** Vuelca la palabra entera, celda a celda, en un lienzo aparte. */
  const pintarPalabra = () => {
    wordCanvas = null;
    if (logoPixels.length === 0) return;

    // Una celda por píxel del logotipo: el detalle máximo que da el molde
    const { points, cell } = wordTargets(logoPixels.length);
    if (points.length === 0 || wordBox.w <= 0) return;

    const lienzo = document.createElement('canvas');
    lienzo.width = Math.max(1, Math.round(wordBox.w * dpr));
    lienzo.height = Math.max(1, Math.round(wordBox.h * dpr));
    const lctx = lienzo.getContext('2d');
    if (!lctx) return;
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Mismo agrupado por color que en vivo: un fillStyle por grupo
    const cubos = new Map<string, { x: number; y: number }[]>();
    for (const pt of points) {
      const r = Math.round(pt.c[0] / 12) * 12;
      const g = Math.round(pt.c[1] / 12) * 12;
      const b = Math.round(pt.c[2] / 12) * 12;
      const a = Math.max(0.15, Math.round(pt.a * 8) / 8);
      const clave = `rgba(${r}, ${g}, ${b}, ${a})`;
      const lista = cubos.get(clave);
      const punto = { x: pt.x - wordBox.x, y: pt.y - wordBox.y };
      if (lista) lista.push(punto);
      else cubos.set(clave, [punto]);
    }

    const mitad = cell / 2;
    for (const [estilo, lista] of cubos) {
      lctx.fillStyle = estilo;
      lctx.beginPath();
      for (const punto of lista) lctx.rect(punto.x - mitad, punto.y - mitad, cell, cell);
      lctx.fill();
    }

    wordCanvas = lienzo;
  };

  const build = () => {
    dpr = Math.min(window.devicePixelRatio || 1, finePointer ? 2 : 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = petalBudget();

    petals = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 1.4,
      vx: 0,
      vy: 0,
      bvx: (Math.random() - 0.5) * 0.12,
      bvy: -0.04 - Math.random() * 0.1,
      a: 0.18 + Math.random() * 0.34,
      phase: Math.random() * Math.PI * 2,
      sway: 0.25 + Math.random() * 0.5,
      angle: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.004,
      free: FREE_COLORS[Math.floor(Math.random() * FREE_COLORS.length)]!,
      word: [255, 255, 255] as Rgb,
      tx: 0,
      ty: 0,
      rx: 0,
      ry: 0,
    })).map((petal) => ({ ...petal, vx: petal.bvx, vy: petal.bvy }));

    /* Tamaño de celda: por debajo de tres píxeles el mosaico deja de verse
       como mosaico y la palabra se lee como tipografía. De ahí sale cuántas
       motas hacen falta, no al revés. */
    /* Las motas que vuelan son las justas para que se vea el viaje; el filo
       de la palabra lo pone el lienzo guardado, no ellas. */
    const lado = finePointer ? 3.4 : 4.6;
    const techo = finePointer ? 6000 : 1800;
    const { ink } = wordScale();
    const necesarias = Math.min(techo, Math.round(ink / (lado * lado)));

    const { points, cell } = wordTargets(necesarias);
    cellPx = cell;
    pintarPalabra();

    motas = points.map((pt) => ({
      sx: Math.random() * w,
      sy: Math.random() * h,
      tx: pt.x,
      ty: pt.y,
      delay: Math.random() * 0.22,
    }));

    /* Un fillStyle por grupo: color redondeado a 16 niveles y alfa a 5.
       Con esto, 12.000 motas se pintan en un centenar de llamadas. */
    const cubos = new Map<string, number[]>();
    points.forEach((pt, i) => {
      const r = Math.round(pt.c[0] / 16) * 16;
      const g = Math.round(pt.c[1] / 16) * 16;
      const b = Math.round(pt.c[2] / 16) * 16;
      const a = Math.max(0.2, Math.round(pt.a * 5) / 5);
      const clave = `rgba(${r}, ${g}, ${b}, ${a})`;
      const lista = cubos.get(clave);
      if (lista) lista.push(i);
      else cubos.set(clave, [i]);
    });
    grupos = Array.from(cubos, ([estilo, indices]) => ({ estilo, indices }));

    /* Los pétalos siguen su vida y acompañan a la palabra como brillo: se
       reparten por el trazo a zancadas para no amontonarse. */
    const targets = points.length > 0 ? points : [];
    const order = petals.map((_, i) => i).sort((a, b) => petals[a]!.x - petals[b]!.x);
    order.forEach((petalIndex, i) => {
      const petal = petals[petalIndex]!;
      const target = targets.length
        ? targets[Math.floor((i * targets.length) / petals.length) % targets.length]!
        : undefined;
      petal.tx = target ? target.x : petal.x;
      petal.ty = target ? target.y : petal.y;
      petal.word = target ? target.c : petal.free;
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

  const rounded = typeof ctx.roundRect === 'function';

  const draw = (time: number, gather: number) => {
    ctx.clearRect(0, 0, w, h);

    /* `form` va por detrás de `gather`: los pétalos primero llegan a su sitio
       y solo al final cuaja la palabra. */
    const form = Math.min(1, Math.max(0, (gather - 0.4) / 0.5));
    const suave = form * form * (3 - 2 * form);

    /* El lienzo entra cuando las motas ya casi han llegado: primero se ve el
       viaje, después el trazo termina de cerrarse. */
    const nitidez = Math.min(1, Math.max(0, (suave - 0.25) / 0.6));
    if (wordCanvas && suave > 0.02) {
      ctx.globalAlpha = nitidez * nitidez;
      ctx.drawImage(wordCanvas, wordBox.x, wordBox.y, wordBox.w, wordBox.h);
    }

    // --- Las motas que viajan ---
    if (suave > 0.004 && motas.length > 0) {
      const lado = cellPx;
      const mitad = lado / 2;
      /* Las motas llevan el viaje; cuando el trazo fino ya está, se apagan
         para no engordarle los cantos con sus celdas grandes. */
      ctx.globalAlpha = suave * (1 - nitidez * 0.88);

      for (const grupo of grupos) {
        ctx.fillStyle = grupo.estilo;
        ctx.beginPath();
        for (const i of grupo.indices) {
          const m = motas[i]!;
          // Cada mota arranca con su retraso: el trazo se va rellenando
          const t = Math.min(1, Math.max(0, (suave - m.delay) / (1 - m.delay)));
          const e = t * t * (3 - 2 * t);
          const x = m.sx + (m.tx - m.sx) * e;
          const y = m.sy + (m.ty - m.sy) * e;
          /* Sin cuadrar a píxel: a este tamaño el suavizado del canvas une
             las celdas, y redondear volvía a abrir la rejilla. */
          ctx.rect(x - mitad, y - mitad, lado, lado);
        }
        ctx.fill();
      }
    }

    // --- Los pétalos ---
    for (const p of petals) {
      const x = p.x + p.rx;
      const y = p.y + p.ry;
      const twinkle = 0.85 + 0.15 * Math.sin(time / 3200 + p.phase);

      const r = p.free[0] + (p.word[0] - p.free[0]) * suave;
      const g = p.free[1] + (p.word[1] - p.free[1]) * suave;
      const b = p.free[2] + (p.word[2] - p.free[2]) * suave;
      ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;

      /* Formados se apagan: el trazo lo pone el polvo fino y los pétalos
         solo le dan vida por encima. */
      ctx.globalAlpha = p.a * twinkle * (1 - suave * 0.55);

      ctx.beginPath();
      const ancho = p.r * (1.9 - suave * 1.0);
      const alto = p.r * (0.85 + suave * 0.05);
      ctx.ellipse(x, y, ancho, alto, p.angle * (1 - suave), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  };

  let lastGather = 0;
  let releasing = false;

  /* Al soltar la palabra hacen falta ganas de irse: sin empujón se quedaban
     apelotonadas donde estaba el texto, formando un rectángulo. */
  const scatter = () => {
    const cx = wordBox.x + wordBox.w / 2;
    const cy = wordBox.y + wordBox.h / 2;
    for (const p of petals) {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = 1.4 + Math.random() * 2.6;
      p.vx = (dx / dist) * speed + (Math.random() - 0.5) * 0.8;
      p.vy = (dy / dist) * speed + (Math.random() - 0.5) * 0.8;
    }
  };

  const REPEL_R = 150;
  const REPEL_MAX = 34;

  const step = (time: number) => {
    easeScene();
    const gather = gatherAt(time);

    const wasReleasing = releasing;
    releasing = gather < lastGather - 0.0001;
    if (releasing && !wasReleasing) scatter();
    lastGather = gather;

    const repelOn = finePointer && gather > 0.35 && pointer.active;

    for (const p of petals) {
      // Al soltar ya no tira el destino: si no, volverían a la palabra
      if (gather > 0.001 && !releasing) {
        const pull = 0.03 + gather * 0.14;
        p.x += (p.tx - p.x) * pull * gather;
        p.y += (p.ty - p.y) * pull * gather;
      }

      // El impulso se va apagando hasta recuperar la deriva de siempre
      p.vx += (p.bvx - p.vx) * 0.012;
      p.vy += (p.bvy - p.vy) * 0.012;

      // Formados casi no derivan: si no, el trazo se emborrona
      const free = releasing ? 1 : 1 - gather * 0.97;
      p.x += (p.vx + Math.sin(time / 2600 + p.phase) * p.sway * 0.35) * free;
      p.y += p.vy * free;
      p.angle += p.spin * free;

      /* Con la palabra formada, el puntero aparta las celdas cercanas y
         estas vuelven solas al soltarlas. */
      let wantX = 0;
      let wantY = 0;
      if (repelOn) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_R && dist > 0.01) {
          const force = (1 - dist / REPEL_R) ** 2 * REPEL_MAX * gather;
          wantX = (dx / dist) * force;
          wantY = (dy / dist) * force;
        }
      }
      p.rx += (wantX - p.rx) * 0.16;
      p.ry += (wantY - p.ry) * 0.16;

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
    /* Si se mide antes de que el lienzo tenga tamaño, todo se calcula sobre
       cero y la palabra sale minúscula y descolocada. Se espera un frame. */
    if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
      requestAnimationFrame(boot);
      return;
    }

    build();
    if (reduced) draw(0, 0);
    else start();
  };

  /* El molde es el logotipo. Se reutiliza el que ya está en la cabecera —misma
     URL, así sale de la caché— y, cuando se puede leer, se reconstruyen los
     destinos. Hasta entonces los pétalos vuelan sueltos. */
  const cargarLogo = () => {
    const enCabecera = document.querySelector<HTMLImageElement>('.logo-link img');
    const src = enCabecera?.currentSrc || `${import.meta.env.BASE_URL}brand/logo-light.webp`;
    const img = new Image();
    img.decoding = 'async';
    img.src = src;

    const listo = () => {
      readLogo(img);
      if (logoPixels.length > 0 && w > 0) build();
    };

    if (img.complete && img.naturalWidth > 0) listo();
    else img.addEventListener('load', listo, { once: true });
  };

  boot();
  cargarLogo();

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

    pointer.x = ev.clientX;
    pointer.y = ev.clientY;
    pointer.active = true;
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
  document.addEventListener('pointerleave', () => {
    document.querySelector('.cursor-glow')?.classList.remove('is-on');
    pointer.active = false;
  });
  document.querySelector('.cursor-glow')?.classList.add('is-on');
}

setupGlobal();
setupPage();

/* Con ClientRouter el documento se sustituye en cada navegación y hay que
   volver a montar. Se escucha `after-swap` y no `page-load` porque este
   último también dispara en la carga inicial y duplicaría el montaje. */
document.addEventListener('astro:after-swap', setupPage);
