<template>
	<section class="session" ref="session">
		<div class="container">
			<div class="interface" v-if="!session.started">
				<div class="waitingroom">

					<v-lottie-player name="cards" loop path="https://assets8.lottiefiles.com/private_files/lf30_klsv8ygt.json" height="100px" style="margin: 0 auto"/>
					<DisplayHeader content="Waiting..." class="waitingroom-header"/>

					<div class="waitingroom-users">
						<p class="user" v-for="user in users" :key="user.index" :class=" {'admin' : user.name === admin}">{{user.name}}</p>
					</div>

					<Button content="Start session" v-if="admin === name" @click.native="startSession"/>
				</div>
			</div>

			<div class="session-progress" v-if="session.started">
				<div class="session-progress-background"></div>
				<div class="session-progress-bar" v-bind:style="{ width: calculateWidth }"></div>
			</div>

			<div class="session-game flex" v-if="session.started">
				<div class="session-game-users">
					<p class="session-game-header">Users</p>
					<div class="session-game-users-user" v-for="user in users" :key="user.index" :class="user.status">
						{{user.name}}
					</div>
				</div>
				<div class="session-game-features">
					<p class="session-game-header">Feature</p>
					<h1 class="session-game-features-feature flex">
						{{session.feature.name}}
						<div class="session-game-features-feature-controls flex flex-row space-between">
							<span>{{ featuresIndex }}/{{ featuresLength }}</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" @click="$emit('toggleInfo')">
								<g id="Icon_feather-info" data-name="Icon feather-info" transform="translate(-1.5 -1.5)">
									<path id="Path_54" data-name="Path 54" d="M33,18A15,15,0,1,1,18,3,15,15,0,0,1,33,18Z" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
									<path id="Path_55" data-name="Path 55" d="M18,24V18" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
									<path id="Path_56" data-name="Path 56" d="M18,12h0" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
								</g>
							</svg>
						</div>
					</h1>
					<div class="session-game-features-cards">
						<div class="session-game-features-cards-card" v-for="(card, index) in session.cards" :data-card="card" @mouseenter="activeCard" @mouseleave="staticCard" @click="selectCard" :key="index">
							<p v-if="card !== 'coffee'">{{card}}</p>
							<img src="/img/coffee.svg" alt="" v-else>
						</div>
					</div>
					<div class="session-game-features-reason">
						<div class="relative">
							<TextArea name="description" placeholder="Explain your choice (max. 250 chars)" class="animate__animated" v-model="session.decision.desc" max="200" required/>
							<Button content="Submit" @click.native="submit" ref="submitbutton" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import {SOCKET, USER, CLIENT} from "../constants";
import store from "../store";
import Button from "../components/Button";
import DisplayHeader from "../components/text/DisplayHeader";
import TextArea from "../components/TextArea";

