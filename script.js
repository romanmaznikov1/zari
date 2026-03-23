/* ===== Messenger Placeholders ===== */
const TG_USERNAME = '[TG_USERNAME]';
const WA_NUMBER = '[WA_NUMBER]';
const MAX_LINK = '[MAX_LINK]';

/* ===== DOM Elements ===== */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const header = document.getElementById('header');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalTg = document.getElementById('modal-tg');
const modalWa = document.getElementById('modal-wa');
const modalMax = document.getElementById('modal-max');

/* ===== Header scroll effect ===== */
let lastScroll = 0;
const onScroll = () => {
  const scrollY = window.scrollY;
  header.classList.toggle('is-scrolled', scrollY > 50);
  lastScroll = scrollY;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ===== Smooth Scroll ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      if (nav.classList.contains('is-open')) {
        closeMobileMenu();
      }
    }
  });
});

/* ===== Burger Menu ===== */
function closeMobileMenu() {
  burger.classList.remove('is-active');
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-active');
  burger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* ===== Intersection Observer (Fade-in) ===== */
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
);

fadeElements.forEach(el => observer.observe(el));

/* ===== Counter animation for stats ===== */
const statNumbers = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ===== Parallax on hero dice (mouse move) ===== */
const heroDice = document.querySelectorAll('.hero__dice');

if (window.matchMedia('(min-width: 768px)').matches) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    heroDice.forEach((dice, i) => {
      const speed = (i + 1) * 8;
      dice.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
}

/* ===== Card tilt effect on hover ===== */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.matchMedia('(max-width: 767px)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    card.style.transform = `translateY(-6px) perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== Modal ===== */
let previouslyFocused = null;

function openModal(productName) {
  previouslyFocused = document.activeElement;
  modalTitle.textContent = productName;

  const msg = encodeURIComponent(`Здравствуйте! Хочу заказать: ${productName}`);

  modalTg.href = `https://t.me/${TG_USERNAME}?text=${msg}`;
  modalWa.href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
  modalMax.href = MAX_LINK;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modalTg.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';

  if (previouslyFocused) {
    previouslyFocused.focus();
    previouslyFocused = null;
  }
}

document.querySelectorAll('[data-modal-close]').forEach(el => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) {
    closeModal();
  }
});

// Focus trap
modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  const focusable = modal.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Card order buttons
document.querySelectorAll('.card__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    const productName = card.dataset.product;
    openModal(productName);
  });
});
