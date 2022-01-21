<template>
	<section class="login">
		<div class="interface">
			<DisplayHeader content="LOG IN" />
			<form action="" class="login-form" @submit.prevent="submitData">
				<Input type="email" name="email" placeholder="Email" required v-model="form.email"/>
				<div class="relative">
					<Input :type="passwordType" name="password" placeholder="Password" required v-model="form.password" ref="password-input"/>
					<img src="/img/eye.svg" alt="" class="password-show" @mousedown="showPassword" @mouseup="hidePassword">
				</div>
				<p>{{ error }}</p>
				<Button type="submit" content="Login" class="login-form-button" />
			</form>
			<Button @click.native="loginMicrosoft" content="Login with Microsoft" class="login-microsoft-button" />
			<p><router-link to="passwordreset">Forgot password?</router-link></p>
		</div>
		<p> No account yet?
			<router-link to="register">Click here to register</router-link>
		</p>
	</section>
</template>

<script>
import axios from "axios";
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Button from "../components/Button";
import {SERVER, TOKEN} from "../constants";

export default
{
	name: "login",
	components:
	{
		Button,
		DisplayHeader,
		Input
	},
	beforeMount()
	{
		if (window.location.search.startsWith('?token='))
		{
			//document.querySelector(".login-microsoft-button").setAttribute("disabled", "");

			// Set the token
			localStorage.setItem('TOKEN', window.location.search.substring('?token='.length, window.location.search.length));
			
			// Notify user that registration was successful
			this.error = "Success! Redirecting you...";

			console.log('removing oauth');

			// remove OAuth key from storage after login
			localStorage.removeItem('OAUTH_TOKEN');

			// Redirect after 2 seconds
			setTimeout(() => {
				this.session === null || this.session === undefined ? this.$router.push({name : 'home'}) : this.$router.push({name : 'session', params: {key: this.session}})
			}, 2000);
		}
	},
	data()
	{
		return {
			form:
			{
				email: "",
				password: ""
			},
			error: "",
			session: null,
			passwordType: 'password'
		};
	},
	methods:
	{
		// Submit the formdata to the server url defined in main.js using a post request
		submitData()
		{
			let formdata 					= this.form
			formdata.headers 				= {}
			formdata.headers.Authorization 	= TOKEN

			axios.post(SERVER + 'user/login', formdata)
			.then(res => {
				this.error = "";

				document.querySelectorAll("input").forEach(input => {
					input.style.border = "none";
				});

				if (res.data.error)
				{
					// Highlight the input field containing the error
					res.data.field !== "global"
						? (document.querySelector(
						"input[name=" + res.data.field + "]"
						).style.border = "2px solid #A03A3C")
						: "";

					// Comment the error under the form
					this.error = res.data.error;
				}
				else
				{
					// Disable the submit button to prevent double submits
					document.querySelector(".login-form-button").setAttribute("disabled", "");

					// Save token globally in localstorage
					localStorage.setItem('TOKEN', res.data.data[0].token);

					// Notify user that registration was successful
					this.error = "Success! Redirecting you...";

					console.log('removing oauth');

					// remove OAuth key from storage after login
					localStorage.removeItem('OAUTH_TOKEN');

					// Redirect after 2 seconds
					setTimeout(() => {
						if (this.session === null || this.session === undefined) {
							// .catch() bacause .push has a callback. To avoid error loggin in console,
							// bacause the middleware will redirect to /changepassword when necessary
							this.$router.push({name : 'home'}).catch(() => {});
						} else {
							this.$router.push({name : 'session', params: {key: this.session}});
						}
					}, 2000);
				}
			})
			.catch(function(error) {
				console.log(error);
			});
		},
		showPassword()
		{
			this.passwordType = 'text'
		},
		hidePassword()
		{
			this.passwordType = 'password'
		},
		loginMicrosoft()
		{
			axios.post(SERVER + 'user/login/microsoft', {}).then(response => {
				console.log(response);
				location.replace(response.data.oauthUrl);
			});
		}
	},
	mounted()
	{
		this.$route.params.key !== null ? this.session = this.$route.params.key : this.session = null
	}
};
</script>