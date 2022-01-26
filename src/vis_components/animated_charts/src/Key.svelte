<script>
import { interpolateViridis } from 'd3-scale-chromatic'
export let percent, key, uk, place, max, min, step
let arr=Array.from({length: max-min+1}, (_, i) => i + min).reverse();
let range=max-min
let place_position=(max-place)/range
let uk_position=(max-uk)/range

</script>

<svg id="key" height=1000>
<text x=125 y={800} text-anchor=middle fill=grey>{key}</text>    
{#each arr as clr,i}
<rect width=50 height={500/arr.length} x=100 y={250 + (500/arr.length) * i} fill={interpolateViridis(i/(arr.length-1))} />
{#if clr%10==0  || i==0 || i==arr.length-1}<text x=90 y={260 + ((500/arr.length) * i)} fill=grey text-anchor=end>{clr}{percent?"%":""}</text>{/if}
{/each}
<line x1={100} x2={180} y1={250 + (500 * place_position)} y2={250+ (place_position*(500))} stroke=darkblue stroke-width=8 stroke-linecap="round" ></line>
<text x=160 y={240 + (place_position*(500))} fill=darkblue font-size=12pt>here</text>
{#if step==1}<line x1={100} x2={180} y1={250 + (uk_position*(500))} y2={250 + (uk_position*(500))} stroke=darkred stroke-width=8 stroke-linecap="round" ></line>
<text x=160 y={240 + (uk_position*(500))} fill=darkred font-size=12pt>average</text>{/if}
<text x=160 y={260} fill=grey font-size=12pt>Tower</text>
<text x=160 y={275} fill=grey font-size=12pt>Hamlets</text>
<text x=160 y={740} fill=grey font-size=12pt>Barrow-</text>
<text x=160 y={755} fill=grey font-size=12pt>in-Furness</text>
</svg>

<style>
    #key{
        position:fixed;
        right: 95vh;
    }
</style>