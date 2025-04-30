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
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

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

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  });
  

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
        //response.render("home.ejs",{testimonialData:testimonialData.reverse(),courseData:courseData.reverse(),videoData:videoData.reverse(),glimphsData:glimphsData.reverse(),result:res,message:"",status:""});

        response.render("home.ejs", {
            testimonialData: testimonialData.reverse(),
            courseData: courseData.reverse(),
            videoData: videoData.reverse(),
            glimphsData: glimphsData.reverse(),
            result: res,
            message: "",
            status: "",
          
            // SEO metadata
            pageTitle: "EduSphere | Best Programming & IT Courses in India",
            metaDescription: "Join EduSphere – the leading coaching institute for C, C++, Java, Python, Full Stack Development, Data Analytics,MERN STACK, node, express, mongodb and mysql and more. Get certified and career-ready.",
            metaKeywords: "EduSphere, programming coaching, Java training, Python, C++, IT courses, computer classes, Mern Stack, git github, deployment, cloud, aws",
            canonicalUrl: "http://23.22.33.19:5000/",
          
            // Social sharing
            ogImage: "http://23.22.33.19:5000/images/og-image.jpg",
            twitterCard: "summary_large_image",
          
            // Structured Data
            structuredData: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "EduSphere",
              "url": "http://23.22.33.19:5000",
              "logo": "http://23.22.33.19:5000/images/logo.png",
              "sameAs": [
                "https://www.facebook.com/Codingthinker/",
                "https://www.instagram.com/codingthinker/"
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "207, Indraprastha Tower, M G Road, Inddore",
                "addressLocality": "Indore",
                "addressRegion": "Madhya Pradesh",
                "postalCode": "452001",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-7415155301",
                "contactType": "Customer Service"
              }
            })
          });
          
    }catch(error){
        console.log("error in home page: ",error);
        response.render("notfound.ejs",{message:message.SERVER_ERROR,status:status.SERVER_ERROR});
    }
});



app.get("/course",async (request,response)=>{
    try{
        const courseData = await courseSchema.find({status:true});
        response.render("courseList.ejs",{courseData:courseData.reverse(),message:"",status:""});
    }catch(error){
        console.log("error in course page: ",error);
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

// for seo
app.get('/sitemap.xml', async (req, res) => {
    try {
      // List of URLs (you can dynamically fetch from MongoDB)
      const links = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/course', changefreq: 'weekly', priority: 0.8 },
        { url: '/blog', changefreq: 'monthly', priority: 0.5 }
        // You can add dynamic slugs for blog posts or courses from MongoDB here
      ];
  
      const stream = new SitemapStream({ hostname: 'http://23.22.33.19:5000' });
  
      res.header('Content-Type', 'application/xml');
      streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
        res.send(data.toString())
      );
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  });



app.listen(process.env.PORT,()=>{
    console.log("Connection established Successfully");
});