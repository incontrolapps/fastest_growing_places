<script>
  import data from './age_sex.js'
  import rankings from './rankings.js'
  import { tweened } from 'svelte/motion'
  import { cubicInOut } from 'svelte/easing'
  import { interpolate } from 'flubber'
  import Pyramid from './Pyramid.svelte'
  import pyramidStore from './pyramid'
  let order = rankings.map((e) => e[0])
  import { all_data } from '../../../stores.js'
  import { step } from '../../animated_charts/src/step'

  function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      let key = obj[property]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    }, {})
  }

  const buildPercentages = (d) => {
    let totalM = Object.values(d.M).reduce((a, b) => a + b)
    let totalF = Object.values(d.F).reduce((a, b) => a + b)
    for (let age in d.M) d.M[age] = (d.M[age] / totalM) * 100
    for (let age in d.F) d.F[age] = (d.F[age] / totalF) * 100
    return d
  }

  const buildPlace = (data) => {
    let sexGroup = groupBy(data, [1])
    let ageSexGroup = {
      M: groupBy(sexGroup.M, [0]),
      F: groupBy(sexGroup.F, [0]),
    }
    return ageSexGroup
  }


  const myPlace = (code, year) => {
    let asg = buildPlace(
      data.filter((e) => e[3] == code).filter((e) => e[2] == year),
    )
    for (let age in asg.M) asg.M[age] = asg.M[age].map((e) => e[4])[0]
    for (let age in asg.F) asg.F[age] = asg.F[age].map((e) => e[4])[0]
    return buildPercentages(asg)
  }

  let makePyramid = (d) => {
    let bars = [[],[]]
    let f = d.F,
      m = d.M

    for (let i in f) {
      bars[0].push(f[i])
    }

    for (let i in m) {
      bars[1].push(m[i])
    }
	bars[0].reverse()
	bars[1].reverse()
    return bars
  }

  let makeDataPyramid = (d) => {
    let bars = [[],[]]
    let f = d[1],
      m = d[0]

    for (let i in f) {
      bars[0].push(+f[i])
    }

    for (let i in m) {
      bars[1].push(+m[i])
    }
	bars[0].reverse()
	bars[1].reverse()
    return bars
  }

  pyramidStore.set(makeDataPyramid($all_data.LA.PYRAMID11))

let changePyramid = details => console.log("do something"+details)

let stepPrev;
let request;
    function change(stp) {
      if (stp != stepPrev) {
     //   if (stp <= 11) {request="bars";pyramidStore.set(makeDataPyramid($all_data.LA.PYRAMID11))}
        if (stp <= 11) {request="bars";pyramidStore.set(makeDataPyramid($all_data.LA.PYRAMID11))}
        if (stp == 12) {request="bars"}
        if (stp >= 11) {pyramidStore.set(makeDataPyramid($all_data.LA.PYRAMID11))}
        if (stp == 13) {request="comparison1"}
        if (stp >= 14) {request="comparison2"}
        else{request="bars"}
        stepPrev = stp
       // timeline(step)
      }
    }

  
  $: $step && change($step)
</script>

{#if $pyramidStore}
<Pyramid bind:pyramid={$pyramidStore} request={request}/>
{/if}
