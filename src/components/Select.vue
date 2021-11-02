<template>
	<select :name="name" >
		<option :value="option.value" v-for="(option, index) in options" :key="index">{{option.content}}</option>
	</select>
</template>

<script>
export default {
	name : "Select",
	props: {
		name: String,
		options: Array
	}
}
</script>

<style scoped lang="scss">

	@import "../../src/scss/main.scss";

	select{
		background-color: $blue-light;
		margin-bottom: 10px;
		border-radius: 10px;
		padding: 1rem 10px;
		color: $white;
		border: none;
		width: 100%;
	}
</style>