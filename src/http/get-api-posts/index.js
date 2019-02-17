const arc = require('@architect/functions');
const withAuth = require('@architect/shared/middlewares/with-auth');
const {
  BLOGPOSTS_PER_PAGE,
  getPaginatedByKind,
  getBlogpostsCount,
  getLastStartKeyByOffsetForKind,
} = require('@architect/shared/data');

exports.handler = arc.middleware(withAuth, async (req) => {
  console.log();
  console.log(req);

  try {
    const currentPage = Number(req.query.page || '1');
    const offset = (currentPage - 1) * BLOGPOSTS_PER_PAGE;
    const startKey = await getLastStartKeyByOffsetForKind({
      kind: 'blogpost',
      offset,
    });
    const [{ items: posts = [], hasNextPage }, count] = await Promise.all([
      getPaginatedByKind({
        kind: 'blogpost',
        values: ['uid', 'content', 'title', 'slug', 'createdAt'],
        limit: BLOGPOSTS_PER_PAGE,
        startKey,
      }),
      getBlogpostsCount(),
    ]);
    const nextPage = hasNextPage ? currentPage + 1 : null;

    return {
      type: 'application/json',
      body: JSON.stringify({ posts, count, nextPage }),
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      type: 'application/json',
      body: JSON.stringify({ error: true }),
    };
  }
});
