// this_file: src/register.js
// Use Basecoat's public registration API to isolate component discovery.
(() => {
  const register = window.basecoat.register;
  window.basecoat.register = (name, selectorOrOptions, init) => {
    const options = typeof selectorOrOptions === 'object'
      ? selectorOrOptions : { selector: selectorOrOptions, init };
    register(name, { ...options, selector: `.fltheme-components :is(${options.selector})` });
  };
})();
