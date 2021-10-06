<template>
	<section class="createroom">
		<div class="interface">
			<DisplayHeader content="NIEUW BORD" />
			<form action="" class="createroom-form" @submit.prevent="generateRoom">
				<Label for="url" content="Trello URL" />
				<Input id="url" type="text" name="link" placeholder="bijv. https://trello.com/b/12345678/project-naam" v-model="url"/>

				<Input type="text" name="name" placeholder="Naam (admin )" v-model="name"/>

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
import {SOCKET} from "../constants";

import axios from "axios";

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

			SOCKET.emit('session', {url: this.url, event: 'create', username: this.name})
			SOCKET.on('createRoom', data => {
				console.log(data)
				this.$router.push({name: 'sharelink', params: {key: data.key}})
			})
		},
		returnTrello()
		{
			this.error 	= ''
			let url 	= this.url.split('/')

			if(url.length < 6)
			{
				this.error = 'Oei, er ging iets mis... controleer de link'
			} else
			{
				fetch(`https://api.trello.com/1/boards/${url[4]}/lists?key=0d29aa35fc09e28d1ee2e016e20d3bca&token=d8d8392236b1f26fd8a75c27ee75121612961d5e4b5bccafa9a07c0429e101b3`, {
					method: 'GET',
					headers: {
						'Accept': 'application/json'
					}
				})
					.then(response => response.json())
					.then(text => console.log(text))
					.catch(err => console.error(err));
			}
		}
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