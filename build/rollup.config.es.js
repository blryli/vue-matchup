import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name: 'vue-matchup',
    file: 'dist/vue-matchup.esm.js',
    format: 'es',
  },
})

export default config
