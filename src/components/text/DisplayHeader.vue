<template>
	<h1>{{$props.content}}</h1>
</template>

<script>
export default {
	name : "DisplayHeader",
	props:
	{
		content: String
	}
}
</script>

<style scoped lang="scss">
	@import "../../scss/main.scss";

	h1
	{
		font-size: 60px;
		font-weight: 300;
		color: $white;
	}
</style>