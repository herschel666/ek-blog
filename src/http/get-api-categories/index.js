const { getCategories } = require('@architect/shared/data');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const categories = await getCategories({
      values: ['uid', 'title'],
    });

    return {
      type: 'application/json',
      body: JSON.stringify(categories),
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      type: 'application/json',
      body: JSON.stringify({ error: true }),
    };
  }
};
