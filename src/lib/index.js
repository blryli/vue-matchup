/* jshint esversion: 6 */
import Canves from './canves';
import Collapse from './collapse';
import CollapseItem from './collapse-item';
import Table from './table';
import Matchup from './matchup';
import CollapseTransition from './collapse-transition';
import Content from './content';
import Popover from './popover';

const components = [
  Canves,
  Collapse,
  CollapseItem,
  Table,
  Matchup,
  CollapseTransition,
  Popover,
  Content
];

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default install
