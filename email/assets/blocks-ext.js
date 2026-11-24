/* Дизайн-система CVM B2B · раздел «Письма» · каталог всех компонентов
   Дополняет blocks.js: блоки из реальных писем библиотеки и из файла «Система сборки email рассылок»
   X        новые компоненты по коду, например X['mod.product']()
   Реестр всех компонентов с группами и источниками в registry.js
   Тексты и цифры в примерах условные. Блоки из писем повторяют сетку и стиль письма-источника */
(function (root) {
  'use strict';
  const M = root.CVMMail;
  if (!M) return;
  const P = M.parts, IMG = M.IMG, I = root.CVMIll;
  const { card, btn, btns } = P;

  const pair = (a, b) => `<div class="m-pair">${a}${b}</div>`;
  const ul = (items, cls) => `<ul class="m-ul${cls ? ' ' + cls : ''}">${items.map((t) => `<li>${t}</li>`).join('')}</ul>`;
  const ink = (id, s, c, sw) => (I ? I.ink(id, s, c || 'currentColor', sw ? { sw } : undefined) : '');
  const gold = (id, s) => (I ? I.gold(id, s) : '');
  const blk = (html, cls) => `<div class="m-blk${cls ? ' ' + cls : ''}">${html}</div>`;
  const chkO = '<svg class="m-ck" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#FFC800" stroke-width="2"/><path d="M7.5 12.2l3 2.9 6-6.2" fill="none" stroke="#FFC800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const flame = '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.6 2.5c.6 3.2-1.4 4.9-2.9 6.4C8.4 10.2 7 11.8 7 14.4a5 5 0 0010 0c0-2.1-1-3.6-2.1-4.7-.1 1.5-.8 2.6-1.9 3.1.6-2.8-.2-6.4-.4-10.3z" fill="none" stroke="#FFC800" stroke-width="2" stroke-linejoin="round"/></svg>';
  const plus = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const a = (t) => `<a href="#" onclick="return false">${t}</a>`;

  // контурные иконки 24 в цвет текста, линия 1.6, как набор иконок email 2.0. В верстке PNG ×2: светлая и темная версия
  const OI = {
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.4v.2"/>',
    bulb: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 00-3.7 10.7c.7.6 1.2 1.4 1.2 2.3h5c0-.9.5-1.7 1.2-2.3A6 6 0 0012 3z"/>',
    trend: '<path d="M3.5 16.5l5.5-5.5 4 4 7.5-7.5"/><path d="M15 7.5h5.5V13"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M15.5 4.8a3.5 3.5 0 010 6.4M18 14.4c2 .8 3.5 2.8 3.5 5.6"/>',
    video: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/>',
    sliders: '<path d="M3.5 7h9M16.5 7h4M3.5 17h4M11.5 17h9"/><circle cx="14.5" cy="7" r="2"/><circle cx="9.5" cy="17" r="2"/>',
    chat: '<path d="M4.5 5h15A1.5 1.5 0 0121 6.5v9a1.5 1.5 0 01-1.5 1.5H10l-4.5 3.5V17h-1A1.5 1.5 0 013 15.5v-9A1.5 1.5 0 014.5 5z"/>',
    spark: '<path d="M12 4l1.8 6.2L20 12l-6.2 1.8L12 20l-1.8-6.2L4 12l6.2-1.8z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/>',
    phone: '<path d="M8.2 3.5H6A2.5 2.5 0 003.5 6c0 7.7 6.8 14.5 14.5 14.5a2.5 2.5 0 002.5-2.5v-2.2l-4.2-1.6-2 2a12 12 0 01-6-6l2-2z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/>',
  };
  const oi = (k, sz) => `<svg class="m-oi" width="${sz || 24}" height="${sz || 24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${OI[k] || ''}</svg>`;

  const SOC = ['telegram', 'vkontakte', 'odnoklassniki'];
  const DISC = 'Рассылка носит информационный характер и не является публичной офертой. С условиями оказания услуг, тарифами, ограничениями и требованиями к услугам вы можете ознакомиться на сайте <a href="#" onclick="return false">b2b.beeline.ru</a>';
  const LEGAL = 'Реклама. ПАО «ВымпелКом», РФ, 127083, г. Москва, ул. Восьмого марта, д. 10, стр. 14, ОГРН 1027700166636<br>Специально для вас мы подбираем самую полезную информацию об акциях, выгодных тарифах и услугах билайн<br>Вы можете <a href="#" onclick="return false">отказаться</a> от получения писем с важными сообщениями от билайн';

  const prod = (img, alt, name, price, was, fee, desc) => card(`<div class="m-prod"><div class="ph"><img src="${IMG}${img}" width="200" height="231" alt="${alt}"></div><div class="tx"><p class="nm">${name}</p><p class="pr">${flame}${price}</p><p class="was">вместо <s>${was}</s></p><p class="m-p">при подключении тарифа<span class="m-sup">1</span></p><p class="fee">${fee}</p></div></div><p class="m-prod-d m-p">${desc}</p>`);
  const spk = (ini, name, role) => `<div class="m-spk"><div class="av" aria-hidden="true">${ini}</div><p class="m-h3">${name}</p><p class="m-p m-sub">${role}</p></div>`;
  const mini = (g, h, p, b) => card(`<div class="m-mini"><div class="tx"><p class="m-h3">${h}</p><p class="m-p m-sub">${p}</p><a class="m-btn sm" href="#" onclick="return false">${b}</a></div><div class="im">${gold(g, 76)}</div></div>`);
  const store = (s, b) => `<a class="m-store" href="#" onclick="return false"><small>${s}</small><b>${b}</b></a>`;

  // ---------- новые компоненты по коду ----------
  const X = {
    // текст и списки
    'info.divided': () => card(blk('<h2 class="m-h1" style="max-width:none">Здравствуйте!</h2><p class="m-h3">Фишинговые письма становятся точнее</p><p class="m-p">Злоумышленники подделывают письма коллег, банков и госсервисов. Один неосторожный клик открывает доступ к данным компании</p><i class="m-dv"></i><p class="m-h3">Обучение работает лучше запретов</p><p class="m-p">Сотрудники, которые прошли тренировочные атаки, реже открывают подозрительные ссылки</p><i class="m-dv"></i><p class="m-p">Расскажем, как запустить обучение за один день и сколько это стоит</p>', 'c')),
    'info.example': () => card(blk('<h2 class="m-h2">Как это работает</h2><p class="m-p">Сервис сам превращает звонки в задачи: менеджер не тратит время на заметки и ничего не забывает</p><div class="m-ex"><span class="m-tag">Например</span><p class="m-p">Пропущенный вызов в 18:40 превращается в задачу «Перезвонить» с записью разговора и карточкой клиента</p></div>')),
    'info.ps': () => card(blk(`<h2 class="m-h2">Подсчет продукции на конвейере</h2><div class="m-ps">${[['alert', 'Проблема', ['ручной подсчет занимает смену одного сотрудника', 'ошибки в отчетах приводят к пересортице', 'нет данных о простоях линии']], ['bulb', 'Решение', ['камера над конвейером считает каждую единицу', 'данные сразу попадают в учетную систему']], ['trend', 'Результат', ['точный учет без участия человека', 'отчет о простоях за каждую смену']]].map((r) => `<div><div class="hd">${oi(r[0])}<p class="m-h3">${r[1]}</p></div>${ul(r[2])}</div>`).join('')}</div>`)),
    'list.num': () => card(blk(`<h2 class="m-h2 m-c">Что получаете</h2><ol class="m-nl">${['Голосовое меню: клиенты всегда слышат вежливое приветствие', 'Переадресация звонков: вызовы не пропадут, даже если линия занята', 'Запись разговоров для контроля качества', 'Статистика звонков по каждому сотруднику', 'Несколько линий на одном номере'].map((t, i) => `<li><span class="n">${i + 1}</span><span class="m-p">${t}</span></li>`).join('')}</ol>`)),
    'list.numy': () => card(blk(`<h2 class="m-h2 m-c">Программа «Для первых»</h2><ol class="m-nl y">${['безлимитные звонки и интернет в поездках', 'персональный менеджер 24/7', `подписка на книги и аудиокниги ${a('подробнее')}`, `1 ТБ в облачном хранилище ${a('подробнее')}`].map((t, i) => `<li><span class="n">${i + 1}</span><span class="m-p">${t}</span></li>`).join('')}</ol>`)),
    'list.icons': () => card(blk(`<h2 class="m-ht m-c">Вы получите:</h2><ul class="m-il">${[['ruble', 'Точный расчет: оплачивайте только секунды разговора'], ['users', 'Единый номер для клиентов из любого региона'], ['shield', 'Доверие: номер 8 800 показывает надежность компании'], ['megaphone', 'Запоминающийся номер для рекламы']].map((r) => `<li><span class="ic">${ink(r[0], 20)}</span><span class="m-p">${r[1]}</span></li>`).join('')}</ul>`)),
    'list.iconpl': () => card(blk(`<h2 class="m-ht m-c">И главное: платформа уже включена</h2><ul class="m-il pl">${[['aichat', 'ИИ создаст сайт по короткому описанию бизнеса'], ['users', 'Готовая CRM: все клиенты и сделки в одном месте'], ['chart', 'Заказы и продажи без таблиц'], ['rocket', 'Интернет-магазин с нуля или перенос текущего']].map((r) => `<li><span class="ic">${ink(r[0], 20)}</span><span class="m-p">${r[1]}</span></li>`).join('')}</ul>`)),
    'rows.border': () => card(blk(`<h2 class="m-h2">Каждое событие становится задачей</h2><div class="m-rows">${[['Пропущенный вызов:', 'задача «Перезвонить» в планировщике'], ['Успешный звонок:', 'новая сделка в CRM'], ['Чат:', 'подтверждение заказа'], ['Аналитика:', 'отчет о нагрузке на линию']].map((r) => `<div><b>${r[0]}</b> <span class="m-sub">${r[1]}</span></div>`).join('')}</div>`)),

    // шаги
    'steps.chain': () => card(blk(`<h2 class="m-ht">Три шага до готового офиса</h2><div class="m-chain">${['стабильный интернет в офис', 'роутер, который переходит в собственность сразу', 'оборудование за 0 ₽, вы платите только за тариф'].map((t) => `${chkO}<p class="m-p">${t}</p>`).join('')}</div>`, 'c')),
    'steps.boxes': () => card(blk(`<h2 class="m-ht">Цифровые инструменты для старта бизнеса</h2><p class="m-p">На вебинаре вы узнаете:</p><div class="m-boxes">${['как с помощью ИИ быстро создать сайт', 'как за пару кликов перенести товары с маркетплейсов', 'как настроить рассылки и аналитику'].map((t, i) => `<div><span class="bx">0${i + 1}</span><p class="m-p">${t}</p></div>`).join('')}</div>`, 'c')),

    // преимущества
    'adv.dots': () => card(blk(`<h2 class="m-ht">Зачем компании корпоративные сим-карты?</h2><div class="m-plates">${[['Рабочие и личные звонки отдельно', 'Сотрудники пользуются служебной связью только для работы'], ['Контакты остаются в компании', 'Даже если сотрудник меняет место работы'], ['Прозрачные расходы', 'Лимиты, понятные счета и удобный учет затрат']].map((r) => `<div class="m-plate"><i class="m-dot"></i><p class="m-h3">${r[0]}</p><p class="m-p" style="margin-top:4px">${r[1]}</p></div>`).join('')}</div>`, 'c tight')),
    'adv.two': () => card(blk(`<h2 class="m-ht">Как работает программа</h2><p class="m-h3">Поделитесь ссылкой, и бонусы получат обе стороны</p><div class="m-two">${[['Что получают ваши партнеры:', 'специальные условия на корпоративные сервисы'], ['Что получаете вы:', 'бонусные баллы за каждую рекомендацию']].map((r) => `<div>${chkO}<p class="m-h3">${r[0]}</p><p class="m-p">${r[1]}</p></div>`).join('')}</div>`, 'c')),
    'adv.stack': () => card(blk(`<h2 class="m-h3">Что входит в предложение</h2><div class="m-bi">${[['3 месяца', 'Облачной АТС бесплатно'], ['скидка 50%', 'на бизнес-тариф на 12 месяцев'], ['бизнес-счет', 'с бесплатным открытием у партнера']].map((r, i) => `<div>${i ? '<i class="m-dv"></i>' : ''}<p class="v">${r[0]}</p><p class="m-p" style="margin-top:4px">${r[1]}</p></div>`).join('')}</div>`, 'c')),

    // цифры
    'stats.col': () => card(blk(`<h2 class="m-ht">Обучение, которое видно в цифрах</h2><div class="m-stats">${[['до 80%', 'сотрудников начинают распознавать фишинг за месяц', 'Короткие курсы с тестами и практическими кейсами'], ['до 60%', 'меньше кликов по опасным ссылкам после двух тренировок', 'Регулярные учебные атаки с автоматической аналитикой'], ['за 5 минут', 'запуск кампании на всю компанию', 'Обучение и тестирование работают по готовым сценариям']].map((r) => `<div class="m-stat"><p class="v">${r[0]}</p><p class="m-h3">${r[1]}</p><p class="m-p m-sub">${r[2]}</p></div>`).join('')}</div>`, 'c')),
    'stats.row': () => card(blk(`<h2 class="m-h2">Чем дольше срок, тем больше экономия</h2><div class="m-srow">${[['3 месяца', '10%'], ['6 месяцев', '20%'], ['12 месяцев', '30%']].map((r) => `<div><p class="l">${r[0]}</p><p class="v">${r[1]}</p></div>`).join('')}</div><p class="m-p m-sub">Скидка на абонентскую плату при оплате вперед</p>`, 'c')),
    'stats.rowy': () => card(blk(`<h2 class="m-h2">Что дает резервное копирование</h2><div class="m-srow y">${[['возврат', '15 мин'], ['хранение', '30 дней'], ['доступ', '99,9%']].map((r) => `<div><p class="l">${r[0]}</p><p class="v">${r[1]}</p></div>`).join('')}</div>`, 'c')),
    'stats.price': () => card(blk(`<p class="m-p">Мы обновили цены на тарифы для роутеров и модемов. Актуальная стоимость:</p><div class="m-pi">${[['50 ГБ', '450'], ['100 ГБ', '690']].map((r) => `<div><div class="ic">${flame}</div><p class="m-lb">${r[0]}</p><p class="m-p">за <span class="m-yn">${r[1]} ₽</span> в месяц</p></div>`).join('')}</div><p class="m-p m-sub">Тарифы подходят для роутеров и модемов в офисе, на объектах и в поездках</p>`, 'c')),

    // рамки, плашки, разделители
    'frame.soft': () => card(blk('<h2 class="m-h2">Если у вас свой бизнес</h2><p class="m-p">Каждый пропущенный вызов может стоить клиента и прибыли</p><div class="m-note"><p class="m-p">Подключите Облачную АТС и попробуйте все функции бесплатно</p></div>')),
    'frame.line': () => card(blk('<h2 class="m-h2">Подключение и настройка бесплатно</h2><p class="m-p">Попробуйте новые возможности без обязательств</p><div class="m-frame solid line"><p class="m-p">Первый месяц бесплатно, затем от 966 ₽ в месяц за номер</p></div>', 'c')),
    'frame.grey': () => card(blk('<h2 class="m-h2">Не нашли подходящую модель?</h2><div class="m-plate"><p class="m-p">Менеджер подберет устройство под задачи команды и расскажет об условиях рассрочки</p></div>', 'c')),
    'frame.icon': () => card(blk(`<div class="m-hl"><span class="ic">${plus}</span><p class="m-p">Красивый номер 8 800 в Облачной АТС билайн бизнес с посекундной тарификацией на срок от 6 месяцев</p></div>`)),
    'divider.dots': () => card(blk('<h2 class="m-ht">Что вы получаете</h2>', 'c') + '<i class="m-dots"></i>' + blk(`<p class="m-h3">Улучшение навыков</p><p class="m-p">Обучение основам кибербезопасности</p><div class="m-chain">${chkO}<p class="m-p">индивидуальные учебные планы</p>${chkO}<p class="m-p">тренировочные фишинговые письма</p></div>`, 'c') + '<i class="m-dots"></i>' + blk(`<p class="m-h3">Готовность к атакам</p><div class="m-chain">${chkO}<p class="m-p">проверка знаний по пройденному материалу</p></div>`, 'c')),

    // модули
    'mod.mini': () => mini('phone', 'Телефония для новых номеров', 'Подключите номер в бизнес-кабинете и получите кешбэк 10% за первый месяц', 'Подключить') + mini('wifi', 'Интернет и Wi-Fi в офис', 'Роутер в подарок при подключении до конца месяца', 'Подробнее'),

    // плитки и сетки
    'tiles.g3': () => card(blk('<h2 class="m-ht">Что умеет видеоаналитика</h2>', 'c')) + `<div class="m-tri">${[['clock', 'Контроль очереди'], ['ruble', 'Работа касс'], ['target', 'Тепловые карты'], ['camera', 'Распознавание событий'], ['users', 'Подсчет посетителей'], ['idcard', 'Распознавание номеров']].map((r) => card(`<div class="m-gi"><div class="gl">${gold(r[0], 72)}</div><p>${r[1]}</p></div>`)).join('')}</div>` + card(blk(btns(btn('Хочу попробовать')), 'c')),
    'tiles.left': () => `<h2 class="m-ht m-oh">Что входит в пакет:</h2>` + pair(card(`<div class="m-tl"><div class="ic">${ink('wifi', 24)}</div><p class="m-p">Безлимитный интернет в сети билайн</p></div>`), card(`<div class="m-tl"><div class="ic">${ink('phone', 24)}</div><p class="m-p">Звонки на номера России без ограничений</p></div>`)) + pair(card(`<div class="m-tl"><div class="ic">${ink('cloud', 24)}</div><p class="m-p">Облачное хранилище на 100 ГБ</p></div>`), card(`<div class="m-tl"><div class="ic">${ink('message', 24)}</div><p class="m-p">Безлимит на мессенджеры</p></div>`)),
    'tiles.ways': () => card(blk(`<h2 class="m-ht">Как оформить:</h2><div class="m-ways"><div><div class="ic">${ink('message', 32)}</div><p class="m-p">через форму обратной связи на сайте</p></div><div><div class="ic">${ink('headset', 32)}</div><p class="m-p">через вашего персонального менеджера</p></div></div>${btns(btn('Оформить'))}`, 'c')),

    // оффер, цены и товары
    'mod.product': () => prod('product-phone.jpg', 'Смартфон, вид сзади', 'Смартфон 128 ГБ', 'за 4 990 ₽', '8 190 ₽', 'от 650 ₽ в месяц', 'Практичный смартфон для сотрудников: обновите парк устройств и сэкономьте бюджет компании'),
    'mod.products': () => prod('product-modem.jpg', 'Белый USB-модем', 'USB-модем 4G', 'за 0 ₽', '3 290 ₽', 'от 500 ₽ в месяц', 'Компактный модем для поездок, резервного канала связи или удаленного рабочего места') + prod('product-phone.jpg', 'Смартфон, вид сзади', 'Смартфон 128 ГБ', 'за 4 990 ₽', '8 190 ₽', 'от 650 ₽ в месяц', 'Практичный смартфон для сотрудников с экономией для бюджета компании') + card(blk(`<h2 class="m-h3">Успейте воспользоваться предложением!</h2><p class="m-p">Количество оборудования ограничено</p>${btns(btn('Подключить связь'))}`, 'c')),
    'offer.boxes': () => card(blk(`<h2 class="m-ht">Для родных и близких</h2><p class="m-p">Выгодные тарифы можно подключить не только для себя</p><div class="m-tbs">${[['Мобильный тариф', 'Безлимитный интернет, 2 000 минут и 1 000 SMS по России', '610 ₽ в месяц'], ['Тариф для устройств', 'Интернет для планшетов, роутеров и часов', '500 ₽ в месяц'], ['Семейный доступ', 'Подписки на книги и облако для близких', 'бесплатно']].map((r) => `<div class="m-tb"><p class="m-h3">${r[0]}</p><p class="m-p">${r[1]}</p><p class="m-h3">${r[2]}</p><a class="lnk" href="#" onclick="return false">условия тарификации</a></div>`).join('')}</div>${btns(btn('Подробнее'))}`, 'c')),
    'offer.plates': () => card(blk(`<h2 class="m-ht">Специальные предложения</h2><div class="m-plates">${[['Фемтосота', 'Компактное оборудование для быстрого улучшения покрытия. Установка 0 ₽'], ['Скидка 10%', 'на смартфоны и устройства в бизнес-кабинете']].map((r) => `<div class="m-plate"><p class="m-h3">${r[0]}</p><p class="m-p">${r[1]}</p></div>`).join('')}</div>`, 'c tight')),

    // люди
    'people.one': () => card(spk('ИП', 'Игорь Петров', 'руководитель отдела сервисного сопровождения')),
    'people.two': () => pair(card(spk('МК', 'Мария Котова', 'менеджер проектов')), card(spk('ОЛ', 'Олег Лебедев', 'менеджер продукта'))) + card(blk(btns(btn('Зарегистрироваться')), 'c')),

    // CTA и баннеры
    'cta.banner': () => `<div class="mc m-ban"><div class="tx"><p class="m-ht">Счета, платежи и обращения по договорам в одном месте</p><a class="m-btn w" href="#" onclick="return false">Бизнес-кабинет</a></div><div class="im">${gold('idcard', 130)}</div></div>`,
    'cta.img': () => card(`<div class="m-ci"><div class="tx"><h2 class="m-ht">Начните пользоваться преимуществами уже сейчас</h2><p class="m-p">Оплачивайте звонки клиентов на номер 8 800 посекундно и пользуйтесь красивым номером от 6 месяцев</p>${btn('Подключить')}</div><div class="im">${gold('phone', 140)}</div></div>`),
    'cta.line': () => card(blk(`<p class="m-p">Эксперты покажут кейсы использования цифровых инструментов</p><i class="m-dv"></i><p class="m-p">В конце вебинара промокод на запуск рассылки</p>${btns(btn('Смотреть вебинар'))}`, 'c')),
    'cta.stores': () => card(blk(`<h2 class="m-h2">Управляйте услугами в приложении</h2><p class="m-p">Счета, баланс и настройки номеров всегда под рукой</p><div class="m-stores">${store('Загрузите в', 'App Store')}${store('Доступно в', 'RuStore')}${store('Доступно в', 'Google Play')}</div>`, 'c')),

    // подвал
    'footer.kit': () => `<div class="m-kf"><div class="ics">${SOC.map((s) => `<img src="${IMG}social-${s}.svg" width="48" height="48" alt="${s}">`).join('')}</div><p class="sl">билайн <span>на твоей стороне</span></p><div class="dc">${DISC}</div><div class="lg">${LEGAL}</div></div>`,

    // архив: снимки из Figma
    'old.header': () => `<div class="m-arch"><img src="${IMG}archive-header.png" width="680" height="884" alt="Двенадцать шапок со старыми логотипами билайн, билайн бизнес и билайн ТВ, светлые и темные"></div>`,
    'old.footer': () => `<div class="m-arch"><img src="${IMG}archive-footer-dark.png" width="820" height="560" alt="Старый темный подвал: семь соцсетей, слоган и юридический текст, вариант с копирайтами"></div>`,
    'old.footerl': () => `<div class="m-arch"><img src="${IMG}archive-footer-light.png" width="820" height="560" alt="Старый подвал с контурными иконками соцсетей и светлой плашкой юридического текста"></div>`,
    'old.social': () => `<div class="m-arch"><img src="${IMG}archive-social.png" width="384" height="318" alt="Старый набор из семи иконок соцсетей: заливка, контур, серые"></div>`,
  };

  Object.assign(M, { X, oi });
})(window);
