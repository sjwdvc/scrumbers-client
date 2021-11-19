<template>
    <div class="votespopup">
        <div class="interface">
            <DisplayHeader content="VOTES" />

            
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
    },
    components: {
        DisplayHeader,
    },
};
</script>

<style>
.votespopup {
    z-index: 100;
    position: absolute;
    top: 10%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
</style>