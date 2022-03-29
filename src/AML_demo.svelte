<script>
  // SCROLLY IMPORTS
  import { setContext, onMount } from 'svelte'
  import { getMotion } from './utils.js'
  import Scroller from './layout/Scroller.svelte'
  import { themes } from './config.js'
  import Filler from './layout/Filler.svelte'
  import Divider from './layout/Divider.svelte'
  import { getData, setColors, getTopo, getBreaks, getColor } from './utils.js'

// VIS COMPONENTS
  import SC1 from './SC1.svelte'
  import Map1 from './Map1.svelte'
  import Tab_H3 from './H3.svelte'
  import Tab_P from './P.svelte'
  import Animated_charts from './vis_components/animated_charts/src/App.svelte'
  import Football from './vis_components/football/src/App.svelte'
  import Pyramids from './vis_components/animated_pyramids/src/App.svelte'
  import Vis1 from './vis_components/vis1/App.svelte'
  
  // ARCHIEML AND ROBO
  import { load } from 'archieml' //this is the parser from ArchieML to JSON
  import robojournalist from 'robojournalist'  //for parsing robojournalism from ArchieML
  
  
  import { all_data } from './stores.js'    //the data store for hydrating robojournalism and charts
  import { step } from './vis_components/animated_charts/src/step' //a variable store that tells animated charts when to change


  let theme = 'light'
  let animation = getMotion() // Set animation preference depending on browser preference
  

  setContext('theme', theme)
  setColors(themes, theme)

  export let story

  fetch('./script.aml')
    .then((res) => res.text())
    .then((txt) => {
      story = load(txt).ScrollY
    })


  let components = {
    Animated_charts: Animated_charts,
    Football: Football,
    Pyramids: Pyramids,
    LA_selector_map: Vis1,
    SC1: SC1,
    Tab_H3: Tab_H3,
    Tab_P: Tab_P,
    Map1: Map1,
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
  let mapKey = 'density' // Key for data to be displayed on map
  let geojson
  // Element bindings
  //let map = null; // Bound to mapbox 'map' instance once initialised
  let map
  function fitBounds(bounds) {
    //  console.log(map)
    alert('fittingBounds')
    if (map) {
      map.fitBounds(bounds, { animate: animation, padding: 30 })
    }
  }


  // CONFIG FOR SCROLLER COMPONENTS
  const threshold = 0.9
  let offset
  let id = {} // Object to hold visible section IDs of Scroller components
  let idPrev = {} // Object to keep track of previous IDs, to compare for changes

  function runActions(codes = []) {
    codes.forEach((code) => {
      if (id[code] != idPrev[code]) {
        step.set(id[code])
        idPrev[code] = id[code]
      }
    })
  }

  onMount(() => {
    idPrev = { scatterChart: 'scatterChart01' }
    step.set(0)
  })

  $: id && runActions(Object.keys(id)) // Run above code when 'id' object changes

</script>

{#if story}
  {#if $all_data}
    {#each story as chunk, i}
      {#if chunk.Part.type === 'Scroller'}
        <Scroller
          {threshold}
          bind:offset
          bind:id={id[chunk.Part.family]}
          splitscreen={true}>
          <div slot="background">
            <svelte:component
              this={components[chunk.Part.background]}
              {...props[chunk.Part.background]} />
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
                      {@html robojournalist(section.section.content, $all_data)}
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
            {@html robojournalist(chunk.Part.content, $all_data)}
          </p>
        </Filler>
      {/if}
    {/each}
  {/if}
  <Divider />
{/if}



<style>
    :global(.nutgraf) {
      height: 100vh;
      left: 0;
    }
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