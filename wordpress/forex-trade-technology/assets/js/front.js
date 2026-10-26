/* Frontend interactions; no secrets. Mirrors Next.js behaviors without bundling React. */
(()=>{'use strict';
 const reduce=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const header=document.querySelector('.bs-site-header'),nav=header?.querySelector('.bs-inline-nav');
 const mobile=header?.querySelector('.bs-mobile-menu-toggle'),trigger=header?.querySelector('.bs-menu-trigger');
 const sub=header?.querySelector('.bs-submenu');
 function closeMenu(){nav?.classList.remove('is-open');mobile?.setAttribute('aria-expanded','false');if(mobile)mobile.setAttribute('aria-label','Open navigation');sub?.classList.remove('is-open');sub?.setAttribute('aria-hidden','true');trigger?.setAttribute('aria-expanded','false');sub?.querySelectorAll('a').forEach(a=>a.tabIndex=-1);}
 mobile?.addEventListener('click',()=>{const open=!nav.classList.contains('is-open');closeMenu();nav.classList.toggle('is-open',open);mobile.setAttribute('aria-expanded',String(open));mobile.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
 trigger?.addEventListener('click',()=>{const open=!sub.classList.contains('is-open');sub.classList.toggle('is-open',open);sub.setAttribute('aria-hidden',String(!open));trigger.setAttribute('aria-expanded',String(open));sub.querySelectorAll('a').forEach(a=>a.tabIndex=open?0:-1);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
 document.addEventListener('pointerdown',e=>{if(header&&!header.contains(e.target))closeMenu();});
 document.querySelectorAll('.bs-home-slider').forEach(slider=>{
  const slides=[...slider.querySelectorAll('.bs-slide')],dots=[...slider.querySelectorAll('.bs-slide-dots button')];
  let index=0,paused=false;
  const show=i=>{index=(i+slides.length)%slides.length;slides.forEach((s,j)=>{const active=j===index;s.classList.toggle('is-active',active);s.setAttribute('aria-hidden',String(!active));s.inert=!active;});dots.forEach((d,j)=>{d.classList.toggle('is-active',j===index);if(j===index)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current');});};
  dots.forEach((d,i)=>d.addEventListener('click',()=>show(i)));
  slider.addEventListener('mouseenter',()=>paused=true);slider.addEventListener('mouseleave',()=>paused=false);
  slider.addEventListener('focusin',()=>paused=true);slider.addEventListener('focusout',e=>{if(!slider.contains(e.relatedTarget))paused=false;});
  slider.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowLeft'?-1:1));}});
  show(0);
  const interval=Math.max(3000,Number(slider.dataset.interval)||6000);
  if(slider.dataset.autoplay!=='false')setInterval(()=>{if(!paused&&!reduce()&&slides.length>1)show(index+1);},interval);
 });
 document.querySelectorAll('.bs-audience-carousel-section').forEach(section=>{
  const slides=[...section.querySelectorAll('.bs-audience-slide')],track=section.querySelector('.bs-audience-track');
  const dots=[...section.querySelectorAll('.bs-audience-dot')];
  const count=slides.length/3;if(!track||!count)return;let position=count;
  function advance(to,animate=true){position=(to+count*3)%(count*3);const width=slides[1]?.offsetLeft-slides[0]?.offsetLeft||slides[0]?.offsetWidth||0;track.style.transition=animate&&!reduce()?'transform 520ms cubic-bezier(.2,.72,.2,1)':'none';track.style.transform='translate3d(-'+(position*width)+'px,0,0)';dots.forEach((dot,i)=>{const yes=i===(position%count);dot.classList.toggle('is-active',yes);dot.setAttribute('aria-current',String(yes));});}
  section.querySelector('[aria-label="Previous audience"]')?.addEventListener('click',()=>advance(position-1));
  section.querySelector('[aria-label="Next audience"]')?.addEventListener('click',()=>advance(position+1));
  dots.forEach((d,i)=>d.addEventListener('click',()=>advance(count+i)));
  track.addEventListener('transitionend',()=>{if(position<count||position>=2*count)advance(count+(position%count),false);});
  window.addEventListener('resize',()=>advance(position,false));advance(count,false);
  let inside=false;section.addEventListener('pointerenter',()=>inside=true);section.addEventListener('pointerleave',()=>inside=false);
  setInterval(()=>{if(!inside&&!reduce())advance(position+1);},5600);
 });
 document.querySelectorAll('form[data-ftt-contact]').forEach(form=>form.addEventListener('submit',async e=>{
  e.preventDefault();const button=form.querySelector('button[type=submit]'),status=form.querySelector('[role=status]');
  if(!button||!status)return;button.disabled=true;status.hidden=false;status.className='bs-form-status';status.textContent='Sending…';
  try{
   const response=await fetch(window.fttTheme?.contactUrl||'/wp-json/ftt/v1/contact',{method:'POST',body:new FormData(form),credentials:'same-origin'});
   const data=await response.json();status.textContent=data.message||'Your request could not be delivered.';
   status.classList.add(response.ok?'success':'error');
   if(response.ok)form.reset();
  }catch(e){status.classList.add('error');status.textContent='The mail service is currently unreachable. No message was sent.';}
  finally{button.disabled=false;}
 }));
 const scroll=document.createElement('button');scroll.className='bs-scroll-top';scroll.type='button';scroll.setAttribute('aria-label','Scroll to top');scroll.textContent='↑';document.body.appendChild(scroll);
 const updateScroll=()=>scroll.classList.toggle('visible',window.scrollY>340);
 scroll.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduce()?'instant':'smooth'}));window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
})();
