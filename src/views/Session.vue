<template>
	<section class="session">
		<div class="interface">
			<p class="user" v-for="user in users" :key="user" :class=" user === admin ? 'admin' : ''">{{user}}</p>
		</div>
	</section>
</template>

<script>
import {SOCKET, USER} from "../constants";

export default {
	name : "Session",
	components : {},
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

		SOCKET.emit('session', {event: 'join', key: parseInt(this.$route.params.key), name: USER.name, email: USER.email})

		SOCKET.on('joined', args => {

			console.log(args.name, args.admin, args.event)

			this.users = args.users
			this.admin = args.admin
		})
	}
}
</script>

<style scoped lang="scss">

	@import "../../src/scss/main";

	input{
		margin: 2rem 0;
	}

	.user{
		color: $white;
		width: 200px;
		&:first-child{
			&:before{
				content: "👑";
				width: 10px;
				height: 10px;
			}
		}
	}
</style>