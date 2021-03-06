// Global imports
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import check from './middleware/auth'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import VueLottiePlayer from "vue-lottie-player";
import {SOCKET, TOKEN, USER} from "./constants"
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
router.beforeEach(function (to, from, next) {

    if (from.name === 'session') {
        document.querySelector('main').classList.remove("info", "menu")
        SOCKET.emit('session', {
            event: 'leave',
            email: USER.email,
            name: USER.name,
            key: from.path.replace('/session/', '')
        })
    }
    
    check()
        .then(data => {
            Vue.prototype.login = !!data.data.login

            if (data.data.login) {
                USER.name = data.data.name;
                USER.email = data.data.email;
            }
            
            switch (true) {
                // If user should update their password, route them to /changepassword
                case (data.data.login && data.data.resetPassword === true && (to.name !== 'changepassword')):
                    Vue.$toast.open({
                        message: "<h1>Please change your password</h1><p>Your password has expired</p>",
                        type: "error",
                        position: "top-right",
                        duration: 10000
                    });
                    next({name: 'changepassword'});
                    break;

                // If user is not logged in, and next route is not login or register
                case (!data.data.login && to.name !== 'login' && to.name !== 'register' && to.name !== 'passwordreset'):
                    to.name === 'session' ? next({name: 'login', params: {key: to.params.key}}) : next({name: 'login'});
                    break;

                // If user logged in and trying to access login screen
                case (data.data.login && to.name === 'login'):
                    next({name: 'home'});
                    break;

                default:
                    next()
            }
            // Reload page to toggle the history popup
            if (from.name == 'openhistory' && to.name == 'profile' || from.name == 'profile' && to.name == "openhistory") {
                window.location.reload();
            }
        })
        .catch(err => console.log(err))
})

// Global capitalize filter -- example: {{ value | capitalize }}
Vue.filter('capitalize', value => value.toUpperCase())

// Dismiss safari notice
document.querySelector('.dismiss-safari-notice').addEventListener("click", () => {
    document.querySelector('body').classList.remove("safari")
})

// Create the VUE instance
const app = new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

export default app;