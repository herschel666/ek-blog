const { TARGET_NOT_FOUND, updateCategory } = require('@architect/shared/data');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;
  const { title } = req.body;

  try {
    const result = await updateCategory({
      uid,
      title,
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
