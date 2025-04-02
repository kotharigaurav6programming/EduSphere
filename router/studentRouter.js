import express from 'express';
import { studentRegistrationController,studentLoginController,viewBatchesController,addTestimonialController } from '../controller/studentController.js';
import jwt from 'jsonwebtoken';
import { message, status } from '../utils/statusMessage.js';
const STUDENT_SECRET_KEY = process.env.STUDENT_SECRET_KEY;

var studentRouter = express.Router();

const authenticateJWT = (request,response,next)=>{
    try{
        const token = request.cookies.student_cookie;
        if(!token)
            response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
        else{
            jwt.verify(token,STUDENT_SECRET_KEY,(error,studentPayload)=>{
                if(error){
                    response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
                }else{
                    request.studentPayload = studentPayload;
                    next();
                }
            });
        }
    }catch(error){
        console.log("JWT Error : ",error);
        response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
    }
}

studentRouter.get('/studentRegistration',(request,response)=>{
    var email = request.query.email;
    response.render("studentRegistration.ejs",{email:email,message:"",status:""});
})

studentRouter.post('/studentRegistration',studentRegistrationController);
studentRouter.get("/studentLogin",(request,response)=>{
    response.render("studentLogin.ejs",{message:""});
});
studentRouter.post("/studentLogin",studentLoginController);
studentRouter.get("/viewBatches",authenticateJWT,viewBatchesController);
studentRouter.post('/addTestimonial',addTestimonialController);

export default studentRouter;