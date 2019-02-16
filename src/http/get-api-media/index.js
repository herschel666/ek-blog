const arc = require('@architect/functions');
const withAuth = require('@architect/shared/with-auth');
const {
  MEDIA_PER_PAGE,
  getLastStartKeyByOffsetForKind,
  getPaginatedByKind,
} = require('@architect/shared/data');

exports.handler = withAuth(async (req) => {
  console.log();
  console.log(req);

  try {
    const limitParam = parseInt(req.query.limit, 10);
    const pageParam = parseInt(req.query.page, 10);
    const limit = Number.isNaN(limitParam) ? MEDIA_PER_PAGE : limitParam;
    const currentPage = Number.isNaN(pageParam) ? 1 : pageParam;
    const offset = (currentPage - 1) * limit;
    const startKey = await getLastStartKeyByOffsetForKind({
      kind: 'media',
      offset,
    });
    const { items: media = [], hasNextPage } = await getPaginatedByKind({
      kind: 'media',
      values: ['uid', 'filehash', 'ext', 'description'],
      limit,
      startKey,
    });
    const nextPage = hasNextPage ? currentPage + 1 : null;

    return {
      type: 'application/json',
      body: JSON.stringify({
        media: media.map(({ uid, filehash, ext, description = '' }) => ({
          root: arc.http.helpers.static('/_static/media/'),
          description,
          filehash,
          ext,
          uid,
        })),
        nextPage,
      }),
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
