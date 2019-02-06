const data = require('@architect/data');

const ITEMS_PER_PAGE = 3;

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

const getLastEvaluatedKey = async (offset) => {
  if (offset === 0) {
    return null;
  }
  const { LastEvaluatedKey: lastEvaluatedKey } = await getBlogposts('uid', {
    ScanIndexForward: false,
    Limit: offset,
    ExclusiveStartKey: null,
  });
  return lastEvaluatedKey;
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const currentPage = Number(req.query.page || '1');
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastEvaluatedKey = await getLastEvaluatedKey(offset);
    const [
      { Items: posts = [], LastEvaluatedKey: hasNextPage },
      { Count: count },
    ] = await Promise.all([
      getBlogposts('uid, content, title, slug, createdAt', {
        ScanIndexForward: false,
        Limit: ITEMS_PER_PAGE,
        ExclusiveStartKey: lastEvaluatedKey,
      }),
      getBlogposts('uid', { Select: 'COUNT' }),
    ]);
    const nextPage = hasNextPage ? currentPage + 1 : null;

    return {
      type: 'application/json',
      body: JSON.stringify({ posts, count, nextPage }),
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
