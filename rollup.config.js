import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import 'regenerator-runtime/runtime';

export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
  },
  plugins: [
    babel({ 
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/env',
          {
            'modules': false,
            'targets': {
              'browsers': '> 0.25%, not op_mini all, not dead, IE 10-11',
            }
          }
        ],
      ],
    }),
    // terser()
  ],
};