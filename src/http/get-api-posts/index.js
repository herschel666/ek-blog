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
    const values = [
      'uid',
      'slug',
      'createdAt',
      'updatedAt',
      'content',
      'title',
      'categories',
    ];
    const [{ items: posts = [], hasNextPage }, count] = await Promise.all([
      getPaginatedByKind({
        kind: 'blogpost',
        limit: BLOGPOSTS_PER_PAGE,
        values,
        startKey,
      }),
      getBlogpostsCount(),
    ]);
    const nextPage = hasNextPage ? currentPage + 1 : null;
    const itemsPerPage = BLOGPOSTS_PER_PAGE;

    return {
      type: 'application/json',
      body: JSON.stringify({ posts, count, nextPage, itemsPerPage }),
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
