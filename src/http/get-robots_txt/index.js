exports.handler = async (req) => {
  console.log(req);

  return {
    type: 'text/plain; charset=utf8',
    body: `User-agent: *
Disallow: /`,
  };
};
