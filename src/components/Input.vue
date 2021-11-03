<template>
	<input :type="$props.type" :name="$props.name" :placeholder="$props.placeholder" v-bind="attrs" :value="value" @input="updateValue($event.target.value)" :emoji="emoji">
</template>

<script>
export default {
	name : "Input",
	props: {
		type: String,
		name: String,
		placeholder: String,
		required: Boolean,
		value: String,
		emoji: Boolean
	},
	methods : {
		updateValue(value)
		{
			this.$emit('input', value)
		}
	},
	data () {
		return {
			attrs : {
				required: true,
				type: "text"
			}
		}
	}
}
</script>

<style scoped lang="scss">

	@import "../../src/scss/main.scss";

	input{
		background-color: $blue-light;
		margin-bottom: 10px;
		border-radius: 10px;
		padding: 1rem 10px;
		color: $white;
		border: none;
		width: 100%;
	}
</style>