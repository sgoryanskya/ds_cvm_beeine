/* Раздел «Письма»: окно просмотра и плитки с уменьшенным превью
   CVMView.open(list, idx, opts)  открыть элемент списка в окне: тема, ширина 720 и 360, листание стрелками
   CVMView.fit()                  пересчитать масштаб превью в плитках под ширину плитки
   CVMView.lazy(render)           рисовать превью плитки, только когда она близко к экрану
   Элемент списка: { title, kicker (HTML), theme ('l', 'd' или 'i'), warn, fixed, html(), meta() }
   Тема 'i' показывает, как светлое письмо покрасит почта в темной теме: инверсия цветов, картинки без изменений
   У элементов с warn такая рамка добавляется к выбранной теме сама */
(function (root) {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // ---------- масштаб превью в плитках ----------
  const fit = () => {
    const st = $$('.tile:not([hidden]) .tile-st').find((el) => el.offsetParent !== null);
    if (!st) return;
    const cs = getComputedStyle(st);
    const w = st.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (w <= 0) return;
    document.documentElement.style.setProperty('--z', (w / 720).toFixed(4));
    document.documentElement.style.setProperty('--z3', Math.min(1, w / 360).toFixed(4));
  };
  let rt = 0;
  root.addEventListener('resize', () => { cancelAnimationFrame(rt); rt = requestAnimationFrame(fit); });

  // ---------- ленивая отрисовка ----------
  const lazy = (render) => {
    const done = new Set();
    const io = 'IntersectionObserver' in root ? new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target); done.add(e.target); render(e.target);
    }), { rootMargin: '900px 0px' }) : null;
    return {
      watch: (el) => { if (io) io.observe(el); else { done.add(el); render(el); } },
      redraw: () => done.forEach((el) => render(el)),
    };
  };

  // ---------- окно просмотра ----------
  const V = { list: [], idx: 0, t: 'l', w: '720', auto: true, opts: {} };
  const CAP = { l: 'Светлое', d: 'Темное', i: 'Темная тема почты, светлое письмо' };
  let dlg = null;
  const build = () => {
    dlg = document.createElement('dialog');
    dlg.className = 'vw';
    dlg.setAttribute('aria-labelledby', 'vw-t');
    dlg.innerHTML = '<div class="vw-top"><div class="vw-ti"><div class="vw-k" id="vw-k"></div><h2 id="vw-t"></h2></div>' +
      '<div class="seg" data-k="t" role="group" aria-label="Тема письма"><button type="button" data-v="l">Светлое</button><button type="button" data-v="d">Темное</button><button type="button" data-v="i">Инверсия почты</button><button type="button" data-v="b">Все</button></div>' +
      '<div class="seg" data-k="w" role="group" aria-label="Ширина письма"><button type="button" data-v="720">720</button><button type="button" data-v="360">360</button><button type="button" data-v="b">720 и 360</button></div>' +
      '<div class="vw-nav"><button class="btn" type="button" data-nav="-1" aria-label="Предыдущий">←</button><button class="btn" type="button" data-nav="1" aria-label="Следующий">→</button><button class="btn" type="button" data-close>Закрыть</button></div></div>' +
      '<div class="vw-stage" id="vw-stage"></div><div class="vw-meta" id="vw-meta"></div>';
    document.body.appendChild(dlg);
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) { dlg.close(); return; }
      const b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-close')) { dlg.close(); return; }
      if (b.dataset.nav) { go(Number(b.dataset.nav)); return; }
      const sg = b.closest('.seg');
      if (sg) { V[sg.dataset.k] = b.dataset.v; if (sg.dataset.k === 't') V.auto = false; draw(); }
    });
    dlg.addEventListener('keydown', (e) => {
      if (e.target.closest('input,textarea')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });
    dlg.addEventListener('close', () => { if (V.opts.onClose) V.opts.onClose(); });
  };
  const go = (d) => {
    const n = V.idx + d;
    if (n < 0 || n >= V.list.length) return;
    V.idx = n; draw();
  };
  const draw = () => {
    const it = V.list[V.idx];
    if (!it) return;
    if (V.auto && it.theme) V.t = it.theme;
    $('#vw-t', dlg).textContent = it.title;
    $('#vw-k', dlg).innerHTML = it.kicker || '';
    const ts = it.fixed ? ['l'] : (V.t === 'b' ? ['l', 'd', 'i'] : [V.t]);
    if (it.warn && !it.fixed && ts.indexOf('i') === -1) ts.push('i');
    const ws = it.fixed ? ['720'] : (V.w === 'b' ? ['720', '360'] : [V.w]);
    const html = it.html();
    $('#vw-stage', dlg).innerHTML = ws.map((w) => ts.map((t) => `<figure class="vw-f${t === 'i' ? ' inv' : ''}" style="width:${w}px"><figcaption>${CAP[t]} · ${w}</figcaption><div class="ml${t === 'd' ? ' dk' : t === 'i' ? ' inv' : ''}">${html}</div></figure>`).join('')).join('') +
      (it.fixed ? '<p class="small muted" style="flex-basis:100%;text-align:center">Снимок из Figma, тема и ширина не переключаются</p>' : '');
    $('#vw-meta', dlg).innerHTML = it.meta ? it.meta() : '';
    $$('.seg', dlg).forEach((sg) => $$('button', sg).forEach((b) => {
      b.setAttribute('aria-pressed', String(V[sg.dataset.k] === b.dataset.v));
      b.disabled = !!it.fixed;
    }));
    $('[data-nav="-1"]', dlg).disabled = V.idx === 0;
    $('[data-nav="1"]', dlg).disabled = V.idx === V.list.length - 1;
    dlg.scrollTop = 0;
    if (V.opts.onShow) V.opts.onShow(it);
  };
  const open = (list, idx, opts) => {
    if (!dlg) build();
    V.list = list; V.idx = idx; V.opts = opts || {};
    V.t = V.opts.t || 'l'; V.w = V.opts.w || '720'; V.auto = !!V.opts.auto;
    if (!dlg.open) dlg.showModal();
    draw();
    $('[data-close]', dlg).focus();
  };

  root.CVMView = { open, fit, lazy };
})(window);
