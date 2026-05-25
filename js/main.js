/* ═══════════════════════════════════════
   NISHANTHI PORTFOLIO — main.js
═══════════════════════════════════════ */

// ── Footer year ──────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Navbar scroll shadow ─────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Mobile hamburger menu ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Project Tabs ─────────────────────────────────────
const tabBtns    = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    // Update button states
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show correct content
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === `tab-${target}`) {
        content.classList.add('active');
      }
    });
  });
});

// ── Scroll Reveal ─────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12 }
);

// Add .reveal class to all animatable sections
const revealTargets = document.querySelectorAll(
  '.project-card, .skill-card, .timeline-item, .contact-left, .contact-form, .section-eyebrow, .section-title, .section-desc'
);
revealTargets.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Hero elements use CSS animation (no observer needed)
document.querySelectorAll('.hero-tag, .hero-title, .hero-desc, .hero-btns, .hero-right')
  .forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.animationDelay = `${i * 0.12}s`;
  });

// ── Contact Form ──────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    alert('Please fill in your name, email, and message.');
    return;
  }

  // ── Connect EmailJS here ──────────────────────────
  emailjs.init('JIrLIWLDfs8PWP6uT');

  emailjs.send('service_fkh65kh', 'template_m3fx53e', {
    from_name:  name,
    from_email: email,
    subject:    document.getElementById('subject').value,
    message:    message,
  }).then(() => {
    showSent();
  }).catch((err) => {
    console.error(err);
    alert('Something went wrong. Please try again.');
  });
  showSent();
});

function showSent() {
  submitBtn.textContent = '✓ Message sent!';
  submitBtn.classList.add('sent');
  contactForm.reset();

  setTimeout(() => {
    submitBtn.textContent = 'Send message →';
    submitBtn.classList.remove('sent');
  }, 4000);
}

// ── Smooth active nav highlight on scroll ─────────────
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.style.color = '');
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink && !activeLink.classList.contains('nav-cta')) {
          activeLink.style.color = 'var(--text)';
        }
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ── Reviews Carousel ─────────────────────────────────
(function () {
  const track   = document.getElementById('reviewsTrack');
  const dotsEl  = document.getElementById('reviewDots');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');

  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  const total = cards.length;

  // Show 2 cards at a time on desktop, 1 on mobile
  function visibleCount() {
    return window.innerWidth <= 640 ? 1 : 2;
  }

  let current = 0;

  // Build dots
  function buildDots() {
    dotsEl.innerHTML = '';
    const pages = Math.ceil(total / visibleCount());
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'review-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Review page ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function goTo(page) {
    const pages = Math.ceil(total / visibleCount());
    current = Math.max(0, Math.min(page, pages - 1));
    const cardWidth  = cards[0].offsetWidth + 24; // 24 = gap
    track.style.transform = `translateX(-${current * visibleCount() * cardWidth}px)`;
    dotsEl.querySelectorAll('.review-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-slide every 5s
  let timer = setInterval(() => {
    const pages = Math.ceil(total / visibleCount());
    goTo(current + 1 < pages ? current + 1 : 0);
  }, 5000);

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => {
    timer = setInterval(() => {
      const pages = Math.ceil(total / visibleCount());
      goTo(current + 1 < pages ? current + 1 : 0);
    }, 5000);
  });

  // Rebuild on resize
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  buildDots();
})();

