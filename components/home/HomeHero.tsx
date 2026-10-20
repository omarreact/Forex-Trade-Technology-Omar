'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { HomeHeroIntro, HomeHeroSlide } from '@/lib/home-hero';

const INTERVAL_MS = 7500;

interface HomeHeroProps {
  intro: HomeHeroIntro;
  slides: HomeHeroSlide[];
}

/** Dedicated, accessible carousel. No old Gutenberg slider scripts or overlays. */
export function HomeHero({ intro, slides }: HomeHeroProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [interaction, setInteraction] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const count = slides.length;
  const show = (next: number) => {
    setActive((next + count) % count);
    setInteraction((current) => current + 1);
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!stageRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion || !visible || !tabVisible) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, reducedMotion, visible, tabVisible, interaction]);

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 1) {
      touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
  };
  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const first = touchStart.current;
    touchStart.current = null;
    if (!first || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - first.x;
    const dy = event.changedTouches[0].clientY - first.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      show(active + (dx < 0 ? 1 : -1));
    }
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  };
  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
  };

  return (
    <section className="ftt-fresh-hero" id="top" aria-labelledby="ftt-fresh-title">
      <div className="ftt-fresh-hero-inner">
        <div className="ftt-fresh-copy">
          <p className="ftt-fresh-eyebrow">
            <span className="ftt-fresh-eyebrow-mark" aria-hidden="true" />
            {intro.eyebrow}
          </p>
          <h1 id="ftt-fresh-title">{intro.title}</h1>
          <p className="ftt-fresh-lead">{intro.lead}</p>
          <p className="ftt-fresh-description">{intro.description}</p>

          <div className="ftt-fresh-actions">
            <Link className="ftt-fresh-primary" href={intro.primaryHref}>
              {intro.primaryLabel}
              <ArrowUpRight size={19} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link className="ftt-fresh-secondary" href={intro.secondaryHref}>
              {intro.secondaryLabel}
              <ArrowDownRight size={19} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
          <p className="ftt-fresh-footnote">
            <Check size={16} strokeWidth={2.4} aria-hidden="true" />
            Connected trading platforms, CRM, liquidity and infrastructure
          </p>
        </div>

        <div
          className="ftt-fresh-carousel"
          ref={stageRef}
          role="region"
          aria-label="Featured brokerage solutions"
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={onBlur}
          onKeyDown={onKeyDown}
        >
          <div className="ftt-fresh-image-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {slides.map((slide, index) => (
              <div
                className={'ftt-fresh-image-slide' + (active === index ? ' is-active' : '')}
                key={slide.href}
                aria-hidden={active !== index}
                inert={active !== index}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt || slide.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 900px) 100vw, 48vw"
                  className="ftt-fresh-image"
                />
              </div>
            ))}
            <span className="ftt-fresh-image-label">FEATURED SOLUTIONS</span>
            <span className="ftt-fresh-image-number">
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
          </div>

          <div className="ftt-fresh-slide-info">
            {slides.map((slide, index) => (
              <div
                key={slide.href}
                className={'ftt-fresh-slide-copy' + (active === index ? ' is-active' : '')}
                aria-hidden={active !== index}
                inert={active !== index}
              >
                <span className="ftt-fresh-card-eyebrow">BROKERAGE TECHNOLOGY / {String(index + 1).padStart(2, '0')}</span>
                <h2>{slide.title}</h2>
                <p>{slide.summary}</p>
                <Link className="ftt-fresh-card-link" href={slide.href}>
                  Explore solution <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>

          <div className="ftt-fresh-controls">
            <div className="ftt-fresh-dots" role="group" aria-label="Choose slide">
              {slides.map((slide, index) => (
                <button
                  key={slide.href}
                  type="button"
                  className={'ftt-fresh-dot' + (active === index ? ' is-active' : '')}
                  aria-label={'Show ' + slide.title}
                  aria-current={active === index ? 'true' : undefined}
                  onClick={() => show(index)}
                />
              ))}
            </div>
            <div className="ftt-fresh-arrows">
              <button type="button" aria-label="Previous slide" onClick={() => show(active - 1)}>
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button type="button" aria-label="Next slide" onClick={() => show(active + 1)}>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
