<template>
	<select :name="name" @change="updateValue($event.target.value)">
		<option :value="option.value" v-for="(option, index) in options" :key="index">{{option.content}}</option>
	</select>
</template>

<script>
export default {
	name : "Select",
	props: {
		name: String,
		options: Array,
	},
	methods: {
		updateValue(value)
		{
			this.$emit('updateSelect', value);
		}
	}
}
</script>