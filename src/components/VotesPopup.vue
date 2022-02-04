<template>
    <div class="votespopup" :class="{ 'd-none': !$parent.votes.visible }">
        <div class="interface">
            <DisplayHeader content="FEATURE RESULT" />
            <button v-on:click="dismissVotesPopup" id="dismissButton">
                <svg
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <p id="feature">Feature</p>
            <p id="feature-name">{{ $parent.votes.feature }}</p>

            <br /><br />

            <p>Number</p>
            <!-- Number icon -->
            <div id="number">
                <p>
                    {{ $parent.votes.number || "-" }}
                </p>
            </div>

            <br /><br />

            <p>Assigned to</p>
            <div id="assignee">
	            
                <p v-if=" $parent.votes.member !== -1">{{ $parent.votes.member || "" }}</p>
	            <p v-else>None</p>
            </div>

            <div class="progress">
                <div class="progress-bar"></div>
            </div>
        </div>
    </div>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import EVENTBUS from "../eventbus";

export default {
    name: "VotesPopup",
    components: {
        DisplayHeader,
    },
    data() {
        return {
            interval: null,
        }
    },
    methods: {
        startTimer() {
	        
            let timer = 1000;
            
            this.interval = setInterval(() => {
                timer--;

                this.updateProgressBar(timer);

                if (timer <= 0) {
                    clearInterval(this.interval);
                    this.updateProgressBar(1000);
                    this.$parent.votes.visible = false;
                    this.$parent.session.visible = true;
                }
            }, 60);
        },

        updateProgressBar(time) {
            document.querySelector(".progress-bar").style.width =
                time / 10 + "%";
        },

		dismissVotesPopup() {
            clearInterval(this.interval);
			this.$parent.votes.visible = false;
			this.$parent.session.visible = true;
			this.$parent.toggle.visible = true;
		}
    },
    mounted() {
        EVENTBUS.$on("results", () => {
            this.startTimer();
            this.updateProgressBar(1000);
            
            this.$parent.votes.visible = true;
            this.$parent.session.visible = false;
            this.$parent.choice.visible = false;
            this.$parent.toggle.visible = false;
        });
    },
};
</script>