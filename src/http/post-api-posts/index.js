const data = require('@architect/data');
const shortid = require('shortid');
const { slugify } = require('@architect/shared/util');

const getCreatedAt = (createdAt) => {
  try {
    return new Date(createdAt).toISOString();
  } catch (_) {
    return new Date().toISOString();
  }
};

const getCategoryParams = (categorySlugs) =>
  categorySlugs.reduce((params, slug) => `${params}cat:${slug}#`, '#');

const getParams = (dateTime, categorySlugs, uid) =>
  `#${uid}#${dateTime}${getCategoryParams(categorySlugs)}`;

const getCategorySlugs = (categories) =>
  Promise.all(
    categories.map(async (uid) => {
      const {
        Items: [{ slug }],
      } = await data.blog.query({
        KeyConditionExpression: 'kind = :kind',
        FilterExpression: 'uid = :uid',
        ProjectionExpression: 'slug',
        ExpressionAttributeValues: {
          ':kind': 'category',
          ':uid': uid,
        },
      });
      return slug;
    })
  );

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const {
    categories: cats,
    title,
    content,
    createdAt: requestedCreatedAt,
  } = req.body;
  const categories = [].concat(cats).filter(Boolean);
  const createdAt = getCreatedAt(requestedCreatedAt);
  const uid = `b${shortid.generate()}`;
  const slug = slugify(title, { lower: true });

  try {
    const categorySlugs = await getCategorySlugs(categories);
    await data.blog.put({
      kind: 'blogpost',
      createdAt,
      params: getParams(createdAt, categorySlugs, uid),
      uid,
      categories,
      title,
      content,
      slug,
    });
  } catch (err) {
    console.log(err);

    const error = true;

    return {
      status: 400,
      type: 'application/json',
      body: JSON.stringify({ error }),
    };
  }

  return {
    status: 202,
  };
};
