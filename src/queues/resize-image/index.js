const arc = require('@architect/functions');
const { S3 } = require('aws-sdk');
const sharp = require('sharp');
const { writeFile } = require('@architect/shared/util');
const { IMAGE_SIZES } = require('@architect/shared/constants');

const cache = {};

const getInstanceAndMeta = async (filehash, buffer) => {
  do {
    if (
      cache[filehash] &&
      cache[filehash].instance &&
      typeof cache[filehash].width === 'number' &&
      typeof cache[filehash].height === 'number'
    ) {
      break;
    }

    const instance = sharp(buffer);
    const { width, height } = await instance.metadata();

    cache[filehash] = { instance, width, height };
  } while (false);

  return cache[filehash];
};

const handler = async (record, callback) => {
  let error;
  const { filename, media, size, mime } = record;
  const buffer = new Buffer(media, 'base64');
  const [filehash, ext] = filename.split('.');
  const dimensions = IMAGE_SIZES[size];

  if (!dimensions || !Array.isArray(dimensions)) {
    return callback(new Error(`Unknown image size "${size}" given.`));
  }

  try {
    const { instance, width, height } = await getInstanceAndMeta(
      filehash,
      buffer
    );

    if (height > width) {
      dimensions.reverse();
    }

    dimensions.push({ withoutEnlargement: true });

    const resized = await instance
      .resize(...dimensions)
      .toFormat(ext)
      .toBuffer();

    await writeFile({
      s3: new S3(),
      buffer: resized,
      filename: `${filehash}-${size}.${ext}`,
      mime,
    });
  } catch (err) {
    error = err;
  }

  callback(error);
};

exports.handler = arc.queues.subscribe(handler);
