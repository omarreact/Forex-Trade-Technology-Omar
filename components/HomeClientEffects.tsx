'use client';

import { useEffect } from 'react';

const SLIDE_DELAY = 6500;
const SWIPE_THRESHOLD = 48;

/**
 * Enhance the source-verified, server-rendered Gutenberg slides without
 * rewriting their markup or relying on global scripts.
 *
 * The public marketing hero and the WordPress FSE export share slide classes.
 * Only this Next.js page uses this controller; the WP theme retains its own.
 */
function initializeHeroCarousel(root: HTMLElement): () => void {
  const slides = Array.from(root.children).filter(
    (node): node is HTMLElement =>
      node instanceof HTMLElement && node.classList.contains('ftt-slide')
  );
  if (slides.length < 2) return () => {};

  let activeIndex = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  let pointerStart: { x: number; y: number } | undefined;
  let visibleInViewport = true;
  let hovering = false;
  let focused = false;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controls = document.createElement('div');
  controls.className = 'ftt-slider-controls';
  const dots = document.createElement('div');
  dots.className = 'ftt-slider-dots';
  dots.setAttribute('role', 'group');
  dots.setAttribute('aria-label', 'Choose featured solution');
  const arrows = document.createElement('div');
  arrows.className = 'ftt-slider-arrows';

  root.setAttribute('role', 'region');
  root.setAttribute('aria-roledescription', 'carousel');
  root.setAttribute('aria-label', 'Featured brokerage solutions');

  const dotButtons: HTMLButtonElement[] = [];

  function render(index: number) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
      const image = slide.querySelector('img');
      if (image) {
        image.loading = slideIndex === 0 ? 'eager' : 'lazy';
        image.decoding = 'async';
      }
      const dot = dotButtons[slideIndex];
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      dot.setAttribute('aria-pressed', String(isActive));
    });
  }

  function stop() {
    if (timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  }

  function canAutoplay() {
    return (
      !reducedMotion.matches &&
      !document.hidden &&
      visibleInViewport &&
      !hovering &&
      !focused
    );
  }

  function play() {
    stop();
    if (canAutoplay()) timer = setInterval(() => render(activeIndex + 1), SLIDE_DELAY);
  }

  function navigate(index: number) {
    render(index);
    play();
  }

  slides.forEach((slide, i) => {
    slide.id = `ftt-hero-slide-${i + 1}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show slide ${i + 1}: ${slide.querySelector('.ftt-slide-title')?.textContent?.trim() || 'Featured solution'}`);
    dot.setAttribute('aria-controls', slide.id);
    dot.addEventListener('click', () => navigate(i));
    dotButtons.push(dot);
    dots.appendChild(dot);
  });

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.textContent = '←';
  previous.setAttribute('aria-label', 'Previous slide');
  previous.addEventListener('click', () => navigate(activeIndex - 1));

  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = '→';
  next.setAttribute('aria-label', 'Next slide');
  next.addEventListener('click', () => navigate(activeIndex + 1));

  arrows.append(previous, next);
  controls.append(dots, arrows);
  root.appendChild(controls);

  function mouseEnter() { hovering = true; stop(); }
  function mouseLeave() { hovering = false; play(); }
  function focusIn() { focused = true; stop(); }
  function focusOut(event: FocusEvent) {
    if (!root.contains(event.relatedTarget as Node | null)) {
      focused = false;
      play();
    }
  }
  function visibilityChange() { play(); }
  function motionChange() { play(); }
  function keyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (!(event.target instanceof Element) || !root.contains(event.target)) return;
    event.preventDefault();
    navigate(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
  function touchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    pointerStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    stop();
  }
  function touchEnd(event: TouchEvent) {
    if (!pointerStart || !event.changedTouches.length) return;
    const deltaX = event.changedTouches[0].clientX - pointerStart.x;
    const deltaY = event.changedTouches[0].clientY - pointerStart.y;
    pointerStart = undefined;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      navigate(activeIndex + (deltaX < 0 ? 1 : -1));
    } else {
      play();
    }
  }

  root.addEventListener('mouseenter', mouseEnter);
  root.addEventListener('mouseleave', mouseLeave);
  root.addEventListener('focusin', focusIn);
  root.addEventListener('focusout', focusOut);
  root.addEventListener('keydown', keyDown);
  root.addEventListener('touchstart', touchStart, { passive: true });
  root.addEventListener('touchend', touchEnd, { passive: true });
  document.addEventListener('visibilitychange', visibilityChange);
  reducedMotion.addEventListener('change', motionChange);

  const observer = typeof IntersectionObserver === 'undefined'
    ? undefined
    : new IntersectionObserver(([entry]) => {
        visibleInViewport = entry.isIntersecting;
        play();
      }, { threshold: 0.15 });
  observer?.observe(root);

  root.classList.add('ftt-slider-ready');
  render(0);
  play();

  return () => {
    stop();
    observer?.disconnect();
    root.removeEventListener('mouseenter', mouseEnter);
    root.removeEventListener('mouseleave', mouseLeave);
    root.removeEventListener('focusin', focusIn);
    root.removeEventListener('focusout', focusOut);
    root.removeEventListener('keydown', keyDown);
    root.removeEventListener('touchstart', touchStart);
    root.removeEventListener('touchend', touchEnd);
    document.removeEventListener('visibilitychange', visibilityChange);
    reducedMotion.removeEventListener('change', motionChange);
    controls.remove();
    root.classList.remove('ftt-slider-ready');
    root.removeAttribute('role');
    root.removeAttribute('aria-roledescription');
    root.removeAttribute('aria-label');
    slides.forEach((slide) => {
      slide.inert = false;
      slide.removeAttribute('aria-hidden');
      slide.removeAttribute('role');
      slide.removeAttribute('aria-roledescription');
      slide.removeAttribute('aria-label');
      slide.classList.remove('is-active');
    });
  };
}

export function HomeClientEffects() {
  useEffect(() => {
    const slider = document.querySelector<HTMLElement>('.ftt-home .ftt-front-hero .ftt-slider');
    if (!slider) return;
    return initializeHeroCarousel(slider);
  }, []);

  return null;
}
