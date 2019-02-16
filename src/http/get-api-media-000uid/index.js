const withAuth = require('@architect/shared/with-auth');
const { getMediaByUid } = require('@architect/shared/data');

exports.handler = withAuth(async (req) => {
  console.log();
  console.log(req);

  try {
    const media = await getMediaByUid({
      values: ['uid', 'filehash', 'ext', 'description'],
      uid: req.params.uid,
    });
    const status = media ? 200 : 404;

    return {
      type: 'application/json',
      body: JSON.stringify(media),
      status,
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
