const data = require('@architect/data');
const site = require('@architect/views/site');
const html = require('@architect/views/html');
const { getNiceDate } = require('@architect/shared/util');

const getBody = ({ title, content, createdAt, categories }) =>
  site(
    html`
      <h1>${title}</h1>
      <strong>
        Created at
        <time datetime="${createdAt}">${getNiceDate(createdAt)}</time> in
        categories:
        ${
          categories.reduce(
            (str, { slug, title }, index) => html`
              ${str} ${index === 0 ? '' : ', '}
              <a href="/categories/${slug}"> ${title} </a>
            `,
            ''
          )
        }
      </strong>
      <p>${content}</p>
    `
  );

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const {
    Items: [blogpost],
  } = await data.ddb_data.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'contains(slug, :slug)',
    ProjectionExpression: 'title, content, createdAt, categories',
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
      ':slug': req.params.blogpost,
    },
  });
  const body = getBody(blogpost);

  return {
    type: 'text/html; charset=utf8',
    body,
  };
};
