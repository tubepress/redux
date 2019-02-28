import babel            from 'rollup-plugin-babel';
import commonjs         from 'rollup-plugin-commonjs';
import replace          from 'rollup-plugin-replace';
import resolve          from 'rollup-plugin-node-resolve';
import { terser }       from 'rollup-plugin-terser';
import visualizer       from 'rollup-plugin-visualizer';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import pkg              from './package.json';

const isProduction = process.env.NODE_ENV === 'production',

  isProfiling = process.env.NODE_ENV === 'profile',

  replacements = () => {

    const toStringify = { 'process.env.NODE_ENV' : isProduction ? 'production' : 'development' },
      raw = { 'PRODUCTION' : isProduction };

    Object.keys(toStringify).map((key) => {
      toStringify[key] = JSON.stringify(toStringify[key]);
    });

    return {
      ...toStringify,
      ...raw,
      delimiters: ['', ''],
    };
  },

  buildPlugins = () => {

    const plugins = [
      resolve({ browser: true }),
      commonjs(),
      replace(replacements()),
      replace({
        include : 'node_modules/uuid/index.js',
        'uuid.v1' : '//',
      }),
      babel({
        babelrc: false,
        runtimeHelpers: true,
        presets: [
          [
            '@babel/env', {
              modules : false,
              forceAllTransforms: isProduction,
            },
          ],
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
        ],
      }),
      sizeSnapshot(),
    ];

    if (isProduction) {

      plugins.push(terser());
    }

    if (isProfiling) {

      plugins.push(visualizer());
    }

    return plugins;
  };

export default {
  input: 'src/index.js',
  output: {
    file: 'es/index.js',
    format: 'es',
  },
  plugins: buildPlugins(),
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};
