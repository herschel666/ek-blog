import LazyLoad from 'vanilla-lazyload';

export const lazyLoad = (elements) =>
  new LazyLoad(
    {
      callback_enter: (el) => {
        const src = el.getAttribute('data-lazy-src');
        const alt = el.getAttribute('data-lazy-alt');
        const elem = Object.assign(document.createElement('img'), { src, alt });

        el.parentNode.replaceChild(elem, el);
      },
    },
    elements
  );
