const arc = require('@architect/functions');
const sanitizeHtml = require('sanitize-html');
const { SERVER_ERROR } = require('@architect/shared/constants');
const {
  getCategoryCheck,
  getCategoryErrorMessage,
  getErrorType,
} = require('@architect/shared/validate');
const withAuth = require('@architect/shared/middlewares/with-auth');
const { updateCategory } = require('@architect/shared/data');

const check = getCategoryCheck(true);

exports.handler = arc.middleware(withAuth, async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;
  const { title: dirtyTitle = '' } = req.body;
  const title = sanitizeHtml(dirtyTitle);

  try {
    check({ title, uid });

    const category = await updateCategory({
      uid,
      title,
    });

    return {
      status: 200,
      type: 'application/json',
      body: JSON.stringify({
        type: 'success',
        body: { category },
      }),
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
      body: JSON.stringify({ type, body: { errors } }),
      status,
    };
  }
});
