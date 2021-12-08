<template>
    <section class="session" ref="session">
        <div class="container">
            <div class="interface" v-if="!session.started">
                <div class="waitingroom">
                    <v-lottie-player name="cards" loop path="https://assets8.lottiefiles.com/private_files/lf30_klsv8ygt.json" height="100px" style="margin: 0 auto"/>
                    <DisplayHeader content="Waiting..." class="waitingroom-header"/>

                    <div class="waitingroom-users">
                        <p class="user" v-for="user in users" :key="user.index" :class="{ admin: user.name === admin }">{{ user.name }}</p>
                    </div>

                    <Button content="Start session" v-if="admin === name" @click.native="startSession"/>
                </div>
            </div>

            <div class="session-progress" v-if="session.started" :class="{'d-none' : !session.visible}">
                <div class="session-progress-background"></div>
                <div class="session-progress-bar" v-bind:style="{ width: calculateWidth }"></div>
            </div>

            <div class="session-game flex" v-if="session.started" :class="{'d-none' : !session.visible}">
                <div class="session-game-users">
                    <p class="session-game-header">Users</p>
                    <div class="session-game-users-user" v-for="user in users" :key="user.index" :class="user.status">
                        {{ user.name }}
                        <div class="session-game-users-user-card">{{ user.icon }}</div>
                    </div>
                </div>
                <div class="session-game-features">
                    <p class="session-game-header">Feature</p>
                    <h1 class="session-game-features-feature flex">
                        {{ session.feature.name }}
                        <div class="session-game-features-feature-controls flex flex-rowspace-between">
                            <span>{{ featuresIndex }}/{{ featuresLength }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" @click="$emit('toggleInfo')">
                                <g id="Icon_feather-info" data-name="Icon feather-info" transform="translate(-1.5 -1.5)">
                                    <path id="Path_54" data-name="Path 54" d="M33,18A15,15,0,1,1,18,3,15,15,0,0,1,33,18Z" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                                    <path id="Path_55" data-name="Path 55" d="M18,24V18" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                                    <path id="Path_56" data-name="Path 56" d="M18,12h0" fill="none" stroke="#d0bb7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                                </g>
                            </svg>
                        </div>
                    </h1>
	                <Cards v-on:select="session.decision.number = $event" ref="cards"/>
                    <div class="session-game-features-reason">
                        <div class="relative">
                            <TextArea name="description" placeholder="Explain your choice (max. 250 chars)" class="animate__animated" v-model="session.decision.desc" max="200" required
                            />
                            <Button content="Submit" @click.native="submit" ref="submitbutton"/>
                        </div>
                    </div>
                </div>
            </div>
            <SessionHistory :feature-data="history" ref="history" />
	        <CoffeeTimer />
	        <ChoicePopup @choiceSubmit="adminChoiceSubmit" />
	        <VotesPopup ref="votesPopup" />
        </div>
    </section>
</template>

<script>
import { SOCKET, USER, CLIENT } from "../constants";
import EVENTBUS from '../eventbus.js';
import store from "../store";
import Button from "../components/Button";
import DisplayHeader from "../components/text/DisplayHeader";
import ChoicePopup from "../components/ChoicePopup";
import TextArea from "../components/TextArea";
import SessionHistory from "../components/SessionHistory";
import VotesPopup from "../components/VotesPopup";
import Cards from "../components/Cards"
import CoffeeTimer from "../components/CoffeeTimer"

export default {
    name: "Session",
    components: {
	    CoffeeTimer,
	    Cards,
        SessionHistory,
        TextArea,
        DisplayHeader,
        ChoicePopup,
        VotesPopup,
        Button,
    },
	updated ()
	{
	
	},
	data() {
        return {
            name: "",
            sessionId: this.$route.params.key,
            users: [],
            admin: false,
            featuresLength: 0,
            featuresIndex: 1,
            width: 0,
            submitted: false,
            history: [],
            playerJoinMessages: [],
            tooltip: "More info",
            showMemberChoices: false,
            userCard: "⏳",
            timeOut: false,
            timeOutLength: 0,
            timeOutMinutes: 0,
            timeOutSeconds: 0,
         
	        session: {
                status: "round1",
                started: false,
                feature: {
                    name: "",
                    desc: "",
                },
                decision: {
                    number: null,
                    desc: "",
                },
	            boardMembers: [],
		        visible: true
            },
	        
	        // Popup for the results
	        votes : {
            	number  : 0,
		        member  : '',
		        visible : false,
		        feature : ''
	        },
	        
	        // Popup for the admin to select a card and assign a user
	        choice : {
            	cards   : [],
		        card    : 0,
		        members : [],
		        member  : '',
		        visible : false
	        }
        };
    },
    mounted() {
	    let submitbutton = this.$refs.submitbutton
	    
        /**
         * Join the session when you load the page and send the key from the url to define which session to join
         */
        SOCKET.emit("session", {
            event: "join",
            key: this.$route.params.key,
            name: USER.name,
            email: USER.email,
            coffee: this.timeOutLength,
        });

        /**
         * Retrieves some session data from the socket server and sets client side variables
         */
        SOCKET.on("joined", (args) => {
            this.admin = args.data.admin;
            this.name = USER.name;
            this.session.started = args.data.started;


            // if statement
            if(!this.playerJoinMessages.includes(args.data.name))
            {
                this.$toast.open({
                    message: args.data.name + " has joined the game",
                    type: "success",
                    position: "top-right",
                });
                this.playerJoinMessages.push(args.data.name);
            }
            // if player is in playerjoinmessages dont execute $toast
            this.refreshUserList(args.data);
        });
        
        const roundSetup = data => {
	        // set coffee time out
	        this.timeOutLength = data.data.coffee;
	        
	        // If the user status === ready, set the submitted value to true
	        this.submitted = this.users.find((user) => user.name === USER.name).status === "ready";

	        this.submitted
		        ? document.querySelector('.session-game-features-reason button').setAttribute('disabled', true)
		        : document.querySelector('.session-game-features-reason button').removeAttribute('disabled')
	        
	        // Sets the feature data
	        this.session.feature = data.data;
	
	        // Watch spelling if using elsewhere! Both singular and plural
	        this.featuresIndex = data.data["featurePointer"];
	        this.featuresLength = data.data["featuresLength"];
	
	        this.refreshUserList(data.data);
	        
	        // Emit session data to App.vue to update the config menu
	        this.$emit("session:status", { status: data.toLoad });
	        this.$emit("session:checklists", this.session.feature.checklists);
	        this.$emit("session:description", this.session.feature.desc);
        }

        /**
         * Updates feature data in both Session.vue and App.vue when loading the page
         */
        SOCKET.on("load", (data) => {
	        this.$nextTick(() => {
	            
	            this.session.status = data.toLoad;
	            this.resetChoices()

                // Sets all users their status to the correct status responded from the server
                data.data.users.forEach((user) => this.users.find((client) => client.name === user.name).status = user.status);

                switch (data.toLoad) {
                    case 0: // WAITING
                        break;
	                
                    case 1: // ROUND1
	                    
                        roundSetup(data)
                        this.$emit("closeInfo");
                        this.$emit("session:chat:updateround", 1);
                    break;

                    case 2: // ROUND2
                    	
                        roundSetup(data)
                        this.$emit("session:chat:update", data.chats);
                        this.$emit("session:chat:votes", data.chats.votes);
                        this.$emit("session:chat:updateround", 2);
                        this.$emit("openInfo");

                        // Set the chosen number to the card in the name list
                        this.users.forEach((user) => (user.icon = this.$parent["votes"].find((vote) => vote.sender === user.name).value));

                        // Scroll down the chat window
                        setTimeout(() => {
                            document.querySelector(".info-content-chat-wrapper").scrollTo(0, document.querySelector(".info-content-chat-wrapper").scrollHeight);
                        }, 200);
                    break;
                    
                    case 4: // ADMIN CHOICE
                    	
	                    roundSetup(data)
	                    this.$emit("session:chat:update", data.chats);
	                    this.$emit("session:chat:votes", data.chats.votes);
	                    this.$emit("openInfo");
	
	
	                    
	                    EVENTBUS.$emit('adminchoice');
                    break;
                        
                    case 5: // END
	                    
                    	// Hide the result / admin popup and the session interface
                    	votes.visible       = false;
                    	choice.visible      = false;
                    	session.visible     = false;
	                    
	                    // Query the history data and open the popup
                        SOCKET.emit("session", {event: "history", config: "single", key: this.sessionId});
                        SOCKET.on("history", (data) => (this.history = data.sessions));
                        this.$refs.history.togglePopup();
                    break;
                }
            });
        });

        /**
         * Sets the status of a client that has submitted to ready
         */
        SOCKET.on("submit", (data) => {
            this.users.find((user) => user.name === data.user).status = "ready";
            this.users.find((user) => user.name === data.user).icon = this.userStatusIcon(data.user, "ready");
        });

        /**
         * Activates the game for all clients in the waiting room when the admin starts the session
         */
        SOCKET.on("started", () => {
            this.session.started = true;
            this.session.status = "round1";
        });

        /**
         * When the session cannot be found on the server, redirect to the 404 page
         */
        SOCKET.on("undefinedSession", () => {
            this.$router.push({name: "Error", params: { message: "Oops.. This session can't be found. Please double check your URL or contact the room administrator"}});
        });

        /**
         * When a user left a session
         * @param {Object} args - the userlist returned from the server
         */
        SOCKET.on("leftSession", args => {
            // Remove a joined user from the array
            let playerIndex = this.playerJoinMessages.indexOf(args.data.name);
            if (playerIndex > -1) {
            this.playerJoinMessages.splice(playerIndex, 1);
            }

            this.$toast.open({message: args.data.userLeft + " has left the game", type: "warning", position: "top-right"});
            this.refreshUserList(args.data);
        });

        /**
         * Admin events
         */
        SOCKET.on("admin", (args) => {
	        this.choice.members = [];
            roundSetup(args)

            console.log('admin args : ')
            console.log(args)
        
	        args.members.forEach((member) => {
		        this.choice.members.push(
			        {
				        content : member.fullName,
				        value   : member.id,
			        });
	        });
	
	        this.choice.visible = true;
	        this.$emit("closeInfo");
	        
	        switch (args.event)
	        {
	        	case 'choose':
			        this.choice.cards = []
	        		break;
	        		
                case 'chooseboth':
	                this.choice.cards = args.cards
                	break;
	        }
        });

        /**
         * When timeout timer has to start
         */
        SOCKET.on("startTimer", () => this.timer());
        
		SOCKET.on("results", result => {
			
			this.votes.member = result.member
			this.votes.number = result.number
			this.votes.feature = result.feature.name
			
			// Hide admin assign window
			this.choice.visible = false
			
			EVENTBUS.$emit('results')
		});
	    
	    /**
	     * Fill and display the URL bar
	     */
	    store.shareLink.url = this.link = CLIENT + "/session/" + this.$route.params.key;
        store.shareLink.show = true;
    },
    methods: {
        /**
         * Starts the session
         */
        startSession()
        {
            this.$refs.session.classList.add("session-started");
            SOCKET.emit("session", {event: "start", key: this.$route.params.key});
        },
	    
        /**
         * Reset the cards and comment field
         */
        resetChoices() {
            // Reset the cards
	        document.querySelectorAll(".session-game-features-cards-card").forEach((card) => card.classList.remove("selected"));

            this.session.decision = { number: null, desc: "" };

            this.$emit("session:chat:clear");
        },

        /**
         * Return the correct icon for the user status
         */
        userStatusIcon(username, status) {
            switch (status) {
                case "waiting":
                    return "⏳";
                    break;

                case "ready":
                    return "✔️";
                    break;

                case "card":
                    return this.$parent["votes"].find((user) => user.sender === username).value;
                    break;
            }
        },

        /**
         * Update the users and their status
         */
        refreshUserList(data) {
            this.users = [];

            data.users.forEach((user) => this.users.push({name: user.name, status: user.status, icon: this.userStatusIcon(user.name, user.status)}));
        },

        /**
         * Fires when you click submit
         * Adds some styling and sends the data to the server
         */
        submit() {
            // Sets your client to the submitted state to prevent double submits etc
            this.submitted = true;

            // Define textarea element for styling purposes
            let textbox = document.querySelector(".session-game-features-reason textarea");

            if (this.session.decision.desc === "") {
                this.$toast.open({
                    message: "Please explain your decision in the field below",
                    type: "error",
                    position: "top-right",
                });

                // Some styling to announce an error in the textarea
                textbox.style.border = "2px solid #A03A3C";
                textbox.classList.add("animate__headShake");

                textbox.addEventListener("animationend", (e) => {
                    e.currentTarget.classList.remove("animate__headShake");
                });
                return;
            }
            // Remove textarea error styling
            textbox.style.border = "none";
            textbox.classList.remove("animate__headShake");
	
	        if (this.session.decision.number === null) {
		        this.$toast.open({
                    message: "Please select a card",
			        type: "error",
                    position: "top-right",
		        });
	        }
	        else
	        {
		        this.$refs.submitbutton.disableButton();
		
		        // Set your own status icon to a checkmark
		        this.users.find((user) => user.name === USER.name).icon =
			        this.userStatusIcon(USER.name, "ready");
		
		        //quick fix for the coffee card
		        this.session.decision.number === "coffee"
			        ? (this.session.decision.number = -1)
			        : "";
		        if (this.session.decision.number == "1/2") {
			        this.session.decision.number = 0.5;
		        }
		
		        SOCKET.emit("feature", {
			        key: this.$route.params.key,
			        event: "submit",
			        number: this.session.decision.number,
			        desc: this.session.decision.desc,
			        email: USER.email,
		        });
		
		        switch (this.session.status) {
			        case "round1":
				        break;
			
			        case "round2":
				        this.resetChoices();
				        this.$emit("closeInfo");
				        this.$emit("hideChat");
				        break;
		        }
	        }
        },
	    
        /**
         * Send our choice back to the server so we can continue
         */
        adminChoiceSubmit(memberID) {
            SOCKET.emit("feature", {
                key: this.$route.params.key,
                event: "choose",
                member : memberID,
	            number : this.choice.card
            });
            
            this.choice.visible = false;
        },

        timer() {
            // Show popup
            this.timeOut = true;
	        
            // Send length of coffee timeout to server
            SOCKET.emit("timer", {
                length: this.timeOutLength,
                key: this.$route.params.key,
            });
        },
    },
    computed: {
        // Calculates the width for the progress bar
        calculateWidth: function () {
            let procent = 100 / Number(this.featuresLength);
            let calculatedWidth = Number(procent) * Number(this.featuresIndex);

            if (calculatedWidth > 100) calculatedWidth = 100;

            return calculatedWidth + "%";
        },
    },
};
</script>