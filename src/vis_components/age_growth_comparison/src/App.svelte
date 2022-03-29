<script>
	let f=40
	let country=[11,9,3]
let place=[5,6,-4]
let country_name="England"
let place_name="Arun"
export let place_vis;
let newKey={
    key:[{x:4 + f * 15, y:f, height:(f*6) - 4, width:2 * f, fill: 'slategrey', agegroup:'65 +' },
    {x:4 + f * 15, y:f + (f*6), height:(f*9) - 4, width:2 * f, fill: 'slategrey', agegroup:'20 to 64' }, 
    {x:4 + f * 15, y:f+ (f*15), height:(f*4) - 4, width:2 * f, fill: 'slategrey', agegroup:'under 20' }],
	
country:[{x:8 + f * 17, y:f, height:(f*3) - 4, width:country[0] * f/2, fill: '#2fb47c', agegroup:country[0]+"%" },
    {x:8 + f * 17, y:f + (f*6), height:(f*9/2) - 4, width:country[1] * f/2, fill: '#2fb47c', agegroup:country[1]+"%" }, 
    {x:8 + f * 17, y:f+ (f*15), height:(f*4/2) - 4, width:country[2] * f/2, fill: '#2fb47c', agegroup:country[2]+"%" }],
	
place:[{x:place[1]<0?
		 ( f * 15)-(Math.abs(place[1]) * f/2):
		 8 + f * 17
		 , y:f*4, height:(f*3) - 4, width:place[0] * f/2, fill: '#433e85', agegroup:place[0]+"%" },
    {x:place[1]<0?
		 ( f * 15)-(Math.abs(place[1]) * f/2):
		 8 + f * 17
		 , y:f + (f*6)+(f*9/2), height:(f*9/2) - 4, width:place[1] * f/2, fill: '#433e85', agegroup:place[1]+"%" }, 
    {x:place[2]<0?
		 ( f * 15)-(Math.abs(place[2]) * f/2):
		 8 + f * 17
		 , y:f+ (f*15)+(f*4/2), height:(f*4/2) - 4, width:Math.abs(place[2]) * f/2, fill: '#433e85', agegroup:place[2]+"%" }]	
}


for(let i=0; i<country.length; i++){
country[i]
}

</script>


{#if newKey}
  <svg width="2000" height="2000">
		<rect
					x=250
					y=20
					width=40
					height=40
					rx=6
					fill='#2fb47c'
				/>
		<rect
					x=400
					y=20
					width=40
					height=40
					rx=6
					fill='#433e85'
					/>
				<text
					x=295
					y=55
					width=40
					height=40
					font-size="18"
					>{country_name}</text>
				<text
					x=445
					y=55
					width=40
					height=40
					font-size="18"
					>{place_name}</text>
		
    {#each newKey.key as props}
      <rect {...props} rx="6" />
      <text
        x={props.x + f}
        y={props.y + f / 2 + 2}
        text-anchor="middle"
        fill="white"
        font-size="18">
        {props.agegroup}
      </text>
    {/each}
		    {#each newKey.country as props}
      <rect {...props} rx="6" />
      <text
        x={props.x + f/2}
        y={props.y + f / 2 + 2}
        text-anchor="middle"
        fill="white"
        font-size="18">
        {props.agegroup}
      </text>
    {/each}
	{#if place_vis==1}
			{#each newKey.place as props}
      <rect {...props} rx="6" />
      <text
        x={props.x +f/2}
        y={props.y + f / 2 + 2}
        text-anchor="middle"
        fill="white"
        font-size="18">
        {props.agegroup}
      </text>
    {/each}{/if}
  </svg>
{/if}