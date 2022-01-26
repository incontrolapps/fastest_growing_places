<script>
  import { Map, MapSource, MapLayer } from '@onsvisual/svelte-maps'
  import { all_data } from '../../stores.js';
  let map3
  import lookup from './lookup'
  import bb from '@turf/bbox';


  import { getData, getColor, getTopo, getBreaks } from './utils'
  import { colors, laBounds, baseMaps, bounds } from './config'
  // Data
  let data = {}
  let geojson

  // State
  let zoom
  let center = {}
  let hovered, selected
  let newarr
  let obj = {}

  // Get geometry for geojson maps
  getTopo(laBounds.url, laBounds.layer)
    .then((res) => {
      geojson = res
      console.log(geojson)
      newarr = res.features
        .map((e) => [e.properties.AREACD, e.properties.AREANM])
        .sort((a, b) => a[1].localeCompare(b[1]))
      return newarr
    })
    .then((r) => {
      for (let i = 0; i < r.length; i++) {
        obj[r[i][0]] = r[i][1]
      }
      console.log(obj) //.sort((a,b) => a[1].localeCompare(b[1])))
    })


  function zoomTo(e) {
    console.log(e)
   fetch('http://localhost:8000/' + e)
      .then((res) => res.json())
      .then((json) => $all_data=json)
	  .then(()=>map3.fitBounds(bb((geojson.features.filter((el) => el.properties.AREACD == e)[0])),{'padding':20}))
  }


//let Zoom = (e) => map3.fitBounds(bb((geojson.features.filter((el) => el.properties.AREACD == e)[0])),{ padding: 20 })

//$: Zoom(selected)

$: zoomTo(selected)
</script>

<style>
  .map {
    height: 680px;
    width: 680px;
  }
</style>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://ons-design-system.netlify.app/css/main.css" />

</svelte:head>
<div>
  <div class="map">
    {#if geojson}
      <Map
        id="map3"
        style={baseMaps.osmGrey}
        bind:map={map3}
        location={{ bounds: bounds.ew }}
        controls={false}>
        <MapSource
          id="localAuthority"
          type="geojson"
          data={geojson}
          promoteId={laBounds.code}
          maxzoom={13}>
          <MapLayer
            id="la-fill"
            data={data.pcon}
            type="fill"
            hover={true}
            bind:hovered
            click={true}
            bind:selected
            paint={{ 'fill-color': ['case', ['!=', ['feature-state', 'hover'], null], ['feature-state', 'hover'], 'rgba(255, 255, 255, 255)'], 'fill-opacity': 0.3 }} />
          <MapLayer
            id="la-outline"
            type="line"
            paint={{ 'line-color': 'grey', 'line-width': 0.5 }} />

          <MapLayer
            id="la-line"
            type="line"
            paint={{ 'line-color': ['case', ['==', ['feature-state', 'selected'], true], 'black', ['==', ['feature-state', 'hovered'], true], 'orange', 'rgba(255, 255, 255, 0)'], 'line-width': ['case', ['==', ['feature-state', 'selected'], true], 3, ['==', ['feature-state', 'hovered'], true], 3, 1] }} />
        </MapSource>
      </Map>
    {/if}
  </div>
  <div class="ons-field">
    <label class="ons-label" for="select-wide">
      Choose a local authority area from the map or menu
    </label>
    <select
      bind:value={selected}
      id="select-la"
      name="select"
      class="ons-input ons-input--select ons-input--block"
      style="max-width:450px">
      <option value="null">
        {hovered ? lookup[hovered] : 'Select an option'}
      </option>
      {#each Object.keys(lookup) as place, p}
        <option value={place} selected={selected == place}>
          {lookup[place]}
        </option>
      {/each}
    </select>
  </div>
</div>
