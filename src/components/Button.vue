<template>
  <button :type="$props.type">{{ $props.content | capitalize }}</button>
</template>

<script>
export default {
	name: "Button",
	props:
	{
		type: String,
		content: String
	}
};
</script>

<style scoped lang="scss">
@import "../../src/scss/main.scss";

	button
	{
		background-color: $gold;
		color: $blue-dark;
		font-weight: 800;
		padding: 1rem;
		text-align: center;
		border-radius: 10px;
		border: none;
		border-bottom: 5px solid darken($gold, 10%);
		transition: 0.3s ease;
		cursor: pointer;
		&:hover
		{
			transform: translateY(-5px);
		}
		&:disabled
		{
			background-color: rgba($white, 0.5);
			border-bottom: 5px solid #606469;
			cursor: not-allowed;
		}
	}
</style>

