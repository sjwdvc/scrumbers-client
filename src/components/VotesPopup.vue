<template>
    <div class="votespopup">
        <div class="interface">
            <DisplayHeader content="FEATURE RESULT" />
            <p id="feature">Feature</p>
            <p id="feature-name">{{ feature.name }}</p>

            <br /><br />

            <p>Number</p>
            <!-- Number icon -->
            <div id="number">
                <p>
                    {{ feature.number || "5" }}
                </p>
            </div>

            <br /><br />

            <p>Assigned to</p>
            <div id="assignee">
                <p>{{ feature.assignee || "Assignee name" }}</p>
            </div>
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
    font-weight: lighter;
}
.votespopup {
    z-index: 100;
    position: absolute;
    top: 30%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 90%;
}

#feature-name {
    font-size: 24px;
    font-weight: bold;
}

#number {
    border-radius: 10px;
    background-color: white;
    height: 10em;
    width: 10em;
    margin: 10px auto;
    display: flex;
    align-items: center; /* Vertical center alignment */
    justify-content: center; /* Horizontal center alignment */
}
#number p {
    color: black;
    font-size: 5em;
}

#assignee {
    border-radius: 10px;
    background-color: rgba(53, 52, 52, 0.349);
    height: 5em;
    width: 20em;
    margin: 10px auto;
    display: flex;
    align-items: center; /* Vertical center alignment */
    justify-content: center; /* Horizontal center alignment */
}
</style>