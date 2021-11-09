<template>
	<main :class="{'menu': menu, 'info': info}">
		<nav class="menu-content">
			<ul>
				<li v-for="(link, index) in menuLinks" :key="index" @click="menuOpen = false"><router-link :to="{name: link.link}"><img :src="'/img/' + link.icon + '.svg'" alt="">{{ link.text }}</router-link></li>
			</ul>
			<div class="flex flex-col space-between button-container">
				<Button content="Leave session" @click.native="leaveSession" v-if="currentComponent() === 'session'"/>
				<Button content="Logout" @click.native="logout"/>
			</div>
		</nav>
		<div class="info-content">
			<div class="info-content-feature" v-if="sessionStatus === 'round1'">
				<h2>Description</h2>
				<div class="info-content-feature-description">
					{{ description }}
				</div>

				<h2>Checklists</h2>
				<div class="info-content-feature-checklists">
					<div class="info-content-feature-checklists-checklist" v-for="(list, index) in checklists" :key="index" :class="{'checklist-open': list.open}" @click="openChecklist(index)">
						<div class="checklist-header">
							<h3>{{list.name}}</h3>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<g id="Icon_feather-plus" data-name="Icon feather-plus" transform="translate(-6 -6)">
									<path id="Path_57" data-name="Path 57" d="M18,7.5v21" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" v-if="!checklists[index].open"/>
									<path id="Path_58" data-name="Path 58" d="M7.5,18h21" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
								</g>
							</svg>
						</div>
						<div class="checklist-content">
							<ul>
								<li class="checklist-item" v-for="(item, index) in list.checkItems" :key="index" :class="{checked: item.state === 'complete'}">{{item.name}}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="info-content-chat" v-if="sessionStatus === 'round2'">
				<h2>Chats</h2>
				<div class="info-content-chat-wrapper">
					<ChatMessage :sender="chat.sender" :message="chat.message" v-for="(chat, index) in chats" :key="index" />
				</div>
				<div class="info-content-chat-input">
					<Input type="message" name="message" placeholder="Type something" v-model="chatmessage" :emoji="true"/>
					<svg xmlns="http://www.w3.org/2000/svg" width="34.875" height="34.875" viewBox="0 0 34.875 34.875">
						<path id="Icon_awesome-arrow-circle-up" data-name="Icon awesome-arrow-circle-up" d="M.563,18A17.438,17.438,0,1,1,18,35.438,17.434,17.434,0,0,1,.563,18Zm10.1,2.032,5.091-5.309V27.563a1.683,1.683,0,0,0,1.688,1.688h1.125a1.683,1.683,0,0,0,1.688-1.687V14.723l5.091,5.309a1.689,1.689,0,0,0,2.412.028l.766-.773a1.681,1.681,0,0,0,0-2.384L19.2,7.573a1.681,1.681,0,0,0-2.384,0L7.474,16.9a1.681,1.681,0,0,0,0,2.384l.766.773A1.7,1.7,0,0,0,10.659,20.032Z" transform="translate(-0.563 -0.563)" fill="#d0bb7e"/>
					</svg>
				</div>
			</div>
		</div>
		<div id="app">
			<div class="container">
				<div class="nav" :class="{'nav-shareLink': shareLink.show}">

					<Logo :class="{'logoLeft': shareLink.show}" class="nav-home"/>

					<div v-if="currentComponent() === 'session'" id="shareLink-wrapper" class="shareLink relative animate__animated nav-link" @click="copyLink" ref="inputwrapper">
						<Input id="shareLinkInput" class="shareLink" type="text" name="link" placeholder="Trello bord URL" v-model="shareLink.url" disabled ref="input"/>
						<img src="/img/copy.svg" alt="" class="copy">
					</div>

					<div class="nav-profile flex space-between items-center" v-if="this.login">
						<div @click="toggleMenu">
							<svg xmlns="http://www.w3.org/2000/svg" width="62.842" height="36.658" viewBox="0 0 62.842 36.658" >
								<g id="Icon_ionic-ios-menu" data-name="Icon ionic-ios-menu" transform="translate(-4.5 -10.125)">
									<path id="Path_38" data-name="Path 38" d="M64.723,15.362H7.118A2.626,2.626,0,0,1,4.5,12.743h0a2.626,2.626,0,0,1,2.618-2.618h57.6a2.626,2.626,0,0,1,2.618,2.618h0A2.626,2.626,0,0,1,64.723,15.362Z" fill="#d0bb7e"/>
									<path id="Path_39" data-name="Path 39" d="M64.723,22.112H7.118A2.626,2.626,0,0,1,4.5,19.493h0a2.626,2.626,0,0,1,2.618-2.618h57.6a2.626,2.626,0,0,1,2.618,2.618h0A2.626,2.626,0,0,1,64.723,22.112Z" transform="translate(0 8.96)" fill="#d0bb7e"/>
									<path id="Path_40" data-name="Path 40" d="M64.723,28.862H7.118A2.626,2.626,0,0,1,4.5,26.243h0a2.626,2.626,0,0,1,2.618-2.618h57.6a2.626,2.626,0,0,1,2.618,2.618h0A2.626,2.626,0,0,1,64.723,28.862Z" transform="translate(0 17.921)" fill="#d0bb7e"/>
								</g>
							</svg>
						</div>
					</div>
				</div>

			</div>
			<router-view @session:status="updateSessionStatus" @session:checklists="updateSessionChecklists" @session:description="updateSessionDescription" @toggleInfo="toggleInfo"/>
		</div>
	</main>
