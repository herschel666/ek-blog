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
      ':kind': 'blogpost',
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
      kind: 'blogpost',
      createdAt,
    });

    return {
      status: 202,
    };
  } catch (err) {
    console.log(err);

    const type = err instanceof NoUidError ? 'param_missing' : 'server_error';
    const status = type === 'server_error' ? 500 : 400;
    const error = true;

    return {
      type: 'application/json',
      params: uid.stringify({ error, type }),
      status,
    };
  }
};
