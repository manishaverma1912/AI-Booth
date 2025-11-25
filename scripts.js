
  // add current year
  (function()
  {
     var y = new Date().getFullYear(); 
     var el = document.getElementById('y');
      if(el) el.textContent = y; 
    }
    )();
// <!-- contact -->
// 
  (function(){
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      // very basic validation
      var valid = form.checkValidity();
      if (!valid) {
        form.reportValidity();
        return;
      }
      // simulate submit success
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'SENDING...';

      setTimeout(function(){
        btn.disabled = false;
        btn.textContent = 'TRY DEMO';
        alert('Thanks — we received your message. We will respond shortly.');
        form.reset();
      }, 900);
    });
  })();
// 








// <!-- hero section -->
// 
(function () {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(setupCarousel);

  function setupCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const dots = Array.from(carousel.querySelectorAll('.dot'));
    let index = 0;
    let autoplayTimer = null;
    const slideCount = slides.length;

    // left-side content elements
    const leftWrapper = document.getElementById('left-wrapper');
    const heroEyebrow = document.getElementById('hero-eyebrow');
    const heroTitle = document.getElementById('hero-title');
    const heroLead = document.getElementById('hero-lead');
    const heroCta = document.getElementById('hero-cta');
    const heroSecondary = document.getElementById('hero-secondary');

    // durations (match CSS variables)
    const IMG_MS = 520;
    const TEXT_MS = 520;

    let currentIndex = 0;

    /* utility: reset image classes and set pre-enter state on the target image */
    function resetImagesAndPrepare(targetIdx) {
      slides.forEach((s, idx) => {
        const img = s.querySelector('img');
        if (!img) return;
        img.classList.remove('img-pre', 'img-active', 'img-exit');
        // set state for currently visible: if idx === targetIdx, prepare 'img-pre' (we will activate soon)
        if (idx === targetIdx) {
          img.classList.add('img-pre');
          // force reflow to ensure transitions restart
          void img.offsetWidth;
        }
      });
    }

    /* enter/exit for left text with staggered children (CSS handles delays) */
    function leftExit() {
      leftWrapper.classList.remove('enter', 'active');
      // force reflow
      void leftWrapper.offsetWidth;
      leftWrapper.classList.add('exit');
    }
    function leftEnter() {
      leftWrapper.classList.remove('exit');
      // put into enter state (children have transition delays)
      leftWrapper.classList.add('enter');
      // next frame add 'active' so children animate in with stagger
      requestAnimationFrame(() => requestAnimationFrame(() => leftWrapper.classList.add('active')));
    }

    /* image exit/enter helpers:
       - current image -> img-exit
       - new image -> img-pre then add img-active to animate in
    */
    function imageExit(idx) {
      const s = slides[idx];
      if (!s) return;
      const img = s.querySelector('img');
      if (!img) return;
      img.classList.remove('img-pre', 'img-active');
      // force reflow then add exit class
      void img.offsetWidth;
      img.classList.add('img-exit');
    }
    function imageEnter(idx) {
      const s = slides[idx];
      if (!s) return;
      const img = s.querySelector('img');
      if (!img) return;
      img.classList.remove('img-exit');
      img.classList.add('img-pre');
      // next frame -> active (slides in + scales to 1)
      requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('img-active')));
    }

    /* update left content text from slide's data- attributes */
    function setLeftContentFromSlide(s) {
      if (!s) return;
      heroEyebrow.textContent = s.dataset.eyebrow || 'Bring Magic To Moments';
      const title = s.dataset.title || '';
      const highlight = s.dataset.highlight || '';
      if (title) {
        if (highlight && title.includes(highlight)) {
          heroTitle.innerHTML = title.split(highlight).join(`<span id="hero-highlight" style="color:var(--brand-dark)">${highlight}</span>`);
        } else if (highlight) {
          heroTitle.innerHTML = `${title} <span id="hero-highlight" style="color:var(--brand-dark)">${highlight}</span>`;
        } else {
          heroTitle.textContent = title;
        }
      } else {
        heroTitle.textContent = '';
      }
      heroLead.textContent = s.dataset.lead || '';
      if (heroCta) { heroCta.textContent = s.dataset.ctaText || 'BOOK YOUR BOOTH'; heroCta.href = s.dataset.ctaHref || '#contact'; }
      if (heroSecondary && s.dataset.secondaryHref) heroSecondary.href = s.dataset.secondaryHref;
    }

    /* perform full transition to slide i:
       - exit left + current image
       - after a tiny delay move track, update left text, and animate new image + left enter with stagger
    */
    function goTo(i) {
      const newIndex = ((i % slideCount) + slideCount) % slideCount;
      if (newIndex === currentIndex) return;

      // update dots UI immediately
      dots.forEach(d => d.classList.remove('active'));
      const activeDot = dots[newIndex];
      if (activeDot) activeDot.classList.add('active');
      dots.forEach((d, idx) => d.setAttribute('aria-selected', idx === newIndex ? 'true' : 'false'));

      // exit animations
      leftExit();
      imageExit(currentIndex);

      // small delay so exit anim plays, then swap track & prepare enter anims
      const SWITCH_DELAY = 80;
      setTimeout(() => {
        // move track to next slide
        const offset = newIndex * carousel.clientWidth;
        track.style.transform = `translateX(-${offset}px)`;

        // update left text content while offscreen (so it enters freshly)
        setLeftContentFromSlide(slides[newIndex]);

        // prepare and animate new image
        resetImagesAndPrepare(newIndex);
        // slight micro-delay then animate image in
        setTimeout(() => imageEnter(newIndex), 28);

        // bring left content in with stagger
        setTimeout(() => leftEnter(), 40);

        currentIndex = newIndex;
      }, SWITCH_DELAY);

      // reset autoplay
      resetAutoplay();
    }

    // dot handlers
    dots.forEach(d => d.addEventListener('click', (e) => {
      const i = parseInt(e.currentTarget.dataset.index, 10);
      goTo(i);
    }));

    // keyboard support
    carousel.tabIndex = 0;
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    });

    // resize: keep transform consistent
    window.addEventListener('resize', () => {
      const offset = currentIndex * carousel.clientWidth;
      track.style.transform = `translateX(-${offset}px)`;
    });

    // autoplay
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => { goTo(currentIndex + 1); }, 1000);
    }
    function stopAutoplay() { if (autoplayTimer) clearInterval(autoplayTimer); autoplayTimer = null; }
    function resetAutoplay() { stopAutoplay(); startAutoplay(); }

    // pointer hover pause
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // touch swipe support
    let startX = 0, dx = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAutoplay(); }, {passive:true});
    track.addEventListener('touchmove', e => { dx = e.touches[0].clientX - startX; }, {passive:true});
    track.addEventListener('touchend', () => {
      if (Math.abs(dx) > 50) { goTo(currentIndex + (dx < 0 ? 1 : -1)); }
      dx = 0; startAutoplay();
    });

    // optional pointer drag for desktop (keeps UX consistent)
    let isDragging = false, dragStart = 0, dragX = 0;
    carousel.addEventListener('pointerdown', (e) => { isDragging = true; dragStart = e.clientX; carousel.setPointerCapture(e.pointerId); stopAutoplay(); });
    carousel.addEventListener('pointermove', (e) => { if (!isDragging) return; dragX = e.clientX - dragStart; });
    carousel.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(dragX) > 60) { goTo(currentIndex + (dragX < 0 ? 1 : -1)); }
      dragX = 0; startAutoplay();
    });

    // INITIALIZE:
    // - position track
    // - set content from first slide
    // - prepare image pre-state, then animate image + left content with stagger
    function init() {
      track.style.transform = `translateX(0px)`;
      setLeftContentFromSlide(slides[0]);
      resetImagesAndPrepare(0);
      // animate image in after tiny delay for pleasant entrance
      setTimeout(() => imageEnter(0), 60);
      // animate left content with stagger
      setTimeout(() => leftEnter(), 120);
      currentIndex = 0;
      startAutoplay();
    }

    init();
  }
})();
// 


