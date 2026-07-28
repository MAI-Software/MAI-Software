# MAI Softwares — Web corporativa

Web corporativa y portfolio editorial de **MAI Softwares**: videojuegos, SaaS y experiencias web.

- Stack: **Astro + TypeScript + CSS** (estático, sin backend)
- Idiomas: **ES** (por defecto, `/`) y **EN** (`/en/`)
- En producción: **https://mai-software.github.io** — GitHub Pages, deploy automático con cada push a `main` (GitHub Actions)

## Comandos

| Comando           | Acción                                    |
| ----------------- | ----------------------------------------- |
| `npm install`     | Instala dependencias                      |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321`|
| `npm run build`   | Build de producción en `./dist/`          |
| `npm run preview` | Previsualiza el build                     |

## Añadir un nuevo proyecto

1. Crea `src/content/projects/es/mi-proyecto.md` y `src/content/projects/en/mi-proyecto.md` (mismo `slug` en ambos).
2. Añade `public/projects/mi-proyecto/cover.webp` (16:10) y capturas opcionales.
3. Completa el frontmatter (categoría: `game` | `saas` | `web`; variante: `featured` | `wide` | `split-left` | `split-right` | `compact` | `editorial`).
4. `npm run build` y publica.

**No hace falta tocar ningún componente.**

## Activar el formulario de contacto

1. Entra en [web3forms.com](https://web3forms.com), pon tu email y copia la **Access Key**.
2. Pégala en `src/data/company.ts` → `contact.web3formsKey`.
3. Haz push: el formulario aparece solo.

La clave es pública por diseño (es de cliente), así que puede vivir en el repo.
Mientras esté vacía, `/contacto` muestra los enlaces directos en lugar de un
formulario que no funcionaría.

## Pendiente de contenido real

- Email de contacto y redes en `src/data/company.ts`.
- Access Key de Web3Forms (ver arriba).
- Dominio propio (opcional): configurar en Pages y actualizar `astro.config.mjs`.
- Datos legales cuando exista constitución (`/legal`).
