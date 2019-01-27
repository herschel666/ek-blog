const { readFileSync: readFile } = require('fs');
const { extname } = require('path');

const getType = (suffix) => {
  switch (suffix) {
    case 'js':
      return 'text/javascript';
    case 'css':
      return 'text/css';
    default:
      throw Error(`Unknow suffix "${suffix}"`);
  }
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const body = readFile(`./files/${req.params.file}`, 'utf8');
    const type = getType(extname(req.params.file).substring(1));

    return {
      type,
      body,
    };
  } catch (err) {
    console.log(err);

    return {
      status: 404,
      type: 'text/html; charset=utf8',
      body: '<p>File not found.</p>',
    };
  }
};
