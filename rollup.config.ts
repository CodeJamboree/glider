import fs from 'fs';

import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';
import license from 'rollup-plugin-license';

import babel from '@rollup/plugin-babel';

import { RollupWatchOptions, OutputOptions, InputPluginOption, OutputPluginOption } from 'rollup';

const read = (file: string) => fs.readFileSync(file, 'utf-8');

const pkg = JSON.parse(read('package.json'));
const dev = pkg.exports['./development'];
const prod = pkg.exports['./production'];

const input = './src/index.ts';
const external: string[] = Object.keys(pkg.dependencies ?? {});

const name = pkg.name.replace(/^@.*\//, '');
console.log()
console.warn('Bundling', pkg.name, 'as', name);
console.log()

if (name === pkg.name) {
  throw new Error('Name in package.json missing @scope');
}
const banner = read('LICENSE.md');

const outFile = (file: string, format: 'esm' | 'commonjs'): OutputOptions => ({
  file,
  format,
  sourcemap: true,
  exports: format === 'esm' ? 'auto' : 'named',
  plugins: [license({ banner })],
});

const libraryFile = (file: string, format: 'esm' | 'commonjs', production: boolean): OutputOptions => {
  const options = outFile(file, format);
  if (production) {
    (options?.plugins as OutputPluginOption[]).push(terser())
  }
  if (format === 'esm') options.name = name;
  return options;
}

const libraryEnvironments = (devFile: string, prodFile: string, format: 'esm' | 'commonjs'): RollupWatchOptions => {
  const plugins: InputPluginOption[] = [
    resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx']
    }),
  ];
  if (format === 'commonjs') plugins.push(commonjs());

  return {
    input,
    external,
    output: [
      libraryFile(devFile, format, false),
      libraryFile(prodFile, format, true)
    ],
    plugins,
  }
}

const config: RollupWatchOptions[] = [
  libraryEnvironments(
    dev.import.default,
    prod.import.default,
    'esm'
  ),
  libraryEnvironments(
    dev.require.default,
    prod.require.default,
    'commonjs'
  ),
  {
    input,
    external,
    output: [
      outFile(dev.import.types, 'esm'),
      outFile(prod.import.types, 'esm'),
      outFile(dev.require.types, 'commonjs'),
      outFile(prod.require.types, 'commonjs')
    ],
    plugins: [
      dts()
    ],
  }
];

export default config;