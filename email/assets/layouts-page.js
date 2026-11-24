/* Страница «Макеты»: письма целиком плитками, фильтр по типу письма, тема и окно просмотра
   Данные в layouts.js (CVMMail.LAYOUTS), названия блоков из registry.js */
(function () {
  'use strict';
  const M = window.CVMMail, V = window.CVMView;
  const LAY = M.LAYOUTS, CATS = M.LAYOUT_CATS;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const blocksWord = (n) => { const a = n % 10, b = n % 100; return n + ' ' + (a === 1 && b !== 11 ? 'блок' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'блока' : 'блоков'); };

  const KEY = 'cvm-email-layouts';
  const st = { c: 'all', t: 'own' };
  try { const sv = JSON.parse(localStorage.getItem(KEY) || '{}'); if (sv.t) st.t = sv.t; } catch (e) { /* хранилище недоступно */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ t: st.t })); } catch (e) { /* без сохранения */ } };

  const uniq = new Set();
  LAY.forEach((L) => L.blocks.forEach((c) => uniq.add(c)));
  const cats = CATS.filter((c) => LAY.some((L) => L.cat === c));
  $('#tally').innerHTML = `<span class="pill">Макетов<b>${LAY.length}</b></span><span class="pill">Типов писем<b>${cats.length}</b></span><span class="pill">Разных компонентов<b>${uniq.size}</b></span>`;
  $('#seg-c').innerHTML = `<button type="button" data-v="all">Все<i>${LAY.length}</i></button>` + cats.map((c) => `<button type="button" data-v="${c}">${c}<i>${LAY.filter((L) => L.cat === c).length}</i></button>`).join('');

  $('#lay').innerHTML = LAY.map((L) => `<article class="tile" id="l-${L.id}" data-cat="${L.cat}"><div class="tile-st" inert aria-hidden="true"></div><div class="tile-m"><span class="pill">${L.cat}</span>${L.theme === 'dk' ? '<span class="pill">Темное</span>' : ''}${L.src ? '<span class="pill">По реальному письму</span>' : ''}${L.refs && L.refs.length ? '<span class="pill st-mkt">Прием рынка</span>' : ''}<span class="sp"></span><span class="tile-c">${blocksWord(L.blocks.length)}</span><button type="button" class="tile-b" data-id="${L.id}" style="flex-basis:100%">${esc(L.name)}</button><p class="tile-n">${esc(L.note)}</p></div></article>`).join('');
  LAY.forEach((L) => { L.el = document.getElementById('l-' + L.id); });

  const theme = (L) => (st.t === 'own' ? L.theme : st.t === 'd' ? 'dk' : st.t === 'i' ? 'inv' : 'l');
  const thumb = (L) => `<div class="zm"><div class="ml${theme(L) === 'l' ? '' : ' ' + theme(L)}">${L.html()}</div></div>`;
  const byEl = new Map(LAY.map((L) => [$('.tile-st', L.el), L]));
  const lz = V.lazy((el) => { el.innerHTML = thumb(byEl.get(el)); });
  byEl.forEach((_, el) => lz.watch(el));

  const apply = () => {
    let n = 0;
    LAY.forEach((L) => { const ok = st.c === 'all' || L.cat === st.c; L.el.hidden = !ok; if (ok) n++; });
    $('#empty').hidden = n > 0;
    V.fit();
  };
  const sync = () => $$('#ctl .seg').forEach((s) => $$('button', s).forEach((b) => b.setAttribute('aria-pressed', String(st[s.dataset.k] === b.dataset.v))));
  $('#ctl').addEventListener('click', (e) => {
    const b = e.target.closest('.seg button'); if (!b) return;
    const k = b.closest('.seg').dataset.k;
    if (st[k] === b.dataset.v) return;
    st[k] = b.dataset.v; sync();
    if (k === 'c') apply(); else { save(); lz.redraw(); }
  });

  // окно просмотра: десктоп и мобильный рядом, структура письма со ссылками в каталог
  const nm = (c) => { const it = M.find(c); return it ? it.nm : c; };
  const view = (L) => ({
    title: L.name, theme: { dk: 'd', inv: 'i' }[theme(L)] || 'l',
    kicker: `<span class="pill">${L.cat}</span><span>${blocksWord(L.blocks.length)}</span>`,
    html: L.html,
    meta: () => `<div><h3>В чем решение</h3><p>${esc(L.note)}</p>${L.src ? `<h3 style="margin-top:16px">По письму</h3><p><a href="${L.src[1]}" target="_blank" rel="noopener">Макет ${esc(L.src[0])} в Figma ↗</a></p>` : ''}${L.refs && L.refs.length ? `<h3 style="margin-top:16px">Прием рынка</h3><ul>${L.refs.map((r) => `<li><a href="${r[1]}" target="_blank" rel="noopener">${esc(r[0])} ↗</a></li>`).join('')}</ul><p><a href="market.html">Разбор на вкладке «Рынок»</a></p>` : ''}</div><div><h3>Из чего собрано</h3><ol>${L.blocks.map((c) => `<li><a href="catalog.html#k-${c}">${esc(nm(c))}</a><code>${c}</code></li>`).join('')}</ol></div>`,
  });
  const openAt = (id) => {
    const vis = LAY.filter((L) => !L.el.hidden);
    const idx = vis.findIndex((L) => L.id === id);
    if (idx === -1) return;
    const list = vis.map(view);
    V.open(list, idx, {
      w: 'b', auto: true,
      onShow: (v) => { const L = vis[list.indexOf(v)]; if (L) history.replaceState(null, '', '#l-' + L.id); },
      onClose: () => history.replaceState(null, '', location.pathname + location.search),
    });
  };
  $('#lay').addEventListener('click', (e) => { const b = e.target.closest('.tile-b'); if (b) openAt(b.dataset.id); });

  sync(); apply(); V.fit();
  const h = location.hash || '';
  if (h.indexOf('#l-') === 0) {
    const el = document.getElementById(h.slice(1));
    if (el) { el.scrollIntoView({ block: 'center' }); openAt(h.slice(3)); }
  }
})();
