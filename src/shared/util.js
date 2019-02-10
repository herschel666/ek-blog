const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const arc = require('@architect/functions');
const slugify = require('slugify');
const fileType = require('file-type');
const md5 = require('md5');

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

slugify.extend({
  ü: 'ue',
  Ü: 'Ue',
  ö: 'oe',
  Ö: 'Oe',
  ä: 'ae',
  Ä: 'Ae',
  ß: 'ss',
  '/': '-',
  '!': '',
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

exports.assets = (filename) => arc.http.helpers.url(`/assets/${filename}`);

exports.writeFile = async (buffer) => {
  const { ext } = fileType(buffer);
  const filename = `${md5(buffer)}.${ext}`;

  await writeFile(
    path.resolve(__dirname, '..', '..', 'public', 'media', filename),
    buffer
  );

  return { filename, ext };
};

exports.deleteFile = async (filename) => {
  await unlink(
    path.resolve(__dirname, '..', '..', 'public', 'media', filename)
  );
};
