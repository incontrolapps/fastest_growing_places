<script>
	import {zm} from "./zm"
	import Points from './Points.svelte'
	import ZoomSvg from './ZoomSvg.svelte'
	let w=window.innerWidth;
	let h=window.innerHeight;
$: $zm && console.log($zm)
	
</script>
	
<ZoomSvg  {$zm} viewBox="0 0 {w} {h}">
<Points></Points>
</ZoomSvg>

