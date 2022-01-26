<script>
	// CORE IMPORTS
	import { setContext, onMount } from "svelte";
	import { getMotion } from "./utils.js";
	import { themes } from "./config.js";
	// DEMO-SPECIFIC IMPORTS
	import bbox from "@turf/bbox";
	import { getData, setColors, getTopo, getBreaks, getColor } from "./utils.js";
	import { colors, units } from "./config.js";
	import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";
    import Divider from "./layout/Divider.svelte";
	// CORE CONFIG (COLOUR THEMES)
	// Set theme globally (options are 'light', 'dark' or 'lightblue')
	let theme = "light";
	setContext("theme", theme);
	setColors(themes, theme);
	// CONFIG FOR SCROLLER COMPONENTS
	// Config
	const threshold = 0.65;
	// State
	let animation = getMotion(); // Set animation preference depending on browser preference
	let id = {}; // Object to hold visible section IDs of Scroller components
	let idPrev = {}; // Object to keep track of previous IDs, to compare for changes
	onMount(() => {
		idPrev = {...id};
	});
	// DEMO-SPECIFIC CONFIG
	// Constants
	export const datasets = ["region", "district"];
	export const topojson = "./data/geo_lad2021.json";
	export const mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json";
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
	// Data
	export let data = {district: {}, region: {}};
	export let metadata = {district: {}, region: {}};
	export let geojson;
	// Element bindings
	export let map = null; // Bound to mapbox 'map' instance once initialised
	// State
	export let hovered; // Hovered district (chart or map)
	export let selected; // Selected district (chart or map)
	$: region = selected && metadata.district.lookup ? metadata.district.lookup[selected].parent : null; // Gets region code for 'selected'
	$: chartHighlighted = metadata.district.array && region ? metadata.district.array.filter(d => d.parent == region).map(d => d.code) : []; // Array of district codes in 'region'
	export let mapHighlighted = []; // Highlighted district (map only)
	export let mapKey = "density"; // Key for data to be displayed on map
	export let explore = false; // Allows chart/map interactivity to be toggled on/off




	// FUNCTIONS (INCL. SCROLLER ACTIONS)
	// Functions for chart and map on:select and on:hover events
	function doSelect(e) {
		console.log(e);
		selected = e.detail.id;
		if (e.detail.feature) fitById(selected); // Fit map if select event comes from map
	}
	function doHover(e) {
		hovered = e.detail.id;
	}
	// Functions for map component
	function fitBounds(bounds) {
		if (map) {
			map.fitBounds(bounds, {animate: animation, padding: 30});
		}
	}
	function fitById(id) {
		if (geojson && id) {
			let feature = geojson.features.find(d => d.properties.AREACD == id);
			let bounds = bbox(feature.geometry);
			fitBounds(bounds);
		}
	}

	// INITIALISATION CODE
	datasets.forEach(geo => {
		getData(`./data/data_${geo}.csv`)
		.then(arr => {
			let meta = arr.map(d => ({
				code: d.code,
				name: d.name,
				parent: d.parent ? d.parent : null
			}));
			let lookup = {};
			meta.forEach(d => {
				lookup[d.code] = d;
			});
			metadata[geo].array = meta;
			metadata[geo].lookup = lookup;
			let indicators = arr.map((d, i) => ({
				...meta[i],
				area: d.area,
				pop: d['2020'],
				density: d.density,
				age_med: d.age_med
			}));
			if (geo == "district") {
				['density', 'age_med'].forEach(key => {
					let values = indicators.map(d => d[key]).sort((a, b) => a - b);
					let breaks = getBreaks(values);
					indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], breaks, colors.seq));
				});
			}
			data[geo].indicators = indicators;
			let years = [
				2001, 2002, 2003, 2004, 2005,
				2006, 2007, 2008, 2009, 2010,
				2011, 2012, 2013, 2014, 2015,
				2016, 2017, 2018, 2019, 2020
			];
			let timeseries = [];
			arr.forEach(d => {
				years.forEach(year => {
					timeseries.push({
						code: d.code,
						name: d.name,
						value: d[year],
						year
					});
				});
			});
			data[geo].timeseries = timeseries;
		});
	});
	getTopo(topojson, 'geog')
	.then(geo => {
		geo.features.sort((a, b) => a.properties.AREANM.localeCompare(b.properties.AREANM));
		geojson = geo;
	});
    </script>

<figure>
<div class="col-full height-full">
<Map style={mapstyle} bind:map interactive={false} location={{bounds: mapbounds.ew}}>
    <MapSource
      id="lad"
      type="geojson"
      data={geojson}
      promoteId="AREACD"
      maxzoom={13}>
      <MapLayer
          id="lad-fill"
            idKey="code"
            colorKey={mapKey + "_color"}
          data={data.district.indicators}
          type="fill"
            select {selected} on:select={doSelect} clickIgnore={!explore}
            hover {hovered} on:hover={doHover}
            highlight highlighted={mapHighlighted}
          paint={{
              'fill-color': ['case',
                  ['!=', ['feature-state', 'color'], null], ['feature-state', 'color'],
                  'rgba(255, 255, 255, 0)'
              ],
              'fill-opacity': 0.7
          }}>
            <!--   <MapTooltip content={
                    hovered ? `${metadata.district.lookup[hovered].name}<br/><strong>${data.district.indicators.find(d => d.code == hovered)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
                }/>--> 
            </MapLayer>
        <MapLayer
          id="lad-line"
          type="line"
          paint={{
              'line-color': ['case',
                  ['==', ['feature-state', 'hovered'], true], 'orange',
                  ['==', ['feature-state', 'selected'], true], 'black',
                  ['==', ['feature-state', 'highlighted'], true], 'black',
                  'rgba(255,255,255,0)'
              ],
              'line-width': 2
          }}
    />
  </MapSource>
</Map>
</div>
</figure>
<Divider />