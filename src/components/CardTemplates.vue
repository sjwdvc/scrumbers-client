<template>
		<form class="cardtemplates custom-scrollbar">
			<div v-for="(cards, i) in data" :key="i" class="cardtemplates-template">
				<p class="cardtemplates-title">{{ cards.title }}</p>
				<div class="flex items-center justify-start">
					<input type="radio" name="templates" :value="cards.cards" @click="selectTemplate">
					<div class="flex items-center justify-start cardtemplates-wrapper custom-scrollbar">
						<div class="cardtemplates-card" v-for="(card, index) in cards.cards" :key="index" >
							<p v-if="card === -1">☕</p>
							<p v-else-if="card === -2">❓</p>
							<p v-else>{{ card }}</p>
						</div>
					</div>
				</div>
			</div>
		</form>
</template>

<script>
export default {
	name : "CardTemplates",
	props: {
		data : Array
	},
	methods : {
		/**
		 *
		 * @param {Event} e The click event fired from the input node
		 */
		selectTemplate(e)
		{
			// Toggle the checked attribute on the input
			document.querySelectorAll('input[type=radio]').forEach(input => {
				input.removeAttribute('checked')
			})
			e.target.setAttribute('checked', true)
			
			// Emit the results back to the Createroom component
			this.$emit('selectTemplate', e.target.value)
		}
	}
}
</script>