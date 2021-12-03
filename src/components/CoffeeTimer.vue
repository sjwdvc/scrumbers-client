<template>
	<div class="coffeetimer" v-if="timer">
		<h2>Coffee Time-out</h2>
		
		<v-lottie-player name="cards" loop path="https://assets10.lottiefiles.com/packages/lf20_abebennx.json" height="150px" style="margin: 0 auto" class="lottie"/>
		
		<div class="content">
			<p>Time left:</p>
			<p class="time">{{ minutes }}:{{ seconds }}</p>
		</div>
	</div>
</template>

<script>
import {SOCKET} from "../constants"

export default {
	name : "CoffeeTimer",
	data()
	{
		return {
			timer   : false,
			seconds : 0,
			minutes : 0
		}
	},
	methods :
	{
	
	},
	mounted()
	{
		

		
		/**
		 * Refresh time on coffee timeout timer
		 */
		SOCKET.on("sendTime", data => {
			
			// Hide the game window during timer
			document.querySelector('.session-game').classList.add('d-none');
			
			this.timer = !(data.seconds == 0 && data.minutes == 0);
			
			// View the game again after timer ends
			this.timer ? '' : document.querySelector('.session-game').classList.remove('d-none')
			
			this.minutes = data.minutes;
			this.seconds = data.seconds;
		});
	}
}
</script>