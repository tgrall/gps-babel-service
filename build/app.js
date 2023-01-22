"use strict";
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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const converterRouter_1 = require("./Routes/converterRouter");
const GPSBabel_1 = require("./Services/GPSBabel");
const version_1 = require("./version");
// ---------------------- Init app ---------------------------------------- //
const app = (0, express_1.default)();
app.locals.title = 'WindR Trace Converter';
app.locals.email = 'tugdual@gmail.com';
// ---------------------- Middleware -------------------------------------- //
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json()); // support json encoded bodies
app.use(body_parser_1.default.urlencoded({ extended: true })); // support encoded bodies
// ---------------------- Middleware -------------------------------------- //
// ----------------------- Statics ---------------------------------------- //
app.use(express_1.default.static(path_1.default.join(__dirname, 'static')));
// ----------------------- Statics ---------------------------------------- //
// ------------------------ Routes ---------------------------------------- //
app.get('/', (req, res) => {
    res.send('Well done!');
});
app.get('/version', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield GPSBabel_1.GPSBabel.getVersion();
    res.send({ "application": version_1.LIB_VERSION, "gpsbabel": result });
}));
app.use('/convert', converterRouter_1.converterRouter);
// ---------------------- Start server ------------------------------------ //
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('The application is listening on port ' + port + '! \n http://localhost:' + port + '/');
});
