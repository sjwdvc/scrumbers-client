import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import Register from "./views/Register";


Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/register",
            component: Register
        },
        {
            path: "/about",
            component: () => import("./views/About.vue")
        }
    ]
});
