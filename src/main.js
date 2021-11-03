// Global imports
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import check from './middleware/auth'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import VueLottiePlayer from "vue-lottie-player";
import {TOKEN, USER} from "./constants";
import axios from "axios";

// Vue configuration
Vue.use(VueToast)
Vue.use(VueLottiePlayer)

Vue.prototype.login     = false
Vue.prototype.user      = {}
Vue.config.productionTip = false
Vue.config.devtools     = true

// global axios CORS fix -- Do not delete
axios.defaults.withCredentials = true
axios.defaults.headers = { Authorization: TOKEN }

// // Method to run before visiting any route ( Middleware )
router.beforeEach((to, from, next) => {
    check()
        .then(data => {
            Vue.prototype.login = !!data.data.login

            if(data.data.login)
            {
                console.log(data)
                USER.name = data.data.name;
                USER.email = data.data.email;
            }

            switch(true)
            {
                // If user is not logged in, and next route is not login or register
                case (!data.data.login && to.name !== 'login' && to.name !== 'register'):
                    to.name === 'session' ? next({name: 'login', params: {key: to.params.key}}) : next({name: 'login'})
                    break;

                // If user logged in and trying to access login screen
                case (data.data.login && to.name === 'login'):
                    next({name: 'home'})
                    break;

                default: next()
            }
        })
        .catch(err => console.log(err))
})

/**
 * Converts a string to a hex color
 * @param {string} string input string
 * @returns Color in hex
 */
function stringToColor(string)
{
    let hash = 0;

    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

// Global capitalize filter -- example: {{ value | capitalize }}
Vue.filter('capitalize', value => value.toUpperCase())

// Create the VUE instance
const app = new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

export default app;