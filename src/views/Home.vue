<template>
	<section>
		<DisplayHeader content="HOME" />
		<div @click="logout">
			<Button content="LOGOUT" type="submit" />
		</div>
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Button from "../components/Button";
import axios from "axios";

export default {
	name : "Home",
	components : {Button, DisplayHeader},
	methods : {
		logout() {
			axios.post(this.$server + 'logout')
		}
	}
}
</script>

<style scoped>
h1{
	text-align: center;
}
</style>