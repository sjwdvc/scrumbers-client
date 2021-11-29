<template>
    <div class="choicepopup">
        <div class="interface">
            <DisplayHeader content="ASSIGN USER" />
            <p id="feature-name">{{ feature.name }}</p>
            <br><br>
            <Select id="choice-selector" name="choices" :options="choices" @updateSelect="updateSelect" />
            <Button @click.native="submit()" content="Assign"/>
        </div>
    </div>
</template>

<script>
import { SOCKET, USER, CLIENT } from "../constants";
import store from "../store";
import DisplayHeader from "./text/DisplayHeader.vue";
import Select from "./Select.vue";
import Button from "./Button.vue";

export default {
    name: "ChoicePopup",
    data() {
        return {
            choice: null
        };
    },
    props: {
        /**
         * @type {Array.<{content: String, value: String}>}
         */
        choices: Array,
        feature: Object,
    },
    components: {
        DisplayHeader,
        Select,
        Button
    },
    methods: {
		updateSelect(value)
		{
            console.log(value);
            this.choice = value;
		},
        submit()
        {
            this.$emit("choiceSubmit", this.choice || this.choices[0].value);
        }
	}
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
.choicepopup {
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