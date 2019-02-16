const arc = require('@architect/functions');
const { S3 } = require('aws-sdk');
const sharp = require('sharp');
const { writeFile } = require('@architect/shared/util');
const { IMAGE_SIZES } = require('@architect/shared/constants');

const handler = async (record, callback) => {
  let error;
  const { media, size, mime } = record;
  const buffer = new Buffer(media, 'base64');
  const [filename, ext] = record.filename.split('.');
  const dimensions = IMAGE_SIZES[size];

  if (!dimensions || !Array.isArray(dimensions)) {
    return callback(new Error(`Unknown image size "${size}" given.`));
  }

  try {
    const instance = sharp(buffer);
    const { width, height } = await instance.metadata();

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
      filename: `${filename}-${size}.${ext}`,
      mime,
    });
  } catch (err) {
    error = err;
  }

  callback(error);
};

exports.handler = arc.queues.subscribe(handler);
