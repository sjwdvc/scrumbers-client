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
				<router-link to="/changepassword">Change password</router-link>
				<a @click="$refs.history.togglePopup()" >History</a>
			</div>

		</div>
		<SessionHistory :feature-data="this.featureData" ref="history"/>
	</section>
	
</template>

<script>
import axios from "axios";
import {SERVER, SOCKET, TOKEN, USER} from "../constants"
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


		SOCKET.emit('session', {event: 'history', config: 'all', email: USER.email})
		SOCKET.on('history', data => {
			this.featureData = data.sessions
		})


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
		}
	}
}
</script>

