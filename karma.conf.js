/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = (config) => {
  config.set(
      merge(createDefaultConfig(config), {
        files: [
          {
            pattern: require.resolve('chai/chai.js')
          },
          {
            pattern: require.resolve('axe-core/axe.min.js')
          },
          {
            pattern: config.grep ? config.grep : 'test/**/*.test.js',
            type: 'module'
          },
          {
            pattern: 'node_modules/cryptojslib/components/core.js',
            type: 'js'
          },
          {
            pattern: 'node_modules/cryptojslib/rollups/sha1.js',
            type: 'js'
          },
          {
            pattern: 'node_modules/cryptojslib/components/enc-base64-min.js',
            type: 'js'
          },
          {
            pattern: 'node_modules/cryptojslib/rollups/md5.js',
            type: 'js'
          },
          {
            pattern: 'node_modules/cryptojslib/rollups/hmac-sha1.js',
            type: 'js'
          },
          {
            pattern: 'node_modules/cryptojslib/jsrsasign/lib/jsrsasign-rsa-min.js',
            type: 'js'
          }
        ],

        client: {
          mocha: {
            timeout: 5000
          }
        },

        // see the karma-esm docs for all options
        esm: {
        // if you are using 'bare module imports' you will need this option
          nodeResolve: true
        },

        coverageIstanbulReporter: {
          thresholds: {
            global: {
              statements: 80,
              branches: 80,
              functions: 90,
              lines: 80
            }
          }
        },
      })
  );
  return config;
};
