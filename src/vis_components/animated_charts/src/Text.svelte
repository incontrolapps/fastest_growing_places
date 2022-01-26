<script>
	import {zm} from './zm'
	export let d,centroid,fill,fillOpacity,title,mouseover,mouseout,value,pop,metric,y,selected,area_cd,label_opacity
</script>


<text class="titles" x={centroid[0]} y={centroid[1]} text-anchor=middle font-size={9/$zm} opacity={$label_opacity} style="pointer-events: none;" id={selected?"selectedText":null}>
	{$title}
</text>