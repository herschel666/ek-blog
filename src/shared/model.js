const data = require('@architect/data');

const ITEMS_PER_PAGE = (exports.ITEMS_PER_PAGE = 3);

const getCategoriesByUids = async (uids = []) => {
  const filterExpression = uids
    .map((_, index) => `uid = :uid${index}`)
    .join(' OR ');
  const expresionAttributeValues = uids.reduce(
    (values, uid, index) =>
      Object.assign(values, {
        [`:uid${index}`]: uid,
      }),
    {
      ':kind': 'category',
    }
  );
  const { Items: categories } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: filterExpression,
    ProjectionExpression: 'title, slug',
    ExpressionAttributeValues: expresionAttributeValues,
  });

  return categories;
};

exports.getBlogposts = async ({
  values,
  startKey = null,
  limit = ITEMS_PER_PAGE,
}) => {
  const {
    Items: posts = [],
    LastEvaluatedKey: lastEvaluatedKey,
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: values.join(', '),
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: startKey,
  });

  return {
    hasNextPage: Boolean(lastEvaluatedKey),
    posts,
  };
};

exports.getBlogpostsByParam = async ({ param, values }) => {
  const { Items: posts } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'contains(params, :param)',
    ProjectionExpression: values.join(', '),
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
      ':param': param,
    },
  });

  return posts;
};

exports.getBlogpostsCount = async () => {
  try {
    const { Count: count } = await data.blog.query({
      KeyConditionExpression: 'kind = :kind',
      ProjectionExpression: 'uid',
      ExpressionAttributeValues: {
        ':kind': 'blogpost',
      },
      Select: 'COUNT',
    });
    return count;
  } catch (err) {
    console.log('[getBlogpostsCount]', err);
    return 0;
  }
};

exports.getLastBlogpostStartKeyByOffset = async (offset = 0) => {
  if (offset === 0) {
    return null;
  }

  const { LastEvaluatedKey: lastEvaluatedKey } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: 'uid',
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
    },
    ScanIndexForward: false,
    Limit: offset,
  });

  return lastEvaluatedKey;
};

exports.getBlogpostBySlug = async ({ slug, values }) => {
  const valuesWithCategories = Array.from(new Set(values.concat('categories')));
  const {
    Items: [blogpost],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'slug = :slug',
    ProjectionExpression: valuesWithCategories.join(', '),
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
      ':slug': slug,
    },
  });

  if (!blogpost) {
    return null;
  }

  const categories = await getCategoriesByUids(blogpost.categories);

  return Object.assign(blogpost, { categories });
};

exports.getCategories = async ({ values }) => {
  const { Items: categories } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: values.join(', '),
    ExpressionAttributeValues: {
      ':kind': 'category',
    },
  });

  return categories;
};

exports.getCategoryBySlug = async ({ slug, values }) => {
  const {
    Items: [category],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'slug = :slug',
    ProjectionExpression: values.join(', '),
    ExpressionAttributeValues: {
      ':kind': 'category',
      ':slug': slug,
    },
  });

  return category;
};
