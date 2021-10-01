<template>
	<section class="createroom">
		<div class="interface">
			<DisplayHeader content="NIEUW BORD" />
			<form action="" class="createroom-form" @submit.prevent="generateRoom">
				<Input type="text" name="link" placeholder="Trello bord URL" v-model="url"/>
				<Button content="Genereer link"/>
			</form>
		</div>
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import Button from "../components/Button";
export default {
	name : "CreateRoom",
	components : {Button, Input, DisplayHeader},
	data(){
		return {
			url: ''
		}
	},
	methods: {
		generateRoom()
		{
			console.log('room generated with url:' + this.url)
		}
	}
}
</script>

<style scoped lang="scss">
	section{
		width: 750px;
	}
	input{
		margin: 2rem 0;
	}
</style>