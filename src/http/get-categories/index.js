const data = require('@architect/data');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');

const getBody = (categories) =>
  layout(
    'Kategorien :: ek|blog',
    html`
      <h1>Categories</h1>
      <ol>
        ${
          categories.reduce(
            (str, { slug, title }) => html`
              ${str}
              <li>
                <h2><a href="/categories/${slug}">${title}</a></h2>
              </li>
            `,
            ''
          )
        }
      </ol>
    `
  );

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const { Items: categories } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: 'slug, title',
    ExpressionAttributeValues: {
      ':kind': 'category',
    },
  });
  const body = getBody(categories);

  return {
    type: 'text/html; charset=utf8',
    body,
  };
};
