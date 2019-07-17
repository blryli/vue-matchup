import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vue-matchup',
    file: 'dist/vue-matchup.umd.js',
    format: 'umd'
  },
})

export default config
