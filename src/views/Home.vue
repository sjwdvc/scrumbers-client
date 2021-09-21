<template>
	<section>
		<Logo />
		<DisplayHeader content="WELKOM" />
	</section>
</template>

<script>
import DisplayHeader from "../components/text/DisplayHeader";
import Logo from "../components/Logo";

export default {
	name : "Home",
	components : {Logo, DisplayHeader}
}
</script>

<style scoped>
</style>