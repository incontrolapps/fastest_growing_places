<script>
	import Axis from './Axis.svelte'
  import Path from './Path.svelte'
	import Text from "./Text.svelte"
  import { tweened } from 'svelte/motion'
	import { cubicInOut } from 'svelte/easing'
  import { interpolate } from 'flubber'
  import { geoAlbers, geoPath, geoProjection, geoMercator } from 'd3-geo'
  import { extent } from 'd3-array'
  import { onMount } from 'svelte'
  import { feature } from 'topojson'
  import { interpolateViridis } from 'd3-scale-chromatic'
  import { select, selectAll } from 'd3-selection'
  import { zm } from './zm'
  import growth from './growth.js'
  import ZoomSvg from './ZoomSvg.svelte'
  import charts from './charts'
  import { writable } from 'svelte/store';
  import {step} from './step'
  import Key from './Key.svelte'
	const padding = 20
  const width = 650 - padding*2
  const height = 650 - padding*2
  const mercator = geoMercator()
    //.rotate([4.4, 0.8])
    .center([-2, 53])
    .scale(3500)
    .translate([padding+width / 2, padding+height / 2])
  const easing = cubicInOut
	let axes
	let loaded
	
	$: console.log($zm)
  let data = []
	let timeline	
  let currentProj = mercator
 
	let path = geoPath().projection(currentProj)
var geoJsonPoint = {
    type: "Point",
    coordinates: [0,0],
} 

let Greenwich = +path({
    type: "Point",
    coordinates: [0,0],
} ).split(",")[0].slice(1);
	
let FirstMeridian = +path({
    type: "Point",
    coordinates: [10,0],
} ).split(",")[0].slice(1);
	
  let bar = {
    left: 85,
    height: 1.5,
    scale: 0.18,
  }
  let newData
  //let current = 0
	let metric
	let selected="E09000002"
	let x=0,y=0,k=1
