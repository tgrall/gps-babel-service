
const express = require('express');

const gpsbabel = require('./lib/gps-babel');
const fs = require('fs');


const app = express();
const port = 8080;
const HOST = '0.0.0.0';


app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/version', (req, res) => {
    gpsbabel.version(function(version) {
        res.send(version)
    });
});

app.get('/convert', (req, res) => {

    var input_format = 'sbn';
    var input_file = '/Users/tgrall/projects/perso/promoglisse/gps-babel-service/tests/data/2021_01_16.sbn';
    var output_format = 'gpx';
    var output_file = '/Users/tgrall/projects/perso/promoglisse/gps-babel-service/tests/data/2021_01_16.gpx';

    gpsbabel.convert(input_format, input_file, output_format, output_file, function(err, output_file){
        if (err) {
            res.send(err)
        } else {

            // pipe the file to the response
            fs.createReadStream(output_file).pipe(res);


            


            //res.send(output_file)
        }


    });

});



// start server
app.listen(port, () => {

    console.log(`Example app listening on port ${port}!`)
    console.log(` http://localhost:${port}`)
    
});
