const arc = require('@architect/functions');
const withAuth = require('@architect/shared/middlewares/with-auth');
const { getMediaByUid } = require('@architect/shared/data');

exports.handler = arc.middleware(withAuth, async (req) => {
  console.log();
  console.log(req);

  try {
    const media = await getMediaByUid({
      values: ['uid', 'createdAt', 'filehash', 'ext', 'description'],
      uid: req.params.uid,
    });
    const status = media ? 200 : 404;

    return {
      type: 'application/json',
      body: JSON.stringify({ media }),
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
