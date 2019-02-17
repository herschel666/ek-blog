const arc = require('@architect/functions');
const html = require('./html');

// TODO: consider using second argument for an image caption.
const renderImage = (href, _, text) => html`
  <figure>
    <img src="${arc.http.helpers.static(href)}" alt="${text}" />
  </figure>
`;

exports.extendMarkdownRenderer = (renderer) => {
  renderer.image = renderImage;
  return renderer;
};

exports.getMarkedOptions = (additional = {}) =>
  Object.assign(
    {
      sanitize: true,
    },
    additional
  );