//console.log(path().projection([0,0]))
	
  //TIMELINE ... INITIAL SETTINGS
  let timelineMaker = (arr) => {
	let y_labels=[],x_length=800,x_labels=[],y_length=500

			axes={			
						x_origin : tweened(Greenwich),
						y_origin : tweened(height+padding+(height/10)),
						x_length : width,
						y_length : height,
						hoz_bar:[y_labels.map(e=>e.length)],
						vert_bar:[],//x_labels.map(e=>e.length),
						x_offset : tweened((Greenwich-FirstMeridian)/10),
						y_offset: tweened((Greenwich-FirstMeridian)/10),
						labelRotation:0,
						x_zero:0,
						y_zero:0,
						xTicks:true,
						yTicks:true,
						xAxis:1,
						yAxis:1,
						verticalStrokes:false,
						horizontalStrokes:true
			}
		console.log("axes", axes)
    let x = []
    arr.forEach((e, i) => {
      x.push({
        d: tweened(arr[i].xys, { duration: 50, interpolate }),
        centroid: arr[i].centroid,
        fill: writable(arr[i].colour),
        fillOpacity: tweened(1, { duration: 0, interpolate }),
        title: writable(arr[i].properties.AREANM),
				area_cd: writable(arr[i].properties.AREACD),
        value: writable(arr[i].growth),
				metric: writable("% change"),
        mouseover: mouseover,
        mouseout: mouseout,
				pop:arr[i].pop,
				y:writable(arr[i].centroid[1]),
				selected:arr[i].properties.AREACD==selected,
				label_opacity:tweened(0),
        zoom:arr[i].zoom
      })
    })
    return x
  }

	let zoomState={
x:tweened(x, {duration:200}),
y:tweened(y, {duration:200}),
k:tweened(k, {duration:200})
}
  let mouseover = function (d) {
    let title = d.target.getAttribute('title')
    let value = d.target.getAttribute('value').toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
		let pop = d.target.getAttribute('pop')
		let metric = d.target.getAttribute('metric')
    select('.tooltip').style('opacity', 1)
    select('.tooltip')
      .html(title + '<br>' + value + metric)
      .style('left', d.clientX + 10+ 'px')
      .style('top', d.clientY - 28 + 'px')
  }
	
  let mouseout = function (d) { select('.tooltip').style('opacity', 0) }
	
  function redrawData(datas, zm) {
		console.log("PATH",path.centroid({lat:0,long:0}))
    data.forEach(
      (e) =>
        (e.growth = growth.find((el) => el.LAD17CD == e.properties.AREACD) || {
          GROWTH: 0,
          TOTAL11: 0,
        }),
    )
    data.forEach((e) => {
      let obj = e.growth
      e.growth = +obj.GROWTH/100
			e.pop = +obj.TOTAL11
			e.abs = Math.round((+obj.GROWTH/100)*(+obj.TOTAL11)/100)
    })
    data.forEach((e) => (e.centroid = path.centroid(e)))
		data.forEach((e) => (e.y = path.centroid(e)[1] *-1))
    data.forEach((e) => (e.xys = path(e)))
    data.forEach((e) => (e.bounds = path.bounds(e)))
    data.forEach((e)=>e.zoom=Math.sqrt(1/(Math.max(...[e.bounds[1][0]-e.bounds[0][0],e.bounds[1][1]-e.bounds[0][1]])/width)))
		data.forEach((e) => (e.colour= interpolateViridis(1-scaleColor(e.growth,datas,"growth"))))
		
		console.log(data)
    let extents = {
      pop: extent(datas.map((e) => e.pop)),
      growth: extent(datas.map((e) => e.growth)),
			abs:	extent(datas.map((e) => e.abs)),
    }
    data = data.filter((e) => e.growth !== null)//REMOVE ANY DUD DATA
    data = data.sort((a, b) => b.growth - a.growth)//SORT BY GROWTH TO ALLOW VISIBILITY

//% GROWTH BAR CHART

		bar.height=(height)/data.length
		bar.left=padding+(Math.abs(extents.growth[0])/(extents.growth[1]-extents.growth[0]))*width
		bar.scale=(1/(extents.growth[1]-extents.growth[0]))*width

		let chart=charts.find(e=>e.chart=="bar")
		chart.axis.x.origin=bar.left
		chart.axis.x.spacing=width/10
		chart.axis.y.origin=height+padding
		chart.axis.y.spacing=height/10

    data.forEach(
			
      (e, i) =>
        (e.bar = `M${bar.left} ${i * bar.height + padding}, ${
          bar.left + e.growth * bar.scale 
        } ${i * bar.height + padding}, ${bar.left + e.growth *  bar.scale } ${
          bar.height + i * bar.height
        + padding},${bar.left} ${bar.height + i * bar.height+ padding }Z`),
    )
//ABSOLUTE SPIKES ON MAP

		chart=charts.find(e=>e.chart=="absolute")
		chart.axis.x.origin=Greenwich
		chart.axis.x.spacing=(Greenwich-FirstMeridian)/10
		chart.axis.y.origin=height+padding+(height/10)
		chart.axis.y.spacing=(Greenwich-FirstMeridian)/10	
		
		data=data.sort((a,b)=>b.abs-a.abs)
	    data.forEach((e, i) => {
      let peak = e.pop>e.growth/10?e.pop * (e.growth/60000):1

      e.absolute = peak!==1?`M${e.centroid[0]},${e.centroid[1]} ${e.centroid[0]-4},${e.centroid[1]} ${e.centroid[0]},${e.centroid[1]-(peak)} ${e.centroid[0]+4},${e.centroid[1]}z`:`M${e.centroid[0]-4}, ${e.centroid[1]} a${4},${4} 0 1,0 ${4 * 2},0 a${4},${4} 0 1,0 ${(4 * -2)},0`
    })	

	//ABSOLUTE BAR
		
		bar.height=(height)/data.length
		bar.left=padding+(Math.abs(extents.abs[0])/(extents.abs[1]-extents.abs[0]))*width
		bar.scale=(1/(extents.abs[1]-extents.abs[0]))*width
	
		chart=charts.find(e=>e.chart=="absoluteBar")
		chart.axis.x.origin=bar.left
		chart.axis.x.spacing=width/10
		chart.axis.y.origin=height+padding
		chart.axis.y.spacing=height/10	
		
		data.forEach((e, i) => {
      let absolute = e.abs
      e.absoluteBar = `M${bar.left} ${i * bar.height+ padding}, ${
          bar.left + absolute * bar.scale} ${i * bar.height+ padding}, ${bar.left + absolute * bar.scale} ${
          bar.height + i * bar.height+ padding
        },${bar.left} ${bar.height + i * bar.height+ padding}Z`
    })		
	    data = data.sort((a, b) => b.growth - a.growth)//SORT BY GROWTH TO ALLOW VISIBILITY			

    
 	//CURRENT POPULATION BAR
		
   bar.height=(height)/data.length
		bar.left=padding+(Math.abs(extents.pop[0])/(extents.pop[1]-extents.pop[0]))*width
		bar.scale=(1/(extents.pop[1]-extents.pop[0]))*width
	
		chart=charts.find(e=>e.chart=="popBar")
		chart.axis.x.origin=bar.left+width/10
		chart.axis.x.spacing=width/10
		chart.axis.y.origin=height+padding
		chart.axis.y.spacing=height/10	

    let Data=JSON.parse(JSON.stringify(data)).sort((a,b)=>b.pop-a.pop)
      Data.forEach((e, i) => {
      let absolute = e.pop
      data.find(el=>el.y-e.y==0).popBar = `M${bar.left} ${i * bar.height+ padding}, ${
          bar.left + absolute * bar.scale} ${i * bar.height+ padding}, ${bar.left + absolute * bar.scale} ${
          bar.height + i * bar.height+ padding
        },${bar.left} ${bar.height + i * bar.height+ padding}Z`
    })		
	    data = data.sort((a, b) => b.growth - a.growth)//SORT BY GROWTH TO ALLOW VISIBILITY			

	//POPULATION CIRCLES ON MAP	
		chart=charts.find(e=>e.chart=="circle")
		chart.axis.x.origin=Greenwich
		chart.axis.x.spacing=(Greenwich-FirstMeridian)/10
		chart.axis.y.origin=height+padding+(height/10)
		chart.axis.y.spacing=(Greenwich-FirstMeridian)/10	
		

		
    data.forEach((e, i) => {
      let radius = Math.sqrt(e.pop / (8000))
      e.circle = `M${e.centroid[0] - radius},${
        e.centroid[1]
      } a${radius},${radius} 0 1,0 ${radius * 2},0 a${radius},${radius} 0 1,0 ${
        radius * -2
      },0Z`
    })

  
    	//COMPARATIVE POPULATION CIRCLES
		chart=charts.find(e=>e.chart=="comparative_circle")
		chart.axis.x.origin=Greenwich
		chart.axis.x.spacing=(Greenwich-FirstMeridian)/10
		chart.axis.y.origin=height+padding+(height/10)
		chart.axis.y.spacing=(Greenwich-FirstMeridian)/10	
		

		let radius_prev=0
    Data=JSON.parse(JSON.stringify(data)).sort((a,b)=>b.pop-a.pop)
    Data.forEach((e, i) => {
      let radius = Math.sqrt(e.pop / (8000))
      data.find(el=>el.y-e.y==0).comparative_circle = `M${padding},${padding + radius_prev} a${radius},${radius} 0 1,0 ${radius * 2},0 a${radius},${radius} 0 1,0 ${
        radius * -2
      },0Z`
      radius_prev+=radius/2.3
    })

//SMALL POPULATION CIRCLES FOR ZOOMING
		
    data.forEach((e, i) => {
      let radius = Math.sqrt(e.pop / 80000)
      e.small_circle = `M${e.centroid[0] - radius},${
        e.centroid[1]
      } a${radius},${radius} 0 1,0 ${radius * 2},0 a${radius},${radius} 0 1,0 ${
        radius * -2
      },0Z`
    })
//SCATTER CHART X=POPULATION SIZE, Y=GROWTH
	
		
		chart=charts.find(e=>e.chart=="scatter")
		chart.axis.x.origin=bar.left
		chart.axis.x.spacing=width/10
		chart.axis.y.origin=height-((Math.abs(extents.growth[0])/(extents.growth[1]-extents.growth[0]))*height)+(padding*2)
		chart.axis.y.spacing=height/10	
		
    data.forEach((e, i) => {
      let radius = Math.sqrt(e.pop / 8000)
      let p = (((width-(padding*2))*e.pop) / extents.pop[1]-extents.pop[0]) //e.pop/1000
      let g = (height-(padding*2))-((height*e.growth)/(extents.growth[1]-extents.growth[0]))
      e.scatter = `M${bar.left + p - radius}, ${g+radius} a${radius},${radius} 0 1,0 ${
        radius * 2
      },0 a${radius},${radius} 0 1,0 ${radius * -2},0Z`
    })
    timeline = timelineMaker(data)
    setTimeout(function(){loaded=true},1000)
    return data
  }

  onMount(async function () {
		
    const response = await fetch( 'https://raw.githubusercontent.com/ONSvisual/topojson_boundaries/master/geogLA2021EW.json',
    )
    const json = await response.json()
    const topoData = feature(json, json.objects.geog)
    const land = {
      ...topoData,
      features: topoData.features,
    }
    data = land.features
    newData = redrawData(data, 1)
  })

  //const scaleExtent = extent(growth.map((e) => e.GROWTH))
  const scaleColor = (val, dataSet, data) =>{
  	let scaleExtent = extent(dataSet.map((e) => e[data]))
		return  val == null
      ? 0.5
      : (val - scaleExtent[0]) / (scaleExtent[1] - scaleExtent[0])
}

