<template>
	<div class="chat animate__animated bounceIn" :class="{sender: currentSender}">
		<p class="chat-sender" :style="`color:` + senderColor">{{sender}}</p>
		<p class="chat-message">
			{{message}}
		</p>

	</div>
</template>

<script>
import {USER} from "../constants"
import tinyColor from "tinycolor2"

export default {
	name : "ChatMessage",
	props: {
		sender: String,
		message: String
	},
	data()
	{
		return {
			currentSender: false,
			senderColor: tinyColor(this.stringToColor(this.$props.sender)).isDark() ? '#D0BB7E' : this.stringToColor(this.$props.sender)
		}
	},
	mounted()
	{
		this.sender === USER.name ? this.currentSender = true : ''
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

<style scoped lang="scss">

	@import "../../src/scss/main";
	@import "../../node_modules/animate.css/animate.min.css";

	.chat{
		position: relative;
		padding: 10px;
		background-color: #3a3b3c;
		width: 50%;
		height: fit-content;
		border-radius: 10px;
		margin-bottom: 10px;
		&-sender{
			font-weight: bold;
		}
		&-message{
			font-size: 14px;
			color: $white;
		}
	}

	.sender{
		align-self: flex-end;
		.chat-message{
			text-align: right;
		}
	}
</style>