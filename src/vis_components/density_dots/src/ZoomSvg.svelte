<script>
  import { onMount } from 'svelte'
  import { zoom } from 'd3-zoom'
	import {zm} from "./zm"
  import { select } from 'd3-selection'
  import {writable} from 'svelte/store'
  export let viewBox = '0 0 300 150', zf

	const w = window.innerWidth;
  const h = window.innerHeight;
	
zf=writable()
 zf.set(0)
  let svg, g
  onMount(() => {
			svg = document.getElementById("svg")
      select(svg).call(zoom().on('zoom', ({ transform }) => {
        const { k, x, y } = transform
				$zm=(k)
				zf.set($zm)
        select(g).attr('transform', `translate(${x}, ${y}) scale(${k})`)
      }))

  })
</script>

<svg id="svg" viewBox={viewBox} height={h} width={w} bind:this={svg} zm={$zm} style="position:absolute; top:0; left:0; pointer-events:none">
  <g bind:this={g}>
    <slot></slot>
  </g>
</svg>
{$zf}