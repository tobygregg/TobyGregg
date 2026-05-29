/* ============================================================
   TOBY GREGG — Latest Posts (Google Sheets powered)

   SETUP:
   1. Create a Google Sheet with these column headers in row 1:
        Date | Title | Tag | Content
      - Date:    e.g. 2026-05-29
      - Title:   post title
      - Tag:     Engineering / Music / Videography / Studies / Other
      - Content: HTML for the post body (can include images, links, etc.)
      - Tip: store images in /images/posts/ and reference as:
             <img src="images/posts/yourimage.jpg" alt="...">

   2. File → Share → Publish to web
      → Entire Document → Comma-separated values (.csv) → Publish

   3. Copy the URL and paste it below as SHEET_CSV_URL
   ============================================================ */

const SHEET_CSV_URL = 'YOUR_GOOGLE_SHEET_CSV_PUBLISH_URL_HERE';

/* ── State ─────────────────────────────────────────────────────── */
let allPosts = [];
let activeTag = 'All';

/* ── Init ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  setupFilters();
  await loadPosts();
  handleURLParams();
});

/* ── Filters ───────────────────────────────────────────────────── */
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTag = btn.dataset.tag;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPosts(activeTag);
    });
  });
}

function filterPosts(tag) {
  document.querySelectorAll('.post-card').forEach(card => {
    const match = tag === 'All' || card.dataset.tag === tag;
    card.classList.toggle('hidden', !match);
  });

  const visible = document.querySelectorAll('.post-card:not(.hidden)');
  const emptyEl = document.getElementById('posts-empty');
  if (emptyEl) emptyEl.style.display = visible.length === 0 ? 'block' : 'none';
}

/* ── Load & Parse ──────────────────────────────────────────────── */
async function loadPosts() {
  const container = document.getElementById('posts-grid');
  if (!container) return;

  if (!SHEET_CSV_URL || SHEET_CSV_URL.includes('YOUR_GOOGLE_SHEET')) {
    renderSetupMessage(container);
    return;
  }

  showLoading(container);

  try {
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error('Network error');
    const csv = await res.text();
    allPosts = parseCSV(csv);
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderPosts(container, allPosts);

    const tag = new URLSearchParams(window.location.search).get('tag');
    if (tag) {
      activeTag = tag;
      const btn = document.querySelector(`.filter-btn[data-tag="${tag}"]`);
      if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterPosts(tag);
      }
    }
  } catch (err) {
    showError(container, err.message);
  }
}

/* ── CSV Parser ────────────────────────────────────────────────── */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQ && next === '"') { field += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      row.push(field); field = '';
    } else if ((ch === '\n' || (ch === '\r' && next === '\n')) && !inQ) {
      if (ch === '\r') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
    } else {
      field += ch;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }

  // First row = headers, skip it
  return rows.slice(1).map(r => ({
    date:    (r[0] || '').trim(),
    title:   (r[1] || '').trim(),
    tag:     (r[2] || 'Other').trim(),
    content: (r[3] || '').trim(),
    slug:    toSlug(r[1] || ''),
  })).filter(p => p.title);
}

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ── Render ────────────────────────────────────────────────────── */
function renderPosts(container, posts) {
  if (!posts.length) {
    container.innerHTML = `
      <div class="posts-empty" id="posts-empty">
        <i class="fas fa-file-alt"></i>
        <p>No posts yet — check back soon.</p>
      </div>`;
    return;
  }

  container.innerHTML = posts.map(p => `
    <article class="post-card reveal" data-tag="${p.tag}" data-slug="${p.slug}">
      <div class="post-header" role="button" tabindex="0"
           onclick="togglePost(this)" onkeydown="if(event.key==='Enter')togglePost(this)">
        <div>
          <div class="post-meta">
            <span class="post-tag ${tagClass(p.tag)}">${p.tag}</span>
            <span class="post-date">${formatDate(p.date)}</span>
          </div>
          <h2 class="post-title">${escapeHTML(p.title)}</h2>
        </div>
        <div class="post-header-right">
          <button class="post-share-btn" title="Copy link"
                  onclick="sharePost(event,'${p.slug}')">
            <i class="fas fa-share-nodes"></i>
          </button>
          <div class="post-chevron"><i class="fas fa-chevron-down"></i></div>
        </div>
      </div>
      <div class="post-body" id="body-${p.slug}">${p.content}</div>
    </article>
  `).join('');

  container.insertAdjacentHTML('beforeend', `
    <div class="posts-empty" id="posts-empty" style="display:none">
      <i class="fas fa-filter"></i>
      <p>No posts in this category yet.</p>
    </div>`);

  window.initReveal && window.initReveal();
}

/* ── Toggle Post ───────────────────────────────────────────────── */
window.togglePost = function (header) {
  const card = header.closest('.post-card');
  const body = card.querySelector('.post-body');
  const open = card.classList.contains('expanded');

  // Close all others
  document.querySelectorAll('.post-card.expanded').forEach(c => {
    c.classList.remove('expanded');
    c.querySelector('.post-body').classList.remove('open');
  });

  if (!open) {
    card.classList.add('expanded');
    body.classList.add('open');
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }
};

/* ── Share ─────────────────────────────────────────────────────── */
window.sharePost = function (e, slug) {
  e.stopPropagation();
  const url = `${location.origin}${location.pathname}?post=${slug}`;
  navigator.clipboard.writeText(url).then(() => {
    window.showToast && window.showToast('Link copied!');
  }).catch(() => {
    window.showToast && window.showToast('Could not copy link');
  });
};

/* ── URL params ────────────────────────────────────────────────── */
function handleURLParams() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('post');
  if (!slug) return;

  // Wait for render
  setTimeout(() => {
    const card = document.querySelector(`.post-card[data-slug="${slug}"]`);
    if (!card) return;
    const header = card.querySelector('.post-header');
    togglePost(header);
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  }, 300);
}

/* ── Helpers ───────────────────────────────────────────────────── */
function tagClass(tag) {
  return { Engineering:'engineering', Music:'music', Videography:'videography', Studies:'studies' }[tag] || 'other';
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return isNaN(d) ? str : d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showLoading(el) {
  el.innerHTML = `<div class="posts-loading"><div class="spinner"></div><p>Loading posts…</p></div>`;
}

function showError(el, msg) {
  el.innerHTML = `
    <div class="posts-error">
      <i class="fas fa-triangle-exclamation"></i>
      <p>Couldn't load posts. ${msg || ''}</p>
      <p style="margin-top:0.5rem;font-size:0.8rem">Check that your sheet is published and the URL is correct in js/latest.js</p>
    </div>`;
}

function renderSetupMessage(el) {
  el.innerHTML = `
    <div class="posts-error">
      <i class="fas fa-table"></i>
      <p><strong>Connect your Google Sheet to show posts here.</strong></p>
      <div class="sheet-setup">
        <strong>Setup:</strong><br>
        1. Create a Google Sheet with columns: <code>Date</code> | <code>Title</code> | <code>Tag</code> | <code>Content</code><br>
        2. File → Share → Publish to web → CSV → Publish<br>
        3. Copy the URL and replace <code>SHEET_CSV_URL</code> in <code>js/latest.js</code><br><br>
        Tags: <code>Engineering</code> · <code>Music</code> · <code>Videography</code> · <code>Studies</code> · <code>Other</code><br>
        Content column accepts HTML. Store images in <code>images/posts/</code>.
      </div>
    </div>`;
}
