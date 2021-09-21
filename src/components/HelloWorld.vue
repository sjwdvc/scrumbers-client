<template>
	<div>
		<div>HALLO</div>
		<Header content="WELKOM" />
	</div>
</template>

<script>

import Header from "@/components/Header";

export default {
  	name: "HelloWorld",
	components: {
		Header
	},
  	props: {
    	msg: String
  	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
