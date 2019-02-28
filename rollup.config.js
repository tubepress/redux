import babel from 'rollup-plugin-babel';
import pkg   from './package.json';

export default {
  input: 'src/index.js',
  output: {
    file: 'es/index.js',
    format: 'es',
  },
  plugins: [
    babel({
      babelrc: false,
      runtimeHelpers: true,
      presets: [
        [
          '@babel/env', { modules : false },
        ],
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
      ],
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};
