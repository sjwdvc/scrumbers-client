<template>
	<section class="sharelink">
		<div class="interface">
			<DisplayHeader content="SUCCESS!" />
			<p>Share this link with your colleagues to grant them access to the session</p>
			<div class="relative animate__animated sharelink-input-wrapper" @click="copyLink" ref="inputwrapper">
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
import store from "../store";

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
		this.link = CLIENT + '/session/' + this.$route.params.key;
		store.shareLink.show = false;
	}
}
</script>