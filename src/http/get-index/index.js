const data = require('@architect/data');
const { getNiceDate } = require('@architect/shared/util');
const site = require('@architect/views/site');
const html = require('@architect/views/html');

const ITEMS_PER_PAGE = 3;

const getBody = ({
  raw,
  categories,
  blogposts,
  hasPosts,
  prevPage,
  nextPage,
}) =>
  site(html`
    <form method="post" action="/create/author">
      <fieldset>
        <legend>Add category</legend>
        <input type="text" name="title" placeholder="Category name" /><br />
      </fieldset>
      <button>Submit</button>
    </form>
    <p><a href="/categories">All categories</a></p>
    <hr />
    <form method="post" action="/create/blogpost">
      <fieldset>
        <legend>Add post</legend>
        <select name="categories" multiple>
          <option>Select category&hellip;</option>
          ${
            categories.reduce(
              (str, { slug, title }) => html`
                ${str} <option value="${slug}">${title}</option>
              `,
              ''
            )
          } </select
        ><br />
        <input type="text" name="title" placeholder="Title" /><br />
        <textarea
          name="content"
          placeholder="Content"
          rows="4"
          cols="40"
        ></textarea>
      </fieldset>
      <button>Submit</button>
    </form>
    <hr />
    ${
      hasPosts
        ? html`
            <h1>Posts</h1>
            ${
              blogposts.reduce(
                (str, { content, title, slug, createdAt, categories }) =>
                  html`
                    ${str}
                    <div>
                      <h2><a href="/blogposts/${slug}">${title}</a></h2>
                      <strong
                        >Created at
                        <time datetime="${createdAt}"
                          >${getNiceDate(createdAt)}</time
                        >
                        in categories:
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
                    </div>
                  `,
                ''
              )
            }
            <div>
              ${
                prevPage
                  ? html`
                      <a href="/?page=${prevPage}">Prev page</a>
                    `
                  : ''
              }
              ${
                nextPage
                  ? html`
                      <a href="/?page=${nextPage}">Next page</a>
                    `
                  : ''
              }
            </div>
          `
        : html`
            <h1>There are no posts.</h1>
          `
    }
    <hr />
    <details>
      <summary>Data</summary>
      <pre>
        ${JSON.stringify(raw, null, 2)}
      </pre
      >
    </details>
  `);

const getByKind = async (
  kind,
  projectionExpression,
  limit = null,
  exclusiveStartKey = null
) => {
  try {
    const result = await data.ddb_data.query({
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
  const { Count: count } = await await data.ddb_data.query({
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
    data.ddb_data.scan({}),
    getByKind('category', 'slug, title'),
    getByKind(
      'blogpost',
      'content, title, slug, createdAt, categories',
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
    { Items: categories = [] },
    { Items: blogposts = [], LastEvaluatedKey: hasNextPage },
    blogpostCount,
  ] = await getData(lastEvaluatedKey);
  const prevPage = offset === 0 ? null : currentPage - 1;
  const nextPage = hasNextPage ? currentPage + 1 : null;
  const hasPosts = blogposts.length && offset <= blogpostCount;
  const status = hasPosts || typeof req.query.page === 'undefined' ? 200 : 404;
  const body = getBody({
    raw,
    categories,
    blogposts,
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
