const arc = require('@architect/functions');
const NoUidError = require('@architect/shared/no-uid-error');
const withAuth = require('@architect/shared/with-auth');
const { deleteMediaByUid } = require('@architect/shared/data');
const {
  IMAGE_SIZE_THUMB,
  IMAGE_SIZE_S,
  IMAGE_SIZE_M,
  IMAGE_SIZE_L,
} = require('@architect/shared/constants');

const sizes = [IMAGE_SIZE_THUMB, IMAGE_SIZE_S, IMAGE_SIZE_M, IMAGE_SIZE_L];

exports.handler = withAuth(async (req) => {
  console.log();
  console.log(req);

  const { uid } = req.params;

  try {
    if (!uid) {
      throw NoUidError();
    }

    const { filehash, ext } = await deleteMediaByUid({ uid });

    await arc.queues.publish({
      name: 'delete-media-file',
      payload: { filename: `${filehash}.${ext}` },
    });

    if (ext !== 'pdf') {
      await Promise.all(
        sizes.map((size) =>
          arc.queues.publish({
            name: 'delete-media-file',
            payload: { filename: `${filehash}-${size}.${ext}` },
          })
        )
      );
    }

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
