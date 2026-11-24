/* Дизайн-система CVM B2B · раздел «Письма» · расширенный набор компонентов
   N        новые блоки с параметрами: N['steps.row']({ h, items }) возвращает HTML. Без параметров блок показывает условный пример
   first    первая карточка письма: логотип, иллюстрация или без нее, заголовок, дата в рамке или в тексте
   Стили в email.css, раздел «Расширенный набор». Тексты, цены и имена в примерах условные */
(function (root) {
  'use strict';
  const M = root.CVMMail;
  if (!M) return;
  const P = M.parts, IMG = M.IMG, I = root.CVMIll;
  const { card, btn, btns, hero } = P;

  // ---------- мелкие куски ----------
  const ink = (id, s, c, sw) => (I ? I.ink(id, s, c || 'currentColor', sw ? { sw } : undefined) : '');
  const gold = (id, s) => (I ? I.gold(id, s) : '');
  const oi = M.oi;
  const blk = (h, cls) => `<div class="m-blk${cls ? ' ' + cls : ''}">${h}</div>`;
  const ul = (items, cls) => `<ul class="m-ul${cls ? ' ' + cls : ''}">${items.map((t) => `<li>${t}</li>`).join('')}</ul>`;
  const pair = (x, y) => `<div class="m-pair">${x}${y}</div>`;
  const tri = (arr, cls) => `<div class="m-tri${cls ? ' ' + cls : ''}">${arr.join('')}</div>`;
  const A = (t, cls) => `<a${cls ? ` class="${cls}"` : ''} href="#" onclick="return false">${t}</a>`;
  const h2 = (t, cls) => (t ? `<h2 class="m-h2${cls ? ' ' + cls : ''}">${t}</h2>` : '');
  const ht = (t, cls) => (t ? `<h2 class="m-ht${cls ? ' ' + cls : ''}">${t}</h2>` : '');
  const p = (t, cls) => (t ? `<p class="m-p${cls ? ' ' + cls : ''}">${t}</p>` : '');
  const sbtn = (t) => `<a class="m-btn sm" href="#" onclick="return false">${t}</a>`;
  const kbtn = (t) => `<a class="m-btn k" href="#" onclick="return false">${t}</a>`;
  const more = (t) => `<p>${A(t + ' →', 'm-more')}</p>`;
  const kv = (rows) => `<dl class="m-kv">${rows.map((r) => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl>`;
  const av = (t, cls) => `<span class="m-av${cls ? ' ' + cls : ''}" aria-hidden="true">${t}</span>`;
  const store = (s, b) => `<a class="m-store" href="#" onclick="return false"><small>${s}</small><b>${b}</b></a>`;
  const STORES = store('Загрузите в', 'App Store') + store('Доступно в', 'RuStore') + store('Доступно в', 'Google Play');
  const LOGO = `<img class="lg-l" src="${IMG}logo-light.svg" width="222" height="34" alt="билайн бизнес"><img class="lg-d" src="${IMG}logo-dark.svg" width="222" height="34" alt="билайн бизнес">`;

  const CHK = '<svg class="m-c20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#FFC800"/><path d="M5.6 10.3l3 2.9 5.8-6" fill="none" stroke="#141414" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const XC = '<svg class="m-c20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" style="fill:var(--m-btn2)"/><path d="M6.8 6.8l6.4 6.4M13.2 6.8l-6.4 6.4" fill="none" stroke="#787878" stroke-width="2" stroke-linecap="round"/></svg>';
  const RING = '<span class="m-ring" aria-hidden="true"></span>';
  const ARR = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 10h12M11 5.5l4.5 4.5-4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const img = (k, w, h, alt, cls) => `<img${cls ? ` class="${cls}"` : ''} src="${IMG}${k}" width="${w}" height="${h}" alt="${alt}">`;
  const HERO_ALT = (k) => (M.HEROES[k] ? M.HEROES[k][1] : '');

  // ---------- первый экран ----------
  // ill: ключ иллюстрации из M.HEROES или false, h1, lead: строка или массив абзацев, frame: текст в желтой рамке (дата, условие), frameGrey: серая рамка 1 px для условия акции, partner: логотип партнера
  const first = (o) => {
    o = o || {};
    const ill = o.ill === false ? '' : P.hero(o.ill || 'unlimited');
    const fr = o.frame ? `<div class="m-frame solid fd${o.frameGrey ? ' gy' : ''}"><p class="m-p">${o.frame}</p></div>` : '';
    return card(P.head({ partner: o.partner }) + ill + `<div class="m-title${ill ? '' : ' top'}"><h1 class="m-h1">${o.h1}</h1>${fr}${[].concat(o.lead || []).map((t) => p(t)).join('')}</div>`);
  };

  // ---------- помощники для шагов, рамок и товаров ----------
  const seg = (n, k) => `<div class="m-prg">${Array.from({ length: n }, (_, i) => `<i${i < k ? ' class="on"' : ''}></i>`).join('')}</div>`;
  const segl = (labels, k) => `<div class="m-prg lb">${labels.map((t, i) => `<div${i < k ? ' class="on"' : ''}${i === k - 1 ? ' aria-current="step"' : ''}><i></i><span>${t}</span></div>`).join('')}</div>`;
  const chkl = (rows) => `<ul class="m-cl">${rows.map((r) => `<li${r[1] ? '' : ' class="off"'}>${r[1] ? CHK : RING}<span class="m-p">${r[0]}</span></li>`).join('')}</ul>`;
  const chat = (t) => `<div class="m-chat">${oi('chat')}<p class="m-p">${t || `Получить консультацию можно в чате с поддержкой билайн бизнес в ${A('личном кабинете Облачной АТС', 'm-a')}`}</p></div>`;
  const FLAME = '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.6 2.5c.6 3.2-1.4 4.9-2.9 6.4C8.4 10.2 7 11.8 7 14.4a5 5 0 0010 0c0-2.1-1-3.6-2.1-4.7-.1 1.5-.8 2.6-1.9 3.1.6-2.8-.2-6.4-.4-10.3z" fill="none" stroke="#FFC800" stroke-width="2" stroke-linejoin="round"/></svg>';
  const EQUIP = 'Предложение действительно при условии наличия оборудования у билайн. Цены указаны с учетом НДС и могут измениться на момент обращения. Клиент проходит обязательную процедуру скоринга, после которой получает одобрение по программе субсидирования';

  // ---------- новые компоненты по коду ----------
  const N = {
    // текст
    'text.cols': (o = {}) => card(blk(h2(o.h || 'Два способа подключить') + `<div class="m-two l">${(o.items || [['Онлайн', 'Оформите заявку в бизнес-кабинете, сим-карты привезет курьер'], ['С менеджером', 'Позвоните персональному менеджеру, он подберет тариф и подготовит договор']]).map((r) => `<div><p class="m-h3">${r[0]}</p><p class="m-p">${r[1]}</p></div>`).join('')}</div>`)),
    'text.more': (o = {}) => card(blk(h2(o.h || 'Новый тариф для удаленных сотрудников') + p(o.p || 'Безлимитные звонки внутри компании, 30 ГБ интернета и доступ к корпоративной почте с телефона') + more(o.link || 'Подробнее о тарифе'))),
    'text.faq': (o = {}) => card(blk(h2(o.h || 'Частые вопросы') + `<div class="m-faq">${(o.items || [['Нужно ли покупать оборудование?', 'Нет, Облачная АТС работает в браузере и в приложении на телефоне'], ['Можно ли сохранить старый номер?', 'Да, перенесем номер от другого оператора без перерыва в связи'], ['Сколько стоит подключение?', 'Подключение и настройка бесплатны, вы платите только абонентскую плату']]).map((r) => `<div><p class="m-h3">${r[0]}</p><p class="m-p m-sub">${r[1]}</p></div>`).join('')}</div>`)),
    'text.state': (o = {}) => card(blk(`<p class="m-st">${o.h || 'Каждый пропущенный звонок может стоить клиента'}</p>${p(o.p || 'Облачная АТС отдаст вызов свободному сотруднику и сохранит запись разговора', 'm-sub')}`, 'c')),
    'text.sign': (o = {}) => card(blk(`${(o.paras || ['Спасибо, что остаетесь с нами. В следующем году подготовим для вашей команды новые сервисы и персональные предложения', 'Если появятся вопросы, пишите или звоните мне напрямую']).map((t) => p(t)).join('')}<div class="m-sig">${av(o.ini || 'АС')}<p class="m-p">С уважением,<br><b>${o.name || 'Анна Смирнова'}</b><br><span class="m-sub">${o.role || 'ваш менеджер в билайн бизнес'}</span></p></div>`)),
    'text.post': (o = {}) => card(blk(h2(o.h || 'Мы обновили бизнес-кабинет') + p(o.p || 'Новый раздел «Документы» собирает счета, акты и договоры в одном списке с поиском по номеру') + `<p class="m-p m-ps2"><b>P.S.</b> ${o.ps || 'Ответьте на это письмо, если хотите, чтобы менеджер показал кабинет по видеосвязи'}</p>`)),
    'text.glyph': (o = {}) => card(blk(`<div class="m-tg"><div class="tx">${h2(o.h || 'Резервные копии каждую ночь')}${p(o.p || 'Облачное хранилище само сохраняет данные компании и хранит копии 30 дней')}</div><div class="gl">${gold(o.g || 'cloud', 110)}</div></div>`)),

    // списки
    'list.checks': (o = {}) => card(blk(h2(o.h || 'Что входит в тариф') + `<ul class="m-cl">${(o.items || ['безлимитные звонки внутри компании', '30 ГБ интернета в месяц', 'раздача интернета на ноутбук', 'бесплатный роуминг по России']).map((t) => `<li>${CHK}<span class="m-p">${t}</span></li>`).join('')}</ul>`)),
    'list.cross': (o = {}) => card(blk(h2(o.h || 'Что меняется с Облачной АТС') + `<div class="m-vs"><div><p class="m-h3">${o.l || 'Без АТС'}</p><ul class="m-cl">${(o.li || ['звонки теряются, когда линия занята', 'нет записей разговоров', 'статистику собирают вручную']).map((t) => `<li>${XC}<span class="m-p">${t}</span></li>`).join('')}</ul></div><div class="y"><p class="m-h3">${o.r || 'С Облачной АТС'}</p><ul class="m-cl">${(o.ri || ['вызов уходит свободному сотруднику', 'каждый разговор в записи', 'отчеты собираются сами']).map((t) => `<li>${CHK}<span class="m-p">${t}</span></li>`).join('')}</ul></div></div>`)),
    'list.chips': (o = {}) => card(blk(h2(o.h || 'Для каких задач подходит') + p(o.p || 'Видеоаналитика работает с камерами, которые уже стоят у вас') + `<div class="m-chips">${(o.items || ['очереди на кассах', 'подсчет посетителей', 'контроль выкладки', 'распознавание номеров', 'безопасность склада', 'тепловые карты']).map((t) => `<span>${t}</span>`).join('')}</div>`, 'c')),
    'list.twocol': (o = {}) => card(blk(h2(o.h || 'Какие услуги доступны в кабинете') + ul(o.items || ['счета и акты', 'детализация звонков', 'смена тарифа', 'блокировка номера', 'заказ сим-карт', 'доступы сотрудников', 'обращения в поддержку', 'отчеты по расходам'], 'c2'))),
    'list.dash': (o = {}) => card(blk(h2(o.h || 'Кому подойдет фемтосота') + ul(o.items || ['складам и подвальным помещениям', 'офисам в бизнес-центрах с толстыми стенами', 'загородным объектам и производствам', 'шоурумам, где клиенты жалуются на связь'], 'ds'))),

    // шаги
    'steps.row': (o = {}) => card(blk(h2(o.h || 'Как начать') + `<div class="m-srw">${(o.items || ['Оставьте заявку на сайте', 'Выберите номер в кабинете', 'Звоните из браузера']).map((t, i) => `<div><span class="m-num">${i + 1}</span><p class="m-p">${t}</p></div>`).join(`<span class="ar">${ARR}</span>`)}</div>`, 'c')),
    'steps.big': (o = {}) => card(blk(ht(o.h || 'Как запустить обучение') + `<ol class="m-bn">${(o.items || [['Подключите сервис', 'Доступ к платформе придет на почту в течение дня'], ['Добавьте сотрудников', 'Загрузите список или подключите корпоративный каталог'], ['Запустите тренировку', 'Сервис сам отправит учебные письма и соберет отчет']]).map((r, i) => `<li><span class="n">0${i + 1}</span><div><p class="m-h3">${r[0]}</p><p class="m-p m-sub">${r[1]}</p></div></li>`).join('')}</ol>`)),
    'steps.icons': (o = {}) => card(blk(h2(o.h || 'Как получить бонус') + `<div class="m-sic">${(o.items || [['message', 'Отправьте партнеру ссылку из кабинета'], ['idcard', 'Партнер подключает любую услугу'], ['ruble', 'Бонус приходит на ваш счет']]).map((r, i) => `<div><span class="ic">${ink(r[0], 24)}</span><p class="m-h3">Шаг ${i + 1}</p><p class="m-p">${r[1]}</p></div>`).join('')}</div>`, 'c')),
    'steps.cards': (o = {}) => card(blk(ht(o.h || 'Переезд офиса без перерыва в связи'), 'c')) + tri((o.items || ['Сообщите новый адрес менеджеру', 'Мы проверим подключение на месте', 'Переключим линию в день переезда']).map((t, i) => card(`<div class="m-sc"><span class="n">0${i + 1}</span><i class="m-dv"></i><p class="m-p">${t}</p></div>`)), 's1'),
    'steps.progress': (o = {}) => card(blk(`<p class="m-eb">${o.k || 'Шаг 2 из 4'}</p>${h2(o.h || 'Осталось добавить сотрудников')}<div class="m-prg">${(o.items || [1, 1, 0, 0]).map((v) => `<i${v ? ' class="on"' : ''}></i>`).join('')}</div><ul class="m-cl">${(o.list || [['Кабинет создан', 1], ['Договор подписан', 1], ['Сотрудники добавлены', 0], ['Номера распределены', 0]]).map((r) => `<li${r[1] ? '' : ' class="off"'}>${r[1] ? CHK : RING}<span class="m-p">${r[0]}</span></li>`).join('')}</ul><div class="m-btns l">${btn(o.button || 'Добавить сотрудников')}</div>`)),

    // преимущества
    'adv.grid4': (o = {}) => card(blk(h2(o.h || 'Почему выбирают билайн бизнес', 'm-c') + `<div class="m-g4">${(o.items || [['signal', 'Своя сеть', 'Связь и интернет без посредников'], ['headset', 'Поддержка 24/7', 'Отвечаем в чате, по телефону и в кабинете'], ['shield', 'Защита данных', 'Дата-центры в России и резервные копии'], ['ruble', 'Прозрачные счета', 'Все расходы по номерам в одном отчете']]).map((r) => `<div><span class="ic">${ink(r[0], 24)}</span><p class="m-h3">${r[1]}</p><p class="m-p m-sub">${r[2]}</p></div>`).join('')}</div>`)),
    'adv.yellow': (o = {}) => `<div class="mc ys">${blk(ht(o.h || 'Почему это выгодно') + ul(o.items || ['одна абонентская плата вместо трех', 'скидка 15% за каждую услугу в пакете', 'один менеджер и один счет'], 'wide') + (o.button ? btns(kbtn(o.button)) : ''))}</div>`,
    'adv.icons3': (o = {}) => card(blk(h2(o.h || 'Три причины перейти в облако') + `<div class="m-g3">${(o.items || [['bolt', 'Быстрый старт', 'Сервер готов через 10 минут'], ['shield', 'Надежность', 'Данные в двух дата-центрах'], ['chart', 'Гибкая цена', 'Платите за то, что используете']]).map((r) => `<div><div class="gl">${gold(r[0], 64)}</div><p class="m-h3">${r[1]}</p><p class="m-p m-sub">${r[2]}</p></div>`).join('')}</div>`, 'c')),

    // цифры
    'stats.big': (o = {}) => card(blk(`<p class="m-xl">${o.v || '15%'}</p><p class="m-h3">${o.h || 'сотрудников открывают фишинговые письма'}</p>${p(o.p || 'Обычно это не злой умысел, а спешка. Регулярные тренировки снижают долю таких кликов в несколько раз', 'm-sub')}`, 'c')),
    'stats.grid': (o = {}) => card(blk(h2(o.h || 'Облако в цифрах', 'm-c') + `<div class="m-sg">${(o.items || [['99,9%', 'доступность сервиса'], ['24/7', 'поддержка инженеров'], ['10 минут', 'на запуск сервера'], ['0 ₽', 'за перенос данных']]).map((r) => `<div><p class="v">${r[0]}</p><p class="l">${r[1]}</p></div>`).join('')}</div>`)),
    'stats.inline': (o = {}) => card(blk(h2(o.h || 'Что дает автоматизация', 'm-c') + `<div class="m-sin">${(o.items || [['−35%', 'пропущенных звонков'], ['2 мин', 'среднее ожидание'], ['100%', 'разговоров в записи']]).map((r) => `<div><p class="v">${r[0]}</p><p class="l">${r[1]}</p></div>`).join('')}</div>`)),

    // рамки и плашки
    'frame.info': (o = {}) => card(blk(h2(o.h || 'Связь в праздники') + p(o.p || 'С 31 декабря по 8 января поддержка работает в обычном режиме') + `<div class="m-inf"><span class="ic">${ink(o.g || 'bell', 22)}</span><p class="m-p">${o.note || 'Счета за декабрь придут 2 января, оплатить их можно до 25 января без пеней'}</p></div>`)),
    'frame.accent': (o = {}) => card(blk(h2(o.h || 'Перед работами') + `<div class="m-acl"><p class="m-p">${o.p || '<b>Важно:</b> сохраните открытые документы и предупредите сотрудников, что связь может прерываться на несколько минут'}</p></div>`)),
    'frame.deadline': (o = {}) => card(blk(h2(o.h || 'Месяц без абонентской платы') + p(o.p || 'Подключите Облачную АТС сейчас и пользуйтесь всеми функциями бесплатно') + `<div class="m-dl">${ink('clock', 20)}<span>${o.until || 'Предложение действует до <b>30 ноября</b>'}</span></div>` + btns(btn(o.button || 'Подключить')), 'c')),
    'frame.pair': (o = {}) => card(blk(h2(o.h || 'Условия акции') + `<div class="m-two pl">${(o.items || [['Для новых клиентов', 'Скидка 30% на три месяца при подключении от пяти номеров'], ['Для действующих', 'Второй номер бесплатно на полгода при переходе на новый тариф']]).map((r) => `<div class="m-plate"><p class="m-h3">${r[0]}</p><p class="m-p">${r[1]}</p></div>`).join('')}</div>`, 'c')),

    // разделители
    'divider.line': (o = {}) => card(blk(h2(o.h || 'Для отдела продаж') + p(o.p || 'Запись звонков, распределение входящих и интеграция с CRM')) + '<i class="m-hr"></i>' + blk(h2(o.h2 || 'Для руководителя') + p(o.p2 || 'Отчеты по каждому сотруднику и контроль пропущенных вызовов'))),
    'divider.yellow': (o = {}) => card(blk((o.items || ['Сим-карты приедут в офис на следующий день', 'Номера можно выбрать в кабинете заранее', 'Тариф меняется в любой момент без визита в офис']).map((t) => p(t)).join('<i class="m-dv"></i>'), 'c')),
    'divider.or': (o = {}) => card(blk(h2(o.h || 'Подключим за один день') + btns(btn(o.button || 'Оставить заявку')) + `<div class="m-or">${o.or || 'или'}</div>` + p(o.p || 'позвоните по номеру <b>8 800 000-00-00</b>, звонок бесплатный'), 'c')),
    'divider.heading': (o = {}) => `<h2 class="m-ht m-oh">${o.h || 'Еще больше возможностей'}</h2>` + pair(card(`<div class="m-tile"><div class="gl">${gold('cloud', 64)}</div><p class="m-h3">Облачное хранилище</p><p class="m-p m-sub">100 ГБ для документов команды</p></div>`), card(`<div class="m-tile"><div class="gl">${gold('shield', 64)}</div><p class="m-h3">Антивирус</p><p class="m-p m-sub">Защита рабочих устройств</p></div>`)),

    // плитки
    'tiles.links': (o = {}) => card(blk(h2(o.h || 'Быстрые ссылки') + `<div class="m-lnk">${(o.items || [['ruble', 'Счета и оплата', 'Скачать счет, акт или подключить автоплатеж'], ['users', 'Сотрудники', 'Добавить номер или настроить доступы'], ['chart', 'Расходы', 'Отчет по каждому номеру и отделу'], ['headset', 'Поддержка', 'Создать обращение и следить за статусом']]).map((r) => `<a href="#" onclick="return false"><span class="ic">${ink(r[0], 20)}</span><span class="tx"><b>${r[1]}</b><span>${r[2]}</span></span><span class="ar">${ARR}</span></a>`).join('')}</div>`)),
    'tiles.btn': (o = {}) => pair(...(o.items || [['wifi', 'Интернет в офис', 'Скорость до 1 Гбит/с', 'Подключить'], ['phone', 'Мобильная связь', 'Тарифы для команды', 'Выбрать']]).map((r) => card(`<div class="m-tile"><div class="gl">${gold(r[0], 72)}</div><p class="m-h3">${r[1]}</p><p class="m-p m-sub">${r[2]}</p>${sbtn(r[3])}</div>`))),
    'tiles.soft': (o = {}) => card(blk(h2(o.h || 'Что входит в пакет'), 'c')) + pair(...(o.items || [['bolt', 'Скорость', 'до 500 Мбит/с'], ['wifi', 'Wi-Fi', 'роутер в аренду за 0 ₽']]).map((r) => `<div class="mc ys"><div class="m-tile"><div class="gl">${gold(r[0], 72)}</div><p class="m-h3">${r[1]}</p><p class="m-p">${r[2]}</p></div></div>`)),
    'tiles.row4': (o = {}) => card(blk(h2(o.h || 'Все для связи в одном договоре') + `<div class="m-r4">${(o.items || [['phone', 'Мобильная связь'], ['wifi', 'Интернет'], ['cloud', 'Облако'], ['camera', 'Видеонаблюдение']]).map((r) => `<div><span class="ic">${ink(r[0], 28)}</span><p>${r[1]}</p></div>`).join('')}</div>`, 'c')),
    'tiles.photo': (o = {}) => pair(...(o.items || [['abonement', 'Как сократить расходы на связь', 'Пять настроек тарифа, о которых забывают'], ['medicine', 'Цифровая клиника за месяц', 'История одного внедрения']]).map((r) => card(`${img(M.HEROES[r[0]][0], 314, 196, HERO_ALT(r[0]), 'm-tph')}<div class="m-tpt"><p class="m-h3">${r[1]}</p><p class="m-p m-sub">${r[2]}</p>${A('Читать →', 'm-more')}</div>`))),

    // оффер
    'offer.big': (o = {}) => `<div class="mc ys"><div class="m-offer m-c"><p class="m-xxl">${o.v || '−30%'}</p><p class="m-lb">${o.h || 'на абонентскую плату три месяца'}</p>${p(o.p || 'Для новых клиентов Облачной АТС при подключении от пяти номеров')}${btns(kbtn(o.button || 'Получить скидку'))}</div></div>`,
    'offer.three': (o = {}) => card(blk(h2(o.h || 'Интернет для офиса', 'm-c') + `<div class="m-t3">${(o.items || [['Старт', '990 ₽', ['100 Мбит/с', 'роутер за 0 ₽']], ['Бизнес', '1 490 ₽', ['500 Мбит/с', 'роутер и Wi-Fi для гостей', 'статический IP']], ['Про', '2 490 ₽', ['1 Гбит/с', 'резервный канал', 'приоритетная поддержка']]]).map((t, i) => `<div class="m-plate${i === (o.hit === undefined ? 1 : o.hit) ? ' hit' : ''}">${i === (o.hit === undefined ? 1 : o.hit) ? '<span class="m-hit">Выбирают чаще</span>' : ''}<p class="m-h3">${t[0]}</p><p class="m-big">${t[1]}</p><p class="m-p m-sub">в месяц</p>${ul(t[2])}${btn('Выбрать', i !== (o.hit === undefined ? 1 : o.hit))}</div>`).join('')}</div>`)),
    'offer.timer': (o = {}) => card(blk(h2(o.h || 'До конца акции') + p(o.p || 'Скидка 40% на смартфоны и модемы при подключении связи') + `<div class="m-tm" role="img" aria-label="До конца акции 2 дня 14 часов 36 минут">${(o.items || [['02', 'дня'], ['14', 'часов'], ['36', 'минут']]).map((r) => `<div><b>${r[0]}</b><span>${r[1]}</span></div>`).join('')}</div>` + btns(btn(o.button || 'Успеть купить')), 'c')),
    'offer.list': (o = {}) => card(`<div class="m-offer"><span class="m-badge">${o.badge || 'Пакет для офиса'}</span>${h2(o.h || 'Связь, интернет и облако')}${ul(o.items || ['10 номеров с безлимитом внутри компании', 'интернет 500 Мбит/с', '100 ГБ в облачном хранилище'])}<div class="m-price"><p class="m-big">${o.price || '9 900 ₽'}</p><p class="per">${o.per || 'в месяц за весь пакет, без НДС'}</p></div><div class="m-btns l">${btn(o.button || 'Подключить пакет')}</div></div>`),
    'offer.coupon': (o = {}) => card(blk(h2(o.h || 'Подарок на первый счет') + `<div class="m-cp"><div class="v"><b>${o.v || '500 ₽'}</b><span>${o.vl || 'скидка на первый счет'}</span></div><div class="c"><span>промокод</span><b>${o.code || 'START500'}</b></div></div>` + p(o.p || 'Введите промокод при оформлении заявки до 31 декабря', 'm-sub'), 'c')),
    'offer.gift': (o = {}) => card(blk(`<div class="m-gf"><div class="gl">${gold(o.g || 'gift', 110)}</div><div class="tx"><span class="m-badge">${o.badge || 'Подарок'}</span>${h2(o.h || 'Три месяца облачного хранилища')}${p(o.p || 'Подключите любой тариф для бизнеса до конца года, и 100 ГБ в облаке будут бесплатными')}</div></div>`)),

    // товары
    'product.grid': (o = {}) => pair(...(o.items || [['product-phone.jpg', 'Смартфон, вид сзади', 'Смартфон 128 ГБ', '4 990 ₽', '8 190 ₽'], ['product-modem.jpg', 'Белый USB-модем', 'USB-модем 4G', '0 ₽', '3 290 ₽']]).map((r) => card(`<div class="m-pg"><div class="ph">${img(r[0], 173, 200, r[1])}</div><p class="m-h3">${r[2]}</p><p class="pr">${r[3]}</p><p class="m-p m-sub">вместо <s>${r[4]}</s></p>${sbtn('Купить')}</div>`))),

    // люди
    'people.manager': (o = {}) => card(blk(`<div class="m-mgr">${av(o.ini || 'АС')}<div class="tx"><p class="m-eb">${o.k || 'Ваш персональный менеджер'}</p><p class="m-h3">${o.name || 'Анна Смирнова'}</p><p class="m-p"><a class="m-a" href="#" onclick="return false">${o.tel || '+7 900 000-00-00'}</a><br><a class="m-a" href="#" onclick="return false">${o.mail || 'a.smirnova@example.ru'}</a></p></div></div>` + `<div class="m-btns l">${btn(o.button || 'Написать менеджеру')}</div>`)),
    'people.big': (o = {}) => card(blk(`<p class="m-qt">«${o.q || 'Раньше мы теряли каждый пятый звонок. Теперь видим все обращения и перезваниваем за 10 минут'}»</p><div class="m-who"><span class="lg">логотип клиента</span><p class="m-p"><b>${o.name || 'Ирина Волкова'}</b><br><span class="m-sub">${o.role || 'директор по сервису, сеть автомоек'}</span></p></div>`, 'c')),
    'people.team': (o = {}) => card(blk(h2(o.h || 'Спикеры'), 'c')) + tri((o.items || [['МК', 'Мария Котова', 'менеджер проектов'], ['ОЛ', 'Олег Лебедев', 'менеджер продукта'], ['ИП', 'Игорь Петров', 'архитектор решений']]).map((r) => card(`<div class="m-spk">${`<div class="av" aria-hidden="true">${r[0]}</div>`}<p class="m-h3">${r[1]}</p><p class="m-p m-sub">${r[2]}</p></div>`)), 's1'),
    'people.review': (o = {}) => card(blk(`<div class="m-stars" role="img" aria-label="Оценка 5 из 5">★★★★★</div><p class="m-p">«${o.q || 'Подключили интернет в новом офисе за неделю, инженер приехал день в день. Связь ни разу не пропадала'}»</p><p class="m-p m-sub">${o.who || 'Олег, владелец сети кофеен'}</p>`, 'c')),

    // подвал
    'foot.min': (o = {}) => `<div class="m-fm">${LOGO}<p>${o.legal || 'ПАО «ВымпелКом», РФ, 127083, г. Москва, ул. Восьмого марта, д. 10, стр. 14, ОГРН 1027700166636'}</p><p>${A('Отписаться от рассылки')}</p></div>`,
    'foot.contacts': () => `<div class="m-fc">${[['8 800 000-00-00', 'звонок бесплатный'], ['b2b.beeline.ru', 'тарифы и услуги'], ['Бизнес-кабинет', 'счета и заявки']].map((r) => `<div><b>${A(r[0])}</b><span>${r[1]}</span></div>`).join('')}</div>` + P.footer.std(),
    'foot.apps': () => `<div class="m-fapp"><p class="m-h3">Бизнес-кабинет в телефоне</p><div class="m-stores">${STORES}</div></div>` + P.footer.std(),
    'foot.unsub': () => `<div class="m-foot">${P.social()}<div class="m-uns"><p>Вы получили это письмо, потому что подписаны на новости билайн бизнес</p><p>${A('Настроить рассылки')} · ${A('Отписаться')}</p></div><div class="m-legal"><p>ПАО «ВымпелКом», РФ, 127083, г. Москва, ул. Восьмого марта, д. 10, стр. 14, ОГРН 1027700166636</p></div></div>`,

    // первый экран: четыре варианта, параметры в first()
    'first.ill': (o = {}) => first(Object.assign({ ill: 'unlimited', h1: 'Безлимитный интернет для офиса', lead: 'Скорость до 500 Мбит/с без ограничений по трафику: для работы в офисе, на удаленке и в поездках по России' }, o)),
    'first.illdate': (o = {}) => first(Object.assign({ ill: 'abonement', h1: 'Новые возможности в тарифах Облачной АТС', frame: 'Сообщаем, что с <b>1 декабря 2026 года</b> изменится наполнение тарифа «Минимальный», а абонентская плата составит <b>1 290 ₽ в месяц</b> с учетом НДС' }, o)),
    'first.text': (o = {}) => first(Object.assign({ ill: false, h1: '5G приходит в город. Ваш бизнес готов?', lead: 'Смартфоны и мобильная связь в одном решении для бизнеса. Подберем устройства и условия подключения под задачи и бюджет компании' }, o)),
    'first.textdate': (o = {}) => first(Object.assign({ ill: false, h1: 'ФЗ-140: все для работы с электронными перевозочными документами', lead: ['<b>С 1 сентября 2026 года</b> для участников перевозочного процесса действует обязательный электронный формат ряда документов', 'билайн бизнес обеспечит сотрудников в пути устройствами и мобильной связью для работы с электронными документами'] }, o)),
    'first.partner': (o = {}) => first(Object.assign({ partner: true, ill: 'gifts', h1: 'Подарки для команды со скидкой 20%', lead: 'Партнер билайн бизнес дарит скидку на корпоративные подарки до конца года' }, o)),

    // списки
    'list.ink': (o = {}) => card(blk(h2(o.h || 'Ваш бизнес развивается, и продукты билайна тоже') + p(o.p || 'Мы заботимся о том, чтобы Облачная АТС помогала в работе с клиентами, росте продаж и качестве сервиса') + `<p class="m-h3">${o.k || 'И поэтому мы:'}</p><ul class="m-ik">${(o.items || [['users', 'увеличили количество сотрудников для подключения в рамках тарифа: было 4, станет 6'], ['video', 'сделали возможными видеоконференции для обсуждения рабочих задач'], ['sliders', 'сохранили все функции Облачной АТС и развиваем новые']]).map((r) => `<li>${oi(r[0])}<span class="m-p">${r[1]}</span></li>`).join('')}</ul>`)),

    // шаги: прогресс
    'steps.progress2': (o = {}) => card(blk(`<p class="m-eb">${o.k || 'Шаг 1 из 2'}</p>${h2(o.h || 'Осталось подписать договор')}${seg(2, o.n == null ? 1 : o.n)}${chkl(o.list || [['Заявка принята', 1], ['Договор подписан', 0]])}${p(o.p || 'Договор уже ждет в бизнес-кабинете, подпись займет пару минут')}<div class="m-btns l">${btn(o.button || 'Подписать договор')}</div>`)),
    'steps.progress3': (o = {}) => card(blk(`<p class="m-eb">${o.k || 'Шаг 2 из 3'}</p>${h2(o.h || 'Проверяем техническую возможность')}${segl(o.labels || ['Заявка', 'Проверка', 'Подключение'], o.n == null ? 2 : o.n)}${p(o.p || 'Инженер свяжется с вами до 14 ноября и согласует время визита. Ничего делать не нужно')}`)),
    'steps.done': (o = {}) => card(blk(`<p class="m-eb">${o.k || 'Все шаги пройдены'}</p>${h2(o.h || 'Облачная АТС готова к работе')}${seg(3, 3)}${chkl(o.list || [['Номер подключен', 1], ['Сотрудники добавлены', 1], ['Переадресация настроена', 1]])}<div class="m-btns l">${btn(o.button || 'Открыть кабинет')}</div>`)),
    'steps.current': (o = {}) => card(blk(`<p class="m-eb">${o.k || 'Шаг 2 из 3'}</p>${seg(3, 2)}<div class="m-frame solid fd l"><p class="m-h3">${o.h || 'Добавьте сотрудников'}</p><p class="m-p">${o.p || 'Загрузите список из таблицы или пригласите коллег по ссылке, у каждого появится свой внутренний номер'}</p><div class="m-btns l">${btn(o.button || 'Добавить сотрудников')}</div></div><ul class="m-cl">${(o.next || ['Шаг 3. Распределите номера по отделам']).map((t) => `<li class="off">${RING}<span class="m-p">${t}</span></li>`).join('')}</ul>`)),
    'steps.stepper': (o = {}) => card(blk(h2(o.h || 'Как идет подключение', 'm-c') + `<ol class="m-stp">${(o.items || ['Заявка', 'Договор', 'Подключение']).map((t, i) => { const n = o.n == null ? 2 : o.n; const s = i + 1 < n ? 'ok' : i + 1 === n ? 'on' : ''; return `<li class="${s}"><span class="c">${s === 'ok' ? CHK.replace('m-c20', 'm-c32') : i + 1}</span><span class="t">${t}</span></li>`; }).join('')}</ol>` + p(o.p || 'Договор готов, подпишите его в бизнес-кабинете', 'm-c'))),

    // разделители
    'divider.dashed': (o = {}) => card(blk(h2(o.h || 'Что входит в тариф') + p(o.p || 'Безлимитные звонки внутри компании и 30 ГБ интернета на каждый номер')) + '<i class="m-hr ds"></i>' + blk(h2(o.h2 || 'Что можно добавить') + p(o.p2 || 'Облачное хранилище, антивирус и виртуальный номер для отдела продаж'))),
    'divider.icon': (o = {}) => card(blk(h2(o.h || 'Связь для офиса') + p(o.p || 'Интернет до 500 Мбит/с и роутер в аренду за 0 ₽')) + `<div class="m-hri"><i></i>${oi(o.g || 'spark', 20)}<i></i></div>` + blk(h2(o.h2 || 'Связь для сотрудников') + p(o.p2 || 'Корпоративные сим-карты с безлимитом внутри компании'))),
    'divider.num': (o = {}) => card((o.items || [['Подключите номер', 'Выберите красивый номер в кабинете, подключение займет один день'], ['Настройте переадресацию', 'Звонки уйдут на мобильные сотрудников, если в офисе никого нет']]).map((r, i) => `<div class="m-hn2"><span>0${i + 1}</span><i></i></div>` + blk(h2(r[0]) + p(r[1]))).join('')),
    'divider.label': (o = {}) => card(blk(`<h2 class="m-h3 m-c">${o.h || 'Например'}</h2>`, 'sm')),
    'divider.space': (o = {}) => card(blk(h2(o.h || 'Связь для офиса') + p(o.p || 'Интернет до 500 Мбит/с и роутер в аренду за 0 ₽'))) + card(blk(h2(o.h2 || 'Связь для сотрудников') + p(o.p2 || 'Корпоративные сим-карты с безлимитом внутри компании'))),

    // модули с картинкой не меньше 350
    'mod.top': (o = {}) => card(P.hero(o.img || 'femto') + blk(h2(o.h || 'Связь там, где ее не было') + p(o.p || 'Фемтосота усиливает сигнал в подвалах, на складах и в офисах с толстыми стенами. Устройство ставим и настраиваем сами') + `<div class="m-btns l">${btn(o.button || 'Подробнее')}</div>`)),
    'mod.wide': (o = {}) => card(`<div class="m-mw"><div class="tx">${h2(o.h || 'Единый мониторинг')}${p(o.p || 'Маршруты, задачи и фотоотчеты выездных сотрудников в одном приложении')}${btn(o.button || 'Подробнее')}</div><div class="im">${img(M.HEROES[o.img || 'monitoring'][0], 350, 350, HERO_ALT(o.img || 'monitoring'))}</div></div>`),
    'mod.under': (o = {}) => card(blk(h2(o.h || 'Подарки для команды') + p(o.p || 'Соберите новогодние наборы для сотрудников в бизнес-кабинете, доставим в офис до 25 декабря') + `<div class="m-im">${img(M.HEROES[o.img || 'gifts'][0], 576, 315, HERO_ALT(o.img || 'gifts'))}</div>` + `<div class="m-btns l">${btn(o.button || 'Собрать набор')}</div>`)),

    // товары из писем с оборудованием
    'product.sale': (o = {}) => card(`<div class="m-prod sl"><div class="ph">${img(o.img || 'product-phone.jpg', 200, 231, o.alt || 'Смартфон, вид сзади')}</div><div class="tx">${o.pill === false ? '' : `<span class="m-sale">${o.pill || 'Скидка 50%'}</span>`}<p class="nm">${o.name || 'Смартфон 128 ГБ'}</p><p class="pr">${FLAME}${o.price || '4 745 ₽'}</p><p class="was">вместо <s>${o.was || '9 490 ₽'}</s></p><p class="m-p">${o.cond || 'при подключении тарифа'}</p><p class="fee">${o.fee || 'за 700 ₽ в месяц'}</p></div></div>`),

    // рамки из писем
    'frame.chat': (o = {}) => card(blk(p(o.p || 'Ознакомьтесь с обновленными условиями подключения и пользования Облачной АТС', 'm-c') + chat(o.chat))),
    'frame.terms': (o = {}) => card(blk(p(o.p || '<b>Начисления за период с 18 по 23 октября не будут произведены</b>, а неудобства компенсируем скидкой на сервис:', 'm-c') + `<div class="m-terms">${(o.items || [['Ежемесячная оплата', '<b>Скидка 50%</b> на абонентскую плату за ноябрь'], ['Годовая лицензия', '<b>+1 месяц</b> к сроку действия лицензии']]).map((r) => `<div><p class="l">${o.l1 || 'Ваш формат оплаты'}</p><p class="m-h3">${r[0]}</p><p class="l">${o.l2 || 'Компенсация'}</p><p class="m-p">${r[1]}</p></div>`).join('')}</div>` + `<div class="m-frame solid line"><p class="m-p">${o.note || 'Компенсация <b>применяется автоматически</b>: обращаться в поддержку не нужно'}</p></div>`)),

    // кнопки из писем
    'cta.consult': (o = {}) => card(blk(p(o.p || 'Ознакомьтесь с обновленными условиями подключения и пользования Облачной АТС') + btns(btn(o.button || 'Посмотреть тарифы')) + chat(o.chat), 'c')),
    'cta.limit': (o = {}) => card(blk(`<h2 class="m-h3">${o.h || 'Количество устройств ограничено'}</h2>` + p(o.p || 'Если вам нужен другой тариф, мы предложим индивидуальную скидку') + btns(btn(o.button || 'Выбрать смартфон')), 'c')),
    'cta.model': (o = {}) => card(blk(`<h2 class="m-h3">${o.h || 'Не нашли подходящую модель?'}</h2>` + (o.paras || ['Подберем решение под задачи вашей компании', 'Подберем смартфон, планшет, ноутбук или другое устройство: рассчитаем стоимость любой модели, предложим тариф и условия со скидкой']).map((t) => p(t)).join('') + btns(btn(o.button || 'Получить консультацию')), 'c')),
    'cta.bold': (o = {}) => card(blk(p(`<b>${o.b || 'ФЗ-140 уже действует:'}</b> ${o.p || 'обеспечьте сотрудников всем необходимым для работы с электронными перевозочными документами'}`) + btns(btn(o.button || 'Подробнее')), 'c')),

    // подвал писем с оборудованием
    'footer.equip': () => P.footer.std().replace('<div class="m-disc">', `<div class="m-disc"><p>${EQUIP}</p>`),
    // текст: абзацы по центру из сервисных писем
    'info.plain': (o = {}) => card(blk([].concat(o.paras || ['Мы перенесли eXpress Lite в более защищенный контур: это часть программы по повышению надежности сервиса']).map((t) => p(t)).join('') + (o.b === false ? '' : `<p class="m-h3">${o.b || 'Сейчас мессенджер работает в штатном режиме'}</p>`), 'c')),

    // блоки email 2.0 с параметрами: в каталоге показываем оригинал из blocks.js, в макетах свои тексты
    'info.text': (o = {}) => card(blk(h2(o.h || 'Что будет дальше') + [].concat(o.p || 'Менеджер пришлет договор в бизнес-кабинет').map((t) => p(t)).join(''))),
    'info.list': (o = {}) => card(blk(h2(o.h) + p(o.p) + ul(o.items || []))),
    'steps.desc': (o = {}) => card(blk(h2(o.h, o.hc ? 'm-c' : '') + `<ol class="m-steps desc">${(o.items || []).map((r, i) => `<li><div class="r"><span class="m-num">${i + 1}</span><b class="m-h3">${r[0]}</b></div><p class="d" style="padding-left:48px">${r[1]}</p></li>`).join('')}</ol>`)),
    'cta.one': (o = {}) => card(blk(h2(o.h) + p(o.p) + btns(btn(o.button || 'Подробнее')), 'c')),
  };

  Object.assign(M, { N, first, CHK });
})(window);
