<template>
    <div class="choicepopup" :class="{'d-none' : !$parent.choice.visible}">
        <div class="interface">
            <DisplayHeader content="ASSIGN USER" />
            <p id="feature-name">{{ $parent.session.feature.name }}</p>
            <br><br>
	        <div class="choicepopup-cards" v-show="$parent.choice.cards.length > 0">
		        <div class="choicepopup-cards-card" v-for="(card, index) in $parent.choice.cards" :data-card="card" :key="index" @mouseenter="activeCard" @mouseleave="staticCard" @click="selectCard">
			        <p >{{ card }}</p>
		        </div>
	        </div>
            <Select id="choice-selector" name="choices" :options="$parent.choice.members" @updateSelect="updateMember" />
            <Button @click.native="submit()" content="Assign"/>
        </div>
    </div>
</template>

<script>
import DisplayHeader from "./text/DisplayHeader.vue";
import Select from "./Select.vue";
import Button from "./Button.vue";
import EVENTBUS from '../eventbus';
import {SOCKET} from "../constants"

export default {
    name: "ChoicePopup",
    data()
    {
        return {
            choice: {
            	member  : '',
	            card    : 0
            },
	        showcards: false
        };
    },
    components: {
        DisplayHeader,
        Select,
        Button
    },
    methods: {
		updateMember(value)
		{
            this.$parent.choice.member = value;
		},
	    
        submit()
        {
	        SOCKET.emit("feature", {
		        key: this.$route.params.key,
		        event: "choose",
		        member: this.$parent.choice.member || this.$parent.choice.members[0].value,
		        number: this.$parent.choice.card
	        });
	        
	        this.choice.visible = false;
        },
	    
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
		    this.$parent.choice.card = e.target.dataset.card
		    e.target.classList.add("selected");
	    },
	},
	mounted()
	{
		EVENTBUS.$on('adminchoice', () => {
			this.$parent.choice.visible = true
			this.$parent.choice.card = this.$parent.choice.cards[0]
		})
	}
};
</script>