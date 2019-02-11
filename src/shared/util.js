const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const arc = require('@architect/functions');
const slugify = require('slugify');

const {
  BUCKET_NAME_STAGING,
  BUCKET_NAME_PROD,
  IMMUTABLE_CACHE_DURATION,
} = require('./constants');

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

const bucketName = () => {
  if (process.env.NODE_ENV === 'staging') {
    return BUCKET_NAME_STAGING;
  }
  return BUCKET_NAME_PROD;
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

exports.writeFile = async ({ s3, buffer, filename, mime }) => {
  if (process.env.NODE_ENV === 'testing') {
    const filePath = path.resolve(
      process.env.CURDIR,
      'public',
      'media',
      filename
    );
    await writeFile(filePath, buffer);
  } else {
    await s3
      .putObject({
        Body: buffer,
        Bucket: bucketName(),
        ContentType: mime,
        ACL: 'public-read',
        CacheControl: `public, max-age=${IMMUTABLE_CACHE_DURATION}`,
        Key: `media/${filename}`,
      })
      .promise();
  }
};

exports.deleteFile = async (s3, filename) => {
  if (process.env.NODE_ENV === 'testing') {
    await unlink(path.resolve(process.env.CURDIR, 'public', 'media', filename));
  } else {
    await s3
      .deleteObject({
        Bucket: bucketName(),
        Key: `media/${filename}`,
      })
      .promise();
  }
};
