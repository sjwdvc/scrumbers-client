<template>
	<section class="session">
		<div class="interface">
			<p class="user" v-for="user in users" :key="user" :class=" user === admin ? 'admin' : ''">{{user}}</p>
		</div>
	</section>
</template>

<script>
import {SOCKET, USER, CLIENT} from "../constants";
import store from "../store";

export default
{
	name : "Session",
	data()
	{
		return {
			name 		: '',
			sessionId 	: null,
			users 		: null,
			admin 		: ''
		}
	},
	mounted()
	{
		// Join the session when you load the page and send the key from the url to define which session to join
		SOCKET.emit('session', {
			event: 'join',
			key: parseInt(this.$route.params.key),
			name: USER.name,
			email: USER.email
		})

		// Define the session users and admin
		SOCKET.on('joined', args => {
			this.users = args.users
			this.admin = args.admin
		})

		store.shareLink.url = this.link = CLIENT + '/session/' + this.$route.params.key
		store.shareLink.show = true;
	}
}
</script>

<style scoped lang="scss">
	@import "../../src/scss/main";

	input
	{
		margin: 2rem 0;
	}

	.user
	{
		color: $white;
		width: 200px;
		&:first-child
		{
			&:before
			{
				content: "👑";
				width: 10px;
				height: 10px;
			}
		}
	}
</style>