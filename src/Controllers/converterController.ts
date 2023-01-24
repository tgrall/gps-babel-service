import * as express from 'express';

import {GPSBabel} from '../Services/GPSBabel';
import {converterParameters} from '../Models/converterTypes';
import *  as fs from 'fs';
import fetch from 'node-fetch';
/**
 * return version of gpsbabel
 *
 * @param req
 * @param res
 */
export const version = (req: express.Request, res: express.Response) => {
    const result = GPSBabel.getVersion();
    res.json({ "gpsbabel": result });
}


/**
 * convert trace using the paramerters, that could be as query or body
 *
 * @param req
 * @param res
 */
export const converterController = async (req: express.Request, res: express.Response) => {

    try {


        const params:converterParameters = {
            input_format: "",
            input_file: "",
            output_format: "",
            output_file: "",
            input_local_file: ""
        };


        // check the type of the request
        if (req.method === 'GET') {
            const inputFormat = req.query.input_format || "sbn";
            const inputFile = req.query.input_file || "";
            const outputFormat = req.query.output_format || "gpx";
            params.input_file = inputFile.toString();
            params.input_format = inputFormat.toString();
            params.output_format = outputFormat.toString();
            params.output_file = "";

        } else if (req.method === 'POST') {
            // console.log( "POST" );
        }


        // call the convert service using the parameters

        // the service is using URL for the input file so we need to create a URL if this is not the case
        if (params.input_file.startsWith("http") === false) {
            params.input_file = `file://${params.input_file}`;
        }


        const path =   params.input_file.split("/").pop()
        params.input_local_file =  `/tmp/${path || ""}`;
        params.output_file =params.input_local_file.split('.').slice(0, -1).join('.') + "." + params.output_format;


        // console.log( `This will convert the file ${params.input_file} from ${params.input_format} to ${params.output_format} `+
        //             ` \n\t save in ${params.input_local_file}` +
        //             ` \n\t converted file will be saved in ${params.output_file}`
        //             );

        const resGetFile = await fetch(params.input_file );

        const fileStream = fs.createWriteStream(params.input_local_file as fs.PathLike )
        await new Promise((resolve, reject) => {

            if (resGetFile.body !== null ) {
                resGetFile.body.pipe(fileStream);
                resGetFile.body.on("error", reject);
                fileStream.on("finish", resolve);
            }

        });


        GPSBabel.convertTrace(params);


        // if GET , stream the result to the client
        if (req.method === 'GET') {
            fs.createReadStream(params.output_file as fs.PathLike).pipe(res);
        }
    } catch (error) {
        res.json({
            status : "error",
            type: req.method,
            result: error
        });
    }


}
