<script>
  // CORE IMPORTS
  import { setContext, onMount } from 'svelte'
  import { getMotion } from "./utils.js";
  import Scroller from './layout/Scroller.svelte'
  import Section from './layout/Section.svelte'
  import { themes } from "./config.js";
  import ONSHeader from "./layout/ONSHeader.svelte";
	import ONSFooter from "./layout/ONSFooter.svelte";
	import Header from "./layout/Header.svelte";
	import Media from "./layout/Media.svelte";
	import Filler from "./layout/Filler.svelte";
	import Divider from "./layout/Divider.svelte";
	import Toggle from "./ui/Toggle.svelte";
	import Arrow from "./ui/Arrow.svelte";
	import Em from "./ui/Em.svelte";
  import SC1 from './SC1.svelte'
  import Map1 from './Map1.svelte'
  import Tab_H3 from './H3.svelte'
  import Tab_P from './P.svelte'
  import Animated_charts from './vis_components/animated_charts/src/App.svelte'
  import { getData, setColors, getTopo, getBreaks, getColor } from "./utils.js";
  // import archie from './scroll_section'
  import { load } from 'archieml' //this is the parser from ArchieML to JSON
	import robojournalist from 'robojournalist';
  import Vis1 from "./vis_components/vis1/App.svelte";
  import { all_data } from './stores.js';
import { exclude_internal_props } from 'svelte/internal';
	let theme = "light";
  let animation = getMotion(); // Set animation preference depending on browser preference
  import { writable } from 'svelte/store';
  import {step} from './vis_components/animated_charts/src/step'
  import  { disableScroll,enableScroll } from './disableScroll'
  import { zm } from './vis_components/animated_charts/src/zm'


	setContext("theme", theme);
	setColors(themes, theme);

  $: console.log($all_data)

  export let story

  fetch('./script.aml')
    .then((res) => res.text())
    .then((txt) => {
      story = load(txt).ScrollY
    })
  $: console.log(story)

  let components = {
    Animated_charts: Animated_charts,
    LA_selector_map: Vis1,
    SC1: SC1,
    Tab_H3: Tab_H3,
    Tab_P: Tab_P,
    Map1:Map1
  }
  let content = ''

  // Code to run Scroller actions when new caption IDs come into view
  // State : All variables named in ArchieML to manipulate charts and maps should be listed here with starting values (same values as those in the 'foreground' section of the ArchieML)
  let xKey = 'area' // xKey for scatter chart
  let yKey = null // yKey for scatter chart
  let zKey = null // zKey (color) for scatter chart
  let rKey = null // rKey (radius) for scatter chart
  let explore = false // Allows chart/map interactivity to be toggled on/off
  let rubbish //note that if a variable is named in runActions but is not in the global scope, the app wont work
  let mapKey = "density"; // Key for data to be displayed on map
  let geojson;
	// Element bindings
	//let map = null; // Bound to mapbox 'map' instance once initialised
  let map;
  function fitBounds(bounds) {
    console.log(map)
    alert("fittingBounds")
		if (map) {
			map.fitBounds(bounds, {animate: animation, padding: 30});
		}}
	// State
	let hovered; // Hovered district (chart or map)
	let selected; // Selected district (chart or map)
	let datasets;
	let topojson;
	let mapstyle;
	const mapbounds = {
		uk: [
			[-9, 49 ],
			[ 2, 61 ]
		],
        ew:[
            [-5.6,49.5],
            [2,56]
        ]
	};

	let mapHighlighted = [];
  let data;
  let metadata;
  let bounds;


  
  $: console.log(metadata)
	$: region = selected && metadata.district.lookup ? metadata.district.lookup[selected].parent : null; // Gets region code for 'selected'
