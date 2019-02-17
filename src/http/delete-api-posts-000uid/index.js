const arc = require('@architect/functions');
const NoUidError = require('@architect/shared/no-uid-error');
const withAuth = require('@architect/shared/middlewares/with-auth');
const { deleteByUidForKind } = require('@architect/shared/data');

exports.handler = arc.middleware(withAuth, async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;

  try {
    if (!uid) {
      throw NoUidError();
    }

    await deleteByUidForKind({
      kind: 'blogpost',
      uid,
    });

    return {
      status: 202,
    };
  } catch (err) {
    console.log(err);

    const type = err instanceof NoUidError ? 'param_missing' : 'server_error';
    const status = type === 'server_error' ? 500 : 400;
    const error = true;

    return {
      type: 'application/json',
      body: JSON.stringify({ error, type }),
      status,
    };
  }
});
