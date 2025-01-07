// created by aditya


import adminSchema from "../model/adminSchema.js";
// import swal from 'sweetalert';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { status,message } from "../utils/statusMessage.js";
import bcrypt from 'bcrypt';
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

    }
}