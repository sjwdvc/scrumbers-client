<template>
	<section class="createroom">
		<div class="interface">
			<DisplayHeader content="NIEUW BORD" />
			<form action="" class="createroom-form" @submit.prevent="generateRoom">
				<Input type="text" name="link" placeholder="Trello bord URL" v-model="url"/>
				<Button content="Genereer link"/>
			</form>
		</div>
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Button from "../components/Button";
import axios from 'axios';
import { CLIENT, SERVER, TRELLO_APP_KEY } from '../constants';
export default {
	name : "CreateRoom",
	components : {Button, Input, DisplayHeader},
	data(){
		return {
			url: ''
		}
	},
	beforeMount()
	{
		console.warn(window.location.search);
		// Check if a token was send
		if (location.hash != '')
		{
			let token = location.hash.replace('#token=', '');
			//location.hash = '';
			// Create a room with our token and link
			axios.post(SERVER + 'room', { token, url: window.location.search.replace('?url=', '') })
			.then(res => {
				if (res.status == 200)
					this.$router.push('share-link/' + res.data[0].id);
			});
		}
	},
	methods: {
		generateRoom()
		{
			console.log('room generated with url:' + this.url)
			// Ask for trello login
			location.replace(`https://trello.com/1/authorize?key=${TRELLO_APP_KEY}&name=Scrumbers&scope=read,write&expiration=1day&response_type=token&return_url=${CLIENT}/create-room?url=${this.url}`);
		}
	}
}
</script>

<style scoped lang="scss">
	section{
		width: 750px;
	}
	input{
		margin: 2rem 0;
	}
</style>