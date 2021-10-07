<template>
	<section class="createroom">
		<div class="interface">
			<DisplayHeader content="NIEUW BORD" />
			<form action="" class="createroom-form" @submit.prevent="generateRoom">
				<Label for="url" content="Trello URL" />
				<Input id="url" type="text" name="link" placeholder="bijv. https://trello.com/b/12345678/project-naam" v-model="url"/>
				<p class="error">{{error}}</p>
				<Button content="Genereer link"/>
			</form>
		</div>
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Label from "../components/Label";
import Button from "../components/Button";
import {SOCKET, USER} from "../constants";

import axios from "axios";
import Vue from "vue";

export default {
	name : "CreateRoom",
	components : {Button, Input, DisplayHeader, Label},
	data(){
		return {
			url: '',
			name: '',
			error: ''
		}
	},
	methods: {
		generateRoom()
		{
			SOCKET.emit('session', {event: 'create', name: USER.name, email: USER.email})
			SOCKET.on('createRoom', data => {
				console.log(data)
				this.$router.push({name: 'sharelink', params: {key: data.key}})
			})
		}
	},
	mounted()
	{
		console.log(USER)
	}
}
</script>

<style scoped lang="scss">
	section{
		width: 750px;
	}
	input{
		margin: 10px 0;
	}

	form{
		margin: 2rem 0 0 0;
	}

	button{
		margin-top: 2rem;
	}
</style>