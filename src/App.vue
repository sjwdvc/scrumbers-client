<template>
	<main :class="{'menu': menu, 'info': info}">
		<nav class="menu-content">
			<ul>
				<li v-for="(link, index) in menuLinks" :key="index" @click="closeMenu"><router-link :to="{name: link.link}"><img :src="'/img/' + link.icon + '.svg'" alt="">{{ link.text }}</router-link></li>
			</ul>
			<div class="flex flex-col space-between button-container">
				<Button content="Leave session" @click.native="leaveSession" v-if="currentComponent() === 'session'"/>
				<Button content="Logout" @click.native="logout"/>
			</div>
		</nav>
		<div class="info-content">
			<div class="info-content-feature custom-scrollbar" v-if="info">
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

				<h2>Attachments</h2>
				<div class="info-content-feature-checklists">
					<div :id="'attachment-' + index" class="info-content-feature-checklists-checklist" v-for="(attachment, index) in attachments" :key="index" :class="{'checklist-open': attachment.open}">
						<dir v-if="attachment.mimeType.startsWith('image/')" @click="openAttachment(index)">
							<div class="checklist-header">
								<h3>{{attachment.name}}</h3>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
									<g id="Icon_feather-plus" data-name="Icon feather-plus" transform="translate(-6 -6)">
										<path id="Path_57" data-name="Path 57" d="M18,7.5v21" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" v-if="!attachments[index].open"/>
										<path id="Path_58" data-name="Path 58" d="M7.5,18h21" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
									</g>
								</svg>
							</div>
							<div class="checklist-content">
								<img style="width: 90%" v-bind:src="attachment.url" alt="Card">
							</div>
						</dir>
						<div v-else>
							<div class="checklist-header">
								<h3><a :href="attachment.url" target="blank">{{attachment.name}}</a></h3>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="info-content-chat" v-if="chatOpen && sessionStatus === 2">
				<h2>Chats</h2>
				<div class="info-content-chat-wrapper">
					<ChatMessage :sender="chat.sender" :message="chat.message" :vote="chat.vote"  v-for="(chat, index) in chats" :key="index" />
				</div>
				<div class="info-content-chat-input">
					<svg xmlns="http://www.w3.org/2000/svg" width="46.088" height="20.947" viewBox="0 0 46.088 20.947" class="info-content-chat-input-handle" ref="resizehandle" @mousedown="activateResize">
						<g id="Icon_ionic-ios-menu" data-name="Icon ionic-ios-menu" transform="translate(-4.5 -25.835)">
							<path id="Path_39" data-name="Path 39" d="M48.667,22.112H6.42c-1.056,0-1.92-1.178-1.92-2.618h0c0-1.44.864-2.618,1.92-2.618H48.667c1.056,0,1.92,1.178,1.92,2.618h0C50.588,20.934,49.723,22.112,48.667,22.112Z" transform="translate(0 8.96)" fill="#d0bb7e"/>
							<path id="Path_40" data-name="Path 40" d="M48.667,28.862H6.42c-1.056,0-1.92-1.178-1.92-2.618h0c0-1.44.864-2.618,1.92-2.618H48.667c1.056,0,1.92,1.178,1.92,2.618h0C50.588,27.684,49.723,28.862,48.667,28.862Z" transform="translate(0 17.921)" fill="#d0bb7e"/>
						</g>
					</svg>

					<Textarea type="message" name="message" placeholder="Type something" v-model="chatmessage" :emoji="true" max="500" @input.native="checkChatInput" ref="chatinput"/>
					<svg xmlns="http://www.w3.org/2000/svg" width="34.875" height="34.875" viewBox="0 0 34.875 34.875" @click="sendChat" class="info-content-chat-input-send">
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
			<router-view
				@session:status="updateSessionStatus"
				@session:checklists="updateSessionChecklists"
				@session:attachments="updateSessionAttachments"
				@session:description="updateSessionDescription"
				@session:chat:clear="clearChats"
				@session:chat:update="updateChats"
				@session:chat:votes="updateVotes"
				@session:chat:updateround="updateRound"
				@toggleInfo="toggleInfo"
				@openInfo="openInfo"
				@closeInfo="closeInfo"
				@hideChat="hideChat"
			/>
		</div>
	</main>
</template>

<script>
import Logo from "./components/Logo";
import Input from "./components/Input";
import Textarea from "./components/TextArea";
import store from './store';
import Button from "./components/Button";
import axios from "axios";
import {SERVER, SOCKET, TOKEN, USER} from "./constants";
import ChatMessage from "./components/ChatMessage";

