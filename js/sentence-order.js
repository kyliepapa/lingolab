const examples = {
  SVO: ['The turtle eats the carrot.', 'SVO is the most common order in English.'],
  SOV: ['The turtle the carrot eats.', 'SOV places the object before the verb.'],
  VSO: ['Eats the turtle the carrot.', 'VSO leads with the action.'],
  VOS: ['Eats the carrot the turtle.', 'VOS leads with the action, then names what receives it.'],
  OVS: ['The carrot eats the turtle.', 'OVS starts with the object, creating a surprising emphasis.'],
  OSV: ['The carrot the turtle eats.', 'OSV starts with the object, then identifies who acts.'],
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