//	$: chartHighlighted = metadata.district.array && region ? metadata.district.array.filter(d => d.parent == region).map(d => d.code) : []; // Array of district codes in 'region'
  $: bounds && fitBounds(bounds)
 

  // CONFIG FOR SCROLLER COMPONENTS
  const threshold = 0.9
  let offset
  let id = {} // Object to hold visible section IDs of Scroller components
  let idPrev = {} // Object to keep track of previous IDs, to compare for changes

  //$: offset && (offset > 0.5) && disableScroll()// && setTimeout(enableScroll,500)
  function runActions(codes = []) {
    codes.forEach((code) => {
      if (id[code] != idPrev[code]) {
        step.set(id[code])
        console.log(code)
        idPrev[code] = id[code]
      }
    })
  }


  onMount(() => {
    idPrev = { scatterChart: 'scatterChart01' }
    console.log(id)
    step.set(0)
  })
//$: console.log(id)

  $: id && runActions(Object.keys(id)) // Run above code when 'id' object changes
  $: props = {
    SC1: { xKey, yKey, zKey, rKey, explore },
    Map1: { bounds, mapKey, mapHighlighted, explore }
  }

$: console.log(map)
$: {if(step) console.log("STEP",$step)}
$: document.querySelector("#selected") && console.log("bbox",document.querySelector("#selected").getBBox())
</script>

{#if story}
<ONSHeader filled={true} center={false} />


<Header bgcolor="#206095" bgfixed={true} theme="dark" center={false} short={true}>
	<h1>{story[0].Part.headline}</h1><br>
	<p class="text-big" style="margin-top: 5px">
		{story[0].Part.lede}
	</p>
	<p style="margin-top: 20px">
		16 December 2021
	</p>
	<p>
		<Toggle label="Animation {animation ? 'on' : 'off'}" mono={true} bind:checked={animation}/>
	</p>
	<div style="margin-top: 90px;">
		<Arrow color="white" {animation}>Scroll to begin</Arrow>
	</div>
</Header>

<Filler theme="lightblue" short={true} wide={true} center={false}>
	<p class="text-big">
		{story[0].Part.nutgraf}
	</p>
</Filler>
<!--
<Section>
	<h2>{story[0].Part.start.content}</h2>
<Vis1/>
</Section>
<Divider/>
-->

{#if $all_data}
  {#each story as chunk, i}
    {#if chunk.Part.type === 'Scroller'}
      <Scroller {threshold} bind:offset={offset} bind:id={id[(chunk.Part.family)]} splitscreen={true}>
        <div slot="background">

                <svelte:component
                  this={components[chunk.Part.background]}
                  {...props[chunk.Part.background]} 
                  />

        </div>
        <div slot="foreground">
          {#each chunk.Part.foreground as section}
            <section {...section.section.actions}>
              {#if section.section.content && typeof section.section.content == 'object'}
                <div class="col-medium">
                  {#each Object.keys(section.section.content) as type}
                    <svelte:component
                      this={components[type]}
                      content={section.section.content[type]} />
                  {/each}
                </div>
              {:else}
                <div class="col-medium">
                  <p>
               {@html robojournalist(section.section.content,$all_data)}
                  </p>
                </div>
              {/if}
            </section>
          {/each}
        </div>
      </Scroller>
    {/if}
    {#if chunk.Part.type === 'Filler'}
    <Filler theme="lightblue" short={true} wide={true} center={false}>
      <p class="text-big">
        {@html robojournalist(chunk.Part.content,$all_data)}
      </p>
    </Filler>
    {/if}
  {/each}
{/if}
<Divider/>


{/if}






<style>
	/* Styles specific to elements within the demo */
/*	:global(svelte-scroller-foreground) {
		pointer-events: none !important;
	}
	:global(svelte-scroller-foreground section div) {
		pointer-events: none !important;
	}
	:global(svelte-scroller-background-container) {
		pointer-events: all !important;
	}
	:global(svg) {
		pointer-events: all !important;
	}*/

	select {
		max-width: 350px;
	}
	.chart {
		margin-top: 45px;
		width: calc(100% - 5px);
	}
	.chart-full {
		margin: 0 20px;
	}
	.chart-sml {
		font-size: 0.85em;
	}
	/* The properties below make the media DIVs grey, for visual purposes in demo */
	.media {
		background-color: #f0f0f0;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-flow: column;
		flex-flow: column;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		text-align: center;
		color: #aaa;
	}
</style>