// <!-- portfolio scroll -->
/* ---------- JS: looping carousel + modal ---------- */
(function(){
  const track = document.getElementById('portfolioTrack');
  const slides = Array.from(track.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('portfolioDots');
  const modal = document.getElementById('portfolioModal');
  const modalClose = document.getElementById('modalClose');
  const modalMedia = document.getElementById('modalMediaContainer');
  const modalTitle = document.getElementById('modalTitle');

  // settings
  let index = 0;
  const slideCount = slides.length;
  const interval = 3000;
  let autoplayTimer = null;
  let isDragging = false;
  let startX = 0;
  let lastTranslate = 0;

  // Create dots
  for (let i=0;i<slideCount;i++){
    const d = document.createElement('button');
    d.className = 'dot' + (i===0? ' active' : '');
    d.dataset.index = i;
    d.setAttribute('aria-label', 'Go to slide ' + (i+1));
    d.setAttribute('role', 'tab');
    d.addEventListener('click', ()=> goTo(parseInt(d.dataset.index,10), true));
    dotsWrap.appendChild(d);
  }

  const dots = Array.from(dotsWrap.children);

  function updateDots(){ dots.forEach((d,i)=> d.classList.toggle('active', i===index)); }

  // Compute target translate (use offsetLeft of slide)
  function calcOffset(i){
    const s = slides[i];
    return s ? s.offsetLeft : 0;
  }

  function goTo(i, userTriggered=false){
    index = ((i % slideCount) + slideCount) % slideCount;
    const offset = calcOffset(index);
    track.style.transition = 'transform .6s cubic-bezier(.2,.9,.2,.98)';
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    if (userTriggered) resetAutoplay();
  }

  // Autoplay loop
  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(() => { goTo(index + 1); }, 1500);
    // autoplayTimer = setInterval(()=> goTo(index+1), interval);
  }
  function stopAutoplay(){ if (autoplayTimer){ clearInterval(autoplayTimer); autoplayTimer=null; } }
  function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

  // Pause on hover
  const portfolioCarousel = document.querySelector('.portfolio-carousel');
  portfolioCarousel.addEventListener('mouseenter', stopAutoplay);
  portfolioCarousel.addEventListener('mouseleave', startAutoplay);

  // Touch / drag support
  track.addEventListener('touchstart', (e)=>{
    stopAutoplay();
    isDragging = true;
    startX = e.touches[0].clientX;
    lastTranslate = -calcOffset(index);
    track.style.transition = 'none';
  }, {passive:true});

  track.addEventListener('touchmove', (e)=>{
    if(!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    track.style.transform = `translateX(${ lastTranslate + dx }px)`;
  }, {passive:true});

  track.addEventListener('touchend', (e)=>{
    if(!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    // swipe threshold
    if (dx < -50) goTo(index+1, true);
    else if (dx > 50) goTo(index-1, true);
    else goTo(index, false);
    startAutoplay();
  });

  // Keyboard support for dots / arrows
  portfolioCarousel.tabIndex = 0;
  portfolioCarousel.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') goTo(index-1, true);
    if(e.key === 'ArrowRight') goTo(index+1, true);
  });

  // Wire preview buttons -> modal
  slides.forEach((slide, idx)=>{
    const btn = slide.querySelector('.preview-btn');
    btn.addEventListener('click', ()=> {
      const videoUrl = slide.dataset.video;
      const title = slide.querySelector('.card-title')?.innerText || 'Preview';
      openModal(videoUrl, title);
    });
  });

  // Modal open/close
  function openModal(videoUrl, title){
    modalMedia.innerHTML = '';
    modalTitle.textContent = title || 'Preview';
    if(!videoUrl){
      modalMedia.innerHTML = '<div style="padding:24px;">No preview available.</div>';
    } else if (/youtube|youtu\.be|vimeo/i.test(videoUrl)){
      const iframe = document.createElement('iframe');
      iframe.src = videoUrl; // ensure embed URL with autoplay if desired
      iframe.allow = "autoplay; fullscreen";
      iframe.setAttribute('frameborder', '0');
      modalMedia.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      modalMedia.appendChild(video);
    }
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden','false');
    stopAutoplay();
  }

  function closeModal(){
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
    modalMedia.innerHTML = '';
    startAutoplay();
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape' && modal.style.display === 'flex') closeModal(); });

  // init: ensure we start centered on item 0
  window.addEventListener('load', ()=> {
    // small timeout to allow images to lay out for offsetLeft measurements
    setTimeout(()=> {
      goTo(0);
      startAutoplay();
    }, 1000);
  });

  // responsive: re-center on resize
  let resizeTimer = null;
  window.addEventListener('resize', ()=> {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=> goTo(index), 120);
  });
})();


