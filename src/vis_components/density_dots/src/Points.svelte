 <script> 
		import densitydots from './densitydots'
		let spacing=10
		import {tweened}from 'svelte/motion'

		densitydots.forEach(e=>e.r=0.8365273562270824)	 
		let radii=tweened(densitydots.map(e=>e.r))
		densitydots.forEach(e=>e.r=Math.sqrt(e.colour/255)*(spacing/1.5))	 
		radii.set(densitydots.map(e=>e.r),{duration: 5000})
</script>

{#each densitydots as obj, i}
<circle cx={spacing * obj.cx - spacing/2} cy={spacing * obj.cy - spacing/2} r={$radii[i]} 
				fill=black></circle>
{/each}