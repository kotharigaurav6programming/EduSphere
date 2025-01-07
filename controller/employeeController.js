import path from 'path';
import { fileURLToPath } from 'url';
import employeeSchema from '../model/employeeSchema.js';
import uuid4 from 'uuid4';
import {message,status} from '../utils/statusMessage.js'
import mailer from './mailer.js';
export const employeeRegistrationController = async(request,response)=>{
    try{
        const uuid = uuid4();
        //  console.log(request.body);
        //  console.log(request.files);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // console.log(__dirname);
        
        const filename = request.files.docs;
        const fileName = new Date().getTime()+filename.name;
        const pathName = path.join(__dirname.replace('\\controller',"")+'/public/documents/'+fileName);
        filename.mv(pathName,async(error)=>{
            if(error){
                console.log("error : ",error);
                response.render("employeeRegistration.ejs",{message:message.FILE_NOT_UPLOADED,status:status.NOT_FOUND});                
            }else{
                const employeeObj = request.body;
                employeeObj.enrollId = uuid;
                employeeObj.profilePic = fileName;

                mailer.mailer(request.body.email,async(result)=>{
                    if(result){
                        // console.log("info in employeecontroller : ",result);
                        const res = await employeeSchema.create(employeeObj);
                        if(res){
                            response.render("employeeLogin.ejs",{message:message.REGISTRATION_SUCCESSFULL+" | "+message.MAIL_SENT});                
                        }else{
                            response.render("employeeRegistration.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});                
                        }
                    }else{
                        // console.log("error in employeecontroller : ",result);
                        response.render("employeeRegistration.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});                
                    }                    
                });
            }   
        });                
    }catch(error){
        console.log(error);
        response.render("notfound.ejs",{message:message.SERVER_ERROR,status:status.SERVER_ERROR});        
    }
}

export const employeeVerifyEmailController = async(request,response)=>{
    try{
        const email = request.query.email;
        const status = {
            $set:{
                emailVerify : "Verified"
            }
        }
        const result = await employeeSchema.updateOne({email:email},status);
        console.log("result : ",result);
        if(result){
            response.render("employeeLogin.ejs",{message:message.ADMIN_VERIFICATION_REQUIRED,status:status.SUCCESS});
        }else{

        }
        
    }catch(error){
        console.log("Error in employeeVerifyEmailController : ",error);
        
    }
}