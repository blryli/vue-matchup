import Matchup from './matchup';

/* istanbul ignore next */
Matchup.install = function(Vue) {
  Vue.component(Matchup.name, Matchup);
};

export default Matchup;
