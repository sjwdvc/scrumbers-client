<template>
	<div id="app">
		<div class="nav">
			<Logo />
		</div>
		<router-view />
	</div>
</template>

<script>
import Logo from "./components/Logo";

export default {
	components : {
		Logo
	}
}
</script>


<style lang="scss">

	@import "../src/scss/main";

	.nav{
		padding-top: 50px;
	}
</style>