<template>
	<div class="register">
		<div class="interface">
			<DisplayHeader content="WELCOME" />
			<form action="" class="register-form" @submit.prevent="submitData">
				<Input type="text" name="name" placeholder="Username" required v-model="form.name" ref="name"/>
				<Input type="email" name="email" placeholder="Email" required v-model="form.email" ref="email"/>
				<div class="relative">
					<Input :type="passwordType" name="password" placeholder="Password" required v-model="form.password" ref="password-input"/>
					<img src="/img/eye.svg" alt="" class="password-show" @mousedown="showPassword" @mouseup="hidePassword">
				</div>
				<p>{{ error }}</p>
				<ul class="password-reqs">
					<li>Password must contain one of the following :</li>
					<li>At least 8 characters</li>
					<li>At least 1 capital letter</li>
					<li>Atleast 1 number</li>
				</ul>
				<Button type="submit" content="Register" ref="button" />
			</form>
		</div>

		<p class="login-link">
			Allready a member?
			<router-link to="login">Click here to login</router-link>
		</p>
	</div>
</template>

<script>
import axios from "axios";
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Button from "../components/Button";
import {SERVER} from "../constants";

export default {
	name: "Register",
	components: { Button, DisplayHeader, Input },
	data() {
		return {
			form: {
				name: "",
				email: "",
				password: ""
			},
			error: "",
			passwordType: 'password'
		};
	},
	methods: {
		// Submit the formdata to the server url defined in main.js using a post request
		submitData() {
			axios.post(SERVER + 'user/register', this.form)
			 .then(res => {
				 // Initiate/reset an empty error message
				 this.error = "";

				 // Reset all input border styling to none
				 document.querySelectorAll('input').forEach(input => {
					 input.style.border = 'none';
				 });

				 if (res.data.error) {
					 // Highlight the input field containing the error
					 res.data.field !== 'global'
						 ? (document.querySelector(
						 'input[name=' + res.data.field + ']'
						 ).style.border = '2px solid #A03A3C')
						 : '';

					 // Comment the error under the form
					 this.error = res.data.error;
				 } else {
					 // Disable submit button to prevent double submits
					 document.querySelector('button').setAttribute('disabled', '');

					 this.$toast.open({message: 'Registration successful', type: "success", position: "top-right"});

					 // Notify user that registration was succesfull
					 this.error = "Redirecting you..."

					 // Redirect after 2 seconds
					 setTimeout(() => this.$router.push({name: 'createroom'}), 2000)
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
	}
};
</script>

<style scoped lang='scss'>
	@import '../../src/scss/main';

	.register
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
			text-align: left;
			margin: 20px 0;
		}
		.login-link
		{
			margin-top: 25px;
			text-align: center;
		}
		.password-reqs
		{
			text-align: left;
				li
				{
					font-size: 12px;
					color: $white;
					margin-left: 25px;
					&:first-child
					{
						list-style: none;
						margin-left: 0px;
						margin-bottom: 10px;
					}
				}
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
