const { createBlogpost } = require('@architect/shared/data');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const { title, content, createdAt } = req.body;
  const categories = [].concat(req.body.categories).filter(Boolean);

  try {
    await createBlogpost({
      title,
      content,
      categories,
      createdAt,
    });
  } catch (err) {
    console.log(err);

    const error = true;

    return {
      status: 400,
      type: 'application/json',
      body: JSON.stringify({ error }),
    };
  }

  return {
    status: 202,
  };
};