export default {
	data()
	{
		return {
			shareLink		: store.shareLink,
			menu			: false,
			info 			: false,
			chatOpen 		: false,
			menuUser 		: USER,
			sessionStatus 	: '',
			chats			: [],
			votes			: [],
			chatmessage		: "",
			checklists 		: null,
			attachments		: null,
			description 	: "",
			chatround 		: 0,
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
		}
	},
	components :
	{
		ChatMessage,
		Button,
		Logo,
		Input,
		Textarea
	},
	methods :
	{
		updateSessionStatus(e)
		{
			this.sessionStatus = e.status;

			console.log('session status is : ' + this.sessionStatus)

			this.chatOpen = this.sessionStatus === 2
		},

		updateSessionChecklists(data)
		{
			this.checklists = data;

			// Set reactive property with $set
			this.checklists.forEach((list, index) => {
				this.$set(this.checklists[index], 'open', false);
			});
		},

		updateSessionAttachments(data)
		{
			this.attachments = data;

			// Set reactive property with $set
			this.attachments.forEach((list, index) => {
				this.attachments[index].open = false;
				this.$set(this.attachments[index], 'open', false);
			});
		},

		updateSessionDescription(data)
		{
			this.description =  data;
		},

		updateChats(data)
		{

			this.clearChats()

			data['chat'].forEach(chat => {
				this.chats.push({
					sender: chat.sender,
					message: chat.value,
					round: chat.round
				})
			})

			this.updateVotes(data.votes)
		},

		activateResize(e)
		{
			window['initialY'] = e.pageY

			window.addEventListener('mousemove', this.activateDrag)
			window.addEventListener('mouseup', this.disableDrag)
		},

		activateDrag(e)
		{
			let resizeAmount 	= (window['initialY'] - e.clientY) * 2;
			let initialHeight	= this.$refs.chatinput.$el.offsetHeight;

			this.$refs.chatinput.$el.style.height = initialHeight + resizeAmount / 50 + 'px'
		},

		disableDrag(e)
		{
			window.removeEventListener('mousemove', this.activateDrag)
		},

		updateVotes(data)
		{
			this.votes = data;

			this.votes.forEach(vote => {

				this.chats.forEach(chat => {
					if( chat.round == vote.round){
						if(chat.sender === vote.sender)
							chat.vote = vote.value
					}
				})
			})
		},

		updateRound(data)
		{
			this.chatround = data
		},

		clearChats()
		{
			this.chats = [];
		},

		hideChat()
		{
			this.chatOpen = false;
		},

		checkChatInput(e)
		{

			let totalmessage = this.chatmessage + e.target.value

			if(totalmessage.length > 500)
			{
				e.preventDefault()
				this.chatmessage = this.chatmessage.substring(0, 500);

				this.$toast.open({message: 'Chat messages may only contain 500 characters', type: 'warning', position: 'top-right'});
			}

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
			this.menu = !this.menu;
			this.info = false;
		},

		closeMenu()
		{
			this.menu = this.info = false
		},

		toggleInfo()
		{
			this.info = !this.info;
			this.menu = false;
		},

		openInfo()
		{
			this.info = true;
		},

		closeInfo()
		{
			this.info = false;
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
				this.menu = false
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
			if (!this.chatmessage.trim())
			{
				this.$toast.open({message:'No empty chat messages allowed', type: "warning", position: "top-right"});
			}

			else
			{
				SOCKET.emit("chat", {
					event: "send",
					key: this.$route.params.key,
					sender: USER.name,
					message: this.chatmessage,
					vote : this.votes.find(vote => vote.sender === USER.name).value,
					round: this.chatround
				});

				this.chatmessage = ""

				setTimeout(() => {
					document.querySelector('.info-content-chat-wrapper').scrollTo(0, document.querySelector('.info-content-chat-wrapper').scrollHeight);
				}, 200)
			}
		},
		openChecklist(index)
		{
			index = parseInt(index);
			this.checklists[index].open = !this.checklists[index].open;
		},
		openAttachment(index)
		{
			index = parseInt(index);
			this.attachments[index].open = !this.attachments[index].open;

			console.log(this.attachments[index].open);
			let element = document.getElementById('attachment-' + index);
			if (element.classList.contains('checklist-open'))
				element.classList.remove('checklist-open');
			else 
				element.classList.add('checklist-open');
		}
	},
	mounted()
	{
		// Event listener to send a chat by pressing enter
		window.addEventListener('keydown', e => {
			if(e.key === 'Enter')
			{
				e.preventDefault()
				this.chatmessage !== "" ? this.sendChat() : ''
			}
		})

		SOCKET.on("chat", args => {
			switch (args.event) {
				case "receive":
					this.chats.push(
					{
						sender: args.sender,
						message: args.message,
						vote: args.vote
					})
					break;
			}
		});
	}
}
</script>

<style lang="scss" src="../src/scss/main.scss"></style>
<style lang="scss">
	@import "../node_modules/animate.css/animate.min.css";
</style>