const { getCategories } = require('@architect/shared/data');
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');
const { iterate } = require('@architect/views/util');

const getBody = (categories) =>
  layout(
    'Kategorien',
    html`
      <h1>Kategorien</h1>
      <ol>
        ${iterate(
          categories,
          ({ slug, title }) => html`
            <li>
              <h2>
                <a href="/categories/${slug}">
                  ${title}
                </a>
              </h2>
            </li>
          `
        )}
      </ol>
    `
  );

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const categories = await getCategories({
    values: ['slug', 'title'],
  });
  const body = getBody(categories);

  return {
    type: 'text/html; charset=utf8',
    body,
  };
};
