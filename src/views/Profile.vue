<template>
	<section>
		<div class="interface">
			<DisplayHeader class="header" content="PROFIEL" />
			<form action="" class="profile-form">
				<input type="text" name="name" placeholder="Naam" v-model="profile.name" ref="name"/>
				<input type="number" name="age" placeholder="Leeftijd" ref="age" v-model="profile.age"/>
				<input type="text" name="function" placeholder="Functie" ref="function" v-model="profile.function"/>

				<div class="profile-list">
					<p> Email : </p>
					<p> {{ profile.email }} </p>
				</div>
			
				<div v-if="this.spinner === true" class="loader"></div>
		
				<p class="error">{{ this.error }}</p>
				<div class="flex space-between">
					<Button @click.native="submitData" type="submit" content="Opslaan" ref="button" />
					<Button @click.native="logout" content="Logout" ref="button" />
				</div>
			</form>
			<a>Wachtwoord veranderen</a>
		</div>
	</section>
</template>

<script>
import axios from "axios";
import {SERVER} from "../constants";	
import Button from "../components/Button";
import DisplayHeader from "../components/text/DisplayHeader";


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
			form: {
				name: "",
				age: "",
			},
			error: "",
			spinner: {}
		}
	},
	created()
	{
		axios.get(SERVER + 'user/profile').then(response => this.profile = response.data);
	},
	methods: {
		logout(){
			axios.post(SERVER + 'session/logout')
			
			this.$router.go()
		},
		// Submit the formdata to the server url defined in main.js using a post request
		submitData() {
			axios.post(SERVER + 'user/update', {name : this.profile.name, age : this.profile.age, function : this.profile.function})
			 	.then(res => {
				 	if (res.data.error !== "") {
						// Comment the error under the form
						this.error = res.data.error;
				 	} else {
						// Notify user that registration was succesfull
						this.spinner = true;
						this.error = "Opslaan... Je wordt doorgestuurd"

						document.querySelector(".error").classList.add("succes");

						// Disable submit button to prevent double submits
						document.querySelector('button').setAttribute('disabled', '');

						// Redirect after 1.5 seconds
						 setTimeout(() => this.$router.push({name: 'createroom'}), 1500)
				 	}
			 	})
			 	.catch(function(error) {
					console.log(error);
			 	});
		}
	}
}
</script>

<style scoped lang="scss">
	@import "../../src/scss/main";

	.header
	{
		margin: 20px;
	}

	h1
	{
		text-align: center;
	}

	p
	{
		color: $white;
		margin: 5px;
	}

	span
	{
		float: right;
	}

	.profile-list
	{
		display: inline-flex;
	}

	.interface
	{
		text-align: left;
	}

	Button
	{
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	a
	{
		font-size: 12px;
	}

	a:hover
	{
		color: $white;
	}

	input
	{
		background-color: $blue-light;
		margin-bottom: 10px;
		border-radius: 10px;
		padding: 1rem 10px;
		color: $white;
		border: none;
		width: 100%;
	}

	.error
	{
		color: $red;
	}

	.succes
	{
		color: $white;
	}

	.loader
	{
		border: 3px solid $white;
		border-radius: 70%;
		border-top: 3px solid transparent;
		-webkit-animation: spin 1.2s linear infinite; /* Safari */
		animation: spin 1.2s linear infinite;
		position: fixed;
		z-index: 999;
		overflow: show;
		margin: auto;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 50px;
		height: 50px;
	}

	@keyframes spin
	{
	  0% { transform: rotate(0deg); }
	  100% { transform: rotate(360deg); }
	}
</style>