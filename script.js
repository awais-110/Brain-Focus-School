const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setHeaderState() {
  if (!header || !backToTop) return;
  header.classList.toggle('scrolled', window.scrollY > 16);
  backToTop.classList.toggle('show', window.scrollY > 640);
}

window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.nav-links a[href^="#"]')];

function setActiveNav() {
  const current = sections
    .filter((section) => window.scrollY >= section.offsetTop - 140)
    .pop();

  navItems.forEach((item) => {
    item.classList.toggle('active', Boolean(current && item.getAttribute('href') === `#${current.id}`));
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px' }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const number = entry.target;
      const target = Number(number.dataset.count || 0);
      const duration = reduceMotion ? 1 : 1300;
      const start = performance.now();

      function animate(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      countObserver.unobserve(number);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll('[data-count]').forEach((number) => countObserver.observe(number));

const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack && !reduceMotion) {
  tickerTrack.innerHTML += tickerTrack.innerHTML;
}

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    galleryItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hide', !show);
    });
  });
});

const accordionButtons = document.querySelectorAll('.accordion-btn');

accordionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const body = button.nextElementSibling;
    const isOpen = button.classList.toggle('open');
    button.querySelector('span').textContent = isOpen ? '-' : '+';
    body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : null;
  });
});

if (!reduceMotion) {
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  window.addEventListener(
    'mousemove',
    (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      parallaxItems.forEach((item) => {
        const depth = Number(item.dataset.parallax || 0);
        item.style.transform = `translate3d(${x * depth * 80}px, ${y * depth * 80}px, 0)`;
      });
    },
    { passive: true }
  );

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.06}px, ${y * 0.08}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name');
    const phone = data.get('phone');
    const studentClass = data.get('class');
    const message = data.get('message') || 'I want admission details.';

    const text = `Admission Inquiry - Brain Focus School%0A%0AParent Name: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AInterested Class: ${encodeURIComponent(studentClass)}%0AMessage: ${encodeURIComponent(message)}`;

    const openWhatsApp = confirm('Open this inquiry in WhatsApp? Press Cancel to open email instead.');
    if (openWhatsApp) {
      window.open(`https://wa.me/923017664116?text=${text}`, '_blank', 'noopener');
    } else {
      window.location.href = `mailto:bfspanoaqil@gmail.com?subject=Admission Inquiry - Brain Focus School&body=${text.replaceAll('%0A', '%0D%0A')}`;
    }

    contactForm.reset();
  });
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}
