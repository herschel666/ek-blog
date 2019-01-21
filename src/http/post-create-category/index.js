const data = require('@architect/data');
const shortid = require('shortid');
const { slugify } = require('@architect/shared/util');

const getPayload = (title) => {
  const slug = slugify(title, { lower: true });
  const createdAt = new Date().toISOString();
  const uid = `a${shortid.generate()}`;
  const payload = {
    kind: 'category',
    createdAt,
    params: `#${uid}#${slug}#`,
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
  let query = '';

  try {
    await data.ddb_data.put(getPayload(title));
  } catch (err) {
    console.log('\npost-create-category', err);
    query = '?error=category';
  }

  return {
    status: 301,
    location: `/${query}`,
  };
};
