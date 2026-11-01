document.addEventListener('DOMContentLoaded',function(){
 const nav=document.querySelector('.ftt-wp-nav');const toggle=document.querySelector('.ftt-wp-nav-toggle-wrap');
 if(toggle&&nav){toggle.setAttribute('role','button');toggle.setAttribute('tabindex','0');toggle.setAttribute('aria-label','Toggle navigation');toggle.setAttribute('aria-expanded','false');const open=()=>{nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(nav.classList.contains('is-open')))};toggle.addEventListener('click',open);toggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})}
 document.querySelectorAll('.bs-home-slider').forEach(slider=>{let i=0;const slides=[...slider.querySelectorAll('.bs-slide')],dots=[...slider.querySelectorAll('.bs-slide-dots span')];if(!slides.length)return;const set=n=>{i=(n+slides.length)%slides.length;slides.forEach((s,j)=>{s.classList.toggle('is-active',i===j);s.setAttribute('aria-hidden',String(i!==j))});dots.forEach((d,j)=>d.classList.toggle('is-active',i===j))};set(0);if(slides.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){let t=setInterval(()=>set(i+1),6000);slider.addEventListener('mouseenter',()=>clearInterval(t));slider.addEventListener('mouseleave',()=>{clearInterval(t);t=setInterval(()=>set(i+1),6000)})}});
 document.querySelectorAll('.ftt-menu-submenu').forEach(item=>{item.querySelector(':scope>a')?.addEventListener('click',e=>{if(window.innerWidth<950){e.preventDefault();item.classList.toggle('is-open')}})});
 document.querySelectorAll('form[data-ftt-contact]').forEach(form=>form.addEventListener('submit',async event=>{
   event.preventDefault();let status=form.querySelector('[role=status]');if(!status){status=document.createElement('p');status.setAttribute('role','status');status.className='bs-form-status';form.appendChild(status)}
   const button=form.querySelector('button[type=submit]');if(button)button.disabled=true;status.textContent='Sending…';
   try{const response=await fetch(window.fttTheme?.contactUrl||'/wp-json/ftt/v1/contact',{method:'POST',body:new FormData(form),credentials:'same-origin',headers:{'X-FTT-Nonce':window.fttTheme?.contactNonce||''}});
       const result=await response.json();status.textContent=result.message||'No message was sent.';if(response.ok)form.reset();
   }catch(error){status.textContent='Delivery unavailable. No message was sent.'}
   finally{if(button)button.disabled=false}
 }));
});
