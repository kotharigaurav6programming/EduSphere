import adminSchema from "../model/adminSchema.js";
// import swal from 'sweetalert';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import uuid4 from 'uuid4';
import { status,message } from "../utils/statusMessage.js";
import bcrypt from 'bcrypt';
import employeeSchema from "../model/employeeSchema.js";
import studentEnquirySchema from "../model/studentEnquirySchema.js";
import { fileURLToPath } from "url";
import { log } from "console";
import uploadSyllabusSchema from "../model/uploadSyllabusSchema.js";
import mailer_syllabus from "./mailer_syllabus.js";
import courseSchema from '../model/courseSchema.js';
import detailedSyllabusSchema from "../model/detailedSyllabusSchema.js";
dotenv.config();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const adminEnquiryStudentListController = async(request,response)=>{
    try{
        const result = await studentEnquirySchema.find();
        const syllabusList = await uploadSyllabusSchema.find();
        // console.log(result);
        if(result.length!=0){
            response.render("adminEnquiryStudentList.ejs",{enquiryStudentList:result,syllabusList:syllabusList,message:"",status:status.SUCCESS});
        }else{
            response.render("adminEnquiryStudentList.ejs",{enquiryStudentList:result,syllabusList:syllabusList,message:message.NO_RECORD_FOUND,status:status.SUCCESS});
        }
    }catch(error){
        console.log("Error in adminEnquiryStudentListController : ",error);
        response.render("adminHome.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});
    }
}
export const adminAddStudRemarkController = async(request,response)=>{
    try{
        const id = request.body.id; 
        const remark = request.body.remark;
        const status = {
            $set:{
                remark:remark
            }
        }
        const result = await studentEnquirySchema.updateOne({id:id},status);
        const studentResult = await studentEnquirySchema.find();
        const syllabusList = await uploadSyllabusSchema.find();
        
        // console.log(result);
            response.render("adminEnquiryStudentList.ejs",{enquiryStudentList:studentResult,syllabusList:syllabusList,message:message.ENQUIRY_REMARK,status:status.SUCCESS});
            
    }catch(error){
        console.log("Error in adminEnquiryStudentListController : ",error);
        response.render("adminHome.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});
    }
}

export const adminUploadSyllabusController = async(request,response)=>{
    try{
        const result = await courseSchema.find();
        // console.log("-----------------",request.body);
        const filename = request.files.syllabus;
        // console.log(request.files);
        const fileName = new Date().getTime()+filename.name;
        // console.log(__dirname.replace("\\controller","/public/syllabus/"));
        const filePath = path.join(__dirname.replace("\\controller","/public/syllabus/")+fileName);
        filename.mv(filePath,async(error)=>{
            try{
                request.body.syllabusId = uuid4();
                request.body.syllabus = fileName;
                const resultNew = await uploadSyllabusSchema.create(request.body);
                console.log(resultNew);
                response.render("adminUploadSyllabus.ejs",{result:result,message:message.UPLOAD_STATUS,status:status.SUCCESS});
            }catch(error){
                console.log(error);
                response.render("adminUploadSyllabus.ejs",{result:result,message:message.FILE_NOT_UPLOADED,status:status.SUCCESS});
            }
        })
    }catch(error){
        console.log(error);
        response.render("adminHome.ejs",{message:message.SERVER_ERROR,status:status.SERVER_ERROR});
    }
}

export const adminSendSyllabusController = async(request,response)=>{
    try{
        const studentEmail = request.body.email;
        const syllabusFileName = request.body.syllabus;
        const enquiryStudentList = await studentEnquirySchema.find();
        const syllabusList = await uploadSyllabusSchema.find();
        console.log(syllabusFileName);
        mailer_syllabus.mailer(studentEmail,syllabusFileName,async(info)=>{
            if(info){
                console.log("main sent with syllabus");
                const result = await studentEnquirySchema.updateOne({email:studentEmail},{$set:{syllabusStatus:"Mail Sent"}});
                const enquiryStudentListUpdate = await studentEnquirySchema.find();
                // console.log("mail syllabus status : ",result);
                // if(result.modifiedCount==1){
                    response.render("adminEnquiryStudentList.ejs",{enquiryStudentList:enquiryStudentListUpdate,syllabusList:syllabusList,message:message.MAIL_SENT_SYLLABUS,status:status.SUCCESS});
                // }
                // else{
                //     console.log("----------- already send----- : ",result.modifiedCount);
                // }
            }else{
            console.log("=------------- : ",info);
            response.render("adminEnquiryStudentList.ejs",{enquiryStudentList:enquiryStudentList,syllabusList:syllabusList,message:message.MAIL_NOT_SENT,status:status.SUCCESS});
        }            
        });
    }catch(error){
        response.render("adminHome.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});       
    }
}

export const adminAddCourseController = async(request,response)=>{
    try{
        request.body.courseId = uuid4();
        const result = await courseSchema.create(request.body);
        console.log("Add course result : ",result);
        if(result){
            response.render("adminCourses.ejs",{message:message.COURSE_ADDED,status:status.SUCCESS});
        }else{
            response.render("adminCourses.ejs",{message:message.COURSE_NOT_ADDED,status:status.SUCCESS});
        }
    }catch(error){
        // console.log("--------------",error.code);
        if(error.code==11000){
            response.render("adminCourses.ejs",{message:message.COURSE_ALREADY_EXIST,status:status.SUCCESS});
        }else{
            response.render("notfound.ejs",{message:message,status:status.SERVER_ERROR});
        }
    }
}

export const adminViewCoursesController = async(request,response)=>{
    try{
        const result = await courseSchema.find();
        // console.log(result);
        if(result.length!=0){
            response.render("adminViewCoursesList.ejs",{courseList:result,message:"",status:status.SUCCESS});
        }else{
            response.render("adminViewCoursesList.ejs",{courseList:result,message:message.NO_RECORD_FOUND,status:status.SUCCESS});
        }
    }catch(error){
        console.log("Error in adminViewCoursesListController : ",error);
        response.render("adminHome.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});
    }
}

export const adminCourseListController = async(request,response)=>{
    try{
        const result = await courseSchema.find();
        // console.log(result);
        if(result.length!=0){
            response.render("adminCourseList.ejs",{courseList:result,message:"",status:status.SUCCESS});
        }else{
            response.render("adminCourseList.ejs",{courseList:result,message:message.NO_RECORD_FOUND,status:status.SUCCESS});
        }
    }catch(error){
        console.log("Error in adminCourseListController : ",error);
        response.render("adminHome.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});
    }
}

export const adminAddDetailedSyllabusController = async (request,response)=>{
    try{
        // console.log("JSON STRING : ",request.query.course);
        // console.log("JAVASCRIPT OBJECT : ",JSON.parse(request.query.course));
        const courseObj = JSON.parse(request.query.course);
        const courseId = courseObj.courseId;
        const existingDetailedObject = await detailedSyllabusSchema.findOne({courseId});
        // console.log("existingDetailedObject : ",existingDetailedObject);
        var flag = false;
        if(existingDetailedObject){
            flag=true;
            response.render("adminAddDetailedSyllabus.ejs",{flag,courseObj,message:"Course Have Detailed Syllabus | Changes done and add will replace Previous Content",status:""});
        }
        else{
            response.render("adminAddDetailedSyllabus.ejs",{flag,courseObj,message:"",status:""});
        }
    }catch(error){
        console.log("error in admin add detailed syllabus controller : ",error);
        response.render("adminCourseList.ejs",{message:"",status:""});
    }
}

export const adminDetailedSyllabusController = async(request,response)=>{
    try{
        const courseObj = JSON.parse(request.body.courseObj);
        const courseId = courseObj.courseId;
        request.body.courseId=courseId;

        const existingDetailedObject = await detailedSyllabusSchema.findOne({courseId});
        console.log("existingDetailedObject : ",existingDetailedObject);
        var flag = true;
        var msg;
        if(existingDetailedObject){
            msg = message.DETAILED_SYLLABUS_MODIFIED;
            const res = await detailedSyllabusSchema.updateOne({courseId},{$set:request.body});
            console.log("modify : ",res);
        }else{
            msg=message.DETAILED_SYLLABUS_ADDED;
            request.body.detailedSyllabusId = uuid4();
            const res = await detailedSyllabusSchema.create(request.body);
            console.log("add : ",res);
        }
        response.render('adminAddDetailedSyllabus',{flag,courseObj,message:msg,status:status.SUCCESS});        
    }catch(error){
        console.log("adminDetailedSyllabusController : ",error);
        response.render("adminCourseList.ejs",{message:"",status:""});
    }
}
// needs to print email id on every page {email:request.payload.email} like this