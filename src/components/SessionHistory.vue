<template >
	<div class="popup" v-if="visible"  id='history'>
		<div class="topsection">
			<h1>Sessions</h1>
			<svg class="closepopup" @click="togglePopup" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" fill="#D0BB7E" /></svg>
		</div>
		<div class="popup-content">
			<div class="border session" v-for="(featureArray,index) in featureData" :key="index">
				<a class="toggleBtn" @click="toggleSession(index)" :id="'#featureDiv-' + index">
					<p class="center sessionTitle">
							<span :class="'chevronSpan'+index" >
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class=" chevron bi bi-chevron-down" viewBox="0 0 16 16">
									<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
								</svg>
							</span>
						Session: {{ featureArray.createdAt }}
					</p>
				</a>
				<div class="feature-wrapper">
					<div class="feature-content" v-for="(feature, featureindex) in featureArray.features" v-bind:key="feature._id">
						<h2 class="feature-content-title center">Title: {{ feature.title }}</h2>
						<div class="flex justify-center">
							<p class="chosenUser" v-if="feature.chosenUser !== '-1'"> {{ feature.chosenUser }}</p>
							<span class="chosenNumberCard" >{{ feature.chosenNumber }}</span>
							
						</div>
						
<!-- 
						<p>Number: {{ feature.chosenUser }}</p>
						<p>User: {{ feature.chosenUser }}</p> -->
						<div class="feature-content-votes">
							<div class="feature-content-votes-header" @click="ToggleVotes(featureindex,index)">
								<p>Votes</p>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="chevron bi bi-chevron-down" viewBox="0 0 16 16">
									<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
								</svg>
							</div>

							<div class="feature-content-votes-content">
								<div class="feature-content-votes-content-titles">
									<h3>Round: 1</h3>
									<h3>Round: 2</h3>
								</div>
								<div class="flex" v-for="player in featureArray.players" :key="player._id">
									<div class="vote-content sub-title" v-for="(vote) in test(feature.votes, player)" v-bind:key="vote._id" >
										<div class="message-wrapper">
											<!-- <h3>Round: {{ vote.round }}</h3> -->
											<span class="vote-card" >{{ vote.value }}</span>
											<p class="name-sender"> {{ vote.sender }}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="feature-content-chats">
							<div class="feature-content-chats-header" @click="toggleChats(featureindex, index)">
								<p>Chats</p>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="chevron bi bi-chevron-down" viewBox="0 0 16 16">
									<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
								</svg>
							</div>
							<div class="feature-content-chats-content">
								<p class="roundToggler" @click="ToggleChatRound(feature.chat)" >Toggle Round</p>

								<h3 class="center" v-if="chatround">Round: 1</h3>
								<h3 class="center" v-if="!chatround">Round: 2</h3>

								<div class="chat-content" v-for="(chatitem, chatindex) in feature.chat" :key="chatindex">
									<div class="chat-message" v-if="chatround && chatitem.round == 1">
										<p class="name-sender"> {{ chatitem.sender }}</p>
										<p class="messageValue"> {{ chatitem.value }}</p>
									</div>

									<div class="chat-message" v-if="!chatround && chatitem.round == 2">
										<p class="name-sender"> {{ chatitem.sender }}</p>
										<p class="messageValue"> {{ chatitem.value }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'

export default {
	name : "SessionHistory",
	props : {
		featureData : null,
	},
	data()
	{
		return {
			chatround	: true,
			visible 	: false
		}
	},
	mounted(){
		console.log(this.visible);
	},
	methods: {
		test(data, player){
			let dataArray = [];

			data.forEach(element => {
				if(element.user == player.id){
					dataArray.push(element);
				}
			});

			return dataArray;
		},
		toggleSession(i)
		{
			let wrapper = $($('.feature-wrapper')[i]);
			let chevron = $($('.sessionTitle')[i]);
			wrapper.toggle(400);
			chevron.toggleClass('open');
		},
		ToggleVotes(i,session)
		{
			let featureVotesIndex = $($( '.feature-wrapper' )[session])

			let voteElement = featureVotesIndex.children().eq(i).children('.feature-content-votes').children('.feature-content-votes-content');
			let voteElementHeader = featureVotesIndex.children().eq(i).children('.feature-content-votes').children('.feature-content-votes-header');

			voteElement.toggle(400);
			voteElementHeader.toggleClass('open');
		},
		toggleChats(i, session)
		{
			let featureChatsIndex = $($( '.feature-wrapper' )[session])

			let chatElement = featureChatsIndex.children().eq(i).children('.feature-content-chats').children('.feature-content-chats-content');
			let chatElementHeader = featureChatsIndex.children().eq(i).children('.feature-content-chats').children('.feature-content-chats-header');

			chatElement.toggle(400);
			chatElementHeader.toggleClass('open');
		},
		togglePopup()
		{
			this.visible = !this.visible;
		},
		ToggleChatRound()
		{
			this.chatround= !this.chatround;
		}
	}
}
</script>