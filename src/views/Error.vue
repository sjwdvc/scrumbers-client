<template>
	<section class="error-page">
		<v-lottie-player name="cards" loop path="https://assets5.lottiefiles.com/packages/lf20_kcsr6fcp.json" height="500px" width="700px" style="margin: 0 auto"/>
		<h2>{{message}}</h2>
		<Button content="Go back" @click.native="routeBack" />
	</section>
</template>

<script>
import Button from "../components/Button";

export default {
	name : "Error",
	components : {Button},
	data()
	{
		return {
			message: String
		}
	},
	mounted()
	{
		this.message = this.$route.params.message
	},
	methods :
	{
		routeBack()
		{
			this.$router.push({name: 'createroom'})
		}
	}
}
</script>

<style lang="scss" scoped>

	@import "../../src/scss/main";

	#app{
		background-image: none;
	}

	.nav{
		display: none;
	}

	h2{
		margin-bottom: 25px;
		color: $white;
	}

	.error-page{
		text-align: center;
		border-radius: 25px;
		padding: 200px;
	}
</style>