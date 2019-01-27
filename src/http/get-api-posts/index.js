const data = require('@architect/data');

const getBlogposts = async (projectionExpression, options) => {
  const result = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: projectionExpression,
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
    },
    ...options,
  });

  return result;
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const [{ Items: posts = [] }, { Count: count }] = await Promise.all([
      getBlogposts('uid, content, title, slug, createdAt', {
        ScanIndexForward: false,
      }),
      getBlogposts('uid', { Select: 'COUNT' }),
    ]);

    return {
      type: 'application/json',
      body: JSON.stringify({ posts, count }),
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
