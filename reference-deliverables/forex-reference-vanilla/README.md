# Forex Reference Vanilla Site

A dependency-free multi-page HTML/CSS/vanilla-JavaScript starter based on the supplied reference HTML and screenshot. Shared navigation and footer load from `partials/`; inner pages can set `data-page-title` on `<body>` to receive the common title bar.

## Run locally

Because shared partials use `fetch`, serve this folder over HTTP instead of opening `index.html` with `file://`.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. No npm install or build step is needed. Copy `index.html` to create additional pages, set `data-page="inner"` and `data-page-title="Your page title"`, and update the active navigation links as needed.

## Font hosting

The starter imports Inter and Manrope from Google Fonts to match the source HTML. Replace the import in `assets/css/global.css` with local WOFF2 `@font-face` declarations for a self-hosted deployment.
