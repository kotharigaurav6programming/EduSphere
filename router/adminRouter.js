import express from 'express';
import { adminLoginController } from '../controller/adminController.js';
import {fileURLToPath} from 'url';
import jwt from 'jsonwebtoken';
import path from 'path';
import { status,message } from '../utils/statusMessage.js';
// import dotenv from 'dotenv';
// dotenv.config();

var adminRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log("__dirname : ",__dirname.replace('\\router','')+'/public');
adminRouter.use(express.static(__dirname.replace('\\router','')+'/public'));

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY; // needs to uncomment dotenv.config();

const authenticateJWT = (request,response,next)=>{
    try{
        const token = request.cookies.admin_cookie;
        if(!token)
            response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
        else{
            jwt.verify(token,ADMIN_SECRET_KEY,(error,adminPayload)=>{
                if(error){
                    response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
                }else{
                    request.adminPayload = adminPayload;
                    next();
                }
            });
        }
    }catch(error){
        console.log("JWT Error : ",error);
        response.render("notfound.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.UN_AUTHORIZE});
    }
}

adminRouter.post('/adminLogin',adminLoginController);
adminRouter.get('/adminHome',authenticateJWT,(request,response)=>{
    response.render("adminHome.ejs",{adminEmail:request.adminPayload.email,status:status.SUCCESS});
});

export default adminRouter;