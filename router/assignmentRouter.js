import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { addAssignmentController } from '../controller/assignmentController.js';
import { message, status } from '../utils/statusMessage.js';

var assignmentRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMPLOYEE_SECRET_KEY = process.env.EMPLOYEE_SECRET_KEY; // needs to uncomment dotenv.config();

assignmentRouter.use(express.static(__dirname.replace('\\router','')+'/public'));

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

assignmentRouter.post('/addAssignment',authenticateJWT,addAssignmentController);

export default assignmentRouter;
