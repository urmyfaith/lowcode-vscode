const path = require('path');

const tsConfigPath = path.join(__dirname, 'tsconfig.json');

const config = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  externals: {
    vscode: 'commonjs vscode',
    prettier: 'commonjs prettier',
    'copy-paste': 'commonjs copy-paste',
    //handlebars: 'commonjs handlebars',
    // axios: 'commonjs axios',
    // ejs:'commonjs ejs',
    // 'generate-schema':'commonjs generate-schema',
    // 'is-url':'commonjs is-url',
    // 'json-schema-to-typescript':'commonjs json-schema-to-typescript',
    // 'quicktype-core':'commonjs quicktype-core',
    // 'strip-comments':'commonjs strip-comments'
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js',
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: tsConfigPath,
            },
          },
        ],
      },
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  return config;
};
