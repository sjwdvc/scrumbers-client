<template>
	<div class="chat animate__animated animate__bounceIn" :class="{sender: currentSender}">
		<p class="chat-sender" :style="`color:` + senderColor">{{sender}}</p>
		<p class="chat-message">
			{{message}}
		</p>
		<p class="chat-vote">{{voteData}}</p>
	</div>
</template>

<script>
import {USER} from "../constants"
import tinyColor from "tinycolor2"

export default {
	name : "ChatMessage",
	props: {
		sender	: String,
		message	: String,
		vote	: Number
	},
	data()
	{
		return {
			currentSender: false,
			senderColor: tinyColor(this.stringToColor(this.$props.sender)).isDark() ? '#D0BB7E' : this.stringToColor(this.$props.sender),
			voteData : 0
		}
	},
	mounted()
	{
		this.sender === USER.name ? this.currentSender = true : '';

		// Quick fix coffee card
		this.voteData = this.$props.vote
		this.voteData === -1 ? this.voteData = "☕" : ''
	},
	methods :
	{
		stringToColor(str) {
			let hash = 0;

			for (let i = 0; i < str.length; i++) {
				hash = str.charCodeAt(i) + ((hash << 5) - hash);
			}

			var colour = '#';
			for (let i = 0; i < 3; i++) {
				let value = (hash >> (i * 8)) & 0xFF;
				colour += ('00' + value.toString(16)).substr(-2);
			}
			return colour;
		}
	}
}
</script>