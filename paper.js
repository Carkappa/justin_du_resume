/* ══════════════════════════════════════════════════════════════
   paper.js — shared behaviour for every ink-on-paper page.
   Draws the scribbled outlines, runs the reading rail and the
   scroll-in reveals. Pages stay plain HTML; this does the rest.
   ══════════════════════════════════════════════════════════════ */
(function(){
  /* Claim JS before anything paints, so .rise can safely start hidden. */
  document.documentElement.classList.add('js');

  const BOX = 'M4 7 C 20 3, 55 4, 96 6 C 97 16, 96 27, 95 34 C 66 37, 30 36, 5 34 C 3 25, 3 15, 4 7 Z';

  /* Every .hbtn gets its hand-drawn box without repeating it in markup. */
  document.querySelectorAll('.hbtn').forEach(b=>{
    if(b.querySelector('svg.box')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','box');
    svg.setAttribute('viewBox','0 0 100 40');
    svg.setAttribute('preserveAspectRatio','none');
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d', BOX);
    svg.appendChild(p);
    b.prepend(svg);
    b.classList.add('boil');
  });

  /* <div class="chips" data-chips="A,B,C"> → scribbled chips */
  document.querySelectorAll('.chips[data-chips]').forEach(box=>{
    box.innerHTML = box.dataset.chips.split(',').map(t=>{
      const w = 6 + Math.random()*4;
      return `<span class="chip boil"><svg viewBox="0 0 100 32" preserveAspectRatio="none">`
           + `<path d="M3 ${w} C 24 2, 60 3, 97 5 C 98 13, 97 22, 96 28 C 64 31, 30 30, 4 28 C 2 21, 2 12, 3 ${w} Z"/>`
           + `</svg>${t.trim()}</span>`;
    }).join('');
  });

  /* Publish the top bar's real height so sticky things can sit flush under it. */
  const bar = document.getElementById('topbar');
  if(bar){
    const setBar = ()=>document.documentElement.style.setProperty('--topbar-h', bar.offsetHeight + 'px');
    setBar();
    window.addEventListener('resize', setBar, {passive:true});
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(setBar);
  }

  /* Reading rail */
  const rail = document.getElementById('rail');
  if(rail){
    const onScroll = ()=>{
      const h = document.documentElement.scrollHeight - window.innerHeight;
      rail.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* Reveal on scroll */
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rise').forEach((el,i)=>{
    el.style.transitionDelay = Math.min(i*0.05, .35) + 's';
    obs.observe(el);
  });

  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
})();
