let arc = require('@architect/functions');
const { finishImageUpload } = require('@architect/shared/data');

function handler(record, callback) {
  console.log(JSON.stringify(record, null, 2));

  finishImageUpload(record).then(() => callback(), callback);
}

exports.handler = arc.queues.subscribe(handler);
