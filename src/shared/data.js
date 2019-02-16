const data = require('@architect/data');
const shortid = require('shortid');
const { slugify } = require('./util');

exports.BLOGPOSTS_PER_PAGE = 3;

exports.MEDIA_PER_PAGE = 2;

const CATEGORY_ALREADY_EXISTS = (exports.CATEGORY_ALREADY_EXISTS = Symbol());

const TARGET_NOT_FOUND = (exports.TARGET_NOT_FOUND = Symbol());

const getCategoryParamString = (categorySlugs) =>
  categorySlugs.reduce((params, slug) => `${params}cat:${slug}#`, '#');

const getBlogpostParams = (dateTime, categorySlugs, uid) =>
  `#${uid}#${dateTime}${getCategoryParamString(categorySlugs)}`;

const getDeduplicatedPostSlug = async (slug) => {
  const blogpost = await exports.getBlogpostBySlug({ values: ['slug'], slug });

  if (!blogpost) {
    return slug;
  }

  const [, num] = blogpost.slug.match(/-(\d+)$/) || [undefined, '0'];
  const newSlug = blogpost.slug.replace(/(|-\d+)$/, `-${Number(num) + 1}`);
  return getDeduplicatedPostSlug(newSlug);
};

const getCreatedAt = (createdAt) => {
  try {
    const date = new Date(createdAt).toISOString();

    if (date.toString() == 'Invalid Date') {
      throw new Error();
    }

    return date;
  } catch (_) {
    return new Date().toISOString();
  }
};

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
    ProjectionExpression: 'uid, title, slug',
    ExpressionAttributeValues: expresionAttributeValues,
  });

  return categories;
};

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

const getCreatedAtByUidForKind = async ({ kind, uid }) => {
  const {
    Items: [{ createdAt } = {}],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: 'createdAt',
    FilterExpression: 'uid = :uid',
    ExpressionAttributeValues: {
      ':kind': kind,
      ':uid': uid,
    },
  });

  return createdAt;
};

const getBlogpostByAttribute = async ({ values, attr }) => {
  const valuesWithCategories = Array.from(new Set(values.concat('categories')));
  const {
    Items: [blogpost],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: `${attr.name} = :${attr.name}`,
    ProjectionExpression: valuesWithCategories.join(', '),
    ExpressionAttributeValues: {
      ':kind': 'blogpost',
      [`:${attr.name}`]: attr.value,
    },
  });

  if (!blogpost) {
    return null;
  }

  const categories = await getCategoriesByUids(blogpost.categories);

  return Object.assign(blogpost, { categories });
};

exports.getPaginatedByKind = async ({
  kind,
  values,
  startKey = null,
  limit,
}) => {
  const {
    Items: items,
    LastEvaluatedKey: lastEvaluatedKey,
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: values.join(', '),
    ExpressionAttributeValues: {
      ':kind': kind,
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: startKey,
  });

  return {
    hasNextPage: Boolean(lastEvaluatedKey),
    items,
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

exports.getLastStartKeyByOffsetForKind = async ({ offset = 0, kind }) => {
  if (offset === 0) {
    return null;
  }

  const { LastEvaluatedKey: lastEvaluatedKey } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: 'uid',
    ExpressionAttributeValues: {
      ':kind': kind,
    },
    ScanIndexForward: false,
    Limit: offset,
  });

  return lastEvaluatedKey;
};

exports.getBlogpostBySlug = async ({ slug, values }) => {
  const blogpost = await getBlogpostByAttribute({
    attr: {
      name: 'slug',
      value: slug,
    },
    values,
  });

  return blogpost;
};

exports.getBlogpostByUid = async ({ uid, values }) => {
  const blogpost = await getBlogpostByAttribute({
    attr: {
      name: 'uid',
      value: uid,
    },
    values,
  });

  return blogpost;
};

exports.createBlogpost = async ({
  categories,
  title,
  content,
  createdAt: requestedCreatedAt,
}) => {
  const createdAt = getCreatedAt(requestedCreatedAt);
  const uid = `b${shortid.generate()}`;
  const slug = await getDeduplicatedPostSlug(slugify(title, { lower: true }));

  const categorySlugs = await getCategorySlugs(categories);
  await data.blog.put({
    kind: 'blogpost',
    createdAt,
    params: getBlogpostParams(createdAt, categorySlugs, uid),
    uid,
    categories,
    title,
    content,
    slug,
  });
};

