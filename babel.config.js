module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'relay',
      [
        'babel-plugin-root-import',
        {
          rootPathSuffix: 'src/'
        }
      ]
    ]
  };
};
