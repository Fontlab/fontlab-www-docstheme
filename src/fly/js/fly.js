// this_file: src/fly/js/fly.js
// fly-january: open large screenshots (a.lightbox, written by the image-sizes
// plugin with data-pswp-width/height) in PhotoSwipe, and latch the L2 sheet
// position on mid-desktop screens. Loaded as a module.
const CDN = "https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/";

// Loaded on demand and allowed to fail: without PhotoSwipe the a.lightbox links
// stay plain links to the full-size image, and the latch below still runs.
if (document.querySelector(".md-content a.lightbox")) {
  import(`${CDN}photoswipe-lightbox.esm.min.js`)
    .then(({ default: PhotoSwipeLightbox }) => {
      const lightbox = new PhotoSwipeLightbox({
        gallery: ".md-content",
        children: "a.lightbox",
        pswpModule: () => import(`${CDN}photoswipe.esm.min.js`),
        bgOpacity: 0.92,
        showHideAnimationType: matchMedia("(prefers-reduced-motion: reduce)").matches ? "none" : "zoom",
      });
      lightbox.on("uiRegister", () => {
        lightbox.pswp.ui.registerElement({
          name: "caption",
          order: 9,
          isButton: false,
          appendTo: "root",
          onInit: (el, pswp) => {
            pswp.on("change", () => {
              const link = pswp.currSlide.data.element;
              const caption = link?.closest("figure")?.querySelector("figcaption");
              el.textContent = caption?.textContent || link?.querySelector("img")?.alt || "";
            });
          },
        });
      });
      lightbox.init();
    })
    .catch((error) => console.warn("fly: PhotoSwipe unavailable, lightbox links open the image", error));
}

// L2 latch (CSS: mid-desktop sliver block). L2 rests extended; pointer, focus
// or a tap in L1 latches "in" (retracted), pointer, focus or a tap in L2/L3
// latches "out", anything else keeps the state. Hits on the L2 paper
// (.md-main__inner::before) report .md-main__inner.
const latch = ({ target: t }) => {
  if (!(t instanceof Element)) return;
  const root = document.documentElement.dataset;
  if (t.closest(".md-sidebar--primary")) root.flyL2 = "in";
  else if (t.closest(".md-sidebar--secondary, .md-content") || t.matches(".md-main__inner")) root.flyL2 = "out";
};
// Pages without L2 (hide: [toc]) have nothing to latch.
const hasL2 = !document.body.classList.contains("fly-no-l2");
if (hasL2) for (const type of ["pointerover", "focusin", "click"]) addEventListener(type, latch);
else delete document.documentElement.dataset.flyL2;

// Let the native fragment navigation update the URL, history and focus.
addEventListener("click", event => {
  if (event.defaultPrevented || !event.target.closest?.('.md-nav--secondary a[href^="#"]')) return;
  const root = document.documentElement;
  root.classList.add("fly-toc-scroll");
  requestAnimationFrame(() => root.classList.remove("fly-toc-scroll"));
});

// Browsers don't re-test :hover after a page load until the pointer moves, so a
// page opened from an L1 link would paint L2 extended under a still pointer.
// Remember that case; the inline <head> script in main.html restores "in".
// (Also from a page without L2: it is the next page that needs it.)
addEventListener("click", ({ target: t }) => {
  if (t.closest?.(".md-sidebar--primary a[href]")) try { sessionStorage.setItem("fly-l2", "in"); } catch {}
});

