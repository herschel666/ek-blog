const marked = require('marked');
const arc = require('@architect/functions');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const { getBlogpostBySlug } = require('@architect/shared/model');
const { getNiceDate } = require('@architect/shared/util');
const { iterate } = require('@architect/views/util');
const get404 = require('@architect/views/partials/get-404');

const getBody = ({ title, content, createdAt, categories }) =>
  layout(
    `"${title}"`,
    html`
      <h1>${title}</h1>
      <strong>
        Created at
        <time datetime="${createdAt}">${getNiceDate(createdAt)}</time> in
        categories:
        ${
          iterate(
            categories,
            ({ slug, title }, index) => html`
              ${index === 0 ? '' : ', '}
              <a href="${arc.http.helpers.url(`/categories/${slug}`)}">
                ${title}
              </a>
            `
          )
        }
      </strong>
      ${marked(content)}
    `
  );

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const blogpost = await getBlogpostBySlug({
    slug: req.params.slug,
    values: ['title', 'content', 'createdAt', 'categories'],
  });
  const body = blogpost ? getBody(blogpost) : get404();
  const status = blogpost ? 200 : 404;

  return {
    type: 'text/html; charset=utf8',
    status,
    body,
  };
};
