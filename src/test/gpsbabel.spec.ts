import { converterParameters } from "@/Models/converterTypes";
import { expect } from "chai";
import "mocha";

import {GPSBabel} from '../Services/GPSBabel';

// Test to convert sbn to gpx
describe("GPSBabel.convert", () => {
    it("should convert sbn to gpx", () => {
        const path = __dirname + "/data/2021_01_16.sbn";
        const params:converterParameters = {
            input_format: "sbn",
            input_file: path,
            input_local_file: path,
            output_format: "gpx",
            output_file: "/tmp/test.gpx"
        };

        const result = GPSBabel.convertTrace(params);
        expect(result).to.be.a("string"); // file
        expect(result).to.equal(params.output_file);
    });
});


// Test GPSBabel. version that should be a string containing GPSBabel String
describe("GPSBabel.getVersion", () => {
    it("should return a string", () => {
        const result = GPSBabel.getVersion();
        expect(result).to.be.a("string");
        expect(result).to.match(/^GPSBabel Version 1./);
    });
});