import base from './rollup.config.base'
import uglify from 'rollup-plugin-uglify-es'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'VueMatchup',
    file: 'dist/vue-matchup.min.js',
    format: 'iife'
  },
})

config.plugins.push(uglify())

export default config
