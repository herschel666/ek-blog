const data = require('@architect/data');
const { readFileSync: readFile } = require('fs');
const stream = require('stream');
const unzip = require('unzip');
const globby = require('globby');
const frontmatter = require('frontmatter');
const shortid = require('shortid');
const { slugify } = require('@architect/shared/util');

const unzipFolder = (buffer) =>
  new Promise((resolve, reject) => {
    const bufferStream = new stream.PassThrough();

    bufferStream.end(buffer);
    bufferStream.pipe(unzip.Extract({ path: __dirname + '/posts' }));
    bufferStream.on('error', reject);
    bufferStream.on('end', resolve);
  });

const getCategoryParams = (categorySlugs) =>
  categorySlugs.reduce((params, slug) => `${params}cat:${slug}#`, '#');

const getParams = (dateTime, categorySlugs, uid) =>
  `#${uid}#${dateTime}${getCategoryParams(categorySlugs)}`;

exports.handler = async (req) => {
  if (process.env.NODE_ENV !== 'testing') {
    return {
      status: 403,
    };
  }

  console.log();
  console.log(req);

  try {
    const buffer = new Buffer(req.body.file, 'base64');
    await unzipFolder(buffer);
    const paths = await globby(['posts/**/*md']);
    const posts = paths.map((path) => {
      const post = frontmatter(readFile(__dirname + '/' + path, 'utf8'));
      const uid = `b${shortid.generate()}`;
      const slug = slugify(post.data.title, { lower: true });
      const categorySlugs = post.data.categories.map((category) =>
        slugify(category, { lower: true })
      );
      const createdAt = new Date(
        path
          .split('-')
          .slice(0, 3)
          .join('-')
      ).toISOString();

      return {
        kind: 'blogpost',
        title: post.data.title,
        content: post.content,
        params: getParams(createdAt, categorySlugs, uid),
        categories: post.data.categories,
        uid,
        slug,
        createdAt,
      };
    });
    await Promise.all(posts.map((post) => data.blog.put(post)));
  } catch (err) {
    console.log(err);
  }

  return {
    status: 301,
    location: '/import',
  };
};
