<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { BitField } from '../util/bitfield';

  import Button from 'sveltestrap/src/Button.svelte'
  import Toast from 'sveltestrap/src/Toast.svelte'
  import ToastHeader from 'sveltestrap/src/ToastHeader.svelte'
  import ToastBody from 'sveltestrap/src/ToastBody.svelte'
  import Alert from 'sveltestrap/src/Alert.svelte'

  const X_SIZE = 4;
  const Y_SIZE = 4;

  const horizontalRoads = new BitField((X_SIZE + 1)*(Y_SIZE+1));
  const verticalRoads = new BitField((X_SIZE + 1)*(Y_SIZE+1));

  let playerHasEngaged;
  let noWayOut,goalReached,puzzleSolved,gameOver;
  let x = 0;
  let y = 0;
  let tax = 0.0;
  let segments = [];
  let outs;
  let taxOp = "";

  $: goalReached = x == X_SIZE && y == Y_SIZE;
  $: puzzleSolved = goalReached && tax == 0;
  $: noWayOut = !puzzleSolved && !goalReached && outs.length == 0;
  $: gameOver = goalReached || puzzleSolved || noWayOut;
  $: outs = possibleOuts(x, y);

  const idx = (x, y) => y * (Y_SIZE + 1) + x;

  function startGame() {
    x = 0;
    y = 0;
    tax = 0.0;
    segments = [];
    for (let i = 0; i <= X_SIZE; i++) {
      for (let j = 0; j <= X_SIZE; j++) {
        horizontalRoads.set(idx(i,j), false);
        verticalRoads.set(idx(i,j), false);
      }
    }
    addSegment(Dir.E);
    addSegment(Dir.E);
  }

  const Dir = Object.freeze({
		E: [1,0,2,1,'E','+2'],
		W: [-1,0,-2,1,'W','−2'],
		N: [0,-1,0,0.5,'N','÷2'],
		S: [0,1,0,2,'S','×2']
	});

	function makeSegment(x, y, dir) {
		return {fromX: x, fromY: y, toX: x + dir[0], toY: y + dir[1]};
	}

	function addIfPossible(outs, x, y, dir) {
		if (x + dir[0] > X_SIZE || x + dir[0] < 0 || y + dir[1] > Y_SIZE || y + dir[1] < 0) return;
		if (dir[0] !== 0) {
			const i = idx(Math.min(x, x + dir[0]), y);
			if (horizontalRoads.get(i)) return;
		} else { // dir[1] !== 0
			const i = idx(x, Math.min(y, y + dir[1]));
			if (verticalRoads.get(i)) return;
		}
		outs.push(dir);
	}

	function possibleOuts(x, y) {
		const rewOuts = [];
    for (const dir of Object.values(Dir)) {
      addIfPossible(rewOuts, x, y, dir);
    }
		return rewOuts;
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
    taxOp = dir[5];
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
    if (gameOver) {
      console.log("Re-Starting game. ", event.key);
      startGame();
      return;
    }
		const dir = dirFrom(event);
		if (dir !== undefined) {
		  playerHasEngaged = true;
			addSegment(dir);
		} else {
      console.log(event.key);
      // if (event.key == "Escape") if (isOpen) restart();
    }
	}

	onMount(async () => {
    startGame();
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

{#if !playerHasEngaged}
  <Alert color="success">
    <p style="margin-top: 2em" class="animated infinite bounce delay-2s">Use the arrow keys to reach the goal with 0.0 silver owed as tax.</p>
  </Alert>
{/if}
<Toast isOpen="{noWayOut}">
  <ToastHeader toggle="{startGame}">No way out</ToastHeader>
  <ToastBody>You cannot travel any further, because you cannot use a road more than once. Try again by pressing any key.</ToastBody>
</Toast>
<Toast isOpen="{goalReached && !puzzleSolved}">
  <ToastHeader toggle="{startGame}">Close but no cigar</ToastHeader>
  <ToastBody>You reached the goal, owing {tax} silver. It is possible to reach it owing exactly 0.0 silver. Try again by pressing any key.</ToastBody>
</Toast>
<Toast isOpen="{puzzleSolved}">
  <ToastHeader toggle="{startGame}">Great Success!</ToastHeader>
  <ToastBody>You solved it. Congratulations!</ToastBody>
</Toast>

<div class="svginside" style="max-width:480px">
	<canvas width="{LENGTH}" height="{LENGTH}"></canvas>
	<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 {LENGTH} {LENGTH}">
    <defs>
      <style>
        @import url("https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i");
      </style>
    </defs>

    {#each {length: Y_SIZE+1} as _, y}
      <line x1="{MARGIN}" y1="{MARGIN + y*SEGMENT_LENGTH}" x2="{MARGIN + Y_SIZE*SEGMENT_LENGTH}" y2="{MARGIN + y*SEGMENT_LENGTH}" stroke="lightgray" stroke-width="6"/>
    {/each}
    {#each {length: X_SIZE+1} as _, x}
      <line x1="{MARGIN + x*SEGMENT_LENGTH}" y1="{MARGIN}" x2="{MARGIN + x*SEGMENT_LENGTH}" y2="{MARGIN + X_SIZE*SEGMENT_LENGTH}" stroke="lightgray" stroke-width="6"/>
    {/each}

    <circle cx="{MARGIN + SEGMENT_LENGTH/2}" cy="{MARGIN + SEGMENT_LENGTH/2}" r="{0.8*SEGMENT_LENGTH/2}" stroke="red" stroke-width="3" fill="none"/>
    <text x="{MARGIN + SEGMENT_LENGTH/2}" y="{MARGIN + SEGMENT_LENGTH/2}"
          font-family="Roboto" dominant-baseline="central" class="animated infinite bounce delay-2s"
          text-anchor="middle" font-size="3em" stroke="blue">{taxOp}</text>
    <text x="{MARGIN + SEGMENT_LENGTH + SEGMENT_LENGTH/2}" y="{MARGIN + SEGMENT_LENGTH/2}"
          font-family="Roboto" dominant-baseline="central"
          class="animated infinite bounce delay-2s"
          text-anchor="middle" font-size="3em" stroke="blue">{tax}</text>
    <circle r="15" cx="{MARGIN + X_SIZE * SEGMENT_LENGTH}" cy="{MARGIN + Y_SIZE * SEGMENT_LENGTH}" fill='gray'/>
    {#each segments as s}
      <line
        x1="{MARGIN + s.fromX*SEGMENT_LENGTH}"
        y1="{MARGIN + s.fromY*SEGMENT_LENGTH}"
        x2="{MARGIN + s.toX*SEGMENT_LENGTH}"
        y2="{MARGIN + s.toY*SEGMENT_LENGTH}"
        stroke="orange"
        stroke-width="6"
        out:fade
      />
    {/each}
  </svg>
</div>

<p in:fly="{{ y: 200, duration: 2000 }}" out:fade>Tax: {tax} silver.</p>

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

<style>

  p,h1 {text-align: center}

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

</style>
