const NoUidError = require('@architect/shared/no-uid-error');
const { deleteMediaByUid } = require('@architect/shared/data');
const { deleteFile } = require('@architect/shared/util');

exports.handler = async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;

  try {
    if (!uid) {
      throw NoUidError();
    }

    const filename = await deleteMediaByUid({ uid });

    await deleteFile(filename);

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
};