</template>

<script>
import Logo from "./components/Logo";
import Input from "./components/Input";
import store from './store';
import Button from "./components/Button";
import axios from "axios";
import {SERVER, SOCKET, TOKEN, USER} from "./constants";
import ChatMessage from "./components/ChatMessage";
import $ from 'jquery';

export default {
	data()
	{
		return {
			shareLink		: store.shareLink,
			menu			: false,
			info 			: false,
			menuUser 		: USER,
			sessionStatus 	: '',
			menuLinks 		:
			[
				{
					icon: 'user',
					text: 'Profile',
					link: 'profile'
				},
				{
					icon: 'ace',
					text: 'Create room',
					link: 'createroom'
				}
			],
			chats:
			[
				{
					sender: 'Remynijsten515',
					message: "Yeah let's go!"
				},
				{
					sender: 'Stefano',
					message: "Cool let's go"
				},
				{
					sender: 'Rick',
					message: "Agreed"
				},
				{
					sender: 'Remynijsten515',
					message: "Nice!"
				},
				{
					sender: 'Giovanni',
					message: "I will do it!"
				},
			],
			chatmessage: "",
			checklists : null,
			description : ""
		}
	},
	components :
	{
		ChatMessage,
		Button,
		Logo,
		Input
	},
	methods :
	{
		updateSessionStatus(e)
		{
			console.log(e)
			this.sessionStatus = e.status;
		},

		updateSessionChecklists(data)
		{
			this.checklists = data;

			// Set reactive property with $set
			this.checklists.forEach((list, index) => {
				this.$set(this.checklists[index], 'open', false);
			})
		},

		updateSessionDescription(data)
		{
			this.description =  data;
		},



		copyLink()
		{
			this.$refs.inputwrapper.classList.add('animate__rubberBand')
			this.$toast.open({message: 'Link gekopieerd!', type: "success", position: "top-right"});

			this.$refs.inputwrapper.addEventListener('animationend', e => e.currentTarget.classList.remove('animate__rubberBand'))
			navigator.clipboard.writeText(this.shareLink.url);
		},
		toggleMenu()
		{
			this.menu = !this.menu
			this.info = false
		},
		toggleInfo()
		{
			this.info = !this.info
			this.menu = false
		},
		currentComponent()
		{
			return window.location.pathname.split('/')[1]
		},
		logout()
		{
			axios.post(SERVER + 'session/logout', {
				headers: {
					Authorization: TOKEN
				}
			}).then(() => {
				this.menuOpen = false
				this.$router.push({name: 'login'})
			})
		},
		leaveSession()
		{
			SOCKET.emit('session', {event: 'leave', email: USER.email, name: USER.name, key: this.$route.params.key})

			this.$router.push({name: 'profile'})
			this.menuOpen = false
		},
		sendChat()
		{
			SOCKET.emit("chat", {
                event: "send",
				key: this.$route.params.key,
                sender: USER.name,
                message: this.chatmessage,
            });
		},
		openChecklist(index)
		{
			index = parseInt(index)
			this.checklists[index].open = !this.checklists[index].open
		}
	},
	mounted()
	{
		// Event listener to send a chat by pressing enter
		window.addEventListener('keydown', e => {
			if(e.key === 'Enter' && this.chatmessage !== "")
			{
				this.sendChat();

				console.log('chat send: ' + this.chatmessage)
				this.chatmessage = ""
			}
		})

		SOCKET.on("chat", args => {
			switch (args.event) {
				case "receive":
					this.chats.push(
					{
						sender: args.sender,
						message: args.message
					})
					break;
			}
		});
	}
}
</script>


