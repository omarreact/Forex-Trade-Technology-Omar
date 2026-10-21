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
    iconSection?.classList.add('ftt-home-icon-cards');

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
