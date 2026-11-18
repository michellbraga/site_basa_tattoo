(function(){
  'use strict';
  var root=document.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Configuração editável ===== */
  var CONFIG={
    whatsapp:'',                         // ex.: '5592999999999' (DDI+DDD+número). Vazio = usa o Instagram.
    whatsappMsg:'Olá, Basa! Vi o site e quero agendar uma tatuagem.',
    instagram:'https://www.instagram.com/basa.tattoo/'
  };
  var cta=document.getElementById('ctaMain');
  if(CONFIG.whatsapp&&cta){
    cta.href='https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(CONFIG.whatsappMsg);
    cta.textContent='Agendar pelo WhatsApp';
  }
  // Todos os botões "Agendar" levam à seção de contato (já visível); sem scroll extra necessário.

  var rvEls=[].slice.call(document.querySelectorAll('.rv,.orn'));
  var io=null;

  /* ===== Abertura em vídeo ===== */
  var DOORS_AT=6.0;    // segundo em que o vídeo já mostra as portas opacas: o preto passa a ser transparente
  var v=document.getElementById('introVideo');
  var bd=document.getElementById('introBackdrop');
  var bars=document.getElementById('introBars');
  var skip=document.getElementById('introSkip');
  var introDone=false, revealed=false, doorsOn=false;

  function revealPage(){ if(revealed) return; revealed=true; root.classList.add('page-ready'); runReveals(); }
  function layoutBars(){
    // retângulo real do vídeo (object-fit: contain) para que a página só apareça através das portas
    if(!bars) return;
    var W=innerWidth,H=innerHeight,vw=v.videoWidth||720,vh=v.videoHeight||1280,s=Math.min(W/vw,H/vh),w=vw*s,h=vh*s,x=(W-w)/2,y=(H-h)/2;
    var b=bars.children,px=function(n){return Math.max(0,Math.round(n))+'px';};
    b[0].style.cssText='top:0;left:0;right:0;height:'+px(y);
    b[1].style.cssText='bottom:0;left:0;right:0;height:'+px(H-y-h);
    b[2].style.cssText='top:'+px(y)+';height:'+px(h)+';left:0;width:'+px(x);
    b[3].style.cssText='top:'+px(y)+';height:'+px(h)+';right:0;width:'+px(W-x-w);
  }
  function openBars(){ // as laterais/faixas recuam enquanto as portas terminam de abrir
    if(!bars) return;
    var b=bars.children; b[0].style.height='0px'; b[1].style.height='0px'; b[2].style.width='0px'; b[3].style.width='0px';
  }
  function finishIntro(){
    if(introDone) return; introDone=true;
    try{sessionStorage.setItem('basaIntro','1');}catch(e){}
    revealPage();
    if(v) v.classList.add('out');
    if(bd) bd.classList.add('gone');
    openBars();
    if(skip) skip.style.opacity='0';
    setTimeout(function(){
      root.classList.remove('intro-lock');
      if(v){ try{v.pause();}catch(e){} v.removeAttribute('src'); v.innerHTML=''; v.load(); }
    },900);
  }
  function startDoors(){
    if(doorsOn||!v) return; doorsOn=true;
    layoutBars();
    v.classList.add('doors');           // preto do vídeo vira transparente (blend screen) -> a página real aparece atrás das portas
    bd.classList.add('gone');
    revealPage();
    setTimeout(openBars,1100);          // reabre o campo todo no fim da animação de portas
  }

  if(!root.classList.contains('intro-lock')){
    revealPage();                        // intro pulada (movimento reduzido ou já exibida nesta sessão)
  }else if(v){
    var guard=setTimeout(finishIntro,4500);  // se o vídeo não iniciar em 4,5s, libera o site
    v.addEventListener('playing',function(){clearTimeout(guard);},{once:true});
    v.addEventListener('error',finishIntro);
    v.addEventListener('ended',finishIntro);
    v.addEventListener('timeupdate',function(){
      if(v.currentTime>=DOORS_AT) startDoors();
      if(v.duration&&v.currentTime>=v.duration-0.12) finishIntro();
    });
    window.addEventListener('resize',function(){ if(!introDone&&!doorsOn) layoutBars(); });
    skip.addEventListener('click',finishIntro);
    document.addEventListener('keydown',function(e){ if(!introDone&&(e.key==='Escape'||e.key==='Enter')) finishIntro(); });
    layoutBars();
    var p=v.play();
    if(p&&p.catch) p.catch(finishIntro);     // autoplay bloqueado -> entra direto no site
  }else finishIntro();

  /* ===== Hero: destaques em rotação ===== */
  var hs=[].slice.call(document.querySelectorAll('.hv-slide')), hi=0;
  if(hs.length>1&&!reduce){
    setInterval(function(){
      if(document.hidden) return;
      hs[hi].classList.remove('on'); hi=(hi+1)%hs.length; hs[hi].classList.add('on');
    },4600);
  }

  /* ===== Reveal ao rolar ===== */
  function runReveals(){
    if(!('IntersectionObserver' in window)||reduce){rvEls.forEach(function(e){e.classList.add('in')});return;}
    if(io) return;
    io=new IntersectionObserver(function(es){
      es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rvEls.forEach(function(e){io.observe(e)});
  }

  /* ===== Header, nav mobile ===== */
  var header=document.querySelector('.site-header');
  var nt=document.getElementById('navToggle'), nav=document.getElementById('nav');
  function closeNav(){nav.classList.remove('open');nt.setAttribute('aria-expanded','false');nt.setAttribute('aria-label','Abrir menu');}
  nt.addEventListener('click',function(){
    var o=nav.classList.toggle('open');nt.setAttribute('aria-expanded',o);nt.setAttribute('aria-label',o?'Fechar menu':'Abrir menu');
  });
  nav.addEventListener('click',function(e){ if(e.target.tagName==='A') closeNav(); });
  window.addEventListener('resize',function(){ if(innerWidth>820) closeNav(); });

  /* ===== Marca-d'água Hannya com parallax ===== */
  var wmStates=[ // [x, y, scale, rotate, opacity] por progresso (0..1)
    [0,0,1.00,0,.16],
    [-14,-5,1.10,-2,.09],
    [12,6,1.22,2,.12],
    [-10,-3,1.12,-1.5,.08],
    [0,4,1.30,0,.14]
  ];
  var small=function(){return innerWidth<820;};
  function lerp(a,b,t){return a+(b-a)*t;}
  var ticking=false;
  function frame(){
    ticking=false;
    var y=window.scrollY||0, max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    var pr=Math.min(1,Math.max(0,y/max)), seg=(wmStates.length-1)*pr, i=Math.min(wmStates.length-2,Math.floor(seg)), t=seg-i;
    var a=wmStates[i], b=wmStates[i+1], k=small()?.6:1;
    var st=document.documentElement.style;
    st.setProperty('--wm-x',(lerp(a[0],b[0],t)*k)+'vw');
    st.setProperty('--wm-y',(lerp(a[1],b[1],t)*k)+'vh');
    st.setProperty('--wm-s',lerp(a[2],b[2],t).toFixed(3));
    st.setProperty('--wm-r',lerp(a[3],b[3],t).toFixed(2)+'deg');
    st.setProperty('--wm-o',(lerp(a[4],b[4],t)*(small()?.8:1)).toFixed(3));
    header.classList.toggle('solid',y>40);
  }
  function onScroll(){ if(!ticking){ticking=true;requestAnimationFrame(frame);} }
  if(!reduce) window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  frame();

  /* ===== Portfólio: filtros ===== */
  var items=[].slice.call(document.querySelectorAll('.g-item'));
  var fbtns=[].slice.call(document.querySelectorAll('.filters button'));
  function applyFilter(f){
    var n=0;
    items.forEach(function(it){
      var ok=f==='all'||it.getAttribute('data-s').split(' ').indexOf(f)>-1;
      it.hidden=!ok; if(ok){n++; it.classList.add('in');}
    });
    fbtns.forEach(function(b){var on=b.getAttribute('data-f')===f;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
    document.getElementById('galEmpty').hidden=n>0;
  }
  fbtns.forEach(function(b){b.addEventListener('click',function(){applyFilter(b.getAttribute('data-f'));});});
  [].forEach.call(document.querySelectorAll('[data-go]'),function(a){
    a.addEventListener('click',function(){applyFilter(a.getAttribute('data-go'));});
  });

  /* ===== Lightbox ===== */
  var lb=document.getElementById('lb'), lbImg=document.getElementById('lbImg'), lbCap=document.getElementById('lbCap');
  var cur=0, vis=[], lastFocus=null;
  function visible(){return items.filter(function(i){return !i.hidden;});}
  function show(i){
    cur=(i+vis.length)%vis.length; var it=vis[cur];
    lbImg.src='assets/img/'+it.getAttribute('data-full')+'.webp';
    lbImg.alt=it.getAttribute('data-alt'); lbCap.textContent=it.getAttribute('data-alt')+'  ·  '+(cur+1)+'/'+vis.length;
  }
  function open(it){ vis=visible(); lastFocus=document.activeElement; lb.hidden=false; document.body.style.overflow='hidden'; show(vis.indexOf(it)); lb.querySelector('.lb-x').focus(); }
  function close(){ lb.hidden=true; document.body.style.overflow=''; lbImg.removeAttribute('src'); if(lastFocus) lastFocus.focus(); }
  items.forEach(function(it){ it.querySelector('button').addEventListener('click',function(){open(it);}); });
  lb.querySelector('.lb-x').addEventListener('click',close);
  lb.querySelector('.prev').addEventListener('click',function(){show(cur-1);});
  lb.querySelector('.next').addEventListener('click',function(){show(cur+1);});
  lb.addEventListener('click',function(e){ if(e.target===lb) close(); });
  document.addEventListener('keydown',function(e){
    if(lb.hidden) return;
    if(e.key==='Escape') close(); else if(e.key==='ArrowLeft') show(cur-1); else if(e.key==='ArrowRight') show(cur+1);
  });
  var tx=null;
  lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){ if(tx===null) return; var d=e.changedTouches[0].clientX-tx; if(Math.abs(d)>50) show(cur+(d<0?1:-1)); tx=null; });

  /* ===== Vídeos: toca um por vez ===== */
  var vids=[].slice.call(document.querySelectorAll('.vcard video'));
  vids.forEach(function(el){ el.addEventListener('play',function(){ vids.forEach(function(o){ if(o!==el) o.pause(); }); }); });

  /* ===== Ano ===== */
  var y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();
})();
