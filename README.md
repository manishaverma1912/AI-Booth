# AI Photo Booth — Website

This is a static marketing/demo website for the AI Photo Booth product built with plain HTML, CSS, and JavaScript.

Quick start

1. Preview locally by running a simple HTTP server (recommended):

   - Using Python:

     ```powershell
     python -m http.server 8000
     # open http://localhost:8000
     ```

   - Using Node (if available):

     ```powershell
     npx http-server -p 8000
     # open http://localhost:8000
     ```

2. For quick checks, open `index.html` in a browser. Some features (iframe or video) may require a local server.

What's inside
- `index.html` — main markup & many inline scripts/styles for layout
- `styles.css` — global styles and CSS variables
- `scripts.js` — interaction & carousel logic (hero and portfolio) + modal & menu
- `assets/` & `icons/` — media used by the site

Contributing
- Use feature branches and follow a conventional commit message format (e.g., `feat:`, `fix:`, `chore:`).
- Avoid large dependency additions without a clear reason; this is a static site with no current build tool.

License: none provided — include LICENSE if you want to specify one.
