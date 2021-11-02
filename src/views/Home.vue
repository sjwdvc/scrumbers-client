<template>
    <section>
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
import { SERVER } from "../constants";

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

<style scoped lang="scss">
@import "../../src/scss/main";

h1 {
    text-align: center;
}
.header {
    margin: 20px;
}
#create-room-button {
	margin-top: 2em;
}
</style>