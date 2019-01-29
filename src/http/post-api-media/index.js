const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const data = require('@architect/data');
const fileType = require('file-type');
const shortid = require('shortid');
const md5 = require('md5');

const writeFile = promisify(fs.writeFile);

exports.handler = async (req) => {
  const { image, description } = req.body;

  console.log();
  console.log(
    Object.assign(req, {
      body: {
        image: image.substring(0, 32),
        description,
      },
    })
  );

  try {
    const imageBuffer = new Buffer(image, 'base64');
    const { ext } = fileType(imageBuffer);
    const uid = `m${shortid.generate()}`;
    const filename = `${md5(imageBuffer)}.${ext}`;
    const createdAt = new Date().toISOString();

    await Promise.all([
      writeFile(
        path.resolve(__dirname, '..', '..', '..', 'public', 'media', filename),
        imageBuffer
      ),
      data.blog.put({
        kind: 'media',
        createdAt,
        filename,
        description,
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
