/* Страница «Компоненты»: типы блоков плитками, тема (светлое, темное, инверсия почты), ширина, поиск и окно просмотра
   Данные в registry.js (CVMMail.CATALOG), макеты для блока «В макетах» в layouts.js */
(function () {
  'use strict';
  const M = window.CVMMail, V = window.CVMView;
  const CAT = M.CATALOG, ST = M.STATUS, LAY = M.LAYOUTS || [];
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // пометка для блоков с желтой заливкой: в темной теме почта инвертирует письмо, и желтый становится бурым
  const WPILL = '<span class="wn" title="Желтая заливка: в темной теме почты станет бурой">Темная тема</span>';
  const WNOTE = '<div class="vw-warn" role="note"><h3>Внимание: желтая заливка</h3><p>Почта без темной версии письма в темной теме инвертирует цвета. Желтая плашка #FFC800 становится бурой #733C00, светлая #FFF4CE почти черной с коричневым оттенком: блок выглядит грязным, а не акцентным. Рамка «Темная тема почты» справа показывает это примерно. Если без выделения нельзя, берите рамку 2 px #FFC800 без заливки или серую плашку</p></div>';

  const KEY = 'cvm-email-catalog';
  const st = { t: 'l', w: '720', q: '' };
  try { const sv = JSON.parse(localStorage.getItem(KEY) || '{}'); ['t', 'w'].forEach((k) => { if (sv[k]) st[k] = sv[k]; }); } catch (e) { /* хранилище недоступно, работаем по умолчанию */ }
  if (['l', 'd', 'i'].indexOf(st.t) === -1) st.t = 'l';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ t: st.t, w: st.w })); } catch (e) { /* без сохранения */ } };

  const all = [];
  CAT.forEach((g) => g.items.forEach((it) => all.push(it)));
  const used = {};
  LAY.forEach((L) => L.blocks.forEach((c) => { (used[c] = used[c] || []).indexOf(L) === -1 && used[c].push(L); }));

  // счетчики и легенда
  $('#tally').innerHTML = `<span class="pill">Компонентов<b>${M.COUNT.all}</b></span><span class="pill">Типов<b>${M.COUNT.groups}</b></span><span class="pill st-mkt">По рынку<b>${M.COUNT.mkt}</b></span><span class="pill st-new">Новых<b>${M.COUNT.fresh}</b></span><span class="pill wn-p">Желтых заливок<b>${all.filter((it) => it.warn).length}</b></span><span class="pill">Макетов писем<b>${LAY.length}</b></span>`;
  $('#legend').innerHTML = Object.keys(ST).map((k) => `<dt><span class="pill st-${k}">${ST[k][0]}</span></dt><dd>${ST[k][1]}</dd>`).join('');

  // разделы и плитки
  $('#cat').innerHTML = CAT.map((g) => `<section class="cg" id="g-${g.id}" aria-labelledby="gh-${g.id}"><div class="cg-h"><h2 id="gh-${g.id}">${g.name}</h2><span></span></div><p class="cg-d">${esc(g.d)}</p><div class="tiles">${g.items.map((it) => `<article class="tile" id="k-${it.code}"><div class="tile-st" inert aria-hidden="true"></div><div class="tile-m"><button type="button" class="tile-b" data-code="${it.code}">${esc(it.nm)}</button><span class="sp"></span>${it.st === 'new' ? '<span class="nw">Новый</span>' : it.st === 'mkt' ? '<span class="nw mk">Рынок</span>' : ''}${it.warn ? WPILL : ''}<code>${it.code}</code></div></article>`).join('')}</div></section>`).join('');
  all.forEach((it) => { it.el = document.getElementById('k-' + it.code); it.text = (it.nm + ' ' + it.code + ' ' + it.note + ' ' + it.g.name).toLowerCase(); });

  // превью в плитке
  const tcls = (it) => (it.fixed ? '' : st.t === 'd' ? ' dk' : st.t === 'i' ? ' inv' : '');
  const thumb = (it) => `<div class="zm${!it.fixed && st.w === '360' ? ' w360' : ''}"><div class="ml${tcls(it)}">${it.html()}</div></div>`;
  const byEl = new Map(all.map((it) => [$('.tile-st', it.el), it]));
  const lz = V.lazy((el) => { el.innerHTML = thumb(byEl.get(el)); });
  byEl.forEach((_, el) => lz.watch(el));

  // поиск
  const apply = () => {
    const q = st.q.trim().toLowerCase();
    let n = 0;
    CAT.forEach((g) => {
      let k = 0;
      g.items.forEach((it) => { const ok = !q || it.text.indexOf(q) !== -1; it.el.hidden = !ok; if (ok) k++; });
      const sec = document.getElementById('g-' + g.id);
      sec.hidden = k === 0;
      $('.cg-h span', sec).textContent = q ? k + ' из ' + g.items.length : g.items.length + ' вариантов';
      g.vis = k; n += k;
    });
    $('#cats').innerHTML = CAT.map((g) => `<a href="#g-${g.id}"${g.vis ? '' : ' class="off" aria-disabled="true"'}>${g.name}<i>${g.vis}</i></a>`).join('');
    $('#empty').hidden = n > 0;
    V.fit();
  };

  const sync = () => $$('#ctl .seg').forEach((s) => $$('button', s).forEach((b) => b.setAttribute('aria-pressed', String(st[s.dataset.k] === b.dataset.v))));
  $('#ctl').addEventListener('click', (e) => {
    const b = e.target.closest('.seg button'); if (!b) return;
    const k = b.closest('.seg').dataset.k;
    if (st[k] === b.dataset.v) return;
    st[k] = b.dataset.v; save(); sync(); lz.redraw();
  });
  let tq = 0;
  $('#q').addEventListener('input', (e) => { clearTimeout(tq); tq = setTimeout(() => { st.q = e.target.value; apply(); }, 120); });

  // окно просмотра
  const srcList = (it) => (it.src.length ? (it.st === 'mkt' ? '<li><a href="market.html">Разбор на вкладке «Рынок»</a></li>' : '') + it.src.map((x) => `<li><a href="${x[1]}" target="_blank" rel="noopener">${esc(x[0])} ↗</a></li>`).join('') : '<li>Новый блок раздела, в Figma пока не собран</li>');
  const inLay = (it) => (used[it.code] ? `<ul>${used[it.code].map((L) => `<li><a href="layouts.html#l-${L.id}">${esc(L.name)}</a></li>`).join('')}</ul>` : '<p>Пока ни в одном макете</p>');
  const view = (it) => ({
    title: it.nm, fixed: it.fixed, warn: it.warn,
    kicker: `<span class="pill st-${it.st}">${ST[it.st][0]}</span>${it.warn ? WPILL : ''}<span>${esc(it.g.name)}</span><code>${it.code}</code>`,
    html: it.html,
    meta: () => `${it.warn ? WNOTE : ''}<div><h3>Когда брать</h3><p>${esc(it.note)}</p></div><div><h3>Источник</h3><ul>${srcList(it)}</ul></div><div><h3>В макетах</h3>${inLay(it)}</div><div><h3>В коде раздела</h3><p><code>CVMMail.get('${it.code}')</code></p></div>`,
  });
  const openAt = (code) => {
    const vis = all.filter((it) => !it.el.hidden);
    const idx = vis.findIndex((it) => it.code === code);
    if (idx === -1) return;
    const list = vis.map(view);
    V.open(list, idx, {
      t: st.t, w: st.w,
      onShow: (v) => { const it = vis[list.indexOf(v)]; if (it) history.replaceState(null, '', '#k-' + it.code); },
      onClose: () => history.replaceState(null, '', location.pathname + location.search),
    });
  };
  $('#cat').addEventListener('click', (e) => { const b = e.target.closest('.tile-b'); if (b) openAt(b.dataset.code); });

  sync(); apply(); V.fit();
  const h = decodeURIComponent(location.hash || '');
  if (h.indexOf('#k-') === 0) {
    const code = h.slice(3);
    const el = document.getElementById('k-' + code);
    if (el) { el.scrollIntoView({ block: 'center' }); openAt(code); }
  }
})();
