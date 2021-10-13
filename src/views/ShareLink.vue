<template>
	<section class="sharelink">
		<div class="interface">
			<DisplayHeader content="GELUKT!" />
			<p>Share this link with your colleagues to grant them access to the session</p>
			<div class="relative animate__animated" @click="copyLink" ref="inputwrapper">
				<Input type="text" name="link" placeholder="Trello board URL" v-model="link" disabled ref="input"/>
				<img src="/img/copy.svg" alt="" class="copy">
			</div>
			<Button content="Enter room" @click.native="$router.push({name: 'session', params: {key: $route.params.key}})"/>
		</div>
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import {CLIENT} from "../constants";
import Button from "../components/Button";

export default
{
	name : "ShareLink",
	components :
		{
			Button,
			Input,
			DisplayHeader
		},
	data()
	{
		return {
			link: ''
		}
	},
	methods:
	{
		copyLink()
		{
			this.$refs.inputwrapper.classList.add('animate__rubberBand')
			this.$toast.open({message: 'Link copied', type: "success", position: "top-right"});
			navigator.clipboard.writeText(this.link);
		}
	},
	mounted()
	{
		this.link = CLIENT + '/session/' + this.$route.params.key
	}
}
</script>

<style scoped lang="scss">

	@import "../../src/scss/main.scss";
	@import "../../node_modules/animate.css/animate.min.css";

	section
	{
		width: 750px;
	}

	input
	{
		margin: 2rem 0;
		font-size: 18px;
	}

	p
	{
		color: $white;
	}

	.copy
	{
		padding: 1em;
		position: absolute;
		right: 5px;
		top: 50%;
		transform: translateY(-50%);
		width: 50px;
		cursor: pointer;
		background-color: $blue-light;
		box-shadow: -20px 0px 20px $blue-light;
	}
</style>