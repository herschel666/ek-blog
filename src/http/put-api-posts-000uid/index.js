const arc = require('@architect/functions');
const Validator = require('fastest-validator');
const sanitizeHtml = require('sanitize-html');
const withAuth = require('@architect/shared/middlewares/with-auth');
const {
  getBlogpostCheck,
  getErrorType,
} = require('@architect/shared/validate');
const { updateBlogpost } = require('@architect/shared/data');
const {
  SERVER_ERROR,
  NOT_FOUND_ERROR,
  VALIDATION_ERROR,
} = require('@architect/shared/constants');

const check = getBlogpostCheck(new Validator());

exports.handler = arc.middleware(withAuth, async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;
  const { title: dirtyTitle = '', content, categories: cats } = req.body;
  const title = sanitizeHtml(dirtyTitle);
  const categories = [].concat(cats).filter(Boolean);
  const result = check({
    title,
    content,
    categories,
  });

  if (Array.isArray(result)) {
    return {
      status: 400,
      type: 'application/json',
      body: JSON.stringify({
        type: VALIDATION_ERROR,
        body: { errors: result },
      }),
    };
  }

  try {
    // No need to hit the DB when invalid Uid given.
    if (!uid.startsWith('b') || uid.length !== 10) {
      throw new Error(NOT_FOUND_ERROR);
    }

    const post = await updateBlogpost({
      uid,
      title,
      content,
      categories,
    });

    return {
      status: 200,
      type: 'application/json',
      body: JSON.stringify({ type: 'success', body: { post } }),
    };
  } catch (err) {
    console.log(err);

    const type = getErrorType(err.message);
    const status = type === SERVER_ERROR ? 500 : 404;
    const message =
      status === 404
        ? 'There is no post related to the given Uid'
        : 'Something went wrong';
    const errors = [{ message }];

    return {
      type: 'application/json',
      body: JSON.stringify({ type, body: { errors } }),
      status,
    };
  }
});
