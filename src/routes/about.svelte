<svelte:head>
	<title>About</title>
	<script src="https://api.underpolished.com/js/chatwidget.js" async type="text/javascript"></script>
</svelte:head>

<h1>About this site</h1>

<p>This is the 'about' page. There's not much here.</p>

<script>
	import { onMount } from 'svelte';
	onMount(async () => {
		window.UnderpolishedChatSettings = {
			id: 10,
			token: 'oQXfa275QFb9dEyL'
		};
	});
</script>