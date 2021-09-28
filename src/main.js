import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import checkLogin from './middleware/auth'

// Allow axios CORS
axios.defaults.withCredentials = true

// Method to run before visiting any route ( Middleware )
router.beforeEach((to, from, next) => {
    checkLogin().then(data => {
        switch(true)
        {
            // If user is not logged in, and next route is not login or register
            case (!data.data.login && to.name !== 'login' && to.name !== 'register'):
                next({name: 'login'})
                break;

            // If user logged in and trying to access login screen
            case (data.data.login && to.name === 'login'):
                next({name: 'home'})
                break;

            default: next()
        }
    })
})

Vue.config.productionTip = false;
// Vue.prototype.$server = 'https://scrumbers-server.herokuapp.com/api/'
Vue.prototype.$server = 'http://localhost:4000/api/'

Vue.filter('capitalize', value => value.toUpperCase())

const app = new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

export default app;