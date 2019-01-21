const slugify = require('slugify');

slugify.extend({
  ü: 'ue',
  Ü: 'Ue',
  ö: 'oe',
  Ö: 'Oe',
  ä: 'ae',
  Ä: 'Ae',
  ß: 'ss',
  '/': '-',
});

const pad = (num = 0, str = String(num)) => {
  const len = str.length;
  return len >= 2 ? str : `0${str}`;
};

exports.getNiceDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

exports.slugify = slugify;
