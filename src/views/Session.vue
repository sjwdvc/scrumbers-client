<template>
	<section class="session">
		<div class="interface" v-if="!joined">
			<DisplayHeader content="Welkom" />
			<Input type="text" name="username" placeholder="Gebruikersnaam" ref="username" required="required" v-model="name"/>
			<div @click="setUserName">
				<Button content="Beginnen >"/>
			</div>
		</div>
		<div class="interface" v-if="joined">
			<p class="user" v-for="user in users" :key="user">{{user}}</p>
		</div>
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Button from "../components/Button";
import {SOCKET} from "../constants";

export default {
	name : "Session",
	components : {Button, Input, DisplayHeader},
	data() {
		return {
			joined  	: false,
			name 		: '',
			sessionId 	: null,
			users 		: null
		}
	},
	methods: {
		setUserName()
		{
			this.name = this.$refs.username.value
			this.joined = true

			SOCKET.emit('session', {event: 'join', key: parseInt(this.$route.params.key), username: this.name})


			SOCKET.on('session', args => {
				if(args.event === 'join') {
					this.users = args.users
				}
			})
		}
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
		&:first-child{
			&:before{
				content: "👑";
				width: 10px;
				height: 10px;
			}
		}
	}
</style>