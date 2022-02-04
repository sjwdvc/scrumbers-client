<template>
	<div class="avg-container" v-if="!consent">
		<div class="flex flex-col" >
			<h2>Privacy Policy</h2>
			<div class="avg-content">
				
				<br><br>
				This application processes your data so we can provide a service to you. By using this application you consent with the processing of your data.
				<br><br>
				Below you can find out what data we collect and store when you plan a lesson.
				<br><br>
				<ul>
					<li>Email</li>
					<li>Full name</li>
					<li>Age</li>
					<li>Job / Career</li>
					<li>Trello boards/cards</li>
				</ul>
				<br><br>
				We only use this data for administrative purposes, and to be able to provide you with the service that is 'Scrumbers'.
				<br><br>
				The data is not shared with or sold to 3rd parties
			</div>
			<div class="avg-button">
				<Button content="Allright!" class="avg-button"/>
			</div>
			
		</div>
	</div>
</template>

<script>
import Button from "./Button"
export default {
	name : "AVG",
	components : {Button},
	data()
	{
		return {
			consent: false
		};
	},
	mounted()
	{
		document.querySelector('.avg-button').addEventListener('click', () => {
			localStorage.setItem("AVGConsent", true)
			this.consent = true;
		})
		
		// Set the hide/show boolean according to the consent given
		this.consent = localStorage.getItem("AVGConsent") !== null;
	}
}
</script>
