
const express = require('express');

const gpsbabel = require('./lib/gps-babel');
const fs = require('fs');
const tmp = require('tmp');
const fetch = require ('node-fetch');


const app = express();
const port = 8080;
const API_VERSION = '0.1';


app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/version', (req, res) => {
    gpsbabel.version(function(version) {
        res.send(
            {
                "api_version": API_VERSION,
                "gpsbabel_version": version,
            }
        )
    });
});

app.get('/convert', async (req, res) => {

    const input_format = req.query.input_format || "sbn";
    const input_file = req.query.input_file;
    const output_format = req.query.output_format || "gpx";
    let output_file = "";
    let input_file_local = "";


    // check if output file is set
    console.log("input_format: " + req.query.input_format)
        
    // input_file is a url so read the file and save it to a temp file synchroneously
    if (input_file.startsWith("http")) {

        // get the file from the url and save it locally using node-fetch
        const resGetFile = await fetch(input_file);

        let input_file_local = "/tmp/" + input_file.split("/").pop();

        // remove file extension from input_file_local
        output_file = input_file_local.split('.').slice(0, -1).join('.') + "." + output_format;



        const fileStream = fs.createWriteStream(input_file_local);
        await new Promise((resolve, reject) => {
            resGetFile.body.pipe(fileStream);
            resGetFile.body.on("error", reject);
            fileStream.on("finish", resolve);
          });


          gpsbabel.convert(input_format, input_file_local, output_format, output_file, function(err, converted_file){

            // print all paremeters
            console.log("input_format: " + input_format)
            console.log("input_file: " + input_file)
            console.log("output_format: " + output_format)
            console.log("output_file: " + output_file)
            console.log( "converted_file: ", converted_file );
    
    
            if (err) {
                res.send(err)
            } else {
                // pipe the file to the response
                fs.createReadStream(converted_file).pipe(res);
            }
        });

        console.log("input_file_local: " + input_file_local)
        console.log( "output_file 001 ", output_file );

    }   

        
    



});



// start server
app.listen(port, () => {

    console.log(`Example app listening on port ${port}!`)
    console.log(` http://localhost:${port}`)
    
});
