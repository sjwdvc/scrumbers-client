<template>
	<section class="createroom">
		<div class="interface">
			<DisplayHeader content="NEW SESSION" />
			<form action="" class="createroom-form" @submit.prevent="generateRoom">
				<Label for="url" content="Trello URL" />
				<Input id="url" type="text" name="link" placeholder="eg. https://trello.com/b/12345678/project-name" v-model="url" ref="url"/>

				<Label for="coffee" content="Coffee Timeout Length" />
				<Input id="coffee" value="coffee-timeout" type="number" placeholder="Coffee-timeout minutes" />

				<Label for="rules" content="Admin rules" />
				<Select id="rules" name="adminRules" :options="adminRules" />

				<p class="error">{{error}}</p>
				<Button content="Generate link"/>
			</form>
		</div>
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Label from "../components/Label";
import Button from "../components/Button";
import Select from "../components/Select";
import {CLIENT, SOCKET, USER} from "../constants";

export default
{
	name : "CreateRoom",
	components :
	{
		Button,
		Input,
		DisplayHeader,
		Label,
		Select
	},
	data()
	{
		return {
			url: '',
			name: '',
			token: '',
			error: '',
			adminRules: [
				{
					content: 'Lowest number',
					value: 'lowest'
				},
				{
					content: 'Most common',
					value: 'mostcommon'
				},
				{
					content: 'Admin decides',
					value: 'admin'
				},
			]
		}
	},
	beforeMount()
	{
		// Check if we authenticated with trello or not
		let storedToken = localStorage.getItem('OAUTH_TOKEN');
		let hasExpired = storedToken == null ? true : (parseInt(storedToken.split('@')[0]) < Date.now());
		if (storedToken) 								console.log(storedToken.split('@'));

		if (!location.hash.startsWith('#token=') && hasExpired)
			location.replace(`https://trello.com/1/authorize?key=c6f2658e8bbe5ac486d18c13e49f1abb&name=Scrumbers&scope=read,write&expiration=1day&response_type=token&return_url=${CLIENT}/create-room`);
		else if (location.hash.startsWith('#token='))
		{
			// Get the token
			this.token = location.hash.replace('#token=', '');
			// Check if there is an error (when you reject the oAuth)
			if (this.token.startsWith('&error'))
			{
				this.$router.push({name : 'home'});
			}
			else
			{
				// Set the token in local storage so we can remember it
				// TODO:
				// Use httpOnly cookies for security
				let expire = Date.now() + (3600 * 1000 * 24);
				localStorage.setItem('OAUTH_TOKEN', expire + '@' + this.token);

				// Remove the hash(token) for security
				history.pushState("", document.title, window.location.pathname);
			}
		}
		else
		{
			this.token = storedToken.split('@')[1];
		}
	},
	methods:
	{
		generateRoom()
		{
			SOCKET.emit('session', {url: this.url, event: 'create', name: USER.name, email: USER.email, token: this.token});

			SOCKET.on('urlError', args => {
				this.error = args.error;
				url.style.border = '2px solid #A03A3C';
			})

			SOCKET.on('createRoom', data => {
				this.$router.push({name: 'sharelink', params: {key: data.key}});
			})
		}
	}
}
</script>