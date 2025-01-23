import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import expressFileUpload from 'express-fileupload';
import jwt from 'jsonwebtoken';
import {fileURLToPath} from 'url';
import path from 'path';
import adminRouter from './router/adminRouter.js';
import studentEnquiryRouter from './router/studentEnquiryRouter.js';
import employeeRouter from './router/employeeRouter.js';
import mongoose from "mongoose";
import { url } from './connection/dbConfig.js';
import courseSchema from './model/courseSchema.js';
import { message, status } from './utils/statusMessage.js';

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    serverSelectionTimeoutMS:1200000,
    maxPoolSize: 10, // Set the maximum pool size to 10
});

dotenv.config();
var app = express();

app.set("views","views");
app.set("view engine","ejs");

app.use(cookieParser());
app.use(expressFileUpload());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname+'/public'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/",async (request,response)=>{
    try{
        const result = await courseSchema.find();
        console.log(result);
        response.render("home.ejs",{result:result});
    }catch(error){
        response.render("notfound.ejs",{message:message.SERVER_ERROR,status:status.SERVER_ERROR});
    }
});

app.get("/adminLogin",(request,response)=>{
    response.render("adminLogin.ejs",{message:"",status:""});
});
app.use('/admin',adminRouter);
app.use('/studentEnquiry',studentEnquiryRouter);
app.use('/employee',employeeRouter);

app.listen(process.env.PORT,()=>{
    console.log("Connection established Successfully");
});