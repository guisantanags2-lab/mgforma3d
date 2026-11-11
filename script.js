(function () {
  // ---------- Contador de camadas do hero ----------
  const layerEl = document.getElementById('layer');
  const pctEl = document.getElementById('pct');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = 4200, DELAY = 400, TOTAL = 240;
  const ease = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const setProgress = (p) => {
    layerEl.textContent = String(Math.round(p * TOTAL)).padStart(3, '0');
    pctEl.textContent = Math.round(p * 100) + '%';
  };
  if (reduce) setProgress(1);
  else {
    const start = performance.now() + DELAY;
    const tick = (now) => {
      const t = Math.min(Math.max((now - start) / DURATION, 0), 1);
      setProgress(ease(t));
      if (t < 1) requestAnimationFrame(tick);
      else pctEl.textContent = 'Pronto ✓';
    };
    requestAnimationFrame(tick);
  }

  // ---------- Acervo (posts do Instagram) ----------
  const gallery = document.getElementById('gallery');
  const posts = (window.POSTS || []).map((url) => {
    const m = url.match(/instagram\.com\/(?:[^/]+\/)?(p|reel|tv)\/([\w-]+)/);
    return m ? { type: m[1] === 'p' ? 'p' : 'reel', id: m[2], url } : null;
  }).filter(Boolean);

  posts.forEach((post, i) => {
    const n = String(posts.length - i).padStart(3, '0');
    const el = document.createElement('figure');
    el.className = 'piece reveal';
    el.dataset.type = post.type;
    el.style.setProperty('--d', (i % 3) * 90 + 'ms');
    el.innerHTML = `
      <div class="frame">
        <iframe src="https://www.instagram.com/${post.type}/${post.id}/embed/"
                loading="lazy" scrolling="no" title="Peça Nº ${n} no Instagram"></iframe>
      </div>
      <figcaption class="plaque">
        <strong>Peça Nº ${n}</strong>
        <span>${post.type === 'reel' ? 'vídeo' : 'foto'} · impressão 3D</span>
      </figcaption>`;
    gallery.appendChild(el);
  });

  document.querySelectorAll('.filters button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      gallery.querySelectorAll('.piece').forEach((el) => {
        el.hidden = f !== 'all' && el.dataset.type !== f;
        if (!el.hidden) el.classList.add('in');
      });
    });
  });

  // ---------- Revelar ao rolar ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i % 3) * 120 + 'ms');
    io.observe(el);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
