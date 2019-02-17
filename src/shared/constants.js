exports.BUCKET_NAME_STAGING = 'ek-blog-media-flDXLaDcW-staging';

exports.BUCKET_NAME_PROD = 'ek-blog-media-flDXLaDcW';

exports.IMMUTABLE_CACHE_DURATION = 60 * 60 * 24 * 365; // 1 year

exports.MARKED_OPTIONS = {
  sanitize: true,
};

const IMAGE_SIZE_THUMB = (exports.IMAGE_SIZE_THUMB = 'thumb');
const IMAGE_SIZE_S = (exports.IMAGE_SIZE_S = 'small');
const IMAGE_SIZE_M = (exports.IMAGE_SIZE_M = 'medium');
const IMAGE_SIZE_L = (exports.IMAGE_SIZE_L = 'large');

exports.IMAGE_SIZES = {
  [IMAGE_SIZE_THUMB]: [160, 160],
  [IMAGE_SIZE_S]: [500, undefined],
  [IMAGE_SIZE_M]: [1000, undefined],
  [IMAGE_SIZE_L]: [2000, undefined],
};

exports.SERVER_ERROR = 'ServerError';
exports.NOT_FOUND_ERROR = 'NotFoundError';
exports.VALIDATION_ERROR = 'ValidationError';
exports.TITLE_MISSING_ERROR = 'TitleMissingError';
exports.TITLE_TOO_SHORT_ERROR = 'TitleTooShortError';
exports.TITLE_TOO_LONG_ERROR = 'TitleTooLongError';
exports.ALREADY_EXISTS_ERROR = 'AlreadyExistsError';
