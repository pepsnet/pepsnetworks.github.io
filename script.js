const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const mob = document.getElementById('mobMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backTop').classList.toggle('show', window.scrollY > 400);
});

toggle.addEventListener('click', () => {
  const open = !mob.classList.contains('open');
  mob.classList.toggle('open', open);
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  mob.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});

function closeNav() {
  mob.classList.remove('open');
  toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  mob.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function animCount(el, target, suffix, dur) {
  let v = 0;
  const step = target / (dur / 16);
  const t = setInterval(() => {
    v = Math.min(v + step, target);
    el.textContent = `${Math.floor(v)}${suffix}`;
    if (v >= target) clearInterval(t);
  }, 16);
}

const hObs = new IntersectionObserver((entries) => {
  const e = entries[0];
  if (e.isIntersecting) {
    animCount(document.getElementById('s1'), 500, '+', 1800);
    animCount(document.getElementById('s2'), 99.9, '%', 2000);
    animCount(document.getElementById('s3'), 250, '+', 1500);
    hObs.disconnect();
  }
}, { threshold: .3 });

const hs = document.querySelector('.hero-stats');
if (hs) hObs.observe(hs);

const bObs = new IntersectionObserver((entries) => {
  const e = entries[0];
  if (e.isIntersecting) {
    animCount(document.getElementById('b1'), 500, '+', 1800);
    animCount(document.getElementById('b2'), 99.9, '%', 2000);
    animCount(document.getElementById('b3'), 12000, '+', 2000);
    animCount(document.getElementById('b4'), 15, '+', 1500);
    bObs.disconnect();
  }
}, { threshold: .3 });

const sb = document.querySelector('.stats-banner');
if (sb) bObs.observe(sb);

const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('on'), i * 70);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: .08 });

document.querySelectorAll('.nav-item > .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const item = link.parentElement;
    if (item.querySelector('.nav-drop')) {
      e.preventDefault();
      item.classList.toggle('open');
    }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-item')) {
    document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'));
  }
});

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

function filterSvc(cat, btn) {
  document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.svc-card').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
  });
}

function submitForm(e) {
  e.preventDefault();
  const f = e.target;
  if (!f.fname.value.trim() || !f.lname.value.trim()) return showToast('⚠️', 'Please enter your full name.');
  if (!f.email.value.includes('@')) return showToast('⚠️', 'Please enter a valid email address.');
  if (!f.msg.value.trim()) return showToast('⚠️', 'Please add a message.');
  if (!f.privacy.checked) return showToast('⚠️', 'Please accept the privacy policy.');
  showToast('✅', 'Message sent! We\'ll respond within 2 hours.');
  f.reset();
}

function subscribeNL() {
  const el = document.getElementById('nlEmail');
  if (!el.value || !el.value.includes('@')) return showToast('⚠️', 'Please enter a valid email.');
  showToast('📬', 'Subscribed! Welcome to the Peps Networks community.');
  el.value = '';
}

function doSearch() {
  const q = document.getElementById('topSearch').value.trim().toLowerCase();
  if (!q) { showToast('⚠️', 'Please enter a search query.'); return; }

  const textNodes = Array.from(document.querySelectorAll('h1,h2,h3,h4,p,li,a,section'));
  const match = textNodes.find(el => el.textContent.toLowerCase().includes(q));

  if (match) {
    match.scrollIntoView({ behavior: 'smooth', block: 'start' });
    match.classList.add('search-highlight');
    setTimeout(() => match.classList.remove('search-highlight'), 2400);
    showToast('🔍', `Found: ${q}`);
  } else {
    showToast('⚠️', `No results for "${q}" on this page.`);
  }
}

let toastTimer;
function showToast(icon, msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 4000);
}
