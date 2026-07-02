// vibecoding workshop — slide navigator (shared)

const slides = document.querySelectorAll('.slide');
const total = slides.length;
const SLIDE_STATE_KEY = 'vibe-workshop-current-slide';
let activeIndex = 0;

function parseSlideHash() {
  const raw = window.location.hash.replace('#', '');
  const match = raw.match(/^(?:slide-)?(\d+)$/);
  if (!match) return null;
  const idx = Number(match[1]) - 1;
  return Number.isInteger(idx) && idx >= 0 && idx < total ? idx : null;
}

function getSavedSlideIndex() {
  const hashIndex = parseSlideHash();
  if (hashIndex !== null) return hashIndex;
  const saved = Number(localStorage.getItem(SLIDE_STATE_KEY));
  return Number.isInteger(saved) && saved >= 0 && saved < total ? saved : 0;
}

function setActiveSlide(idx, updateUrl = true) {
  activeIndex = idx;
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[idx]?.classList.add('active');
  dots[idx]?.classList.add('active');
  localStorage.setItem(SLIDE_STATE_KEY, String(idx));
  if (updateUrl) {
    history.replaceState(null, '', `#slide-${idx + 1}`);
  }
}

function goToSlide(idx, behavior = 'smooth') {
  const next = Math.max(0, Math.min(idx, total - 1));
  setActiveSlide(next);
  slides[next]?.scrollIntoView({ behavior });
}

// Auto-number footer marks (so slide reordering doesn't break numbering)
slides.forEach((s, i) => {
  const fm = s.querySelector('.footer-mark');
  if (!fm) return;
  const idxEl = fm.querySelector('.index');
  if (idxEl) idxEl.textContent = String(i + 1).padStart(2, '0');
  const sepEl = fm.querySelector('.sep');
  const totalEl = sepEl?.nextElementSibling;
  if (totalEl) totalEl.textContent = String(total).padStart(2, '0');
});

// Build nav dots (optional — page still works without #navDots)
const nav = document.getElementById('navDots');
if (nav) {
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => goToSlide(i));
    nav.appendChild(b);
  });
}
const dots = nav ? nav.querySelectorAll('button') : [];

// IntersectionObserver — mark active slide, sync dots
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting && e.intersectionRatio > 0.6) {
      const idx = [...slides].indexOf(e.target);
      setActiveSlide(idx);
    }
  });
}, { threshold: [0.6] });
slides.forEach(s => io.observe(s));

// Keyboard nav
document.addEventListener('keydown', (e) => {
  const cur = activeIndex;
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    goToSlide(cur + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    goToSlide(cur - 1);
  } else if (e.key === 'Home') {
    goToSlide(0);
  } else if (e.key === 'End') {
    goToSlide(total - 1);
  }
});

// Initial state
const initialIndex = getSavedSlideIndex();
setActiveSlide(initialIndex, false);
requestAnimationFrame(() => {
  slides[initialIndex]?.scrollIntoView({ behavior: 'auto' });
  history.replaceState(null, '', `#slide-${initialIndex + 1}`);
});
