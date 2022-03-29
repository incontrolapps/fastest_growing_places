<script>
  import pitch from './pitch'
  import folk from './folk'
  import { checkIntersection } from 'line-intersect'
  import { tweened } from 'svelte/motion'
  import { cubicInOut } from 'svelte/easing'
  import { select, selectAll } from 'd3-selection'
  import { transform } from 'd3-transform'
  import { step } from '../../animated_charts/src/step'
  import { all_data } from '../../../stores.js'
  import { writable } from 'svelte/store'
  //console.log ("STEPPPP", $step)
  let pitches = writable(1)
  let people = writable(0)
  let intersect = checkIntersection
  let z = -500
  let height = window.innerHeight
  let width = window.innerHeight

  let newFolk = folk.concat(folk).concat(folk)

  pitch.forEach((e) => {
    e.order = 1
  })

  let tempPitch = (i) => {
    let x = JSON.parse(JSON.stringify(pitch))
    x.forEach((e) => {
      e.y1 = e.y1 - 750 * i
      e.y2 = e.y2 - 750 * i
      e.order = i + 1
    })
    return x
  }

  let newPitch = pitch
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

  let points = writable([])

  for (let i = 0; i < 100; i++)
    $points.push({
      x: Math.random() * 1000 - 500,
      y: Math.random() * -500 - 25,
      scale: 1,
      order: i + 1,
      offscreen: 0,
      visibility: 'hidden',
      d: newFolk[i].shadow,
    })

  let step1 = JSON.parse(JSON.stringify($points))
  step1.forEach((e) => (e.visibility = 'hidden'))
  for (let i = 0; i < $all_data.LA.DENSITY.DENSITY11 / 187; i++)
    step1[i].visibility = 'visible'

  let step2 = JSON.parse(JSON.stringify($points))
  step2.forEach((e) => (e.visibility = 'hidden'))
  for (let i = 0; i < 1; i++) step2[i].visibility = 'visible'

  let step3 = JSON.parse(JSON.stringify($points))
  step3.forEach((e) => (e.visibility = 'hidden'))
  for (let i = 0; i < 79; i++) step3[i].visibility = 'visible'

  for (let i = 0; i < 10; i++) $points[i].visibility = 'visible'

  function changePeople(count) {
    let counter = 1
    if (count < 1) {
      let addPitches = setInterval(function () {
        let numberPitches = Math.round(1 / count)
        if ($pitches < numberPitches) $pitches++
        if ($pitches > numberPitches) $pitches--
        if ($pitches == numberPitches) clearInterval(addPitches)
      }, 50)
    }

    if (count >= 1) {
      let removePitches = setInterval(function () {
        if ($pitches > 1) $pitches--
        if ($pitches == 1) clearInterval(removePitches)
      }, 50)
    }
}

    //set vanishing point
    let vp = 300

    //set vertical squash factor
    let h = vp

    //define initial height
    let h_orig = pitch[0].y1 * -1

    //offset all points by 0.5px to avoid pooints falling on zero
    newPitch.forEach((e) => {
      e.x1 = e.x1 + 0.5
      e.x2 = e.x2 + 0.5
      e.y1 = e.y1 - 0.5
      e.y2 = e.y2 - 0.5
    })

    //function for reprojecting points to perspective
    let project = (x, y) =>
      intersect(0, 0, (-h_orig / y) * x, -h, 0, -vp, x, 0).point

    //reproject all points
    newPitch.forEach((e) => {
      e.x1 = project(e.x1, e.y1).x
      e.y1 = project(e.x1, e.y1).y
      e.x2 = project(e.x2, e.y2).x
      e.y2 = project(e.x2, e.y2).y
    })

    let replotPoints = (points) =>
      points.forEach((e) => {
        let eX = e.x,
          eY = e.y
        e.x = project(e.x, e.y).x
        e.y = project(e.x, e.y).y
        e.scale = e.x / eX
        e.skew = Math.atan2(eY + e.y, e.x - eX) * 180 * Math.PI
      })

    let stepPrev = 8

    function change(step) {
      if (step != stepPrev) {
        if (step == 10) points.set(replotPoints(step1))
        if (step == 9) points.set(replotPoints(step2))
        if (step == 11) points.set(replotPoints(step3))
        stepPrev = step
       // timeline(step)
      }
    }

    function back(step) {
      step.set(step - 2)
      forward(step)
    }
  
  $: $step && change($step)
  $: $people = $all_data.LA.DENSITY.DENSITY11 / 187
</script>

<div>

  <svg {width} {height} viewBox="{-height} {-height} {height * 2} {height * 2}">
    <rect
      x={-height}
      y={-height}
      width={height * 2}
      height={height * 2}
      fill="#40826D"
      fill-opacity="0.7" />
    <g transform="scale(1.7)">

      {#each newPitch as params}
        <line
          {...params}
          stroke="white"
          stroke-width={(1 / params.order) * 3}
          stroke-opacity="1"
          visibility={params.order > $pitches ? 'hidden' : 'visible'} />
      {/each}
      {#each $points as point, i}
        <!--<circle cx={point.x} cy={point.y} r={6*point.scale}/>-->
        <g
          class="shadow"
          transform="translate({point.x - 14}, {point.y - 25.5}) scale({6 * point.scale})
          translate(0, {0})">
          <path
            {...point}
            fill="#40826D"
            transform="rotate(-10 50 100) translate(15 -5) skewX(40) scale(1
            0.5)" />
          <!--<text x=0 y=0>{i},{$people}</text>-->
        </g>
      {/each}
      {#each $points as point, i}
        <!--<circle cx={point.x} cy={point.y} r={6*point.scale}/>-->
        <g
          class="person"
          transform="translate({point.x - 14}, {point.y - 25.5}) scale({6 * point.scale})
          translate(0, {point.offscreen ? z : 0})">
          <path {...point} fill="black" />
        </g>
      {/each}
    </g>
  </svg>
</div>
