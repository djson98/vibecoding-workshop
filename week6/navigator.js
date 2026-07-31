const slides = document.querySelectorAll('.slide');
const numberedSlides = [...slides].filter(
  slide => slide.dataset.cat !== 'draft/brain-dump'
);
const total = numberedSlides.length;
const SLIDE_STATE_KEY = 'vibe-workshop-week6-current-slide';
let activeIndex = 0;

function parseSlideHash() {
  const raw = window.location.hash.replace('#', '');
  const match = raw.match(/^(?:slide-)?(\d+)$/);
  if (!match) return null;
  const idx = Number(match[1]) - 1;
  return Number.isInteger(idx) && idx >= 0 && idx < slides.length ? idx : null;
}

function getSavedSlideIndex() {
  const hashIndex = parseSlideHash();
  if (hashIndex !== null) return hashIndex;
  const saved = Number(localStorage.getItem(SLIDE_STATE_KEY));
  return Number.isInteger(saved) && saved >= 0 && saved < slides.length ? saved : 0;
}

function setActiveSlide(idx, updateUrl = true) {
  activeIndex = idx;
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  slides[idx]?.classList.add('active');
  dots[idx]?.classList.add('active');
  localStorage.setItem(SLIDE_STATE_KEY, String(idx));
  if (updateUrl) history.replaceState(null, '', `#slide-${idx + 1}`);
}

function goToSlide(idx, behavior = 'smooth') {
  const next = Math.max(0, Math.min(idx, slides.length - 1));
  setActiveSlide(next);
  slides[next]?.scrollIntoView({ behavior });
}

numberedSlides.forEach((slide, index) => {
  const footer = slide.querySelector('.footer-mark');
  if (!footer) return;
  const indexElement = footer.querySelector('.index');
  if (indexElement) indexElement.textContent = String(index + 1).padStart(2, '0');
  const separator = footer.querySelector('.sep');
  const totalElement = separator?.nextElementSibling;
  if (totalElement) totalElement.textContent = String(total).padStart(2, '0');
});

const nav = document.getElementById('navDots');
if (nav) {
  slides.forEach((slide, index) => {
    const button = document.createElement('button');
    const pageLabel = slide.dataset.cat === 'draft/brain-dump' ? '0' : String(numberedSlides.indexOf(slide) + 1);
    button.setAttribute('aria-label', `Go to slide ${pageLabel}`);
    button.addEventListener('click', () => goToSlide(index));
    nav.appendChild(button);
  });
}
const dots = nav ? nav.querySelectorAll('button') : [];

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
      setActiveSlide([...slides].indexOf(entry.target));
    }
  });
}, { threshold: [0.6] });
slides.forEach(slide => observer.observe(slide));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
    event.preventDefault();
    goToSlide(activeIndex + 1);
  } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    event.preventDefault();
    goToSlide(activeIndex - 1);
  } else if (event.key === 'Home') {
    goToSlide(0);
  } else if (event.key === 'End') {
    goToSlide(slides.length - 1);
  }
});

const initialIndex = getSavedSlideIndex();
setActiveSlide(initialIndex, false);
requestAnimationFrame(() => {
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  slides[initialIndex]?.scrollIntoView({ behavior: 'instant' });
  history.replaceState(null, '', `#slide-${initialIndex + 1}`);
  requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  });
});
