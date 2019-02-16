const arc = require('@architect/functions');
const { S3 } = require('aws-sdk');
const gm = require('gm').subClass({ imageMagick: true });
const { writeFile } = require('@architect/shared/util');
const {
  IMAGE_SIZES,
  IMAGE_SIZE_THUMB,
} = require('@architect/shared/constants');

const getOriginalDimensions = (instance) =>
  new Promise((resolve, reject) => {
    instance.size((err, originalDimensions) => {
      if (err) {
        return reject(err);
      }
      resolve(originalDimensions);
    });
  });

const handler = async (record, callback) => {
  const { media, size, mime } = record;
  const buffer = new Buffer(media, 'base64');
  const [filename, ext] = record.filename.split('.');
  const dimensions = IMAGE_SIZES[size];

  if (!dimensions || !Array.isArray(dimensions)) {
    return callback(new Error(`Unknown image size "${size}" given.`));
  }

  const instance = gm(buffer);
  const { width, height } = await getOriginalDimensions(instance);

  if (height > width) {
    dimensions.reverse();
  }

  if (size === IMAGE_SIZE_THUMB) {
    dimensions.push('!');
  }

  // TODO: handle portrait mode images correctly
  instance.resize(...dimensions).toBuffer(ext.toUpperCase(), (err, resized) => {
    if (err) {
      callback(err);
      return;
    }

    writeFile({
      s3: new S3(),
      buffer: resized,
      filename: `${filename}-${size}.${ext}`,
      mime,
    }).then(() => callback(), callback);
  });
};

exports.handler = arc.queues.subscribe(handler);
