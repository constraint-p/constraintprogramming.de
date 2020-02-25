<script>

	const Dir = Object.freeze({E: [1,0,2,1], W: [-1,0,-2,1], N: [0,-1,0,0.5], S: [0,1,0,2]});

	let path = [Dir.E, Dir.E];

	let tax = 0.0;

	function segmentsFrom(path) {
		tax = 0.0;
		let s = [];
		let x = 0;
		let y = 0;
		for (let i = 0; i < path.length; i++) {
			s.push({fromX: x, fromY: y, toX: x + path[i][0], toY: y + path[i][1]});
			x += path[i][0];
			y += path[i][1];
			tax += path[i][2];
			tax *= path[i][3];
		}
		return s
	}

	$: segments = segmentsFrom(path);

	function handleKeydown(event) {
		switch (event.key) {
			case "ArrowRight":
				path = [...path, Dir.E];
				break;
			case "ArrowLeft":
				path = [...path, Dir.W];
				break;
			case "ArrowUp":
				path = [...path, Dir.N];
				break;
			case "ArrowDown":
				path = [...path, Dir.S];
				break;
			default:
				break;
		}
		keyCode = event.keyCode;
	}

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