//  header section 

(function () {
  const btn   = document.getElementById('menu-toggle');
  const panel = document.getElementById('menu-panel');
  if (!btn || !panel) return;

  function openMenu(){
    panel.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    panel.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
  }
  function closeMenu(){
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    panel.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
  }

  btn.addEventListener('click', () => {
    if (panel.classList.contains('open')) closeMenu(); else openMenu();
  });

  // close when a link is tapped
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // close on Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeMenu();
  });

  // close on outside click
  document.addEventListener('click', e => {
    if (!panel.classList.contains('open')) return;
    const clickedToggle = btn.contains(e.target);
    const clickedPanel  = panel.contains(e.target);
    if (!clickedToggle && !clickedPanel) closeMenu();
  });
})();





// headings 

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menuPanel = document.getElementById('menu-panel');

  if (!menuToggle || !menuPanel) return;

  menuToggle.addEventListener('click', () => {
    const isActive = menuPanel.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);

    // switch icon between hamburger and X
    if (isActive) {
      menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;
    } else {
      menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h16M4 12h16M4 17h16"></path>
        </svg>`;
    }
  });

  // Close the menu when any link is clicked
  menuPanel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuPanel.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', false);
      menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h16M4 12h16M4 17h16"></path>
        </svg>`;
    });
  });
});





  
