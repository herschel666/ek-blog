const { S3 } = require('aws-sdk');
const arc = require('@architect/functions');
const { deleteFile } = require('@architect/shared/util');

function handler(record, callback) {
  console.log(record);

  deleteFile(new S3(), record.filename).then(callback, callback);
}

exports.handler = arc.queues.subscribe(handler);
