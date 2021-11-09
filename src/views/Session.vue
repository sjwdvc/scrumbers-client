<template>
	<section class="session" ref="session">
		<div class="container">
			<div class="interface" v-if="!session.started">
				<div class="waitingroom">

					<v-lottie-player name="cards" loop path="https://assets8.lottiefiles.com/private_files/lf30_klsv8ygt.json" height="100px" style="margin: 0 auto"/>
					<DisplayHeader content="Waiting..." />

					<div class="waitingroom-users">
						<p class="user" v-for="user in users" :key="user.index" :class=" {'admin' : user.name === admin}">{{user.name}}</p>
					</div>

					<Button content="Start session" v-if="admin === name" @click.native="startSession"/>
				</div>
			</div>

			<div class="session-progress" v-if="session.started">
				<div class="session-progress-background"></div>
				<div class="session-progress-bar"></div>
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
							<span>1/16</span>
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
							<TextArea name="description" placeholder="Explain your choice (max. 250 chars)" v-model="session.decision.desc" max="200"/>
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
	components : {
		TextArea,
		DisplayHeader,
		Button
	},
	data()
	{
		return {
			name : '',
			sessionId : this.$route.params.key,
			users : [],
			admin : false,
			session : {
				status: 'round1',
				started : false,
				cards : ['coffee', '0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100'],
				feature :
					{
						name: '',
						desc: ''
					},
				decision :
					{
						number: 0,
						desc  : ''
					}
			}
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
			this.admin 				= args.admin;
			this.name  				= USER.name;
			this.session.started 	= args.started;

			this.$toast.open({message: args.name + ' has joined the game', type: "success", position: "top-right"});

			this.refreshUserList(args);
		})

		SOCKET.on('load', data => {
			this.session.feature = data.data

			console.log(data)

			this.session.status = data.toLoad

			// Emit session data to App.vue to update the config menu
			this.$emit('session:status', {status: data.toLoad});
			this.$emit('session:checklists', this.session.feature.checklists);
			this.$emit('session:description', this.session.feature.desc);
		})


		SOCKET.emit('nextFeature');

		SOCKET.on('started', () => {
			this.session.started = true;
			this.session.status = 'round1';
		});

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

		SOCKET.on('leftSession', args => {
			this.$toast.open({message: args.userLeft + ' has left the game', type: "warning", position: "top-right"});
			this.refreshUserList(args);
		});

		store.shareLink.url = this.link = CLIENT + '/session/' + this.$route.params.key;
		store.shareLink.show = true;
	},
	methods:
		{
			defineAdmin()
			{
				return this.name === USER.admin;
			},
			startSession()
			{
				this.$refs.session.classList.add('session-started');
				SOCKET.emit('session', {event: 'start', key: this.$route.params.key});
			},
			activeCard(e)
			{
				e.target.classList.add('active');
			},
			staticCard(e)
			{
				e.target.classList.remove('active');
			},
			selectCard(e)
			{
				document.querySelectorAll('.selected').forEach(selected => selected.classList.remove('selected'));

				let sessionUser = this.users.find(user => user.name === this.name);

				if(sessionUser.status === 'waiting')
					sessionUser.status = 'ready';

				this.session.decision.number = e.target.dataset.card;

				// Send choice to server
				SOCKET.emit('cardSelection', {user: USER.email, choice: e.target.dataset.card});

				e.target.classList.add('selected');
			},
			refreshUserList(args)
			{
				this.users 		= [];
				args.users.forEach(user => {
					this.users.push(
						{
							name: user,
							status: 'waiting'
						})
				});
			},
			submit()
			{
				SOCKET.emit('feature', {
					key  	: this.$route.params.key,
					event	: 'submit',
					number 	: this.session.decision.number,
					desc 	: this.session.decision.desc
				});
			}
		}
}
</script>

<style scoped lang="scss">
@import "../../src/scss/main";

#app{
	overflow: scroll;
}

input {
	margin: 2rem 0;
}

h1 {
	margin-bottom: 25px;
}

.user {
	color: $white;
	width: 200px;
	margin: 0 auto;
}

