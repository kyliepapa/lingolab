const examples = {
  SVO: ['I eat rice.', 'SVO places the subject first, followed by the verb and object.'],
  SOV: ['I rice eat.', 'SOV places the object before the verb.'],
  VSO: ['Eat I rice.', 'VSO leads with the action.'],
  VOS: ['Eat rice I.', 'VOS leads with the action, then names the object and subject.'],
  OVS: ['Rice eat I.', 'OVS starts with the object, followed by the verb and subject.'],
  OSV: ['Rice I eat.', 'OSV starts with the object, then identifies who acts.'],
};

const preview = document.querySelector('#sentence-preview');
const note = document.querySelector('#preview-note');
const badge = document.querySelector('#selected-order');
const orderSelect = document.querySelector('#sentence-order-select');

orderSelect.addEventListener('change', () => {
  const order = orderSelect.value;
  badge.textContent = order;
  preview.textContent = examples[order][0];
  note.textContent = examples[order][1];
  localStorage.setItem('lingolab-sentence-order', order);
});

document.querySelector('#save-order').addEventListener('click', (event) => {
  event.currentTarget.innerHTML = 'Saved ✓';
});
