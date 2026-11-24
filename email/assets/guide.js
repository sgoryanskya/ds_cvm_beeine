/* Гайд раздела «Письма»: витрины компонентов с вариантами, темой и шириной, примеры писем, оглавление */
(function () {
  'use strict';
  const M = window.CVMMail;
  const P = M.parts;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // ---------- витрина: варианты, тема, ширина ----------
  function seg(k, label, opts) {
    return `<div class="seg" data-k="${k}" role="group" aria-label="${label}">${opts.map((o) => `<button type="button" data-v="${o[0]}">${o[1]}</button>`).join('')}</div>`;
  }
  function demo(host, items) {
    const st = { i: '0', dk: '0', w: '720' };
    host.innerHTML = `<div class="dm-bar">${items.length > 1 ? seg('i', 'Вариант', items.map((it, i) => [String(i), it.label])) : '<span></span>'}<div class="dm-opts">${seg('dk', 'Тема письма', [['0', 'Светлое'], ['1', 'Темное']])}${seg('w', 'Ширина', [['720', '720'], ['360', '360']])}</div></div><div class="dm-stage"><div class="ml"></div></div><p class="dm-note"></p>`;
    const ml = $('.ml', host), note = $('.dm-note', host);
    const render = () => {
      $$('.seg', host).forEach((s) => $$('button', s).forEach((b) => b.setAttribute('aria-pressed', String(st[s.dataset.k] === b.dataset.v))));
      const it = items[+st.i];
      ml.className = 'ml' + (st.dk === '1' ? ' dk' : '');
      ml.style.maxWidth = st.w + 'px';
      ml.innerHTML = it.html();
      note.innerHTML = `<b>${it.label}.</b> ${it.note}`;
    };
    host.addEventListener('click', (e) => {
      const b = e.target.closest('.seg button'); if (!b) return;
      st[b.closest('.seg').dataset.k] = b.dataset.v; render();
    });
    render();
  }
  // первый экран и новые блоки берем из реестра каталога, остальные витрины из blocks.js
  const fromCat = (codes) => codes.map((c) => M.find(c)).filter(Boolean).map((it) => ({ label: it.nm, note: it.note, html: it.html }));
  const SRC = {
    letters: () => M.LETTERS,
    title: () => fromCat(['first.ill', 'first.illdate', 'first.text', 'first.textdate']),
    fresh: () => fromCat(['steps.progress2', 'steps.progress3', 'steps.current', 'steps.stepper', 'fresh.quote']),
  };
  $$('.demo[data-c]').forEach((h) => {
    const c = h.dataset.c;
    demo(h, SRC[c] ? SRC[c]() : M.COMP[c]);
  });

  // ---------- эталонное письмо в шапке, уменьшено ----------
  const mini = $('#hero-mini');
  const mml = document.createElement('div');
  mml.className = 'ml';
  mml.innerHTML = M.LETTERS[0].html();
  mini.insertBefore(mml, mini.firstChild);
  const fitMini = () => { mml.style.transform = `scale(${mini.clientWidth / 720})`; };
  fitMini();
  window.addEventListener('resize', fitMini);

  // ---------- кнопки ----------
  const BS = [
    ['', P.btn('Оставить заявку'), 'Основная', '#FFC800, подпись #000 18/20'],
    ['', P.btn('Подробнее', true), 'Вторичная', '#EBEBEB, только рядом с основной'],
    [' dk', P.btn('Оставить заявку'), 'На темном', 'Цвет не меняется'],
    ['', `<span style="display:block;width:100%;max-width:280px">${P.btn('Оставить заявку').replace('m-btn', 'm-btn full-m" style="width:100%')}</span>`, 'Мобильный', 'Можно растянуть на всю ширину колонки'],
  ];
  $('#btnspec').innerHTML = BS.map((b) => `<div><div class="ml${b[0]}">${b[1]}</div><p><b>${b[2]}</b>${b[3]}</p></div>`).join('');

  // ---------- светлое и темное рядом ----------
  const frag = () => P.body(P.first({ hero: 'femto', h1: 'Связь там, где ее не было', lead: 'Фемтосота усиливает сигнал билайн в помещениях, куда не добивает сеть' }) + P.steps.plates(), true) + P.footer.std();
  $('#dark-ex').innerHTML = `<div><div class="lab">Светлое</div><div class="ml">${frag()}</div></div><div><div class="lab">Темное</div><div class="ml dk">${frag()}</div></div>`;

  // ---------- темная тема почты: желтая заливка против рамки ----------
  const inv = $('#inv-ex');
  if (inv) {
    const one = (c) => P.body(M.get(c), true);
    const pair = (c, t) => `<div><div class="lab">${t}, светлое письмо</div><div class="ml">${one(c)}</div><div class="lab" style="margin-top:12px">Оно же в темной теме почты</div><div class="ml inv">${one(c)}</div></div>`;
    inv.innerHTML = pair('frame.soft', 'Желтая заливка') + pair('frame.line', 'Рамка без заливки');
  }

  // ---------- оглавление ----------
  $('#toc-g2').innerHTML = $('#toc-g').innerHTML;
  const fab = $('#toc-fab'), dlg = $('#toc-dlg');
  fab.addEventListener('click', () => { if (dlg.showModal) dlg.showModal(); else location.hash = '#toc'; });
  $('#toc-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('a')) dlg.close(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { fab.hidden = en.isIntersecting || en.boundingClientRect.top > 0; }).observe($('#toc'));
    const names = {};
    $$('#toc-g a').forEach((a) => { names[a.getAttribute('href').slice(1)] = a.querySelector('b').textContent; });
    const setCur = (id) => {
      $$('.toc-g a').forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + id)));
      $('#toc-cur').textContent = names[id] ? '· ' + names[id] : '';
    };
    const spy = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) setCur(en.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
    $$('main section.sec[id]').forEach((s) => spy.observe(s));
  } else fab.hidden = false;
})();