.admin {
	&:before {
		content: "👑";
		width: 10px;
		height: 10px;
	}
}

.waitingroom {
	margin-bottom: 20px;
	&-header {
		color: $white;
	}
	&-users{
		padding: 25px 0;
	}
}

.session{

	&-progress{
		height: 10px;
		position: relative;
		margin: 20px auto;
		div{
			border-radius: 50px;
			height: 15px;
		}
		&-bar{
			width: 100px;
			background-color: $gold;
			position: absolute;
			left: 0;
			background-image: url('/img/progress.svg');
		}

		&-background{
			width: 100%;
			background-color: grey;
			position: absolute;
		}
	}



	&-started{
		position: relative;
		transform: none;
		top: 0;
		left: 0;
	}
	&-game{
		height: fit-content;
		min-height: 500px;
		&-header{
			font-size: 24px;
			border-bottom: 1px solid $white;
			color: $white;
			padding: 10px 0;
			margin-bottom: 50px;
		}
		&-users{
			width: 25%;
			margin-right: 50px;
			&-user{
				padding: 25px;
				margin: 25px 0;
				color: $white;
				background-color: $blue-light;
				border-radius: 10px;
				border: 1px solid rgba($white, 0.5);
				position: relative;
				font-size: 24px;
				&:after{
					content: '';
					position: absolute;
					right: 10px;
					top: 50%;
					width: 25px;
					height: 25px;
					transform: translateY(-50%);
					background-size: contain;
					background-repeat: no-repeat;
				}
			}

			.waiting:after{
				background-image: url('/img/waiting.svg');
			}

			.ready:after{
				background-image: url('/img/ready.svg');
			}
		}

		&-features{
			width: 75%;
			&-feature{
				border: 5px solid rgba($white, 0.5);
				background-color: $blue-light;
				border-radius: 10px;
				font-size: 30px;
				padding: 30px 100px 30px 25px;
				color: $white;
				position: relative;
				align-items: center;
				span{
					position: absolute;
					right: 10px;
					top: 50%;
					transform: translateY(-50%);
					color: $white;
					opacity: 0.5;
					font-weight: 100;
					font-size: 24px;
				}
				&-controls{
					margin-left: 15px;
				}
			}
			&-cards{
				display: inline-flex;
				align-items: center;
				overflow: scroll;
				max-width: 100%;
				padding: 20px 0;
				gap: 20px;
				overflow-y: hidden;

				&::-webkit-scrollbar {
					width:  10px;
					height: 10px;
					border-radius: 50px;
				}

				&::-webkit-scrollbar-thumb {
					background: $gold;
					border-radius: 50px;
				}

				&::-webkit-scrollbar-track {
					background: $blue-dark;
					border-radius: 50px;
				}

				// For Internet Explorer
				& {
					scrollbar-face-color: $gold;
					scrollbar-track-color: $blue-dark;
				}

				&-card{
					$inactive-card : darken($white, 25%);

					font-size: 42px;
					min-width: 75px;
					max-width: 75px;
					padding: 25px 0;
					color: $blue-dark;
					border-radius: 10px;
					font-weight: 900;
					background-color: $inactive-card;
					text-align: center;
					transition: 0.3s ease;
					cursor: pointer;
					border-bottom: 5px solid darken($inactive-card, 25%);

					p, img{
						pointer-events: none;
					}
				}
				.active, .selected{
					background-color: $white;
					border-bottom: 5px solid darken($white, 25%);
					transform: translateY(-10px);
					&:not(:first-child):not(:last-child){
						transform: translateY(-10px) rotate(5deg);
					}
				}
			}
			&-reason{
				margin-top: 25px;
				.relative{
					display: flex;
					flex-direction: row;
					align-items: flex-start;
					justify-content: space-between;
				}
				textarea{
					font-size: 24px;
					min-height: 200px;
					max-height: 200px;
					width: 80%;
					padding-right: 100px;
				}
			}
		}
	}


}

@keyframes scrollbg {
	from { background-position: 0 }
	to {background-position: 100% }
}
</style>

<style>

</style>