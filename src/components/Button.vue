<template>
  <button :type="$props.type" ref="custombutton">{{ $props.content | capitalize }}</button>
</template>

<script>
export default {
	name: "Button",
	props:
	{
		type: String,
		content: String
	},
	methods :
	{
		disableButton()
		{
			this.$refs.custombutton.setAttribute('disabled', '')
		},

		enableButton()
		{
			this.$refs.custombutton.removeAttribute('disabled')
		}
	}
};
</script>

