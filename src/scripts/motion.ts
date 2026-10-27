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
    /** Cuánta luz de haz recibe ahora mismo, de 0 a 1. */
    luz: number;
    /** Nodo de la red: unos pocos se enlazan con sus vecinos. */
    nodo: boolean;
    /** Brilla con halo propio cuando la nube se suelta. */
    brilla: boolean;
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
    /** Punto de control: la mota llega curvando, no en línea recta. */
    cx: number;
    cy: number;
    /** Retraso de entrada, para que la palabra cuaje en vez de aparecer. */
    delay: number;
    /** Dirección y empuje de salida al soltarse. */
    fx: number;
    fy: number;
  };

  /* --- Haces de luz ---
     Antes eran cuatro barras de CSS detrás del lienzo: no podían iluminar a
     las partículas ni proyectar nada, porque vivían en otra capa. Ahora se
     dibujan aquí, así que el polvo que les pasa cerca se enciende, se aparta
     de su estela y el propio haz deja una sombra bajo él. */
  type Haz = {
    /** Centro, en fracción del lienzo: sobrevive a los cambios de tamaño. */
    fx: number;
    fy: number;
    largo: number;
    grosor: number;
    ang: number;
    /** Velocidad de deriva en su propio eje, px por fotograma. */
    vel: number;
    fase: number;
    color: Rgb;
    fuerza: number;
  };

  const haces: Haz[] = [
    { fx: 0.82, fy: 0.1, largo: 320, grosor: 15, ang: -0.59, vel: 0.1, fase: 0, color: [56, 130, 251], fuerza: 0.9 },
    { fx: 0.08, fy: 0.46, largo: 270, grosor: 12, ang: -0.59, vel: -0.07, fase: 1.9, color: [98, 66, 252], fuerza: 0.7 },
    { fx: 0.72, fy: 0.8, largo: 420, grosor: 14, ang: -0.59, vel: 0.055, fase: 3.4, color: [16, 200, 252], fuerza: 0.62 },
    { fx: 0.2, fy: 0.26, largo: 190, grosor: 10, ang: -0.59, vel: -0.12, fase: 5.1, color: [120, 150, 255], fuerza: 0.5 },
  ];

  /** Radio de influencia del haz sobre el polvo, en píxeles. */
  const HAZ_R = 110;

  /** Hasta dónde se enlazan dos nodos de la red. */
  const RED_R = 190;
  const RED_R2 = RED_R * RED_R;

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
     El molde es el logotipo en alta resolución (1600 px de ancho). Se muestrea
     a la medida exacta que va a ocupar en pantalla —un píxel de muestreo por
     píxel de dispositivo—, así el trazo sale con el mismo filo que el
     logotipo de la cabecera y no con el de una imagen ampliada. */
  let logoImg: HTMLImageElement | null = null;
  let logoData: ImageData | null = null;
  let logoW = 1;
  let logoH = 1;
  /** Cuántos píxeles del muestreo tienen tinta. */
  let logoInk = 0;

  const muestrearLogo = (anchoPx: number) => {
    if (!logoImg) return;
    const aw = logoImg.naturalWidth || 1;
    const ah = logoImg.naturalHeight || 1;
    const ancho = Math.max(120, Math.min(aw, Math.round(anchoPx)));
    const alto = Math.max(1, Math.round((ancho * ah) / aw));
    if (logoData && logoW === ancho && logoH === alto) return;

    const off = document.createElement('canvas');
    off.width = ancho;
    off.height = alto;
    const octx = off.getContext('2d', { willReadFrequently: true });
    if (!octx) return;
    octx.drawImage(logoImg, 0, 0, ancho, alto);

    try {
      logoData = octx.getImageData(0, 0, ancho, alto);
    } catch {
      logoData = null; // lienzo contaminado: sin palabra, pero siguen los pétalos
      return;
    }

    logoW = ancho;
    logoH = alto;
    logoInk = 0;
    const d = logoData.data;
    for (let i = 3; i < d.length; i += 4) if (d[i]! >= 20) logoInk++;
  };

  /** Tamaño que ocupa la palabra en pantalla y cuánta tinta tiene. */
  const wordScale = () => {
    if (!logoImg) return { scale: 0, ink: 0, ancho: 0, alto: 0 };
    const aw = logoImg.naturalWidth || 1;
    const ah = logoImg.naturalHeight || 1;
    const ancho = Math.min(w * 0.52, h * 0.34 * (aw / ah));
    const alto = (ancho * ah) / aw;
    const scale = logoW > 0 ? ancho / logoW : 0;
    return { scale, ink: logoInk * scale * scale, ancho, alto };
  };

  /** Reparte `count` destinos por el trazo, con el color de cada píxel. */
  function wordTargets(count: number): {
    points: { x: number; y: number; c: Rgb; a: number }[];
    cell: number;
  } {
    const vacio = { points: [] as { x: number; y: number; c: Rgb; a: number }[], cell: 4 };
    if (!logoData || logoInk === 0 || count <= 0) return vacio;

    const { scale, ancho, alto } = wordScale();
    if (scale <= 0) return vacio;

    const left = (w - ancho) / 2;
    const top = (h - alto) / 2;
    wordBox = { x: left, y: top, w: ancho, h: alto };

    const paso = Math.max(1, Math.sqrt(logoInk / count));
    const d = logoData.data;
    const points: { x: number; y: number; c: Rgb; a: number }[] = [];
    for (let y = 0; y < logoH; y += paso) {
      const fy = Math.min(logoH - 1, Math.round(y));
      for (let x = 0; x < logoW; x += paso) {
        const fx = Math.min(logoW - 1, Math.round(x));
        const i = (fy * logoW + fx) * 4;
        const a = d[i + 3]!;
        if (a < 20) continue;
        points.push({
          x: left + fx * scale,
          y: top + fy * scale,
          c: [d[i]!, d[i + 1]!, d[i + 2]!],
          a: a / 255,
        });
      }
    }
    if (points.length === 0) return vacio;

    /* 1.25: con celdas de dos o tres píxeles, pegarlas justo deja una rejilla
       de líneas finas entre ellas. Solapadas, el trazo es macizo. */
    return { points, cell: Math.max(1.2, paso * scale * 1.25) };
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

  /** Vuelca la palabra entera en un lienzo aparte, celda a celda.
      Dos píxeles de dispositivo por celda: a ese tamaño el mosaico deja de
      verse y queda el filo del logotipo. Se pinta una vez por medida. */
  const pintarPalabra = () => {
    wordCanvas = null;
    if (!logoData || logoInk === 0) return;

    const { scale, ancho, alto } = wordScale();
    if (scale <= 0 || ancho <= 0) return;

    wordBox = { x: (w - ancho) / 2, y: (h - alto) / 2, w: ancho, h: alto };

    const lienzo = document.createElement('canvas');
    lienzo.width = Math.max(1, Math.round(ancho * dpr));
    lienzo.height = Math.max(1, Math.round(alto * dpr));
    const lctx = lienzo.getContext('2d');
    if (!lctx) return;

    /* Se trabaja en píxeles de dispositivo: una celda cada dos, del tamaño
       de dos, para que se toquen sin rejilla. */
    const d = logoData.data;
    const porPixel = (ancho * dpr) / logoW;
    const lado = Math.max(1, 2 * porPixel);
    const cubos = new Map<string, number[]>();

    for (let y = 0; y < logoH; y += 2) {
      for (let x = 0; x < logoW; x += 2) {
        const i = (y * logoW + x) * 4;
        const a = d[i + 3]!;
        if (a < 20) continue;
        /* Redondeo fino. Con pasos de 20 niveles, el degradado de la A se
           veía a bandas: el ahorro de grupos no compensa el escalón. */
        const r = Math.round(d[i]! / 5) * 5;
        const g = Math.round(d[i + 1]! / 5) * 5;
        const b = Math.round(d[i + 2]! / 5) * 5;
        const al = Math.max(0.08, Math.round((a / 255) * 24) / 24);
        const clave = `rgba(${r}, ${g}, ${b}, ${al})`;
        const lista = cubos.get(clave);
        if (lista) lista.push(i);
        else cubos.set(clave, [i]);
      }
    }

    for (const [estilo, lista] of cubos) {
      lctx.fillStyle = estilo;
      lctx.beginPath();
      for (const i of lista) {
        const px = (i / 4) % logoW;
        const py = Math.floor(i / 4 / logoW);
        lctx.rect(px * porPixel - lado / 2, py * porPixel - lado / 2, lado, lado);
      }
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
      luz: 0,
      nodo: false,
      brilla: Math.random() < 0.06,
    })).map((petal) => ({ ...petal, vx: petal.bvx, vy: petal.bvy }));

    /* Nodos de la red: ni muchos ni al azar puro. Un número fijo, repartido
       en el reparto del array, para que no se amontonen en una esquina. */
    const nodos = Math.min(70, Math.max(26, Math.round(petals.length / 18)));
    const salto = Math.max(1, Math.floor(petals.length / nodos));
    for (let i = 0; i < petals.length; i += salto) petals[i]!.nodo = true;

    /* Tamaño de celda: por debajo de tres píxeles el mosaico deja de verse
       como mosaico y la palabra se lee como tipografía. De ahí sale cuántas
       motas hacen falta, no al revés. */
    /* El molde se muestrea a la medida exacta en píxeles de dispositivo:
       ni de más (gasto) ni de menos (filo de imagen ampliada). */
    muestrearLogo(Math.min(2400, Math.round(w * 0.52 * dpr)));

    /* Las motas que vuelan son las justas para que se vea el viaje; el filo
       de la palabra lo pone el lienzo guardado, no ellas. */
    const lado = finePointer ? 3.4 : 4.6;
    const techo = finePointer ? 6000 : 1800;
    const { ink } = wordScale();
    const necesarias = Math.min(techo, Math.round(ink / (lado * lado)));

    const { points, cell } = wordTargets(necesarias);
    cellPx = cell;
    pintarPalabra();

    const centroX = wordBox.x + wordBox.w / 2;
    const centroY = wordBox.y + wordBox.h / 2;

    motas = points.map((pt) => {
      /* Salen de los bordes, no de cualquier punto: así se ve de dónde viene
         la nube en vez de aparecer materia de la nada en medio del texto. */
      const lado = Math.random();
      const sx = lado < 0.5 ? (lado < 0.25 ? -60 : w + 60) : Math.random() * w;
      const sy = lado < 0.5 ? Math.random() * h : lado < 0.75 ? -60 : h + 60;

      /* Punto de control desplazado en perpendicular: el viaje describe un
         arco. Sin esto, mil líneas rectas al mismo sitio parecen una tubería. */
      const mx = (sx + pt.x) / 2;
      const my = (sy + pt.y) / 2;
      const dx = pt.x - sx;
      const dy = pt.y - sy;
      const largo = Math.hypot(dx, dy) || 1;
      const curva = (Math.random() - 0.5) * largo * 0.45;

      // Las de fuera entran antes: la palabra se arma de los bordes al centro
      const lejos = Math.hypot(pt.x - centroX, pt.y - centroY) / (Math.hypot(w, h) || 1);
      const salida = Math.atan2(pt.y - centroY, pt.x - centroX) + (Math.random() - 0.5) * 1.2;

      return {
        sx,
        sy,
        tx: pt.x,
        ty: pt.y,
        cx: mx + (-dy / largo) * curva,
        cy: my + (dx / largo) * curva,
        delay: Math.min(0.42, lejos * 0.3 + Math.random() * 0.16),
        fx: Math.cos(salida) * (0.8 + Math.random() * 1.6),
        fy: Math.sin(salida) * (0.8 + Math.random() * 1.6),
      };
    });

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

  /** Centro del haz en píxeles, con su deriva y su vaivén lento. */
  const hazCentro = (haz: Haz, time: number) => {
    const t = time / 1000;
    // Recorre su eje y vuelve a entrar por el otro lado: nunca se para
    const avance = ((t * haz.vel * 60) % (haz.largo * 4)) - haz.largo * 2;
    const vaiven = Math.sin(t * 0.21 + haz.fase) * 40;
    return {
      x: haz.fx * w + Math.cos(haz.ang) * avance + Math.cos(haz.ang + Math.PI / 2) * vaiven,
      y: haz.fy * h + Math.sin(haz.ang) * avance + Math.sin(haz.ang + Math.PI / 2) * vaiven,
    };
  };

  /** Distancia de un punto al segmento del haz, y su posición en el eje. */
  const distanciaAlHaz = (haz: Haz, cx: number, cy: number, px: number, py: number) => {
    const dx = Math.cos(haz.ang);
    const dy = Math.sin(haz.ang);
    const rx = px - cx;
    const ry = py - cy;
    const sobreEje = Math.max(-haz.largo / 2, Math.min(haz.largo / 2, rx * dx + ry * dy));
    const ex = cx + dx * sobreEje;
    const ey = cy + dy * sobreEje;
    return { d: Math.hypot(px - ex, py - ey), dx, dy };
  };

  /** Capsula tumbada sobre el eje del haz. */
  const capsula = (cx: number, cy: number, haz: Haz, largo: number, grosor: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(haz.ang);
    ctx.beginPath();
    if (rounded) ctx.roundRect(-largo / 2, -grosor / 2, largo, grosor, grosor / 2);
    else ctx.rect(-largo / 2, -grosor / 2, largo, grosor);
    ctx.fill();
    ctx.restore();
  };

  const pintarHaces = (time: number) => {
    for (const haz of haces) {
      const { x, y } = hazCentro(haz, time);
      // Latido muy lento: un haz fijo se lee como una raya pegada al cristal
      const pulso = 0.78 + 0.22 * Math.sin(time / 2600 + haz.fase);
      const [r, g, b] = haz.color;

      /* Sombra: una banda oscura desplazada bajo el haz. Es lo que hace que
         parezca que la luz pasa por delante del fondo y no dentro de él. */
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.3 * haz.fuerza * pulso;
      ctx.fillStyle = 'rgb(2, 3, 8)';
      capsula(x + 7, y + 11, haz, haz.largo * 0.96, haz.grosor * 1.9);

      // Halo y núcleo, sumando luz
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.07 * haz.fuerza * pulso;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      capsula(x, y, haz, haz.largo, haz.grosor * 4.2);
      ctx.globalAlpha = 0.11 * haz.fuerza * pulso;
      capsula(x, y, haz, haz.largo * 0.98, haz.grosor * 2.1);
      ctx.globalAlpha = 0.2 * haz.fuerza * pulso;
      capsula(x, y, haz, haz.largo * 0.94, haz.grosor * 0.85);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  };

  const draw = (time: number, gather: number) => {
    ctx.clearRect(0, 0, w, h);
    pintarHaces(time);

    /* `form` va por detrás de `gather`: los pétalos primero llegan a su sitio
       y solo al final cuaja la palabra. */
    const form = Math.min(1, Math.max(0, (gather - 0.4) / 0.5));
    const suave = form * form * (3 - 2 * form);

    /* El lienzo entra cuando las motas ya casi han llegado: primero se ve el
       viaje, después el trazo termina de cerrarse. */
    const nitidez = Math.min(1, Math.max(0, (suave - 0.25) / 0.6));
    if (wordCanvas && suave > 0.02 && dispersion < 0.95) {
      ctx.globalAlpha = nitidez * nitidez * (1 - dispersion);
      ctx.drawImage(wordCanvas, wordBox.x, wordBox.y, wordBox.w, wordBox.h);
    }

    // --- Las motas que viajan ---
    if (suave > 0.004 && motas.length > 0) {
      const lado = cellPx;
      const mitad = lado / 2;
      /* Las motas llevan el viaje; cuando el trazo fino ya está, se apagan
         para no engordarle los cantos con sus celdas grandes. Al dispersarse
         vuelven a encenderse un momento: son ellas las que se van. */
      const brillo = dispersion > 0 ? 1 - dispersion : 1 - nitidez * 0.88;
      ctx.globalAlpha = suave * Math.max(0, brillo);

      for (const grupo of grupos) {
        ctx.fillStyle = grupo.estilo;
        ctx.beginPath();
        for (const i of grupo.indices) {
          const m = motas[i]!;
          // Cada mota arranca con su retraso: el trazo se va rellenando
          const t = Math.min(1, Math.max(0, (suave - m.delay) / (1 - m.delay)));
          /* Entrada con frenada (ease-out cúbica): llegan rápido y posan
             despacio, que es como cae algo de verdad. */
          const e = 1 - (1 - t) ** 3;
          const u = 1 - e;
          // Curva de Bézier cuadrática: el viaje hace arco
          let x = u * u * m.sx + 2 * u * e * m.cx + e * e * m.tx;
          let y = u * u * m.sy + 2 * u * e * m.cy + e * e * m.ty;

          /* Al soltarse salen despedidas hacia fuera en vez de desvanecerse
             en el sitio, que dejaba el rectángulo de la palabra marcado. */
          if (dispersion > 0) {
            const vuelo = dispersion * dispersion * 320;
            x += m.fx * vuelo;
            y += m.fy * vuelo;
          }
          /* Sin cuadrar a píxel: a este tamaño el suavizado del canvas une
             las celdas, y redondear volvía a abrir la rejilla. */
          ctx.rect(x - mitad, y - mitad, lado, lado);
        }
        ctx.fill();
      }
    }

    /* --- Red de conexiones ---
       Unos pocos pétalos hacen de nodo y se enlazan con los que tienen
       cerca. Se ve cuando la nube está suelta y se apaga al formarse la
       palabra: ahí el protagonismo es del trazo. */
    const redVisible = 1 - suave;
    if (redVisible > 0.03) {
      const nodos = petals.filter((p) => p.nodo);
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodos.length; i++) {
        const a = nodos[i]!;
        for (let j = i + 1; j < nodos.length; j++) {
          const b = nodos[j]!;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > RED_R2) continue;
          const cerca = 1 - Math.sqrt(d2) / RED_R;
          /* Tenue a propósito: una telaraña marcada sobre el texto es ruido,
             y la idea es que se intuya, no que se lea. */
          ctx.strokeStyle = `rgba(120, 170, 255, ${(cerca * 0.14 * redVisible).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x + a.rx, a.y + a.ry);
          ctx.lineTo(b.x + b.rx, b.y + b.ry);
          ctx.stroke();
        }
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
         solo le dan vida por encima. Lo que toca un haz, en cambio, brilla:
         p.luz lo calcula el paso físico, que ya mide esa distancia. */
      const base = p.a * twinkle * (1 - suave * 0.55);
      ctx.globalAlpha = Math.min(1, base * (1 + p.luz * 2.4));

      ctx.beginPath();
      const ancho = p.r * (1.9 - suave * 1.0);
      const alto = p.r * (0.85 + suave * 0.05);
      ctx.ellipse(x, y, ancho, alto, p.angle * (1 - suave), 0, Math.PI * 2);
      ctx.fill();

      /* Unas pocas respiran luz propia. Sube cuando la nube se suelta y
         cuando pasa un haz, así la dispersión tiene brasas. */
      if (p.brilla) {
        const vida = 0.5 + 0.5 * Math.sin(time / 2200 + p.phase * 2);
        const halo = (0.3 + dispersion * 0.7) * vida * (1 - suave * 0.7) + p.luz * 0.5;
        if (halo > 0.02) {
          ctx.globalAlpha = Math.min(0.5, halo * 0.5);
          ctx.beginPath();
          ctx.arc(x, y, p.r * (3.4 + halo * 4.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.globalAlpha = 1;
  };

  let lastGather = 0;
  let releasing = false;
  /* 0 mientras la palabra está, 1 cuando la nube ya se ha ido. Gobierna el
     vuelo de salida de las motas y el apagado del trazo. */
  let dispersion = 0;

  /* Al soltar la palabra hacen falta ganas de irse: sin empujón se quedaban
     apelotonadas donde estaba el texto, formando un rectángulo. */
  const scatter = () => {
    const cx = wordBox.x + wordBox.w / 2;
    const cy = wordBox.y + wordBox.h / 2;
    for (const p of petals) {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      /* Ángulo abierto y velocidad muy desigual: con un empujón radial limpio
         la nube se iba en bloque y volvía a leerse la forma de la palabra. */
      const angulo = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.6;
      const speed = 1.8 + Math.random() * Math.random() * 7;
      p.vx = Math.cos(angulo) * speed;
      p.vy = Math.sin(angulo) * speed - Math.random() * 0.6;
      // Deriva de reposo nueva: cada una se va por su lado y no vuelven en fila
      p.bvx = (Math.random() - 0.5) * 0.3;
      p.bvy = -0.03 - Math.random() * 0.14;
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

    /* Mientras suelta, la dispersión sube deprisa; al volver a juntarse se
       reinicia de golpe para que el siguiente ciclo empiece limpio. */
    dispersion = releasing ? Math.min(1, dispersion + 0.02) : 0;

    const repelOn = finePointer && gather > 0.35 && pointer.active;
    // Un centro por haz y fotograma: calcularlo por partícula era absurdo
    const centrosHaz = haces.map((haz) => hazCentro(haz, time));

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
      const free = releasing ? 1.35 : 1 - gather * 0.97;
      p.x += (p.vx + Math.sin(time / 2600 + p.phase) * p.sway * 0.35) * free;
      p.y += p.vy * free;
      p.angle += p.spin * free;

      /* Estela de los haces: la partícula que entra en uno se enciende, se
         aparta un poco de su eje y se deja arrastrar en su dirección. */
      let luz = 0;
      let arrastreX = 0;
      let arrastreY = 0;
      for (let hi = 0; hi < haces.length; hi++) {
        const haz = haces[hi]!;
        const c = centrosHaz[hi]!;
        const { d, dx, dy } = distanciaAlHaz(haz, c.x, c.y, p.x, p.y);
        if (d >= HAZ_R) continue;
        const fuerza = (1 - d / HAZ_R) ** 2 * haz.fuerza;
        luz = Math.max(luz, fuerza);
        // Perpendicular al haz: la partícula se abre al paso de la luz
        const lado = (p.x - c.x) * -dy + (p.y - c.y) * dx >= 0 ? 1 : -1;
        arrastreX += (-dy * lado * 0.22 + dx * 0.16) * fuerza;
        arrastreY += (dx * lado * 0.22 + dy * 0.16) * fuerza;
      }
      // El encendido sube rápido y baja despacio: deja rastro al pasar
      p.luz += (luz - p.luz) * (luz > p.luz ? 0.3 : 0.04);
      p.x += arrastreX;
      p.y += arrastreY;

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
    const img = new Image();
    img.decoding = 'async';
    img.src = `${import.meta.env.BASE_URL}brand/logo-hires.webp`;

    const listo = () => {
      logoImg = img;
      if (w > 0) build();
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
