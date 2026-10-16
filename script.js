// KOUBK Linktree & Hub Scripts
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('koubk-theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('koubk-theme', next);
  });

  // 2. Share & Toast
  const shareBtn = document.getElementById('share-btn');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  }

  shareBtn?.addEventListener('click', async () => {
    const shareData = {
      title: 'Kocaeli Üniversitesi Bilgisayar Kulübü (KOUBK)',
      text: 'Kodla, öğren, üret, birlikte geliş. KOUBK bağlantıları ve üyelik formu:',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Kullanıcı iptal ettiğinde veya hata durumunda fallback
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Bağlantı panoya kopyalandı! 📋');
    }
  });

  // 3. Modals (QR Code & Gallery Lightbox)
  const qrBtn = document.getElementById('qr-btn');
  const qrModal = document.getElementById('qr-modal');
  const galleryModal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');

  // Close modals
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close') || el.closest('.modal-close')) {
        qrModal?.classList.remove('active');
        galleryModal?.classList.remove('active');
      }
    });
  });

  qrBtn?.addEventListener('click', () => {
    qrModal?.classList.add('active');
    renderQrCode();
  });

  // Gallery click to open
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const badge = item.querySelector('.gallery-badge');
      if (img && modalImg) {
        modalImg.src = img.src;
        if (modalCaption && badge) {
          modalCaption.textContent = badge.textContent;
        }
        galleryModal?.classList.add('active');
      }
    });
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      qrModal?.classList.remove('active');
      galleryModal?.classList.remove('active');
    }
  });

  // Render QR Code using Google Chart API or minimal SVG fallback
  function renderQrCode() {
    const container = document.getElementById('qr-container');
    if (!container || container.dataset.rendered === 'true') return;

    const url = encodeURIComponent(window.location.href || 'https://emirberasoguk.github.io/koubk/');
    const qrImg = document.createElement('img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${url}&margin=1`;
    qrImg.alt = 'KOUBK QR Kodu';
    qrImg.width = 220;
    qrImg.height = 220;
    qrImg.loading = 'lazy';
    
    container.innerHTML = '';
    container.appendChild(qrImg);
    container.dataset.rendered = 'true';
  }
});
