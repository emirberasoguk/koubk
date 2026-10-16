// KOUBK x Bauhaus Design System Scripts
// Physics Engine & Site Destruction, QR Modal, Share & Lightbox

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. QR Modal & Copy / Share
  // --------------------------------------------------------------------------
  const qrBtn = document.getElementById('qr-btn');
  const qrModal = document.getElementById('qr-modal');
  const shareBtn = document.getElementById('share-btn');
  const toast = document.getElementById('toast');

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  shareBtn?.addEventListener('click', async () => {
    const shareData = {
      title: 'Kocaeli Üniversitesi Bilgisayar Kulübü (KOUBK)',
      text: 'Kodla, öğren, üret, birlikte geliş. KOUBK bağlantıları ve başvuru formu:',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Bağlantı panoya kopyalandı! 📋');
    }
  });

  qrBtn?.addEventListener('click', () => {
    qrModal?.classList.add('active');
    renderQrCode();
  });

  function renderQrCode() {
    const container = document.getElementById('qr-container');
    if (!container || container.dataset.rendered === 'true') return;

    const url = encodeURIComponent(window.location.href || 'https://emirberasoguk.github.io/koubk/');
    const qrImg = document.createElement('img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${url}&margin=1`;
    qrImg.alt = 'KOUBK QR Kodu';
    qrImg.width = 220;
    qrImg.height = 220;
    
    container.innerHTML = '';
    container.appendChild(qrImg);
    container.dataset.rendered = 'true';
  }

  // --------------------------------------------------------------------------
  // 2. Modals (Close Handlers & Gallery Lightbox)
  // --------------------------------------------------------------------------
  const galleryModal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');

  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close-btn') || el.closest('.modal-close-btn')) {
        qrModal?.classList.remove('active');
        galleryModal?.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('.gallery-card-bh').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const label = item.querySelector('.gallery-label');
      if (img && modalImg) {
        modalImg.src = img.src;
        if (modalCaption && label) {
          modalCaption.textContent = label.textContent;
        }
        galleryModal?.classList.add('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      qrModal?.classList.remove('active');
      galleryModal?.classList.remove('active');
    }
  });

  // --------------------------------------------------------------------------
  // 3. PHYSICAL 2D DESTRUCTION ENGINE (💥 DESTROY THIS SITE)
  // --------------------------------------------------------------------------
  const destroyBtn = document.getElementById('destroy-btn');
  const destroyedBanner = document.getElementById('destroyed-banner');
  const rebuildBtn = document.getElementById('rebuild-btn');
  const canvas = document.getElementById('destruction-canvas');
  const ctx = canvas?.getContext('2d');

  let physicsRunning = false;
  let particles = [];
  let physicsBodies = [];
  let animFrameId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  destroyBtn?.addEventListener('click', () => {
    if (physicsRunning) return;
    startDestruction();
  });

  rebuildBtn?.addEventListener('click', () => {
    rebuildSite();
  });

  function startDestruction() {
    physicsRunning = true;
    document.body.classList.add('screen-shaking');
    setTimeout(() => document.body.classList.remove('screen-shaking'), 800);

    if (canvas) canvas.style.display = 'block';

    // Parçacık patlamaları üret (duman ve kıvılcım parçacıkları)
    spawnExplosionParticles();

    // Sayfadaki fiziksel olarak düşecek tüm kartları ve parçaları topla
    const targets = document.querySelectorAll(
      '.hero-card, .cta-application, .bh-link-card, .bh-pillar-item, .gallery-card-bh, .about-box-bh, .gallery-box-bh, .ticker-bar, .shape-circle-red, .shape-square-yellow, .shape-triangle-blue, .shape-stripes-block'
    );

    physicsBodies = [];
    targets.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      
      // Öğeyi sabit fizik nesnesine dönüştür
      physicsBodies.push({
        element: el,
        x: rect.left,
        y: rect.top,
        origX: el.style.transform || '',
        origTransition: el.style.transition || '',
        width: rect.width,
        height: rect.height,
        vx: (Math.random() - 0.5) * 14 + (index % 2 === 0 ? -4 : 4),
        vy: -(Math.random() * 12 + 6), // Önce yukarı doğru patlama hissi
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.18,
        gravity: 0.75 + Math.random() * 0.25,
        bounce: 0.38 + Math.random() * 0.15,
        friction: 0.98,
        isDead: false
      });

      el.style.position = 'fixed';
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.top}px`;
      el.style.width = `${rect.width}px`;
      el.style.margin = '0';
      el.style.zIndex = '1000';
      el.style.pointerEvents = 'none';
      el.style.transition = 'none';
    });

    animatePhysics();

    // 1.8 saniye sonra enkaz tabelasını aç
    setTimeout(() => {
      if (destroyedBanner) destroyedBanner.style.display = 'block';
    }, 1600);
  }

  function spawnExplosionParticles() {
    particles = [];
    const colors = ['#d90429', '#ffd000', '#0d47a1', '#111111', '#ffffff'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.35;

    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 16 + 4;
      particles.push({
        x: centerX + (Math.random() - 0.5) * 300,
        y: centerY + (Math.random() - 0.5) * 200,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        isSquare: Math.random() > 0.5
      });
    }
  }

  function animatePhysics() {
    if (!physicsRunning) return;

    const floor = window.innerHeight;

    // 1. Elementlerin fiziğini hesapla
    physicsBodies.forEach(body => {
      body.vy += body.gravity;
      body.vx *= body.friction;
      body.x += body.vx;
      body.y += body.vy;
      body.rotation += body.rotSpeed;

      // Zemin çarpışması
      if (body.y + body.height >= floor) {
        body.y = floor - body.height;
        body.vy = -body.vy * body.bounce;
        body.rotSpeed *= 0.8;
        body.vx *= 0.85;

        // Enerji bittiyse durdur
        if (Math.abs(body.vy) < 1.2) {
          body.vy = 0;
          body.rotSpeed = 0;
        }
      }

      // Duvarlardan sekme
      if (body.x < 0) {
        body.x = 0;
        body.vx = -body.vx * body.bounce;
      } else if (body.x + body.width > window.innerWidth) {
        body.x = window.innerWidth - body.width;
        body.vx = -body.vx * body.bounce;
      }

      body.element.style.transform = `translate(${body.x - parseFloat(body.element.style.left)}px, ${body.y - parseFloat(body.element.style.top)}px) rotate(${body.rotation}rad)`;
    });

    // 2. Parçacıkları çiz
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // parçacık yerçekimi
        p.life -= p.decay;

        if (p.life > 0) {
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          if (p.isSquare) {
            ctx.fillRect(p.x, p.y, p.size, p.size);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });
      particles = particles.filter(p => p.life > 0);
    }

    animFrameId = requestAnimationFrame(animatePhysics);
  }

  function rebuildSite() {
    physicsRunning = false;
    cancelAnimationFrame(animFrameId);

    if (destroyedBanner) destroyedBanner.style.display = 'none';
    if (canvas) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }

    // Tüm elementleri orijinal durumuna animasyonla döndür
    physicsBodies.forEach(body => {
      const el = body.element;
      el.style.transition = 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'translate(0px, 0px) rotate(0rad)';
    });

    setTimeout(() => {
      physicsBodies.forEach(body => {
        const el = body.element;
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
        el.style.width = '';
        el.style.margin = '';
        el.style.zIndex = '';
        el.style.pointerEvents = '';
        el.style.transition = '';
        el.style.transform = '';
      });
      physicsBodies = [];
      showToast('KOUBK sitesi başarıyla yeniden inşa edildi! 🏗️');
    }, 700);
  }
});
