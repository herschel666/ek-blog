const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const data = require('@architect/data');
const fileType = require('file-type');
const shortid = require('shortid');

const writeFile = promisify(fs.writeFile);

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const imageBuffer = new Buffer(req.body.image, 'base64');
    const { ext } = fileType(imageBuffer);
    const uid = `m${shortid.generate()}`;
    const filename = `${uid}.${ext}`;
    const createdAt = new Date().toISOString();

    await Promise.all([
      writeFile(
        path.resolve(__dirname, '..', '..', '..', 'public', 'media', filename),
        imageBuffer
      ),
      data.blog.put({
        kind: 'media',
        createdAt,
        uid,
        ext,
      }),
    ]);

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
};
