import adminSchema from "../model/adminSchema.js";
// import swal from 'sweetalert';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { status,message } from "../utils/statusMessage.js";
import bcrypt from 'bcrypt';
import employeeSchema from "../model/employeeSchema.js";
dotenv.config();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

export const adminLoginController = async(request,response)=>{
    try{
        const {email,password} = request.body;
        const adminObj = await adminSchema.findOne({email:email});
        const existingPassword = adminObj.password;
        const passResult = await bcrypt.compare(password,existingPassword);
        // swal("Here's a title", "Here's some text", "success", {
        //     button: "I am new button",
        // });
        if(passResult){
            var adminPayload = {email : email};
            var expireTime = {
                expiresIn:'1d'
            }
            const token = jwt.sign(adminPayload,ADMIN_SECRET_KEY,expireTime);
            response.cookie('admin_cookie',token,{httpOnly:true});
            if(!token)
                response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
            else{
                response.render("adminHome.ejs",{status : status.SUCCESS,message:message.LOGIN_SUCCESSFULL});
            }
        }else{
            response.render("adminLogin.ejs",{message:message.NOT_MATCHED,status:status.UN_AUTHORIZE});
        }
    }catch(error){
        console.log("Error in Login Controller : ",error);
        response.render("adminLogin.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});        
    }
}

export const adminEmployeeListController = async(request,response)=>{
    try{
        const result = await employeeSchema.find();
        // console.log(result);
        if(result.length!=0){
            response.render("adminEmployeeList.ejs",{employeeList:result,message:"",status:status.SUCCESS});
        }else{
            response.render("adminEmployeeList.ejs",{employeeList:result,message:message.NO_RECORD_FOUND,status:status.SUCCESS});
        }
    }catch(error){
        console.log("Error in adminEmployeeListController : ",error);
        response.render("adminHome.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});
    }
}

export const adminVerifyEmployeeController = async(request,response)=>{
    try{
        const enrollId = request.query.enrollId;
        const status = {
            $set:{
                adminVerify:"Verified"
            }
        }
        const result = await employeeSchema.updateOne({enrollId:enrollId},status);
        const employeeList = await employeeSchema.find();
        console.log(result);
        if(result.modifiedCount==1){
            response.render("adminEmployeeList.ejs",{employeeList:employeeList,message:message.UPDATE_SUCCESSFULLY,status:status.SUCCESS});
        }else{

            const employeeObj = await employeeSchema.findOne({enrollId:enrollId});
            if(employeeObj.adminVerify=="Verified")
                response.render("adminEmployeeList.ejs",{employeeList:employeeList,message:message.ALREADY_VERIFIED,status:status.SUCCESS});
            else
                response.render("adminEmployeeList.ejs",{employeeList:employeeList,message:message.UPDATE_ERROR,status:status.SUCCESS});
        }
    }catch(error){
        console.log("Error in adminVerifyEmployeeController : ",error);
        response.render("adminHome.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});
    }
}