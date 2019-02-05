exports.iterate = (list = [], fn) =>
  list.reduce((str, item, index) => `${str}${fn(item, index)}`, '');
