'use client';

import { useEffect } from 'react';

/** Enhances source-backed homepage cards without rewriting their approved copy. */
export function OriginalHomeInteractions() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.ftt-home-editorial');
    if (!root) return;

    const steps = root.querySelector<HTMLElement>('#how-it-works');
    steps?.classList.add('ftt-home-launch-cards');
    root.querySelector<HTMLElement>('#who-we-work-with')?.classList.add('ftt-home-parallax-timeline');
    const iconSection = root.querySelector<HTMLElement>('#why-brokers-work-with-us');
    if (iconSection) {
      iconSection.classList.add('ftt-home-icon-cards');
      const iconPaths = [
        '<path d="M4 19V9m5 10V5m5 14v-7m5 7V8"/><path d="M2 19h20"/>',
        '<path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
        '<path d="M4 6h16M7 12h10m-7 6h4"/><circle cx="8" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>',
        '<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="m3 12 9 4 9-4M3 17l9 4 9-4"/>',
        '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="m8.2 7.4 2.6 8m5-8-2.6 8m-4.7-9.4h6.9"/>',
        '<path d="M7 17 17 7M8 7h9v9"/><path d="M4 20h16"/>',
      ];
      iconSection.querySelectorAll<HTMLElement>('.ftt-content-card').forEach((card, index) => {
        if (card.querySelector('.ftt-home-feature-icon')) return;
        const icon = document.createElement('span');
        icon.className = 'ftt-home-feature-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${iconPaths[index % iconPaths.length]}</svg>`;
        card.prepend(icon);
      });
    }

    const productSection = root.querySelector<HTMLElement>('#the-product-ecosystem');
    const productGrid = productSection?.querySelector<HTMLElement>(':scope > .bs-container > .ftt-content-grid');
    if (productSection && productGrid && !productGrid.dataset.carouselReady) {
      productGrid.dataset.carouselReady = 'true';
      const viewport = document.createElement('div');
      viewport.className = 'ftt-product-carousel-viewport';
      const track = document.createElement('div');
      track.className = 'ftt-product-carousel-track';
      [...productGrid.children].forEach(card => track.appendChild(card));
      viewport.appendChild(track);
      productGrid.appendChild(viewport);
      let index = 0;
      let visible = 3;
      const update = () => {
        visible = window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 2 : 3;
        index = Math.min(index, Math.max(0, track.children.length - visible));
        const cardWidth = (viewport.clientWidth - (visible - 1) * 16) / visible;
        track.style.transform = `translateX(-${index * (cardWidth + 16)}px)`;
      };
      const controls = document.createElement('div');
      controls.className = 'ftt-product-carousel-controls';
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Browse platform and infrastructure cards');
      const previous = document.createElement('button');
      previous.type = 'button'; previous.textContent = '←'; previous.setAttribute('aria-label', 'Previous card');
      const next = document.createElement('button');
      next.type = 'button'; next.textContent = '→'; next.setAttribute('aria-label', 'Next card');
      previous.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
      next.addEventListener('click', () => { index = Math.min(track.children.length - visible, index + 1); update(); });
      controls.append(previous, next);
      productGrid.appendChild(controls);
      window.addEventListener('resize', update, { passive: true });
      update();
    }

    const faq = root.querySelector<HTMLElement>('#frequently-asked-questions .ftt-content-grid');
    faq?.querySelectorAll<HTMLElement>('.ftt-content-card').forEach((card, i) => {
      if (card.tagName.toLowerCase() === 'details') return;
      const question = card.querySelector<HTMLElement>('h3');
      if (!question) return;
      const details = document.createElement('details');
      details.className = 'ftt-home-faq-item';
      details.open = i === 0;
      const summary = document.createElement('summary');
      summary.textContent = question.textContent || '';
      [...card.childNodes].forEach(node => { if (node !== question) details.appendChild(node); });
      details.insertBefore(summary, details.firstChild);
      card.replaceWith(details);
    });
  }, []);

  return null;
}
