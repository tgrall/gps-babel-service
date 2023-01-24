import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';

import Logger from './Services/Logger';

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



// ----------------------- Define Rate Limiting ---------------------------------------- //
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



// ------------------------ Routes ---------------------------------------- //
app.get('/', apiLimiter, (req, res) => {
    res.send('Well done!');
})

app.get('/version', (req, res) => {
    const result = GPSBabel.getVersion();
    res.send( { "application" :  LIB_VERSION, "gpsbabel" : result  } );
})

app.use('/convert', apiLimiter, converterRouter);

// ---------------------- Start server ------------------------------------ //
const port = process.env.PORT || 8080;
app.listen(port, () => {
    Logger.info(`The application is listening on port ${port}! \n http://localhost:${port}/` );
})