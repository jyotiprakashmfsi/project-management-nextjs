module.exports = function(api) {
  // Only use Babel for Jest tests
  const isTest = api.env('test');
  api.cache(true);
  
  // Return empty config for Next.js environment (let SWC handle it)
  if (!isTest) {
    return {};
  }
  
  // Only use this config for tests
  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript',
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: [
      '@babel/plugin-syntax-import-attributes'
    ],
  };
};
