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
import uploadSyllabusSchema from './model/uploadSyllabusSchema.js';
import detailedSyllabusSchema from './model/detailedSyllabusSchema.js';
import batchRouter from './router/batchRouter.js';
import assignmentRouter from './router/assignmentRouter.js';
import blogSchema from './model/blogSchema.js';
import blogRouter from './router/blogRouter.js';
import domainSchema from './model/domainSchema.js';
import interviewQuestionsRouter from './router/interviewQuestionsRouter.js';
import studentRouter from './router/studentRouter.js';
import glimphsSchema from './model/glimphsSchema.js';
import videoSchema from './model/videoSchema.js';
import testimonialSchema from './model/testimonialSchema.js';

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
        const res = await uploadSyllabusSchema.find();
        // console.log(res);
        const glimphsData = await glimphsSchema.find({status:true});
        const videoData = await videoSchema.find({status:true});
        const courseData = await courseSchema.find({status:true});
        const testStatus = {
            $and:[
                {
                    adminVerify:'Verified',
                    status:true
                }
            ]
        }
        const testimonialData = await testimonialSchema.find(testStatus);
        response.render("home.ejs",{testimonialData:testimonialData.reverse(),courseData:courseData.reverse(),videoData:videoData.reverse(),glimphsData:glimphsData.reverse(),result:res,message:"",status:""});
    }catch(error){
        console.log("error in home page: ",error);
        response.render("notfound.ejs",{message:message.SERVER_ERROR,status:status.SERVER_ERROR});
    }
});

app.get("/adminLogin",(request,response)=>{
    response.render("adminLogin.ejs",{message:"",status:""});
});
app.use('/admin',adminRouter);
app.use('/studentEnquiry',studentEnquiryRouter);
app.use('/employee',employeeRouter);
app.use('/batch',batchRouter);
app.use('/assignment',assignmentRouter);
app.use('/blog',blogRouter);
app.use('/interview',interviewQuestionsRouter);
app.use('/student',studentRouter);
app.listen(process.env.PORT,()=>{
    console.log("Connection established Successfully");
});