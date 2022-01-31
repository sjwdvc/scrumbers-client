<template>
    <section class="passwordreset">
        <div class="interface">
            <router-link to="/login" id="backButton"
                ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M19 12H6M12 5l-7 7 7 7" />
                </svg>
            </router-link>
            <DisplayHeader class="header" content="PASSWORD RESET" />

            <form
                v-if="token === ''"
                action=""
                class="profile-form"
                @submit.prevent="requestReset"
            >
                <label for="name">Enter your e-mail address</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@scrumbers.com"
                    ref="email"
                    required
                    v-model="email"
                />

                <div v-if="this.spinner === true" class="loader"></div>

                <p class="error">{{ this.error }}</p>

                <div class="flex space-between">
                    <Button
                        type="submit"
                        content="Request password reset"
                        ref="changepassbutton"
                    />
                </div>
            </form>

            <form
                v-else
                action=""
                class="profile-form"
                @submit.prevent="resetPassword"
            >
                <label for="name">Type a new password :</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    ref="password"
                    required
                    v-model="form.password"
                />

                <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    ref="confirmPassword"
                    required
                    v-model="form.confirmpassword"
                />

                <div v-if="this.spinner === true" class="loader"></div>

                <p class="error">{{ this.error }}</p>

                <div class="flex space-between">
                    <Button
                        type="submit"
                        content="Change password"
                        ref="changepassbutton"
                    />
                </div>
            </form>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import { SERVER, SOCKET, TOKEN, USER } from "../constants";
import Button from "../components/Button";
import DisplayHeader from "../components/text/DisplayHeader";

export default {
    name: "PasswordReset",
    components: {
        DisplayHeader,
        Button,
    },
    data() {
        return {
            token: "",
            profile: {},
            featureData: {},
            form: {
                password: "",
                confirmpassword: "",
            },
            email: "",
            error: "",
            chatround: true,
            spinner: {},
        };
    },
    methods: {
        requestReset() {
            if (this.email) {
                axios
                    .post(SERVER + "user/requestResetPassword", {
                        email: this.email,
                    })
                    .then((res) => {
                        if (res.data.error !== "" && res.data.error !== undefined) {
                            this.error = res.data.error;
                        } else if (res.data.status === true) {
                            this.$toast.open({
                                message:
                                    "An email has been sent to your email address",
                                type: "success",
                                position: "top-right",
                                duration: 10000,
                            });
                            this.$router.push('login');
                        }
                    });
            }
        },

        resetPassword() {
            if (this.form.password === this.form.confirmpassword) {
                axios
                    .post(SERVER + "user/resetPassword", {
                        password: this.form.password,
                        token: this.token,
                    })
                    .then((res) => {
                        if (res.data.error !== "" && res.data.error !== undefined) {
                            this.error = res.data.error;
                        } else if (res.data.status === true) {
                            this.$toast.open({
                                message:
                                    "Password has been changed",
                                type: "success",
                                position: "top-right",
                                duration: 10000,
                            });
                            this.$router.push('login');
                        }
                    });
            } else {
                this.error = "Confirmation needs to be the same";
            }
        },
    },
    mounted() {
        // get the reset token from get parameters
        if (location.hash !== "") {
            this.token = location.hash.substring(1);
            // Remove the hash(token) for security
            history.pushState("", document.title, window.location.pathname);
        }
    },
};
</script>

<style>
</style>