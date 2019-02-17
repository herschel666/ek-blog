const arc = require('@architect/functions');
const Validator = require('fastest-validator');
const sanitizeHtml = require('sanitize-html');
const withAuth = require('@architect/shared/middlewares/with-auth');
const { getBlogpostCheck } = require('@architect/shared/validate');
const { createBlogpost } = require('@architect/shared/data');
const {
  SERVER_ERROR,
  VALIDATION_ERROR,
} = require('@architect/shared/constants');

const check = getBlogpostCheck(new Validator());

exports.handler = arc.middleware(withAuth, async (req) => {
  console.log();
  console.log(req);

  const { title: dirtyTitle = '', content, createdAt } = req.body;
  const title = sanitizeHtml(dirtyTitle);
  const categories = [].concat(req.body.categories).filter(Boolean);
  const result = check({
    title,
    content,
    categories,
    createdAt,
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
    await createBlogpost({
      title,
      content,
      categories,
      createdAt,
    });
  } catch (err) {
    console.log(err);

    const errors = [
      {
        messsage: 'Something went wrong.',
      },
    ];

    return {
      status: 500,
      type: 'application/json',
      body: JSON.stringify({ type: SERVER_ERROR, body: { errors } }),
    };
  }

  return {
    status: 200,
    type: 'application/json',
    body: JSON.stringify({ type: 'success' }),
  };
});
