/* ── AUTH ─────────────────────── */
const PROTECTED_PAGES = [
  'dashboard.html',
  'katalog-kursus.html',
  'detail-kursus.html',
  'arsip-artikel.html',
  'detail-artikel.html',
  'keranjang.html',
  'pembayaran.html',
  'history-transaksi.html',
  'profil.html',
  'sertifikat.html',
  'quiz.html',
  'admin-artikel.html',
  'admin-produk.html',
  'admin-pengguna.html',
  'admin-transaksi.html',
];

function isLoggedIn() {
  return sessionStorage.getItem('eduflow_user') !== null;
}

// Guard: dipanggil otomatis di setiap halaman protected
(function requireAuth() {
  const href = window.location.href;
  const isProtected = PROTECTED_PAGES.some(p => href.includes(p));
  if (isProtected && !isLoggedIn()) {
    // Simpan hanya nama file tujuan, bukan full URL
    const page = PROTECTED_PAGES.find(p => href.includes(p));
    sessionStorage.setItem('eduflow_redirect', page);
    window.location.replace('login.html');
  }
})();

// Navigasi dari index.html — lewat login kalau belum masuk
function goTo(url) {
  if (isLoggedIn()) {
    window.location.href = url;
  } else {
    // Simpan hanya nama file tujuan
    const page = url.split('/').pop();
    sessionStorage.setItem('eduflow_redirect', page);
    window.location.href = 'login.html';
  }
}

// Login — dipanggil dari form di login.html
function doLogin(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('email')?.value;
  const pass  = document.getElementById('password')?.value;
  if (!email || !pass) return;
  sessionStorage.setItem('eduflow_user', JSON.stringify({ email, name: 'Ahmad' }));
  const redirect = sessionStorage.getItem('eduflow_redirect') || 'dashboard.html';
  sessionStorage.removeItem('eduflow_redirect');
  window.location.href = redirect;
}

// Logout
function doLogout() {
  sessionStorage.removeItem('eduflow_user');
  window.location.href = 'index.html';
}

/* ── MENU TOGGLE ─────────────── */
function toggleMenu() {
  document.getElementById('menu').classList.toggle('active');
}

/* ── SCROLL ANIMATION ────────── */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

/* ── TAB SYSTEM ──────────────── */
function showTab(id, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-bar button').forEach(b => b.classList.remove('active'));
  const target = document.getElementById('tab-' + id);
  if (target) target.classList.add('active');
  if (el) el.classList.add('active');
}

/* ── MODAL ───────────────────── */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

/* ── SYLLABUS ACCORDION ──────── */
function toggleSyl(el) {
  const body = el.nextElementSibling;
  body.classList.toggle('open');
  const arrow = el.querySelector('.arrow');
  if (arrow) arrow.textContent = body.classList.contains('open') ? '▴' : '▾';
}

/* ── TOAST NOTIFICATION ──────── */
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', bottom:'28px', right:'28px', zIndex:'500',
    background: type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb',
    color:'#fff', padding:'12px 20px', borderRadius:'10px',
    fontSize:'14px', fontWeight:'600', boxShadow:'0 4px 16px rgba(0,0,0,.2)',
    animation:'slideUp .3s ease'
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
