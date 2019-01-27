const data = require('@architect/data');
const arc = require('@architect/functions');
const { static } = arc.http.helpers;

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const { Items: media } = await data.blog.query({
      KeyConditionExpression: 'kind = :kind',
      ProjectionExpression: 'uid, ext',
      ExpressionAttributeValues: {
        ':kind': 'media',
      },
    });

    return {
      type: 'application/json',
      body: JSON.stringify(
        media.map(({ uid, ext }) => ({
          filename: static(`media/${uid}.${ext}`),
          uid,
        }))
      ),
    };
  } catch (err) {
    console.log(err);

    return {
      statud: 500,
      type: 'application/json',
      body: JSON.stringify({ error: true }),
    };
  }
};
