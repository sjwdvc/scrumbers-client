<template>
    <section class="home">
        <div class="interface">
            <DisplayHeader content="Welcome to Scrumbers!" />
            <Button @click.native="$router.push('create-room')" id="create-room-button" content="Click here to create a room" />
        </div>
    </section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Button from "../components/Button";
import axios from "axios";
import { SERVER, USER } from "../constants";

export default {
    name: "Home",
    components: { DisplayHeader, Button },
    methods: {
        logout() {
            axios.post(SERVER + "session/logout");
            this.$router.go();
        },
    },
};
</script>