<template>
	<section class="createroom">
		<div class="interface createroom-wrapper">
			<DisplayHeader content="NEW SESSION" />
			<div class="flex">
				<div class="createroom-left">
					<form action="" class="createroom-form">
						<Label for="url" content="Trello URL" />
						<Input id="url" type="text" name="link" placeholder="eg. https://trello.com/b/12345678/project-name" v-model="url" ref="url" @change="urlChanged"/>
						
						<Label for="board" content="Select board" />
						<Select id="board" name="selectedBoard" :options="selectedBoard" @updateSelect="updateBoard"/>
						
						<Label for="rules" content="Admin rules" />
						<Select id="rules" name="adminRules" :options="adminRules" @updateSelect="updateSelect" />
						
						<Label for="coffee" content="Coffee Timeout Length" />
						<Input id="coffee" value="coffee-timeout" type="number" placeholder="Coffee-timeout minutes" v-model="coffee" ref="coffeeinput"/>
						
						<p class="error">{{error}}</p>
					</form>
				</div>
				<div class="createroom-right">
					<div class="flex space-between mb-25">
						<h3>Card templates</h3>
						<svg xmlns="http://www.w3.org/2000/svg" width="64.398" height="64.398" viewBox="0 0 64.398 64.398" class="createroom-right-add" @click="toggleTemplate">
							<path id="Icon_awesome-plus-square" data-name="Icon awesome-plus-square" d="M57.5,2.25H6.9A6.9,6.9,0,0,0,0,9.15v50.6a6.9,6.9,0,0,0,6.9,6.9H57.5a6.9,6.9,0,0,0,6.9-6.9V9.15A6.9,6.9,0,0,0,57.5,2.25ZM52.9,38.474A1.73,1.73,0,0,1,51.174,40.2H37.949V53.424a1.73,1.73,0,0,1-1.725,1.725h-8.05a1.73,1.73,0,0,1-1.725-1.725V40.2H13.225A1.73,1.73,0,0,1,11.5,38.474v-8.05A1.73,1.73,0,0,1,13.225,28.7H26.449V15.475a1.73,1.73,0,0,1,1.725-1.725h8.05a1.73,1.73,0,0,1,1.725,1.725V28.7H51.174A1.73,1.73,0,0,1,52.9,30.424Z" transform="translate(0 -2.25)" fill="#d0bb7e"/>
						</svg>
					
					</div>
					
					<div class="createroom-templates">
						<CardTemplates :data="cardTemplates" @selectTemplate="selectTemplate"/>
						<p v-if="cardTemplates.length === 0" class="text-white">No templates found yet. Create one by clicking +</p>
					</div>
				</div>
			</div>
			<Button content="Generate link" @click.native="generateRoom"/>
		</div>
		
		<CreateTemplate />
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Label from "../components/Label";
import Button from "../components/Button";
import Select from "../components/Select";
import {CLIENT, SOCKET, USER} from "../constants";
import CardTemplates from "../components/CardTemplates"
import CreateTemplate from "../components/CreateTemplate"
import EVENTBUS from "../eventbus"

export default
{
	name : "CreateRoom",
	components :
	{
		CreateTemplate,
		CardTemplates,
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
			coffee: '',
			name: '',
			token: '',
			error: '',
			settings : {
				assignMethod : 'admin',
				board : 'backlog'
			},
			adminRules: [
                {
                    content: 'Admin decides',
                    value: 'admin'
                },
				{
					content: 'Lowest number',
					value: 'lowest'
				},
				{
					content: 'Most common',
					value: 'mostcommon'
				}
			],
			selectedBoard: [
				{
					content: 'Please enter your trello URL first',
					value: 'backlog'
				},
			],
			cardTemplates       : [],
			selectedTemplate    : []
		}
	},
	beforeMount()
	{
		// Check if we authenticated with trello or not
		let storedToken = localStorage.getItem('OAUTH_TOKEN');
		let hasExpired = storedToken == null ? true : (parseInt(storedToken.split('@')[0]) < Date.now());

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
			if(this.selectedTemplate.length === 0)
			{
				this.$toast.open({message: "Please select a card template", type: "error", position: "top-right"});
			}
			else if(this.coffee <= 0)
			{
				this.$toast.open({message: "Coffee timeout cannot be zero or negative", type: "error", position: "top-right"});
				this.coffee = ""
				
			}
			else
			{
				SOCKET.emit('session', {
					url             : this.url,
					coffee          : this.coffee,
					event           : 'create',
					name            : USER.name,
					email           : USER.email,
					token           : this.token,
					settings        : this.settings,
					cardtemplate    : this.selectedTemplate
				});
			}
		},
		updateSelect(value)
		{
			this.settings.assignMethod = value;
		},
		
		urlChanged(value)
		{
			SOCKET.emit('session', {
				event : 'checkURL',
				url   : value,
				token : this.token
			})
		},
		
		updateBoard(value)
		{
			this.settings.board = value
		},
		
		selectTemplate(value)
		{
			this.selectedTemplate = value.split(',')
		},
		
		toggleTemplate()
		{
			document.querySelector('.createroom').classList.add('addtemplate')
		}
		
	},
	mounted()
	{
		SOCKET.on('urlError', args => {
			this.error = args.error;
			url.style.border = '2px solid #A03A3C';
		})
		
		SOCKET.on('createRoom', data => {
			this.$router.push({name: 'sharelink', params: {key: data.key}});
		})
		
		SOCKET.on('checkURL', data => {
			this.selectedBoard = data
			this.settings.board = data[0].value
		})
		
		SOCKET.emit('templates', {event: 'load', email : USER.email})
		
		SOCKET.on('templates:load', data => {
			this.cardTemplates = data
		})
		
		EVENTBUS.$on('templates:reload', () => SOCKET.emit('templates', {event: 'load', email : USER.email}))
	}
}
</script>