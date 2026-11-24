/* Страница «Рынок»: приемы B2B-писем конкурентов и лидеров рынка и блоки каталога, собранные по ним
   Данные приемов ниже, разметка блоков из CVMMail.get, источники из CVMMail.SRC (registry.js) */
(function () {
  'use strict';
  const M = window.CVMMail;
  const R = M.SRC || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // n: название, codes: блоки каталога, who: источники из CVMMail.SRC, why: почему работает, ours: как у нас
  const PAT = [
    { n: 'Итоги периода', codes: ['mkt.usage'], who: ['vercel', 'loom', 'snyk'], why: 'Свои цифры напоминают, за что клиент платит, и заменяют поток отдельных уведомлений', ours: 'Три цифры живым текстом в ячейках, сравнение с прошлым месяцем, один совет и одна кнопка. На мобильном столбиком' },
    { n: 'Порог потребления', codes: ['mkt.limit', 'mkt.limit2'], who: ['aws', 'voda'], why: 'AWS пишет при 85% лимита, Vodafone отправляет алерт администратору общего тарифа. Письмо получает тот, кто платит и может докупить', ours: 'Процент числом с желтой чертой, без полосы-графика. Письмо администратору договора, второе письмо в момент, когда пакет закончился' },
    { n: 'Вход с нового устройства', codes: ['mkt.login'], who: ['notionIn', 'linearIn', 'google'], why: 'Детали строками и фраза «если это вы, ничего делать не нужно» снимают тревогу. В подборке Sequenzy 38% таких писем с одной кнопкой, 36% совсем без верстки', ours: 'Без иллюстрации и рекламы, одно действие в рамке, строка о том, что мы не просим пароли и коды' },
    { n: 'Счет готов', codes: ['mkt.bill', 'mkt.billauto'], who: ['bt', 'atl', 'stripe'], why: 'Письмо понятно и бухгалтеру, и администратору. Atlassian шлет превью счета всем контактам по оплате за 3 дня до списания', ours: 'Сумма крупно, срок Bold, кнопка и ссылки на счет и акт. С автоплатежом кнопки нет, только дата списания' },
    { n: 'Пробный период заканчивается', codes: ['mkt.trial'], who: ['stripe', 'life', 'notion'], why: 'Stripe напоминает за 7 дней, в теме точный срок. Клиенту сразу понятно, что будет с данными', ours: 'Дата в рамке 2 px без заливки, что будет с номерами и одна кнопка' },
    { n: 'Тариф заканчивается', codes: ['mkt.renew'], who: ['mtslink', 'stripe'], why: 'МТС Линк шлет цепочку за 10 дней, за день и в день окончания, с названием тарифа и датой в теме. Плашка «если вы уже продлили, не волнуйтесь» снимает лишние обращения', ours: 'Серая рамка 1 px вместо цветной заливки, одна кнопка обычным регистром, строка про менеджера и чат' },
    { n: 'Требуется действие', codes: ['mkt.action'], who: ['awsH'], why: 'AWS делит уведомления на «требуется действие», «может потребоваться» и «для сведения» и предупреждает о плановых изменениях за 90–180 дней', ours: 'Метка в желтой рамке, срок датой, последствие мелким текстом. Слова «Требуется действие» стоят и в теме письма' },
    { n: 'Что нового', codes: ['mkt.news'], who: ['changelog', 'figma', 'loomUpd'], why: 'Группы «Новое», «Улучшили», «Исправили» читаются по диагонали. Ритм раз в месяц или раз в две недели', ours: 'Метки в контурной рамке, заголовок и строка пояснения, ссылка на все обновления' },
    { n: 'Подборка по темам', codes: ['mkt.digest'], who: ['selectel', 'tbs'], why: 'Selectel собирает дайджест из тем, которые подписчик выбрал сам, и дает ссылку «настройте контент под себя». Т‑Бизнес секреты начинают письмо сразу с текста, без картинки', ours: 'Разделы в рамках 1 px, ссылки текстом, без фото и карточек статей' },
    { n: 'Письмо от человека', codes: ['mkt.letter'], who: ['intercom', 'litmusB2B'], why: 'У Intercom три шаблона: от компании, от сотрудника и простой, как обычное письмо. Litmus советует писать ключевым клиентам от имени менеджера', ours: 'Логотип, обращение по имени, два абзаца и подпись с прямыми контактами. Без кнопки, минимальный подвал' },
    { n: 'Помощь рядом', codes: ['mkt.help'], who: ['selectel', 'mtslink'], why: 'Selectel ставит в тело письма телефон, почту, Telegram и поддержку 24/7, МТС Линк отправляет к менеджеру или в кабинет', ours: 'Три способа связаться: телефон, чат, менеджер. Иконки PNG ×2 со светлой обводкой, чтобы не пропали в темной теме' },
    { n: 'Оценка в один клик', codes: ['mkt.nps'], who: ['hubspot', 'life'], why: 'Ответ одним кликом без анкеты, по клику запускается сценарий: благодарность, просьба об отзыве или звонок менеджера', ours: 'Цифры 0–10 ссылками в рамках без заливки, на мобильном в два ряда' },
    { n: 'Было ли письмо полезным', codes: ['mkt.yesno'], who: ['tbs', 'selectel'], why: 'Т‑Бизнес секреты заканчивают дайджест вопросом «Было ли письмо интересно?» с ответами «Да» и «Нет»', ours: 'Две ссылки в рамках в конце контентного письма' },
    { n: 'Подвал с настройкой частоты', codes: ['mkt.foot'], who: ['tbs', 'gmail', 'law18'], why: 'Т‑Бизнес объясняет, почему пришло письмо, предлагает получать реже и отписаться от темы или от всех рассылок. Gmail требует отписку в один клик, 38‑ФЗ требует прекратить рассылку по просьбе адресата', ours: 'Причина подписки и три ссылки над юридическим текстом' },
  ];

  const src = (k) => R[k] ? `<a href="${R[k][1]}" target="_blank" rel="noopener">${esc(R[k][0])} ↗</a>` : '';
  const bare = (c) => c === 'mkt.foot';
  const prev = (c) => {
    const it = M.find(c);
    const h = it ? it.html() : M.get(c);
    return `<div class="mk-pv" data-code="${c}"><div class="mk-z"><div class="ml${bare(c) ? '' : ''}">${h}</div></div></div>`;
  };

  $('#pat').innerHTML = PAT.map((x, i) => `<article class="mk-p" id="p-${x.codes[0].split('.')[1]}">
    <div class="mk-t">
      <div class="sec-k"><i>${String(i + 1).padStart(2, '0')}</i>Прием</div>
      <h3>${esc(x.n)}</h3>
      <dl>
        <dt>Кто так делает</dt><dd><ul>${x.who.map((k) => `<li>${src(k)}</li>`).join('')}</ul></dd>
        <dt>Почему работает</dt><dd>${esc(x.why)}</dd>
        <dt>Как у нас</dt><dd>${esc(x.ours)}</dd>
      </dl>
      <p class="mk-codes">${x.codes.map((c) => `<a class="btn sm" href="catalog.html#k-${c}">${esc((M.find(c) || {}).nm || c)} <code>${c}</code></a>`).join('')}</p>
    </div>
    ${prev(x.codes[0])}
  </article>`).join('');

  // счетчики
  const blocks = (M.CATALOG.find((g) => g.id === 'mkt') || { items: [] }).items.length;
  const lays = (M.LAYOUTS || []).filter((L) => L.ref && L.ref.length).length;
  $('#tally').innerHTML = `<span class="pill">Приемов<b>${PAT.length}</b></span><span class="pill st-mkt">Блоков «По рынку»<b>${blocks}</b></span><span class="pill">Макетов по приемам<b>${lays}</b></span><span class="pill">Источников<b>${Object.keys(R).length}</b></span>`;
  $('#lays').innerHTML = (M.LAYOUTS || []).filter((L) => L.ref && L.ref.length).map((L) => `<li><a href="layouts.html#l-${L.id}">${esc(L.name)}</a><span>${esc(L.cat)}</span></li>`).join('');

  // масштаб превью под ширину колонки
  const fit = () => $$('.mk-pv').forEach((el) => {
    const w = el.clientWidth;
    if (w > 0) el.style.setProperty('--mz', Math.min(1, w / 720).toFixed(4));
  });
  let rt = 0;
  const later = () => { cancelAnimationFrame(rt); rt = requestAnimationFrame(fit); };
  window.addEventListener('resize', later);
  window.addEventListener('load', later);
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(later); $$('.mk-pv').forEach((el) => ro.observe(el)); }
  fit();
})();
