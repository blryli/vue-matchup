import Sidebar from './sidebar';

/* istanbul ignore next */
Sidebar.install = function(Vue) {
  Vue.component(Sidebar.name, Sidebar);
};

export default Sidebar;
