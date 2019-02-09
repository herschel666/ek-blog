const marked = require('marked');
const arc = require('@architect/functions');
const {
  ITEMS_PER_PAGE,
  getBlogposts,
  getBlogpostsCount,
  getLastBlogpostStartKeyByOffset,
} = require('@architect/shared/model');
const { getNiceDate } = require('@architect/shared/util');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const { iterate } = require('@architect/views/util');

const getBody = ({ posts, hasPosts, prevPage, nextPage }) =>
  layout(
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
              <h1>Es gibt noch keine Beiträge.</h1>
            `
      }
    `
  );

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const currentPage = Number(req.query.page || '1');
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const startKey = await getLastBlogpostStartKeyByOffset(offset);
  const [{ posts = [], hasNextPage }, blogpostCount] = await Promise.all([
    getBlogposts({
      values: ['content', 'title', 'slug', 'createdAt'],
      startKey,
    }),
    getBlogpostsCount(),
  ]);
  const prevPage = offset === 0 ? null : currentPage - 1;
  const nextPage =
    hasNextPage && offset + ITEMS_PER_PAGE < blogpostCount
      ? currentPage + 1
      : null;
  const hasPosts = posts.length && offset <= blogpostCount;
  const status = hasPosts || typeof req.query.page === 'undefined' ? 200 : 404;
  const body = getBody({
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
