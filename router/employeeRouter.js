import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { employeeRegistrationController,employeeVerifyEmailController } from '../controller/employeeController.js';
var employeeRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log("__dirname : ",__dirname.replace('\\router','')+'/public');
employeeRouter.use(express.static(__dirname.replace('\\router','')+'/public'));

employeeRouter.get("/employeeLogin",(request,response)=>{
    response.render("employeeLogin.ejs",{message:""});
});
employeeRouter.get("/employeeRegistration",(request,response)=>{
    response.render("employeeRegistration.ejs",{message:""});
});
employeeRouter.post("/employeeRegistration",employeeRegistrationController);
employeeRouter.get("/verifyEmail",employeeVerifyEmailController);
export default employeeRouter;