export default
{
	name : "Session",
	components :
	{
		TextArea,
		DisplayHeader,
		Button
	},
	data()
	{
		return {
			name 			: '',
			sessionId 		: this.$route.params.key,
			users 			: [],
			admin 			: false,
			featuresLength	: 0,
			featuresIndex	: 1,
			width			: 0,
			tooltip 		: 'More info',
			session 		: {
				status	: 'round1',
				started : false,
				cards 	: ['coffee', '0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100'],
				feature :
					{
						name	: '',
						desc	: ''
					},
				decision :
					{
						number	: 0,
						desc  	: ''
					}
			}
		}
	},
	mounted()
	{
		/**
		 * Join the session when you load the page and send the key from the url to define which session to join
		 */
		SOCKET.emit('session', {
			event	: 'join',
			key		: this.$route.params.key,
			name	: USER.name,
			email	: USER.email
		})

		/**
		 * Retrieves some session data from the socket server and sets client side variables
		 */
		SOCKET.on('joined', args => {
			this.admin 				= args.data.admin;
			this.name  				= USER.name;
			this.session.started 	= args.data.started;

			this.$toast.open({message: args.data.name + ' has joined the game', type: "success", position: "top-right"});

			this.refreshUserList(args.data);
		})

		/**
		 * Updates feature data in both Session.vue and App.vue when loading the page
		 */
		SOCKET.on('load', data => {
			this.$nextTick(() => {
				this.session.feature 	= data.data;

				if(data.toLoad !== 'waiting')
					this.$refs.submitbutton.enableButton();

				// Watch spelling if using elsewhere! Both singular and plural
				this.featuresIndex 		= data.data['featurePointer'];
				this.featuresLength 	= data.data['featuresLength'];

				this.refreshUserList(data.data);

				this.session.status = data.toLoad;

				// Emit session data to App.vue to update the config menu
				this.$emit('session:status', {status: data.toLoad});
				this.$emit('session:checklists', this.session.feature.checklists);
				this.$emit('session:description', this.session.feature.desc);

				switch(data.toLoad)
				{
					case 'round1':
						this.$emit('closeInfo');
						break;

					case 'round2':
						console.log('data : ')
						console.log(data)
						this.$emit('session:chat:update', data.chats);
						this.$emit('session:chat:votes', data.chats.votes);
						this.$emit('openInfo');
						break;
				}
			})
		})


		/**
		 * Sets the status of a client that has submitted to ready
		 */
		SOCKET.on('submit', data => {
			this.users.find(user => user.name === data.user).status = 'ready';
		});

		/**
		 * Activates the game for all clients in the waiting room when the admin starts the session
		 */
		SOCKET.on('started', data => {
			this.session.started = true;
			this.session.status = 'round1';
		});

		/**
		 * When the session cannot be found on the server, redirect to the 404 page
		 */
		SOCKET.on('undefinedSession', () => {
			this.$router.push(
				{
					name: 'Error',
					params:
						{
							message: "Oops.. This session can't be found. Please double check your URL or contact the room administrator"
						}
				}
			);
		});

		/**
		 * When a user left a session
		 */
		SOCKET.on('leftSession', args => {
			this.$toast.open({message: args.data.userLeft + ' has left the game', type: "warning", position: "top-right"});
			this.refreshUserList(args.data);
		});

		store.shareLink.url = this.link = CLIENT + '/session/' + this.$route.params.key;
		store.shareLink.show = true;
	},
	methods:
		{
			/**
			 * Sets the admin of the server
			 */
			defineAdmin()
			{
				return this.name === USER.admin;
			},

			/**
			 * Starts the session
			 */
			startSession()
			{
				this.$refs.session.classList.add('session-started');
				SOCKET.emit('session', {event: 'start', key: this.$route.params.key});
			},

			/**
			 * Adds the raised card styling class
			 */
			activeCard(e)
			{
				e.target.classList.add('active');
			},

			/**
			 * Mouse leave event for the card. removes the raised card styling class
			 */
			staticCard(e)
			{
				e.target.classList.remove('active');
			},

			/**
			 * Apply styling to the card and update the property
			 */
			selectCard(e)
			{
				document.querySelectorAll('.selected').forEach(selected => selected.classList.remove('selected'));
				this.session.decision.number = e.target.dataset.card;
				e.target.classList.add('selected');
			},

			/**
			 * Reset the cards and comment field
			 */
			resetChoices()
			{
				// Reset the session decisions from round 1
				document.querySelectorAll('.session-game-features-cards-card').forEach(card => {
					card.classList.remove('selected');
				})

				this.session.decision = { number: 0, desc  : '' };

				this.$emit('session:chat:clear');
			},

			/**
			 * Update the users and their status
			 */
			refreshUserList(d)
			{
				this.users 		= [];

				d.users.forEach(user => {

					console.log(user)

					this.users.push(
						{
							name: user.name,
							status: user.status
						})
				});
			},

			/**
			 * Fires when you click submit
			 * Adds some styling and sends the data to the server
			 */
			submit()
			{
				// Define textarea element for styling purposes
				let textbox = document.querySelector('textarea')

				if(this.session.decision.desc === "")
				{
					this.$toast.open({message: 'Please explain your decision in the field below', type: "error", position: "top-right"});

					// Some styling to announce an error in the textarea
					textbox.style.border = '2px solid #A03A3C';
					textbox.classList.add('animate__headShake');

					textbox.addEventListener('animationend', e => {
						e.currentTarget.classList.remove('animate__headShake')
					})
					return
				}
				// Remove textarea error styling
				textbox.style.border = 'none';
				textbox.classList.remove('animate__headShake');

				this.$refs.submitbutton.disableButton()

				// Reset players choices for the new feature
				if(this.session.status === "round2")
				{
					this.resetChoices()
					this.$emit('closeInfo')
				}


				SOCKET.emit('feature', {
					key  	: this.$route.params.key,
					event	: 'submit',
					number 	: this.session.decision.number,
					desc 	: this.session.decision.desc,
					email   : USER.email
				});


			}
		},
	computed:
		{	// Calculates the width for the progress bar
			calculateWidth: function () {
				let procent = 100/Number(this.featuresLength);
				let calculatedWidth = Number(procent)*Number(this.featuresIndex);

				if(calculatedWidth > 100)
					calculatedWidth = 100;

      			return calculatedWidth+"%";
    		}
		}
}
</script>