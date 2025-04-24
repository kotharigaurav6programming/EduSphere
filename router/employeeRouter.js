import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { employeeRegistrationController,employeeVerifyEmailController,employeeLoginController,employeeViewBatchesController,assignmentFormController,sendEnrollLinkController,viewStudentListController,allocateBatchController,employeeLogoutController } from '../controller/employeeController.js';
import { message, status } from '../utils/statusMessage.js';
import courseSchema from '../model/courseSchema.js';
import allocateBatchSchema from '../model/allocateBatchSchema.js';
import uuid4 from 'uuid4';

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
employeeRouter.get('/employeeHome',authenticateJWT,(request,response)=>{
    response.render('employeeHome.ejs',{profile:request.employeePayload.profile,email:request.employeePayload.email,name:request.employeePayload.name,message:"",status:status.SUCCESS}); 
});

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
    const courseArrObj = await courseSchema.find({status:true});
    response.render("addBatch.ejs",{courseArrObj:courseArrObj.reverse(),email:request.employeePayload.email,name:request.employeePayload.name,message:"",status:status.SUCCESS});
});
employeeRouter.get('/employeeViewBatches',authenticateJWT,employeeViewBatchesController);
employeeRouter.get('/assignmentForm',authenticateJWT,assignmentFormController);
employeeRouter.post('/sendEnrollLink',authenticateJWT,sendEnrollLinkController);
employeeRouter.get('/viewStudentList',authenticateJWT,viewStudentListController);
employeeRouter.get('/allocateBatch',authenticateJWT,allocateBatchController);
employeeRouter.post('/employeeAllocateBatch',authenticateJWT,async (request,response)=>{
    try{
        const studentObj = JSON.parse(request.body.studentData);
        studentObj.batchId = request.body.batchId;
        studentObj.courseId = request.body.courseId;
        studentObj.courseName = request.body.courseName;
        studentObj.trainerName = request.body.trainerName;
    
        const check = {
            $and:[
                {
                    batchId: studentObj.batchId,
                    enrollId : studentObj.enrollId
                }
            ]
        }
        const result = await allocateBatchSchema.findOne(check);
        // console.log("--------> ",result);
        
        if(!result){
            // console.log("combination doesnot exist");
            studentObj.allocateBatchId = uuid4();
            const result = await allocateBatchSchema.create(studentObj);
            console.log("allocateBatch result : ",result);         
            response.render('employeeHome.ejs',{profile:request.employeePayload.profile,email:request.employeePayload.email,name:request.employeePayload.name,message:message.BATCH_ALLOCATED,status:status.SUCCESS});            
        }else{
            // console.log("combination exist");
            response.render('employeeHome.ejs',{profile:request.employeePayload.profile,email:request.employeePayload.email,name:request.employeePayload.name,message:message.BATCH_ALREADY_ALLOCATED,status:status.SUCCESS});
        }
    }catch(error){
        console.log("Error in employee allocate batch : ",error);
        response.render('employeeHome.ejs',{profile:request.employeePayload.profile,email:request.employeePayload.email,name:request.employeePayload.name,message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});        
    }
});
employeeRouter.get('/employeeLogout',employeeLogoutController);

export default employeeRouter;