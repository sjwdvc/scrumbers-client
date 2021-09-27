import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;
Vue.prototype.$server = 'https://scrumbers-server.herokuapp.com/api/'
//Vue.prototype.$server = 'http://localhost:4000/api/'
Vue.filter('capitalize', value => value.toUpperCase())

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
