const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const data = require('@architect/data');

class NoUidError extends Error {}

const getMeta = async (uid) => {
  const {
    Items: [{ filename, createdAt } = {}],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: 'filename, createdAt',
    FilterExpression: 'uid = :uid',
    ExpressionAttributeValues: {
      ':kind': 'media',
      ':uid': uid,
    },
  });
  return { filename, createdAt };
};

const unlink = promisify(fs.unlink);

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    if (!req.params.uid) {
      throw NoUidError();
    }

    const { filename, createdAt } = await getMeta(req.params.uid);
    await Promise.all([
      data.blog.delete({
        kind: 'media',
        createdAt,
      }),
      unlink(
        path.resolve(__dirname, '..', '..', '..', 'public', 'media', filename)
      ),
    ]);

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
