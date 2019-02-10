const arc = require('@architect/functions');
const {
  MEDIA_PER_PAGE,
  getLastStartKeyByOffsetForKind,
  getPaginatedByKind,
} = require('@architect/shared/model');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const limitParam = parseInt(req.params.limit, 10);
    const pageParam = parseInt(req.params.page, 10);
    const limit = Number.isNaN(limitParam) ? MEDIA_PER_PAGE : limitParam;
    const currentPage = Number.isNaN(pageParam) ? 1 : pageParam;
    const offset = (currentPage - 1) * limitParam;
    const startKey = await getLastStartKeyByOffsetForKind({
      kind: 'media',
      offset,
    });
    const { items: media = [], hasNextPage } = await getPaginatedByKind({
      kind: 'media',
      values: ['uid', 'filename', 'description'],
      limit,
      startKey,
    });
    const nextPage = hasNextPage ? currentPage + 1 : null;

    return {
      type: 'application/json',
      body: JSON.stringify({
        media: media.map(({ uid, filename, description = '' }) => ({
          filePath: arc.http.helpers.static(`/media/${filename}`),
          description,
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
};
