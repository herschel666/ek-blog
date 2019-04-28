const lazyLoadElements = document.querySelectorAll('div[data-lazy-src]');

if (lazyLoadElements.length) {
  import(
    './scripts/lazy-load-elements' /* webpackChunkName: "lazy-load-elements" */
  ).then(({ lazyLoad }) => lazyLoad(lazyLoadElements));
}
