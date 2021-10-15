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
				<Button type="submit" content="Log in" />
			</form>
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
					document.querySelector("button").setAttribute("disabled", "");

					// Save token globally in localstorage
					localStorage.setItem('TOKEN', res.data.data[0].token)

					// Notify user that registration was successful
					this.error = "Success! Redirecting you..."

					// Redirect after 2 seconds
					setTimeout(() => {
						this.session === null || this.session === undefined ? this.$router.push({name : 'createroom'}) : this.$router.push({name : 'session', params: {key: this.session}})
					}, 2000)
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
		}
	},
	mounted()
	{
		this.$route.params.key !== null ? this.session = this.$route.params.key : this.session = null
	}
};
</script>
	
<style scoped lang="scss">
	@import "../../src/scss/main";

	.interface{
		min-width: 500px;
	}

	.login
	{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		h1
		{
			margin: 0 auto 50px;
			text-align: center;
		}

		&-form
		{
			display: flex;
			justify-content: center;
			flex-direction: column;

			button
			{
				margin: 25px auto 0;
			}
		}

		p
		{
			color: $white;
			text-align: center;
			margin-top: 25px;
		}

		.password-show
		{
			position: absolute;
			right: 10px;
			top: 50%;
			bottom: 50%;
			transform: translateY(-80%);
			height: 15px;
		}
	}
</style>
