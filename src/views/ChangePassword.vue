<template>
    <section class="changepassword">
        <div class="interface">
            <router-link
                to="/profile"
                id="backButton"
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
            <DisplayHeader class="header" content="CHANGE PASSWORD" />
            <form action="" class="profile-form" @submit.prevent="submitData">
                <label for="name">Type a new password :</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    ref="password"
                    required
                />

                <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    ref="confirmPassword"
                    required
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
    name: "Profile",
    components: {
        DisplayHeader,
        Button,
    },
    data() {
        return {
            profile: {},
            featureData: {},
            form: {
                name: "",
                age: "",
            },
            error: "",
            chatround: true,
            spinner: {},
        };
    },
};
</script>

<style>
</style>