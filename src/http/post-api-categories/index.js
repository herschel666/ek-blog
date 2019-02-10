const {
  CATEGORY_ALREADY_EXISTS,
  createCategory,
} = require('@architect/shared/model');

const SERVER_ERROR = 'server_error';
const TITLE_MISSING = 'title_missing';
const ALREADY_EXISTS = 'already_exists';

const getErrorType = (err) => {
  switch (err.message) {
    case TITLE_MISSING:
    case ALREADY_EXISTS:
      return err.message;
    default:
      return SERVER_ERROR;
  }
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const { title } = req.body;

  try {
    if (!title) {
      throw new Error(TITLE_MISSING);
    }

    const result = await createCategory({ title });

    if (result === CATEGORY_ALREADY_EXISTS) {
      throw new Error(ALREADY_EXISTS);
    }
  } catch (err) {
    console.log(err);

    const error = true;
    const type = getErrorType(err);
    const status = type === SERVER_ERROR ? 500 : 400;

    return {
      type: 'application/json',
      body: JSON.stringify({ error, type }),
      status,
    };
  }

  return {
    status: 202,
  };
};
