const { createMedia } = require('@architect/shared/model');
const { writeFile } = require('@architect/shared/util');

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
    const { filename, ext } = await writeFile(imageBuffer);

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
};
