const data = require('@architect/data');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const { Items: categories } = await data.blog.query({
      KeyConditionExpression: 'kind = :kind',
      ProjectionExpression: 'uid, title',
      ExpressionAttributeValues: {
        ':kind': 'category',
      },
    });

    return {
      type: 'application/json',
      body: JSON.stringify(categories),
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