exports.updateBlogpost = async ({ uid, title, content, categories }) => {
  const updatedAt = new Date().toISOString();
  const [{ createdAt } = {}, categorySlugs] = await Promise.all([
    exports.getBlogpostByUid({
      values: ['createdAt'],
      uid,
    }),
    getCategorySlugs(categories),
  ]);

  if (!createdAt) {
    return TARGET_NOT_FOUND;
  }

  const attributes = [
    'title = :title',
    'content = :content',
    'categories = :categories',
    'params = :params',
    'updatedAt = :updatedAt',
  ];
  await data.blog.update({
    Key: { kind: 'blogpost', createdAt },
    UpdateExpression: `SET ${attributes.join(', ')}`,
    ExpressionAttributeValues: {
      ':title': title,
      ':content': content,
      ':categories': categories,
      ':params': getBlogpostParams(createdAt, categorySlugs, uid),
      ':updatedAt': updatedAt,
    },
  });
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

exports.getCategoryByAttribute = async ({ attr, values }) => {
  const {
    Items: [category],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: `${attr.name} = :${attr.name}`,
    ProjectionExpression: values.join(', '),
    ExpressionAttributeValues: {
      ':kind': 'category',
      [`:${attr.name}`]: attr.value,
    },
  });

  return category;
};

exports.getCategoryBySlug = async ({ slug, values }) => {
  const category = await exports.getCategoryByAttribute({
    values,
    attr: {
      name: 'slug',
      value: slug,
    },
  });

  return category;
};

exports.getCategoryByUid = async ({ uid, values }) => {
  const category = await exports.getCategoryByAttribute({
    values,
    attr: {
      name: 'uid',
      value: uid,
    },
  });

  return category;
};

exports.createCategory = async ({ title }) => {
  console.log('Create category', title);
  const slug = slugify(title, { lower: true });
  const category = await exports.getCategoryBySlug({ slug, values: ['uid'] });

  if (category) {
    return CATEGORY_ALREADY_EXISTS;
  }

  const createdAt = new Date().toISOString();
  const uid = `c${shortid.generate()}`;
  const payload = {
    kind: 'category',
    createdAt,
    uid,
    slug,
    title,
  };
  await data.blog.put(payload);
};

exports.updateCategory = async ({ uid, title }) => {
  const { createdAt } = await exports.getCategoryByUid({
    values: ['createdAt'],
    uid,
  });

  if (!createdAt) {
    return TARGET_NOT_FOUND;
  }

  await data.blog.update({
    Key: { kind: 'category', createdAt },
    UpdateExpression: 'SET title = :title',
    ExpressionAttributeValues: {
      ':title': title,
    },
  });
};

exports.deleteByUidForKind = async ({ uid, kind }) => {
  const createdAt = await getCreatedAtByUidForKind({
    kind,
    uid,
  });
  await data.blog.delete({
    kind,
    createdAt,
  });
};

exports.createMedia = async ({ filehash, ext, description }) => {
  const uid = `m${shortid.generate()}`;
  const createdAt = new Date().toISOString();

  await data.blog.put({
    kind: 'media',
    createdAt,
    filehash,
    description,
    uid,
    ext,
  });

  return createdAt;
};

exports.getMediaByUid = async ({ uid, values }) => {
  const {
    Items: [media],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    FilterExpression: 'uid = :uid',
    ProjectionExpression: values.join(', '),
    ExpressionAttributeValues: {
      ':kind': 'media',
      ':uid': uid,
    },
  });

  return media || null;
};

exports.finishImageUpload = async ({ filehash, createdAt }) => {
  await data.blog.update({
    Key: { kind: 'media', createdAt },
    UpdateExpression: `SET filehash = :filehash`,
    ExpressionAttributeValues: {
      ':filehash': filehash,
    },
  });
};

exports.deleteMediaByUid = async ({ uid }) => {
  const {
    Items: [{ filehash, ext, createdAt } = {}],
  } = await data.blog.query({
    KeyConditionExpression: 'kind = :kind',
    ProjectionExpression: 'filehash, ext, createdAt',
    FilterExpression: 'uid = :uid',
    ExpressionAttributeValues: {
      ':kind': 'media',
      ':uid': uid,
    },
  });
  await data.blog.delete({
    kind: 'media',
    createdAt,
  });

  return { filehash, ext };
};
