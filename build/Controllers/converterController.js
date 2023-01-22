"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.converterController = exports.version = void 0;
const GPSBabel_1 = require("../Services/GPSBabel");
const fs = __importStar(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * return version of gpsbabel
 * @param req
 * @param res
 */
const version = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield GPSBabel_1.GPSBabel.getVersion();
    res.json({ "gpsbabel": result });
});
exports.version = version;
/**
 * convert trace using the paramerters, that could be as query or body
 * @param req
 * @param res
 */
const converterController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = {
            input_format: "",
            input_file: "",
            output_format: "",
            output_file: "",
            input_local_file: ""
        };
        // check the type of the request
        if (req.method === 'GET') {
            const input_format = req.query.input_format || "sbn";
            const input_file = req.query.input_file || "";
            const output_format = req.query.output_format || "gpx";
            params.input_file = input_file.toString();
            params.input_format = input_format.toString();
            params.output_format = output_format.toString();
            params.output_file = "";
        }
        else if (req.method === 'POST') {
            console.log("POST");
        }
        // call the convert service using the parameters
        // the service is using URL for the input file so we need to create a URL if this is not the case
        if (params.input_file.startsWith("http") === false) {
            params.input_file = `file://${params.input_file}`;
        }
        params.input_local_file = "/tmp/" + params.input_file.split("/").pop();
        params.output_file = params.input_local_file.split('.').slice(0, -1).join('.') + "." + params.output_format;
        console.log(`This will convert the file ${params.input_file} from ${params.input_format} to ${params.output_format} ` +
            ` \n\t save in ${params.input_local_file}` +
            ` \n\t converted file will be saved in ${params.output_file}`);
        const resGetFile = yield (0, node_fetch_1.default)(params.input_file);
        const fileStream = fs.createWriteStream(params.input_local_file);
        yield new Promise((resolve, reject) => {
            if (resGetFile.body !== null) {
                resGetFile.body.pipe(fileStream);
                resGetFile.body.on("error", reject);
                fileStream.on("finish", resolve);
            }
        });
        const result = yield GPSBabel_1.GPSBabel.convertTrace(params);
        // if GET , stream the result to the client
        if (req.method === 'GET') {
            fs.createReadStream(params.output_file).pipe(res);
        }
    }
    catch (error) {
        res.json({
            status: "error",
            type: req.method,
            result: error
        });
    }
});
exports.converterController = converterController;
