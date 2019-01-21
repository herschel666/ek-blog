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

const getCategoryParams = (categories) =>
  categories.reduce((params, slug) => `${params}cat:${slug}#`, '#');

const getParams = (dateTime, categories, uid) =>
  `#${uid}#${dateTime}${getCategoryParams(categories)}`;

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const {
    categories: cats,
    title,
    content,
    createdAt: requestedCreatedAt,
  } = req.body;
  const categories = [].concat(cats);
  const createdAt = getCreatedAt(requestedCreatedAt);
  const uid = `b${shortid.generate()}`;
  const slug = slugify(title, { lower: true });
  let query = '';

  try {
    const categoriesList = await Promise.all(
      categories.map(async (category) => {
        const {
          Items: [{ title: categoryTitle }],
        } = await data.ddb_data.query({
          KeyConditionExpression: 'kind = :kind',
          FilterExpression: 'slug = :slug',
          ProjectionExpression: 'title',
          ExpressionAttributeValues: {
            ':kind': 'category',
            ':slug': category,
          },
        });
        return {
          slug: category,
          title: categoryTitle,
        };
      })
    );
    await data.ddb_data.put({
      kind: 'blogpost',
      createdAt,
      params: getParams(createdAt, categories, uid),
      uid,
      categories: categoriesList,
      title,
      content,
      slug,
    });
  } catch (err) {
    console.log('\npost-create-post', err);
    query = '?error=post';
  }

  return {
    status: 301,
    location: `/${query}`,
  };
};
