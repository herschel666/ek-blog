const {
  BLOGPOSTS_PER_PAGE,
  getPaginatedByKind,
} = require('@architect/shared/data');
const html = require('@architect/views/html');

//  TODO: use absolute URL in <link />
const getItems = (str, blogpost) => html`
  ${str}
  <item>
    <title>${blogpost.title}</title>
    <link>/posts/${blogpost.slug}</link>
    <pubDate>${blogpost.createdAt}</pubDate>
    <dc:creator><![CDATA[Emanuel]]></dc:creator>
    <description><![CDATA[${blogpost.content}]]></description>
  </item>
`;

//  TODO: use absolute URL in <link />
const getBody = (blogposts) => html`
  <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel>
      <title>ek|blog</title>
      <link>/</link>
      <language>de-DE</language>
      <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
      <description></description>
      ${blogposts.reduce(getItems, '')}
    </channel>
  </rss>
`;

exports.handler = async (req) => {
  console.log();
  console.log(req);

  try {
    const { items: blogposts = [] } = await getPaginatedByKind({
      kind: 'blogpost',
      values: ['uid', 'content', 'title', 'slug', 'createdAt'],
      limit: BLOGPOSTS_PER_PAGE,
    });
    const body = `<?xml version="1.0" encoding="UTF-8"?>${getBody(blogposts)}`;

    return {
      type: 'text/xml; charset=utf8',
      body,
    };
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      type: 'text/plain; charset=utf8',
      body: 'An error occurred.',
    };
  }
};
