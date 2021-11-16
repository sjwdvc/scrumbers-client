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