// KOUBK x Bauhaus Design System Scripts
// Inspired by emirberasoguk.github.io

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
      text: 'KOUBK resmi bağlantı ağacı ve üyelik başvuru formu:',
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
  // 2. Modals (Close Handlers & Gallery/Team Lightbox)
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

  // Galeri, Afiş ve Ekip görsellerine tıklanınca büyütme
  document.querySelectorAll('.gallery-card-bh, .team-card-bh, .afis-featured-wrap').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const badge = item.querySelector('.gallery-label, .team-card-badge, .afis-overlay-bar span');
      if (img && modalImg) {
        modalImg.src = img.src;
        if (modalCaption && badge) {
          modalCaption.textContent = badge.textContent;
        } else if (modalCaption) {
          modalCaption.textContent = img.alt || 'Görsel Önizleme';
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
  // 3. DESTROY THIS WEBSITE BUTTON (SpriteFusion Stickman Destruction)
  // --------------------------------------------------------------------------
  const destroyBtnTop = document.getElementById('destroy-btn-top');
  destroyBtnTop?.addEventListener('click', () => {
    window.open('https://destroy.spritefusion.com/?from=badge&url=emirberasoguk.github.io/koubk', '_blank');
  });
});
