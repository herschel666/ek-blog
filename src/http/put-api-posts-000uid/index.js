const { TARGET_NOT_FOUND, updateBlogpost } = require('@architect/shared/model');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;
  const { title, content, categories: cats } = req.body;
  const categories = [].concat(cats).filter(Boolean);

  try {
    const result = await updateBlogpost({
      uid,
      title,
      content,
      categories,
    });

    if (result === TARGET_NOT_FOUND) {
      throw new Error('not found');
    }

    return {
      status: 202,
      type: 'application/json',
    };
  } catch (err) {
    console.log(err);

    const status = err.message === 'not found' ? 404 : 500;

    return {
      type: 'application/json',
      body: JSON.stringify({ error: true }),
      status,
    };
  }
};
