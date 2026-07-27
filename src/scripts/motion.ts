/**
 * Motion: reveals, parallax, foco de luz en tarjetas, botones magnéticos,
 * barra de progreso y estado de la cabecera. Sin librerías.
 * Todo lo no esencial se desactiva con prefers-reduced-motion (spec §9.5).
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

/* --- Stagger dentro de grupos --- */
document.querySelectorAll('[data-reveal-group]').forEach((group) => {
  group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 90, 540)}ms`;
  });
});

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

/* --- Scroll: progreso, cabecera, parallax de capas y escenario --- */
const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
const progressFill = document.querySelector<HTMLElement>('.progress-fill');
const header = document.querySelector<HTMLElement>('.site-header');
const scene = document.querySelector<HTMLElement>('.bg-scene');

const onScroll = perFrame(() => {
  const doc = document.documentElement;
  const y = window.scrollY;

  if (progressFill) {
    const max = doc.scrollHeight - window.innerHeight;
    progressFill.style.width = `${max > 0 ? ((y / max) * 100).toFixed(2) : 0}%`;
  }

  header?.classList.toggle('is-scrolled', y > 12);

  if (reduced) return;

  scene?.style.setProperty('--scene-y', `${(-y * 0.05).toFixed(1)}px`);

  const mid = window.innerHeight / 2;
  for (const el of parallaxEls) {
    const speed = Number.parseFloat(el.dataset.parallax ?? '0.1');
    const rect = el.getBoundingClientRect();
    el.style.setProperty(
      '--parallax-y',
      `${((rect.top + rect.height / 2 - mid) * -speed).toFixed(1)}px`,
    );
  }
});

window.addEventListener('scroll', () => onScroll(null), { passive: true });
window.addEventListener('resize', () => onScroll(null), { passive: true });
onScroll(null);

/* --- Inclinación 3D que se endereza al entrar en pantalla --- */
if (!reduced && 'IntersectionObserver' in window) {
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

/* --- Foco de luz que sigue al puntero dentro de las tarjetas --- */
if (finePointer) {
  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    const move = perFrame<PointerEvent>((ev) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${((ev.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--spot-y', `${((ev.clientY - rect.top) / rect.height) * 100}%`);
    });
    card.addEventListener('pointermove', move, { passive: true });
  });
}

/* --- Botones magnéticos --- */
if (!reduced && finePointer) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const move = perFrame<PointerEvent>((ev) => {
      const rect = el.getBoundingClientRect();
      const dx = (ev.clientX - (rect.left + rect.width / 2)) * 0.22;
      const dy = (ev.clientY - (rect.top + rect.height / 2)) * 0.3;
      el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    });
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', () => {
      el.style.translate = '0px 0px';
    });
  });
}

/* --- Parallax de ratón en el hero --- */
if (!reduced && finePointer) {
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
