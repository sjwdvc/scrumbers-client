<template>
	<div class="createtemplate">
		<div class="interface">
			<DisplayHeader content="Create template" />
			<Input type="text" placeholder="Title" />
			
			<div class="flex createtemplate-addnumber items-center">
				<Input type="number" placeholder="Add numbers" v-model="number"/>
				<svg xmlns="http://www.w3.org/2000/svg" width="64.398" height="64.398" viewBox="0 0 64.398 64.398" @click="addNumber">
					<path id="Icon_awesome-plus-square" data-name="Icon awesome-plus-square" d="M57.5,2.25H6.9A6.9,6.9,0,0,0,0,9.15v50.6a6.9,6.9,0,0,0,6.9,6.9H57.5a6.9,6.9,0,0,0,6.9-6.9V9.15A6.9,6.9,0,0,0,57.5,2.25ZM52.9,38.474A1.73,1.73,0,0,1,51.174,40.2H37.949V53.424a1.73,1.73,0,0,1-1.725,1.725h-8.05a1.73,1.73,0,0,1-1.725-1.725V40.2H13.225A1.73,1.73,0,0,1,11.5,38.474v-8.05A1.73,1.73,0,0,1,13.225,28.7H26.449V15.475a1.73,1.73,0,0,1,1.725-1.725h8.05a1.73,1.73,0,0,1,1.725,1.725V28.7H51.174A1.73,1.73,0,0,1,52.9,30.424Z" transform="translate(0 -2.25)" fill="#d0bb7e"/>
				</svg>
			</div>
			
			
			<div class="createtemplate-cardwrapper flex custom-scrollbar">
				<div class="createtemplate-cardwrapper-card" v-for="(card, index) in cardTemplates" :data-card="card" :key="index" >
					<p>{{ card }}</p>
				</div>
			</div>

			
			<div class="createtemplate-buttons flex space-between">
				<Button content="Back" @click="back"/>
				<Button content="Save" />
			</div>
		</div>
	</div>
</template>

<script>
import DisplayHeader from "./text/DisplayHeader"
import Input from "./Input"
import Button from "./Button"
import CardTemplates from "./CardTemplates"

export default {
	name : "CreateTemplate",
	components : {Button, Input, DisplayHeader},
	data()
	{
		return {
			cardTemplates   : [1, 2, 3],
			number     : 0
		}
	},
	methods : {
		addNumber(num)
		{
			num = parseInt(this.number)
			
			
			if(this.cardTemplates.some(card => card === num))
			{
				this.$toast.open({message: num+ " is already added to the template", type: "error", position: "top-right"});
			} else this.cardTemplates.push(num)
			
			this.number = ""
		},
		
		back()
		{
			document.querySelector('.createroom').classList.remove('addtemplate')
		}
	}
}
</script>