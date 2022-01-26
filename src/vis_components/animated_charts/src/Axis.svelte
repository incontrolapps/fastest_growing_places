<script>

export let	x_origin,
						y_origin,
						x_offset = 0,
						y_offset= 0
	
</script>


{#each Array(30) as item,i}

<!--verticals -->
  <g transform="translate({$x_origin + ($x_offset * (i-15)) },0 )">
		<line x1=0  x2=0 y1=5000 y2=-5000 stroke={i==15?"purple":"lightblue"}/>
		</g>

<!--horizontals -->
  <g transform="translate({$x_origin},
{($y_origin) - ($y_offset * (i-15))} )">
		<line x1=-500  x2=2000 y1=-0 y2=0 stroke={i==15?"purple":"lightblue"}/>
  </g>
{/each}
<style>
	line{vector-effect: non-scaling-stroke;}
</style>