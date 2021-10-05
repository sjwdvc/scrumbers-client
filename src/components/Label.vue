<template>
	<label>{{content}}</label>
</template>

<script>
export default {
	name : "Label",
	props: {
		content: String
	}
}
</script>

<style scoped lang="scss">

@import "../../src/scss/main.scss";

label{
	text-align: left;
	display: block;
	transform: translateY(20px);
	color: $white;
}
</style>