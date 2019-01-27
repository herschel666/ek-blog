const { readFileSync: readFile } = require('fs');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const buffer = readFile(__dirname + '/' + req.params.file);

  return {
    type: 'image/jpg',
    body: buffer.toString('base64'),
    isBase64Encoded: true,
  };
};
