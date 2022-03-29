<script>
import pitch from './pitch'
import folk from './folk'	
import { checkIntersection } from "line-intersect";
import { tweened } from 'svelte/motion'
import { cubicInOut } from 'svelte/easing'	
import { select, selectAll } from 'd3-selection'
import { all_data } from '../../../stores.js'
import { step } from '../../animated_charts/src/step'
let height = window.innerHeight
let width = window.innerWidth


let pitches=Math.ceil(187/$all_data.LA.DENSITY.DENSITY11)
let people=Math.round($all_data.LA.DENSITY.DENSITY11/187)
let intersect=checkIntersection;
let peopleHere=people

pitch.forEach(e=>{e.order=1})
let tempPitch=(i)=>{
	let x=JSON.parse(JSON.stringify(pitch))
	x.forEach(e=>{e.y1=e.y1-750*i; e.y2=e.y2-750*i; e.order=i+1})
	return x}


let newPitch=pitch
.concat(tempPitch(1))
.concat(tempPitch(2))
.concat(tempPitch(3))
.concat(tempPitch(4))
.concat(tempPitch(5))
.concat(tempPitch(6))
.concat(tempPitch(7))
.concat(tempPitch(8))
.concat(tempPitch(9))
.concat(tempPitch(10))
let points=[]
let zeds=tweened([])


for(let i=0; i<100; i++){
	$zeds.push(0)
	points.push({
	x:(Math.random()*1000)-500, 
	y:Math.random()*-500  -25,
	scale:1,
	order:i+1,
	z:$zeds[i]
})}
	
//for(let i=0; i<10; i++)$zeds[i]=-100
function changePeople(count){
	let peopleAtStart=people;
	if (count<1){
	let addPitches=setInterval(function(){

	if (pitches<numberPitches)pitches++
	if (pitches>numberPitches)pitches--
	if (pitches==numberPitches)clearInterval(addPitches);
},100)}
	if (count>=1){
	let removePitches=setInterval(function(){
	if (pitches>1)pitches--
	if (pitches==1)clearInterval(removePitches);
},100)}
let addPeople=setInterval(function(){
	if (people<count)people++
	if (people>count)people--
	if (people==count || people<2)clearInterval(addPeople);
},500/(Math.abs(peopleAtStart-count)))
}
	
function newPeople(count){
	let newArr= JSON.parse(JSON.stringify($zeds))
for(let i=0; i<count; i++)newArr[i]=0
zeds.set(newArr,{duration:600, easing:cubicInOut})
}
//set vanishing point
let vp=300
//set vertical squash factor
let h=vp
//define initial height
let h_orig=pitch[0].y1*-1
//offset all points by 0.5px to avoid pooints falling on zero
newPitch.forEach(e=>{e.x1=e.x1+0.5; e.x2=e.x2+0.5; e.y1=e.y1-0.5; e.y2=e.y2-0.5})
//function for reprojecting points to perspective
let project=(x,y)=>intersect(0,0,(-h_orig/y*x),-h,0,-vp,x,0).point
//reproject all points
newPitch.forEach(e=>{
e.x1= project(e.x1,e.y1).x
e.y1= project(e.x1,e.y1).y
e.x2= project(e.x2,e.y2).x
e.y2= project(e.x2,e.y2).y
})
points.forEach(e=>{
let eX=e.x,eY=e.y
e.x= project(e.x,e.y).x
e.y= project(e.x,e.y).y
e.scale = e.x/eX
e.skew = Math.atan2(eY + e.y, e.x - eX)*180*Math.PI
})	
	console.log(points)
let stepPrev;

    function change(step) {
      if (step != stepPrev) {
        if (step == 10) changePeople(80)
        if (step == 9) changePeople(peopleHere)
        if (step == 11) changePeople(0.15)
        stepPrev = step
       // timeline(step)
      }
    }

  
  $: $step && change($step)
</script>

<div>


<svg width={width} height={height} viewBox="{-width/4} {-height/2} {width/2} {h_orig}" >	
	<rect x={-width/2} y={-height/2} width={width} height={height} fill="#40826D" fill-opacity=0.7/>
<g transform="scale(1.2)">

	{#each newPitch as params}
<line {...params} stroke=white stroke-width={(1/params.order)*3} stroke-opacity=1 visibility={params.order>pitches?"hidden":"visible"}/>
{/each}
	{#each points as point,i}	
<!--<circle cx={point.x} cy={point.y} r={6*point.scale}/>-->
	<g class="shadow" transform="translate({point.x-14}, {point.y-25.5}) scale({6*point.scale})" >
<path d={folk[(i%45)].shadow} fill="#40826D" transform="rotate(-10 50 100) translate(15 -5) skewX(40) scale(1 0.5)" visibility={(point.order>people||$zeds[i]!=0)?"hidden":"visible"}/>	
		</g>
	{/each}
	{#each points as point,i}	
<!--<circle cx={point.x} cy={point.y} r={6*point.scale}/>-->
	<g class="person" transform="translate({point.x-14}, {point.y-25.5}) scale({6*point.scale}) translate({0}, {$zeds[i]}) " >
<path d={folk[(i%45)].shadow} fill=black visibility={point.order>people?"hidden":"visible"}/>	
</g>
	{/each}
	</g>
</svg>
</div>