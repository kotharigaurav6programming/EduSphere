import express from 'express';
import { studentRegistrationController } from '../controller/studentController.js';
var studentRouter = express.Router();

studentRouter.get('/studentRegistration',(request,response)=>{
    var email = request.query.email;
    response.render("studentRegistration.ejs",{email:email,message:"",status:""});
})

studentRouter.post('/studentRegistration',studentRegistrationController);

export default studentRouter;