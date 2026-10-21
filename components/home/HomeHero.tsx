'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { HomeHeroIntro, HomeHeroSlide } from '@/lib/home-hero';
import { SplitHeading } from '@/components/SplitHeading';

const INTERVAL_MS = 7000;
interface Props { intro: HomeHeroIntro; slides: HomeHeroSlide[] }

/** Each article is a complete sliding panel: photography, copy and CTAs. */
export function HomeHero({ intro, slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [interaction, setInteraction] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{x:number;y:number}|null>(null);
  const count = slides.length;

  function go(index:number) {
    if (!count) return;
    setCurrent((index + count) % count);
    setInteraction(n => n + 1);
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const update = () => setTabVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting), { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (count < 2 || paused || reducedMotion || !visible || !tabVisible) return;
    const timer = window.setInterval(() => setCurrent(i => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, reducedMotion, visible, tabVisible, interaction]);

  function onTouchStart(event: React.TouchEvent) {
    if (event.touches.length === 1) {
      touchStart.current = {x:event.touches[0].clientX,y:event.touches[0].clientY};
    }
  }
  function onTouchEnd(event: React.TouchEvent) {
    const first = touchStart.current;
    touchStart.current = null;
    if (!first || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - first.x;
    const dy = event.changedTouches[0].clientY - first.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)*1.2)
      go(current + (dx < 0 ? 1 : -1));
  }

  return (
    <section ref={heroRef} id="top" className="ftt-wide-hero ftt-full-slide-hero"
      role="region" aria-roledescription="carousel"
      aria-label="Forex brokerage technology and featured solutions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => {if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);}}
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        go(current + (event.key === 'ArrowRight' ? 1 : -1));
      }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="ftt-full-slide-track">
        {slides.map((slide,index) => {
          const active = index === current;
          const half = Math.floor(count/2);
          const offset = count === 1 ? 0 : ((index-current+count+half)%count)-half;
          const primaryHref = index === 0 ? intro.primaryHref : slide.href;
          const primaryLabel = index === 0 ? intro.primaryLabel : 'Explore '+slide.title;
          const secondaryHref = index === 0 ? intro.secondaryHref : '/contact/#contact-form';
          const secondaryLabel = index === 0 ? intro.secondaryLabel : 'Request a Consultation';
          const eyebrow = index === 0 ? intro.eyebrow :
            index === 1 ? 'Client Management & Brokerage CRM' : 'Reliable Trading Infrastructure';
          return (
            <article key={slide.href}
              className={'ftt-full-slide'+(active?' is-active':'')}
              style={{transform:'translate3d('+(offset*100)+'%,0,0)'}}
              role="group" aria-roledescription="slide"
              aria-label={(index+1)+' of '+count+': '+slide.title}
              aria-hidden={!active} inert={!active}>
              <div className="ftt-full-slide-media" aria-hidden="true">
                <img src={slide.image} alt="" width={1600} height={1000}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
                <div className="ftt-full-slide-scrim" />
              </div>
              <div className="ftt-full-slide-content">
                <div className="ftt-full-slide-copy">
                  <p className="ftt-wide-eyebrow"><span aria-hidden="true" />{eyebrow}</p>
                  {index === 0
                    ? <h1 className={`ftt-full-slide-title${intro.title.length > 54 ? ' ftt-full-slide-title--long' : ''}`}><SplitHeading text={intro.title} /></h1>
                    : <h2 className={`ftt-full-slide-title${slide.title.length > 54 ? ' ftt-full-slide-title--long' : ''}`}><SplitHeading text={slide.title} /></h2>}
                  <p className="ftt-wide-lead">{index === 0 ? intro.lead : slide.summary}</p>
                  {(index === 0 ? intro.description : slide.description) && (
                    <p className="ftt-wide-description">
                      {index === 0 ? intro.description : slide.description}
                    </p>
                  )}
                  <div className="ftt-wide-actions">
                    <Link className="ftt-wide-button-primary" href={primaryHref}>
                      {primaryLabel}<ArrowUpRight size={18} aria-hidden="true"/>
                    </Link>
                    <Link className="ftt-wide-button-secondary" href={secondaryHref}>
                      {secondaryLabel}<ArrowUpRight size={17} aria-hidden="true"/>
                    </Link>
                  </div>
                  {index === 0 && <p className="ftt-wide-proof">
                    <Check size={16} aria-hidden="true"/>Trading platforms · CRM · Liquidity · Hosting
                  </p>}
                </div>
                <div className="ftt-full-slide-meta" aria-hidden="true">
                  <span>{String(index+1).padStart(2,'0')} / {String(count).padStart(2,'0')}</span>
                  <span>{slide.title}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="ftt-wide-hero-controls ftt-full-slide-controls">
        <div className="ftt-wide-dots" role="group" aria-label="Select featured solution">
          {slides.map((slide,index) =>
            <button key={slide.href} type="button" aria-label={'Show '+slide.title}
              aria-current={current === index ? 'true' : undefined}
              className={current === index ? 'is-active' : ''}
              onClick={() => go(index)} />
          )}
        </div>
        <div className="ftt-wide-arrows">
          <button type="button" aria-label="Previous slide" onClick={() => go(current-1)}>
            <ArrowLeft size={19} aria-hidden="true"/>
          </button>
          <button type="button" aria-label="Next slide" onClick={() => go(current+1)}>
            <ArrowRight size={19} aria-hidden="true"/>
          </button>
        </div>
      </div>
    </section>
  );
}
