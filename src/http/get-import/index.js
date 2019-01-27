const { readFileSync: readFile } = require('fs');
const arc = require('@architect/functions');
const url = arc.http.helpers.url;
const layout = require('@architect/views/layouts/blog');
const html = require('@architect/views/html');

const script = readFile(__dirname + '/import.js', 'utf8');

const body = layout(
  'Import',
  html`
    <form method="post" action="${url('/import')}">
      <input type="hidden" name="file" id="hidden-input" />
      <input type="file" id="file-input" accept="application/zip" />
      <button disabled>Submit</button>
    </form>
    <script>
      (() => {
        ${script};
      })();
    </script>
  `
);

exports.handler = async (req) => {
  console.log();
  console.log(req);

  return {
    type: 'text/html; charset=utf8',
    body,
  };
};
