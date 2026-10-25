(() => {
  const include = async (selector, url) => {
    const host = document.querySelector(selector);
    if (!host) return;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not load ${url}: ${response.status}`);
      host.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
      host.setAttribute("data-include-error", "true");
    }
  };

  const setCurrentNavigation = () => {
    const current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".primary-navigation a").forEach((link) => {
      const target = new URL(link.href, location.href).pathname.split("/").pop();
      if (target === current) link.setAttribute("aria-current", "page");
    });
  };

  const addPageTitle = () => {
    const title = document.body.dataset.pageTitle;
    if (!title || document.body.dataset.page === "home") return;
    const main = document.querySelector("main");
    if (!main) return;
    const bar = document.createElement("section");
    const inner = document.createElement("div");
    const eyebrow = document.createElement("p");
    const heading = document.createElement("h1");
    bar.className = "page-title-bar";
    inner.className = "container";
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Forex Trade Technology";
    heading.textContent = title;
    inner.append(eyebrow, heading);
    bar.append(inner);
    main.before(bar);
  };

  Promise.all([
    include("[data-site-header]", "partials/header.html"),
    include("[data-site-footer]", "partials/footer.html"),
  ]).then(() => {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".primary-navigation");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        nav.classList.toggle("is-open", open);
      });
    }
    setCurrentNavigation();
    const year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
  });
  addPageTitle();
})();
