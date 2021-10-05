<template>
	<div id="app">
		<div class="nav">
			<Logo />
			<div @click="logout" class="logout-wrapper" v-if="this.login">
				<Button content="LOGOUT" type="submit" />
			</div>
		</div>
		<router-view />
	</div>
</template>

<script>
import Logo from "./components/Logo";
import axios from "axios";
import Button from "./components/Button";
import {SERVER} from "./constants";

export default {
	components : {
		Logo,
		Button
	},
	methods : {
		// Logs out the user
		logout() {
			axios.post(SERVER + 'session/logout')

			// Refresh the page to activate the automatic re-route based on the login status
			this.$router.go()
		}
	}
}
</script>


<style lang="scss">

	@import "../src/scss/main";

	.nav{
		padding-top: 50px;
		position: relative;
	}

	.logout-wrapper{
		position: absolute;
		right: 50px;
		top: 50%;
	}
</style>