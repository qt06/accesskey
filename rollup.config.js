import minimist from 'minimist';
import resolve from '@rollup/plugin-node-resolve';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';

let argv = minimist(process.argv.slice(2));
let minify = argv['config:minify'];
const build = (filename) => {
return {
  input: 'src/' + filename + '.js',
  output: {
    file: minify ? 'dist/' + filename + '.min.js' : 'dist/' + filename + '.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    resolve(),
    json(),
    minify ? terser() : {}
  ]
}};
export default [
build('accesskey'),
];
