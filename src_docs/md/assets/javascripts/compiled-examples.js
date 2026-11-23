// this_file: src_docs/md/assets/javascripts/compiled-examples.js
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-copy-target]');
  if (!button) return;
  const source = document.getElementById(button.dataset.copyTarget);
  const status = button.closest('.fl-example').querySelector('[role="status"]');
  try {
    await navigator.clipboard.writeText(source.textContent);
    status.textContent = 'Copied. Paste into a page with the documented styles and scripts.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(source);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    source.closest('pre').focus();
    status.textContent = 'Clipboard unavailable. The code is selected; use your system Copy command.';
  }
});
