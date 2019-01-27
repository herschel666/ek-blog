const data = require('@architect/data');
const shortid = require('shortid');
const { slugify } = require('@architect/shared/util');

const getPayload = (title) => {
  const slug = slugify(title, { lower: true });
  const createdAt = new Date().toISOString();
  const uid = `c${shortid.generate()}`;
  const payload = {
    kind: 'category',
    createdAt,
    uid,
    slug,
    title,
  };
  return payload;
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const { title } = req.body;

  try {
    // TODO: check whether slug already exists
    await data.blog.put(getPayload(title));
  } catch (err) {
    console.log('\npost-create-category', err);
    return {
      status: 500,
      type: 'application/json',
      body: JSON.stringify({ error: true }),
    };
  }

  return {
    status: 202,
  };
};
