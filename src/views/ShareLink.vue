<template>
	<section class="sharelink">
		<div class="interface">
			<DisplayHeader content="GELUKT!" />
			<p>Deel deze link met je collega’s om deel te nemen aan de poker sessie</p>
			<div class="relative animate__animated" @click="copyLink" ref="inputwrapper">
				<Input type="text" name="link" placeholder="Trello bord URL" v-model="link" disabled ref="input"/>
				<img src="/img/copy.svg" alt="" class="copy">
			</div>
		</div>
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Input from "../components/Input";
import {CLIENT} from "../constants-example";

export default {
	name : "ShareLink",
	components : {Input, DisplayHeader},
	data(){
		return {
			link: ''
		}
	},
	methods: {
		copyLink()
		{
			this.$refs.inputwrapper.classList.add('animate__rubberBand')
			this.$toast.open({message: 'Link gekopieerd!', type: "success", position: "top-right"});
			navigator.clipboard.writeText(this.link);
		}
	},
	mounted() {
		this.link = CLIENT + this.$route.params.id
	}
}
</script>

<style scoped lang="scss">

@import "../../src/scss/main.scss";
@import "../../node_modules/animate.css/animate.min.css";

section{
	width: 750px;
}
input{
	margin: 2rem 0;
	font-size: 18px;
}
p{
	color: $white;
}
.copy{
	position: absolute;
	right: 1em;
	top: 50%;
	transform: translateY(-50%);
	width: 20px;
	cursor: pointer;
}
</style>