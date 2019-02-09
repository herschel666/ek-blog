const arc = require('@architect/functions');
const {
  getCategoryBySlug,
  getBlogpostsByParam,
} = require('@architect/shared/model');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const { iterate } = require('@architect/views/util');

const getBody = ({ category, posts }) =>
  layout(
    `Kategorie "${category.title}" :: ek|blog`,
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
  const body = getBody({ category, posts });

  return {
    type: 'text/html; charset=utf8',
    body,
  };
};
