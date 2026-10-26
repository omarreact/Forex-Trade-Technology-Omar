/* WordPress-native front-end interactions. No Next.js or JSX runtime. */
(()=>{'use strict';
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.querySelectorAll('.bs-home-slider').forEach(root=>{
  const slides=[...root.querySelectorAll('.bs-slide')],dots=[...root.querySelectorAll('.bs-slide-dots button')];let i=0,paused=false;
  if(!slides.length)return;
  const show=n=>{i=(n+slides.length)%slides.length;slides.forEach((s,j)=>{const active=i===j;s.classList.toggle('is-active',active);s.setAttribute('aria-hidden',String(!active));s.inert=!active});dots.forEach((d,j)=>{d.classList.toggle('is-active',i===j);if(i===j)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')})};
  dots.forEach((d,j)=>d.addEventListener('click',()=>show(j)));root.addEventListener('mouseenter',()=>paused=true);root.addEventListener('mouseleave',()=>paused=false);root.addEventListener('focusin',()=>paused=true);root.addEventListener('focusout',()=>paused=false);
  root.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(i+(e.key==='ArrowRight'?1:-1))}});show(0);
  if(root.dataset.autoplay==='1')setInterval(()=>{if(!paused&&!reduced()&&!document.hidden)show(i+1)},Math.max(3000,Number(root.dataset.interval)||6000));
 });
 document.querySelectorAll('.bs-trust-carousel').forEach(root=>{
  const track=root.querySelector('.bs-trust-carousel-track'),group=track?.querySelector('.bs-trust-carousel-group');if(!track||!group||reduced())return;
  // Duplicate only on public view; Gutenberg gets exactly one editable preview.
  for(let j=0;j<5;j++){const copy=group.cloneNode(true);copy.setAttribute('aria-hidden','true');track.append(copy)}
 });
 document.querySelectorAll('.bs-audience-carousel-section').forEach(root=>{
  const track=root.querySelector('.bs-audience-track'),original=[...(track?.children||[])],dots=[...root.querySelectorAll('.bs-audience-dot')];const n=original.length;if(!n)return;
  let current=0;
  const show=j=>{current=(j+n)%n;const width=track?.children[0]?.getBoundingClientRect().width||0;const gap=Number.parseFloat(getComputedStyle(track).gap)||0;track.style.transform=`translate3d(-${current*(width+gap)}px,0,0)`;dots.forEach((d,k)=>{d.classList.toggle('is-active',k===current);d.setAttribute('aria-current',String(k===current))})};
  root.querySelector('[aria-label="Previous audience"]')?.addEventListener('click',()=>show(current-1));root.querySelector('[aria-label="Next audience"]')?.addEventListener('click',()=>show(current+1));dots.forEach((d,j)=>d.addEventListener('click',()=>show(j)));window.addEventListener('resize',()=>show(current));show(0);
 });
 document.querySelectorAll('form.ftt-xml-contact').forEach(form=>form.addEventListener('submit',async e=>{
  e.preventDefault();const output=form.querySelector('.bs-form-status'),submit=form.querySelector('[type=submit]');submit.disabled=true;output.textContent='Sending your request…';
  try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),credentials:'same-origin',headers:{'X-WP-Nonce':form.elements.nonce?.value||''}});const j=await response.json();output.textContent=j.message||'Unable to send';if(response.ok)form.reset();}
  catch{output.textContent='The contact service is currently unavailable.'}finally{submit.disabled=false;}
 }));
})();
