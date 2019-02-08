const arc = require('@architect/functions');

const login = async (req) => {
  const { token = '' } = req.body;
  const session = await arc.http.session.read(req);

  // TODO: used hashed token
  session.loggedIn = token === 'yolo-swag';

  const cookie = await arc.http.session.write(session);

  return {
    status: 302,
    location: '/admin',
    cookie,
  };
};

const logout = async (req) => {
  const { loggedIn, ...session } = await arc.http.session.read(req);
  const cookie = await arc.http.session.write(session);

  return {
    status: 302,
    location: '/',
    cookie,
  };
};

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const { action } = req.body;

  switch (action) {
    case 'login':
      return login(req);
    case 'logout':
      return logout(req);
    default:
      return {
        status: 500,
        type: 'text/plain; charset=utf8',
        body: 'Invalid action',
      };
  }
};
