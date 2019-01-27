const data = require('@architect/data');

const getCategoryParams = (categorySlugs) =>
  categorySlugs.reduce((params, slug) => `${params}cat:${slug}#`, '#');

const getParams = (dateTime, categorySlugs, uid) =>
  `#${uid}#${dateTime}${getCategoryParams(categorySlugs)}`;

const getBlogpost = (uid) =>
  data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'uid = :uid',
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
      ':uid': uid,
    },
  });

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

  const { uid } = req.params;
  const { title, content, categories: cats } = req.body;
  const categories = [].concat(cats).filter(Boolean);

  try {
    const [{ Items: [blogpost] = [] }, categorySlugs] = await Promise.all([
      getBlogpost(uid),
      getCategorySlugs(categories),
    ]);
    // TODO: https://arc.codes/reference/data-update
    await data.blog.put(
      Object.assign(blogpost, {
        params: getParams(blogpost.createdAt, categorySlugs, uid),
        categories,
        title,
        content,
      })
    );

    return {
      status: 202,
      type: 'application/json',
    };
  } catch (err) {
    console.log(err);

    return {
      statud: 500,
      type: 'application/json',
      body: JSON.stringify({ error: true }),
    };
  }
};
