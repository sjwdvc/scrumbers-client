import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import axios from "axios";

Vue.use(Router);

const getLogin = () => axios.get(Vue.prototype.$server + 'logged-in').then(res => res.data.login)

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: () => getLogin ? import("./views/Home.vue") : import("./views/Login.vue")
    },
    {
      path: "/register",
      component: Register
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/about",
      component: () => import("./views/About.vue")
    }
  ]
});
