const { readFileSync: readFile } = require('fs');
const { resolve, extname } = require('path');

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

const getFile = (file) => {
  let pathname = `./files/${file}`;

  if (file.startsWith('vendor_') && process.env.NODE_ENV === 'testing') {
    const [folder, filename] = file.split('_');
    pathname = resolve(__dirname, '..', '..', '..', 'lib', folder, filename);
  }

  return readFile(pathname, 'utf8');
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const body = getFile(req.params.file);
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
