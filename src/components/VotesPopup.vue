<template>
    <div class="votespopup">
        <div class="interface">
            <DisplayHeader content="FEATURE RESULT" />
            <p id="feature">Feature</p>
            <p id="feature-name">{{ feature.name }}</p>
            <br><br>
            <p>Number</p>

        </div>
    </div>
</template>

<script>
import { SOCKET, USER, CLIENT } from "../constants";
import store from "../store";
import DisplayHeader from "../components/text/DisplayHeader";

export default {
    name: "VotesPopup",
    props: {
        votes: Array,
        feature: Array,
    },
    components: {
        DisplayHeader,
    },
};
</script>

<style scoped>
h1 {
    text-align: center;
}
p {
    font-size: 20px;
    color: white;
}
.votespopup {
    z-index: 100;
    position: absolute;
    top: 10%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 90%;
}

#feature-name {
    font-size: 24px;
    font-weight: bold;
}
</style>