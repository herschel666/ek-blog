const arc = require('@architect/functions');

module.exports = async (req) => {
  const session = await arc.http.session.read(req);
  const isLoggedIn =
    session.loggedIn ||
    (process.env.NODE_ENV === 'testing' && process.env.REQUIRE_AUTH !== 'true');

  if (!isLoggedIn) {
    console.log('Unauthorized request');
    console.log(req);

    return {
      status: 401,
    };
  }
};
