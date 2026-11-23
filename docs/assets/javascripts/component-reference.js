// this_file: src_docs/md/assets/javascripts/component-reference.js
// Delegated listeners also cover MaterialX instant navigation without duplicates.
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-open-reference-dialog]');
  if (trigger) document.getElementById(trigger.dataset.openReferenceDialog).showModal();
});
document.addEventListener('submit', event => {
  const form = event.target.closest('[data-reference-form]');
  if (!form) return;
  event.preventDefault();
  const name = new FormData(form).get('family').trim();
  form.querySelector('[data-reference-result]').textContent = `Saved “${name}” in this example. No data was sent.`;
});
document.addEventListener('reset', event => {
  const form = event.target.closest('[data-reference-form]');
  if (form) form.querySelector('[data-reference-result]').textContent = 'Changes stay in this demonstration.';
});
