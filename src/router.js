import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import CreateRoom from "./views/CreateRoom";
import ShareLink from "./views/ShareLink";
import Session from "./views/Session";
import Profile from "./views/Profile";
import ChangePassword from "./views/ChangePassword";
import Error from "./views/Error";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: 'home',
            component: Home
        },
        {
            path: "/register",
            component: Register,
            name: 'register'
        },
        {
            path: "/login/:key?",
            component: Login,
            name: 'login'
        },
        {
            path: "/create-room",
            component: CreateRoom,
            name: 'createroom'
        },
        {
            path: "/share-link/:key",
            component: ShareLink,
            name: 'sharelink'
        },
        {
            path: "/session/:key",
            component: Session,
            name: 'session'
        },
        {
            path: "/profile",
            component: Profile,
            name: 'profile'
        },
        {
            path: "/changepassword",
            component: ChangePassword,
            name: 'changepassword'
        },
        {
            path: "/error",
            component: Error,
            name: 'Error',
            props: {
                message: String
            }
        },
    ]
});
