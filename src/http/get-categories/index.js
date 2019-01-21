const data = require('@architect/data');
const site = require('@architect/views/site');
const html = require('@architect/views/html');

const getBody = (categories) =>
  site(
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

  const { Items: categories } = await data.ddb_data.query({
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
