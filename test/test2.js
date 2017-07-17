let axios = require('axios')


axios.get('https://storage.googleapis.com/red_printing/ticket_R.svg').then((res) => {
    console.log(res.data);
})