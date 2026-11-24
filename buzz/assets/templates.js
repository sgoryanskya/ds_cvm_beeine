/* Канал CVM в Buzz · шаблоны карточек, рубрики, форматы, примеры постов
   Пост = JSON: { format, rubric, cards:[ { t: 'id шаблона', d: { поля } } ] }.
   Разметка в текстах: [[ключевая фраза]] = линза, {{имя клиента}} = размытие ПД,
   **жирный**, перенос строки = новая строка. Текст реплик клиента и агента не редактируем. */
(function (root) {
  'use strict';
  const I = root.CVMIll;
  const px = (n) => `${Math.round(n)}px`;

  // ---------- справочники ----------
  const BRAND = 'CVM B2B Делает';
  const RUBRICS = {
    cases:    { id: 'cases',    label: 'Реальные кейсы',        tag: '#реальные_кейсы',        emoji: '💬', glyph: 'aichat',  cover: 'cover-hero',     day: 'пятница' },
    know:     { id: 'know',     label: 'А знаете ли вы?',       tag: '#а_знаете_ли_вы',        emoji: '💡', glyph: 'bulb',    cover: 'cover-question', day: 'среда' },
    features: { id: 'features', label: 'Новые фичи',            tag: '#новые_фичи',            emoji: '🚀', glyph: 'rocket',  cover: 'cover-release',  day: 'понедельник' },
    team:     { id: 'team',     label: 'Знакомство с командой', tag: '#знакомство_с_командой', emoji: '👋', glyph: 'users',   cover: 'cover-person',   day: 'раз в две недели' },
  };
  const FORMATS = {
    '45':  { w: 1080, h: 1350, name: 'Карточка 4:5', use: 'карусель и одиночный пост' },
    '11':  { w: 1080, h: 1080, name: 'Квадрат 1:1', use: 'одиночная карточка, аватар' },
    '916': { w: 1080, h: 1920, name: 'Вертикаль 9:16', use: 'обложка вертикального ролика' },
    '169': { w: 1920, h: 1080, name: 'Горизонталь 16:9', use: 'обложка и заставка ролика' },
    '31':  { w: 1500, h: 500,  name: 'Шапка 3:1', use: 'шапка канала, размер уточнить в Buzz' },
  };
  // Пастель: фон внутренних карточек коротких постов (до трех карточек). В альбоме от четырех карточек внутренние белые
  const PASTELS = {
    pink:     { name: 'Розовый',    hex: '#FFE4EE', deep: '#FFD5E4', use: 'Люди и команда: знакомство, роль, цитата' },
    peach:    { name: 'Персиковый', hex: '#FFE6D5', deep: '#FFD8BF', use: 'Клиент и его задача: контекст, возражение' },
    lemon:    { name: 'Лимонный',   hex: '#FFF5CC', deep: '#FFEEAA', use: 'Памятки и правила: шаги, как запустить' },
    mint:     { name: 'Мятный',     hex: '#DDF5E8', deep: '#C9ECDA', use: 'Результат: цифра, было и стало' },
    blue:     { name: 'Голубой',    hex: '#DEEEFF', deep: '#CAE2FF', use: 'Механика и данные: термин, проверки' },
    lavender: { name: 'Лавандовый', hex: '#ECE6FF', deep: '#DDD4FF', use: 'Продукт и фичи: атрибут, сценарий' },
  };
  const PK = Object.keys(PASTELS);
  const BG_NAMES = { yellow: 'Желтый', white: 'Белый', violet: 'Фиолетовый' };
  PK.forEach((k) => { BG_NAMES[k] = PASTELS[k].name; });

  // ---------- текст ----------
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const NB = ' ';
  const SHORT = /(?<![А-Яа-яЁёA-Za-z0-9\-])([А-Яа-яЁёA-Za-z]{1,2}) (?=\S)/g;
  const SKIP = /^(же|ли|бы|ль)$/i;
  function fixText(t) {
    t = t.replace(SHORT, (m, w) => (SKIP.test(w) ? m : w + NB));
    t = t.replace(/(\d) (?=[А-Яа-яЁёA-Za-z%₽])/g, '$1' + NB);
    t = t.replace(/(\d) (?=\d{3}(?!\d))/g, '$1' + NB);
    t = t.replace(/(Облачн[А-Яа-яЁё]*) АТС/g, '$1' + NB + 'АТС');
    t = t.replace(/([А-Яа-яЁёA-Za-z0-9]+(?:-[А-Яа-яЁёA-Za-z0-9]+)+)/g, '<span style="white-space:nowrap">$1</span>');
    return t;
  }
  function ty(html) {
    return html.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, txt) => (tag ? tag : fixText(txt)));
  }
  function widow(h) {
    return h.replace(/([^\s\u00A0<]+) ([^\s<]{1,8})(?=<br>|$)/g, (m, a, b) => (a.length + b.length <= 16 ? a + NB + b : m));
  }
  function md(s) {
    let h = esc(s).trim();
    h = h.replace(/\[\[([\s\S]+?)\]\]/g, '<span class="k">$1</span>')
      .replace(/\{\{([\s\S]+?)\}\}/g, '<span class="pd">$1</span>')
      .replace(/\*\*([\s\S]+?)\*\*/g, '<b>$1</b>')
      .replace(/\r?\n/g, '<br>');
    return ty(widow(h));
  }
  const plain = (s) => String(s || '').replace(/\[\[|\]\]|\{\{|\}\}|\*\*/g, '');

  // ---------- общие куски ----------
  function head(ctx) {
    return `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:-14px">
<span class="chip lg" style="height:56px;font-size:25px;padding:0 24px 0 11px"><span class="orb"></span>${esc(ctx.rubric.label)}</span>
<span class="brand">${BRAND}</span></div>`;
  }
  function swipe(ctx, extra) {
    if (!(ctx.total > 1 && ctx.idx === 0)) return '';
    return `<div class="abs swipe" style="left:72px;bottom:60px;z-index:6;${extra || ''}">Листайте
<svg width="34" height="20" viewBox="0 0 34 20"><path d="M2 10h28M22 2l8 8-8 8" fill="none" stroke="#141414" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
  }
  function top(d) {
    const n = d.step ? `<span class="num vio">${esc(d.step)}</span>` : '';
    const e = d.eyebrow ? `<span class="eb">${md(d.eyebrow)}</span>` : '';
    return n || e ? `<div class="top">${n}${e}</div>` : '';
  }
  const H = (t, st) => (t ? `<h2 class="h" style="margin-top:18px;${st || ''}">${md(t)}</h2>` : '');
  const orbRow = (text, big) => `<div class="lg" style="display:flex;align-items:center;gap:18px;padding:18px 30px 20px 18px;border-radius:32px;max-width:640px;align-self:flex-start">
<span class="orb" style="width:${big ? 56 : 46}px;height:${big ? 56 : 46}px"></span><div style="font-size:26px;font-weight:500;line-height:1.3">${md(text)}</div></div>`;
  const factBox = (v, cap) => `<div class="lg" style="display:flex;align-items:center;gap:22px;padding:22px 38px 26px 22px;border-radius:40px;align-self:flex-start">
<span class="orb" style="width:68px;height:68px"></span><div><div style="font-size:64px;font-weight:700;letter-spacing:-.035em;line-height:1;white-space:nowrap">${md(v)}</div>
${cap ? `<div style="font-size:26px;font-weight:500;color:var(--sub);margin-top:8px">${md(cap)}</div>` : ''}</div></div>`;
  // свечений нет: язык плоский, глубину дает одна мягкая тень у плашек и 3D-знаков
  function light() { return ''; }
  // маршрут под цвет фона: на фиолетовом белый, на остальных фиолетовый
  const way = (bg, o) => I.route(Object.assign({ color: bg === 'violet' ? 'white' : 'violet' }, o));
  const list = (v) => (Array.isArray(v) ? v : []);
  const lines = (v) => String(v || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  // ---------- реплики ----------
  function bubble(m) {
    const who = m.who || 'client';
    const short = plain(m.text).length <= 22 && !/\n/.test(m.text || '');
    if (who === 'agent') return `<div class="msg a"><div class="bub gold">${md(m.text)}${m.sub ? `<span class="t">${esc(m.sub)}</span>` : ''}</div></div>`;
    if (who === 'note') return orbRow(m.text);
    if (who === 'fact') return factBox(m.text, m.sub);
    if (who === 'sep') return `<div class="sep">${md(m.text)}</div>`;
    const b = m.badge ? `<span class="chip lg badge"><span class="orb"></span>${esc(m.badge)}</span>` : '';
    return `<div class="msg c" style="max-width:830px">${b}<div class="bub lg${short ? ' short' : ''}">${md(m.text)}${m.sub ? `<span class="t">${esc(m.sub)}</span>` : ''}</div></div>`;
  }
  function chat(msgs) {
    const out = [];
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i], n = msgs[i + 1];
      const short = (m.who || 'client') === 'client' && plain(m.text).length <= 22 && !/\n/.test(m.text || '');
      if (short && n && (n.who === 'note' || n.who === 'fact')) {
        out.push(`<div class="row">${bubble(m)}${bubble(n)}</div>`);
        i++;
      } else out.push(bubble(m));
    }
    return out.join('');
  }

  // ---------- поля ----------
  const F = {
    title: (label, v) => ({ k: 'title', label: label || 'Заголовок', type: 'textarea', hint: 'Вывод, а не тема. До 40 знаков, 2-3 строки' }),
    eyebrow: { k: 'eyebrow', label: 'Надзаголовок', type: 'text' },
    step: { k: 'step', label: 'Номер шага', type: 'text', hint: '1, 2, 3 для сквозного метода' },
    lead: { k: 'lead', label: 'Подзаголовок', type: 'textarea', hint: 'Одна мысль, до 110 знаков' },
    ill: (k, label) => ({ k, label: label || 'Иллюстрация', type: 'glyph' }),
    bg: { k: 'bg', label: 'Фон', type: 'bg' },
  };
  const MSG_ITEM = [
    { k: 'who', label: 'Кто', type: 'select', options: [['client', 'Клиент'], ['agent', 'Агент'], ['note', 'Вывод команды'], ['fact', 'Цифра'], ['sep', 'Служебная строка']] },
    { k: 'text', label: 'Текст', type: 'textarea' },
    { k: 'sub', label: 'Время / подпись', type: 'text' },
    { k: 'badge', label: 'Бейдж', type: 'text', hint: 'например «возражение»' },
  ];

  // ---------- шаблоны ----------
  const T = {};

  T['cover-hero'] = {
    name: 'Обложка: заголовок и сцена', group: 'Обложки', rubrics: ['cases', 'features'], formats: ['45'], bgs: ['yellow', 'white', 'violet'], bg: 'yellow',
    desc: 'Крупный заголовок-крючок, 3D-сцена «проблема, решение, результат» и мини-диалог',
    fields: [F.bg, F.title(), F.lead, F.ill('ill', 'Главный объект'), F.ill('ill2', 'Проблема, бейдж'), { k: 'struck', label: 'Перечеркнуть проблему', type: 'check' }, F.ill('ill3', 'Результат, кружок'),
      { k: 'quote', label: 'Реплика клиента', type: 'textarea' }, { k: 'mark', label: 'Метка между репликами', type: 'text' }, { k: 'answer', label: 'Ответ', type: 'text' }],
    render(d, ctx) {
      const snip = d.quote ? `<div class="abs" style="left:72px;top:812px;z-index:5;width:520px;display:flex;flex-direction:column">
<div class="bub lg" style="font-size:32px;font-weight:500;border-top-left-radius:12px;color:var(--ink)">${md(d.quote)}</div>
${d.mark ? `<div style="height:120px;position:relative;margin-left:44px"><span class="abs" style="left:0;top:0;width:2px;height:120px;background:linear-gradient(180deg,rgba(255,255,255,.95),rgba(255,255,255,.3))"></span>
<span class="chip lg abs" style="left:28px;top:28px;height:64px;font-size:30px;padding:0 28px 0 12px;border-radius:32px"><span class="orb" style="width:40px;height:40px"></span>${esc(d.mark)}</span></div>` : '<div style="height:24px"></div>'}
${d.answer ? `<div style="align-self:flex-start"><div class="bub lg short" style="font-size:44px;border-top-left-radius:12px">${md(d.answer)}</div></div>` : ''}</div>` : '';
      return `${way(d.bg, { pts: [[1160, 800], [790, 800], [790, 1218], [1160, 1218]] })}
${d.ill2 ? I.badge(d.ill2, { x: 732, y: 742, size: 116, struck: d.struck }) : ''}
${d.ill ? I.tile(d.ill, { x: 672, y: 880, size: 236, tint: 'violet', rot: -6 }) : ''}
${d.ill3 ? I.orbIcon(d.ill3, { x: 900, y: 1156, size: 124, color: 'gold' }) : ''}
<div class="in">${head(ctx)}
<h1 class="h1" style="margin-top:74px">${md(d.title)}</h1>
${d.lead ? `<p class="lead" style="margin-top:36px;max-width:660px">${md(d.lead)}</p>` : ''}</div>${snip}${swipe(ctx)}`;
    },
    sample: { bg: 'yellow', title: 'Думал уйти.\nСогласился\nна звонок', lead: 'Клиент без мобильного интернета задумался о смене оператора, а ИИ-агент предложил ему Облачную АТС',
      ill: 'wifi', ill2: 'signal', struck: true, ill3: 'phone', quote: 'Поэтому, все предложения от Билайн не актуальны', mark: '37 секунд', answer: 'Хорошо' },
  };

  T['cover-number'] = {
    name: 'Обложка: цифра-герой', group: 'Обложки', rubrics: ['cases', 'know', 'features'], formats: ['45', '11'], bgs: ['yellow', 'white', 'violet'], bg: 'yellow',
    desc: 'Когда главное в посте это результат в цифрах. Цифра обязательно с периодом',
    fields: [F.bg, { k: 'pre', label: 'Над цифрой', type: 'text', hint: 'период или контекст' }, { k: 'number', label: 'Цифра', type: 'text' }, { k: 'unit', label: 'Единица', type: 'text' }, F.title(), F.lead, F.ill('ill')],
    render(d, ctx) {
      const sq = ctx.fmt === '11';
      const big = sq ? 230 : 290;
      const cx = sq ? 836 : 826, cy = ctx.H - (sq ? 330 : 400), ts = sq ? 220 : 260;
      return `${way(d.bg, { h: ctx.H, pts: [[1160, cy - (sq ? 230 : 290)], [cx, cy - (sq ? 230 : 290)], [cx, ctx.H + 40]], stops: [{ at: [sq ? 980 : 970, cy - (sq ? 230 : 290)] }] })}
${d.ill ? I.tile(d.ill, { x: cx - ts / 2, y: cy - ts / 2, size: ts, tint: 'violet', rot: 6 }) : ''}
<div class="in">${head(ctx)}
${d.pre ? `<div class="eb" style="margin-top:${sq ? 56 : 84}px;font-size:30px">${md(d.pre)}</div>` : ''}
<div style="display:flex;align-items:baseline;gap:20px;margin-top:${d.pre ? 4 : (sq ? 56 : 84)}px;white-space:nowrap"><span class="num-xl" style="font-size:${big}px">${md(d.number)}</span>
${d.unit ? `<span style="font-size:${sq ? 64 : 80}px;font-weight:700;letter-spacing:-.03em">${md(d.unit)}</span>` : ''}</div>
<h1 class="h" style="font-size:${sq ? 70 : 84}px;margin-top:${sq ? 34 : 50}px;max-width:${sq ? 640 : 760}px">${md(d.title)}</h1>
${d.lead ? `<p class="lead" style="margin-top:26px;max-width:${sq ? 560 : 600}px;font-size:${sq ? 30 : 34}px">${md(d.lead)}</p>` : ''}</div>${swipe(ctx)}`;
    },
    sample: { bg: 'yellow', pre: 'от отказа до согласия', number: '37', unit: 'секунд', title: 'ИИ-агент удержал клиента', lead: 'Предложил решение вместо спора и довел до звонка специалиста', ill: 'clock' },
  };

  T['cover-question'] = {
    name: 'Обложка: вопрос', group: 'Обложки', rubrics: ['know'], formats: ['45', '11'], bgs: ['violet', 'yellow', 'white'], bg: 'violet',
    desc: 'Для рубрики «А знаете ли вы?»: вопрос, на который отвечают карточки или ролик',
    fields: [F.bg, F.title('Вопрос'), F.lead, F.ill('ill'), F.ill('ill2', 'Акцент, кружок')],
    render(d, ctx) {
      const v = (d.bg || 'violet') === 'violet', sq = ctx.fmt === '11';
      const tint = v ? 'clear' : 'violet';
      const cx = sq ? 780 : 770, ts = sq ? 250 : 300, cy = ctx.H - (sq ? 360 : 440), yb = ctx.H - (sq ? 120 : 150);
      return `${way(d.bg, { h: ctx.H, pts: [[1160, cy - ts / 2 - 70], [cx, cy - ts / 2 - 70], [cx, yb], [1160, yb]] })}
${d.ill ? I.tile(d.ill, { x: cx - ts / 2, y: cy - ts / 2, size: ts, tint, rot: -6 }) : ''}
${d.ill2 ? I.orbIcon(d.ill2, { x: 930 - 58, y: yb - 58, size: 116, color: 'gold' }) : ''}
<div class="in">${head(ctx)}
<h1 class="h1" style="font-size:${sq ? 96 : 112}px;margin-top:${sq ? 60 : 80}px;max-width:${sq ? 900 : 960}px">${md(d.title)}</h1>
${d.lead ? `<p class="lead" style="margin-top:34px;max-width:${sq ? 520 : 600}px">${md(d.lead)}</p>` : ''}</div>${swipe(ctx, v ? 'color:#fff' : '')}`;
    },
    sample: { bg: 'violet', title: 'Почему клиенту не пришла рассылка?', lead: 'Разбираем, что CVM проверяет перед каждой отправкой', ill: 'question', ill2: 'shield' },
  };

  T['cover-release'] = {
    name: 'Обложка: релиз', group: 'Обложки', rubrics: ['features'], formats: ['45', '11'], bgs: ['yellow', 'white', 'violet'], bg: 'yellow',
    desc: 'Для «Новых фич»: желтая метка релиза и веер из трех плиток',
    fields: [F.bg, { k: 'tag', label: 'Метка релиза', type: 'text' }, F.title(), F.lead, F.ill('ill', 'Плитка 1'), F.ill('ill2', 'Плитка 2, главная'), F.ill('ill3', 'Плитка 3')],
    render(d, ctx) {
      const v = d.bg === 'violet', sq = ctx.fmt === '11', y0 = ctx.H - 1350;
      const tint2 = v ? 'clear' : 'violet', tint1 = v ? 'clear' : 'pearl';
      const s = sq ? .8 : 1, ox = sq ? 120 : 0, oy = sq ? y0 + 140 : 0;
      return `${way(d.bg, { h: ctx.H, pts: sq ? [[1160, 640], [690, 640], [690, 1000], [1160, 1000]] : [[1160, 760], [650, 760], [650, 1210], [1160, 1210]] })}
${d.ill ? I.tile(d.ill, { x: 520 + ox, y: 830 + oy, size: 250 * s, tint: tint1, rot: -14, z: 2 }) : ''}
${d.ill2 ? I.tile(d.ill2, { x: 700 + ox * .6, y: 740 + oy, size: 300 * s, tint: tint2, rot: 6, z: 3 }) : ''}
${d.ill3 ? I.tile(d.ill3, { x: 790 + ox * .4, y: 1020 + oy, size: 200 * s, tint: tint1, rot: -4, z: 4 }) : ''}
<div class="in">${head(ctx)}
${d.tag ? `<div style="margin-top:${sq ? 50 : 72}px"><span class="tag gold">${esc(d.tag)}</span></div>` : ''}
<h1 class="h1" style="font-size:${sq ? 96 : 116}px;margin-top:28px;max-width:960px">${md(d.title)}</h1>
${d.lead ? `<p class="lead" style="margin-top:30px;max-width:${sq ? 500 : 560}px">${md(d.lead)}</p>` : ''}</div>${swipe(ctx, v ? 'color:#fff' : '')}`;
    },
    sample: { bg: 'yellow', tag: 'Релиз CVM BOX', title: 'Новые атрибуты в профиле клиента', lead: 'Показываем, что они значат и какие сценарии можно запустить', ill: 'idcard', ill2: 'rocket', ill3: 'target' },
  };

  T['cover-person'] = {
    name: 'Обложка: знакомство', group: 'Обложки', rubrics: ['team'], formats: ['45'], bgs: ['yellow', 'white'], bg: 'yellow',
    desc: 'Для «Знакомства с командой»: фото в белой рамке, имя и роль',
    fields: [F.bg, F.title(), { k: 'photo', label: 'Фото', type: 'image' }, { k: 'name', label: 'Имя и фамилия', type: 'text' }, { k: 'role', label: 'Роль', type: 'textarea' }, F.ill('ill', 'Кружок у фото')],
    render(d, ctx) {
      const ph = d.photo ? `<img src="${esc(d.photo)}" alt="">` : `<div style="width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;background:linear-gradient(160deg,#FFFFFF,#E7E1FF)">${I.ink('user', 380, 'rgba(91,63,240,.28)', { sw: 1.4 })}</div>`;
      return `${way(d.bg, { pts: [[1160, 400], [754, 400], [754, 1200], [-40, 1200]], stops: [{ at: [300, 1200] }] })}
<div class="abs lg" style="left:500px;top:470px;width:508px;height:640px;border-radius:64px;padding:14px;z-index:3"><div class="photo" style="width:100%;height:100%;border-radius:52px">${ph}</div></div>
${d.ill ? I.orbIcon(d.ill, { x: 446, y: 1010, size: 120, color: 'gold', z: 5 }) : ''}
<div class="in">${head(ctx)}
<h1 class="h1" style="font-size:108px;margin-top:70px;max-width:940px">${md(d.title)}</h1>
</div><div class="abs" style="left:72px;top:820px;width:360px;z-index:5"><div style="font-size:52px;font-weight:700;letter-spacing:-.025em;line-height:1.05">${md(d.name)}</div>
<div class="lead" style="margin-top:16px;font-size:30px">${md(d.role)}</div></div>${swipe(ctx)}`;
    },
    sample: { bg: 'yellow', title: 'Кто запускает ваши кампании', name: 'Имя Фамилия', role: 'Роль в команде CVM', ill: 'users' },
  };

  T['context'] = {
    name: 'Контекст: задача и продукт', group: 'Внутренние', rubrics: ['cases', 'features'], formats: ['45'], bgs: ['white', ...PK], bg: 'white',
    desc: 'Тип кампании, первое сообщение агента и продукт, который он предлагает',
    fields: [F.bg, F.eyebrow, F.title(), { k: 'options', label: 'Переключатель', type: 'text', hint: 'через запятую, активный отметьте *' }, { k: 'msg_label', label: 'Подпись к сообщению', type: 'text' },
      { k: 'msg', label: 'Сообщение агента', type: 'textarea' }, { k: 'msg_time', label: 'Время', type: 'text' }, { k: 'p_label', label: 'Над продуктом', type: 'text' }, { k: 'p_name', label: 'Продукт', type: 'text' }, { k: 'p_sub', label: 'Под продуктом', type: 'text' }, F.ill('ill', 'Иллюстрация продукта'), F.ill('ill2', 'Кружок')],
    render(d) {
      const opts = String(d.options || '').split(',').map((s) => s.trim()).filter(Boolean);
      const seg = opts.length ? `<div class="lg" style="display:flex;align-self:flex-start;gap:2px;margin-top:40px;padding:7px;border-radius:42px;font-size:28px;font-weight:500;color:var(--mut)">
${opts.map((o) => (o.endsWith('*') ? `<span style="height:68px;padding:0 32px 0 24px;border-radius:34px;display:flex;align-items:center;gap:12px;font-weight:700;color:var(--ink);background:#fff;box-shadow:0 10px 22px -10px rgba(60,30,170,.4)"><span class="orb" style="width:20px;height:20px"></span>${esc(o.slice(0, -1).trim())}</span>` : `<span style="height:68px;padding:0 28px;display:flex;align-items:center">${esc(o)}</span>`)).join('')}</div>` : '';
      return `<div class="in">${top(d)}${H(d.title)}${seg}
${d.msg_label ? `<div class="lbl" style="align-self:flex-end;margin-top:52px">${esc(d.msg_label)}</div>` : ''}
${d.msg ? `<div class="chat" style="margin-top:14px"><div class="msg a"><div class="bub gold" style="font-size:32px;line-height:1.48;padding:26px 34px">${md(d.msg)}${d.msg_time ? `<span class="t">${esc(d.msg_time)}</span>` : ''}</div></div></div>` : ''}</div>
${d.p_name ? `<div class="abs lg" style="left:72px;right:72px;bottom:72px;height:236px;border-radius:44px;z-index:3;padding:40px 44px">
${d.p_label ? `<div class="lbl">${esc(d.p_label)}</div>` : ''}<div style="font-size:72px;font-weight:700;letter-spacing:-.035em;line-height:1;margin-top:10px">${md(d.p_name)}</div>
${d.p_sub ? `<div style="font-size:26px;font-weight:500;color:var(--sub);margin-top:16px">${md(d.p_sub)}</div>` : ''}</div>` : ''}
${d.ill ? I.tile(d.ill, { x: 718, y: 958, size: 230, tint: 'violet', rot: -6, z: 5 }) : ''}${d.ill2 ? I.orbIcon(d.ill2, { x: 886, y: 1112, size: 96, color: 'gold', z: 6 }) : ''}`;
    },
    sample: { eyebrow: 'Задача агента', title: 'Допродать\nдействующему клиенту', options: 'Сохранение, Допродажа*, Привлечение', msg_label: 'Первое сообщение агента',
      msg: 'Добрый день! Меня зовут Владислав, корпоративный отдел билайн. Услуга [[Облачная АТС]] помогает навести порядок в звонках, повысить контактность и эффективность работы менеджеров. Хотели бы узнать подробней?',
      msg_time: '07:53', p_label: 'Агент предложил', p_name: 'Облачная АТС', p_sub: 'работает через Wi-Fi', ill: 'cloud', ill2: 'phone' },
  };

  T['dialog'] = {
    name: 'Диалог', group: 'Внутренние', rubrics: ['cases'], formats: ['45'], bgs: ['white', ...PK.filter((k) => k !== 'lemon')], bg: 'white',
    desc: '2-4 реплики дословно. В каждой одна ключевая фраза в линзе. Вывод команды или цифра встают рядом с короткой репликой',
    fields: [F.bg, F.step, F.eyebrow, F.title(), { k: 'msgs', label: 'Реплики', type: 'list', item: MSG_ITEM, max: 6 }],
    render(d) {
      return `<div class="in">${top(d)}${H(d.title)}<div class="chat" style="margin-top:${d.gap || 48}px;flex:1 1 auto;justify-content:safe center;padding-bottom:24px">${chat(list(d.msgs))}</div></div>`;
    },
    sample: { step: '2', eyebrow: 'Диалог, часть 2 из 3', title: 'Проблему со связью\nсделал аргументом', msgs: [
      { who: 'client', text: 'Поэтому, [[все предложения от Билайн не актуальны]]', sub: '12:27', badge: 'возражение' },
      { who: 'agent', text: 'Понял, {{Екатерина}}. Если сейчас связь действительно нестабильна, переход - естественный вариант для оценки. Чтобы не терять контакты с клиентами в такие периоды, компании часто используют [[Облачную АТС, она работает и через интернет, и через Wi-Fi]], обеспечивая прием звонков даже при сбое мобильной сети.\nХотите, я передам ваш кейс специалисту? Он объяснит, как можно протестировать это решение [[бесплатно на 14 дней, без обязательств]].', sub: '12:27' },
      { who: 'client', text: 'Хорошо', sub: '12:28' },
      { who: 'fact', text: '37 секунд', sub: 'от отказа до согласия' }] },
  };

  T['fact'] = {
    name: 'Факт-цифра', group: 'Внутренние', rubrics: ['know', 'features', 'cases'], formats: ['45', '11'], bgs: ['white', 'yellow', ...PK], bg: 'white',
    desc: 'Одна цифра крупно на плашке, пояснение и вывод команды',
    fields: [F.bg, F.step, F.eyebrow, F.title(), { k: 'pre', label: 'Над цифрой', type: 'text' }, { k: 'number', label: 'Цифра', type: 'text' }, { k: 'unit', label: 'Единица', type: 'text' }, { k: 'caption', label: 'Пояснение', type: 'textarea' }, { k: 'note', label: 'Вывод команды', type: 'textarea' }, F.ill('ill')],
    render(d, ctx) {
      const sq = ctx.fmt === '11';
      return `${light(d.bg, 540, ctx.H * .62, 560, .32)}
<div class="in">${top(d)}${H(d.title)}
<div class="lg" style="margin-top:${sq ? 40 : 56}px;border-radius:48px;padding:${sq ? '40px 48px 46px' : '52px 56px 58px'};position:relative${sq ? '' : ';flex:1 1 auto;display:flex;flex-direction:column;justify-content:center'}">
${d.ill ? `<div class="abs" style="right:30px;top:${d.title ? -34 : -64}px;z-index:4">${I.tile(d.ill, { size: sq ? 180 : 230, tint: 'violet', rot: 8 })}</div>` : ''}
${d.pre ? `<div class="lbl" style="font-size:${sq ? 26 : 30}px">${md(d.pre)}</div>` : ''}
<div style="display:flex;align-items:baseline;gap:22px;margin-top:10px;white-space:nowrap"><span class="num-xl" style="font-size:${sq ? 180 : 300}px">${md(d.number)}</span>${d.unit ? `<span style="font-size:${plain(d.unit).length <= 2 ? (sq ? 100 : 150) : (sq ? 56 : 84)}px;font-weight:700;letter-spacing:-.03em">${md(d.unit)}</span>` : ''}</div>
${d.caption ? `<div class="txt" style="margin-top:${sq ? 24 : 36}px;max-width:720px;color:var(--sub);font-size:${sq ? 31 : 36}px">${md(d.caption)}</div>` : ''}</div>
${d.note ? `<div style="margin-top:${sq ? 28 : 40}px">${orbRow(d.note, true)}</div>` : ''}</div>`;
    },
    sample: { bg: 'white', eyebrow: 'Итог диалога', title: 'Путь от «уйду»\nдо «звоните»', pre: 'Меньше чем за', number: '3', unit: 'минуты', caption: 'клиент прошел путь от мысли уйти до согласия на звонок', note: 'Самый долгий ответ агента в диалоге занял 17 секунд', ill: 'clock' },
  };

  T['steps'] = {
    name: 'Шаги и список', group: 'Внутренние', rubrics: ['know', 'features', 'team'], formats: ['45'], bgs: ['white', 'yellow', ...PK], bg: 'white',
    desc: 'До 5 пунктов с фиолетовыми номерами: механика, порядок запуска, правила, список доработок',
    fields: [F.bg, F.step, F.eyebrow, F.title(), { k: 'items', label: 'Пункты', type: 'list', max: 5, item: [{ k: 'title', label: 'Пункт', type: 'text' }, { k: 'text', label: 'Пояснение', type: 'textarea' }] }, { k: 'note', label: 'Вывод команды', type: 'textarea' }],
    render(d) {
      // номера стоят станциями на одном маршруте
      const it = list(d.items), big = it.length <= 3, gap = big ? 22 : 18, ns = big ? 76 : 64, line = d.bg === 'violet' ? '#FFFFFF' : '#6B4EFF';
      return `${light(d.bg, 300, 900, 520, .3)}<div class="in">${top(d)}${H(d.title)}
<div style="display:flex;flex-direction:column;gap:${gap}px;margin-top:52px;flex:1 1 auto;min-height:0">${it.map((x, i) => `<div style="flex:1 1 0;max-height:300px;display:flex;gap:28px;align-items:center;position:relative">
${i < it.length - 1 ? `<span style="position:absolute;left:${ns / 2 - 7}px;top:50%;width:14px;height:calc(100% + ${gap}px);background:${line};z-index:0"></span>` : ''}
<span class="num vio" style="position:relative;z-index:1;width:${ns}px;height:${ns}px;font-size:${big ? 36 : 30}px">${i + 1}</span>
<div class="lg" style="flex:1 1 auto;align-self:stretch;min-width:0;border-radius:44px;padding:${big ? '36px 44px' : '30px 38px'};display:flex;flex-direction:column;justify-content:center"><div style="font-size:${big ? 46 : 40}px;font-weight:700;letter-spacing:-.02em;line-height:1.12">${md(x.title)}</div>
${x.text ? `<div class="txt" style="font-size:${big ? 32 : 30}px;margin-top:12px;color:var(--sub)">${md(x.text)}</div>` : ''}</div></div>`).join('')}</div>
${d.note ? `<div style="margin-top:34px">${orbRow(d.note, true)}</div>` : ''}</div>`;
    },
    sample: { bg: 'white', eyebrow: 'Перед каждой отправкой', title: 'Что проверяет система', items: [
      { title: 'Согласие клиента', text: 'Есть ли согласие на рекламные сообщения в этом канале' },
      { title: 'Лимит касаний', text: 'Не получил ли клиент слишком много сообщений за период' },
      { title: 'Пересечения кампаний', text: 'Не попал ли клиент сразу в несколько рассылок' }], note: 'Если хоть одна проверка не пройдена, сообщение не уйдет' },
  };

  T['compare'] = {
    name: 'Было и стало', group: 'Внутренние', rubrics: ['cases', 'features', 'know'], formats: ['45', '11'], bgs: ['white', ...PK], bg: 'white',
    desc: 'Две колонки: слева белая плашка, справа желтая. Каждая строка в одну мысль',
    fields: [F.bg, F.step, F.eyebrow, F.title(), { k: 'l_label', label: 'Левая колонка', type: 'text' }, { k: 'l_items', label: 'Пункты слева', type: 'textarea', hint: 'каждый с новой строки' }, { k: 'r_label', label: 'Правая колонка', type: 'text' }, { k: 'r_items', label: 'Пункты справа', type: 'textarea' }, { k: 'note', label: 'Вывод команды', type: 'textarea' }],
    render(d, ctx) {
      const sq = ctx.fmt === '11';
      const fs = sq ? 32 : 38, gap = sq ? 26 : 40;
      const col = (cls, label, items, glyph) => `<div class="${cls}" style="flex:1;min-width:0;border-radius:48px;padding:${sq ? '40px 36px 44px' : '50px 40px 54px'};display:flex;flex-direction:column;gap:${gap}px">
<div style="font-size:${sq ? 32 : 36}px;font-weight:700;${cls === 'lg' ? 'color:var(--mut)' : ''}">${esc(label)}</div>
<div style="flex:1 1 auto;display:flex;flex-direction:column;justify-content:space-evenly;gap:${gap}px">${lines(items).map((s) => `<div style="display:flex;gap:20px;align-items:flex-start"><span style="flex:none;margin-top:${sq ? 4 : 6}px">${I.ink(glyph, sq ? 34 : 40, cls === 'lg' ? 'rgba(20,20,20,.3)' : '#141414')}</span><span style="font-size:${fs}px;line-height:1.26;font-weight:${cls === 'lg' ? 400 : 500};color:${cls === 'lg' ? 'var(--sub)' : 'var(--ink)'}">${md(s)}</span></div>`).join('')}</div></div>`;
      return `<div class="in">${top(d)}${H(d.title)}
<div style="display:flex;gap:16px;margin-top:${sq ? 44 : 56}px;flex:1 1 auto;min-height:0;max-height:${sq ? 620 : 820}px">${col('lg', d.l_label, d.l_items, 'clock')}${col('gold', d.r_label, d.r_items, 'check')}</div>
<div class="grow"></div>${d.note ? `<div style="margin-top:28px">${orbRow(d.note, true)}</div>` : ''}</div>`;
    },
    sample: { eyebrow: 'Как ведем диалог', title: 'Спорить или\nпредложить решение', l_label: 'Обычный ответ', l_items: 'Убеждает остаться\nСпорит с причиной ухода\nОтправляет в поддержку', r_label: 'Ответ ИИ-агента', r_items: 'Признает проблему\nДелает ее аргументом\nДоводит до звонка', note: 'Клиент согласился на звонок через 37 секунд после отказа' },
  };

  T['attribute'] = {
    name: 'Атрибут и сценарий', group: 'Внутренние', rubrics: ['features'], formats: ['45'], bgs: ['white', ...PK], bg: 'white',
    desc: 'Для «Новых фич»: один атрибут и сценарий «если, тогда», можно в два шага',
    fields: [F.bg, F.step, F.eyebrow, { k: 'kind', label: 'Где живет атрибут', type: 'text', ph: 'Атрибут в профиле клиента' }, { k: 'name', label: 'Атрибут', type: 'textarea' }, { k: 'meaning', label: 'Что показывает', type: 'textarea' },
      { k: 's_if', label: 'Если', type: 'textarea' }, { k: 's_then', label: 'Тогда', type: 'textarea' }, { k: 's_if2', label: 'Если, второй шаг', type: 'textarea' }, { k: 's_then2', label: 'Тогда, второй шаг', type: 'textarea' }, F.ill('ill')],
    render(d) {
      // сценарий стоит на маршруте: «если» это станция-кольцо, «тогда» это станция с галочкой у первой строки
      // второй шаг (s_if2, s_then2) продолжает тот же маршрут, плашки становятся компактнее
      const two = !!(d.s_if2 || d.s_then2), line = d.bg === 'violet' ? '#FFFFFF' : '#6B4EFF', tick = d.bg === 'violet' ? '#6B4EFF' : '#FFFFFF';
      const st = two ? 52 : 60, gap = two ? 16 : 20, fs = two ? 34 : 38, pad = two ? '28px 40px' : '38px 44px';
      const so = Math.round(parseInt(pad, 10) + fs * 1.34 / 2 - st / 2); // so: станция по центру первой строки плашки
      const rows = [['Если', d.s_if], ['Тогда', d.s_then], ['Если', d.s_if2], ['Тогда', d.s_then2]].filter((r) => r[1]);
      const row = ([w, txt], k) => {
        const then = w === 'Тогда', last = k === rows.length - 1;
        return `<div style="display:flex;gap:26px;align-items:flex-start;position:relative">${last ? '' : `<span style="position:absolute;left:${st / 2 - 7}px;top:${so + st / 2}px;width:14px;height:calc(100% + ${gap}px);background:${line}"></span>`}
<span class="orb" style="position:relative;width:${st}px;height:${st}px;margin-top:${so}px">${then ? I.ink('check', Math.round(st / 2), tick) : ''}</span>
<div class="${then ? 'gold' : 'lg'}" style="flex:1 1 auto;min-width:0;border-radius:${two ? 38 : 44}px;padding:${pad};font-size:${fs}px;line-height:1.34${then ? '' : ';color:var(--sub)'}"><b${then ? '' : ' style="color:var(--ink)"'}>${w}</b> ${md(txt)}</div></div>`;
      };
      return `${light(d.bg, 860, 420, 440, .32)}<div class="in">${top(d)}
<div class="lg" style="margin-top:40px;border-radius:52px;padding:46px 48px;display:flex;gap:40px;align-items:center">
${d.ill ? `<div style="flex:none">${I.tile(d.ill, { size: 240, tint: 'violet', rot: 0 })}</div>` : ''}
<div style="min-width:0"><div class="lbl" style="font-size:26px">${esc(d.kind || 'Атрибут в профиле клиента')}</div><div style="font-size:70px;font-weight:700;letter-spacing:-.032em;line-height:1.02;margin-top:14px">${md(d.name)}</div></div></div>
${d.meaning ? `<div style="font-size:${two ? 38 : 42}px;font-weight:500;line-height:1.3;margin-top:${two ? 40 : 56}px">${md(d.meaning)}</div>` : ''}
<div class="grow" style="min-height:${two ? 32 : 48}px"></div><div class="lbl" style="font-size:28px">Сценарий</div>
<div style="display:flex;flex-direction:column;gap:${gap}px;margin-top:20px">${rows.map(row).join('')}</div></div>`;
    },
    sample: { eyebrow: 'Новый атрибут · пример', name: 'Пользуется Облачной АТС', meaning: 'Показывает, что у компании подключена Облачная АТС и она принимает звонки через нее', s_if: 'клиент много звонит, но не записывает разговоры', s_then: 'предлагаем запись звонков и аналитику, чтобы не терять заявки', ill: 'idcard' },
  };

  T['explain'] = {
    name: 'Термин простыми словами', group: 'Внутренние', rubrics: ['know'], formats: ['45'], bgs: ['white', ...PK], bg: 'white',
    desc: 'Для «А знаете ли вы?»: термин, определение без жаргона, пример и вывод',
    fields: [F.bg, F.step, F.eyebrow, { k: 'term', label: 'Термин', type: 'textarea' }, { k: 'definition', label: 'Определение', type: 'textarea' }, { k: 'ex_label', label: 'Подпись к примеру', type: 'text' }, { k: 'example', label: 'Пример', type: 'textarea' }, { k: 'note', label: 'Вывод команды', type: 'textarea' }, F.ill('ill')],
    render(d) {
      return `${light(d.bg, 880, 300, 420, .35)}${d.ill ? I.tile(d.ill, { x: 786, y: 120, size: 220, tint: 'violet', rot: 8, z: 4 }) : ''}
<div class="in">${top(d)}<h2 class="h" style="margin-top:18px;font-size:96px;max-width:${d.ill ? 680 : 936}px">${md(d.term)}</h2>
${d.definition ? `<div style="font-size:40px;font-weight:500;line-height:1.32;margin-top:40px;max-width:${d.ill ? 760 : 920}px">${md(d.definition)}</div>` : ''}
<div class="grow" style="min-height:48px"></div>
${d.example ? `<div class="lbl" style="font-size:26px">${esc(d.ex_label || 'Например')}</div><div class="gold" style="margin-top:16px;border-radius:40px;padding:36px 42px;font-size:37px;line-height:1.42">${md(d.example)}</div>` : ''}
${d.note ? `<div style="margin-top:24px">${orbRow(d.note, true)}</div>` : ''}</div>`;
    },
    sample: { eyebrow: 'Простыми словами · пример', term: 'Контактная политика', definition: 'Правила, которые защищают клиента от лишних сообщений: сколько касаний можно, по каким каналам и в какое время', ex_label: 'Например',
      example: 'Если клиент на этой неделе уже получил предложение, [[новое письмо подождет]]', note: 'Лимиты для вашей кампании подскажем в боте', ill: 'shield' },
  };

  T['quote'] = {
    name: 'Цитата', group: 'Внутренние', rubrics: ['team', 'cases'], formats: ['45', '11'], bgs: ['white', 'yellow', ...PK], bg: 'white',
    desc: 'Мысль человека крупно, одна фраза в линзе. Подходит для одиночного поста',
    fields: [F.bg, F.eyebrow, { k: 'text', label: 'Цитата', type: 'textarea' }, { k: 'photo', label: 'Фото', type: 'image' }, { k: 'name', label: 'Автор', type: 'text' }, { k: 'role', label: 'Роль', type: 'text' }],
    render(d, ctx) {
      const n = plain(d.text).length, sq = ctx.fmt === '11';
      const fs = n <= 90 ? (sq ? 58 : 74) : n <= 160 ? (sq ? 48 : 60) : (sq ? 40 : 48);
      const ava = d.photo ? `<div class="lg" style="width:120px;height:120px;border-radius:50%;padding:6px;flex:none"><div class="photo" style="width:100%;height:100%;border-radius:50%"><img src="${esc(d.photo)}" alt=""></div></div>` : I.orbIcon('user', { size: 110 });
      return `${light(d.bg, 860, 300, 420, .3)}<div class="in">${top(d)}
<div style="margin-top:${d.eyebrow ? 40 : 10}px">${I.tile('quote', { size: 150, tint: 'violet', rot: -6 })}</div>
<div style="font-size:${fs}px;font-weight:700;letter-spacing:-.022em;line-height:1.14;margin-top:44px">${md(d.text)}</div>
<div class="grow"></div><div style="display:flex;align-items:center;gap:24px">${ava}<div><div style="font-size:34px;font-weight:700">${md(d.name)}</div><div style="font-size:26px;font-weight:500;color:var(--sub);margin-top:6px">${md(d.role)}</div></div></div></div>`;
    },
    sample: { bg: 'white', eyebrow: 'Мнение команды', text: 'Клиент уходит не от оператора, а от проблемы. [[Решите проблему, и уходить незачем]]', name: 'Команда CVM', role: 'о кейсе с Облачной АТС' },
  };

  T['person'] = {
    name: 'Роль: с чем приходить', group: 'Внутренние', rubrics: ['team'], formats: ['45'], bgs: ['white', ...PK], bg: 'white',
    desc: 'Кто за что отвечает, с какими задачами приходить и как связаться',
    fields: [F.bg, F.eyebrow, { k: 'photo', label: 'Фото', type: 'image' }, { k: 'name', label: 'Имя и фамилия', type: 'text' }, { k: 'role', label: 'Роль', type: 'textarea' }, { k: 'items', label: 'Приходите, если', type: 'textarea', hint: 'каждый пункт с новой строки' }, { k: 'contact', label: 'Как связаться', type: 'text' }],
    render(d) {
      const ph = d.photo ? `<img src="${esc(d.photo)}" alt="">` : `<div style="width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;background:linear-gradient(160deg,#FFFFFF,#E7E1FF)">${I.ink('user', 250, 'rgba(91,63,240,.28)', { sw: 1.4 })}</div>`;
      return `${light(d.bg, 300, 340, 420, .3)}<div class="in">${top(d)}
<div style="display:flex;gap:40px;align-items:center;margin-top:34px"><div class="lg" style="width:290px;height:340px;border-radius:52px;padding:12px;flex:none"><div class="photo" style="width:100%;height:100%;border-radius:42px">${ph}</div></div>
<div style="min-width:0"><div style="font-size:74px;font-weight:700;letter-spacing:-.035em;line-height:1">${md(d.name)}</div><div class="lead" style="margin-top:18px;font-size:34px">${md(d.role)}</div></div></div>
<div class="lbl" style="margin-top:64px">Приходите, если нужно</div>
<div style="display:flex;flex-direction:column;gap:18px;margin-top:22px">${lines(d.items).map((s) => `<div class="lg" style="border-radius:38px;padding:28px 34px 30px 26px;display:flex;gap:24px;align-items:center">
${I.orbIcon('check', { size: 62 })}<span style="font-size:34px;font-weight:500;line-height:1.28">${md(s)}</span></div>`).join('')}</div>
<div class="grow"></div>${d.contact ? `<div class="gold" style="border-radius:40px;padding:28px 36px"><div class="lbl" style="color:rgba(20,20,20,.6)">Как связаться</div><div style="font-size:38px;font-weight:700;margin-top:8px">${md(d.contact)}</div></div>` : ''}</div>`;
    },
    sample: { eyebrow: 'Кто за что отвечает', name: 'Имя Фамилия', role: 'Роль в команде CVM', items: 'Подобрать аудиторию под продукт\nЗапустить рассылку или агента\nРазобрать результаты кампании', contact: 'Бот CVM в Buzz' },
  };

  T['summary'] = {
    name: 'Итог: польза и цифры', group: 'Финальные', rubrics: ['cases', 'features'], formats: ['45'], bgs: ['yellow', 'white'], bg: 'yellow',
    desc: 'Бенто с одним отступом 16 px: три пункта пользы, цифра-герой, две цифры и призыв',
    fields: [F.bg, F.eyebrow, F.title(), { k: 'items', label: 'Пункты пользы', type: 'textarea', hint: 'до 3, каждый с новой строки' },
      { k: 'b_pre', label: 'Над главной цифрой', type: 'text' }, { k: 'b_num', label: 'Главная цифра', type: 'text' }, { k: 'b_unit', label: 'Единица', type: 'text' }, { k: 'b_cap', label: 'Пояснение', type: 'textarea' },
      { k: 's2', label: 'Цифра 2', type: 'text' }, { k: 's2_cap', label: 'Пояснение 2', type: 'text' }, { k: 's3', label: 'Цифра 3', type: 'text' }, { k: 's3_cap', label: 'Пояснение 3', type: 'text' },
      { k: 'cta', label: 'Призыв', type: 'text' }, { k: 'btn', label: 'Кнопка', type: 'text' }],
    render(d) {
      const G = 16;
      const st = (v, c) => `<div class="lg" style="border-radius:40px;padding:34px 36px 36px;display:flex;flex-direction:column;justify-content:space-between;flex:1 1 0;min-height:0">
<div style="font-size:60px;font-weight:700;letter-spacing:-.04em;line-height:.92;white-space:nowrap">${md(v)}</div><div style="font-size:25px;line-height:1.3;color:var(--sub)">${md(c)}</div></div>`;
      const its = lines(d.items).slice(0, 3);
      return `<div class="in">${top(d)}${H(d.title)}
<div class="grow" style="display:flex;flex-direction:column;gap:${G}px;margin-top:48px">
${its.length ? `<div class="lg" style="flex:none;border-radius:40px;padding:34px 40px;display:flex;flex-direction:column;gap:22px">${its.map((s, i) => `<div style="display:flex;align-items:center;gap:22px"><span class="num vio">${i + 1}</span><span style="font-size:32px;font-weight:500;line-height:1.22">${md(s)}</span></div>`).join('')}</div>` : ''}
<div style="flex:1 1 auto;display:flex;gap:${G}px;min-height:0">
<div style="width:520px;display:flex"><div class="lg" style="border-radius:40px;padding:34px 36px 36px;display:flex;flex-direction:column;justify-content:space-between;flex:1">
<div>${d.b_pre ? `<div style="font-size:26px;font-weight:500;color:var(--sub)">${md(d.b_pre)}</div>` : ''}<div style="display:flex;align-items:baseline;gap:24px;margin-top:6px;white-space:nowrap">
<span class="num-xl" style="font-size:270px">${md(d.b_num)}</span><span style="font-size:72px;font-weight:700;letter-spacing:-.035em">${md(d.b_unit)}</span></div></div>
<div style="font-size:27px;line-height:1.3;color:var(--sub)">${md(d.b_cap)}</div></div></div>
<div style="flex:1;display:flex;flex-direction:column;gap:${G}px;min-width:0">${d.s2 ? st(d.s2, d.s2_cap) : ''}${d.s3 ? st(d.s3, d.s3_cap) : ''}</div></div>
${d.cta ? `<div class="lg" style="flex:none;height:116px;border-radius:58px;display:flex;align-items:center;justify-content:space-between;padding:0 14px 0 40px">
<span style="font-size:29px;font-weight:500">${md(d.cta)}</span><span class="vio btn">${esc(d.btn || 'Пишите нам')}</span></div>` : ''}</div></div>`;
    },
    sample: { bg: 'yellow', eyebrow: 'Итог', title: 'Что агент дает\nвашему продукту', items: 'Слышит, почему клиент хочет уйти, и не спорит\nНаходит продукт, который решает его проблему\nДоводит до звонка специалиста в тот же день',
      b_pre: 'Меньше чем за', b_num: '3', b_unit: 'минуты', b_cap: 'клиент прошел путь от мысли уйти до согласия на звонок', s2: '17 секунд', s2_cap: 'самый долгий ответ агента в этом диалоге', s3: '+1 продукт', s3_cap: 'Облачная АТС в разговоре об уходе', cta: 'Хотите так же для своего продукта?', btn: 'Пишите нам' },
  };

  T['cta'] = {
    name: 'Призыв: приходите с задачей', group: 'Финальные', rubrics: ['know', 'features', 'team', 'cases'], formats: ['45', '11'], bgs: ['yellow', 'white', 'violet'], bg: 'yellow',
    desc: 'Последняя карточка: вопрос читателю, куда писать и кнопка',
    fields: [F.bg, F.eyebrow, F.title('Вопрос читателю'), F.lead, { k: 'c_label', label: 'Над контактом', type: 'text' }, { k: 'contact', label: 'Контакт', type: 'text' }, { k: 'btn', label: 'Кнопка', type: 'text' }, F.ill('ill'), F.ill('ill2', 'Кружок')],
    render(d, ctx) {
      const v = d.bg === 'violet', sq = ctx.fmt === '11';
      const cx = sq ? 800 : 790, ts = sq ? 230 : 270, y1 = sq ? 380 : 560, y2 = ctx.H - (sq ? 300 : 330), cy = (y1 + y2) / 2 - 10;
      return `${way(d.bg, { h: ctx.H, pts: [[1160, y1], [cx, y1], [cx, y2], [1160, y2]] })}
${d.ill ? I.tile(d.ill, { x: cx - ts / 2, y: cy - ts / 2, size: ts, tint: v ? 'clear' : 'violet', rot: -6 }) : ''}
${d.ill2 ? I.orbIcon(d.ill2, { x: 940 - 54, y: y2 - 54, size: 108, color: 'gold' }) : ''}
<div class="in">${top(d)}<h1 class="h1" style="font-size:${sq ? 90 : 104}px;margin-top:${d.eyebrow ? 24 : 0}px;max-width:900px">${md(d.title)}</h1>
${d.lead ? `<p class="lead" style="margin-top:32px;max-width:${sq ? 520 : 560}px">${md(d.lead)}</p>` : ''}<div class="grow"></div>
<div class="lg" style="border-radius:58px;height:116px;display:flex;align-items:center;justify-content:space-between;padding:0 14px 0 40px">
<div style="min-width:0">${d.c_label ? `<div class="lbl" style="font-size:22px">${esc(d.c_label)}</div>` : ''}<div style="font-size:31px;font-weight:700;margin-top:2px">${md(d.contact)}</div></div>
<span class="vio btn">${esc(d.btn || 'Написать')}</span></div></div>`;
    },
    sample: { bg: 'yellow', eyebrow: '', title: 'Хотите так же\nдля своего\nпродукта?', lead: 'Расскажите о задаче, подберем аудиторию и сценарий', c_label: 'Пишите в бота', contact: 'Бот CVM в Buzz', btn: 'Написать', ill: 'aichat', ill2: 'spark' },
  };

  T['video-cover'] = {
    name: 'Обложка ролика', group: 'Ролики', rubrics: ['know', 'features', 'cases', 'team'], formats: ['169', '916'], bgs: ['violet', 'yellow'], bg: 'violet',
    desc: 'Первый кадр и превью ролика: тема, длительность, кнопка воспроизведения',
    fields: [F.bg, F.title(), F.lead, { k: 'dur', label: 'Длительность', type: 'text' }, F.ill('ill')],
    render(d, ctx) {
      const v = (d.bg || 'violet') === 'violet', wide = ctx.fmt === '169';
      // кнопка воспроизведения: белая станция на маршруте
      const play = (x, y, s) => `<div class="abs" style="left:${px(x)};top:${px(y)};width:${px(s)};height:${px(s)};border-radius:50%;z-index:6;display:flex;align-items:center;justify-content:center;background:#fff;box-shadow:0 18px 32px -16px rgba(40,20,120,.45)">
<svg width="${s * .34}" height="${s * .34}" viewBox="0 0 24 24"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z" fill="${v ? '#6B4EFF' : '#141414'}"/></svg></div>`;
      const tint = v ? 'clear' : 'violet';
      if (wide) {
        return `${way(d.bg, { w: 1920, h: 1080, sw: 16, pts: [[2000, 230], [1440, 230], [1440, 880], [2000, 880]] })}
${d.ill ? I.tile(d.ill, { x: 1440 - 190, y: 555 - 190, size: 380, tint, rot: -6 }) : ''}${play(1600, 880 - 95, 190)}
<div class="in" style="padding:96px 120px">${head(ctx)}<h1 class="h1" style="font-size:120px;margin-top:110px;max-width:1040px">${md(d.title)}</h1>
${d.lead ? `<p class="lead" style="margin-top:34px;max-width:820px;font-size:38px">${md(d.lead)}</p>` : ''}<div class="grow"></div>
${d.dur ? `<div><span class="chip lg" style="height:64px;font-size:28px;padding:0 28px 0 12px;border-radius:32px"><span class="orb" style="width:40px;height:40px"></span>${esc(d.dur)}</span></div>` : ''}</div>`;
      }
      return `${way(d.bg, { h: 1920, sw: 16, pts: [[1160, 980], [540, 980], [540, 1640], [1160, 1640]] })}
${d.ill ? I.tile(d.ill, { x: 540 - 200, y: 1310 - 200, size: 400, tint, rot: -6 }) : ''}${play(760, 1640 - 90, 180)}
<div class="in" style="padding:110px 80px 100px">${head(ctx)}<h1 class="h1" style="font-size:120px;margin-top:110px">${md(d.title)}</h1>
${d.lead ? `<p class="lead" style="margin-top:36px;font-size:40px">${md(d.lead)}</p>` : ''}<div class="grow"></div>
${d.dur ? `<div><span class="chip lg" style="height:64px;font-size:28px;padding:0 28px 0 12px;border-radius:32px"><span class="orb" style="width:40px;height:40px"></span>${esc(d.dur)}</span></div>` : ''}</div>`;
    },
    sample: { bg: 'violet', title: 'Почему клиенту не пришла рассылка?', lead: 'Объясняем контактную политику за минуту', dur: '1 минута', ill: 'shield' },
  };

  T['avatar'] = {
    name: 'Аватар канала', group: 'Канал', rubrics: [], formats: ['11'], bgs: ['yellow', 'violet'], bg: 'yellow',
    desc: 'Желтый фон, жирное черное название и фиолетовый маршрут. Важное держим в центральном круге',
    fields: [F.bg, { k: 'text', label: 'Надпись', type: 'textarea' }, F.ill('ill', 'Кружок')],
    render(d) {
      const v = d.bg === 'violet';
      return `${way(d.bg, { w: 1080, h: 1080, sw: 22, r: 90, pts: [[-60, 700], [866, 700], [866, 330]], stops: d.ill ? [] : [{ at: [866, 330], type: 'end' }] })}
<div class="abs" style="inset:0;z-index:3;display:flex;align-items:center;justify-content:center;text-align:center">
<div style="font-size:250px;font-weight:900;letter-spacing:-.05em;line-height:.86;color:${v ? '#fff' : 'var(--ink)'};margin-top:-40px">${md(d.text)}</div></div>
${d.ill ? I.orbIcon(d.ill, { x: 866 - 70, y: 330 - 70, size: 140, color: v ? 'gold' : 'violet', z: 4 }) : ''}`;
    },
    sample: { bg: 'yellow', text: 'CVM', ill: 'spark' },
  };

  T['channel-header'] = {
    name: 'Шапка канала', group: 'Канал', rubrics: [], formats: ['31'], bgs: ['yellow', 'violet', 'white'], bg: 'yellow',
    desc: 'Название, обещание канала и четыре рубрики. Размер шапки уточнить в Buzz',
    fields: [F.bg, F.title('Название'), F.lead, { k: 'show_rubrics', label: 'Показать рубрики', type: 'check' }],
    render(d) {
      const chips = d.show_rubrics ? `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px">${Object.values(RUBRICS).map((r) => `<span class="chip lg" style="height:48px;font-size:21px;padding:0 20px 0 9px"><span class="orb" style="width:28px;height:28px"></span>${esc(r.label)}</span>`).join('')}</div>` : '';
      return `${way(d.bg, { w: 1500, h: 500, sw: 12, r: 60, pts: [[1560, 400], [1190, 400], [1190, 60], [1560, 60]] })}
${I.tile('aichat', { x: 1190 - 95, y: 230 - 95, size: 190, tint: 'violet', rot: -6 })}${I.orbIcon('spark', { x: 1360 - 46, y: 400 - 46, size: 92, color: 'gold' })}
<div class="in" style="padding:64px 72px">
<h1 class="h1" style="font-size:96px">${md(d.title)}</h1>${d.lead ? `<p class="lead" style="margin-top:16px;font-size:30px;max-width:820px">${md(d.lead)}</p>` : ''}${chips}</div>`;
    },
    sample: { bg: 'yellow', title: 'CVM B2B Делает', lead: 'Как мы находим нужных клиентов и помогаем продуктам расти', show_rubrics: true },
  };

  // ---------- рецепты рубрик ----------
  const RECIPES = {
    cases: [
      { name: 'Кейс с диалогом, 6 карточек', why: 'Классика рубрики: крючок, контекст, три шага метода, итог', cards: ['cover-hero', 'context', 'dialog', 'dialog', 'dialog', 'summary'] },
      { name: 'Кейс с цифрой, 4 карточки', why: 'Когда результат ярче диалога', cards: ['cover-number', 'compare', 'dialog', 'cta'] },
    ],
    know: [
      { name: 'Механика простыми словами, 5 карточек', why: 'Вопрос, термин, проверка по шагам, цифра, призыв', cards: ['cover-question', 'explain', 'steps', 'fact', 'cta'] },
      { name: 'Ролик', why: 'Обложка 16:9 или 9:16, в тексте поста вопрос, на который отвечает ролик', cards: ['video-cover'] },
    ],
    features: [
      { name: 'Релиз с атрибутами, 5 карточек', why: 'Метка релиза, по карточке на атрибут, как запустить', cards: ['cover-release', 'attribute', 'attribute', 'steps', 'cta'] },
      { name: 'Одна фича, 1 карточка', why: 'Короткий анонс в ленте: метка релиза и веер иллюстраций', cards: ['cover-release'] },
    ],
    team: [
      { name: 'Знакомство, 4 карточки', why: 'Лицо, роль и задачи, мысль человека, куда писать', cards: ['cover-person', 'person', 'quote', 'cta'] },
    ],
  };

  // ---------- эталонный пост ----------
  const POST3 = {
    name: 'Пост 3 · кейс допродажи Облачной АТС', format: '45', rubric: 'cases',
    text: '💬 #реальные_кейсы\n\nОтказался от всех предложений, а через 37 секунд согласился\n\nУ клиента билайн бизнес пропал мобильный интернет на всех SIM, и он задумался о переходе к другому оператору. Наш ИИ-агент не стал спорить: предложил Облачную АТС, которая работает через Wi-Fi, и договорился о звонке специалиста в тот же день\n\nВ карточках весь диалог по шагам и прием, который можно повторить\n\nКакое возражение клиентов чаще всего мешает вашему продукту?\n\n👉 Хотите так же для своего продукта? Пишите в бота CVM: [ссылка на бота]',
    cards: [
      { t: 'cover-hero', d: T['cover-hero'].sample },
      { t: 'context', d: T['context'].sample },
      { t: 'dialog', d: { step: '1', eyebrow: 'Диалог, часть 1 из 3', title: 'Сначала разобрался\nв проблеме', msgs: [
        { who: 'sep', text: 'клиент отвечает через 4,5 часа' },
        { who: 'client', text: 'Добрый день.\nНа сегодняшний день [[рассматриваю вопрос по переходу к другому оператору]], т.к. интернет отсутствует на всех Sim-картах билайн.\nПодключение возможно только от wi-fi', sub: '12:27', badge: 'возражение' },
        { who: 'agent', text: '[[Понимаю, что ситуация неприятная.]] Ограничения в работе связи иногда связаны с государственными мерами безопасности и [[не зависят от конкретного оператора]], из-за этого мобильный интернет может временно не работать.\nДавайте сделаем так: я предложу провести короткий звонок со специалистом, он проверит ситуацию по вашей компании и подскажет, какие решения возможны. Удобно будет созвониться?', sub: '12:27' }] } },
      { t: 'dialog', d: T['dialog'].sample },
      { t: 'dialog', d: { step: '3', eyebrow: 'Диалог, часть 3 из 3', title: 'Звонок специалиста\nв тот же день', msgs: [
        { who: 'agent', text: 'Понял, {{Екатерина}}. Тогда сделаем просто, передам вашу задачу специалисту, и он свяжется, когда будет удобно, чтобы обсудить тестирование и проверить параметры связи.\nПодскажите, в какой день вам было бы комфортно принять звонок, [[сегодня или завтра?]]', sub: '12:28' },
        { who: 'client', text: 'Сегодня', sub: '12:29' },
        { who: 'note', text: 'Агент дал выбор из двух дней, клиент выбрал сегодня' },
        { who: 'agent', text: 'Отлично, тогда [[передам специалисту запрос на обратный звонок сегодня]]. Он уточнит ситуацию по связи и расскажет, как подключить тест Облачной АТС.\nВ какое время вам будет удобно принять звонок?', sub: '12:30' }] } },
      { t: 'summary', d: T['summary'].sample },
    ],
  };

  const SAMPLES = {
    post3: POST3,
    know: { name: 'Пример · А знаете ли вы? (условный текст)', format: '45', rubric: 'know', example: true,
      cards: ['cover-question', 'explain', 'steps', 'cta'].map((t) => ({ t, d: Object.assign({}, T[t].sample, t === 'cta' ? { bg: 'violet', title: 'Остались\nвопросы\nпро рассылки?', lead: 'Разберем, почему кампания не дошла до клиента', contact: 'Бот CVM в Buzz', btn: 'Спросить', ill: 'message', ill2: 'question' } : {}) })) },
    features: { name: 'Пример · Новые фичи (условный текст)', format: '45', rubric: 'features', example: true,
      cards: [{ t: 'cover-release', d: T['cover-release'].sample }, { t: 'attribute', d: T['attribute'].sample },
        { t: 'steps', d: { bg: 'white', eyebrow: 'Как запустить', title: 'Три шага\nдо кампании', items: [{ title: 'Опишите задачу', text: 'Продукт, цель и кому хотите предложить' }, { title: 'Соберем аудиторию', text: 'По атрибутам профиля и истории клиента' }, { title: 'Запустим и покажем результат', text: 'Отчет по кампании придет после запуска' }] } },
        { t: 'cta', d: Object.assign({}, T['cta'].sample, { bg: 'yellow', title: 'Какой атрибут\nнужен вашему\nпродукту?', ill: 'idcard', ill2: 'rocket' }) }] },
    team: { name: 'Пример · Знакомство с командой (условный текст)', format: '45', rubric: 'team', example: true,
      cards: [{ t: 'cover-person', d: T['cover-person'].sample }, { t: 'person', d: T['person'].sample }, { t: 'quote', d: Object.assign({}, T['quote'].sample, { name: 'Имя Фамилия', role: 'Роль в команде CVM', text: 'Приходите с задачей, а не с готовым решением. [[Вместе найдем, кому и что предложить]]' }) },
        { t: 'cta', d: Object.assign({}, T['cta'].sample, { title: 'С какой задачей\nпридете\nпервыми?', ill: 'users', ill2: 'message' }) }] },
  };

  // ---------- рендер ----------
  function renderCard(card, post, idx, total) {
    const tpl = T[card.t];
    if (!tpl) return `<div class="cv f-45 bg-white"><div class="in"><div class="lead">Нет шаблона «${esc(card.t)}»</div></div></div>`;
    const d = card.d || {};
    let fmt = card.f || (post && post.format) || tpl.formats[0];
    if (tpl.formats.indexOf(fmt) < 0) fmt = tpl.formats[0];
    const bg = tpl.bgs.indexOf(d.bg) >= 0 ? d.bg : tpl.bg;
    const f = FORMATS[fmt];
    const ctx = { idx: idx || 0, total: total || 1, rubric: RUBRICS[(post && post.rubric) || 'cases'] || RUBRICS.cases, fmt, bg, W: f.w, H: f.h };
    const dd = Object.assign({}, d, { bg });
    return `<div class="cv f-${fmt} bg-${bg}${PASTELS[bg] ? ' pastel' : ''}" data-t="${card.t}">${tpl.render(dd, ctx)}</div>`;
  }
  const size = (card, post) => {
    const tpl = T[card.t]; let fmt = card.f || (post && post.format) || (tpl && tpl.formats[0]) || '45';
    if (tpl && tpl.formats.indexOf(fmt) < 0) fmt = tpl.formats[0];
    return FORMATS[fmt];
  };

  root.CVMTpl = { TEMPLATES: T, RUBRICS, FORMATS, BG_NAMES, PASTELS, RECIPES, SAMPLES, renderCard, size, md, plain, BRAND };
})(typeof window !== 'undefined' ? window : globalThis);
