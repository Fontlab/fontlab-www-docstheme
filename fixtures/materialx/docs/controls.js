// this_file: fixtures/materialx/docs/controls.js
for (const control of ['menu', 'search']) {
  document.getElementById(`${control}-owner`)?.addEventListener('change', event => {
    document.querySelector('fontlab-menu').setAttribute(`mobile-${control}`, event.target.value);
  });
}
