const NoUidError = require('@architect/shared/no-uid-error');
const { deleteByUidForKind } = require('@architect/shared/model');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;

  try {
    if (!uid) {
      throw NoUidError();
    }

    await deleteByUidForKind({
      kind: 'category',
      uid,
    });

    return {
      status: 202,
    };
  } catch (err) {
    console.log(err);

    const type = err instanceof NoUidError ? 'param_missing' : 'server_error';
    const error = true;

    return {
      status: 400,
      type: 'application/json',
      body: JSON.stringify({ error, type }),
    };
  }
};