<style lang="scss">

	@import "../src/scss/main";

	#app{
		transition: 0.3s ease;
	}

	.nav{
		position: relative;
		padding: 50px 0 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		&-home, &-profile{
			width: fit-content;
			justify-content: flex-end;
			svg{
				width: 30px;
			}
		}
	}

	.menu{
		#app{
			transform: scale(0.8) translateX(15%);
		}
		nav{
			left: 0;
			transition: 0.75s ease;
		}
	}

	.info-content{
		height: 100%;
		width: 35%;
		position: fixed;
		right: -1000px;
	}

	.info{
		#app{
			transform: scale(0.8) translateX(-35%);
		}
		.info-content{
			right: 0;
			transition: 0.75s ease;
			display: flex;
			flex-direction: column;
			justify-content: center;
			h2{
				margin-bottom: 10px;
				color: $white;
			}
			&-feature{
				width: 90%;
				&-checklists{
					&-checklist{
						cursor: pointer;
						padding: 20px;
						margin-bottom: 20px;
						border: 2px solid $blue-light;
						border-radius: $border;
						color: $white;
						overflow: hidden;
						max-height: 65px;
						transition: 0.3s ease;
					}
					.checklist-header{
						position: relative;
						svg{
							position: absolute;
							right: 10px;
							top: 50%;
							transform: translateY(-50%);
						}
					}

					.checklist-content{
						padding: 20px;
					}
				}
				&-description{
					padding: 20px;
					background: $blue-light;
					border-radius: $border;
					height: 200px;
					margin-bottom: 20px;
					max-height: 200px;
					overflow-y: scroll;
					color: $white;
				}
			}

			&-chat{
				background-color: $blue-dark;
				height: calc(100vh * 0.8);
				position: relative;
				width: 90%;
				&-wrapper{
					display: flex;
					flex-direction: column;
					max-height: 85%;
					overflow: scroll;
				}
				h2{
					color: $white;
					margin-bottom: 25px;
				}
				&-input{
					position: absolute;
					display: flex;
					align-items: center;
					width: 100%;
					bottom: 0;
					left: 0;
					input{
						margin-bottom: 0;
						padding-right: 50px;
					}
					svg{
						position: absolute;
						right: 5px;
						transition: 0.3s ease;
						&:hover{
							transform: translateY(-10px);
						}
					}
				}
			}
		}
	}

	main{
		background-color: $blue-dark;
		overflow: hidden;
	}


	nav{
		height: 100vh;
		width: 300px;
		display: flex;
		justify-content: space-evenly;
		flex-direction: column;
		align-items: center;
		position: fixed;
		color: $white;
		left: -300px;
		transition: 0.3s ease;
		ul{
			list-style: none;
			line-height: 50px;
			li{
				transition: 0.3s ease;
				&:hover{
					transform: translateX(10px);
				}
				a{
					display: flex;
				}
				img{
					width: 30px;
					margin-right: 25px;
				}
			}
		}
	}

	.button-container{
		height: 150px;
	}

	svg{
		cursor: pointer;
	}
	#shareLink-wrapper {
		margin: 0 auto;
	}
	#shareLinkInput{
		margin: auto 0 !important;
		font-size: 18px;
	}
	.copy{
		position: absolute;
		right: 1em;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		cursor: pointer;
	}
	.logoLeft {
		float: left;
		display: inline;
	}
	.shareLink {
		display: inline-block;
		width: 60%;
	}

	.checklist-open{
		max-height: 300px!important;
	}
</style>