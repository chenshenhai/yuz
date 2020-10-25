const path = require('path');
const buble = require('@rollup/plugin-buble'); 
const typescript = require('@rollup/plugin-typescript');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', '..', filePath)
}

module.exports = [
  {
    input: resolveFile('src/bin/index.ts'),
    output: {
      file: resolveFile('dist/bin/noo.js'),
      format: 'umd',
    }, 
    plugins: [
      typescript(),
      buble(),
    ],
  },
]