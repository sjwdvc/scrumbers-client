<template>
	<section class="session">
		<div class="interface" v-if="!joined">
			<DisplayHeader content="Welkom" />
			<Input type="text" name="username" placeholder="Gebruikersnaam" ref="username" required="required" v-model="name"/>
			<div @click="setUserName">
				<Button content="Beginnen >"/>
			</div>
		</div>
		<div class="interface" v-if="joined">
			<DisplayHeader content="Game screen comes here" />
		</div>
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Button from "../components/Button";
export default {
	name : "Session",
	components : {Button, Input, DisplayHeader},
	data() {
		return {
			joined  	: false,
			name 		: '',
			sessionId 	: null
		}
	},
	methods: {
		setUserName()
		{
			this.name = this.$refs.username.value
			this.joined = true
		}
	},
	mounted()
	{
		this.sessionId = parseInt(this.$route.params.key)
	}
}
</script>

<style scoped>
	input{
		margin: 2rem 0;
	}
</style>