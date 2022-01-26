export default [
  {
    Scroller: {
      background: {
        component: 'SC1',
      },
      foreground: [
        {
          section: {
            actions: {
              'data-id': 'chart01',
              'data-xKey': 'area',
              'data-yKey': 'null',
              'data-zKey': 'null',
              'data-rKey': 'null',
              'data-explore': 'false',
            },
            content:
              'This chart shows the area in square kilometres of each local authority district in the UK. Each circle represents one district. The scale is logarithmic.',
          },
        },
        {
          section: {
            actions: {
              'data-id': 'chart02',
              'data-xKey': 'area',
              'data-yKey': 'null',
              'data-zKey': 'null',
              'data-rKey': 'pop',
              'data-explore': 'false',
            },
            content:
              'The radius of each circle shows the total population of the district.',
          },
        },
        {
          section: {
            actions: {
              'data-id': 'chart03',
              'data-xKey': 'area',
              'data-yKey': 'density',
              'data-zKey': 'null',
              'data-rKey': 'pop',
              'data-explore': 'false',
            },
            content:
              'The vertical axis shows the density of the district in people per hectare.',
          },
        },
        {
          section: {
            actions: {
              'data-id': 'chart04',
              'data-xKey': 'area',
              'data-yKey': 'density',
              'data-zKey': 'parent_name',
              'data-rKey': 'pop',
              'data-explore': 'false',
            },
            content:
              'The colour of each circle shows the part of the country that the district is within.',
          },
        },
        {
          section: {
            actions: {
              'data-id': 'chart05',
              'data-xKey': 'area',
              'data-yKey': 'density',
              'data-zKey': 'null',
              'data-rKey': 'pop',
              'data-explore': 'true',
            },
            content: [
              {
                Tab_H3: 'Select a district',
                Tab_P:
                  'Use the selection box below or click on the chart to select a district. The chart will also highlight the other districts in the same part of the country.',
              },
            ],
          },
        },
      ],
    },
  },
  {
    Scroller: {
      background: {
        component: 'SC1',
      },
      foreground: [
        {
          section: {
            actions: {
              'data-id': 'chart01',
              'data-xKey': 'area',
              'data-yKey': 'null',
              'data-zKey': 'null',
              'data-rKey': 'null',
              'data-explore': 'false',
            },
            content:
              'This chart shows the area in square kilometres of each local authority district in the UK. Each circle represents one district. The scale is logarithmic.',
          },
        },
        {
          section: {
            actions: {
              'data-id': 'chart02',
              'data-xKey': 'area',
              'data-yKey': 'null',
              'data-zKey': 'null',
              'data-rKey': 'pop',
              'data-explore': 'false',
            },
            content:
              'The radius of each circle shows the total population of the district.',
          },
        },
        {
          section: {
            actions: {
              'data-id': 'chart03',
              'data-xKey': 'area',
              'data-yKey': 'density',
              'data-zKey': 'null',
              'data-rKey': 'pop',
              'data-explore': 'false',
            },
            content:
              'The vertical axis shows the density of the district in people per hectare.',
          },
        },
        {
          section: {
            actions: {
              'data-id': 'chart04',
              'data-xKey': 'area',
              'data-yKey': 'density',
              'data-zKey': 'parent_name',
              'data-rKey': 'pop',
              'data-explore': 'false',
            },
            content:
              'The colour of each circle shows the part of the country that the district is within.',
          },
        },
        {
          section: {
            actions: {
              'data-id': 'chart05',
              'data-xKey': 'area',
              'data-yKey': 'density',
              'data-zKey': 'null',
              'data-rKey': 'pop',
              'data-explore': 'true',
            },
            content: [
              {
                Tab_H3: 'Select a district',
                Tab_P:
                  'Use the selection box below or click on the chart to select a district. The chart will also highlight the other districts in the same part of the country.',
              },
            ],
          },
        },
      ],
    },
  },
]