<script>
  import { ScatterChart, LineChart, BarChart } from '@onsvisual/svelte-charts'
  import { getMotion } from './utils.js'
  import { getData, setColors, getTopo, getBreaks, getColor } from './utils.js'
  export let xKey, yKey, zKey, rKey, explore // Export the variables which will be modified as the user scrolls. Note, these need to be declared with values in the parent component.
  import { colors, units } from './config.js'

  //Define the data requirements for this chart component
  const datasets = ['region', 'district']
  let data = { district: {}, region: {} }
  let metadata = { district: {}, region: {} }
  let geojson
  $: region =
    selected && metadata.district.lookup
      ? metadata.district.lookup[selected].parent
      : null // Gets region code for 'selected'
  $: chartHighlighted =
    metadata.district.array && region
      ? metadata.district.array
          .filter((d) => d.parent == region)
          .map((d) => d.code)
      : [] // Array of district codes in 'region'

  const topojson = './data/geo_lad2021.json'

  getTopo(topojson, 'geog').then((geo) => {
    geo.features.sort((a, b) =>
      a.properties.AREANM.localeCompare(b.properties.AREANM),
    )
    geojson = geo
  })

  datasets.forEach((geo) => {
    getData(`./data/data_${geo}.csv`).then((arr) => {
      let meta = arr.map((d) => ({
        code: d.code,
        name: d.name,
        parent: d.parent ? d.parent : null,
      }))
      let lookup = {}
      meta.forEach((d) => {
        lookup[d.code] = d
      })
      metadata[geo].array = meta
      metadata[geo].lookup = lookup

      let indicators = arr.map((d, i) => ({
        ...meta[i],
        area: d.area,
        pop: d['2020'],
        density: d.density,
        age_med: d.age_med,
      }))

      if (geo == 'district') {
        ;['density', 'age_med'].forEach((key) => {
          let values = indicators.map((d) => d[key]).sort((a, b) => a - b)
          let breaks = getBreaks(values)
          indicators.forEach(
            (d, i) =>
              (indicators[i][key + '_color'] = getColor(
                d[key],
                breaks,
                colors.seq,
              )),
          )
        })
      }
      data[geo].indicators = indicators

      let years = [
        2001,
        2002,
        2003,
        2004,
        2005,
        2006,
        2007,
        2008,
        2009,
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
      ]

      let timeseries = []
      arr.forEach((d) => {
        years.forEach((year) => {
          timeseries.push({
            code: d.code,
            name: d.name,
            value: d[year],
            year,
          })
        })
      })
      data[geo].timeseries = timeseries
    })
  })

  
  let hovered // Hovered district (chart or map)
  let selected // Selected district (chart or map)
  function doSelect(e) {
    selected = e.detail.id
    if (e.detail.feature) fitById(selected) // Fit map if select event comes from map
  }
  function doHover(e) {
    hovered = e.detail.id
  }
  $: chartHighlighted =
    metadata.district.array && region
      ? metadata.district.array
          .filter((d) => d.parent == region)
          .map((d) => d.code)
      : [] // Array of district codes in 'region'
  let animation = getMotion()

</script>

{#if data.district.indicators && metadata.region.lookup}
 
<figure>
  <div class="col-wide height-full">
    <div class="chart">
<ScatterChart
    data={data.district.indicators.map((d) => ({
      ...d,
      parent_name: metadata.region.lookup[d.parent].name,
    }))}
    height="calc(100vh - 150px)"
    colors={explore ? ['lightgrey'] : colors.cat}
    {xKey}
    {yKey}
    {zKey}
    {rKey}
    idKey="code"
    labelKey="name"
    r={[3, 10]}
    xScale="log"
    xTicks={[10, 100, 1000, 10000]}
    xFormatTick={(d) => d.toLocaleString()}
    xSuffix=" sq.km"
    yFormatTick={(d) => d.toLocaleString()}
    legend={zKey != null}
    labels
    select={explore}
    selected={explore ? selected : null}
    on:select={doSelect}
    hover
    {hovered}
    on:hover={doHover}
    highlighted={explore ? chartHighlighted : []}
    colorSelect="#206095"
    colorHighlight="#999"
    overlayFill
    {animation} />
    </div></div></figure>
{/if}
