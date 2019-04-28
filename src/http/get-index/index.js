const remark = require('remark');
const remarkHtml = require('remark-html');
const visit = require('unist-util-visit');
const {
  BLOGPOSTS_PER_PAGE,
  getPaginatedByKind,
  getBlogpostsCount,
  getLastStartKeyByOffsetForKind,
} = require('@architect/shared/data');
const { getNiceDate } = require('@architect/shared/util');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const getMarkdownRenderer = require('@architect/views/markdown');
const { iterate } = require('@architect/views/util');

const markdown = getMarkdownRenderer(remark, remarkHtml, visit);

const printDbDump = async () => {
  if (process.env.NODE_ENV !== 'testing') {
    return '';
  }

  const data = require('@architect/data');
  const raw = await data.blog.scan({});
  const dump = JSON.stringify(raw, null, 2);

  return html`
    <hr />
    <details>
      <summary>DDB Dump</summary>
      <pre>
          <code>
${dump}
          </code>
        </pre>
    </details>
  `;
};

const getBody = async ({ posts, hasPosts, prevPage, nextPage }) =>
  layout(
    html`
      <p><a href="/categories">All categories</a></p>
      <hr />
      ${hasPosts
        ? html`
            <h1>Posts</h1>
            ${iterate(
              posts,
              ({ content, title, slug, createdAt }) =>
                html`
                  <div>
                    <h2>
                      <a href="/posts/${slug}">
                        ${title}
                      </a>
                    </h2>
                    <strong>
                      Created at
                      <time datetime="${createdAt}">
                        ${getNiceDate(createdAt)}
                      </time>
                    </strong>
                    ${content}
                  </div>
                `
            )}
            <div>
              ${prevPage
                ? html`
                    <a href="/?page=${prevPage}">
                      Prev page
                    </a>
                  `
                : ''}
              ${nextPage
                ? html`
                    <a href="/?page=${nextPage}">
                      Next page
                    </a>
                  `
                : ''}
            </div>
          `
        : html`
            <h1>Es gibt noch keine Beiträge.</h1>
          `}
      ${await printDbDump()}
    `
  );

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const currentPage = Number(req.query.page || '1');
  const offset = (currentPage - 1) * BLOGPOSTS_PER_PAGE;
  const startKey = await getLastStartKeyByOffsetForKind({
    kind: 'blogpost',
    offset,
  });
  const [
    { items: rawPosts = [], hasNextPage },
    blogpostCount,
  ] = await Promise.all([
    getPaginatedByKind({
      kind: 'blogpost',
      values: ['content', 'title', 'slug', 'createdAt'],
      limit: BLOGPOSTS_PER_PAGE,
      startKey,
    }),
    getBlogpostsCount(),
  ]);
  const posts = await Promise.all(
    rawPosts.map(async (post) =>
      Object.assign(post, {
        content: await markdown(post.content),
      })
    )
  );
  const prevPage = offset === 0 ? null : currentPage - 1;
  const nextPage =
    hasNextPage && offset + BLOGPOSTS_PER_PAGE < blogpostCount
      ? currentPage + 1
      : null;
  const hasPosts = posts.length && offset <= blogpostCount;
  const status = hasPosts || typeof req.query.page === 'undefined' ? 200 : 404;
  const body = await getBody({
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
