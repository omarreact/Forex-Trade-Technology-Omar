/* Accessible in-flow submenu. The header grows naturally when opened. */
document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.bs-inline-nav');
  if (!nav) return;
  var toggle = nav.querySelector('.bs-nav-toggle');
  var submenu = nav.querySelector('.bs-nav-submenu');
  if (!toggle || !submenu) return;
  if (!document.getElementById('top') && window.fttSiteHome) {
    document.querySelectorAll('.bs-site-header a[href^="#"]').forEach(function (link) {
      link.href = window.fttSiteHome + link.getAttribute('href');
    });
  }
  toggle.addEventListener('click', function () {
    submenu.hidden = !submenu.hidden;
    toggle.setAttribute('aria-expanded', String(!submenu.hidden));
  });
  nav.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !submenu.hidden) { submenu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  });
  submenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      submenu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});
