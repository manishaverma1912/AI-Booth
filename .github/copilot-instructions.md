# Copilot & AI Assistant Instructions — AI Photo Booth

Purpose: brief, actionable instructions for AI coding agents working on this repository.

Repo overview
- Single-page static website (Vanilla HTML/CSS/JS) used to showcase AI Photo Booth features.
- Primary files: `index.html` (structure & inline content), `styles.css` (global styles & variables), `scripts.js` (UI behavior), `assets/*` (images/videos) and `icons/*` (site icons).

Big picture (why/what):
- This is a static marketing/demo site for an AI Photo Booth product. The site contains hero carousel, portfolio carousel, featured sections, and a contact form. Animations are driven by CSS classes toggled by `scripts.js`.
- Design decisions: minimal dependency approach (no build tools), strong focus on accessibility (ARIA in carousels & modal), grid/flex-based layout with CSS variables in `styles.css` for theming.

Key patterns & conventions:
- JavaScript: Vanilla ES6; hand-coded animations use class transitions set in JS (`img-pre`, `img-active`, `img-exit`) and RB animation patterns using `requestAnimationFrame`.
- Use of HTML dataset attributes: `data-title`, `data-eyebrow`, `data-highlight`, etc. in carousel/picture markup — `scripts.js` reads dataset values to populate left content.
- IDs/Selectors: use the structural IDs declared in `index.html` (e.g., `#left-wrapper`, `#hero-eyebrow`, `#hero-title`, `#hero-lead`, `#hero-cta`, `#hero-secondary`, `#portfolioModal`, `#menu-panel`, `#menu-toggle`). Use these IDs in JS changes for predictable behavior.
- Accessibility: keep `role`, `aria-label`, and `aria-hidden` attributes on dynamic elements where they exist (carousels, modal, navigation). Maintain keyboard handlers for `ArrowLeft`/`ArrowRight` and Escape for modals/menus.

Developer workflows (local run / debug):
- No build step; serve the directory using a static HTTP server.
  - Option 1 (Python): `python -m http.server 8000` then open `http://localhost:8000`
  - Option 2 (Node): `npx http-server` or `npx serve` if Node installed
  - Option 3: open `index.html` directly in the browser for basic previews (some browsers block local file iframe/video requests; use a server if encountering problems).
- Debugging tips:
  - Use browser DevTools; JS is in `scripts.js` and CSS in `styles.css`.
  - For carousel issues: inspect `.carousel-track`, `.carousel-slide` elements; `data-*` attributes control left-side copy.
  - For modal/video: check `data-video` attribute and `portfolioModal` handlers.
  - For menu: check `#menu-toggle` and `#menu-panel` alignment logic in `index.html` inline script.

Where to add new features:
- Add interface logic to `scripts.js` — functions should operate on IDs above.
- Add styling to `styles.css`. Avoid inline styles unless the content is truly single-use (maintainability).

Integration points & third-party resources to be aware of:
- Google Fonts: `Inter` is used via a link tag in `index.html`.
- YouTube video embeds: `data-video` attributes hold YouTube embed URLs for carousel/modals.
- No package manager or CI configured — repo is a static website. If adding automation, consider adding `package.json` and a `build` step.

Testing and QA:
- Manual QA only: preview in latest Chrome/Edge/Firefox (desktop) and mobile sizes (emulated or physical device).
- Cross-browser tips: Use `position`, `transform` and `overflow` tests for responsive behaviors (hero buttons, menu panel, carousel tracks).

Git / Contribution guidelines:
- Branches: use feature/topic branches: `feat/<short-description>` or `fix/<short-description>`.
- Commit format: short conventional style (e.g.: `feat: add autoplay pause on hover`, `fix: modal close key handler`).
- PRs: request at least one code review for UI/UX changes.

What not to change without approval:
- Major CSS variable names in `:root` (`--brand`, `--brand-dark`, etc.) — these drive theming across the site.
- Core JS animation classes (`img-pre`, `img-active`, `img-exit`, `enter`, `exit`) — these are referenced by `scripts.js` logic and by CSS timing.

Examples:
- To update hero slide content: edit the `picture` element markup inside `index.html` (add/modify `data-title`, `data-eyebrow`, `data-highlight`, `data-lead`, `data-cta-text`, `data-cta-href`). `scripts.js` reads these and updates the left column.
- To add a new portfolio slide: add a `div.slide` in the `.carousel-track` under `portfolioTrack`, set `data-video`, add `picture`, and it will be used by the existing modal.

If you are an AI making code suggestions:
- Prefer minimal, incremental changes that preserve current UX. Implement small commits with focused descriptions.
- Keep accessibility in mind: add ARIA attributes for new interactive elements and ensure keyboard handlers are present.
- When changing CSS, keep global variables consistent and consider the impact on mobile responsive breakpoints below 768px.

If anything is unclear or you want me to add more examples, ask for clarifications and I’ll iterate on the instructions.