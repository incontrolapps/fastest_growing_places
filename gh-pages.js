var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/ONSvisual/fastest_growing_places.git', // Update to point to your repository  
        user: {
            name: 'Tim Kershaw', // update to use your name
            email: 'tim.kershaw@ons.gov.uk' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)