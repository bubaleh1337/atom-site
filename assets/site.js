const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const modal=$('#leadModal'), form=$('#leadForm'), statusEl=$('#formStatus');let startedAt=Date.now();
function openModal(service=''){if(!modal)return;modal.classList.add('open');document.body.classList.add('modal-open');startedAt=Date.now();const sel=$('#service');if(sel&&service)sel.value=service;setTimeout(()=>$('#name')?.focus(),80)}
function closeModal(){modal?.classList.remove('open');document.body.classList.remove('modal-open')}
$$('[data-open-form]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.service||'')));
$('[data-close-modal]')?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const hamb=$('.hamb'), mm=$('.mobile-menu');hamb?.addEventListener('click',()=>{const o=mm.classList.toggle('open');hamb.setAttribute('aria-expanded',String(o))});$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')));
function utm(){const p=new URLSearchParams(location.search),o={};['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k=>{if(p.get(k))o[k]=p.get(k)});return o}
form?.addEventListener('submit',async e=>{e.preventDefault();statusEl.textContent='';statusEl.className='status';const btn=form.querySelector('button[type=submit]');btn.disabled=true;const fd=new FormData(form);const payload=Object.fromEntries(fd.entries());payload.locale=document.documentElement.lang;payload.pageUrl=location.href;payload.referrer=document.referrer;payload.startedAt=startedAt;Object.assign(payload,utm());
try{const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Request failed');form.reset();statusEl.textContent=form.dataset.success;statusEl.className='status ok';setTimeout(closeModal,1800)}catch(err){statusEl.textContent=form.dataset.error;statusEl.className='status err'}finally{btn.disabled=false}});

// portfolio-lightbox-v1.0.9
(()=>{
  const cards=$$('.work-open');
  if(!cards.length)return;

  const lang=(document.documentElement.lang||'ru').toLowerCase();
  const labels=lang.startsWith('kk')
    ? {close:'Жабу',prev:'Алдыңғы жұмыс',next:'Келесі жұмыс'}
    : lang.startsWith('en')
      ? {close:'Close',prev:'Previous project',next:'Next project'}
      : {close:'Закрыть',prev:'Предыдущая работа',next:'Следующая работа'};

  const dialog=document.createElement('dialog');
  dialog.className='portfolio-lightbox';
  dialog.setAttribute('aria-label','Portfolio');
  dialog.innerHTML=`<div class="portfolio-lightbox-shell">
    <button class="portfolio-lightbox-close" type="button" aria-label="${labels.close}">×</button>
    <button class="portfolio-lightbox-nav portfolio-lightbox-prev" type="button" aria-label="${labels.prev}">‹</button>
    <div class="portfolio-lightbox-image-wrap"><img class="portfolio-lightbox-image" alt=""></div>
    <button class="portfolio-lightbox-nav portfolio-lightbox-next" type="button" aria-label="${labels.next}">›</button>
    <div class="portfolio-lightbox-caption"><span class="portfolio-lightbox-title"></span><span class="portfolio-lightbox-count"></span></div>
  </div>`;
  document.body.appendChild(dialog);

  const image=$('.portfolio-lightbox-image',dialog);
  const title=$('.portfolio-lightbox-title',dialog);
  const count=$('.portfolio-lightbox-count',dialog);
  const closeBtn=$('.portfolio-lightbox-close',dialog);
  const prevBtn=$('.portfolio-lightbox-prev',dialog);
  const nextBtn=$('.portfolio-lightbox-next',dialog);
  let current=0;

  function render(index){
    current=(index+cards.length)%cards.length;
    const card=cards[current];
    const source=$('img',card);
    const caption=$('span',card)?.textContent?.trim()||source.alt||'';
    image.src=source.currentSrc||source.src;
    image.alt=source.alt||caption;
    title.textContent=caption;
    count.textContent=`${current+1} / ${cards.length}`;
  }

  function openAt(index){
    render(index);
    if(typeof dialog.showModal==='function')dialog.showModal();
    else dialog.setAttribute('open','');
    document.body.classList.add('portfolio-open');
    closeBtn.focus();
  }

  function closeLightbox(){
    if(typeof dialog.close==='function'&&dialog.open)dialog.close();
    else dialog.removeAttribute('open');
    document.body.classList.remove('portfolio-open');
    cards[current]?.focus();
  }

  cards.forEach((card,index)=>card.addEventListener('click',()=>openAt(index)));
  closeBtn.addEventListener('click',closeLightbox);
  prevBtn.addEventListener('click',()=>render(current-1));
  nextBtn.addEventListener('click',()=>render(current+1));

  dialog.addEventListener('click',e=>{
    if(e.target===dialog)closeLightbox();
  });

  dialog.addEventListener('close',()=>{
    document.body.classList.remove('portfolio-open');
  });

  document.addEventListener('keydown',e=>{
    if(!dialog.open)return;
    if(e.key==='ArrowLeft'){e.preventDefault();render(current-1)}
    if(e.key==='ArrowRight'){e.preventDefault();render(current+1)}
  });
})();