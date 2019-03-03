const arc = require('@architect/functions');
const { S3 } = require('aws-sdk');
const fileType = require('file-type');
const Validator = require('fastest-validator');
const sanitizeHtml = require('sanitize-html');
const md5 = require('md5');
const withAuth = require('@architect/shared/middlewares/with-auth');
const { createMedia } = require('@architect/shared/data');
const { getMediaCheck } = require('@architect/shared/validate');
const { writeFile } = require('@architect/shared/util');
const {
  IMAGE_SIZE_THUMB,
  IMAGE_SIZE_S,
  IMAGE_SIZE_M,
  IMAGE_SIZE_L,

  SERVER_ERROR,
  VALIDATION_ERROR,
} = require('@architect/shared/constants');

const sizes = [IMAGE_SIZE_THUMB, IMAGE_SIZE_S, IMAGE_SIZE_M, IMAGE_SIZE_L];

const deferResizing = (args) =>
  sizes.reduce(async (promise, size) => {
    await promise;

    const payload = Object.assign({ size }, args);

    return arc.queues.publish({
      name: 'resize-image',
      payload,
    });
  }, Promise.resolve());

const check = getMediaCheck(new Validator(getMediaCheck.options));

exports.handler = arc.middleware(withAuth, async (req) => {
  const { media, description: dirtyDescription } = req.body;
  const description = dirtyDescription
    ? sanitizeHtml(dirtyDescription).trim()
    : undefined;

  console.log();
  console.log(
    Object.assign(req, {
      body: {
        media: media.substring(0, 32),
        description,
      },
    })
  );

  const result = check(
    Object.assign({ media }, description ? { description } : undefined)
  );

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
    const mediaBuffer = new Buffer(media, 'base64');
    const filehash = md5(mediaBuffer);
    const { ext, mime } = fileType(mediaBuffer);
    const filename = `${filehash}.${ext}`;
    const isPdf = ext === 'pdf';
    const payload = {
      filehash: isPdf ? filehash : 'processing',
      ext,
    };

    if (description) {
      payload.description = description;
    }

    await writeFile({
      s3: new S3(),
      buffer: mediaBuffer,
      filename,
      mime,
    });

    const mediaElement = await createMedia(payload);
    mediaElement.root = arc.http.helpers.static('/_static/media/');

    if (!isPdf) {
      await deferResizing({
        media,
        filename,
        mime,
      });
      await arc.queues.publish({
        name: 'finish-image-upload',
        payload: { filehash, createdAt: mediaElement.createdAt },
      });
    }

    return {
      status: 200,
      type: 'application/json',
      body: JSON.stringify({
        type: 'successs',
        body: { media: mediaElement },
      }),
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      type: 'application/json',
      body: JSON.stringify({
        type: SERVER_ERROR,
        body: {
          errors: [{ message: 'Something went wrong.' }],
        },
      }),
    };
  }
});
