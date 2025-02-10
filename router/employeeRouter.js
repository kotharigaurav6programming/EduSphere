import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { employeeRegistrationController,employeeVerifyEmailController,employeeLoginController,employeeViewBatchesController,assignmentFormController } from '../controller/employeeController.js';
import { message, status } from '../utils/statusMessage.js';
import courseSchema from '../model/courseSchema.js';

var employeeRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMPLOYEE_SECRET_KEY = process.env.EMPLOYEE_SECRET_KEY; // needs to uncomment dotenv.config();

// console.log("__dirname : ",__dirname.replace('\\router','')+'/public');
employeeRouter.use(express.static(__dirname.replace('\\router','')+'/public'));

const authenticateJWT = (request,response,next)=>{
    try{
        const token = request.cookies.employee_cookie;
        if(!token)
            response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
        else{
            jwt.verify(token,EMPLOYEE_SECRET_KEY,(error,employeePayload)=>{
                if(error){
                    response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
                }else{
                    request.employeePayload = employeePayload;
                    next();
                }
            });
        }
    }catch(error){
        console.log("JWT Error : ",error);
        response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
    }
}

employeeRouter.get("/employeeLogin",(request,response)=>{
    response.render("employeeLogin.ejs",{message:""});
});
employeeRouter.get("/employeeRegistration",(request,response)=>{
    response.render("employeeRegistration.ejs",{message:""});
});
employeeRouter.post("/employeeRegistration",employeeRegistrationController);
employeeRouter.get("/verifyEmail",employeeVerifyEmailController);
employeeRouter.post('/employeeLogin',employeeLoginController);
employeeRouter.get('/addBatch',authenticateJWT,async(request,response)=>{
    const courseArrObj = await courseSchema.find();
    response.render("addBatch.ejs",{courseArrObj,email:request.employeePayload.email,name:request.employeePayload.name,message:"",status:status.SUCCESS});
});
employeeRouter.get('/employeeViewBatches',authenticateJWT,employeeViewBatchesController);
employeeRouter.get('/assignmentForm',authenticateJWT,assignmentFormController);
export default employeeRouter;