<script>

	import { onMount } from 'svelte';
	import { BitField } from '../util/bitfield';

	const Dir = Object.freeze({
		E: [1,0,2,1],
		W: [-1,0,-2,1],
		N: [0,-1,0,0.5],
		S: [0,1,0,2]
	});

	const X_SIZE = 4;
	const Y_SIZE = 4;

	const horizontalRoads = new BitField((X_SIZE + 1)*(Y_SIZE+1));
	const verticalRoads = new BitField((X_SIZE + 1)*(Y_SIZE+1));

	function idx(x, y) {
		return y * (Y_SIZE+1) + x;
	}

	let x = 0;
	let y = 0;
	let tax = 0.0;

	let segments = [];

	function makeSegment(x, y, dir) {
		return {fromX: x, fromY: y, toX: x + dir[0], toY: y + dir[1]};
	}

	function addSegment(dir) {
		let s = makeSegment(x, y, dir);

		if (s.toX > X_SIZE || s.toX < 0 || s.toY > Y_SIZE || s.toY < 0) return;

		if (dir[0] !== 0) {
			const i = idx(Math.min(x, x + dir[0]), y);
			if (horizontalRoads.get(i)) return;
			horizontalRoads.set(i);
			x += dir[0];
		}
		if (dir[1] !== 0) {
			const i = idx(x, Math.min(y, y + dir[1]));
			if (verticalRoads.get(i)) return;
			verticalRoads.set(i);
			y += dir[1];
		}
		segments = [...segments, s];
		tax += dir[2];
		tax *= dir[3];
	}

	function dirFrom(event) {
		switch (event.key) {
			case "ArrowRight":
				return Dir.E;
			case "ArrowLeft":
				return Dir.W;
			case "ArrowUp":
				return Dir.N;
			case "ArrowDown":
				return Dir.S;
		}
		return undefined;
	}

	function handleKeydown(event) {
		const dir = dirFrom(event);
		if (dir !== undefined) {
			addSegment(dir);
		}
	}

	onMount(async () => {
		addSegment(Dir.E);
		addSegment(Dir.E);
	});

	const MARGIN = 15;
	const SEGMENT_LENGTH = 100;
	const LENGTH = X_SIZE * SEGMENT_LENGTH + 2 * MARGIN;
</script>

<svelte:window on:keydown={handleKeydown}/>

<svelte:head>
	<title>The Penniless Pilgrim Riddle</title>
</svelte:head>

<h1>The Penniless Pilgrim Riddle</h1>

<div class="auto-resizable-iframe">
	<div>
		<iframe
			title="Penniless Pilgrim Riddle"
			frameborder="0"
			src="https://www.youtube-nocookie.com/embed/6sBB-gRhfjE"
			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		/>
	</div>
</div>

<p>Use the arrow keys to solve the riddle.</p>
<p>Tax: {tax} silver.</p>

<div class="svginside" style="max-width:480px">
	<canvas width="{LENGTH}" height="{LENGTH}"></canvas>
	<svg height="100%" width="100%" viewBox="0 0 {LENGTH} {LENGTH}">
		<circle r="15" cx="{MARGIN + X_SIZE * SEGMENT_LENGTH}" cy="{MARGIN + Y_SIZE * SEGMENT_LENGTH}" fill='gray'/>
        {#each segments as s}
			<line
				x1="{MARGIN + s.fromX*SEGMENT_LENGTH}"
				y1="{MARGIN + s.fromY*SEGMENT_LENGTH}"
				x2="{MARGIN + s.toX*SEGMENT_LENGTH}"
				y2="{MARGIN + s.toY*SEGMENT_LENGTH}"
				stroke="orange"
				stroke-width="5"
			/>
        {/each}
		<circle r="10" cx="{MARGIN + x*SEGMENT_LENGTH}" cy="{MARGIN + y*SEGMENT_LENGTH}" fill='black'/>
	</svg>
</div>

<style>

	.auto-resizable-iframe {
		max-width: 720px;
		margin: 0px auto;
	}

	.auto-resizable-iframe > div {
		position: relative;
		padding-bottom: 75%;
		height: 0px;
	}

	.auto-resizable-iframe iframe {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
	}

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
		font-size: 4vw;
		text-align: center;
		/*font-size: 2.8em;*/
		text-transform: uppercase;
		font-weight: 600;
		margin: 0 0 0.5em 0;
	}

	p{
		font-size: 4vw;
		text-align: center;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}

</style>