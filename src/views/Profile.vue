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
		<SessionHistory :feature-data="this.featureData"/>
	</section>
	
</template>

<script>
import axios from "axios";
import {SERVER, TOKEN, USER} from "../constants";
import Button from "../components/Button";
import DisplayHeader from "../components/text/DisplayHeader";
import $ from "jquery";
import SessionHistory from "../components/SessionHistory"

export default {
	name : "Profile",
	components :
		{
			SessionHistory,
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

