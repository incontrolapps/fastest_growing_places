<script>
  import { onMount } from 'svelte'
	import {zm} from "./zm"
  export let viewBox = '0 0 300 150', height=650, width=650
	export let svg,x,y,k

</script>

<svg id="canvas" viewBox={viewBox} height={height} width={width} bind:this={svg} zm={$zm}>
  <g transform="translate({$x}, {$y}) scale({$k})" id="zoomable">
    <slot></slot>
  </g>
</svg>
<style>
  #canvas {
position: absolute;
right:0;
height:100vh;
width:100vh;
  }
</style>