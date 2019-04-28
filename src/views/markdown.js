const arc = require('@architect/functions');
const isAbsoluteUrl = require('is-absolute-url');

const RE_IMAGE_DIMENSIONS = /^\((\d+),\s?(\d+)\)$/;

const getImageRatio = (node = {}) => {
  if (node.type !== 'text' || typeof node.value !== 'string') {
    return [];
  }

  const [, width, height] = node.value.trim().match(RE_IMAGE_DIMENSIONS) || [];

  if (width && height) {
    return [Number(width), Number(height)];
  }

  return [];
};

const lazyLoadImage = (visit) => () => (tree) => {
  visit(tree, 'image', (node, index, parent) => {
    const { alt, url } = node;
    const src = isAbsoluteUrl(url) ? url : arc.http.helpers.static(url);
    const [width, height] = getImageRatio(parent.children[index + 1]);
    let styles = '';
    let styleAttr = '';

    if (width && height) {
      const paddingTop = ((height / width) * 100).toFixed(6);
      styleAttr = `max-width: ${width}px`;
      styles = `<style>
      [data-lazy-src="${src}"]::before {
        padding-top: ${paddingTop}%;
      }
      </style>`;
      parent.children.splice(index + 1, 1);
    }

    delete node.url;
    delete node.alt;

    node.type = 'html';
    node.value = `
      <div data-lazy-src="${src}" data-lazy-alt="${alt}" style="${styleAttr}">${styles}</div>
      <noscript>
        <img src="${src}" alt="${alt}">
      </noscript>
    `;
  });
};

module.exports = (remark, remarkHtml, visit) => (markdownContent) =>
  new Promise((resolve, reject) =>
    remark()
      .use(lazyLoadImage(visit))
      .use(remarkHtml)
      .process(markdownContent, (err, file) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(String(file));
      })
  );
