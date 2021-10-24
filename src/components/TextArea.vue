<template>
	<textarea :type="$props.type" :name="$props.name" :placeholder="$props.placeholder" :value="value" @input="updateValue($event.target.value)"></textarea>
</template>

<script>
export default {
	name : "TextArea",
	props: {
		name : String,
		type : String,
		placeholder: String,
	},
	methods: {
		updateValue(value)
		{
			this.$emit('input', value)
		}
	}
}
</script>

<style scoped lang="scss">
	@import "../../src/scss/main.scss";

	textarea{
		background-color: $blue-light;
		border-radius: 10px;
		padding: 25px;
		color: $white;
		border: none;
		width: 100%;
	}
</style>