const arc = require('@architect/functions');

module.exports = (handler) => async (req, res) => {
  const session = await arc.http.session.read(req);
  const isLoggedIn =
    session.loggedIn ||
    (process.env.NODE_ENV === 'testing' && process.env.REQUIRE_AUTH !== 'true');

  if (!isLoggedIn) {
    return {
      status: 403,
    };
  }

  return handler(req, res);
};
