import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import checkLogin from './middleware/auth'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import {SERVER, USER} from "./constants";

Vue.use(VueToast)
Vue.prototype.login     = false
Vue.prototype.user      = {}

// Allow axios CORS
axios.defaults.withCredentials = true

// // Method to run before visiting any route ( Middleware )
router.beforeEach((to, from, next) => {
    checkLogin()
        .then(data => {
            Vue.prototype.login = !!data.data.login

            if(data.data.login)
            {
                USER.name = data.data.name;
                USER.email = data.data.email;
            }

            switch(true)
            {
                // If user is not logged in, and next route is not login or register
                case (!data.data.login && to.name !== 'login' && to.name !== 'register'):
                    next({name: 'login'})
                    break;

                // If user logged in and trying to access login screen
                case (data.data.login && to.name === 'login'):
                    next({name: 'createroom'})
                    break;

                // If user logged in, change new home to create room
                case (data.data.login && to.name === 'home'):
                    next({name: 'createroom'})
                    break;

                default: next()
            }

        })
        .catch(err => console.log(err))
})

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.filter('capitalize', value => value.toUpperCase())

const app = new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

export default app;