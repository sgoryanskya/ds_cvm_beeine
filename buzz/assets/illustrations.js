/* Канал CVM в Buzz · 3D-библиотека иллюстраций в стекле
   Глиф рисуется на сетке 24x24 простыми примитивами. Из одного глифа получаются:
   gold()  золотой объемный знак: толщина снизу, тень, блик по верхней кромке;
   ink()   плоский знак для сфер и бейджей;
   tile(), orbIcon(), badge()  готовые композиции;
   route()  фирменный маршрут канала: линия со станциями от проблемы к результату.
   Новый глиф = одна запись в GLYPHS, стиль подтянется сам. */
(function (root) {
  'use strict';
  let UID = 0;
  const uid = () => (++UID).toString(36);
  const r1 = (n) => Math.round(n * 100) / 100;

  // дуга по углам в градусах, 0 = вправо, 270 = вверх
  function A(cx, cy, r, a0, a1) {
    const p = (a) => [r1(cx + r * Math.cos(a * Math.PI / 180)), r1(cy + r * Math.sin(a * Math.PI / 180))];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    return `M${x0} ${y0}A${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  }
  const STAR = (cx, cy, s) => {
    const k = s / 9.2;
    const q = (x, y) => `${r1(cx + x * k)} ${r1(cy + y * k)}`;
    return `M${q(0, -9.2)}C${q(.6, -4.5)} ${q(2.5, -1.6)} ${q(9.2, 0)}C${q(2.5, 1.6)} ${q(.6, 4.5)} ${q(0, 9.2)}C${q(-.6, 4.5)} ${q(-2.5, 1.6)} ${q(-9.2, 0)}C${q(-2.5, -1.6)} ${q(-.6, -4.5)} ${q(0, -9.2)}Z`;
  };

  // p: контур, c: окружность, r: прямоугольник, fp/f/fr: то же с заливкой
  const GLYPHS = {
    wifi:     { name: 'Wi-Fi', tags: 'связь, облачная атс', d: [['p', A(12, 17.6, 3.6, 225, 315)], ['p', A(12, 17.6, 7.4, 225, 315)], ['p', A(12, 17.6, 11.2, 225, 315)], ['f', 12, 17.6, 1.75]] },
    phone:    { name: 'Звонок', tags: 'звонок, специалист, атс', d: [['fp', 'M6.6 3.5h2.7l1.3 4-2 1.5a11 11 0 0 0 6.4 6.4l1.5-2 4 1.3v2.7a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z']] },
    cloud:    { name: 'Облако', tags: 'облачная атс, облако', d: [['p', 'M7 18.5H17A4.25 4.25 0 0 0 17.6 10.2A5.6 5.6 0 0 0 6.6 11.2A3.7 3.7 0 0 0 7 18.5Z']] },
    sim:      { name: 'SIM-карта', tags: 'sim, мобильная связь, тариф', d: [['p', 'M8 3h6.5L19 7.5V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z'], ['r', 9.2, 11.2, 5.6, 6.4, 1.2], ['p', 'M12 11.2v6.4']] },
    signal:   { name: 'Сигнал', tags: 'мобильная сеть, интернет', d: [['fr', 3.6, 16, 3.2, 4.4, 1.1], ['fr', 8.1, 12.6, 3.2, 7.8, 1.1], ['fr', 12.6, 9, 3.2, 11.4, 1.1], ['fr', 17.1, 5, 3.2, 15.4, 1.1]] },
    headset:  { name: 'Горячая линия', tags: '8 800, поддержка', d: [['p', A(12, 13, 7.6, 180, 360)], ['r', 3.4, 13, 3.8, 6, 1.6], ['r', 16.8, 13, 3.8, 6, 1.6], ['p', 'M18.7 19c0 1.6-1.6 2.6-4.2 2.6h-1.4']] },
    camera:   { name: 'Камера', tags: 'видеонаблюдение, видеоаналитика', d: [['p', 'M3.4 9.4L15.6 6.1L17.3 12.4L5.1 15.7Z'], ['p', 'M17.6 7.4l3.1-.8.9 3.3-3.1.8'], ['p', 'M10.2 14.3l1 3.9h4.6'], ['p', 'M15.8 15.8v5'], ['f', 7.4, 11.5, 1.1]] },
    chip:     { name: 'Чип M2M', tags: 'm2m, iot, устройства', d: [['r', 7, 7, 10, 10, 2.2], ['p', 'M9.6 3.6v3.4M14.4 3.6v3.4M9.6 17v3.4M14.4 17v3.4M3.6 9.6H7M3.6 14.4H7M17 9.6h3.4M17 14.4h3.4'], ['f', 12, 12, 1.7]] },
    message:  { name: 'Сообщение', tags: 'смс, express, рассылка', d: [['p', 'M5.2 4.5h13.6a2.2 2.2 0 0 1 2.2 2.2v8.6a2.2 2.2 0 0 1-2.2 2.2H11l-4.6 3.6v-3.6H5.2A2.2 2.2 0 0 1 3 15.3V6.7a2.2 2.2 0 0 1 2.2-2.2z'], ['p', 'M7.6 9.4h8.8M7.6 13h5.6']] },
    mail:     { name: 'Письмо', tags: 'email, рассылка', d: [['r', 3, 5.5, 18, 13, 2.4], ['p', 'M3.9 7.4l8.1 5.9 8.1-5.9']] },
    aichat:   { name: 'ИИ-агент', tags: 'агент, ии, диалог', d: [['p', 'M5.2 4.5h13.6a2.2 2.2 0 0 1 2.2 2.2v8.6a2.2 2.2 0 0 1-2.2 2.2H11l-4.6 3.6v-3.6H5.2A2.2 2.2 0 0 1 3 15.3V6.7a2.2 2.2 0 0 1 2.2-2.2z'], ['fp', STAR(12, 11, 4.4)]] },
    spark:    { name: 'Искра ИИ', tags: 'ии, агент, автоматизация', d: [['fp', STAR(11, 12.6, 8.6)], ['fp', STAR(19.2, 4.8, 2.6)]] },
    chart:    { name: 'Рост', tags: 'рост, результат, метрики', d: [['p', 'M3.6 20h16.8'], ['p', 'M4.6 15.6l4.6-4.6 3.6 3.1 6.6-7'], ['p', 'M15.2 7h4.2v4.2']] },
    target:   { name: 'Цель', tags: 'аудитория, сегмент, таргет', d: [['c', 12, 12, 8.6], ['c', 12, 12, 4.8], ['f', 12, 12, 1.8]] },
    funnel:   { name: 'Воронка', tags: 'воронка, конверсия, отбор', d: [['p', 'M3.8 4.8h16.4l-6.3 7.7v5.6l-3.8 2.4v-8z']] },
    user:     { name: 'Клиент', tags: 'клиент, профиль', d: [['c', 12, 8.4, 3.7], ['p', 'M4.8 20.2c.8-3.9 3.6-6 7.2-6s6.4 2.1 7.2 6']] },
    users:    { name: 'Команда', tags: 'команда, люди, знакомство', d: [['c', 9, 9, 3.2], ['p', 'M3.2 19.8c.7-3.5 2.9-5.4 5.8-5.4s5.1 1.9 5.8 5.4'], ['c', 16.6, 8.2, 2.6], ['p', 'M15.6 13.4c2.7.1 4.6 1.9 5.2 4.9']] },
    idcard:   { name: 'Атрибут профиля', tags: 'атрибут, данные, профиль', d: [['r', 3, 5.5, 18, 13, 2.4], ['c', 8.6, 10.6, 2], ['p', 'M5.9 15.8c.5-1.5 1.5-2.3 2.7-2.3s2.2.8 2.7 2.3'], ['p', 'M14 10h4.4M14 13.6h3']] },
    shield:   { name: 'Защита', tags: 'контактная политика, правила', d: [['p', 'M12 3l7.5 3v5.6c0 4.7-3.1 8.2-7.5 9.4-4.4-1.2-7.5-4.7-7.5-9.4V6z'], ['p', 'M8.7 12.1l2.3 2.3 4.4-4.6']] },
    bell:     { name: 'Уведомление', tags: 'уведомление, триггер', d: [['p', 'M6.4 16.6v-5.4a5.6 5.6 0 0 1 11.2 0v5.4l1.6 2H4.8z'], ['p', 'M10 21h4'], ['p', 'M12 3.4v2']] },
    rocket:   { name: 'Запуск', tags: 'новые фичи, релиз, запуск', d: [['p', 'M12 2.8c3.2 2.4 4.6 5.6 4.3 9.9L14 17h-4l-2.3-4.3C7.4 8.4 8.8 5.2 12 2.8z'], ['c', 12, 9.3, 1.6], ['p', 'M8 13.2l-3 3.2.5 3 3.2-1.5M16 13.2l3 3.2-.5 3-3.2-1.5'], ['p', 'M10.6 19.6c.3 1.1.8 1.7 1.4 2.1.6-.4 1.1-1 1.4-2.1']] },
    bulb:     { name: 'Идея', tags: 'а знаете ли вы, идея, факт', d: [['p', 'M8.7 15.6C6.8 14.3 5.6 12.2 5.6 9.9a6.4 6.4 0 0 1 12.8 0c0 2.3-1.2 4.4-3.1 5.7'], ['p', 'M9 17.8h6M9.9 20.8h4.2']] },
    question: { name: 'Вопрос', tags: 'а знаете ли вы, вопрос', d: [['p', 'M8.6 8.7a3.4 3.4 0 0 1 6.6 1.1c0 2.3-3.2 3-3.2 5.1'], ['f', 12, 18.9, 1.45]] },
    check:    { name: 'Готово', tags: 'успех, результат, да', d: [['p', 'M4.8 12.6l4.6 4.6L19.2 7.4']] },
    clock:    { name: 'Время', tags: 'время, скорость, сроки', d: [['c', 12, 12, 8.6], ['p', 'M12 7.4V12l3.1 2']] },
    bolt:     { name: 'Быстро', tags: 'скорость, мгновенно', d: [['fp', 'M13.6 2.6L5.4 13.6h6.1l-1 7.8 8.1-11.1h-6.1z']] },
    gift:     { name: 'Подарок', tags: 'бонус, оффер, акция', d: [['r', 4, 10, 16, 10.6, 1.6], ['r', 3, 6.8, 18, 3.6, 1.2], ['p', 'M12 6.8v13.8'], ['p', 'M12 6.8c-1.8-3.2-5.2-3.6-5.2-1.4 0 1.2 2 1.4 5.2 1.4M12 6.8c1.8-3.2 5.2-3.6 5.2-1.4 0 1.2-2 1.4-5.2 1.4']] },
    ruble:    { name: 'Рубль', tags: 'тариф, цена, деньги', d: [['p', 'M9 20.6V4.6h5a4 4 0 0 1 0 8H6.8'], ['p', 'M6.8 16.4h8']] },
    calendar: { name: 'Календарь', tags: 'дата, расписание, план', d: [['r', 3.4, 5, 17.2, 15.6, 2.4], ['p', 'M3.4 10h17.2M8 3v4M16 3v4'], ['f', 8.4, 14.6, 1.2], ['f', 12, 14.6, 1.2], ['f', 15.6, 14.6, 1.2]] },
    megaphone:{ name: 'Анонс', tags: 'анонс, новости', d: [['p', 'M4 10v4a1 1 0 0 0 1 1h2l8 4.6V4.4L7 9H5a1 1 0 0 0-1 1z'], ['p', 'M7.2 15l1.2 5h2.2'], ['p', 'M18.4 9.4a3.6 3.6 0 0 1 0 5.2']] },
    quote:    { name: 'Цитата', tags: 'цитата, мнение', d: [['fp', 'M4.6 12.4c0-3.6 2-6.2 5.3-7.3l.8 1.7c-1.9.9-3 2.2-3.2 4h2.6v5.8H4.6z'], ['fp', 'M13.4 12.4c0-3.6 2-6.2 5.3-7.3l.8 1.7c-1.9.9-3 2.2-3.2 4h2.6v5.8h-5.5z']] },
  };

  function prims(d, stroke, fill, sw) {
    const S = `fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
    return d.map((x) => {
      switch (x[0]) {
        case 'p': return `<path d="${x[1]}" ${S}/>`;
        case 'c': return `<circle cx="${x[1]}" cy="${x[2]}" r="${x[3]}" ${S}/>`;
        case 'r': return `<rect x="${x[1]}" y="${x[2]}" width="${x[3]}" height="${x[4]}" rx="${x[5] || 0}" ${S}/>`;
        case 'fp': return `<path d="${x[1]}" fill="${fill}"/>`;
        case 'f': return `<circle cx="${x[1]}" cy="${x[2]}" r="${x[3]}" fill="${fill}"/>`;
        case 'fr': return `<rect x="${x[1]}" y="${x[2]}" width="${x[3]}" height="${x[4]}" rx="${x[5] || 0}" fill="${fill}"/>`;
        default: return '';
      }
    }).join('');
  }

  // SVG как самодостаточная картинка: ссылки на градиенты и маски не теряются при экспорте в PNG
  const asImg = (svg, w, h, st) => `<img alt="" draggable="false" width="${Math.round(w)}" height="${Math.round(h)}" style="display:block;max-width:none;${st || ''}" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}">`;

  // золотой 3D-знак
  function gold(id, size, o) {
    o = o || {};
    const g = GLYPHS[id];
    if (!g) return '';
    const u = uid(), sw = o.sw || g.sw || 2.3;
    const body = (s, f) => prims(g.d, s, f, sw);
    const w = size * 30 / 26;
    return asImg(`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w)}" height="${Math.round(w)}" viewBox="-3 -3 30 30">
<defs>
<linearGradient id="gg${u}" gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="22"><stop offset="0" stop-color="#FFF4C4"/><stop offset=".3" stop-color="#FFDC50"/><stop offset=".62" stop-color="#FFC400"/><stop offset="1" stop-color="#E49B00"/></linearGradient>
<filter id="gs${u}" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="1" stdDeviation=".9" flood-color="#9A5A00" flood-opacity=".42"/></filter>
<mask id="gm${u}" maskUnits="userSpaceOnUse" x="-3" y="-3" width="30" height="30"><g>${body('#fff', '#fff')}</g><g transform="translate(.34 .5)">${body('#000', '#000')}</g></mask>
</defs>
<g transform="translate(.18 .62)">${body('#B87700', '#B87700')}</g>
<g filter="url(#gs${u})">${body(`url(#gg${u})`, `url(#gg${u})`)}</g>
<rect x="-3" y="-3" width="30" height="30" fill="#fff" opacity=".82" mask="url(#gm${u})"/>
</svg>`, w, w, `margin:${-Math.round((w - size) / 2)}px`);
  }

  // плоский знак
  function ink(id, size, color, o) {
    o = o || {};
    const g = GLYPHS[id];
    if (!g) return '';
    const c = color || '#141414';
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="display:block;overflow:visible">${prims(g.d, c, c, o.sw || 2.2)}</svg>`;
  }

  const px = (n) => `${Math.round(n)}px`;

  // объемная плитка со знаком: единственный 3D-объект сцены
  function tile(id, o) {
    o = o || {};
    const s = o.size || 310, tint = o.tint || 'violet', rot = o.rot == null ? -8 : o.rot;
    const pos = o.x != null ? `left:${px(o.x)};top:${px(o.y)};` : '';
    return `<div class="${o.x != null ? 'abs ' : ''}lg ill-tile t-${tint}" style="${pos}width:${px(s)};height:${px(s)};border-radius:${px(s * .3)};transform:rotate(${rot}deg);z-index:${o.z || 2}">${gold(id, s * .66)}</div>`;
  }

  // сфера со знаком: результат, действие
  function orbIcon(id, o) {
    o = o || {};
    const s = o.size || 128, y = (o.color || 'gold') === 'gold';
    const pos = o.x != null ? `left:${px(o.x)};top:${px(o.y)};` : '';
    return `<div class="${o.x != null ? 'abs ' : ''}orb big${y ? ' y' : ''}" style="${pos}width:${px(s)};height:${px(s)};z-index:${o.z || 4}">${ink(id, s * .44, y ? '#141414' : '#FFFFFF')}</div>`;
  }

  // бейдж: проблема или контекст, можно перечеркнуть
  function badge(id, o) {
    o = o || {};
    const s = o.size || 118;
    const pos = o.x != null ? `left:${px(o.x)};top:${px(o.y)};` : '';
    const strike = o.struck ? `<svg class="abs" style="inset:0" width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M27 27L73 73" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M27 27L73 73" stroke="#5B3FF0" stroke-width="5" stroke-linecap="round"/></svg>` : '';
    return `<div class="${o.x != null ? 'abs ' : ''}lg ill-badge" style="${pos}width:${px(s)};height:${px(s)};z-index:${o.z || 3}">${ink(id, s * .46, 'rgba(20,20,20,.34)')}${strike}</div>`;
  }

  // маршрут: фирменная линия канала. Ведет от проблемы к результату через станции.
  // Отрезки идут под прямым углом, углы скругляются. Точки за краем холста дают линию «из-за кадра»
  const ROUTE = { violet: ['#6B4EFF', '#FFFFFF'], white: ['#FFFFFF', '#6B4EFF'], ink: ['#141414', '#FFFFFF'] };
  function routePath(pts, r) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
      const k = Math.min(r, l1 / 2, l2 / 2);
      d += `L${r1(x1 - (x1 - x0) / l1 * k)} ${r1(y1 - (y1 - y0) / l1 * k)}Q${x1} ${y1} ${r1(x1 + (x2 - x1) / l2 * k)} ${r1(y1 + (y2 - y1) / l2 * k)}`;
    }
    const L = pts[pts.length - 1];
    return d + `L${L[0]} ${L[1]}`;
  }
  // станции: ring кольцо, dot точка, end конечная
  function stops(list, c, sw) {
    return (list || []).map((s) => {
      const [x, y] = s.at || s;
      const t = s.type || 'ring';
      if (t === 'dot') return `<circle cx="${x}" cy="${y}" r="${r1(sw * .95)}" fill="${c[0]}"/>`;
      if (t === 'end') return `<circle cx="${x}" cy="${y}" r="${r1(sw * 2.1)}" fill="${c[0]}"/><circle cx="${x}" cy="${y}" r="${r1(sw * .75)}" fill="${c[1]}"/>`;
      return `<circle cx="${x}" cy="${y}" r="${r1(sw * 1.35)}" fill="${c[1]}" stroke="${c[0]}" stroke-width="${r1(sw * .62)}"/>`;
    }).join('');
  }
  function route(o) {
    o = o || {};
    const W = o.w || 1080, H = o.h || 1350, sw = o.sw || 14, r = o.r == null ? 80 : o.r;
    const c = ROUTE[o.color || 'violet'] || [o.color, '#FFFFFF'];
    const path = o.pts && o.pts.length > 1 ? `<path d="${routePath(o.pts, r)}" fill="none" stroke="${c[0]}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` : '';
    return `<div class="layer route" style="left:0;top:0;width:${W}px;height:${H}px;z-index:${o.z || 1};opacity:${o.op == null ? 1 : o.op}">${asImg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${path}${stops(o.stops, c, sw)}</svg>`, W, H)}</div>`;
  }

  // мягкий свет за главным акцентом
  const GLOW = { violet: '124,92,255', yellow: '255,196,0', white: '255,255,255' };
  function glow(cx, cy, r, color, a) {
    const c = GLOW[color] || color;
    return `<div class="layer glow" style="left:${px(cx - r)};top:${px(cy - r)};width:${px(2 * r)};height:${px(2 * r)};background:radial-gradient(closest-side,rgba(${c},${a}),rgba(${c},${r1(a * .45)}) 45%,rgba(${c},0))"></div>`;
  }

  root.CVMIll = { GLYPHS, gold, ink, tile, orbIcon, badge, route, routePath, glow, A, STAR };
})(typeof window !== 'undefined' ? window : globalThis);
