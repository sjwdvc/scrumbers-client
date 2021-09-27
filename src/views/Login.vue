<template>
	<section class="login">
		<Logo />
		<div class="interface">
			<DisplayHeader content="INLOGGEN" />
			<form action="" class="login-form" @submit.prevent="submitData">
				<Input
					type="email"
					name="email"
					placeholder="Email"
					required
					v-model="form.email"
				/>
				<Input
					type="password"
					name="password"
					placeholder="Wachtwoord"
					required
					v-model="form.password"
				/>
				<p>{{ error }}</p>
				<Button type="submit" content="Inloggen" />
			</form>
		</div>
		<p>
			Heb je nog geen account ?
			<router-link to="register">Klik hier om te registreren</router-link>
		</p>
	</section>
</template>

<script>
import axios from "axios";
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Button from "../components/Button";

export default {
	name: "login",
	components: { Button, DisplayHeader, Input },
	data() {
		return {
			form: {
				email: "",
				password: ""
			},
			error: ""
		};
	},
	methods: {
		// Submit the formdata to the server url defined in main.js using a post request
		submitData() {
			axios.post(this.$server + 'login', this.form)
			.then(res => {
				this.error = "";

				document.querySelectorAll("input").forEach(input => {
					input.style.border = "none";
				});

				if (res.data.error) {


					// Highlight the input field containing the error
					res.data.field !== "global"
						? (document.querySelector(
						"input[name=" + res.data.field + "]"
						).style.border = "2px solid #A03A3C")
						: "";

					// Comment the error under the form
					this.error = res.data.error;
				} else {
					// document.querySelector("button").setAttribute("disabled", "");
					this.error = "Inloggen...";

					// Router push to logged-in homescreen
				}
			})
			.catch(function(error) {
				console.log(error);
			});
		}
	}
};
</script>
	
<style scoped lang="scss">
@import "../../src/scss/main";

.login {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	h1 {
		margin: 0 auto 50px;
		text-align: center;
	}
	&-form {
		display: flex;
		justify-content: center;
		flex-direction: column;
		button {
			margin: 25px auto 0;
		}
	}
	p {
		color: $white;
		text-align: center;
		margin-top: 25px;
	}
}
</style>
