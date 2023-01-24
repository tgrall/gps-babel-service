/* eslint "@typescript-eslint/no-misused-promises":0  */

import { Router } from "express";
import {converterController, version} from '../Controllers/converterController';


export const converterRouter = Router({ mergeParams: true });


// convert trace
converterRouter.route('/').get(converterController);
converterRouter.route('/').post(converterController);


// get version
converterRouter.route('/version').get(version);