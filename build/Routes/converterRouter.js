"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.converterRouter = void 0;
const express_1 = require("express");
const converterController_1 = require("../Controllers/converterController");
exports.converterRouter = (0, express_1.Router)({ mergeParams: true });
// convert trace
exports.converterRouter.route('/').get(converterController_1.converterController);
exports.converterRouter.route('/').post(converterController_1.converterController);
// get version
exports.converterRouter.route('/version').get(converterController_1.version);
