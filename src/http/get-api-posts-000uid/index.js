const withAuth = require('@architect/shared/with-auth');
const { getBlogpostByUid } = require('@architect/shared/data');

exports.handler = withAuth(async (req) => {
  console.log();
  console.log(req);

  try {
    const post = await getBlogpostByUid({
      values: ['uid', 'title', 'content', 'categories'],
      uid: req.params.uid,
    });
    const status = post ? 200 : 404;

    return {
      type: 'application/json',
      body: JSON.stringify(post),
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
