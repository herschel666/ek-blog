const {
  SERVER_ERROR,
  NOT_FOUND_ERROR,
  TITLE_MISSING_ERROR,
  TITLE_TOO_SHORT_ERROR,
  TITLE_TOO_LONG_ERROR,
  ALREADY_EXISTS_ERROR,
} = require('@architect/shared/constants');

// DynamoDB takes a maximum of 400kb per attribute value.
// Assuming the char length averages to 2 bytes per char
// in common blogposts, this is the correct max length.
const CONTENT_MAX_LENGTH = (1024 * 400) / 2;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const CATEGORY_UID_PATTERN = /^c[a-zA-Z0-9-_]{9}$/;

exports.getBlogpostCheck = (v) =>
  v.compile({
    title: { type: 'string', min: 3, max: 255 },
    content: { type: 'string', min: 3, max: CONTENT_MAX_LENGTH },
    categories: {
      type: 'array',
      min: 1,
      items: { type: 'string', pattern: CATEGORY_UID_PATTERN },
    },
    createdAt: { type: 'string', pattern: DATE_PATTERN, optional: true },
  });

exports.getCategoryCheck = (withUid = false) => ({ title, uid }) => {
  if (withUid === true && (!uid.startsWith('c') || uid.length !== 10)) {
    throw new Error(NOT_FOUND_ERROR);
  }

  if (!title) {
    throw new Error(TITLE_MISSING_ERROR);
  }

  if (title.length < 3) {
    throw new Error(TITLE_TOO_SHORT_ERROR);
  }

  if (title.length > 255) {
    throw new Error(TITLE_TOO_LONG_ERROR);
  }

  return true;
};

exports.getMediaCheck = (v) => {
  v.add('base64', (value) => {
    try {
      if (Buffer.from(value, 'base64').toString('base64') === value) {
        return true;
      }
      throw new Error('no base64 value');
    } catch (err) {
      return v.makeError('base64Value');
    }
  });

  return v.compile({
    description: { type: 'string', min: 3, max: 255, optional: true },
    media: { type: 'base64' },
  });
};

exports.getMediaCheck.options = {
  messages: {
    base64Value: `The '{field}' field must be a base64 string.`,
  },
};

exports.getErrorType = (message) => {
  switch (message) {
    case NOT_FOUND_ERROR:
    case TITLE_MISSING_ERROR:
    case TITLE_TOO_SHORT_ERROR:
    case TITLE_TOO_LONG_ERROR:
    case ALREADY_EXISTS_ERROR:
      return message;
    default:
      return SERVER_ERROR;
  }
};

exports.getCategoryErrorMessage = (errorType) => {
  switch (errorType) {
    case SERVER_ERROR:
      return 'Something went wrong';
    case NOT_FOUND_ERROR:
      return 'There is not category given for the provided Uid.';
    case TITLE_MISSING_ERROR:
      return 'Please provide a value for the "title"-field.';
    case TITLE_TOO_SHORT_ERROR:
      return 'The category name has to be longer than 3 characters.';
    case TITLE_TOO_LONG_ERROR:
      return 'The category name must not be longer than 255 characters.';
    case ALREADY_EXISTS_ERROR:
      return 'There is already a category with the given title.';
  }
};
