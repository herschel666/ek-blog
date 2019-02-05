const marked = require('marked');
const data = require('@architect/data');
const arc = require('@architect/functions');
const { getNiceDate } = require('@architect/shared/util');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const { iterate } = require('@architect/views/util');

const ITEMS_PER_PAGE = 3;

const getBody = ({ raw, posts, hasPosts, prevPage, nextPage }) =>
  layout(
    'ek|blog',
    html`
      <p><a href="${arc.http.helpers.url('/categories')}">All categories</a></p>
      <hr />
      ${
        hasPosts
          ? html`
              <h1>Posts</h1>
              ${
                iterate(
                  posts,
                  ({ content, title, slug, createdAt }) =>
                    html`
                      <div>
                        <h2>
                          <a href="${arc.http.helpers.url(`/posts/${slug}`)}">
                            ${title}
                          </a>
                        </h2>
                        <strong>
                          Created at
                          <time datetime="${createdAt}">
                            ${getNiceDate(createdAt)}
                          </time>
                        </strong>
                        ${marked(content)}
                      </div>
                    `
                )
              }
              <div>
                ${
                  prevPage
                    ? html`
                        <a href="${arc.http.helpers.url(`/?page=${prevPage}`)}">
                          Prev page
                        </a>
                      `
                    : ''
                }
                ${
                  nextPage
                    ? html`
                        <a href="${arc.http.helpers.url(`/?page=${nextPage}`)}">
                          Next page
                        </a>
                      `
                    : ''
                }
              </div>
            `
          : html`
              <h1>There are no posts.</h1>
            `
      }
      ${
        process.env.NODE_ENV === 'testing'
          ? html`
              <hr />
              <details>
                <summary>Data</summary>
                <pre>${JSON.stringify(raw, null, 2)}</pre>
              </details>
            `
          : ''
      }
    `
  );

const getByKind = async (
  kind,
  projectionExpression,
  limit = null,
  exclusiveStartKey = null
) => {
  try {
    const result = await data.blog.query({
      KeyConditionExpression: 'kind = :kind',
      ProjectionExpression: projectionExpression,
      ExpressionAttributeValues: {
        ':kind': kind,
      },
      ScanIndexForward: false,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    });

    return result;
  } catch (err) {
    console.log('\nget-index::', kind, err);
    return [];
  }
};

const getLastEvaluatedKey = async (offset) => {
  if (offset === 0) {
    return null;
  }
  const { LastEvaluatedKey: lastEvaluatedKey } = await getByKind(
    'blogpost',
    'uid',
    offset
  );
  return lastEvaluatedKey;
};

const getBlogpostCount = async () => {
  const { Count: count } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: 'uid',
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
    },
    Select: 'COUNT',
  });
  return count;
};

const getData = async (lastEvaluatedKey) =>
  Promise.all([
    data.blog.scan({}),
    getByKind(
      'blogpost',
      'content, title, slug, createdAt',
      ITEMS_PER_PAGE,
      lastEvaluatedKey
    ),
    getBlogpostCount(),
  ]);

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const currentPage = Number(req.query.page || '1');
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const lastEvaluatedKey = await getLastEvaluatedKey(offset);
  const [
    raw,
    { Items: posts = [], LastEvaluatedKey: hasNextPage },
    blogpostCount,
  ] = await getData(lastEvaluatedKey);
  const prevPage = offset === 0 ? null : currentPage - 1;
  const nextPage = hasNextPage ? currentPage + 1 : null;
  const hasPosts = posts.length && offset <= blogpostCount;
  const status = hasPosts || typeof req.query.page === 'undefined' ? 200 : 404;
  const body = getBody({
    raw,
    posts,
    hasPosts,
    prevPage,
    nextPage,
  });

  return {
    type: 'text/html; charset=utf8',
    status,
    body,
  };
};
