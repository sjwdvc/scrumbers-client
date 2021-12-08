<template>
	<div class="votespopup" :class="{'d-none' : !$parent.votes.visible}">
		<div class="interface">
			<DisplayHeader content="FEATURE RESULT" />
			<p id="feature">Feature</p>
			<p id="feature-name">{{ $parent.votes.feature }}</p>
			
			<br><br>
			
			<p>Number</p>
			<!-- Number icon -->
			<div id="number">
				<p>
					{{ $parent.votes.number || "-" }}
				</p>
			</div>
			
			<br><br>
			
			<p>Assigned to</p>
			<div id="assignee">
				<p>{{ $parent.votes.member || "" }}</p>
			</div>
			
			<div class="progress">
				<div class="progress-bar"></div>
			</div>
		</div>
	</div>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import EVENTBUS from '../eventbus';

export default {
	name: "VotesPopup",
	components: {
		DisplayHeader,
	},
	methods: {
		startTimer() {
			let timer = 1000;
			let interval = setInterval(() => {
				timer--;
				this.updateProgressBar(timer);
				
				if (timer <= 0)
				{
					this.$parent.votes.visible = false
					this.$parent.session.visible = true;
					clearInterval(interval);
				}
			}, 1);
		},
		
		updateProgressBar(time) {
			document.querySelector('.progress-bar').style.width = (time / 10) + "%";
		}
	},
	mounted()
	{
		EVENTBUS.$on('results', () => {
			this.startTimer();
			this.$parent.votes.visible = true;
			this.$parent.session.visible = false;
		})
	}
};
</script>