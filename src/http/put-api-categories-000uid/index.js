const arc = require('@architect/functions');
const {
  SERVER_ERROR,
  NOT_FOUND_ERROR,
} = require('@architect/shared/constants');
const {
  getCategoryCheck,
  getCategoryErrorMessage,
  getErrorType,
} = require('@architect/shared/validate');
const withAuth = require('@architect/shared/middlewares/with-auth');
const { TARGET_NOT_FOUND, updateCategory } = require('@architect/shared/data');

const check = getCategoryCheck(true);

exports.handler = arc.middleware(withAuth, async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;
  const { title } = req.body;

  try {
    check({ title, uid });

    const result = await updateCategory({
      uid,
      title,
    });

    if (result === TARGET_NOT_FOUND) {
      throw new Error(NOT_FOUND_ERROR);
    }

    return {
      status: 200,
      type: 'application/json',
      body: JSON.stringify({
        type: 'success',
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
