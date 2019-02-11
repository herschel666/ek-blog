const { S3 } = require('aws-sdk');
const withAuth = require('@architect/shared/with-auth');
const { createMedia } = require('@architect/shared/data');
const { writeFile } = require('@architect/shared/util');

exports.handler = withAuth(async (req) => {
  const { media, description } = req.body;

  console.log();
  console.log(
    Object.assign(req, {
      body: {
        media: media.substring(0, 32),
        description,
      },
    })
  );

  try {
    const mediaBuffer = new Buffer(media, 'base64');
    const { filename, ext } = await writeFile(new S3(), mediaBuffer);

    await createMedia({ filename, ext, description });

    return {
      status: 201,
      body: JSON.stringify({ filename }),
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
    };
  }
});
