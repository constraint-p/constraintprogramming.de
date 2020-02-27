<script>

	import { onMount } from 'svelte';

	const Dir = Object.freeze({E: [1,0,2,1], W: [-1,0,-2,1], N: [0,-1,0,0.5], S: [0,1,0,2]});

	let x = 0;
	let y = 0;
	let tax = 0.0;

	function getSegment(x, y, dir) {
		return {fromX: x, fromY: y, toX: x + dir[0], toY: y + dir[1]};
	}

	let segments = [];

	function addSegment(dir) {
		segments = [...segments, getSegment(x, y, dir)];
		x += dir[0];
		y += dir[1];
		tax += dir[2];
		tax *= dir[3];
	}

	function handleKeydown(event) {
		switch (event.key) {
			case "ArrowRight":
				if (x < 4) addSegment(Dir.E);
				break;
			case "ArrowLeft":
				if (x > 0) addSegment(Dir.W);
				break;
			case "ArrowUp":
				if (y > 0) addSegment(Dir.N);
				break;
			case "ArrowDown":
				if (y < 4) addSegment(Dir.S);
				break;
		}
	}

	onMount(async () => {
		addSegment(Dir.E);
		addSegment(Dir.E);
	});

</script>

<svelte:window on:keydown={handleKeydown}/>

<svelte:head>
	<title>The Penniless Pilgrim Riddle</title>
</svelte:head>

<h1>The Penniless Pilgrim Riddle</h1>
<h4>Tax: {tax} silver.</h4>

<div class="svginside" style="max-width:480px">
	<canvas width="420" height="420"></canvas>
	<svg height="100%" width="100%" viewBox="0 0 420 420">
        {#each segments as s}
			<line
				x1="{10 + s.fromX*100}"
				y1="{10 + s.fromY*100}"
				x2="{10 + s.toX*100}"
				y2="{10 + s.toY*100}"
				stroke="orange"
				stroke-width="5"
			/>
        {/each}
	</svg>
</div>

<style>

	canvas {
		display: block;
		width: 100%;
		visibility: hidden;
	}

	.svginside {
		position:relative;
		margin-left:auto; margin-right: auto;
	}

	.svginside svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	h1 {
		text-align: center;
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}

</style>