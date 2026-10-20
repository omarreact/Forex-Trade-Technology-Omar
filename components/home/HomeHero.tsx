'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { HomeHeroIntro, HomeHeroSlide } from '@/lib/home-hero';

const PERIOD = 7000;
interface Props { intro: HomeHeroIntro; slides: HomeHeroSlide[] }

export function HomeHero({ intro, slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [interaction, setInteraction] = useState(0);
  const container = useRef<HTMLElement>(null);
  const touchX = useRef<{ x: number; y: number } | null>(null);
  const count = slides.length;
  const go = (index: number) => {
    if (count === 0) return;
    setCurrent((index + count) % count);
    setInteraction((value) => value + 1);
  };

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = () => setReducedMotion(mq.matches);
    listener();
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const listener = () => setTabVisible(!document.hidden);
    listener();
    document.addEventListener('visibilitychange', listener);
    return () => document.removeEventListener('visibilitychange', listener);
  }, []);

  useEffect(() => {
    if (!container.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion || !visible || !tabVisible) return;
    const timer = window.setInterval(() => setCurrent((i) => (i + 1) % count), PERIOD);
    return () => window.clearInterval(timer);
  }, [count, paused, reducedMotion, visible, tabVisible, interaction]);

  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 1) touchX.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };
  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchX.current || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchX.current.x;
    const dy = event.changedTouches[0].clientY - touchX.current.y;
    touchX.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) go(current + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      ref={container}
      className="ftt-wide-hero"
      id="top"
      aria-label="Forex brokerage technology and featured solutions"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        go(current + (event.key === 'ArrowRight' ? 1 : -1));
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="ftt-wide-hero-photos" aria-hidden="true">
        {slides.map((slide, i) => (
          <div className={`ftt-wide-hero-photo${i === current ? ' is-active' : ''}`} key={slide.href}>
            <img
              src={slide.image}
              alt=""
              width={1600}
              height={1000}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        ))}
        <div className="ftt-wide-hero-wash" />
      </div>
      <div className="ftt-wide-hero-content">
        <div className="ftt-wide-hero-copy">
          <p className="ftt-wide-eyebrow"><span aria-hidden="true" />{intro.eyebrow}</p>
          <h1>{intro.title}</h1>
          <p className="ftt-wide-lead">{intro.lead}</p>
          <p className="ftt-wide-description">{intro.description}</p>
          <div className="ftt-wide-actions">
            <Link className="ftt-wide-button-primary" href={intro.primaryHref}>{intro.primaryLabel}<ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link className="ftt-wide-button-secondary" href={intro.secondaryHref}>{intro.secondaryLabel}<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <p className="ftt-wide-proof"><Check size={16} aria-hidden="true" /> Trading platforms · CRM · Liquidity · Hosting</p>
        </div>

        <div className="ftt-wide-hero-lower">
          <div className="ftt-wide-current-service" aria-live="off">
            <span className="ftt-wide-index">{String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} — FEATURED SOLUTION</span>
            {slides[current] && (
              <div key={slides[current].href} className="ftt-wide-service-detail">
                <h2>{slides[current].title}</h2>
                <p>{slides[current].summary}</p>
                <Link href={slides[current].href}>Discover solution <ArrowUpRight size={15} aria-hidden="true" /></Link>
              </div>
            )}
          </div>
          <div className="ftt-wide-hero-controls">
            <div className="ftt-wide-dots" role="group" aria-label="Select featured solution">
              {slides.map((slide, i) => (
                <button
                  key={slide.href}
                  aria-label={`Show ${slide.title}`}
                  aria-current={current === i ? 'true' : undefined}
                  className={current === i ? 'is-active' : ''}
                  type="button"
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <div className="ftt-wide-arrows">
              <button type="button" aria-label="Previous photo" onClick={() => go(current - 1)}><ArrowLeft size={19} /></button>
              <button type="button" aria-label="Next photo" onClick={() => go(current + 1)}><ArrowRight size={19} /></button>
            </div>
          </div>
        </div>
      </div>
      <a className="ftt-wide-scroll-hint" href="#solutions" aria-label="Scroll to solutions"><ChevronDown size={19} aria-hidden="true" /></a>
      <span className="ftt-wide-source">Editorial imagery: <a href="https://www.pexels.com/" target="_blank" rel="noreferrer noopener">Pexels</a></span>
    </section>
  );
}
