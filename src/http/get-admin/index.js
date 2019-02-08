const arc = require('@architect/functions');
const blog = require('@architect/views/layouts/blog');
const admin = require('@architect/views/layouts/admin');
const html = require('@architect/views/html');

const loggedOutBody = blog(
  'Admin :: ek|blog',
  html`
    <form action="${arc.http.helpers.url('/admin')}" method="post">
      <input type="hidden" name="action" value="login" />
      <fieldset>
        <legend>Login</legend>
        <label>
          Token<br />
          <input
            type="password"
            name="token"
            placeholder="Enter login token&hellip;"
            autofocus
          />
        </label>
        <button>Submit</button>
      </fieldset>
    </form>
  `
);

const loggedInBody = admin(html`
  <script>
    window.__blog__.baseUrl = '${arc.http.helpers.url('/')}';
  </script>
`);

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const session = await arc.http.session.read(req);
  const isLoggedIn =
    session.loggedIn ||
    (process.env.NODE_ENV === 'testing' && process.env.REQUIRE_AUTH !== 'true');
  const body = isLoggedIn ? loggedInBody : loggedOutBody;

  return {
    type: 'text/html; charset=utf8',
    body,
  };
};
