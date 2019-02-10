const arc = require('@architect/functions');
const {
  getCategoryBySlug,
  getBlogpostsByParam,
} = require('@architect/shared/data');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const { iterate } = require('@architect/views/util');
const get404 = require('@architect/views/partials/get-404');

const getBody = ({ category, posts }) =>
  layout(
    `Kategorie "${category.title}"`,
    html`
      <h1>${category.title}</h1>
      <ol>
        ${
          iterate(
            posts,
            ({ title, slug }) => html`
              <h2>
                <a href="${arc.http.helpers.url(`/posts/${slug}`)}">
                  ${title}
                </a>
              </h2>
            `
          )
        }
      </ol>
    `
  );

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const [category, posts] = await Promise.all([
    await getCategoryBySlug({
      slug: req.params.slug,
      values: ['title'],
    }),
    await getBlogpostsByParam({
      param: `cat:${req.params.slug}`,
      values: ['content', 'title', 'slug', 'createdAt', 'categories'],
    }),
  ]);
  const body = category ? getBody({ category, posts }) : get404();
  const status = category ? 200 : 404;

  return {
    type: 'text/html; charset=utf8',
    status,
    body,
  };
};
