import path from 'path';
import { fileURLToPath } from 'url';
import employeeSchema from '../model/employeeSchema.js';
import uuid4 from 'uuid4';
import {message,status} from '../utils/statusMessage.js'
import mailer from './mailer.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { request } from 'http';
import { response } from 'express';
import courseSchema from '../model/courseSchema.js';
import batchSchema from '../model/batchSchema.js';
const EMPLOYEE_SECRET_KEY = process.env.EMPLOYEE_SECRET_KEY;
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
                employeeObj.password = await bcrypt.hash(request.body.password,10); 
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

export const employeeLoginController = async(request,response)=>{
    try{
        const {email,password} = request.body;
        const employeeObj = await employeeSchema.findOne({email:email});
        const existingPassword = employeeObj.password;
        const passResult = await bcrypt.compare(password,existingPassword);
        if(passResult){
            if(employeeObj.status){
                var employeePayload = {email : email,profile:employeeObj.profile,name:employeeObj.name};
                var expireTime = {
                    expiresIn:'1d'
                }
                const token = jwt.sign(employeePayload,EMPLOYEE_SECRET_KEY,expireTime);
                response.cookie('employee_cookie',token,{httpOnly:true});
                if(!token)
                    response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
                else{
                    response.render("employeeHome.ejs",{email,profile:employeeObj.profile,name:employeeObj.name,status : status.SUCCESS,message:message.LOGIN_SUCCESSFULL});
                }    
            }else{
                response.render("employeeLogin.ejs",{message:message.ACCOUNT_DEACTIVATED,status:status.SUCCESS});
            }
        }else{
            response.render("employeeLogin.ejs",{message:message.NOT_MATCHED,status:status.UN_AUTHORIZE});
        }
    }catch(error){
        console.log("Error in Login Controller : ",error);
        response.render("employeeLogin.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});        
    }
}

export const employeeViewBatchesController = async(request,response)=>{
    try{
        const employeeEnrollId = await employeeSchema.findOne({email:request.employeePayload.email},{enrollId:1});
         const batchesData = await batchSchema.find({trainerEnrollId:employeeEnrollId.enrollId});
        for(let i=0;i<batchesData.length;i++){
            const courseObj = await courseSchema.findOne({courseId:batchesData[i].courseId},{courseName:1});
            // console.log("courseName : ",courseObj.courseName);
            batchesData[i].courseName = courseObj.courseName; 

            const obj = await employeeSchema.findOne({enrollId:batchesData[i].trainerEnrollId},{name:1});
            // console.log(obj);
            batchesData[i].trainerEnrollId = obj?.name ? obj.name : "Not Allocate";
        }
        response.render('employeeViewBatches.ejs',{batchesData,name:request.employeePayload.name,message:"",status:status.SUCCESS});
    }catch(error){
        console.log("error in employeeViewBatchesController : ",error);        
        response.render('employeeHome.ejs',{profile:request.employeePayload.profile,email:request.employeePayload.email,name:request.employeePayload.name,message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});
    }
}