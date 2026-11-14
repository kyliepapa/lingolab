const get = (key) => (localStorage.getItem(key) || '').trim();
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};

const orderLabels = { SVO: 'Subject · Verb · Object', SOV: 'Subject · Object · Verb', VSO: 'Verb · Subject · Object', VOS: 'Verb · Object · Subject', OVS: 'Object · Verb · Subject', OSV: 'Object · Subject · Verb' };
const placementLabels = { prefix: 'prefix', suffix: 'suffix', 'separate-before': 'separate word before', 'separate-after': 'separate word after' };
const placementText = (value) => placementLabels[value] || (value || '').split(' — ')[0].toLowerCase();

/* ---------- Grammar strip ---------- */
function grammarItem(label, value, wide) {
  const item = el('div', `grammar-item${wide ? ' wide' : ''}`);
  item.append(el('span', null, label));
  if (value instanceof Node) item.append(value);
  else item.append(el('strong', null, value || 'Not chosen'));
  return item;
}

function renderGrammar() {
  const grid = document.querySelector('#grammar-grid');

  const order = get('lingolab-sentence-order');
  grid.append(grammarItem('Sentence order', order ? `${order} — ${orderLabels[order]}` : ''));

  const adj = get('lingolab-adjective-placement');
  grid.append(grammarItem('Adjectives go', adj ? `${adj} the noun` : ''));

  const tenses = Object.keys(localStorage)
    .map((key) => key.match(/^lingolab-tense-(.+)-marker$/))
    .filter(Boolean)
    .map((m) => ({ name: m[1], marker: get(m[0]), place: get(`lingolab-tense-${m[1]}-placement`) }))
    .filter((t) => t.marker);
  const tenseBox = el('div');
  if (tenses.length) tenses.forEach((t) => tenseBox.append(el('strong', 'tense-line', `${t.name}: ${t.marker} (${placementText(t.place)})`)));
  else tenseBox.append(el('strong', null, 'Not chosen'));
  grid.append(grammarItem('Tenses', tenseBox));

  const conj = get('lingolab-personal-conjugations');
  grid.append(grammarItem('Personal conjugations', conj ? (conj === 'yes' ? 'Yes' : 'No — one verb form for everyone') : ''));
}

/* ---------- Word tables ---------- */
function tableCard({ title, accent, rows }) {
  const card = el('article', `report-card accent-${accent}`);
  card.append(el('h3', null, title));

  const head = el('div', 'report-row report-row-head');
  head.append(el('span', null, 'English'), el('span', null, 'Your word'));
  card.append(head);

  rows.forEach(({ english, mine, note }) => {
    const row = el('div', 'report-row');
    row.append(el('span', 'en', english));
    const cell = el('span', `mine${mine ? '' : ' empty'}`, mine || '—');
    if (mine && note) cell.append(el('small', null, note));
    row.append(cell);
    card.append(row);
  });
  return card;
}

const words = (list, prefix) => list.map((w) => ({ english: w, mine: get(`${prefix}-${w}`) }));

function renderTables() {
  const one = document.querySelector('#col-one');
  const two = document.querySelector('#col-two');
  const three = document.querySelector('#col-three');

  /* Column one: nouns, adjectives, question word */
  one.append(tableCard({ title: 'Nouns', accent: 'coral', rows: words(['name', 'turtle', 'apple', 'carrot'], 'lingolab-word') }));
  one.append(tableCard({ title: 'Adjectives', accent: 'teal', rows: words(['tiny', 'fast', 'blue'], 'lingolab-adjective') }));
  one.append(tableCard({ title: 'Question word', accent: 'navy', rows: [{ english: 'what', mine: get('lingolab-finishing-field-12') }] }));

  /* Column two: verbs, finishing touches */
  two.append(tableCard({
    title: 'Verbs',
    accent: 'navy',
    rows: [['to be', 'be'], ['enjoy', 'enjoy'], ['want', 'want'], ['like', 'like'], ['dance', 'dance'], ['eat', 'eat']]
      .map(([english, key]) => ({ english, mine: get(`lingolab-verb-${key}`) })),
  }));

  const touches = [];
  if (get('lingolab-articles') !== 'no') {
    touches.push({ english: 'a', mine: get('lingolab-finishing-field-2') });
    touches.push({ english: 'the', mine: get('lingolab-finishing-field-3') });
  }
  touches.push({ english: 'not', mine: get('lingolab-finishing-field-6'), note: placementText(get('lingolab-finishing-field-7')) });
  touches.push({ english: 'plural', mine: get('lingolab-finishing-field-8'), note: placementText(get('lingolab-finishing-field-9')) });
  two.append(tableCard({ title: 'Finishing touches', accent: 'gold', rows: touches }));

  /* Column three: pronouns, possessives */
// in renderGrammar():
const conj = get('lingolab-personal-conjugations') || 'yes';

// in renderTables():
const useConj = get('lingolab-personal-conjugations') !== 'no';  const pronouns = ['I', 'you', 'he', 'she', 'they', 'we'].map((english, i) => {
    const marker = get(`lingolab-personal-field-${i * 2}`);
    const place = get(`lingolab-personal-field-${i * 2 + 1}`);
    return {
      english,
      mine: get(`lingolab-personal-field-${12 + i}`),
      note: useConj && marker ? `verb marker: ${marker} (${placementText(place)})` : '',
    };
  });
  three.append(tableCard({ title: 'Pronouns', accent: 'coral', rows: pronouns }));
  three.append(tableCard({
    title: 'Possessive pronouns',
    accent: 'teal',
    rows: [{ english: 'my', mine: get('lingolab-finishing-field-10') }, { english: 'your', mine: get('lingolab-finishing-field-11') }],
  }));
}

renderGrammar();
renderTables();