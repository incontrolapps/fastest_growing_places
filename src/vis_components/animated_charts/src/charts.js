export let width
export default [
	 {
    chart: 'xys',
    duration: 3000,
    delay: 0,
    tooltip_metric: '% growth',
    value: 'growth',
    sort_by: 'growth',
    zoom: 3,
	axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}		
  },
  {
    chart: 'xys',
    duration: 2000,
    delay: 0,
    tooltip_metric: '% growth',
    value: 'growth',
    sort_by: 'growth',
    zoom: 0,
	axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}		
  },
  {
    chart: 'circle',
    duration: 1000,
    delay: 5,
    tooltip_metric: ' people',
    value: 'pop',
    sort_by: 'growth',
    zoom: 0,
		axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}			
  },
  {
    chart: 'comparative_circle',
    duration: 1000,
    delay: 5,
    tooltip_metric: ' people',
    value: 'pop',
    sort_by: 'growth',
    zoom: 0,
		axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}			
  },  
  {
    chart: 'popBar',
    duration: 1000,
    delay: 20,
    tooltip_metric: '% growth',
    value: 'growth',
    sort_by: 'growth',
    zoom: 0,
		axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}		
  },
  {
    chart: 'scatter',
    duration: 1000,
    delay: 20,
    tooltip_metric: '% growth',
    value: 'growth',
    sort_by: 'growth',
    zoom: 0,
		axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}		
  },

  {
    chart: 'bar',
    duration: 3000,
    delay: 10,
    tooltip_metric: '% growth',
    value: 'growth',
    sort_by: 'growth',
    zoom: 0,
		axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}		
  },
  {
    chart: 'circle',
    duration: 1000,
    delay: 5,
    tooltip_metric: ' people',
    value: 'pop',
    sort_by: 'growth',
    zoom: 0,
		axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}			
  },
  {
    chart: 'absoluteBar',
    duration: 500,
    delay: 10,
    tooltip_metric: ' more people',
    value: 'abs',
    sort_by: 'growth',
    zoom: 0,
		axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}		
  },
  {
    chart: 'absolute',
    duration: 2000,
    delay: 0,
    tooltip_metric: ' more people',
    value: 'abs',
    sort_by: 'y',
    zoom: 0,
		axis:
		{
			x:
			{
			origin:0,
			spacing:width/10
			},
			y:
			{
			origin:0,
			spacing:width/10
			}
		}
  },
 



  {
    chart: 'scatter',
    duration: 1000,
    delay: 20,
    tooltip_metric: '% growth',
    value: 'growth',
    sort_by: 'growth',
    zoom: 0,
		axis:
		{
			x:
			{
			origin:0,
			spacing:0
			},
			y:
			{
			origin:0,
			spacing:0
			}
		}		
  },
]