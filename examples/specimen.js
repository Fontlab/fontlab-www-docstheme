// this_file: examples/specimen.js
document.getElementById('mode').addEventListener('click', event => {
  const dark = document.body.dataset.theme !== 'dark';
  document.body.dataset.theme = dark ? 'dark' : 'light';
  event.currentTarget.setAttribute('aria-pressed', String(dark));
  event.currentTarget.querySelector('span').textContent = dark ? 'Light mode' : 'Dark mode';
});
document.getElementById('project')?.addEventListener('submit', event => {
  event.preventDefault();
  const name = new FormData(event.currentTarget).get('name').trim();
  document.getElementById('saved').textContent = name ? `Saved “${name}” for this session.` : 'Enter a project name.';
});
