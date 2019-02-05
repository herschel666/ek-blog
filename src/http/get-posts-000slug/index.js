const marked = require('marked');
const data = require('@architect/data');
const arc = require('@architect/functions');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const { iterate } = require('@architect/views/util');
const { getNiceDate } = require('@architect/shared/util');

const getBody = ({ title, content, createdAt }, categories) =>
  layout(
    `"${title}" :: ek|blog`,
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

  const {
    Items: [blogpost],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'slug = :slug',
    ProjectionExpression: 'title, content, createdAt, categories',
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
      ':slug': req.params.slug,
    },
  });
  const categoriesFilterExpression = blogpost.categories
    .map((_, index) => `uid = :uid${index}`)
    .join(' OR ');
  const categoriesExpresionAttributeValues = blogpost.categories.reduce(
    (values, uid, index) =>
      Object.assign(values, {
        [`:uid${index}`]: uid,
      }),
    {
      ':kind': 'category',
    }
  );
  const { Items: categories } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: categoriesFilterExpression,
    ProjectionExpression: 'title, slug',
    ExpressionAttributeValues: categoriesExpresionAttributeValues,
  });
  const body = getBody(blogpost, categories);

  return {
    type: 'text/html; charset=utf8',
    body,
  };
};
