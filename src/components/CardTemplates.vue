<template>
		<form class="cardtemplates custom-scrollbar">
			<div v-for="(cards, i) in data" :key="i" class="cardtemplates-template">
				<p class="cardtemplates-title">{{ cards.title }}</p>
				<div class="flex items-center justify-start">
					<input type="radio" name="templates" :value="cards.cards" @click="selectTemplate">
					<div class="flex items-center justify-start cardtemplates-wrapper custom-scrollbar">
						<div class="cardtemplates-card" v-for="(card, index) in cards.cards" :key="index" >
							<p>{{ card }}</p>
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
		selectTemplate(e)
		{
			document.querySelectorAll('input[type=radio]').forEach(input => {
				input.setAttribute('checked', false)
			})

			e.target.setAttribute('checked', true)
		}
	}
}
</script>