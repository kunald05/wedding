const pages=Array.from({length:7},(_,i)=>`assets/page-${i+1}.jpg`);
let pageIndex=0;
const $=s=>document.querySelector(s);

function initWelcome(){
  const welcome=$('#welcome');
  const recipient=$('#recipientName');
  const hint=$('#personalizeHint');
  const params=new URLSearchParams(location.search);
  const raw=params.get('to') || params.get('guest') || '';
  if(raw.trim()){
    const name=raw.trim().slice(0,80);
    recipient.textContent=name;
    hint.textContent='आपल्यासाठी खास निमंत्रण';
  }
  const close=()=>{
    const music=document.getElementById('weddingMusic');
    if(music){ music.volume=0.55; music.play().catch(()=>{}); }
    welcome.classList.add('is-closing');
    sessionStorage.setItem('weddingWelcomeSeen','1');
    setTimeout(()=>{welcome.hidden=true;document.body.classList.remove('welcome-open')},800);
  };
  if(sessionStorage.getItem('weddingWelcomeSeen')==='1') welcome.hidden=true;
  else document.body.classList.add('welcome-open');
  $('#enterInvite').addEventListener('click',close);
  // Let a guest tap anywhere on the invitation cover to begin the opening sequence.
  $('#inviteCover').addEventListener('click',close);
}

function initReveal(){
  const items=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){items.forEach(x=>x.classList.add('visible'));return;}
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});
  items.forEach(x=>io.observe(x));
}

function initCountdown(){
  const target=new Date('2026-11-26T12:14:00+05:30').getTime();
  const els=Object.fromEntries([...document.querySelectorAll('[data-unit]')].map(x=>[x.dataset.unit,x]));
  const tick=()=>{let d=Math.max(0,target-Date.now());const days=Math.floor(d/86400000);d%=86400000;const hours=Math.floor(d/3600000);d%=3600000;const minutes=Math.floor(d/60000);d%=60000;const seconds=Math.floor(d/1000);els.days.textContent=String(days).padStart(2,'0');els.hours.textContent=String(hours).padStart(2,'0');els.minutes.textContent=String(minutes).padStart(2,'0');els.seconds.textContent=String(seconds).padStart(2,'0')};
  tick();setInterval(tick,1000);
}
function renderPage(){const img=$('#invitePage'),light=$('#lightImage');img.src=pages[pageIndex];img.alt=`Wedding invitation page ${pageIndex+1}`;light.src=pages[pageIndex];light.alt=`Enlarged wedding invitation page ${pageIndex+1}`;$('#pageNumber').textContent=String(pageIndex+1).padStart(2,'0');$('#progressBar').style.width=`${((pageIndex+1)/pages.length)*100}%`}
function movePage(dir){pageIndex=(pageIndex+dir+pages.length)%pages.length;renderPage()}
function initViewer(){
  $('#prev').addEventListener('click',()=>movePage(-1));$('#next').addEventListener('click',()=>movePage(1));
  $('#pageOpen').addEventListener('click',()=>{$('#lightbox').hidden=false;document.body.style.overflow='hidden'});
  $('#closeLightbox').addEventListener('click',closeLightbox);$('#lightPrev').addEventListener('click',()=>movePage(-1));$('#lightNext').addEventListener('click',()=>movePage(1));
  $('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')closeLightbox()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();if(!$('#lightbox').hidden&&e.key==='ArrowLeft')movePage(-1);if(!$('#lightbox').hidden&&e.key==='ArrowRight')movePage(1)});
  let startX=0;$('#pageOpen').addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});$('#pageOpen').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)movePage(dx<0?1:-1)},{passive:true});renderPage();
}
function closeLightbox(){$('#lightbox').hidden=true;document.body.style.overflow=''}
async function shareInvite(){const data={title:'Saumya & Kunal · Wedding Invitation',text:'Join us for the wedding celebrations of Saumya & Kunal · 25 & 26 November 2026',url:location.href};try{if(navigator.share){await navigator.share(data)}else{await navigator.clipboard.writeText(location.href);showToast('Invitation link copied')}}catch(e){}}
function showToast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
$('#shareBtn').addEventListener('click',shareInvite);
initMusic();
initWelcome();initReveal();initCountdown();initViewer();
