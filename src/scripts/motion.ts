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

  const progressFill = document.querySelector<HTMLElement>('.progress-fill');
  if (progressFill) {
    const max = doc.scrollHeight - window.innerHeight;
    progressFill.style.width = `${max > 0 ? ((y / max) * 100).toFixed(2) : 0}%`;
  }

  document.querySelector<HTMLElement>('.site-header')?.classList.toggle('is-scrolled', y > 12);

  if (reduced) return;

  // Dos capas de fondo a velocidades opuestas: da sensación de profundidad
  const scene = document.querySelector<HTMLElement>('.bg-scene');
  scene?.style.setProperty('--scene-y', `${(-y * 0.12).toFixed(1)}px`);
  scene?.style.setProperty('--scene-grid-y', `${(y * 0.05).toFixed(1)}px`);

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

function setupGlobal() {
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
