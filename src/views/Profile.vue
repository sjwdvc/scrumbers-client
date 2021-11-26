<template>
	
	<section class="profile">
		<div class="interface">
			<DisplayHeader class="header" content="PROFILE" />
			<form action="" class="profile-form" @submit.prevent="submitData">
				<label for="name">Name :</label>
				<input id="name" type="text" name="name" placeholder="Name" v-model="profile.name" ref="name"/>

				<label for="age">Age :</label>
				<input id="age" type="number" name="age" placeholder="Age" ref="age" v-model="profile.age"/>

				<label for="function">Function :</label>
				<input id="function" type="text" name="function" placeholder="Job title" ref="function" v-model="profile.function"/>

				<div class="profile-list">
					<p> Email : </p>
					<p> {{ profile.email }} </p>
				</div>

				<div v-if="this.spinner === true" class="loader"></div>

				<p class="error">{{ this.error }}</p>

				<div class="flex space-between">
					<Button type="submit" content="Update" ref="update" />
					<Button @click.native="logout" content="Log out" ref="logout" />
				</div>
			</form>
			<div class='flex space-between'>
				<a>Change password</a>
				<a @click="TogglePopup()" >History</a>
			</div>

		</div>
		<div class="popup" style='display:none;' id='history'>
			<div class="topsection">
				<h1>Sessions</h1>
				<a @click="TogglePopup()" ><svg class="closepopup" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" fill="#D0BB7E" /></svg>
				</a>
			</div>
			<div class="popup-content">
				<div class="border session" v-for="(featureArray,index) in featureData" v-bind:key="featureArray._id">
					<a class="toggleBtn" @click="ToggleDiv(index)">
						<p class="center sessionTitle"> 
							<span :class="'chevronSpan'+index" >
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class=" chevron bi bi-chevron-down" viewBox="0 0 16 16">
									<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
								</svg>
							</span> 
							Session: {{ featureArray.createdAt }}
						</p>
					</a>
					<div class="feature-content" v-for="feature in featureArray.features" v-bind:key="feature._id"  style='display:none;' :id="'featureDiv-'+index">
						<h2 class="featureTitle center">Title: {{ feature.featureTitle }}</h2>
						<a class="toggleBtn" @click="ToggleVotes(index)">
							<h3 class="sessionSubTitle">
								<span :class="'votesChevron'+index" >
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class=" chevron bi bi-chevron-down" viewBox="0 0 16 16">
										<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
									</svg>
								</span>
								Votes
							</h3>
						</a>
						<div class="roundTitles"  style='display:none;' :id="'votesRounds-'+index">
							<h3>Round: 1</h3>
							<h3>Round: 2</h3>
						</div>
						<div class="voteParent" v-for="player in featureArray.players" v-bind:key="player._id"  style='display:none;' :id="'votesDiv-'+index">	
							<div class="vote-content sub-title" v-for="(vote) in test(feature.votes, player)" v-bind:key="vote._id" >
								<div class="message-wrapper">
									<!-- <h3>Round: {{ vote.round }}</h3> -->
									<span class="vote-card" >{{ vote.value }}</span>
									<p class="name-sender"> {{ vote.sender }}</p>
								</div>
							</div>
						</div>

						<a class="toggleBtn" @click="ToggleChats(index)">
							<h3  class="sessionSubTitle">
								<span :class="'chatsChevron'+index" >
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class=" chevron bi bi-chevron-down" viewBox="0 0 16 16">
										<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
									</svg>
								</span>
								Chats
							</h3>
						</a>
						<p class="roundToggler" @click="ToggleChatRound()" :class="'chats-'+index" style='display:none;'>Toggle Round</p>
						<h3 class="center" v-if="chatround" :class="'chats-'+index" style='display:none;'>Round: 1</h3>
						<h3 class="center" v-if="!chatround" :class="'chats-'+index" style='display:none;'>Round: 2</h3>

						<div class="chat-content sub-title"  style='display:none;' :id="'chatsDiv-'+index">
							<div v-for="(chat, p) in feature.chat" v-bind:key="p" style='display:block;' :class="'chatRound1-'+index">
								<div class="chat-message" v-if="chatround && chat.round == 1">
									<!-- <h3 >Round: {{ chat.round }}</h3> -->
									<p class="name-sender"> {{ chat.sender }}</p>
									<p class="messageValue"> {{ chat.value }}</p>
								</div>
								<div class="chat-message" v-if="!chatround && chat.round == 2">
									<!-- <h3 >Round: {{ chat.round }}</h3> -->
									<p class="name-sender"> {{ chat.sender }}</p>
									<p class="messageValue"> {{ chat.value }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	
</template>

<script>
import axios from "axios";
import {SERVER, TOKEN, USER} from "../constants";
import Button from "../components/Button";
import DisplayHeader from "../components/text/DisplayHeader";
import $ from "jquery";

export default {
	name : "Profile",
	components :
		{
			DisplayHeader,
			Button
		},
	data()
	{
		return {
			profile: {},
			featureData: {},
			form: {
				name: "",
				age: "",
			},
			error: "",
			chatround: true,
			spinner: {},
			token: localStorage.getItem('TOKEN')
		}
	},
	mounted()
	{
		axios.defaults.headers = { Authorization: this.token };
		axios.get(SERVER + 'user/profile', {
			headers: {
				Authorization: TOKEN
			}
		}).then(response => this.profile = response.data);

		axios.get(SERVER + 'session/profile', {
			headers: {
				Authorization: TOKEN
			}
		}).then(response => {
			this.featureData = response.data.sessions.data;
			console.log(this.featureData);

			});

	},
	methods: {
		test(data, player){
			// console.log(data);
			// console.log(data[0] && data[0].user);
			// console.log(player.id);
			// console.log(data.filter(vote => {player.id == vote.user}));
			var dataArray = [];
			data.forEach(element => {
				if(element.user == player.id){
					dataArray.push(element);
				}
			});
			console.log(dataArray);
			return dataArray;
			// return data.filter(vote => {player.id == vote.user})
		},
		logout()
		{
			axios.post(SERVER + 'session/logout', {
				headers: {
					Authorization: TOKEN
				}
			}).then(() => {
				setTimeout(() => {
					this.$router.push({name: 'login'});
				}, 200)
			})
		},
		// Submit the formdata to the server url defined in main.js using a post request
		submitData()
		{
			USER.name = this.profile.name;
			axios.post(SERVER + 'user/update', {name : this.profile.name, age : this.profile.age, function : this.profile.function})
			 	.then(res => {
				 	if (res.data.error !== "")
				 	{
						// Comment the error under the form
						this.error = res.data.error;
				 	}
				 	else
				 	{
						// Notify user that registration was succesfull
						this.spinner = true;
						this.error = "Updating...";

						//
						document.querySelector(".error").classList.add("success");

						// Disable submit button to prevent double submits
						this.$refs.update.$el.setAttribute('disabled', '');

						setTimeout(() =>
						{
							this.error = "";
							this.spinner = false;
							this.$toast.open({message:'Profile details updated', type: "success", position: "top-right"});

							this.$refs.update.$el.removeAttribute('disabled');

						}, 1000);
				 	}
			 	})
			 	.catch(function(error) {
					console.log(error);
			 	});
		},
		ToggleDiv: function(i)
		{
			$("#featureDiv-"+i).toggle(400);
			document.querySelector(".chevronSpan"+i).classList.toggle('open');
	
		},
		ToggleVotes: function(i)
		{
			$("#votesDiv-"+i).toggle(400);
			$("#votesRounds-"+i).toggle(400);
			document.querySelector(".votesChevron"+i).classList.toggle('open');

		},
		ToggleChats: function(i)
		{
			$("#chatsDiv-"+i).toggle(400);
			$(".chats-"+i).toggle(400);
			document.querySelector(".chatsChevron"+i).classList.toggle('open');

		},
		TogglePopup: function()
		{
			$("#history").toggle(400);
		},
		ToggleChatRound: function(){
			this.chatround= !this.chatround;

		}
	}
}
</script>

