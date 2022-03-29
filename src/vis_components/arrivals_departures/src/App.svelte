<script>
  import { interpolateViridis } from 'd3-scale-chromatic'
  import { extent } from 'd3-array'
  let bars
  import { writable } from 'svelte/store';
  let f = 200
 let pyramidStore=writable();
	import data from './data.js'
	pyramidStore.set(data)
	
  $: {
    bars = []
let counter=0
    for (let i in $pyramidStore) {
			counter++
      let e = $pyramidStore[i]
			let x=e<0?f+160:f+40-(e*5), y=counter * f/6, width = Math.abs(e)*5,height=30;
      bars.push({
				year:i,
        width:width,
        height: height,
				points: `${x},${y} ${x+width-(height/2)},${y} ${x+width},${y+(height/2)} ${x+width-(height/2)},${y+height} ${x},${y+height}`,
				fill:e<0?'rgb(66, 63, 133)':'rgb(108, 205, 90)'
    })
      bars.push({
				year:i,
        x: f+60,
        y: y,
				points: `${f+160},${y} ${f+40},${y} ${f+40},${y+height} ${f+160},${y+height}`,
				fill:"slategrey"
    })			
			
			
		}
    //console.log("BARS",bars)
  }
</script>

{#if bars}
  <svg width="1000" height="1000">
    {#each bars as props}
      <polygon {...props} rx="6" />
      <text
        x={props.x+40}
        y={props.y +20}
        text-anchor="middle"
        fill="white"
        font-size="18">
        {+props.year +1} to {+props.year+5}
      </text>
    {/each}
    <text
      x={f+40}
      y={20}
      fill="black"
      text-anchor="end"
      font-size="18"
      >
      net arrivals
    </text>
    <text
      x={f + 160}
      y={20}
      fill="black"
      text-anchor="start"
      font-size="18"
      >
      net departures
    </text>
		  <text
      x={f +100}
      y={580}
      fill="black"
      text-anchor="middle"
      font-size="18"
      >
      approximate period of birth
    </text>
    <text>male</text>

  </svg>
{/if}