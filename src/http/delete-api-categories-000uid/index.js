const data = require('@architect/data');

class NoUidError extends Error {}

const getCreatedAt = async (uid) => {
  const {
    Items: [{ createdAt } = {}],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: 'createdAt',
    FilterExpression: 'uid = :uid',
    ExpressionAttributeValues: {
      ':kind': 'category',
      ':uid': uid,
    },
  });
  return createdAt;
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    if (!req.params.uid) {
      throw NoUidError();
    }

    const createdAt = await getCreatedAt(req.params.uid);
    await data.blog.delete({
      kind: 'category',
      createdAt,
    });

    return {
      status: 202,
    };
  } catch (err) {
    console.log(err);

    const type = err instanceof NoUidError ? 'param_missing' : 'server_error';
    const error = true;

    return {
      status: 400,
      type: 'application/json',
      params: JSON.stringify({ error, type }),
    };
  }
};
