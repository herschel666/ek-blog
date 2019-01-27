const getCssNano = () => {
  if (process.env.NODE_ENV === 'production') {
    return require('cssnano')({
      preset: 'default',
    });
  }
  return [];
};

module.exports = {
  plugins: [require('autoprefixer')].concat(getCssNano()),
};
