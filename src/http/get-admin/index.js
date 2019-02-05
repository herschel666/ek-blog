const arc = require('@architect/functions');
const site = require('@architect/views/layouts/admin');
const html = require('@architect/views/html');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const body = site(
    html`
      <script>
        window.__blog__.baseUrl = '${arc.http.helpers.url('/')}';
      </script>
    `
  );

  return {
    type: 'text/html; charset=utf8',
    body,
  };
};
