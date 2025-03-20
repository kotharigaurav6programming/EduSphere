import uuid4 from "uuid4";
import { message, status } from "../utils/statusMessage.js";
import {fileURLToPath} from 'url';
import path from "path";
import bcrypt from 'bcrypt';
import studentSchema from "../model/studentSchema.js";
export const studentRegistrationController = async(request,response)=>{
    try{
            const uuid = uuid4();
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            // console.log(__dirname);
            
            const filename = request.files.docs;
            const fileName = new Date().getTime()+filename.name;
            const pathName = path.join(__dirname.replace('\\controller',"")+'/public/documents/'+fileName);
            filename.mv(pathName,async(error)=>{
                if(error){
                    console.log("error : ",error);
                    response.render("studentRegistration.ejs",{message:message.FILE_NOT_UPLOADED,status:status.NOT_FOUND});                
                }else{
                    const studentObj = request.body;
                    studentObj.enrollId = uuid;
                    studentObj.profilePic = fileName;
                    studentObj.password = await bcrypt.hash(request.body.password,10); 
                    const res = await studentSchema.create(studentObj);
                    if(res){
                        response.render("studentLogin.ejs",{message:message.REGISTRATION_SUCCESSFULL,status:status.SUCCESS});                
                    }else{
                        response.render("studentRegistration.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});                
                    }  
                }         
            });               
        }catch(error){
            console.log(error);
            response.render("notfound.ejs",{message:message.SERVER_ERROR,status:status.SERVER_ERROR});        
        }
}