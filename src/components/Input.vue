<template>
	<input :type="$props.type" :name="$props.name" :placeholder="$props.placeholder" v-bind="attrs" :value="value" @input="updateValue($event.target.value)" @change="changeValue($event.target.value)">
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
		},
		changeValue(value)
		{
			this.$emit('change', value)
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