//console.log(Object.keys(new_charts[0]))
  function forward(current) {
//console.log("SHAPES",selectAll('.shape').sort((a,b) => ascending(a.y, b.y)))
		axes.x_origin.set(charts[current].axis.x.origin)
		axes.x_offset.set(charts[current].axis.x.spacing)
		axes.y_origin.set(charts[current].axis.y.origin)
		axes.y_offset.set(charts[current].axis.y.spacing)
		
		//newData = newData.sort((a, b) => (b[charts[current].sort_by])-(a[charts[current].sort_by]))
    let triggerZoom=0
   // let zoomFactor=charts[current].zoom
    let item=select(document.getElementById("selected"))
    let itemScale=item.attr("zoom")
    let zoomFactor=charts[current].zoom*itemScale    
		let focus = select(document.getElementById("selected")).attr("centroid").split(',').map((e,i)=>i==0?(width/2)-(zoomFactor*e):(-zoomFactor*e)+(height/2))


if (zoomFactor){
  zm.set(zoomFactor)
	timeline.forEach((step, i) => step.label_opacity.set(1,{duration:charts[current].duration, easing}))
	zoomState.x.set(focus[0],{ duration:charts[current].duration, easing})
	zoomState.y.set(focus[1],{ duration:charts[current].duration, easing})
	zoomState.k.set(zoomFactor,{ duration:charts[current].duration, easing})
}		else {
  zm.set(1)
	timeline.forEach((step, i) => step.label_opacity.set(0,{duration:10, easing}))
	zoomState.x.set(0,{ duration:charts[current].duration, easing})
	zoomState.y.set(0,{ duration:charts[current].duration, easing})
	zoomState.k.set(1,{ duration:charts[current].duration, easing})
}
    let count = 0

    timeline.forEach((step, i) => {
      count++
      step.d.set(newData[i][charts[current].chart], {
        duration: charts[current].duration,
        delay: charts[current].delay * i,
        interpolate
      })
			 	//step.value= arr[i].growth/100
				step.metric.set(charts[current].tooltip_metric)
				step.value.set(newData[i][charts[current].value])
				step.title.set(newData[i].properties.AREANM)
				step.fill.set(newData[i].colour)
      //	console.log(count,newData[i].xys)
    })
    //current = (current + 1) % charts.length
  }
	
	function back() {current = (current + charts.length - 2) % charts.length;
									 forward()
									}
$: $step && axes && loaded && forward($step)
</script>

<style>
  .tooltip {
    position: fixed;
    text-align: center;
    width: fit-content;
    height: fit-content;
    padding: 4px;
    font: 12px sans-serif;
    background: lightsteelblue;
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
  }


</style>



<ZoomSvg zm={$zm} {...zoomState} viewBox="0 0 650 650">
  {#if timeline}
	<Axis {...axes}/>
    {#each timeline as feature, i}
      <Path {...feature} />
	{/each}
    {#each timeline as feature, i}
   <Text {...feature}></Text>
	{/each}
	<use xlink:href="#selected"/>
	<use xlink:href="#selectedText"/>	
  {/if}
</ZoomSvg>
<div class="tooltip" style="opacity:0" />
<Key percent={true} key='percentage growth' uk=7.9 place=13.4 max=30 min={-5} step={$step}></Key>