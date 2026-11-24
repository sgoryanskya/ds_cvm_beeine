/* Дизайн-система CVM B2B · раздел «Письма» · компоненты писем
   Каждый компонент: функция, которая возвращает HTML карточки. Стили в email.css (классы .m-*)
   COMP  витрины компонентов с вариантами для страницы гайда
   LETTERS  готовые письма, собранные только из этих компонентов
   Тексты и цифры в примерах условные: они показывают сетку, а не реальные предложения */
(function (root) {
  'use strict';
  const IMG = 'assets/img/';
  const I = root.CVMIll;

  // ---------- базовые куски ----------
  const card = (html, cls) => `<div class="mc${cls ? ' ' + cls : ''}">${html}</div>`;
  const body = (html, solo) => `<div class="m-body${solo ? ' solo' : ''}">${html}</div>`;
  const pair = (a, b) => `<div class="m-pair">${a}${b}</div>`;
  const btn = (t, sec) => `<a class="m-btn${sec ? ' sec' : ''}" href="#" onclick="return false">${t}</a>`;
  const btns = (...b) => `<div class="m-btns">${b.join('')}</div>`;
  const ul = (items, cls) => `<ul class="m-ul${cls ? ' ' + cls : ''}">${items.map((t) => `<li>${t}</li>`).join('')}</ul>`;
  const chk = '<svg class="m-chk" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#FFC800"/><path d="M5.6 10.3l3 2.9 5.8-6" fill="none" style="stroke:var(--m-card)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const logo = () => `<img class="lg-l" src="${IMG}logo-light.svg" width="222" height="34" alt="билайн бизнес"><img class="lg-d" src="${IMG}logo-dark.svg" width="222" height="34" alt="билайн бизнес">`;
  const head = (o) => (o && o.partner)
    ? `<div class="m-head">${logo()}<i class="m-vl"></i><span class="m-plogo">логотип партнера</span></div>`
    : `<div class="m-head">${logo()}</div>`;
  const HEROES = {
    monitoring: ['hero-monitoring.jpg', 'Курьер идет по карте на планшете к метке'],
    gifts: ['hero-gifts.jpg', 'Подарочные коробки'],
    unlimited: ['hero-unlimited.jpg', 'Безлимитный интернет'],
    femto: ['hero-femto.jpg', 'Фемтосота в офисе'],
    abonement: ['hero-abonement.jpg', 'Абонентское обслуживание'],
    medicine: ['hero-medicine.jpg', 'Цифровые сервисы для медицины'],
  };
  const hero = (k) => `<div class="m-hero"><img src="${IMG}${HEROES[k][0]}" width="640" height="350" alt="${HEROES[k][1]}"></div>`;
  const plate = (f, alt) => `<div class="m-pl"><img src="${IMG}${f}" width="280" height="208" alt="${alt}"></div>`;

  // ---------- первый экран ----------
  const TITLE = {
    h1: 'Управляйте задачами, а не только маршрутами',
    lead: 'Услуга «Единый мониторинг» помогает повысить эффективность сотрудников с разъездным характером работы и делает рабочие процессы прозрачнее',
    bold: 'Контролируйте в приложении выполнение задач: от назначения маршрута до фотоотчета',
  };
  const title = (o) => {
    o = o || {};
    const t = Object.assign({}, TITLE, o);
    return `<div class="m-title${o.top ? ' top' : ''}">${o.badge ? `<span class="m-badge">${o.badge}</span>` : ''}<h1 class="m-h1">${t.h1}</h1><p class="m-p">${t.lead}</p>${o.withBold ? `<p class="m-lb">${t.bold}</p>` : ''}${o.button ? btns(btn(o.button)) : ''}</div>`;
  };
  const first = (o) => card(head(o) + (o && o.hero === false ? '' : hero((o && o.hero) || 'monitoring')) + title(o));

  // ---------- текстовые блоки ----------
  const LIST5 = ['отслеживание выполнения задач', 'планирование рабочего дня', 'построение оптимальных маршрутов', 'электронные отчеты и чек-листы от сотрудников', 'расширенные возможности контроля KPI'];
  const info = {
    text: () => card(`<div class="m-blk"><h2 class="m-h2">Что такое «Единый мониторинг»</h2><p class="m-p">Сервис для компаний с выездными сотрудниками: курьерами, монтажниками, торговыми представителями. Руководитель видит маршрут, статус задачи и фотоотчет в одном окне</p></div>`),
    list: () => card(`<div class="m-blk"><h2 class="m-h2">Модуль «Координатор»</h2><p class="m-p">Помогает улучшить качество выездного обслуживания:</p>${ul(LIST5)}</div>`),
    center: () => card(`<div class="m-blk"><h3 class="m-h3 m-c">Где нужна фемтосота:</h3>${ul(['склады и подвальные помещения', 'офисы в бизнес-центрах с толстыми стенами', 'загородные объекты и производства', 'любые места, где плохо ловит сеть'])}</div>`),
    lead: () => card(`<div class="m-blk"><h2 class="m-h2">Что вы получаете</h2>${ul(['<b>Стабильную связь</b> <span class="m-sub">для звонков и интернета в любой точке офиса</span>', '<b>Работу без настройки</b> <span class="m-sub">с вашей стороны: устройство подключаем мы</span>', '<b>Защищенный канал</b> <span class="m-sub">через сеть билайн, а не через чужой Wi-Fi</span>'], 'wide')}</div>`),
    sections: () => card(`<div class="m-blk"><div class="m-sec"><h2 class="m-h2">Для кого</h2><p class="m-p">Для компаний, где от 5 сотрудников работают в разъездах и отчитываются о каждой точке маршрута</p></div><div class="m-sec"><h2 class="m-h2">Что меняется</h2>${ul(['меньше звонков «где ты сейчас»', 'отчеты собираются сами', 'видно, на что уходит рабочий день'])}</div></div>`),
  };

  // ---------- шаги ----------
  const STEP4 = ['Оставьте заявку на сайте', 'Менеджер уточнит задачи и подберет тариф', 'Подпишите договор в бизнес-кабинете', 'Начните работу в приложении'];
  const steps = {
    line: () => card(`<div class="m-blk"><h2 class="m-h2">Как подключить</h2><ol class="m-steps">${STEP4.map((s, i) => `<li><div class="r"><span class="m-num">${i + 1}</span><span>${s}</span></div></li>`).join('')}</ol></div>`),
    lead: () => card(`<div class="m-blk"><h2 class="m-h2">Как подключить</h2><ol class="m-steps">${[['Оставьте заявку', 'на сайте или у менеджера'], ['Получите расчет', 'в течение одного рабочего дня'], ['Подпишите договор', 'в бизнес-кабинете, без визита в офис']].map((s, i) => `<li><div class="r"><span class="m-num">${i + 1}</span><span><b>${s[0]}</b> ${s[1]}</span></div></li>`).join('')}</ol></div>`),
    desc: () => card(`<div class="m-blk"><h2 class="m-h2">Три шага до запуска</h2><ol class="m-steps desc">${[['Заявка', 'Оставьте контакты, менеджер перезвонит в течение рабочего дня'], ['Настройка', 'Добавим сотрудников и маршруты, покажем приложение'], ['Запуск', 'Сотрудники получают задачи, вы видите статус на карте']].map((s, i) => `<li><div class="r"><span class="m-num">${i + 1}</span><b class="m-h3">${s[0]}</b></div><p class="d" style="padding-left:48px">${s[1]}</p></li>`).join('')}</ol></div>`),
    plates: () => card(`<div class="m-blk c tight"><h2 class="m-ht">Три шага для подключения филиала</h2><p class="m-p">Cloud SD-WAN подключает новую точку к корпоративной сети за несколько шагов:</p><div class="m-plates">${['Заявка на сайте или у менеджера', 'Доставка и установка оборудования', 'Настройка политик в личном кабинете', 'Активация в корпоративной сети'].map((s, i, a) => `<div class="m-plate"><span class="m-pill${i === a.length - 1 ? ' y' : ''}">0${i + 1}</span><p class="m-p">${s}</p></div>`).join('')}</div></div>`),
  };

  // ---------- преимущества ----------
  const CHECKS = [['Автоматизация управления', 'Четкое разделение зон ответственности между клиентом и провайдером. Обновления и поддержка на стороне beeline cloud'], ['Рост без закупок', 'Мощности добавляются за минуты, без покупки и настройки серверов'], ['Защита данных', 'Данные хранятся в российских дата-центрах с резервным копированием']];
  const FACTS = [['Не зависит от погоды и перегрузки мобильных сетей', 'связь остается стабильной даже в часы пик'], ['Постоянно высокая скорость', 'качественное подключение для комфортной работы'], ['Работа 24/7', 'интернет, который не уходит «на перерыв»'], ['Качество в самые важные моменты', 'когда нужно отправить отчет, провести оплату или принять заказ']];
  const COLS = ['Автозагрузка фото и видео с телефона', 'Удобная сортировка по альбомам', 'Улучшение фото с помощью ИИ', 'Семейный доступ и экономия трафика', 'Общий доступ для команды', 'Защищенный раздел для важных документов'];
  const adv = {
    checks: () => card(`<div class="m-blk c tight"><h2 class="m-ht">Когда это удобно?</h2><div class="m-plates">${CHECKS.map((c) => `<div class="m-plate">${chk}<p class="m-h3">${c[0]}</p><p class="m-p" style="margin-top:4px">${c[1]}</p></div>`).join('')}</div></div>`),
    checklead: () => card(`<div class="m-blk c tight"><h2 class="m-ht">Когда это удобно?</h2><div class="m-plates">${CHECKS.map((c) => `<div class="m-plate">${chk}<p class="m-p"><span class="m-acc">${c[0]}:</span> ${c[1].charAt(0).toLowerCase() + c[1].slice(1)}</p></div>`).join('')}</div></div>`),
    facts: () => card(`<div class="m-blk c"><h2 class="m-ht">Почему выбирают наш интернет</h2><div class="m-facts">${FACTS.map((f) => `<div class="m-fact"><p class="m-h3">${f[0]}</p><i class="m-dv"></i><p class="m-p m-sub">${f[1]}</p></div>`).join('')}</div></div>`),
    cols: () => card(`<div class="m-blk c"><h2 class="m-ht">Что умеет облачное хранилище</h2><p class="m-p">Все файлы компании в одном месте, с доступом с любого устройства:</p><div class="m-cols">${COLS.slice(0, 3).map((t) => `<div class="m-col"><i class="m-dv"></i><p class="m-p">${t}</p></div>`).join('')}</div><div class="m-cols two">${COLS.slice(3, 5).map((t) => `<div class="m-col"><i class="m-dv"></i><p class="m-p">${t}</p></div>`).join('')}</div><div class="m-col"><i class="m-dv"></i><p class="m-p">${COLS[5]}</p></div></div>`),
    plate: () => card(`<div class="m-blk"><div class="m-lp"><h2 class="m-ht">Когда это удобно?</h2><ul>${[['сотрудники пользуются', 'одновременно смартфоном и планшетом'], ['они по-разному', 'потребляют интернет: кому-то хватает 10 ГБ, кому-то нужно больше'], ['есть устройства', 'с небольшим потреблением трафика, например часы или датчики']].map((r) => `<li><span class="m-acc">${r[0]}</span> ${r[1]}</li>`).join('')}</ul></div></div>`),
  };

  // ---------- рамки и сноски ----------
  const frame = {
    dashed: () => card(`<div class="m-blk c"><h2 class="m-h2">Создать кабинет можно за несколько шагов</h2><div class="m-frame"><p class="m-p">Войдите по номеру телефона любого оператора → выберите «Создать кабинет» → заполните данные → добавьте компанию и нужные договоры → отправьте заявку</p></div><p class="m-p m-sub">Когда доступ откроется, мы пришлем уведомление. Обычно это занимает не больше 24 часов</p></div>`),
    solid: () => card(`<div class="m-blk"><h2 class="m-h2">Плановые работы на сети</h2><p class="m-p">Мы обновляем оборудование, чтобы связь в вашем районе стала стабильнее</p><div class="m-frame solid"><p class="m-p"><b>12 ноября с 02:00 до 05:00 по Москве</b><br>связь может прерываться на несколько минут</p></div></div>`),
    notes: () => card(`<div class="m-blk"><h2 class="m-h2">Скидка 30% на первые три месяца<span class="m-sup">1</span></h2><p class="m-p">Подключите «Единый мониторинг» до 31 декабря и платите меньше, пока команда привыкает к приложению<span class="m-sup">2</span></p><div class="m-fn"><p><span class="m-sup">1</span> Скидка действует на абонентскую плату за первые три полных месяца</p><p><span class="m-sup">2</span> Предложение для новых клиентов, подробные условия на b2b.beeline.ru</p></div></div>`),
  };

  // ---------- модуль с иллюстрацией ----------
  const mod = {
    right: () => card(`<div class="m-mod"><div class="m-hd"><h2 class="m-h2">Управление задачами в модуле «Координатор»</h2><p class="m-p">Помогает улучшить качество выездного обслуживания:</p></div><div class="m-row">${ul(LIST5)}${plate('plate-courier.jpg', 'Курьер на скутере над картой в смартфоне')}</div></div>`),
    left: () => card(`<div class="m-mod"><h2 class="m-h2">Возможности модуля «Сотрудники»</h2><div class="m-row rev">${plate('plate-tariff.jpg', 'Смартфон и сим-карта')}<div class="m-stack"><p class="m-p">Отслеживайте перемещения курьеров, торговых представителей и сервисных инженеров на карте в режиме онлайн</p><p class="m-p">Приложение BeeTrack работает с сим-картами как билайн, так и других операторов связи</p></div></div>${btn('Оставить заявку')}</div>`),
    head: () => card(`<div class="m-mod"><div class="m-row"><div class="m-stack"><h2 class="m-h2">Облачная АТС для отдела продаж</h2><p class="m-p">Звонки, записи разговоров и аналитика в одном окне браузера</p></div>${plate('plate-cloud-ats.jpg', 'Облако и гарнитура')}</div>${ul(['запись и прослушивание звонков', 'распределение входящих по менеджерам', 'интеграция с CRM'])}</div>`),
  };

  // ---------- плитки и иконки ----------
  const tile = (g, h, p) => card(`<div class="m-tile"><div class="gl">${I ? I.gold(g, 72) : ''}</div><p class="m-h3">${h}</p><p class="m-p m-sub">${p}</p></div>`);
  const tiles = {
    grid: () => card(`<div class="m-blk c"><h2 class="m-h2">В бизнес-кабинете многое можно сделать самостоятельно</h2></div>`) +
      pair(tile('ruble', 'Скачать документы', 'Договоры, счета, акты сверки'), tile('clock', 'Проверить заказ', 'Статус заказа и сроки')) +
      pair(tile('users', 'Настроить доступы', 'Пользователи кабинета и их права'), tile('chart', 'Сформировать отчет', 'Отчеты по связи и расходам')) +
      tile('question', 'Быстро найти ответ', 'Задайте вопрос умному поиску. Если ответа нет, напишите нам в чат или создайте обращение в разделе «Поддержка»'),
    icons: () => card(`<div class="m-blk c"><h2 class="m-h2">Польза для бизнеса</h2><div class="m-icons">${[['signal', 'Связь без провалов в любом углу офиса'], ['shield', 'Защищенный канал для данных'], ['headset', 'Поддержка 24/7'], ['rocket', 'Запуск за один день'], ['wifi', 'Wi-Fi для гостей и сотрудников'], ['ruble', 'Фиксированная цена в договоре']].map((x) => `<div><div class="ic">${I ? I.ink(x[0], 40, 'currentColor') : ''}</div><i class="m-dv"></i><p class="m-p">${x[1]}</p></div>`).join('')}</div></div>`),
  };

  // ---------- оффер и цена ----------
  const offer = {
    price: () => card(`<div class="m-offer m-c"><span class="m-badge">Спецпредложение</span><h2 class="m-h2">Тариф «Бизнес Безлимит»</h2><div class="m-price"><p class="m-big">1 290 ₽</p><p class="per">в месяц за номер, без НДС</p></div>${btns(btn('Подключить'))}</div>`),
    old: () => card(`<div class="m-offer m-c"><h2 class="m-h2">Безлимитный интернет для офиса</h2><div class="m-price"><p class="old">2 490 ₽</p><p class="m-big">1 690 ₽ в месяц</p><p class="per">первые три месяца, далее по тарифу</p></div><p class="m-p">Скорость до 500 Мбит/с и роутер в аренду за 0 ₽</p>${btns(btn('Подключить'))}</div>`),
    promo: () => card(`<div class="m-offer m-c"><span class="m-badge">Подарок от партнера</span><h2 class="m-h2">Скидка 20% на подарки для команды</h2><p class="m-p">Назовите промокод при заказе на сайте партнера до 31 декабря</p><span class="m-promo">BEE2026</span>${btns(btn('Выбрать подарки'))}</div>`),
    compare: () => card(`<div class="m-blk"><h2 class="m-h2 m-c">Выберите тариф</h2><div class="m-tar">${[['Старт', '590 ₽', ['20 ГБ интернета', '500 минут', 'безлимит на мессенджеры']], ['Бизнес', '990 ₽', ['50 ГБ интернета', '1 500 минут', 'раздача интернета']]].map((t, i) => `<div class="m-plate"><p class="m-h3">${t[0]}</p><p class="m-big">${t[1]}<span class="per" style="font-size:16px;font-weight:400;color:var(--m-sub)"> в месяц</span></p>${ul(t[2])}${btn('Выбрать', i === 0)}</div>`).join('')}</div></div>`),
  };

  // ---------- CTA ----------
  const cta = {
    one: () => card(`<div class="m-blk c"><h2 class="m-h2">Подключим за один день</h2><p class="m-p">Оставьте заявку, и менеджер перезвонит, чтобы обсудить задачи вашей команды</p>${btns(btn('Оставить заявку'))}</div>`),
    two: () => card(`<div class="m-blk c"><h2 class="m-h2">Попробуйте 14 дней бесплатно</h2><p class="m-p">Подключим тестовый доступ для пяти сотрудников</p>${btns(btn('Попробовать'), btn('Подробнее', true))}</div>`),
    note: () => card(`<div class="m-blk c"><h2 class="m-h2">Остались вопросы?</h2>${btns(btn('Написать в чат'))}<p class="m-p m-sub">Или ответьте на это письмо, мы прочитаем</p></div>`),
  };

  // ---------- новые блоки, на согласование ----------
  const fresh = {
    quote: () => card(`<div class="m-blk"><div class="m-quote">${I ? `<span class="q">${I.ink('quote', 28, '#FFC800')}</span>` : ''}<p class="m-lb" style="font-weight:400">Подключили 40 курьеров за день и сразу увидели, где теряем время на маршрутах</p><div class="who"><span class="av">АС</span><p class="m-p"><b>Анна Смирнова</b><br><span class="m-sub">руководитель логистики, сеть пекарен</span></p></div></div></div>`),
  };

  // ---------- подвал ----------
  const SOC = ['telegram', 'vkontakte', 'odnoklassniki'];
  const social = () => `<div class="m-soc"><div class="ics">${SOC.map((s) => `<img src="${IMG}social-${s}.svg" width="32" height="32" alt="${s}">`).join('')}</div><img src="${IMG}slogan.svg" width="92" height="32" alt="билайн на твоей стороне"></div>`;
  const DISC = 'Рассылка носит информационный характер и не является публичной офертой. С условиями оказания услуг, тарифами, ограничениями и требованиями к услугам вы можете ознакомиться на сайте <a href="#" onclick="return false">b2b.beeline.ru</a>';
  const LEGAL = ['18+. Реклама. ПАО «ВымпелКом», РФ, 127083, г. Москва, ул. Восьмого марта, д. 10, стр. 14, ОГРН 1027700166636', 'Специально для вас мы подбираем самую полезную информацию об акциях, выгодных тарифах и услугах билайн', 'Вы можете <a href="#" onclick="return false">отказаться</a> от получения писем с важными сообщениями от билайн'];
  const footer = {
    std: () => `<div class="m-foot">${social()}<div class="m-disc"><p>${DISC}</p></div><div class="m-legal">${LEGAL.map((l) => `<p>${l}</p>`).join('')}</div></div>`,
    partner: () => `<div class="m-foot">${social()}<div class="m-disc"><p>${DISC}</p><p>Организатор акции ООО «Партнер», ОГРН 0000000000000. Срок акции с 1 по 31 декабря. Количество промокодов ограничено</p></div><div class="m-legal">${LEGAL.map((l) => `<p>${l}</p>`).join('')}</div></div>`,
    short: () => `<div class="m-foot">${social()}<div class="m-short"><p>Это сервисное письмо о вашем договоре с билайн, оно приходит всем клиентам услуги</p><p>ПАО «ВымпелКом», РФ, 127083, г. Москва, ул. Восьмого марта, д. 10, стр. 14, ОГРН 1027700166636</p></div></div>`,
  };

  // ---------- витрины компонентов для гайда ----------
  // v: вариант, label: подпись на кнопке, note: когда брать, html(): содержимое .ml
  const solo = (h) => body(h, true);
  const COMP = {
    header: [
      { v: 'card', label: 'В первой карточке', note: 'Логотип стоит в верхней части первой карточки, над имиджем. Поле 72: по 19 сверху и снизу, логотип 222×34 по центру', html: () => solo(card(head() + hero('monitoring'))) },
      { v: 'partner', label: 'С партнером', note: 'Для совместных писем: справа от логотипа через линию 1×24 стоит логотип партнера той же высоты. Цвет фона шапки не меняем', html: () => solo(card(head({ partner: true }) + hero('gifts'))) },
    ],
    info: [
      { v: 'text', label: 'Заголовок и текст', note: 'H2 Arial Bold 20/26 и абзац 16/21. Поля 32, шаг 20', html: () => solo(info.text()) },
      { v: 'list', label: 'Список', note: 'Маркер точкой с отступом 8, текст с отступом 24, между пунктами 10. Пункты с маленькой буквы, без точки в конце', html: () => solo(info.list()) },
      { v: 'lead', label: 'Жирное начало', note: 'Начало пункта жирное, продолжение серым #787878: читатель пробегает список по первым словам', html: () => solo(info.lead()) },
      { v: 'center', label: 'Заголовок по центру', note: 'Короткий список под центрированным подзаголовком 16/21 Bold', html: () => solo(info.center()) },
      { v: 'sections', label: 'Два раздела', note: 'Несколько смысловых частей в одной карточке разделяем отступом 32, а не линией', html: () => solo(info.sections()) },
    ],
    steps: [
      { v: 'line', label: 'Одной строкой', note: 'Кружок 32 #FFF4CE, номер 13/32, отступ до текста 16, между шагами 15', html: () => solo(steps.line()) },
      { v: 'lead', label: 'Жирное начало', note: 'Действие жирным, уточнение обычным: удобно, когда шагов три или четыре', html: () => solo(steps.lead()) },
      { v: 'desc', label: 'С описанием', note: 'Название шага Bold, описание серым с отступом 8, между шагами 20', html: () => solo(steps.desc()) },
      { v: 'plates', label: 'Плашки 01–04', note: 'Каждый шаг на плашке r12, номер в белой капсуле 48×32, последний шаг желтый: это результат', html: () => solo(steps.plates()) },
    ],
    adv: [
      { v: 'checks', label: 'Галочки', note: 'Плашки с галочкой 20: заголовок Bold и текст по центру. Три плашки, шаг 8', html: () => solo(adv.checks()) },
      { v: 'checklead', label: 'Галочки с акцентом', note: 'Первые слова выделены. В темном письме акцент желтый, в светлом жирный черный: желтый текст на белом не читается', html: () => solo(adv.checklead()) },
      { v: 'facts', label: 'Столбик с линиями', note: 'Тезис Bold, желтая линия 48×2, пояснение серым. До пяти тезисов', html: () => solo(adv.facts()) },
      { v: 'cols', label: 'Колонки', note: 'Сетка 3 + 2 + 1, линия 48×2 над каждым тезисом. На мобильном в одну колонку', html: () => solo(adv.cols()) },
      { v: 'plate', label: 'Список в плашке', note: 'Подложка-плашка, внутри строки r12 с желтым маркером. Для трех-четырех условий «когда это удобно»', html: () => solo(adv.plate()) },
    ],
    frame: [
      { v: 'dashed', label: 'Пунктирная рамка', note: 'Рамка 2 px пунктиром #FFC800, r15: путь по шагам через стрелки или промокод', html: () => solo(frame.dashed()) },
      { v: 'solid', label: 'Сплошная рамка', note: 'Сплошная рамка для важного в сервисном письме: дата работ, срок, условие', html: () => solo(frame.solid()) },
      { v: 'notes', label: 'Сноски', note: 'Сноски 13/16 серым в конце карточки, к которой относятся. Номер сноски 11 px надстрочным', html: () => solo(frame.notes()) },
    ],
    mod: [
      { v: 'right', label: 'Иллюстрация справа', note: 'Ряд 280 + 20 + 280: список слева, плашка #F5F5F5 r12 с иллюстрацией справа, высота от 208. Поля 20/30/24', html: () => solo(mod.right()) },
      { v: 'left', label: 'Иллюстрация слева', note: 'Плашка слева, текст справа, кнопка по центру под рядом. На мобильном плашка уходит вниз под текст', html: () => solo(mod.left()) },
      { v: 'head', label: 'Заголовок в ряду', note: 'Заголовок и лид в ряду с плашкой, список под рядом на всю ширину', html: () => solo(mod.head()) },
    ],
    tiles: [
      { v: 'grid', label: 'Плитки 2×2 + 1', note: 'Плитки 314 по две в ряд через 12, последняя на всю ширину. Иконка 3D 72, заголовок Bold, текст серым', html: () => solo(tiles.grid()) },
      { v: 'icons', label: 'Сетка иконок', note: 'Три колонки: линейная иконка 40, желтая линия 48×2, текст. Иконки из одной библиотеки, PNG ×4', html: () => solo(tiles.icons()) },
    ],
    offer: [
      { v: 'price', label: 'Цена', note: 'Плашка типа, название, цена Arial Bold 28/32, условие серым, кнопка. Цена одна на карточку', html: () => solo(offer.price()) },
      { v: 'old', label: 'Старая цена', note: 'Старая цена 20/26 серым и зачеркнута над новой. Условие скидки пишем сразу под ценой', html: () => solo(offer.old()) },
      { v: 'promo', label: 'Промокод', note: 'Промокод в пунктирной рамке, Bold 24/28 с разрядкой, чтобы его было легко переписать', html: () => solo(offer.promo()) },
      { v: 'compare', label: 'Два тарифа', note: 'Два тарифа на плашках рядом. Основная кнопка у рекомендуемого, у второго серая', html: () => solo(offer.compare()) },
    ],
    cta: [
      { v: 'one', label: 'Одна кнопка', note: 'Заголовок, одна фраза и кнопка 240×50. Один основной CTA на экран', html: () => solo(cta.one()) },
      { v: 'two', label: 'Две кнопки', note: 'Основная желтая и вторичная #EBEBEB через 16. Вторичная никогда не бывает желтой', html: () => solo(cta.two()) },
      { v: 'note', label: 'Кнопка и подпись', note: 'Под кнопкой можно дать запасной путь серым текстом 16/21', html: () => solo(cta.note()) },
    ],
    fresh: [
      { v: 'quote', label: 'Цитата клиента', note: 'Цитата на плашке, знак кавычек #FFC800, аватар 48 с инициалами или фото. Новый блок, на согласование', html: () => solo(fresh.quote()) },
    ],
    footer: [
      { v: 'std', label: 'Стандартный', note: 'Соцсети 32 через 10, слоган 92×32, дисклеймер на #DDDDDD, юридический текст на #C3C3C3. Текст 11/13 по центру', html: () => footer.std() },
      { v: 'partner', label: 'С партнером', note: 'К дисклеймеру добавляем организатора акции, сроки и ограничения', html: () => footer.partner() },
      { v: 'short', label: 'Сервисный', note: 'Для сервисных писем без рекламы: соцсети, слоган и короткий юридический текст на фоне письма', html: () => footer.short() },
    ],
  };

  // ---------- готовые письма ----------
  const L = (blocks, foot) => body(blocks.join('')) + (foot || footer.std)();
  const LETTERS = [
    { id: 'sale', label: 'Продажа услуги', note: 'Письмо «Единый мониторинг»: первый экран с жирным лидом, два модуля с иллюстрациями, кнопка в последнем модуле', html: () => L([first({ withBold: true }), mod.right(), mod.left()]) },
    { id: 'offer', label: 'Спецпредложение', note: 'Письмо с партнером: шапка с двумя логотипами, плашка типа, промокод, условия и подвал с организатором акции', html: () => L([first({ partner: true, hero: 'gifts', badge: 'Подарок от партнера', h1: 'Подарки для команды со скидкой 20%', lead: 'Партнер билайн бизнес дарит скидку на корпоративные подарки до конца года' }), offer.promo(), steps.lead()], footer.partner) },
    { id: 'product', label: 'Продукт и тариф', note: 'Безлимитный интернет: факты столбиком, цена со старой ценой, сноски', html: () => L([first({ hero: 'unlimited', h1: 'Интернет, который не уходит на перерыв', lead: 'Выделенная линия для офиса со скоростью до 500 Мбит/с' }), adv.facts(), offer.old(), frame.notes()]) },
    { id: 'how', label: 'Подключение', note: 'Фемтосота: где нужна, что вы получаете, шаги на плашках, CTA', html: () => L([first({ hero: 'femto', h1: 'Связь там, где ее не было', lead: 'Фемтосота усиливает сигнал билайн в помещениях, куда не добивает сеть' }), info.center(), info.lead(), steps.plates(), cta.one()]) },
    { id: 'cabinet', label: 'Онбординг', note: 'Бизнес-кабинет: плитки 2×2 + 1 с 3D-иконками и путь по шагам в пунктирной рамке', html: () => L([first({ hero: 'abonement', h1: 'Бизнес-кабинет: все услуги в одном окне', lead: 'Документы, заказы и доступы сотрудников, без звонков и визитов в офис' }), tiles.grid(), frame.dashed()]) },
    { id: 'service', label: 'Сервисное', note: 'Без иллюстрации: обращение, срок работ Bold в рамке, вопрос с кнопкой чата и короткий подвал', html: () => L([first({ hero: false, top: true, h1: 'Уважаемые клиенты!', lead: 'В ноябре мы обновляем оборудование на сети. Ниже время работ в вашем районе' }), frame.solid(), cta.note()], footer.short) },
  ];

  root.CVMMail = { IMG, HEROES, COMP, LETTERS, parts: { card, body, btn, btns, head, hero, title, first, info, steps, adv, frame, mod, tiles, offer, cta, fresh, footer, social } };
})(window);
