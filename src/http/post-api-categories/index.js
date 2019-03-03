const arc = require('@architect/functions');
const sanitizeHtml = require('sanitize-html');
const withAuth = require('@architect/shared/middlewares/with-auth');
const { createCategory } = require('@architect/shared/data');
const { SERVER_ERROR } = require('@architect/shared/constants');
const {
  getCategoryCheck,
  getCategoryErrorMessage,
  getErrorType,
} = require('@architect/shared/validate');

const check = getCategoryCheck();

exports.handler = arc.middleware(withAuth, async (req) => {
  console.log();
  console.log(req);

  const { title: dirtyTitle = '' } = req.body;
  const title = sanitizeHtml(dirtyTitle);

  try {
    check({ title });

    const category = await createCategory({ title });

    return {
      status: 200,
      type: 'application/json',
      body: JSON.stringify({ type: 'success', body: { category } }),
    };
  } catch (err) {
    console.log(err);

    const type = getErrorType(err.message);
    const status = type === SERVER_ERROR ? 500 : 400;
    const errors = [
      {
        field: 'title',
        message: getCategoryErrorMessage(type),
      },
    ];

    return {
      type: 'application/json',
      body: JSON.stringify({ body: { errors }, type }),
      status,
    };
  }
});
