<template>
	<main :class="{'menuOpen': menuOpen}">
		<nav>
			<ul>
				<li v-for="(link, index) in menuLinks" :key="index" @click="menuOpen = false"><router-link :to="{name: link.link}"><img :src="'/img/' + link.icon + '.svg'" alt="">{{ link.text }}</router-link></li>
			</ul>
			<Button content="Logout" @click.native="logout"/>
		</nav>
		<div id="app">
			<div class="container">
				<div class="nav" :class="{'nav-shareLink': shareLink.show}">

					<Logo :class="{'logoLeft': shareLink.show}" class="nav-home"/>

					<div v-if="currentComponent() === 'session'" id="shareLink-wrapper" class="shareLink relative animate__animated nav-link" @click="copyLink" ref="inputwrapper">
						<Input id="shareLinkInput" class="shareLink" type="text" name="link" placeholder="Trello bord URL" v-model="shareLink.url" disabled ref="input"/>
						<img src="/img/copy.svg" alt="" class="copy">
					</div>

					<div class="nav-profile flex space-between items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="62.842" height="36.658" viewBox="0 0 62.842 36.658" @click="toggleMenu">
							<g id="Icon_ionic-ios-menu" data-name="Icon ionic-ios-menu" transform="translate(-4.5 -10.125)">
								<path id="Path_38" data-name="Path 38" d="M64.723,15.362H7.118A2.626,2.626,0,0,1,4.5,12.743h0a2.626,2.626,0,0,1,2.618-2.618h57.6a2.626,2.626,0,0,1,2.618,2.618h0A2.626,2.626,0,0,1,64.723,15.362Z" fill="#d0bb7e"/>
								<path id="Path_39" data-name="Path 39" d="M64.723,22.112H7.118A2.626,2.626,0,0,1,4.5,19.493h0a2.626,2.626,0,0,1,2.618-2.618h57.6a2.626,2.626,0,0,1,2.618,2.618h0A2.626,2.626,0,0,1,64.723,22.112Z" transform="translate(0 8.96)" fill="#d0bb7e"/>
								<path id="Path_40" data-name="Path 40" d="M64.723,28.862H7.118A2.626,2.626,0,0,1,4.5,26.243h0a2.626,2.626,0,0,1,2.618-2.618h57.6a2.626,2.626,0,0,1,2.618,2.618h0A2.626,2.626,0,0,1,64.723,28.862Z" transform="translate(0 17.921)" fill="#d0bb7e"/>
							</g>
						</svg>
					</div>
				</div>

			</div>
			<router-view />
		</div>
	</main>
</template>

<script>
import Logo from "./components/Logo";
import Input from "./components/Input";
import store from './store';
import Button from "./components/Button";
import axios from "axios";
import {SERVER, TOKEN, USER} from "./constants";

export default {
	data()
	{
		return {
			shareLink	: store.shareLink,
			menuOpen	: false,
			menuUser 	: USER,
			menuLinks 	: [
				{
					icon: 'user',
					text: 'Profile',
					link: 'profile'
				},
				{
					icon: 'ace',
					text: 'Create room',
					link: 'createroom'
				}
			]
		}
	},
	components :
	{
		Button,
		Logo,
		Input
	},
	methods : {
		toProfile() {
			this.$router.push({name: "profile"})
		
		},
		copyLink()
		{
			this.$refs.inputwrapper.classList.add('animate__rubberBand')
			this.$toast.open({message: 'Link gekopieerd!', type: "success", position: "top-right"});
			navigator.clipboard.writeText(this.shareLink.url);
		},
		toggleMenu()
		{
			this.menuOpen = !this.menuOpen
		},
		currentComponent()
		{
			return window.location.pathname.split('/')[1]
		},
		logout()
		{
			axios.post(SERVER + 'session/logout', {
				headers: {
					Authorization: TOKEN
				}
			}).then(() => {
				this.menuOpen = false
				this.$router.push({name: 'login'})
			})


		}
	}

}
</script>


<style lang="scss">

	@import "../src/scss/main";

	#app{
		transition: 0.3s ease;
	}

	.nav{
		//padding-top: 50px;
		position: relative;
		padding: 50px 0 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		&-home, &-profile{
			width: fit-content;
			justify-content: flex-end;
			svg{
				width: 30px;
			}
		}
	}

	.menuOpen{
		#app{
			transform: scale(0.8) translateX(15%);
		}
		nav{
			left: 0;
			transition: 0.75s ease;
		}

	}

	main{
		background-color: $blue-dark;
		overflow: hidden;
	}


	nav{
		height: 100vh;
		width: 300px;
		display: flex;
		justify-content: space-evenly;
		flex-direction: column;
		align-items: center;
		position: fixed;
		color: $white;
		left: -300px;
		transition: 0.3s ease;
		ul{
			list-style: none;
			line-height: 50px;
			li{
				transition: 0.3s ease;
				&:hover{
					transform: translateX(10px);
				}
				a{
					display: flex;
				}
				img{
					width: 30px;
					margin-right: 25px;
				}
			}
		}
	}

	svg{
		cursor: pointer;
	}
	#shareLink-wrapper {
		margin: 0 auto;
	}
	#shareLinkInput{
		margin: auto 0 !important;
		font-size: 18px;
	}
	.copy{
		position: absolute;
		right: 1em;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		cursor: pointer;
	}
	.logoLeft {
		float: left;
		display: inline;
	}
	.shareLink {
		display: inline-block;
		width: 60%;
	}
</style>