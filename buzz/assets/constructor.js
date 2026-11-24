/* Конструктор постов CVM в Buzz. Пост хранится как JSON, превью и PNG рисуются из тех же шаблонов */
(function () {
  'use strict';
  const { TEMPLATES: T, RUBRICS, FORMATS, BG_NAMES, PASTELS, RECIPES, SAMPLES, renderCard, size, plain } = window.CVMTpl;
  const G = window.CVMIll.GLYPHS;
  const $ = (s) => document.querySelector(s);
  const KEY = 'cvm-buzz-post-v1';
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let post = null, sel = 0, view = 'desk', timer = null;

  // ---------- состояние ----------
  function load() {
    try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) { /* хранилище недоступно */ }
    return clone(SAMPLES.post3);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(post)); } catch (e) { /* без черновика */ } }
  function setPost(p) {
    post = p; post.cards = post.cards || []; post.format = post.format || '45'; post.rubric = post.rubric || 'cases';
    sel = Math.min(sel, Math.max(0, post.cards.length - 1));
    syncTop(); drawCards(); drawEditor(); drawAlbum(); drawChecks(); save();
  }

  // ---------- верхние настройки ----------
  function fillSelect(el, items, val) { el.innerHTML = items.map(([v, l]) => `<option value="${esc(v)}"${v === val ? ' selected' : ''}>${esc(l)}</option>`).join(''); }
  function syncTop() {
    fillSelect($('#rubric'), Object.values(RUBRICS).map((r) => [r.id, r.label]), post.rubric);
    fillSelect($('#format'), [['45', 'Карусель 4:5'], ['11', 'Квадрат 1:1'], ['169', 'Ролик 16:9'], ['916', 'Ролик 9:16'], ['31', 'Шапка 3:1']], post.format);
    const rec = [['post3', 'Эталон: пост 3, кейс ОАТС']];
    Object.entries(RECIPES).forEach(([rid, list]) => list.forEach((r, i) => rec.push([`${rid}:${i}`, `${RUBRICS[rid].label}: ${r.name}`])));
    rec.push(['know', 'Пример с текстом: А знаете ли вы?'], ['features', 'Пример с текстом: Новые фичи'], ['team', 'Пример с текстом: Знакомство']);
    rec.push(['avatar', 'Аватар канала'], ['header', 'Шапка канала']);
    fillSelect($('#recipe'), rec, $('#recipe').value || 'post3');
    $('#ptext').value = post.text || '';
    $('#ptitle').textContent = post.name || 'Пост';
    fillSelect($('#inner-bg'), [['', 'Как в шаблонах'], ['white', 'Белый']].concat(Object.keys(PASTELS).map((k) => [k, `${PASTELS[k].name}: ${PASTELS[k].use.split(':')[0].toLowerCase()}`])), innerBg());
    $('#banner').innerHTML = post.example ? '<div class="banner">Пример с условным текстом: замените формулировки и цифры на данные своего кейса</div>' : '';
    countText();
  }
  function applyRecipe(v) {
    sel = 0;
    const RT = window.CVMVoice.RUBRIC_TEXT;
    if (SAMPLES[v]) { const sp = clone(SAMPLES[v]); if (!sp.text && RT[sp.rubric]) sp.text = RT[sp.rubric].example; return setPost(sp); }
    if (v === 'avatar') return setPost({ name: 'Аватар канала', format: '11', rubric: 'cases', cards: [{ t: 'avatar', d: clone(T.avatar.sample) }] });
    if (v === 'header') return setPost({ name: 'Шапка канала', format: '31', rubric: 'cases', cards: [{ t: 'channel-header', d: clone(T['channel-header'].sample) }] });
    const [rid, i] = v.split(':'); const r = RECIPES[rid][+i];
    const fmt = r.cards[0] === 'video-cover' ? '169' : '45';
    setPost({ name: `${RUBRICS[rid].label}: ${r.name}`, format: fmt, rubric: rid, example: true, text: RT[rid] ? RT[rid].skeleton : '', cards: r.cards.map((t) => ({ t, d: clone(T[t].sample) })) });
  }

  // ---------- фон внутренних карточек ----------
  const isInner = (i) => i > 0 && i < post.cards.length - 1;
  // общий фон внутренних карточек: если у всех внутренних, где его можно поставить, он один и тот же
  function innerBg() {
    const set = new Set();
    post.cards.forEach((c, i) => { if (isInner(i) && T[c.t] && T[c.t].bgs.length > 1) set.add((c.d && c.d.bg) || T[c.t].bg); });
    return set.size === 1 ? [...set][0] : '';
  }
  function fitBg(c, bg) {
    if (!bg || !T[c.t]) return;
    if (T[c.t].bgs.indexOf(bg) >= 0) c.d.bg = bg;
  }
  function applyInner(bg) {
    if (!bg) return;
    post.inner = bg;
    post.cards.forEach((c, i) => { if (isInner(i)) fitBg(c, bg); });
  }

  // ---------- список карточек ----------
  function drawCards() {
    const n = post.cards.length;
    $('#cards').innerHTML = post.cards.map((c, i) => `<button type="button" data-i="${i}" aria-pressed="${i === sel}" title="${esc(T[c.t] ? T[c.t].name : c.t)}">${i + 1}</button>`).join('')
      + (n < 10 ? '<button type="button" class="add" id="add">+ Карточка</button>' : '');
  }

  // ---------- редактор ----------
  function glyphOptions(val) {
    return '<option value="">Нет</option>' + Object.entries(G).map(([id, g]) => `<option value="${id}"${id === val ? ' selected' : ''}>${esc(g.name)}</option>`).join('');
  }
  function field(f, val, path) {
    const id = 'f-' + path.join('-');
    const lab = `<label class="f" for="${id}">${esc(f.label)}</label>`;
    const hint = f.hint ? `<div class="hint">${esc(f.hint)}</div>` : '';
    const p = esc(JSON.stringify(path));
    switch (f.type) {
      case 'text': return `<div class="fld">${lab}<input type="text" id="${id}" data-p='${p}' value="${esc(val)}">${hint}</div>`;
      case 'textarea': return `<div class="fld">${lab}<textarea id="${id}" data-p='${p}' rows="${String(val || '').length > 160 ? 6 : 3}">${esc(val)}</textarea>${hint}</div>`;
      case 'select': return `<div class="fld">${lab}<select id="${id}" data-p='${p}'>${f.options.map(([v, l]) => `<option value="${v}"${v === (val || f.options[0][0]) ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>${hint}</div>`;
      case 'glyph': return `<div class="fld">${lab}<div class="glyph-pick"><span class="gp" data-gp="${id}">${val ? window.CVMIll.gold(val, 28) : ''}</span><select id="${id}" data-p='${p}' data-glyph="1">${glyphOptions(val)}</select></div>${hint}</div>`;
      case 'bg': { const tpl = T[post.cards[sel].t]; return tpl.bgs.length > 1 ? `<div class="fld">${lab}<select id="${id}" data-p='${p}'>${tpl.bgs.map((b) => `<option value="${b}"${b === (val || tpl.bg) ? ' selected' : ''}>${BG_NAMES[b]}</option>`).join('')}</select></div>` : ''; }
      case 'check': return `<div class="fld"><label class="chk"><input type="checkbox" id="${id}" data-p='${p}'${val ? ' checked' : ''}> ${esc(f.label)}</label></div>`;
      case 'image': return `<div class="fld">${lab}<input type="file" accept="image/*" id="${id}" data-p='${p}' data-img="1">${val ? `<div style="display:flex;gap:8px;align-items:center;margin-top:6px"><img src="${esc(val)}" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:10px"><button type="button" class="btn sm" data-clear='${p}'>Убрать фото</button></div>` : ''}<div class="hint">Фото остается только в этом посте и в JSON</div></div>`;
      case 'list': {
        const arr = Array.isArray(val) ? val : [];
        const items = arr.map((it, j) => `<div class="li"><div class="li-h"><span>${esc(f.label)} ${j + 1}</span><span>
<button type="button" class="btn sm ghost" data-mv='${esc(JSON.stringify([...path, j, -1]))}' aria-label="Выше">↑</button><button type="button" class="btn sm ghost" data-mv='${esc(JSON.stringify([...path, j, 1]))}' aria-label="Ниже">↓</button><button type="button" class="btn sm ghost" data-rm='${esc(JSON.stringify([...path, j]))}' aria-label="Удалить">✕</button></span></div>
${f.item.map((sf) => field(sf, it[sf.k], [...path, j, sf.k])).join('')}</div>`).join('');
        const add = arr.length < (f.max || 8) ? `<button type="button" class="btn sm" style="margin-top:8px" data-add='${p}'>+ Добавить</button>` : '';
        return `<div class="fld"><div class="f" style="font-size:13px;font-weight:700;color:var(--sub)">${esc(f.label)}</div>${items}${add}</div>`;
      }
      default: return '';
    }
  }
  function drawEditor() {
    const c = post.cards[sel];
    if (!c) { $('#editor').innerHTML = '<p class="muted small">Добавьте первую карточку</p>'; return; }
    const tpl = T[c.t];
    const groups = {};
    Object.entries(T).forEach(([id, t]) => { (groups[t.group] = groups[t.group] || []).push([id, t]); });
    const opts = Object.entries(groups).map(([g, list]) => `<optgroup label="${esc(g)}">${list.map(([id, t]) => `<option value="${id}"${id === c.t ? ' selected' : ''}>${esc(t.name)}${t.rubrics.indexOf(post.rubric) >= 0 ? ' ★' : ''}</option>`).join('')}</optgroup>`).join('');
    $('#editor').innerHTML = `<div class="ed-h"><select id="tpl" aria-label="Шаблон карточки">${opts}</select>
<button type="button" class="btn sm" id="up" aria-label="Переместить левее">←</button><button type="button" class="btn sm" id="down" aria-label="Переместить правее">→</button>
<button type="button" class="btn sm" id="dup">Копия</button><button type="button" class="btn sm" id="del">Удалить</button></div>
<div class="desc">${esc(tpl.desc)} ★ подходит рубрике. Форматы: ${tpl.formats.map((f) => FORMATS[f].name).join(', ')}</div>
${tpl.fields.map((f) => field(f, c.d[f.k], [f.k])).join('')}
<div class="hint" style="margin-top:14px">Разметка: [[ключевая фраза]] в линзе, {{имя клиента}} размыть, **жирный**. Текст реплик не редактируем</div>`;
  }
  function getAt(obj, path) { return path.reduce((o, k) => (o == null ? o : o[k]), obj); }
  function setAt(obj, path, v) { let o = obj; for (let i = 0; i < path.length - 1; i++) { if (o[path[i]] == null) o[path[i]] = typeof path[i + 1] === 'number' ? [] : {}; o = o[path[i]]; } o[path[path.length - 1]] = v; }

  // ---------- альбом ----------
  function albumCols() {
    const f = FORMATS[post.format] || FORMATS['45'];
    const n = post.cards.length;
    if (f.w > f.h) return view === 'phone' ? 1 : Math.min(2, n);
    return view === 'phone' ? Math.min(2, n) : Math.min(3, n);
  }
  function drawAlbum() {
    const al = $('#album');
    const host = al.parentElement;
    const cols = Math.max(1, albumCols());
    al.className = 'album' + (view === 'phone' ? ' phone' : '');
    const maxW = view === 'phone' ? Math.min(420, host.clientWidth) : host.clientWidth;
    const inner = maxW - (view === 'phone' ? 20 : 0);
    const cw = Math.floor((inner - (cols - 1) * 4) / cols);
    al.style.width = maxW + 'px';
    al.style.gridTemplateColumns = `repeat(${cols},${cw}px)`;
    al.innerHTML = post.cards.map((c, i) => `<div class="pv${i === sel ? ' sel' : ''}" data-i="${i}" role="button" tabindex="0" aria-label="Карточка ${i + 1}"></div>`).join('');
    post.cards.forEach((c, i) => paint(i, cw));
  }
  function paint(i, cw) {
    const el = $(`#album .pv[data-i="${i}"]`); if (!el) return;
    const c = post.cards[i];
    if (!cw) cw = el.clientWidth;
    const f = size(c, post);
    const s = cw / f.w;
    el.style.width = cw + 'px'; el.style.height = Math.round(f.h * s) + 'px';
    el.innerHTML = `<div class="pv-in" style="width:${f.w}px;height:${f.h}px;transform:scale(${s})">${renderCard(c, post, i, post.cards.length)}</div>`;
  }
  function selectCard(i) {
    sel = i; drawCards(); drawEditor();
    document.querySelectorAll('#album .pv').forEach((e) => e.classList.toggle('sel', +e.dataset.i === sel));
  }

  // ---------- проверки ----------
  function countText() {
    const t = $('#ptext').value; const n = t.length;
    $('#pcount').textContent = `${n} из 600 знаков`;
    $('#pcount').style.color = n > 600 ? 'var(--warn)' : '';
  }
  function drawChecks() {
    const t = (post.text || '').trim();
    const all = post.cards.map((c) => JSON.stringify(c.d)).join(' ');
    const first = post.cards[0], last = post.cards[post.cards.length - 1];
    const acc = (c) => c && ['yellow', 'violet'].indexOf((c.d && c.d.bg) || (T[c.t] && T[c.t].bg)) >= 0;
    const items = [
      [post.cards.length > 0 && post.cards.length <= 10, `Карточек: ${post.cards.length}`],
      [acc(first), 'Первая карточка акцентная'],
      [post.cards.length < 2 || acc(last), 'Последняя карточка акцентная'],
    ];
    const pas = new Set(post.cards.map((c) => c.d && c.d.bg).filter((b) => PASTELS[b]));
    // длинный альбом: от четырех карточек внутренние белые, иначе сетка перегружена
    const n = post.cards.length;
    if (n >= 4) {
      const colored = post.cards.filter((c, i) => isInner(i) && ((c.d && c.d.bg) || (T[c.t] && T[c.t].bg)) !== 'white').length;
      items.push([colored === 0, colored === 0 ? 'Внутренние карточки на белом' : `Карточек ${n}: внутренние лучше на белом, цветных сейчас ${colored}`]);
    }
    if (pas.size) items.push([pas.size === 1, pas.size === 1 ? 'Одна пастель на пост' : `Пастелей в посте: ${pas.size}, оставьте одну`]);
    if (post.cards.some((c) => c.t === 'dialog' && c.d && c.d.bg === 'lemon')) items.push([false, 'Лимонный фон под репликами агента: желтый сливается с фоном']);
    // текст поста: правила голоса и эмодзи из voice.js
    const lint = window.CVMVoice.lintText(t, post.rubric);
    const okN = lint.filter((x) => x.ok).length;
    items.push([okN === lint.length, `Текст поста: ${okN} из ${lint.length} правил`]);
    lint.filter((x) => !x.ok).forEach((x) => items.push([false, x.hint ? `${x.label}. ${x.hint}` : x.label]));
    const manual = ['Имена, телефоны и ИНН клиентов скрыты', 'Цифры с периодом и проверены у автора', 'Агент не называет себя человеком'];
    $('#checks').innerHTML = items.map(([ok, l]) => `<span class="pill ${ok ? 'ok' : 'warn'}">${ok ? '✓' : '!'} ${esc(l)}</span>`).join('')
      + manual.map((l) => `<span class="pill vi">Проверить: ${esc(l)}</span>`).join('');
  }

  // ---------- события ----------
  function rerender(i) { clearTimeout(timer); timer = setTimeout(() => { paint(i); drawChecks(); save(); }, 120); }
  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'ptext') { post.text = el.value; countText(); drawChecks(); save(); return; }
    if (!el.dataset.p || el.dataset.img) return;
    const path = JSON.parse(el.dataset.p);
    const v = el.type === 'checkbox' ? el.checked : el.value;
    setAt(post.cards[sel].d, path, v);
    if (el.dataset.glyph) { const gp = document.querySelector(`[data-gp="${el.id}"]`); if (gp) gp.innerHTML = v ? window.CVMIll.gold(v, 28) : ''; }
    rerender(sel);
  });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.id === 'rubric') { post.rubric = el.value; drawEditor(); drawAlbum(); drawChecks(); save(); return; }
    if (el.id === 'format') { post.format = el.value; drawAlbum(); save(); return; }
    if (el.id === 'inner-bg') { applyInner(el.value); drawEditor(); drawAlbum(); drawChecks(); save(); return; }
    if (el.id === 'tpl') {
      const c = post.cards[sel]; const t = el.value;
      c.t = t; c.d = Object.assign(clone(T[t].sample), {});
      if (isInner(sel)) fitBg(c, post.inner);
      drawEditor(); drawAlbum(); drawChecks(); save(); return;
    }
    if (el.dataset.img && el.files && el.files[0]) {
      const r = new FileReader();
      r.onload = () => { setAt(post.cards[sel].d, JSON.parse(el.dataset.p), r.result); drawEditor(); paint(sel); save(); };
      r.readAsDataURL(el.files[0]);
    }
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('button, .pv, a');
    if (!b) return;
    if (b.matches('#cards button[data-i]')) return selectCard(+b.dataset.i);
    if (b.id === 'add') {
      const t = (RUBRICS[post.rubric] && post.cards.length === 0) ? RUBRICS[post.rubric].cover : 'dialog';
      post.cards.push({ t, d: clone(T[t].sample) }); sel = post.cards.length - 1;
      drawCards(); drawEditor(); drawAlbum(); drawChecks(); save(); return;
    }
    if (b.classList.contains('pv')) return selectCard(+b.dataset.i);
    if (b.id === 'apply-recipe') return applyRecipe($('#recipe').value);
    if (b.id === 'ptext-tpl') {
      const tt = window.CVMVoice.RUBRIC_TEXT[post.rubric] || window.CVMVoice.RUBRIC_TEXT.cases;
      if ((post.text || '').trim() && !window.confirm('Заменить текст поста заготовкой рубрики?')) return;
      post.text = tt.skeleton; $('#ptext').value = post.text; countText(); drawChecks(); save(); return;
    }
    if (b.id === 'del') { post.cards.splice(sel, 1); sel = Math.max(0, sel - 1); drawCards(); drawEditor(); drawAlbum(); drawChecks(); save(); return; }
    if (b.id === 'dup') { post.cards.splice(sel + 1, 0, clone(post.cards[sel])); sel++; drawCards(); drawEditor(); drawAlbum(); save(); return; }
    if (b.id === 'up' || b.id === 'down') {
      const j = sel + (b.id === 'up' ? -1 : 1); if (j < 0 || j >= post.cards.length) return;
      [post.cards[sel], post.cards[j]] = [post.cards[j], post.cards[sel]]; sel = j; drawCards(); drawEditor(); drawAlbum(); drawChecks(); save(); return;
    }
    if (b.dataset.add) { const p = JSON.parse(b.dataset.add); const arr = getAt(post.cards[sel].d, p) || []; arr.push({}); setAt(post.cards[sel].d, p, arr); drawEditor(); paint(sel); save(); return; }
    if (b.dataset.rm) { const p = JSON.parse(b.dataset.rm); const j = p.pop(); getAt(post.cards[sel].d, p).splice(j, 1); drawEditor(); paint(sel); save(); return; }
    if (b.dataset.mv) { const p = JSON.parse(b.dataset.mv); const dir = p.pop(); const j = p.pop(); const arr = getAt(post.cards[sel].d, p); const k = j + dir; if (k < 0 || k >= arr.length) return; [arr[j], arr[k]] = [arr[k], arr[j]]; drawEditor(); paint(sel); save(); return; }
    if (b.dataset.clear) { setAt(post.cards[sel].d, JSON.parse(b.dataset.clear), ''); drawEditor(); paint(sel); save(); return; }
    if (b.id === 'v-desk' || b.id === 'v-phone') { view = b.id === 'v-desk' ? 'desk' : 'phone'; $('#v-desk').setAttribute('aria-pressed', view === 'desk'); $('#v-phone').setAttribute('aria-pressed', view === 'phone'); drawAlbum(); return; }
    if (b.id === 'open-json') { $('#json').value = JSON.stringify(post, null, 2); $('#json-st').textContent = ''; $('#dj').showModal(); return; }
    if (b.id === 'json-close') return $('#dj').close();
    if (b.id === 'json-copy') { const t = $('#json'); navigator.clipboard && navigator.clipboard.writeText(t.value).then(() => { $('#json-st').textContent = 'Скопировано'; }, () => { t.select(); $('#json-st').textContent = 'Выделено, скопируйте сочетанием клавиш'; }); return; }
    if (b.id === 'json-apply') {
      try { const p = JSON.parse($('#json').value); if (!Array.isArray(p.cards)) throw new Error('нет массива cards'); sel = 0; setPost(p); $('#dj').close(); }
      catch (err) { $('#json-st').textContent = 'Не получилось прочитать JSON: ' + err.message; }
      return;
    }
    if (b.id === 'export') return exportPng(b);
    if (b.id === 'dx-close') return $('#dx').close();
  });
  document.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('pv')) { e.preventDefault(); selectCard(+e.target.dataset.i); } });
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(drawAlbum, 150); });

  // ---------- экспорт ----------
  async function exportPng(btn) {
    if (!window.htmlToImage) { alertBox('Библиотека экспорта не загрузилась: проверьте доступ к cdnjs.cloudflare.com и обновите страницу'); return; }
    btn.disabled = true; const old = btn.textContent;
    const zip = window.JSZip ? new JSZip() : null; const shots = [];
    try {
      await document.fonts.ready;
      const nodes = [...document.querySelectorAll('#album .cv')];
      for (let i = 0; i < nodes.length; i++) {
        btn.textContent = `Готовлю ${i + 1} из ${nodes.length}`;
        const el = nodes[i]; const w = el.offsetWidth, h = el.offsetHeight;
        const blob = await htmlToImage.toBlob(el, { pixelRatio: 2, width: w, height: h, cacheBust: false });
        const name = `${String(i + 1).padStart(2, '0')}_${post.cards[i].t}.png`;
        shots.push([name, URL.createObjectURL(blob)]);
        if (zip) zip.file(name, blob);
      }
      $('#shots').innerHTML = shots.map(([n, u]) => `<figure style="margin:0"><img src="${u}" alt="${esc(n)}"><figcaption class="hint">${esc(n)}</figcaption></figure>`).join('');
      if (zip) { const zb = await zip.generateAsync({ type: 'blob' }); const a = $('#dx-zip'); a.href = URL.createObjectURL(zb); a.hidden = false; } else { $('#dx-zip').hidden = true; }
      $('#dx').showModal();
    } catch (err) {
      alertBox('Экспорт не удался: ' + (err && err.message ? err.message : err));
    } finally { btn.disabled = false; btn.textContent = old; }
  }
  function alertBox(t) { $('#banner').innerHTML = `<div class="banner">${esc(t)}</div>`; }

  window.CVMConstructor = { get post() { return post; }, load: (p) => { sel = 0; setPost(clone(p)); } };
  setPost(load());
})();
