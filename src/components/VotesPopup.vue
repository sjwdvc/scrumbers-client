<template>
	<div v-if="showVotesPopup" class="votespopup">
		<div class="interface">
			<DisplayHeader content="FEATURE RESULT" />
			<p id="feature">Feature</p>
			<p id="feature-name">{{ data.feature.name }}</p>
			
			<br /><br />
			
			<p>Number</p>
			<!-- Number icon -->
			<div id="number">
				<p>
					{{ data.number || "-" }}
				</p>
			</div>
			
			<br /><br />
			
			<p>Assigned to</p>
			<div id="assignee">
				<p>{{ data.member || "" }}</p>
			</div>
			
			<div id="progress">
				<div ref="progbar" id="bar">
				</div>
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
	components: {
		DisplayHeader,
	},
	data() {
		return {
			data: {},
			showVotesPopup: false,
			time: 1000,
		};
	},
	mounted() {
		this.$on("showVotesPopup", (data) => {
			this.data = data;
			this.$forceUpdate();
			this.$nextTick(() => {
				this.startTimer();
				this.showVotesPopup = true;
			});
		});
	},
	methods: {
		startTimer: function () {
			let timer = this.time;
			let interval = setInterval(() => {
				timer--;
				this.updateProgressBar(timer);
				if (timer <= 0) {
					this.showVotesPopup = false;
					clearInterval(interval);
				}
			}, 1);
		},
		updateProgressBar: function (time) {
			this.$refs.progbar.style.width = (time / 10) + "%";
		}
	},
};
</script>