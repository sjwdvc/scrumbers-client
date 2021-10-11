<template>
	<section>
		<DisplayHeader content="HOME" />
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Button from "../components/Button";
import axios from "axios";
import {SERVER} from "../constants";

export default {
	name : "Home",
	components : {DisplayHeader},
	methods : {
		logout() {
			axios.post(SERVER + 'session/logout')

			this.$router.go()
		}
	}
}
</script>

<style scoped>
h1{
	text-align: center;
}
</style>