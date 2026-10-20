// components/HomeClientEffects.tsx
'use client';

import React, { useEffect } from 'react';

export function HomeClientEffects() {
  useEffect(() => {
    // 1. Initialize Hero Carousel
    const sliderRoot = document.querySelector('.ftt-front-hero .ftt-slider') as HTMLElement;
    if (sliderRoot) {
      const slides = Array.from(sliderRoot.querySelectorAll(':scope > .ftt-slide')) as HTMLElement[];
      if (slides.length >= 2) {
        let index = 0;
        let tick: any = null;

        // Create or get controls container
        let controls = sliderRoot.querySelector('.ftt-slider-controls') as HTMLElement;
        if (!controls) {
          controls = document.createElement('div');
          controls.className = 'ftt-slider-controls';

          const dots = document.createElement('div');
          dots.className = 'ftt-slider-dots';

          slides.forEach((s, i) => {
            s.id = `ftt-hero-slide-${i + 1}`;
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', `Show slide ${i + 1}`);
            dot.addEventListener('click', () => {
              show(i);
              restart();
            });
            dots.appendChild(dot);
          });

          const arrows = document.createElement('div');
          arrows.className = 'ftt-slider-arrows';
          [
            { symbol: '←', delta: -1, label: 'Previous slide' },
            { symbol: '→', delta: 1, label: 'Next slide' },
          ].forEach((spec) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = spec.symbol;
            btn.setAttribute('aria-label', spec.label);
            btn.addEventListener('click', () => {
              show(index + spec.delta);
              restart();
            });
            arrows.appendChild(btn);
          });

          controls.appendChild(dots);
          controls.appendChild(arrows);
          sliderRoot.appendChild(controls);
        }

        const show = (n: number) => {
          index = (n + slides.length) % slides.length;
          slides.forEach((s, i) => {
            const active = i === index;
            s.classList.toggle('is-active', active);
            s.setAttribute('aria-hidden', String(!active));
            const dot = sliderRoot.querySelector(`.ftt-slider-dots > button:nth-child(${i + 1})`);
            if (dot) {
              dot.setAttribute('aria-current', active ? 'true' : 'false');
            }
          });
        };

        const stop = () => {
          if (tick) {
            clearInterval(tick);
            tick = null;
          }
        };

        const play = () => {
          if (!tick && !document.hidden) {
            tick = setInterval(() => {
              show(index + 1);
            }, 6000);
          }
        };

        const restart = () => {
          stop();
          play();
        };

        sliderRoot.addEventListener('mouseenter', stop);
        sliderRoot.addEventListener('mouseleave', play);

        sliderRoot.classList.add('ftt-slider-ready');
        show(0);
        play();

        return () => {
          stop();
          sliderRoot.removeEventListener('mouseenter', stop);
          sliderRoot.removeEventListener('mouseleave', play);
        };
      }
    }

    // 2. Handle Contact Form submission
    const forms = document.querySelectorAll('.bs-contact-form');
    forms.forEach((form) => {
      const handleSubmit = (e: Event) => {
        e.preventDefault();
        const statusEl = form.querySelector('.bs-form-status') as HTMLElement;
        if (statusEl) {
          statusEl.textContent = '✓ Thank you! Your consultation request has been received. Our team will review your requirements and reach out within 24 hours.';
          statusEl.className = 'bs-form-status text-emerald-600 font-bold mt-2 block';
        }
      };
      form.addEventListener('submit', handleSubmit);
    });
  }, []);

  return null;
}
