const arc = require('@architect/functions');
const NoUidError = require('@architect/shared/no-uid-error');
const withAuth = require('@architect/shared/with-auth');
const { deleteMediaByUid } = require('@architect/shared/data');

exports.handler = withAuth(async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;

  try {
    if (!uid) {
      throw NoUidError();
    }

    const { filehash, ext } = await deleteMediaByUid({ uid });

    // TODO: deleet all sizes
    await arc.queues.publish({
      name: 'delete-media-file',
      payload: { filehash, ext },
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
      params: JSON.stringify({ error, type }),
    };
  }
});
