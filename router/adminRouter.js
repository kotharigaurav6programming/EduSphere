import express from 'express';
import { adminLoginController,adminEmployeeListController,adminVerifyEmployeeController,adminEnquiryStudentListController,adminAddStudRemarkController,adminUploadSyllabusController,adminSendSyllabusController,adminAddCourseController,adminViewCoursesController,adminCourseListController,adminAddDetailedSyllabusController,adminDetailedSyllabusController,downloadExcelController,adminViewBatchesController,adminAllocateTrainerController,adminAddBlogController,adminAddDomainController,updateDomainFormController,adminUpdateDomainController,deleteDomainController,domainPageController, createDomainFormController,addInterviewQuestionsController,adminAddInterviewQuestionsController,adminViewInterviewQuestionsController,adminViewBlogController,updateBlogController,adminDeleteBlogController,adminDeleteInterviewQuestionController,glimphsFileUploadController } from '../controller/adminController.js';
import {fileURLToPath} from 'url';
import jwt from 'jsonwebtoken';
import path from 'path';
import { status,message } from '../utils/statusMessage.js';
import courseSchema from '../model/courseSchema.js';
import detailedSyllabusSchema from '../model/detailedSyllabusSchema.js';
import domainSchema from '../model/domainSchema.js';
import blogSchema from '../model/blogSchema.js';
// import dotenv from 'dotenv';
// dotenv.config();

var adminRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log("__dirname : ",__dirname.replace('\\router','')+'/public');
adminRouter.use(express.static(__dirname.replace('\\router','')+'/public'));
/*
if we comment this line adminRouter.use(express.static(__dirname.replace('\\router','')+'/public'));
then also front end properly works as we put <base href='/'> on every page <head> tag
*/
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
adminRouter.get('/adminEmployeeList',authenticateJWT,adminEmployeeListController);
adminRouter.get('/adminVerifyEmployee',authenticateJWT,adminVerifyEmployeeController);
adminRouter.get('/enquiryStudentList',authenticateJWT,adminEnquiryStudentListController);
adminRouter.post('/addEnqStudRemark',authenticateJWT,adminAddStudRemarkController);
adminRouter.get('/adminStudent',authenticateJWT,(request,response)=>{
    response.render("adminStudent.ejs");
});
adminRouter.post('/adminUploadSyllabus',authenticateJWT,adminUploadSyllabusController);
adminRouter.post('/adminSendSyllabus',authenticateJWT,adminSendSyllabusController)
adminRouter.post('/adminAddCourse',authenticateJWT,adminAddCourseController);
adminRouter.get('/adminViewCourses',authenticateJWT,adminViewCoursesController);
adminRouter.get('/adminCourses',authenticateJWT,(request,response)=>{
    response.render("adminCourses.ejs",{message:"",status:""});
});
adminRouter.get('/uploadSyllabus',authenticateJWT,async(request,response)=>{
    try{
        const detailedObj = await detailedSyllabusSchema.find();
        const courseNameArray = [];
        for(let i=0;i<detailedObj.length;i++){
            const courseObj = await courseSchema.findOne({courseId:detailedObj[i].courseId});
            courseNameArray.push(courseObj.courseName);
        }
        // console.log("courseNameArray : ",courseNameArray);
            response.render("adminUploadSyllabus.ejs",{message:"",status:"",result:courseNameArray});
        }catch(error){
            console.log(error);
            
            response.render("notfound.ejs",{message:message.SERVER_ERROR,status:status.SERVER_ERROR});
        }
});
adminRouter.get('/adminCourseList',authenticateJWT,adminCourseListController);
adminRouter.get('/adminAddDetailedSyllabus',authenticateJWT,adminAddDetailedSyllabusController);
adminRouter.post('/adminDetailedSyllabus',authenticateJWT,adminDetailedSyllabusController);
adminRouter.get('/download-excel',authenticateJWT,downloadExcelController);
adminRouter.get('/adminViewBatches',authenticateJWT,adminViewBatchesController);
adminRouter.post('/adminAllocateTrainer',authenticateJWT,adminAllocateTrainerController);
adminRouter.get('/blogPage',authenticateJWT,async(request,response)=>{
    const blogData = await blogSchema.find();
    response.render("blogPage.ejs",{blogData:blogData,message:"",status:status.SUCCESS});
});
adminRouter.get('/createBlogForm',authenticateJWT,(request,response)=>{
    response.render("createBlogForm.ejs",{message:"",status:""});
});
adminRouter.post('/adminViewBlog',authenticateJWT,adminViewBlogController);
adminRouter.post('/adminAddBlog',authenticateJWT,adminAddBlogController);
adminRouter.get('/domainPage',authenticateJWT,domainPageController);
adminRouter.get('/createDomainForm',authenticateJWT,createDomainFormController);
adminRouter.post('/adminAddDomain',authenticateJWT,adminAddDomainController);
adminRouter.post('/updateDomainForm',authenticateJWT,updateDomainFormController);
adminRouter.post('/adminUpdateDomain',authenticateJWT,adminUpdateDomainController);
adminRouter.post('/deleteDomain',authenticateJWT,deleteDomainController);
adminRouter.post('/addInterviewQuestions',authenticateJWT,addInterviewQuestionsController);
adminRouter.post('/adminAddInterviewQuestions',authenticateJWT,adminAddInterviewQuestionsController);
adminRouter.post('/adminViewInterviewQuestions',authenticateJWT,adminViewInterviewQuestionsController);
adminRouter.post('/updateBlog',authenticateJWT,updateBlogController);
adminRouter.post('/adminDeleteBlog',authenticateJWT,adminDeleteBlogController);
adminRouter.post('/adminDeleteInterviewQuestion',authenticateJWT,adminDeleteInterviewQuestionController);
adminRouter.get('/glimphsGallery',authenticateJWT,async(request,response)=>{
    response.render("glimphsGallery.ejs",{message:"",status:status.SUCCESS});
});
adminRouter.post('/glimphsFileUpload',authenticateJWT,glimphsFileUploadController);
export default adminRouter;

