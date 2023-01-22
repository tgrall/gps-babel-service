import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { converterRouter } from './Routes/converterRouter';
import { GPSBabel } from './Services/GPSBabel';
import { LIB_VERSION } from './version';



// ---------------------- Init app ---------------------------------------- //
const app = express();
app.locals.title = 'WindR Trace Converter';
app.locals.email = 'tugdual@gmail.com';


// ---------------------- Middleware -------------------------------------- //
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// ---------------------- Middleware -------------------------------------- //

// ----------------------- Statics ---------------------------------------- //
app.use(express.static(path.join(__dirname, 'static')));
// ----------------------- Statics ---------------------------------------- //

// ------------------------ Routes ---------------------------------------- //
app.get('/', (req, res) => {
    res.send('Well done!');
})

app.get('/version', async (req, res) => {
    const result = await GPSBabel.getVersion();
    res.send( { "application" :  LIB_VERSION, "gpsbabel" : result  } );
})

app.use('/convert', converterRouter);

// ---------------------- Start server ------------------------------------ //
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('The application is listening on port '+ port +'! \n http://localhost:'+ port +'/');
})