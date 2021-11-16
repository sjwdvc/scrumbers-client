<template>
	<h1 class="displayheader">{{$props.content}}</h1>
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