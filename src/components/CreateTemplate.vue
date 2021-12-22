<template>
	<div class="createtemplate">
		<div class="interface">
			<DisplayHeader content="Create template" />
			<Input type="text" placeholder="Title" v-model="title"/>
			
			<div class="flex createtemplate-addnumber items-center">
				<Input type="number" placeholder="Add numbers" v-model="number"/>
				<svg xmlns="http://www.w3.org/2000/svg" width="64.398" height="64.398" viewBox="0 0 64.398 64.398" @click="addNumber">
					<path id="Icon_awesome-plus-square" data-name="Icon awesome-plus-square" d="M57.5,2.25H6.9A6.9,6.9,0,0,0,0,9.15v50.6a6.9,6.9,0,0,0,6.9,6.9H57.5a6.9,6.9,0,0,0,6.9-6.9V9.15A6.9,6.9,0,0,0,57.5,2.25ZM52.9,38.474A1.73,1.73,0,0,1,51.174,40.2H37.949V53.424a1.73,1.73,0,0,1-1.725,1.725h-8.05a1.73,1.73,0,0,1-1.725-1.725V40.2H13.225A1.73,1.73,0,0,1,11.5,38.474v-8.05A1.73,1.73,0,0,1,13.225,28.7H26.449V15.475a1.73,1.73,0,0,1,1.725-1.725h8.05a1.73,1.73,0,0,1,1.725,1.725V28.7H51.174A1.73,1.73,0,0,1,52.9,30.424Z" transform="translate(0 -2.25)" fill="#d0bb7e"/>
				</svg>
			</div>
			<div class="flex space-between createtemplate-alternatives">
				<div @click="addAlternative(-1)">Add ☕</div>
				<div @click="addAlternative(-2)">Add ❓</div>
			</div>
			
			
			<div class="createtemplate-cardwrapper flex custom-scrollbar" v-if="cardTemplate.length > 0">
				<div class="createtemplate-cardwrapper-card" v-for="(card, index) in cardTemplate" :data-card="card" :key="index" @mouseover="viewDeleteButton" @mouseleave="hideDeleteButton">
					<p v-if="card === -1">☕</p>
					<p v-else-if="card === -2">❓</p>
					<p v-else>{{ card }}</p>
					<svg xmlns="http://www.w3.org/2000/svg" width="24.75" height="24.75" viewBox="0 0 24.75 24.75" class="remove" @click="remove(card)">
						<path id="Icon_awesome-times" data-name="Icon awesome-times" d="M17.066,18,24.1,10.964a2.212,2.212,0,0,0,0-3.128L22.539,6.273a2.212,2.212,0,0,0-3.128,0l-7.036,7.036L5.339,6.273a2.212,2.212,0,0,0-3.128,0L.648,7.836a2.212,2.212,0,0,0,0,3.128L7.684,18,.648,25.036a2.212,2.212,0,0,0,0,3.128l1.564,1.564a2.212,2.212,0,0,0,3.128,0l7.036-7.036,7.036,7.036a2.212,2.212,0,0,0,3.128,0L24.1,28.164a2.212,2.212,0,0,0,0-3.128Z" transform="translate(0 -5.625)" fill="#21282e"/>
					</svg>
				</div>
			</div>
			
			<p v-else class="createtemplate-emptynotice">No cards added yet</p>

			
			<div class="createtemplate-buttons flex space-between">
				<Button content="Back" @click.native="back"/>
				<Button content="Save" @click.native="save"/>
			</div>
		</div>
	</div>
</template>

<script>
import DisplayHeader from "./text/DisplayHeader"
import Input from "./Input"
import Button from "./Button"
import CardTemplates from "./CardTemplates"
import {USER, SOCKET} from "../constants"
import EVENTBUS from '../eventbus'

export default {
	name : "CreateTemplate",
	components : {Button, Input, DisplayHeader},
	data()
	{
		return {
			cardTemplate   : [],
			number          : "",
			title           : ""
		}
	},
	methods : {
		addNumber(num)
		{
			if(this.number === "")
			{
				this.$toast.open({message: "Please enter a number before submitting", type: "error", position: "top-right"});
				return
			}
			
			if(this.number > 100)
			{
				this.$toast.open({message: "The max. number is 100", type: "error", position: "top-right"});
				return
			}
			
			num = parseInt(this.number)
			
			
			if(this.cardTemplate.some(card => card === num))
			{
				this.$toast.open({message: num+ " is already added to the template", type: "error", position: "top-right"});
			} else this.cardTemplate.push(num)
			
			this.number = ""
		},
		
		addAlternative(num)
		{
			this.number = num
			
			this.addNumber(num)
		},
		
		viewDeleteButton(e)
		{
			e.target.classList.add('activeremove')
		},
		
		hideDeleteButton(e)
		{
			e.target.classList.remove('activeremove')
		},
		
		remove(card)
		{
			this.cardTemplate.splice(this.cardTemplate.indexOf(card), 1)
		},

		
		back()
		{
			document.querySelector('.createroom').classList.remove('addtemplate')
		},
		
		save()
		{
			// Check for empty fields / errors
			switch(true)
			{
				case this.title === "":
					this.$toast.open({message: "Please enter a title", type: "error", position: "top-right"});
					break;
				
				case this.cardTemplate.length === 0:
					this.$toast.open({message: "Please enter one or more cards to the template", type: "error", position: "top-right"});
				break;
				
				case this.cardTemplate.length === 1 && this.cardTemplate[0] == -1:
					this.$toast.open({message: "You need to add atleast 1 number besides a coffee card", type: "error", position: "top-right"});
					break;
					
				default:
						SOCKET.emit('templates', {event: 'save', template: {
								name    : this.title,
								cards   : this.cardTemplate
							},  email   : USER.email})
						
						document.querySelector('.createroom').classList.remove('addtemplate')
						
						this.$toast.open({message: "Template successfully added and ready to use", type: "success", position: "top-right"});
						
						EVENTBUS.$emit('templates:reload')
				break;
			}
		}
	}
}
</script>