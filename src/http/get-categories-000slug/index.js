const data = require('@architect/data');
const arc = require('@architect/functions');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const { iterate } = require('@architect/views/util');

const getBody = ({ categoryTitle, posts }) =>
  layout(
    `Kategorie "${categoryTitle}" :: ek|blog`,
    html`
      <h1>${categoryTitle}</h1>
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

const getCategoryTitle = async (slug) => {
  const {
    Items: [category],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'slug = :slug',
    ProjectionExpression: 'title',
    ExpressionAttributeValues: {
      ':kind': 'category',
      ':slug': slug,
    },
  });
  return category.title;
};

const getPosts = async (slug) => {
  const { Items: posts } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'contains(params, :slug)',
    ProjectionExpression: 'content, title, slug, createdAt, categories',
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
      ':slug': `cat:${slug}`,
    },
  });
  return posts;
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const [categoryTitle, posts] = await Promise.all([
    await getCategoryTitle(req.params.slug),
    await getPosts(req.params.slug),
  ]);
  const body = getBody({ categoryTitle, posts });

  return {
    type: 'text/html; charset=utf8',
    body,
  };
};
