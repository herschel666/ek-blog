const data = require('@architect/data');

const getCategories = async (uids = []) => {
  const result = await Promise.all(
    uids.map((uid) =>
      data.blog.query({
        KeyConditionExpression: 'kind = :kind',
        FilterExpression: 'uid = :uid',
        ProjectionExpression: 'uid, title',
        ExpressionAttributeValues: {
          ':kind': 'category',
          ':uid': uid,
        },
      })
    )
  );
  return result.map(({ Items: [{ uid, title }] }) => ({
    uid,
    title,
  }));
};

const getBlogpost = async (uid) => {
  const result = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'uid = :uid',
    ProjectionExpression: 'uid, content, title, slug, createdAt, categories',
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
      ':uid': uid,
    },
  });

  return result;
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const { Items: [post] = [] } = await getBlogpost(req.params.uid);
    const categories = await getCategories(post.categories);

    return {
      type: 'application/json',
      body: JSON.stringify(Object.assign(post, { categories })),
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
