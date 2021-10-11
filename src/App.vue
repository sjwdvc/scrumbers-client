<template>
	<div id="app">
		<div class="nav">
			<Logo />
			<div v-if='this.$router.currentRoute.name != "profile"'>
				<div @click="toProfile" class="logout-wrapper" v-if="this.login">
				
					<svg class="profile-icon" xmlns="http://www.w3.org/2000/svg" width="50.583" height="56.281" viewBox="0 0 50.583 56.281"><g transform="translate(-3.5 -2)"><path d="M51.583,39.594V33.9a11.4,11.4,0,0,0-11.4-11.4H17.4A11.4,11.4,0,0,0,6,33.9v5.7" transform="translate(0 16.187)" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/><path d="M34.792,15.9A11.4,11.4,0,1,1,23.4,4.5a11.4,11.4,0,0,1,11.4,11.4Z" transform="translate(5.396 0)" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/></g></svg>
				</div>
			</div>
		</div>
		<router-view />
	</div>
</template>

<script>
import Logo from "./components/Logo";
import axios from "axios";
import {SERVER} from "./constants";

export default {
	components : {
		Logo
	},
	methods : {
		toProfile() {
			this.$router.push({name: "profile"})
		
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
	svg{
		cursor: pointer;
	}
</style>