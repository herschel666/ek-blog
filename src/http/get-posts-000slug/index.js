const remark = require('remark');
const remarkHtml = require('remark-html');
const visit = require('unist-util-visit');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const getMarkdownRenderer = require('@architect/views/markdown');
const { getBlogpostBySlug } = require('@architect/shared/data');
const { getNiceDate } = require('@architect/shared/util');
const { iterate } = require('@architect/views/util');
const get404 = require('@architect/views/partials/get-404');

const markdown = getMarkdownRenderer(remark, remarkHtml, visit);

const getBody = async ({ title, content, createdAt, categories }) =>
  layout(
    `"${title}"`,
    html`
      <h1>${title}</h1>
      <strong>
        Created at
        <time datetime="${createdAt}">${getNiceDate(createdAt)}</time> in
        categories:
        ${iterate(
          categories,
          ({ slug, title }, index) => html`
            ${index === 0 ? '' : ', '}
            <a href="/categories/${slug}">
              ${title}
            </a>
          `
        )}
      </strong>
      ${await markdown(content)}
    `
  );

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const blogpost = await getBlogpostBySlug({
    slug: req.params.slug,
    values: ['title', 'content', 'createdAt', 'categories'],
  });
  const body = blogpost ? await getBody(blogpost) : get404();
  const status = blogpost ? 200 : 404;

  return {
    type: 'text/html; charset=utf8',
    status,
    body,
  };
};
