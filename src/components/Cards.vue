<template>
	<div class="session-game-features-cards custom-scrollbar">
		<div class="session-game-features-cards-card" v-for="(card, index) in cards" :data-card="card" @mouseenter="activeCard" @mouseleave="staticCard" @click="selectCard" :key="index" >
			<p v-if="card !== 'coffee'">{{ card }}</p>
			<img src="/img/coffee.svg" alt="" v-else />
		</div>
	</div>
</template>

<script>
export default {
	name : "Cards",
	props : {
		cards : Array
	},
	methods :
	{
		/**
		 * Adds the raised card styling class
		 */
		activeCard(e)
		{
			e.target.classList.add("active");
		},
		
		/**
		 * Mouse leave event for the card. removes the raised card styling class
		 */
		staticCard(e)
		{
			e.target.classList.remove("active");
		},
		
		/**
		 * Apply styling to the card and update the property
		 */
		selectCard(e)
		{
			document.querySelectorAll(".selected").forEach((selected) => selected.classList.remove("selected"));
			
			this.$emit('select', e.target.dataset.card)
			
			e.target.classList.add("selected");
		},
		
		// Reset the choice
		reset()
		{
			document.querySelectorAll(".session-game-features-cards-card").forEach((card) => card.classList.remove("selected"));
		}
	}
}
</script>