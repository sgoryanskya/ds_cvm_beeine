/* Гайд канала CVM B2B Делает: витрины, примеры и контрпримеры, композиция, материалы, скачивание 3D, словарь.
   Все карточки рисуются теми же шаблонами, что и в конструкторе */
(function () {
  'use strict';
  const { TEMPLATES: T, RUBRICS, FORMATS, BG_NAMES, PASTELS, RECIPES, SAMPLES, renderCard, size, md } = window.CVMTpl;
  const I = window.CVMIll;
  const V = window.CVMVoice;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const bgc = (bg) => `bg-${bg}${PASTELS[bg] ? ' pastel' : ''}`;
  const SWC = { yellow: '#FFC800', white: '#FFFFFF', violet: '#6B4EFF' };
  Object.keys(PASTELS).forEach((k) => { SWC[k] = PASTELS[k].hex; });

  // ---------- отрисовка ----------
  const mounts = [];
  const fits = [];
  function mount(host, card, post, i, n) {
    host.classList.add('mount');
    const m = { host, card, post, i, n };
    host._m = m; mounts.push(m); return m;
  }
  function paintOne(m) {
    const w = m.host.clientWidth; if (!w) return;
    const f = size(m.card, m.post); const s = w / f.w;
    m.host.style.height = Math.round(f.h * s) + 'px';
    m.host.innerHTML = `<div class="pv-in" style="width:${f.w}px;height:${f.h}px;transform:scale(${s})">${renderCard(m.card, m.post, m.i, m.n)}</div>`;
  }
  const paint = () => mounts.forEach(paintOne);
  // холст W×H с любой разметкой внутри .cv; bg и html могут быть функциями
  function stage(host, W, H, bg, html) {
    const f = () => {
      const w = host.clientWidth; if (!w) return; const s = w / W;
      const b = typeof bg === 'function' ? bg() : bg;
      host.style.height = Math.round(H * s) + 'px';
      host.innerHTML = `<div class="pv-in" style="width:${W}px;height:${H}px;transform:scale(${s})"><div class="cv ${bgc(b)}" style="width:${W}px;height:${H}px">${typeof html === 'function' ? html() : html}</div></div>`;
    };
    fits.push(f); return f;
  }
  const center = (html) => `<div class="abs" style="inset:0;display:flex;align-items:center;justify-content:center;z-index:3">${html}</div>`;
  const tileBox = (id, s) => `<div class="cv bg-white" style="width:${s}px;height:${s}px;background:transparent;overflow:visible;display:flex;align-items:center;justify-content:center">${I.tile(id, { size: s - 6, tint: 'violet', rot: 0 })}</div>`;
  function copy(text, btn) {
    const done = () => { const o = btn.textContent; btn.textContent = 'Скопировано'; setTimeout(() => { btn.textContent = o; }, 1400); };
    const fallback = () => { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { /* выделите вручную */ } ta.remove(); };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  }

  // ---------- эталонный пост и лента ----------
  const P3 = SAMPLES.post3;
  P3.cards.forEach((c, i) => { const d = document.createElement('div'); $('#hero-album').appendChild(d); mount(d, c, P3, i, P3.cards.length); });
  const linkify = (t) => esc(t).replace(/\[ссылка на бота\]/g, '<span class="lnk">ссылка на бота</span>');
  $('#feed-text').innerHTML = linkify(P3.text);
  mount($('#feed-ava'), { t: 'avatar', d: T.avatar.sample }, { format: '11' }, 0, 1);
  P3.cards.forEach((c, i) => { const d = document.createElement('div'); $('#feed-album').appendChild(d); mount(d, c, P3, i, P3.cards.length); });
  $('#ptext-old').textContent = V.POST3_PUBLISHED;

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

  // ---------- 03 ключевые сообщения ----------
  const MSG = [
    { g: 'target', name: 'Точная аудитория', rub: ['features', 'know'], say: 'Подбираем, кому предлагать, по данным профиля клиента', show: 'Атрибут профиля, сценарий «если, тогда», размер аудитории с периодом', hl: 'Добавили атрибут «Пользуется Облачной АТС»', no: '«знаем о клиентах все»: звучит как слежка' },
    { g: 'aichat', name: 'Умный диалог', rub: ['cases'], say: 'ИИ-агент ведет разговор как сильный менеджер: слышит, не спорит, предлагает решение', show: 'Реплики дословно, одна фраза в линзе, шаги 1, 2, 3', hl: 'Проблему со связью сделал аргументом', no: '«бот заменит менеджеров»: агент передает клиента специалисту' },
    { g: 'chart', name: 'Честный результат', rub: ['cases', 'features'], say: 'Показываем цифры с периодом и то, что пришлось поменять', show: 'Цифра-герой, было и стало, итог по шагам', hl: '37 секунд от отказа до согласия', no: '«конверсия выросла в разы» без периода и базы' },
    { g: 'shield', name: 'Бережно к клиенту', rub: ['know'], say: 'Контактная политика защищает клиента от лишних сообщений, а рассылку от жалоб', show: 'Проверки перед отправкой по шагам, термин простыми словами', hl: 'Почему клиенту не пришла рассылка?', no: '«система заблокировала рассылку»: звучит как поломка' },
    { g: 'message', name: 'Просто начать', rub: ['team'], extra: 'финал каждого поста', say: 'Пишите в бота CVM: разберем задачу и предложим сценарий', show: 'Последняя карточка с кнопкой, лицо человека из команды', hl: 'Хотите так же для своего продукта?', no: '«по вопросам обращаться к ответственным сотрудникам»' },
  ];
  $('#msgs').innerHTML = MSG.map((m, i) => `<div class="mrow"><div><div class="mi">${tileBox(m.g, 58)}</div><div style="min-width:0"><small>Опора ${i + 1}</small><h3>${esc(m.name)}</h3>
<div class="pills">${m.rub.map((r) => `<span class="pill y">${RUBRICS[r].emoji} ${esc(RUBRICS[r].label)}</span>`).join('')}${m.extra ? `<span class="pill">${esc(m.extra)}</span>` : ''}</div></div></div>
<div><small>Говорим</small><p>${esc(m.say)}</p></div>
<div><small>Показываем в карточках</small><p>${esc(m.show)}</p></div>
<div><small>Так звучит заголовок</small><p class="hl">${esc(m.hl)}</p><p class="nope">${esc(m.no)}</p></div></div>`).join('');

  // ---------- 04 принципы: так и не так ----------
  const PW = 800, PH = 540;
  const bub = (side, mat, text, fs) => `<div class="msg ${side}" style="max-width:640px"><div class="bub ${mat}" style="font-size:${fs || 32}px">${md(text)}</div></div>`;
  const pad = (html, st) => `<div class="abs" style="inset:0;z-index:3;padding:52px 52px 48px;display:flex;flex-direction:column;${st || ''}">${html}</div>`;
  const factB = (v, cap) => `<div class="lg" style="display:inline-flex;align-items:center;gap:20px;padding:20px 36px 22px 20px;border-radius:38px"><span class="orb" style="width:60px;height:60px"></span><div><div style="font-size:58px;font-weight:700;letter-spacing:-.035em;line-height:1;white-space:nowrap">${v}</div><div style="font-size:26px;font-weight:500;color:var(--sub);margin-top:6px">${cap}</div></div></div>`;
  const p1 = (t) => pad(`<div class="top"><span class="num vio">2</span><span class="eb">Диалог, часть 2 из 3</span></div>
<h2 class="h" style="font-size:70px;margin-top:20px">${t}</h2>
<div class="chat" style="margin-top:36px">${bub('c', 'lg', 'Поэтому, [[все предложения от Билайн не актуальны]]', 30)}</div>`);
  const p2 = (t) => pad(`<div class="chat" style="gap:14px"><div class="lbl" style="font-size:24px;align-self:flex-end">ИИ-агент</div>${bub('a', 'gold', t, 34)}</div>`, 'justify-content:center');
  const p3 = (cm, am) => pad(`<div class="chat" style="gap:14px"><div class="lbl" style="font-size:24px">Клиент</div>${bub('c', cm, 'Все предложения не актуальны', 32)}
<div class="lbl" style="font-size:24px;align-self:flex-end;margin-top:18px">ИИ-агент</div>${bub('a', am, 'Понимаю. Предложу решение, которое работает через Wi-Fi', 32)}</div>`, 'justify-content:center');
  const p4y = (bg) => `${I.route({ w: 800, h: 540, sw: 12, r: 64, color: bg === 'violet' ? 'white' : 'violet', pts: [[860, 120], [380, 120], [380, 430], [860, 430]] })}${I.badge('signal', { x: 325, y: 65, size: 110, struck: true })}${I.tile('wifi', { x: 280, y: 180, size: 200, tint: 'violet', rot: -6 })}${I.orbIcon('phone', { x: 560, y: 370, size: 120 })}`;
  const p4n = () => `${I.tile('rocket', { x: 70, y: 60, size: 150, tint: 'pearl', rot: 14 })}${I.tile('gift', { x: 580, y: 40, size: 130, tint: 'violet', rot: -12 })}${I.orbIcon('bolt', { x: 340, y: 250, size: 110, color: 'violet' })}${I.tile('megaphone', { x: 500, y: 300, size: 190, tint: 'violet', rot: 22 })}${I.badge('ruble', { x: 130, y: 340, size: 110 })}${I.orbIcon('spark', { x: 300, y: 60, size: 90 })}`;
  const p5 = (name, v, cap) => pad(`<div class="chat" style="gap:28px">${bub('a', 'gold', `Понял, ${name}. Тогда сделаем просто, передам задачу специалисту`, 30)}<div>${factB(v, cap)}</div></div>`, 'justify-content:center');
  const stepChip = (n, t) => `<div class="lg" style="display:flex;align-items:center;gap:16px;padding:16px 22px 16px 16px;border-radius:34px;font-size:29px;font-weight:700;line-height:1.12">${n ? `<span class="num vio" style="width:54px;height:54px;font-size:26px;flex:none">${n}</span>` : '<span style="width:54px;height:54px;border-radius:50%;background:#ECE9F4;flex:none"></span>'}${t}</div>`;
  const p6 = (steps, sum, nums) => pad(`<div style="display:flex;gap:28px">
<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:12px"><div class="lbl" style="font-size:24px">Карточки диалога</div>${steps.map((t, i) => stepChip(nums ? i + 1 : 0, t)).join('')}</div>
<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:12px"><div class="lbl" style="font-size:24px">Итог</div><div class="gold" style="border-radius:38px;padding:28px 26px;display:flex;flex-direction:column;gap:22px">${sum.map((t, i) => `<div style="display:flex;gap:14px;align-items:center;font-size:29px;font-weight:600;line-height:1.15">${nums ? `<span class="num vio" style="width:50px;height:50px;font-size:24px;flex:none">${i + 1}</span>` : '<span class="orb" style="width:26px;height:26px;flex:none"></span>'}${t}</div>`).join('')}</div></div></div>`, 'justify-content:center');
  const PRIN = [
    { t: 'Суть за три секунды', rule: 'Заголовок карточки это вывод, а не тема', why: 'Коллега листает ленту на ходу. Если заголовок пересказывает тему, карточку пролистают',
      y: ['white', () => p1('Проблему со связью<br>сделал аргументом'), 'Читатель понял прием, даже не читая реплики'],
      n: ['white', () => p1('Диалог<br>с клиентом'), 'Тема ничего не обещает, карточку пролистают'] },
    { t: 'Один акцент на карточку', rule: 'Одна цифра, один продукт или одна фраза в линзе', why: 'Глаз находит главное за долю секунды, только если главное одно',
      y: ['white', () => p2('Компании часто используют [[Облачную АТС, она работает и через Wi-Fi]], чтобы не терять звонки клиентов'), 'Глаз сразу находит главное'],
      n: ['white', () => p2('[[Компании]] часто используют [[Облачную АТС]], она [[работает и через Wi-Fi]], чтобы [[не терять звонки]] клиентов'), 'Когда выделено все, не выделено ничего'] },
    { t: 'Цвет это роль', rule: 'Желтый говорит голосом агента и продукта, белая плашка это клиент и факты, фиолетовый это маршрут и разметка команды', why: 'По цвету видно, кто говорит, поэтому серия читается без подписей',
      y: ['white', () => p3('lg', 'gold'), 'Клиент на плашке, агент на желтом'],
      n: ['white', () => p3('gold', 'lg'), 'Цвета поменялись местами: читатель путает клиента и агента'] },
    { t: 'Сцена рассказывает сюжет', rule: 'Иллюстрация это проблема, решение и результат, а не украшение', why: 'Три объекта по диагонали пересказывают кейс без слов',
      y: ['yellow', p4y, 'Связь пропала, Облачная АТС через Wi-Fi, звонок специалиста'],
      n: ['yellow', p4n, 'Набор знаков без сюжета: декор, который ничего не объясняет'] },
    { t: 'Честные данные', rule: 'Имена клиентов скрыты, цифры с периодом и проверены у автора', why: 'Одна открытая фамилия или непроверенная цифра стоит доверия ко всему каналу',
      y: ['white', () => p5('{{Екатерина}}', '37 секунд', 'от отказа до согласия'), 'Имя размыто, у цифры есть контекст'],
      n: ['white', () => p5('Екатерина', 'в 3 раза', 'быстрее'), 'Имя клиента видно, «в 3 раза» непонятно от чего'] },
    { t: 'Метод виден в серии', rule: 'Шаги 1, 2, 3 на карточках диалога совпадают с пунктами итога', why: 'Читатель уносит прием, который можно повторить у себя',
      y: ['white', () => p6(['Разобрался в проблеме', 'Сделал аргументом', 'Довел до звонка'], ['Слышит причину', 'Делает ее аргументом', 'Доводит до звонка'], true), 'Итог повторяет шаги диалога'],
      n: ['white', () => p6(['Диалог', 'Диалог', 'Диалог'], ['Быстро', 'Удобно', 'Выгодно'], false), 'Итог не связан с диалогом, метод потерялся'] },
  ];
  $('#prins').innerHTML = PRIN.map((p, i) => `<div class="prin"><div class="pt"><span class="n-dot">${i + 1}</span><h3>${esc(p.t)}</h3><p class="rule">${esc(p.rule)}</p><p>${esc(p.why)}</p></div>
<div class="exm yes"><div class="yn y">Так</div><div class="stage" data-ex="${i}y"></div><p>${esc(p.y[2])}</p></div>
<div class="exm no"><div class="yn n">Не так</div><div class="stage" data-ex="${i}n"></div><p>${esc(p.n[2])}</p></div></div>`).join('');
  PRIN.forEach((p, i) => { stage($(`[data-ex="${i}y"]`), PW, PH, p.y[0], p.y[1]); stage($(`[data-ex="${i}n"]`), PW, PH, p.n[0], p.n[1]); });

  // ---------- 05 рубрики ----------
  $('#rubs').innerHTML = Object.values(RUBRICS).map((r) => `<div class="panel rub"><div class="top"><div class="ic">${tileBox(r.glyph, 54)}</div><div><h3>${esc(r.label)}</h3><div class="small muted">${r.emoji} ${esc(r.tag)} · ${esc(r.day)}</div></div></div>
${RECIPES[r.id].map((rc, k) => `<div style="margin-top:18px"><b style="font-size:15px">${esc(rc.name)}</b><div class="small muted">${esc(rc.why)}</div><div class="strip" data-rub="${r.id}" data-k="${k}"></div></div>`).join('')}</div>`).join('');
  $$('[data-rub]').forEach((el) => {
    const r = el.dataset.rub, rc = RECIPES[r][+el.dataset.k];
    const post = r === 'cases' && +el.dataset.k === 0 ? SAMPLES.post3 : { rubric: r, format: rc.cards[0] === 'video-cover' ? '169' : '45', cards: rc.cards.map((t) => ({ t, d: T[t].sample })) };
    if (post.cards.length === 1) { el.classList.add('one'); if (post.format === '169') el.classList.add('wide'); }
    post.cards.forEach((c, i) => { const d = document.createElement('div'); el.appendChild(d); mount(d, c, post, i, post.cards.length); });
  });

  // ---------- 06 цвет и пастель ----------
  const SW = [
    ['#FFC800', 'Желтый билайн', '#FFC800', 'Фон обложки и итога'],
    ['#FFD23F', 'Желтый агента', '#FFD23F', 'Реплики агента, продукт'],
    ['#F5F4F9', 'Плашка', '#F5F4F9 · на цветном #FFFFFF', 'Реплики клиента, факты, контейнеры'],
    ['#6B4EFF', 'Фиолетовый CVM', '#6B4EFF', 'Маршрут, станции, шаги, кнопка'],
    ['#141414', 'Чернила', '#141414', 'Заголовки и акцентный текст'],
    ['#55555E', 'Текст 2', '#55555E', 'Пояснения под цифрами'],
    ['#7A7A84', 'Служебный', '#7A7A84', 'Надзаголовки и время, только на белом'],
    ['#FFFFFF', 'Белый', '#FFFFFF', 'Фон внутренних карточек'],
  ];
  $('#swatches').innerHTML = SW.map(([bg, n, hex, use]) => `<div><div class="sw" style="background:${bg}"></div><div class="sw-l"><b>${n}</b><code>${hex}</code><div class="muted small">${use}</div></div></div>`).join('');
  $('#pastels').innerHTML = Object.entries(PASTELS).map(([k, p]) => `<div class="pst"><div class="sw cv ${bgc(k)}"></div><div class="sw-l"><b>${esc(p.name)}</b><code>${p.hex}</code><span>${esc(p.use)}</span></div></div>`).join('');
  // короткий пост из трех карточек: пастель уместна только здесь, длинный альбом остается белым
  const pPost = clone(SAMPLES.post3);
  pPost.cards = [pPost.cards[0], pPost.cards[1], pPost.cards[pPost.cards.length - 1]];
  const pMounts = pPost.cards.map((c, i) => { const d = document.createElement('div'); $('#palbum').appendChild(d); return mount(d, c, pPost, i, pPost.cards.length); });
  $('#pseg').innerHTML = ['white'].concat(Object.keys(PASTELS)).map((k) => `<button type="button" data-p="${k}" aria-pressed="false">${esc(BG_NAMES[k])}</button>`).join('');
  function setPastel(k) {
    // фон ставим только там, где шаблон его поддерживает: лимонный не идет под реплики агента
    pPost.cards.forEach((c, i) => { if (i > 0 && i < pPost.cards.length - 1) c.d = Object.assign({}, c.d, { bg: T[c.t].bgs.indexOf(k) >= 0 ? k : 'white' }); });
    $$('#pseg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === k)));
    pMounts.forEach(paintOne);
  }
  $('#pseg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setPastel(b.dataset.p); });
  setPastel('peach');

  // ---------- 07 шрифт ----------
  const SP = [
    ['Обложка', 'Black 900 · 126/119 · −4,2%', '<span style="font-size:clamp(40px,6vw,64px);font-weight:900;letter-spacing:-.042em;line-height:.94">Думал уйти</span>'],
    ['Заголовок карточки', 'Bold 700 · 84/84 · −3,4%', '<span style="font-size:clamp(30px,4.4vw,44px);font-weight:700;letter-spacing:-.034em;line-height:1">Сначала разобрался в проблеме</span>'],
    ['Цифра-герой', 'Bold 700 · 240-300 · −6%', '<span style="font-size:clamp(52px,8vw,96px);font-weight:700;letter-spacing:-.06em;line-height:.8">3</span> <span style="font-size:clamp(22px,3vw,34px);font-weight:700">минуты</span>'],
    ['Подзаголовок', 'Medium 500 · 34/44', '<span style="font-size:20px;font-weight:500">Клиент без мобильного интернета задумался о смене оператора</span>'],
    ['Реплика', 'Regular 400 · 31/46, ключевая фраза Bold в линзе', '<span style="font-size:17px;line-height:1.6">Ограничения иногда <span class="cv" style="display:inline;background:none"><span class="k on-gold" style="font-size:17px">не зависят от конкретного оператора</span></span>, из-за этого интернет может не работать</span>'],
    ['Надзаголовок и служебное', 'Medium 500 · 26 и 19-24 · #7A7A84 на белом, чернила 70% на желтом и пастели', '<span style="font-size:15px;font-weight:500;color:var(--mut)">Диалог, часть 2 из 3 · 12:27</span>'],
  ];
  $('#specs').innerHTML = SP.map(([n, m, s]) => `<div class="spec"><div class="meta"><b>${n}</b>${m}</div><div class="s">${s}</div></div>`).join('');

  // ---------- 08 композиция ----------
  const WF = [
    { name: 'Карусель 4:5', note: 'поля 72, сверху 76', w: 120, ar: '4/5', z: [['m', 6.7, 5.6, 86.6, 89], ['h', 6.7, 5.6, 86.6, 3.4], ['t', 6.7, 13, 64, 20], ['l', 6.7, 36, 48, 6], ['p', 6.7, 50, 44, 28], ['s', 52, 54, 58]] },
    { name: 'Квадрат 1:1', note: 'те же зоны, ниже', w: 150, ar: '1/1', z: [['m', 6.7, 7, 86.6, 86], ['h', 6.7, 7, 86.6, 4.4], ['t', 6.7, 17, 60, 24], ['l', 6.7, 45, 46, 8], ['p', 6.7, 60, 40, 20], ['s', 56, 50, 50]] },
    { name: 'Вертикаль 9:16', note: 'поля 80, сверху 110', w: 84, ar: '9/16', z: [['m', 7.4, 5.7, 85.2, 89], ['h', 7.4, 5.7, 85.2, 3], ['t', 7.4, 12, 85, 17], ['l', 7.4, 32, 75, 6], ['s', 18, 56, 74], ['p', 7.4, 88, 40, 4]] },
    { name: 'Горизонталь 16:9', note: 'поля 120, сверху 96', w: 240, ar: '16/9', z: [['m', 6.25, 8.9, 87.5, 82], ['h', 6.25, 8.9, 87.5, 6], ['t', 6.25, 22, 52, 32], ['l', 6.25, 58, 42, 9], ['p', 6.25, 80, 18, 8], ['s', 62, 26, 30]] },
    { name: 'Шапка 3:1', note: 'важное в левых двух третях', w: 330, ar: '3/1', z: [['m', 4.8, 12.8, 90.4, 74], ['t', 4.8, 13, 44, 30], ['l', 4.8, 47, 50, 11], ['p', 4.8, 66, 50, 13], ['s', 70, 12, 19]] },
  ];
  $('#wfs').innerHTML = WF.map((f) => `<div class="wf-i" style="max-width:100%"><div class="wf" style="width:${f.w}px;max-width:100%;height:auto;aspect-ratio:${f.ar}">${f.z.map(([c, x, y, w, h]) => `<i class="${c}" style="left:${x}%;top:${y}%;width:${w}%;${c === 's' ? 'aspect-ratio:1' : `height:${h}%`}"></i>`).join('')}</div><div><b>${esc(f.name)}</b><span>${esc(f.note)}</span></div></div>`).join('');

  const HEAD = '.in > div:first-child';
  const SCENE = '.ill-tile, .ill-badge, .orb.big';
  const LAYOUTS = [
    { name: 'Обложка', t: 'cover-hero', f: '45', n: 6, m: 6, z: [[1, HEAD], [2, '.h1'], [3, '.lead'], [4, '.cv > .abs .bub, .cv > .abs .chip'], [5, SCENE]],
      a: [[1, 'Шапка', 'Рубрика в плашке слева, название канала справа. Одинаковая на всех обложках'], [2, 'Заголовок-крючок', 'Black 126, до трех строк, перенос по смыслу'], [3, 'Подзаголовок', 'Одна мысль, до 110 знаков, не шире 660 px'], [4, 'Доказательство', 'Реплика, цифра или список. Всегда слева, под текстом'], [5, 'Сцена', 'Правый нижний угол, по диагонали от заголовка. Может уходить за край, на текст не заходит'], [6, 'Поля', '72 px по бокам, 76 сверху, 72 снизу. За полями только фон, маршрут и сцена']] },
    { name: 'Цифра', t: 'cover-number', f: '45', n: 6, m: 6, z: [[1, HEAD], [2, '.in > .eb, .in > div:has(> .num-xl)'], [3, '.in > .h'], [4, '.lead'], [5, SCENE]],
      a: [[1, 'Шапка', 'Как на всех обложках'], [2, 'Цифра-герой', 'Bold 290 с единицей рядом. Над цифрой период или контекст'], [3, 'Заголовок', 'Что эта цифра значит, Bold 84'], [4, 'Подзаголовок', 'Как получили цифру, одна мысль'], [5, 'Сцена', 'Одна плитка со знаком цифры: время, рост, цель'], [6, 'Поля', 'Те же 72 и 76']] },
    { name: 'Диалог', t: 'dialog', f: '45', m: 4, z: [[1, '.top'], [2, '.h'], [3, '.chat']],
      a: [[1, 'Номер шага и надзаголовок', 'Фиолетовый номер совпадает с пунктом итога'], [2, 'Заголовок-вывод', 'Bold 84, до трех строк'], [3, 'Реплики', '2-4 дословно: клиент слева на плашке, агент справа на желтом, одна фраза в линзе'], [4, 'Поля', '72 по бокам, 76 сверху']],
      note: 'Сцены нет: внутренние карточки держатся на тексте, максимум одна плитка' },
    { name: 'Итог', t: 'summary', f: '45', m: 4, z: [[1, '.top'], [2, '.h'], [3, '.in > .grow']],
      a: [[1, 'Надзаголовок', '«Итог» или «Что это дает»'], [2, 'Заголовок', 'Польза для продукта читателя'], [3, 'Бенто', 'Три пункта, цифра-герой, две цифры и призыв. Отступ между блоками 16 px'], [4, 'Поля', 'Как у всех карточек']] },
    { name: 'Квадрат 1:1', t: 'cover-number', f: '11', n: 1, m: 6, z: [[1, HEAD], [2, '.in > .eb, .in > div:has(> .num-xl)'], [3, '.in > .h'], [4, '.lead'], [5, SCENE]],
      a: [[1, 'Шапка', 'Как на всех обложках'], [2, 'Цифра-герой', 'Bold 230'], [3, 'Заголовок', 'Bold 70, не шире 640 px'], [4, 'Подзаголовок', 'Medium 30, до двух строк'], [5, 'Сцена', 'Меньше и ближе к углу'], [6, 'Поля', '72 по бокам, 76 сверху']],
      note: 'Те же зоны, что у карусели, сжатые по высоте' },
    { name: 'Ролик 16:9', t: 'video-cover', f: '169', rub: 'know', m: 6, z: [[1, HEAD], [2, '.h1'], [3, '.lead'], [4, '.in > div:last-child .chip'], [5, '.ill-tile, .cv > .abs.lg']],
      a: [[1, 'Шапка', 'Рубрика и канал, как на обложках'], [2, 'Тема ролика', 'Black 120 слева, не шире 1040 px'], [3, 'Подзаголовок', 'Что зритель узнает'], [4, 'Длительность', 'Чип внизу слева'], [5, 'Сцена и кнопка', 'Плитка и кнопка воспроизведения справа'], [6, 'Поля', '120 по бокам, 96 сверху и снизу']] },
    { name: 'Ролик 9:16', t: 'video-cover', f: '916', rub: 'know', m: 6, z: [[1, HEAD], [2, '.h1'], [3, '.lead'], [4, '.in > div:last-child .chip'], [5, '.ill-tile, .cv > .abs.lg']],
      a: [[1, 'Шапка', 'Рубрика и канал'], [2, 'Тема ролика', 'Black 120, на всю ширину'], [3, 'Подзаголовок', 'Medium 40'], [4, 'Длительность', 'Чип внизу слева'], [5, 'Сцена и кнопка', 'Внизу, под текстом'], [6, 'Поля', '80 по бокам, 110 сверху, 100 снизу: интерфейс плеера не перекрывает текст']] },
    { name: 'Шапка 3:1', t: 'channel-header', f: '31', m: 5, z: [[1, '.h1'], [2, '.lead'], [3, '.in > div:last-child'], [4, SCENE]],
      a: [[1, 'Название', 'Black 96'], [2, 'Обещание канала', 'Одна строка, Medium 30'], [3, 'Рубрики', 'Четыре чипа на плашках'], [4, 'Сцена', 'Справа, в последней трети'], [5, 'Поля', '72 по бокам, 64 сверху и снизу']],
      note: 'Размер шапки в Buzz уточнить: важное держим в левых двух третях' },
  ];
  let lay = 0;
  $('#comp-seg').innerHTML = LAYOUTS.map((l, i) => `<button type="button" data-l="${i}" aria-pressed="${i === 0}">${esc(l.name)}</button>`).join('');
  function drawZones(pv, L, s, W, H) {
    const cv = pv.querySelector('.cv'); const cr = cv.getBoundingClientRect(); const out = [];
    L.z.forEach(([n, sel]) => {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      $$(sel, cv).forEach((el) => { const r = el.getBoundingClientRect(); if (!r.width || !r.height) return; x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); });
      if (x0 > x1) return;
      const P = 12;
      let x = (x0 - cr.left) / s - P, y = (y0 - cr.top) / s - P, w = (x1 - x0) / s + 2 * P, h = (y1 - y0) / s + 2 * P;
      const xr = Math.min(x + w, W - 8), yb = Math.min(y + h, H - 8); x = Math.max(x, 8); y = Math.max(y, 8); w = xr - x; h = yb - y;
      out.push(`<div class="zone" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><i>${n}</i></div>`);
    });
    const inn = cv.querySelector('.in');
    if (inn && L.m) {
      const cs = getComputedStyle(inn);
      out.push(`<div class="zone m" style="left:${parseFloat(cs.paddingLeft)}px;top:${parseFloat(cs.paddingTop)}px;right:${parseFloat(cs.paddingRight)}px;bottom:${parseFloat(cs.paddingBottom)}px"><i>${L.m}</i></div>`);
    }
    pv.insertAdjacentHTML('beforeend', out.join(''));
  }
  function fitComp() {
    const L = LAYOUTS[lay], st = $('#comp');
    const card = { t: L.t, d: T[L.t].sample }, post = { rubric: L.rub || 'cases', format: L.f };
    const f = size(card, post);
    $('#insp').classList.toggle('wide', f.w > f.h);
    const w = st.clientWidth; if (!w) return; const s = w / f.w;
    st.style.height = Math.round(f.h * s) + 'px';
    st.innerHTML = `<div class="pv-in" style="width:${f.w}px;height:${f.h}px;transform:scale(${s})">${renderCard(card, post, 0, L.n || 1)}</div>`;
    if ($('#comp-t').checked) drawZones(st.firstElementChild, L, s, f.w, f.h);
    $('#comp-anno').innerHTML = L.a.map(([n, t, x]) => `<div><i>${n}</i><span><b>${esc(t)}.</b> ${esc(x)}</span></div>`).join('') + (L.note ? `<div class="lead-n">${esc(L.note)}</div>` : '');
  }
  $('#comp-seg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; lay = +b.dataset.l; $$('#comp-seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); fitComp(); });
  $('#comp-t').addEventListener('change', fitComp);
  fits.push(fitComp);

  // ---------- 09 материалы и маршрут ----------
  let mbg = 'white';
  const MBG = { yellow: 'Желтый', white: 'Белый', violet: 'Фиолетовый', mint: 'Пастель' };
  const lc = () => (mbg === 'white' ? 'violet' : 'white');
  const la = () => ({ white: .55, yellow: .6, violet: .22, mint: .85 })[mbg];
  const MAT = [
    ['Плашка', 'Клиент, факты, контейнеры. Плоская, одна мягкая тень', () => '<div class="lg" style="width:600px;height:260px;border-radius:60px;display:flex;align-items:center;justify-content:center;font-size:54px;font-weight:700">Клиент и факт</div>'],
    ['Желтая реплика', 'Голос агента и продукт', () => '<div class="gold" style="width:600px;height:260px;border-radius:60px;display:flex;align-items:center;justify-content:center;font-size:54px;font-weight:700">Облачная АТС</div>'],
    ['Фиолетовая метка', 'Разметка команды: шаги и кнопка', () => '<div style="display:flex;gap:30px;align-items:center"><span class="num vio" style="width:130px;height:130px;font-size:60px">2</span><span class="vio btn" style="height:130px;font-size:48px;padding:0 64px;border-radius:65px">Пишите нам</span></div>'],
    ['Кружки', 'Желтый для действия, фиолетовый для отметок, кольцо как станция', () => `<div style="display:flex;gap:40px;align-items:center">${I.orbIcon('phone', { size: 200 })}${I.orbIcon('check', { size: 150, color: 'violet' })}<span class="orb" style="width:110px;height:110px;box-shadow:inset 0 0 0 18px ${mbg === 'violet' ? '#fff' : '#6B4EFF'}"></span></div>`],
    ['Линза', 'Одна ключевая фраза в реплике', () => '<div style="display:flex;flex-direction:column;gap:28px;width:720px"><div class="lg" style="align-self:flex-start;border-radius:44px;border-top-left-radius:14px;padding:26px 38px;font-size:42px;line-height:1.45;color:var(--sub)">Все предложения <span class="k">не актуальны</span></div><div class="gold" style="align-self:flex-end;border-radius:44px;border-top-right-radius:14px;padding:26px 38px;font-size:42px;line-height:1.45;color:rgba(20,20,20,.72)">Удобно <span class="k">сегодня или завтра?</span></div></div>'],
    ['Размытие данных', 'Имена и номера клиентов: {{ }}', () => '<div class="gold" style="width:700px;border-radius:50px;padding:42px 50px;font-size:44px;line-height:1.5;color:rgba(20,20,20,.72)">Понял, <span class="pd">Екатерина</span>. Наберем вас по номеру <span class="pd">+7 903 000-00-00</span></div>'],
    ['Чип рубрики и метка', 'Рубрика на обложке, метка релиза', () => '<div style="display:flex;flex-direction:column;gap:44px;align-items:flex-start"><span class="chip lg" style="height:96px;font-size:42px;padding:0 44px 0 18px;border-radius:48px"><span class="orb" style="width:60px;height:60px"></span>Реальные кейсы</span><span class="tag gold" style="height:84px;font-size:40px;padding:0 38px;border-radius:42px">Релиз CVM BOX</span></div>'],
    ['Плитки', 'Главная, второстепенная и прозрачная для фиолетового фона', () => `<div style="display:flex;gap:44px;align-items:center">${I.tile('rocket', { size: 250, tint: 'violet', rot: -6 })}${I.tile('idcard', { size: 200, tint: 'pearl', rot: 6 })}${I.tile('target', { size: 170, tint: 'clear', rot: -4 })}</div>`],
    ['Бейдж проблемы', 'Контекст или проблема, можно перечеркнуть', () => `<div style="display:flex;gap:60px;align-items:center">${I.badge('signal', { size: 190, struck: true })}${I.badge('mail', { size: 160 })}</div>`],
    ['Фото в рамке', 'Лицо из команды в белой рамке', () => `<div class="lg" style="width:300px;height:350px;border-radius:60px;padding:14px"><div class="photo" style="width:100%;height:100%;border-radius:48px;display:flex;align-items:flex-end;justify-content:center;background:linear-gradient(160deg,#FFFFFF,#E7E1FF)">${I.ink('user', 236, 'rgba(91,63,240,.28)', { sw: 1.4 })}</div></div>`],
    ['Маршрут', 'Фирменная линия: ведет от проблемы к результату', () => `<div style="position:relative;width:800px;height:445px">${I.route({ w: 800, h: 445, sw: 14, r: 70, color: mbg === 'violet' ? 'white' : 'violet', pts: [[-40, 130], [430, 130], [430, 320], [840, 320]], stops: [{ at: [190, 130] }, { at: [640, 320], type: 'end' }] })}</div>`],
    ['Тень', 'Одна мягкая тень вниз, без свечений и бликов', () => `<div style="display:flex;gap:56px;align-items:center">${I.tile('bulb', { size: 220, tint: mbg === 'violet' ? 'clear' : 'violet', rot: -6 })}<div class="lg" style="width:300px;height:200px;border-radius:44px"></div></div>`],
  ];
  $('#mat-seg').innerHTML = Object.entries(MBG).map(([k, n]) => `<button type="button" data-b="${k}" aria-pressed="${k === mbg}">${n}</button>`).join('');
  $('#mats').innerHTML = MAT.map((m, i) => `<div class="mat"><div class="stage" id="mat${i}"></div><div class="cap"><b>${m[0]}</b><span>${m[1]}</span></div></div>`).join('');
  const matFits = MAT.map((m, i) => stage(document.getElementById('mat' + i), 800, 445, () => mbg, () => center(m[2]())));
  $('#mat-seg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; mbg = b.dataset.b; $$('#mat-seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); matFits.forEach((f) => f()); });

  // глубина и маршрут: вместо свечений одна тень и линия, которая ведет взгляд
  const LIGHTS = [
    { t: 'Маршрут ведет взгляд', p: 'Линия входит из-за кадра и проходит через главный объект', bg: 'white', code: 'route({ pts, stops })',
      h: () => `${I.route({ w: 1080, h: 700, pts: [[1140, 150], [560, 150], [560, 560], [1140, 560]], stops: [{ at: [900, 150] }] })}${I.tile('target', { x: 420, y: 215, size: 280, tint: 'violet', rot: -6 })}${I.orbIcon('check', { x: 840, y: 500, size: 120 })}` },
    { t: 'На желтом линия фиолетовая', p: 'Самый сильный контраст палитры, плашки белые', bg: 'yellow', code: "route({ color: 'violet' })",
      h: () => `${I.route({ w: 1080, h: 700, pts: [[-40, 520], [600, 520], [600, 160], [1140, 160]], stops: [{ at: [260, 520] }] })}${I.tile('chart', { x: 460, y: 200, size: 280, tint: 'violet', rot: 6 })}<div class="lg abs" style="left:96px;top:120px;width:330px;height:150px;border-radius:40px;z-index:2;padding:30px 36px"><div class="lbl" style="font-size:24px">Конверсия</div><div style="font-size:60px;font-weight:700;letter-spacing:-.04em;line-height:1;margin-top:8px">+12%</div></div>` },
    { t: 'На фиолетовом линия белая', p: 'Плашки полупрозрачные, плитка прозрачная, без теней', bg: 'violet', code: "route({ color: 'white' })",
      h: () => `${I.route({ w: 1080, h: 700, color: 'white', pts: [[1140, 140], [540, 140], [540, 560], [1140, 560]] })}${I.tile('question', { x: 400, y: 210, size: 280, tint: 'clear', rot: -6 })}${I.orbIcon('shield', { x: 820, y: 500, size: 120 })}` },
    { t: 'На пастели тень в тон', p: 'Плашка белая, тень берет оттенок фона', bg: 'mint', code: 'тень rgba(--tint)',
      h: () => `<div class="lg abs" style="left:130px;top:220px;width:580px;height:280px;border-radius:52px;z-index:2;padding:44px 48px"><div class="lbl" style="font-size:28px">Согласились</div><div style="font-size:96px;font-weight:700;letter-spacing:-.045em;line-height:1;margin-top:16px">12 из 100</div></div>${I.tile('check', { x: 650, y: 130, size: 230, tint: 'violet', rot: 8, z: 4 })}` },
    { t: 'Номера на одной линии', p: 'Шаги стоят станциями маршрута, связь видна без стрелок', bg: 'white', code: 'шаблон «Шаги и список»',
      h: () => `<div class="abs" style="left:150px;top:110px;width:780px;z-index:3;display:flex;flex-direction:column;gap:22px">${['Согласие клиента', 'Лимит касаний', 'Пересечения кампаний'].map((t, i) => `<div style="display:flex;gap:26px;align-items:center;position:relative">${i < 2 ? '<span style="position:absolute;left:31px;top:50%;width:14px;height:calc(100% + 22px);background:#6B4EFF"></span>' : ''}<span class="num vio" style="position:relative;width:76px;height:76px;font-size:36px">${i + 1}</span><div class="lg" style="flex:1;border-radius:40px;padding:34px 40px;font-size:42px;font-weight:700">${t}</div></div>`).join('')}</div>` },
    { t: 'Не так: свечения и шум', p: 'Пятна света и полутон спорят с текстом и делают карточку мутной', bg: 'white', no: true, code: 'glow() и полутон',
      h: () => `${I.glow(380, 300, 380, 'violet', .75)}${I.glow(840, 540, 260, 'yellow', .65)}${I.glow(920, 140, 200, 'violet', .55)}<div class="abs" style="left:80px;top:190px;z-index:3;width:660px"><div class="h" style="font-size:76px">Свет под заголовком</div><div class="txt" style="margin-top:20px;font-size:34px;color:var(--mut)">Мелкий текст на пятне света читается хуже</div></div>` },
  ];
  $('#lights').innerHTML = LIGHTS.map((l, i) => `<div class="${l.no ? 'no' : ''}">${l.no ? '<div class="yn n">Не так</div>' : ''}<div class="stage" id="lt${i}"></div><b>${esc(l.t)}</b><p>${esc(l.p)}</p><code>${esc(l.code)}</code></div>`).join('');
  LIGHTS.forEach((l, i) => stage(document.getElementById('lt' + i), 1080, 700, l.bg, l.h));

  // ---------- 10 сцена и 3D ----------
  const lab = (x, y, t) => `<span class="chip lg abs" style="left:${x}px;top:${y}px;height:64px;font-size:30px;padding:0 28px 0 12px;border-radius:32px;z-index:8"><span class="orb" style="width:40px;height:40px"></span>${t}</span>`;
  stage($('#scene'), 1080, 760, 'yellow', () => `${I.route({ w: 1080, h: 760, pts: [[1140, 150], [560, 150], [560, 600], [1140, 600]] })}
${I.badge('signal', { x: 495, y: 85, size: 130, struck: true })}${I.tile('wifi', { x: 420, y: 250, size: 280, tint: 'violet', rot: -6 })}${I.orbIcon('phone', { x: 790, y: 530, size: 140 })}
${lab(60, 120, 'Проблема')}${lab(60, 360, 'Решение')}${lab(800, 440, 'Результат')}`);

  const STY = {
    'tile-violet': { n: 'Фиолетовая плитка', bg: 'none', r: (id, S) => I.tile(id, { size: S * .6, tint: 'violet', rot: 0 }) },
    'tile-pearl': { n: 'Жемчужная плитка', bg: 'none', r: (id, S) => I.tile(id, { size: S * .6, tint: 'pearl', rot: 0 }) },
    'tile-clear': { n: 'Прозрачная плитка для фиолетового фона', bg: 'violet', r: (id, S) => I.tile(id, { size: S * .6, tint: 'clear', rot: 0 }) },
    'orb-gold': { n: 'Желтый кружок', bg: 'none', r: (id, S) => I.orbIcon(id, { size: S * .56, color: 'gold' }) },
    'orb-violet': { n: 'Фиолетовый кружок', bg: 'none', r: (id, S) => I.orbIcon(id, { size: S * .56, color: 'violet' }) },
    badge: { n: 'Бейдж проблемы', bg: 'white', r: (id, S) => I.badge(id, { size: S * .56 }) },
    gold: { n: 'Объемный знак без подложки', bg: 'none', r: (id, S) => I.gold(id, S * .64) },
  };
  const DBG = { none: 'Прозрачный', yellow: 'Желтый', white: 'Белый', violet: 'Фиолетовый' };
  const dl = { style: 'tile-violet', size: 1024, bg: 'none' };
  const node = (id, S) => `<div class="cv${dl.bg !== 'none' ? ' ' + bgc(dl.bg) : ''}" style="width:${S}px;height:${S}px;${dl.bg === 'none' ? 'background:transparent;' : ''}display:flex;align-items:center;justify-content:center">${STY[dl.style].r(id, S)}</div>`;
  $('#dl-style').innerHTML = Object.entries(STY).map(([k, s]) => `<option value="${k}">${esc(s.n)}</option>`).join('');
  const segBtns = (el, items, cur, key) => { el.innerHTML = items.map(([v, n]) => `<button type="button" data-${key}="${v}" aria-pressed="${String(v) === String(cur)}">${n}</button>`).join(''); };
  const drawDlSeg = () => { segBtns($('#dl-size'), [[512, '512 px'], [1024, '1024 px']], dl.size, 'v'); segBtns($('#dl-bg'), Object.entries(DBG), dl.bg, 'v'); };
  $('#glyphs').innerHTML = Object.entries(I.GLYPHS).map(([id, g]) => `<button type="button" class="glyph" data-id="${id}" title="Скачать PNG: ${esc(g.name)}"><div class="t" data-g="${id}"></div><b>${esc(g.name)}</b><code>${id}</code><em>↓ PNG</em></button>`).join('');
  function drawGlyphs() {
    $$('#glyphs .t').forEach((el) => {
      const w = el.clientWidth || 92, s = w / 300;
      el.style.background = dl.bg === 'none' ? 'repeating-conic-gradient(#F1EFF7 0 25%,#FFFFFF 0 50%) 0 0/14px 14px' : '';
      el.innerHTML = `<div class="pv-in" style="width:300px;height:300px;transform:scale(${s})">${node(el.dataset.g, 300)}</div>`;
    });
  }
  fits.push(drawGlyphs);
  drawDlSeg();
  const status = (t) => { $('#dl-st').textContent = t; };
  $('#dl-style').addEventListener('change', (e) => { dl.style = e.target.value; dl.bg = STY[dl.style].bg; drawDlSeg(); drawGlyphs(); });
  $('#dl').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    if (b.parentNode.id === 'dl-size') dl.size = +b.dataset.v; else dl.bg = b.dataset.v;
    drawDlSeg(); drawGlyphs();
  });
  const fname = (id) => `cvm-3d_${id}_${dl.style}_${dl.size}.png`;
  function saveBlob(blob, name) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  async function pngOf(id) {
    const S = dl.size;
    const host = document.createElement('div');
    host.style.cssText = `position:fixed;left:${-S - 100}px;top:0;pointer-events:none`;
    host.innerHTML = node(id, S);
    document.body.appendChild(host);
    try {
      const el = host.firstElementChild;
      await Promise.all($$('img', el).map((im) => (im.decode ? im.decode().catch(() => null) : null)));
      return await window.htmlToImage.toBlob(el, { pixelRatio: 1, width: S, height: S, cacheBust: false });
    } finally { host.remove(); }
  }
  const libsOk = () => {
    if (window.htmlToImage && window.JSZip) return true;
    status('Библиотеки выгрузки не загрузились: проверьте доступ к cdnjs.cloudflare.com и обновите страницу');
    return false;
  };
  $('#glyphs').addEventListener('click', async (e) => {
    const b = e.target.closest('.glyph'); if (!b || !libsOk()) return;
    const id = b.dataset.id; status(`Готовлю ${I.GLYPHS[id].name}…`);
    try { saveBlob(await pngOf(id), fname(id)); status(`Скачан ${fname(id)}`); } catch (err) { status('Не получилось: ' + (err && err.message ? err.message : err)); }
  });
  $('#dl-all').addEventListener('click', async (e) => {
    const btn = e.currentTarget; if (!libsOk()) return;
    btn.disabled = true; const ids = Object.keys(I.GLYPHS); const zip = new window.JSZip();
    try {
      for (let i = 0; i < ids.length; i++) { status(`Готовлю ${i + 1} из ${ids.length}: ${I.GLYPHS[ids[i]].name}`); zip.file(fname(ids[i]), await pngOf(ids[i])); }
      saveBlob(await zip.generateAsync({ type: 'blob' }), `cvm-3d_${dl.style}_${dl.size}.zip`);
      status(`Готово: ${ids.length} знаков в архиве`);
    } catch (err) { status('Не получилось: ' + (err && err.message ? err.message : err)); } finally { btn.disabled = false; }
  });

  // ---------- 11 шаблоны ----------
  const GROUPS = ['Все'].concat(Array.from(new Set(Object.values(T).map((t) => t.group))));
  $('#tpl-f').innerHTML = GROUPS.map((g, i) => `<button type="button" data-g="${esc(g)}" aria-pressed="${i === 0}">${esc(g)}</button>`).join('');
  const RL = (ids) => ids.map((r) => `<span class="pill y">${esc(RUBRICS[r].label)}</span>`).join('');
  $('#tpls').innerHTML = Object.entries(T).map(([id, t]) => `<div class="tpl" data-group="${esc(t.group)}"><div data-tpl="${id}"></div>
${t.bgs.length > 1 ? `<div class="dots" role="group" aria-label="Фон карточки">${t.bgs.map((b) => `<button type="button" data-bg="${b}" title="${esc(BG_NAMES[b])}" aria-label="${esc(BG_NAMES[b])}" aria-pressed="${b === t.bg}" style="background:${SWC[b]}"></button>`).join('')}</div>` : ''}
<h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p>
<div class="tags"><span class="pill vi">${esc(t.group)}</span>${t.formats.map((f) => `<span class="pill">${FORMATS[f].w}×${FORMATS[f].h}</span>`).join('')}${RL(t.rubrics)}</div><div class="hint">id: <code>${id}</code></div></div>`).join('');
  $$('[data-tpl]').forEach((el) => { const id = el.dataset.tpl; const t = T[id]; mount(el, { t: id, d: Object.assign({}, t.sample) }, { rubric: t.rubrics[0] || 'cases', format: t.formats[0] }, 1, 2); });
  $('#tpls').addEventListener('click', (e) => {
    const b = e.target.closest('.dots button'); if (!b) return;
    const m = b.closest('.tpl').querySelector('[data-tpl]')._m;
    m.card.d = Object.assign({}, m.card.d, { bg: b.dataset.bg });
    $$('button', b.parentNode).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    paintOne(m);
  });
  $('#tpl-f').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return; const g = b.dataset.g;
    $$('#tpl-f button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('#tpls .tpl').forEach((el) => { el.hidden = g !== 'Все' && el.dataset.group !== g; });
    paint();
  });

  // ---------- 12 форматы ----------
  const byF = {}; Object.entries(T).forEach(([, t]) => t.formats.forEach((f) => (byF[f] = byF[f] || []).push(t.name)));
  $('#fmts').innerHTML = ['45', '11', '916', '169', '31'].map((k) => [k, FORMATS[k]]).map(([k, f]) => `<tr><td><b>${esc(f.name)}</b></td><td>${f.w}×${f.h}</td><td>${f.w * 2}×${f.h * 2}</td><td>${esc(f.use)}</td><td class="small muted">${esc((byF[k] || []).join(', '))}</td></tr>`).join('');

  // ---------- 13 заготовки и проверка ----------
  $('#rtexts').innerHTML = Object.values(RUBRICS).map((r) => `<div class="panel rt" data-rt="${r.id}"><div class="hd"><span class="re">${r.emoji}</span><div style="min-width:0;flex:1"><h3>${esc(r.label)}</h3><div class="small muted">${esc(r.tag)} · ${esc(r.day)}</div></div>
<div class="seg" role="group" aria-label="Вид"><button type="button" data-v="skeleton" aria-pressed="true">Заготовка</button><button type="button" data-v="example" aria-pressed="false">Пример</button></div></div>
<div class="posttext" id="rt-${r.id}"></div><div class="bar2"><span class="small muted" id="rt-n-${r.id}"></span><button class="btn sm" type="button" data-copy="rt-${r.id}">Скопировать</button></div></div>`).join('');
  function showRt(id, v) {
    const t = V.RUBRIC_TEXT[id][v];
    $('#rt-' + id).textContent = t;
    $('#rt-n-' + id).textContent = v === 'example' ? `${t.length} знаков` : 'Замените все в [скобках]';
    $$(`[data-rt="${id}"] .seg button`).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
  }
  Object.keys(RUBRICS).forEach((id) => showRt(id, 'skeleton'));
  $('#rtexts').addEventListener('click', (e) => { const b = e.target.closest('.seg button'); if (b) showRt(b.closest('[data-rt]').dataset.rt, b.dataset.v); });
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-copy]'); if (b) copy(document.getElementById(b.dataset.copy).textContent, b); });
  $('#k-desc-n').textContent = `${$('#k-desc').textContent.length} знаков`;

  $('#lint-rub').innerHTML = Object.values(RUBRICS).map((r) => `<option value="${r.id}">${r.emoji} ${esc(r.label)}</option>`).join('');
  $('#lint-in').value = V.POST3_PUBLISHED;
  function lint() {
    const res = V.lintText($('#lint-in').value, $('#lint-rub').value);
    const bad = res.filter((x) => !x.ok).length;
    $('#lint-out').innerHTML = `<div class="lint-sum">${bad ? `Поправить: ${bad}` : 'Все хорошо, можно публиковать'}</div>`
      + res.map((x) => `<div class="${x.ok ? 'ok' : 'no'}"><span class="st">${x.ok ? '✓' : '!'}</span><span><b>${esc(x.label)}</b>${x.hint && !x.ok ? `<small>${esc(x.hint)}</small>` : ''}</span></div>`).join('');
  }
  $('#lint-in').addEventListener('input', lint); $('#lint-rub').addEventListener('change', lint); lint();

  // ---------- 14 словарь ----------
  const DICT = [
    ['Бренд и продукты', 'билайн, билайн бизнес', 'Билайн, БИЛАЙН, Beeline', 'Как в бренде, даже в начале предложения. В репликах клиента оставляем как написано', 'Клиент билайн бизнес задумался о переходе'],
    ['Бренд и продукты', 'CVM B2B Делает', 'CVM2B-делает, «CVM B2B делает»', 'Название канала: латиница, «Делает» с большой буквы, без кавычек и дефиса', 'Подписывайтесь на CVM B2B Делает'],
    ['Бренд и продукты', 'Облачная АТС', 'ОАТС, облачная атс, виртуальная АТС', 'Название продукта целиком', 'Агент предложил Облачную АТС'],
    ['Бренд и продукты', 'CVM BOX', 'бокс, коробка CVM', 'Название платформы как в релизах', 'Новый атрибут в CVM BOX'],
    ['Бренд и продукты', 'SIM-карта', 'Sim-карта, симка', 'Как в продуктах билайна', 'Интернет пропал на всех SIM-картах'],
    ['Бренд и продукты', 'Wi-Fi', 'вайфай, WiFi, wi-fi', 'Общепринятое написание', 'Облачная АТС работает через Wi-Fi'],
    ['Агент и бот', 'ИИ-агент, агент', 'бот, AI-агент, нейросеть, робот', 'Одно имя во всех постах', 'ИИ-агент предложил решение'],
    ['Агент и бот', 'бот CVM', 'чат-бот, форма, «наш бот»', 'Точка входа для заявок, не путаем с агентом', 'Пишите в бота CVM'],
    ['Агент и бот', 'диалог', 'переписка, чат, коммуникация', 'Агент ведет разговор, а не отправляет сообщения', 'В карточках весь диалог по шагам'],
    ['Агент и бот', 'специалист', 'сейлз, продажник, оператор', 'Человек, которому агент передает клиента', 'Звонок специалиста в тот же день'],
    ['Люди', 'клиент', 'клиентка, абонент, ЛПР, юрлицо', 'Не склоняем по роду, глаголы в мужском роде', 'Клиент согласился на звонок'],
    ['Люди', 'коллеги из продуктов, сегментов и продаж', 'заказчики, бизнес, внутренние клиенты', 'Читатели канала, к ним на «вы»', 'Коллеги приходят к нам с задачей'],
    ['Люди', 'мы, команда CVM', 'отдел CVM, ответственные сотрудники', 'О себе от первого лица', 'Мы добавили атрибут в профиль клиента'],
    ['Работа CVM', 'кампания по продаже …', 'код кампании, КСС_А007', 'Код непонятен вне CVM', 'Кампания по продаже тарифа БизнесПро'],
    ['Работа CVM', 'подбор аудитории', 'таргетинг, сегментация', 'Понятно без курса маркетинга', 'Подберем аудиторию под ваш продукт'],
    ['Работа CVM', 'сообщение, рассылка, звонок', 'коммуникация, касание', 'Конкретное слово вместо общего', 'Клиент получил два сообщения за неделю'],
    ['Работа CVM', 'атрибут в профиле клиента', 'фича, признак, поле витрины', 'Объясняем, что он показывает', 'Атрибут показывает, что у компании есть Облачная АТС'],
    ['Работа CVM', 'контактная политика', 'КП, лимиты коммуникаций', 'При первом упоминании объясняем простыми словами', 'Контактная политика бережет клиента от лишних сообщений'],
    ['Работа CVM', 'согласие на рекламу', 'opt-in, подписка на маркетинг', 'По-русски и точно', 'Есть ли у клиента согласие на рекламу в этом канале'],
    ['Работа CVM', 'допродажа', 'апсейл, кросс-сейл', 'По-русски', 'Агент допродал Облачную АТС'],
    ['Работа CVM', 'удержание, уход клиента', 'ретеншн, отток, churn', 'Понятно всем отделам', 'Агент удержал клиента, который думал уйти'],
    ['Работа CVM', 'запустить', 'раскатить, задеплоить, выкатить', 'Без жаргона разработки', 'Запустили агента на весь сегмент'],
    ['Цифры', 'заявка', 'лид', 'Понятно всем отделам', '12 заявок за неделю'],
    ['Цифры', 'согласились 12 из 100 клиентов', 'конверсия 12%', 'Сначала по-человечески, термин можно в скобках', 'Согласились 12 из 100 клиентов (конверсия 12%)'],
    ['Цифры', 'за октябрь, на 500 клиентах', 'недавно, в пилоте', 'У цифры всегда есть период и база', 'За октябрь агент провел 500 диалогов'],
    ['Цифры', 'в 2 раза больше', 'x2, 2х, в разы', 'Точно и словами', 'Заявок стало в 2 раза больше за месяц'],
    ['Цифры', '1,2 млн ₽', '1.2 млн руб., 1 200 000 рублей', 'Дробь через запятую, рубль знаком через пробел', 'Сумма сделок за квартал 1,2 млн ₽'],
    ['Канцелярит и хайп', 'сделать, запустить', 'осуществить, произвести', 'Глагол действия вместо канцелярского', 'Запустили рассылку'],
    ['Канцелярит и хайп', 'в кампании', 'в рамках кампании', 'Короче и проще', 'В кампании участвовали 500 клиентов'],
    ['Канцелярит и хайп', 'этот, это', 'данный, является', 'Живая речь', 'Этот атрибут помогает подобрать аудиторию'],
    ['Канцелярит и хайп', 'чтобы', 'в целях', 'Живая речь', 'Чтобы клиент не потерял звонки'],
    ['Канцелярит и хайп', 'сейчас', 'на сегодняшний день', 'Короче', 'Сейчас агент работает в трех кампаниях'],
    ['Канцелярит и хайп', 'сразу к делу', 'информируем, сообщаем, доводим до вашего сведения', 'Первая фраза сразу про суть', 'Добавили атрибут «Пользуется Облачной АТС»'],
    ['Канцелярит и хайп', 'цифра с периодом', 'уникальный, революционный, прорыв, синергия, драйвер роста', 'Хайп не убеждает, цифра убеждает', '37 секунд от отказа до согласия'],
  ];
  const CATS = ['Все'].concat(Array.from(new Set(DICT.map((d) => d[0]))));
  let dcat = 'Все';
  $('#dict-f').innerHTML = CATS.map((c) => `<button type="button" data-c="${esc(c)}" aria-pressed="${c === dcat}">${esc(c)}</button>`).join('');
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function drawDict() {
    const q = $('#dict-q').value.trim().toLowerCase();
    const hl = (s) => { const e = esc(s); return q ? e.replace(new RegExp(reEsc(esc(q)), 'gi'), (m) => `<mark>${m}</mark>`) : e; };
    const rows = DICT.filter((d) => (dcat === 'Все' || d[0] === dcat) && (!q || d.slice(1).join(' ').toLowerCase().indexOf(q) >= 0));
    let html = '', last = '';
    rows.forEach((d) => {
      if (d[0] !== last) { html += `<tr class="cat"><td colspan="4">${esc(d[0])}</td></tr>`; last = d[0]; }
      html += `<tr><td>${hl(d[1])}</td><td>${hl(d[2])}</td><td>${hl(d[3])}</td><td>${hl(d[4])}</td></tr>`;
    });
    $('#dict-b').innerHTML = html || '<tr><td colspan="4" class="muted" style="text-decoration:none;font-weight:400">Ничего не нашлось. Если слова нет в словаре, напишите редактору: добавим</td></tr>';
    $('#dict-n').textContent = `${rows.length} из ${DICT.length}`;
    $$('#dict-f button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.c === dcat)));
  }
  $('#dict-q').addEventListener('input', drawDict);
  $('#dict-f').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; dcat = b.dataset.c; drawDict(); });
  document.addEventListener('click', (e) => { const a = e.target.closest('[data-dict-cat]'); if (!a) return; dcat = a.dataset.dictCat; $('#dict-q').value = ''; drawDict(); });
  drawDict();

  // ---------- 15 эмодзи ----------
  $('#remo').innerHTML = Object.values(RUBRICS).map((r) => `<div><div class="pairi"><span class="big">${r.emoji}</span><span class="eq">=</span>${tileBox(r.glyph, 56)}</div><b>${esc(r.label)}</b><code>${r.emoji} ${esc(r.tag)}</code><span class="small muted">${esc(r.day)}</span></div>`).join('');
  $('#emo-grid').innerHTML = V.EMOJI.map((x) => `<div class="emo"><div class="row"><span class="e">${x.e}</span>${x.glyph ? tileBox(x.glyph, 40) : x.color ? `<span class="sw2" style="background:${x.color}"></span>` : ''}</div><b>${esc(x.name)}</b><span>${esc(x.use)}</span>${x.core ? '<span class="pill vi">основной</span>' : ''}</div>`).join('');
  $('#banned').innerHTML = V.BANNED.map((b) => `<tr><td>${b.e.join(' ')}</td><td>${esc(b.why)}</td></tr>`).join('');

  // ---------- 18 чек-лист ----------
  $('#check-reset').addEventListener('click', () => $$('#check input').forEach((i) => { i.checked = false; }));

  // ---------- старт ----------
  const all = () => { paint(); fits.forEach((f) => f()); };
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(all, 150); });
  all();
  document.fonts.ready.then(() => { all(); window.__done = true; });
})();
