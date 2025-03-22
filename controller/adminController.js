import adminSchema from "../model/adminSchema.js";
// import swal from 'sweetalert';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import uuid4 from 'uuid4';
import { status, message } from "../utils/statusMessage.js";
import bcrypt from 'bcrypt';
import employeeSchema from "../model/employeeSchema.js";
import studentEnquirySchema from "../model/studentEnquirySchema.js";
import { fileURLToPath } from "url";
import { log } from "console";
import uploadSyllabusSchema from "../model/uploadSyllabusSchema.js";
import mailer_syllabus from "./mailer_syllabus.js";
import courseSchema from '../model/courseSchema.js';
import detailedSyllabusSchema from "../model/detailedSyllabusSchema.js";
import batchSchema from "../model/batchSchema.js";
import blogSchema from "../model/blogSchema.js";
import moment from 'moment';
import domainSchema from "../model/domainSchema.js";
import interviewQuestionsSchema from "../model/interviewQuestionsSchema.js";
import glimphsSchema from "../model/glimphsSchema.js";

dotenv.config();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const adminLoginController = async (request, response) => {
    try {
        const { email, password } = request.body;
        const adminObj = await adminSchema.findOne({ email: email });
        const existingPassword = adminObj.password;
        const passResult = await bcrypt.compare(password, existingPassword);
        // swal("Here's a title", "Here's some text", "success", {
        //     button: "I am new button",
        // });
        if (passResult) {
            var adminPayload = { email: email };
            var expireTime = {
                expiresIn: '1d'
            }
            const token = jwt.sign(adminPayload, ADMIN_SECRET_KEY, expireTime);
            response.cookie('admin_cookie', token, { httpOnly: true });
            if (!token)
                response.render("notfound.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.UN_AUTHORIZE });
            else {
                response.render("adminHome.ejs", { status: status.SUCCESS, message: message.LOGIN_SUCCESSFULL });
            }
        } else {
            response.render("adminLogin.ejs", { message: message.NOT_MATCHED, status: status.UN_AUTHORIZE });
        }
    } catch (error) {
        console.log("Error in Login Controller : ", error);
        response.render("adminLogin.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const adminEmployeeListController = async (request, response) => {
    try {
        const result = await employeeSchema.find();
        // console.log(result);
        if (result.length != 0) {
            response.render("adminEmployeeList.ejs", { employeeList: result, message: "", status: status.SUCCESS });
        } else {
            response.render("adminEmployeeList.ejs", { employeeList: result, message: message.NO_RECORD_FOUND, status: status.SUCCESS });
        }
    } catch (error) {
        console.log("Error in adminEmployeeListController : ", error);
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const adminVerifyEmployeeController = async (request, response) => {
    try {
        const enrollId = request.query.enrollId;
        const status = {
            $set: {
                adminVerify: "Verified"
            }
        }
        const result = await employeeSchema.updateOne({ enrollId: enrollId }, status);
        const employeeList = await employeeSchema.find();
        console.log(result);
        if (result.modifiedCount == 1) {
            response.render("adminEmployeeList.ejs", { employeeList: employeeList, message: message.UPDATE_SUCCESSFULLY, status: status.SUCCESS });
        } else {

            const employeeObj = await employeeSchema.findOne({ enrollId: enrollId });
            if (employeeObj.adminVerify == "Verified")
                response.render("adminEmployeeList.ejs", { employeeList: employeeList, message: message.ALREADY_VERIFIED, status: status.SUCCESS });
            else
                response.render("adminEmployeeList.ejs", { employeeList: employeeList, message: message.UPDATE_ERROR, status: status.SUCCESS });
        }
    } catch (error) {
        console.log("Error in adminVerifyEmployeeController : ", error);
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const adminEnquiryStudentListController = async (request, response) => {
    try {
        const result = await studentEnquirySchema.find();
        const syllabusList = await uploadSyllabusSchema.find();
        // console.log(result);
        if (result.length != 0) {
            response.render("adminEnquiryStudentList.ejs", { enquiryStudentList: result, syllabusList: syllabusList, message: "", status: status.SUCCESS });
        } else {
            response.render("adminEnquiryStudentList.ejs", { enquiryStudentList: result, syllabusList: syllabusList, message: message.NO_RECORD_FOUND, status: status.SUCCESS });
        }
    } catch (error) {
        console.log("Error in adminEnquiryStudentListController : ", error);
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}
export const adminAddStudRemarkController = async (request, response) => {
    try {
        const id = request.body.id;
        const remark = request.body.remark;
        const status = {
            $set: {
                remark: remark
            }
        }
        const result = await studentEnquirySchema.updateOne({ id: id }, status);
        const studentResult = await studentEnquirySchema.find();
        const syllabusList = await uploadSyllabusSchema.find();

        // console.log(result);
        response.render("adminEnquiryStudentList.ejs", { enquiryStudentList: studentResult, syllabusList: syllabusList, message: message.ENQUIRY_REMARK, status: status.SUCCESS });

    } catch (error) {
        console.log("Error in adminEnquiryStudentListController : ", error);
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}
// code to check whether uploaded syllabus available or not starts
// export const checkUploadSyllabusAvailability = async(request,response)=>{
//     try{
//         const subject = request.body.subject;
//         const uploadSyllabusObj = await uploadSyllabusSchema.findOne({subject:subject});
//         var flag = true;
//         var msg;
//         if(uploadSyllabusObj){
//             msg = "Syllabus for the Subject is Already Uploaded | Do you want to Replace with New One ? "
//             response.render("adminUploadSyllabus.ejs",{message:msg,status:status.SUCCESS});
//         }else{
//             flag=false;
//             response.render("adminUploadSyllabus.ejs",{message:"",status:status.SUCCESS});
//         }

//     }catch(error){
//         console.log("Error in checkUploadSyllabusAvailability : ",error);
//         response.render("adminHome.ejs",{message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});

//     }
// }
// code to check whether uploaded syllabus available or not ends

export const adminUploadSyllabusController = async (request, response) => {
    try {
        const detailedObj = await detailedSyllabusSchema.find();
        const courseNameArray = [];
        for (let i = 0; i < detailedObj.length; i++) {
            const courseObj = await courseSchema.findOne({ courseId: detailedObj[i].courseId });
            courseNameArray.push(courseObj.courseName);
        }
        // console.log("courseNameArray : ",courseNameArray);
        // console.log("-----------------",request.body);
        const filename = request.files.syllabus;
        // console.log(request.files);
        const fileName = new Date().getTime() + filename.name;
        // console.log(__dirname.replace("\\controller","/public/syllabus/"));
        const filePath = path.join(__dirname.replace("\\controller", "/public/syllabus/") + fileName);
        filename.mv(filePath, async (error) => {
            try {
                request.body.syllabusId = uuid4();
                request.body.syllabus = fileName;
                const res = await uploadSyllabusSchema.findOne({ subject: request.body.subject });
                if (res) {
                    response.render("adminUploadSyllabus.ejs", { result: courseNameArray, message: message.COURSE_AVAILABLE, status: status.SUCCESS });
                } else {
                    const resultNew = await uploadSyllabusSchema.create(request.body);
                    response.render("adminUploadSyllabus.ejs", { result: courseNameArray, message: message.UPLOAD_STATUS, status: status.SUCCESS });
                }
            } catch (error) {
                console.log(error);
                response.render("adminUploadSyllabus.ejs", { result: courseNameArray, message: message.FILE_NOT_UPLOADED, status: status.SUCCESS });
            }
        })
    } catch (error) {
        console.log(error);
        response.render("adminHome.ejs", { message: message.SERVER_ERROR, status: status.SERVER_ERROR });
    }
}

export const adminSendSyllabusController = async (request, response) => {
    try {
        const studentEmail = request.body.email;
        const enquiryTime = request.body.enquiryTime;
        const syllabusFileName = request.body.syllabus;
        const enquiryStudentList = await studentEnquirySchema.find();
        const syllabusList = await uploadSyllabusSchema.find();
        console.log(syllabusFileName);
        mailer_syllabus.mailer(studentEmail, syllabusFileName, async (info) => {
            if (info) {
                console.log("main sent with syllabus");
                const selectionCriteria = {
                    $and: [
                        { email: studentEmail },
                        { enquiryTime: enquiryTime }
                    ]
                };
                const result = await studentEnquirySchema.updateOne(selectionCriteria, { $set: { syllabusStatus: "Mail Sent" } });
                const enquiryStudentListUpdate = await studentEnquirySchema.find();
                // console.log("mail syllabus status : ",result);
                // if(result.modifiedCount==1){
                response.render("adminEnquiryStudentList.ejs", { enquiryStudentList: enquiryStudentListUpdate, syllabusList: syllabusList, message: message.MAIL_SENT_SYLLABUS, status: status.SUCCESS });
                // }
                // else{
                //     console.log("----------- already send----- : ",result.modifiedCount);
                // }
            } else {
                console.log("=------------- : ", info);
                response.render("adminEnquiryStudentList.ejs", { enquiryStudentList: enquiryStudentList, syllabusList: syllabusList, message: message.MAIL_NOT_SENT, status: status.SUCCESS });
            }
        });
    } catch (error) {
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const adminAddCourseController = async (request, response) => {
    try {
        request.body.courseId = uuid4();
        const result = await courseSchema.create(request.body);
        console.log("Add course result : ", result);
        if (result) {
            response.render("adminCourses.ejs", { message: message.COURSE_ADDED, status: status.SUCCESS });
        } else {
            response.render("adminCourses.ejs", { message: message.COURSE_NOT_ADDED, status: status.SUCCESS });
        }
    } catch (error) {
        // console.log("--------------",error.code);
        if (error.code == 11000) {
            response.render("adminCourses.ejs", { message: message.COURSE_ALREADY_EXIST, status: status.SUCCESS });
        } else {
            response.render("notfound.ejs", { message: message, status: status.SERVER_ERROR });
        }
    }
}

export const adminViewCoursesController = async (request, response) => {
    try {
        const result = await courseSchema.find();
        // console.log(result);
        if (result.length != 0) {
            response.render("adminViewCoursesList.ejs", { courseList: result, message: "", status: status.SUCCESS });
        } else {
            response.render("adminViewCoursesList.ejs", { courseList: result, message: message.NO_RECORD_FOUND, status: status.SUCCESS });
        }
    } catch (error) {
        console.log("Error in adminViewCoursesListController : ", error);
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const adminCourseListController = async (request, response) => {
    try {
        const result = await courseSchema.find();
        // console.log(result);
        if (result.length != 0) {
            response.render("adminCourseList.ejs", { courseList: result, message: "", status: status.SUCCESS });
        } else {
            response.render("adminCourseList.ejs", { courseList: result, message: message.NO_RECORD_FOUND, status: status.SUCCESS });
        }
    } catch (error) {
        console.log("Error in adminCourseListController : ", error);
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const adminAddDetailedSyllabusController = async (request, response) => {
    try {
        // console.log("JSON STRING : ",request.query.course);
        // console.log("JAVASCRIPT OBJECT : ",JSON.parse(request.query.course));
        const courseObj = JSON.parse(request.query.course);
        const courseId = courseObj.courseId;
        const existingDetailedObject = await detailedSyllabusSchema.findOne({ courseId });
        // console.log("existingDetailedObject : ",existingDetailedObject);
        var flag = false;
        if (existingDetailedObject) {
            flag = true;
            response.render("adminAddDetailedSyllabus.ejs", { flag, courseObj, message: "Course Have Detailed Syllabus | Changes done and add will replace Previous Content", status: "" });
        }
        else {
            response.render("adminAddDetailedSyllabus.ejs", { flag, courseObj, message: "", status: "" });
        }
    } catch (error) {
        console.log("error in admin add detailed syllabus controller : ", error);
        response.render("adminCourseList.ejs", { message: "", status: "" });
    }
}

export const adminDetailedSyllabusController = async (request, response) => {
    try {
        const courseObj = JSON.parse(request.body.courseObj);
        const courseId = courseObj.courseId;
        request.body.courseId = courseId;

        const existingDetailedObject = await detailedSyllabusSchema.findOne({ courseId });
        console.log("existingDetailedObject : ", existingDetailedObject);
        var flag = true;
        var msg;
        if (existingDetailedObject) {
            msg = message.DETAILED_SYLLABUS_MODIFIED;
            const res = await detailedSyllabusSchema.updateOne({ courseId }, { $set: request.body });
            console.log("modify : ", res);
        } else {
            msg = message.DETAILED_SYLLABUS_ADDED;
            request.body.detailedSyllabusId = uuid4();
            const res = await detailedSyllabusSchema.create(request.body);
            console.log("add : ", res);
        }
        response.render('adminAddDetailedSyllabus', { flag, courseObj, message: msg, status: status.SUCCESS });
    } catch (error) {
        console.log("adminDetailedSyllabusController : ", error);
        response.render("adminCourseList.ejs", { message: "", status: "" });
    }
}


export const downloadExcelController = async (request, response) => {
    try {
        const enquiryStudentList = await studentEnquirySchema.find();
        const syllabusList = await uploadSyllabusSchema.find();

        const { fromDate, toDate } = request.query;

        if (!fromDate || !toDate) {
            return response.status(400).send('Please provide both from and to dates.');
        }

        const sampleData = await studentEnquirySchema.find();

        // Helper function to parse 'dd/MM/yyyy' to a JavaScript Date object
        function parseDate(dateString) {
            const [day, month, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day);
        }

        // Filter data based on date range
        const filteredData = sampleData.filter(item => {
            const enquiredDate = parseDate(item.enquiryDate);
            return enquiredDate >= new Date(fromDate) && enquiredDate <= new Date(toDate);
        });

        if (filteredData.length === 0) {
            response.render("adminEnquiryStudentList.ejs", { enquiryStudentList: enquiryStudentList, syllabusList: syllabusList, message: 'No data available for the selected date range.', status: status.SUCCESS });
        }

        // Format data and headers
        const formattedData = filteredData.map((item, index) => ({
            SNO: index + 1,
            Email: item.email || 'N/A',
            Contact: item.contact || 'N/A',
            EnquiryDate: item.enquiryDate || 'N/A',
            Subject: item.subject || 'N/A'
        }));
        console.log(formattedData);

        // Define headers explicitly
        const headers = ['SNO', 'Email', 'Contact', 'EnquiryDate', 'Subject'];

        // Create a new workbook and worksheet with headers
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(formattedData, { header: headers });

        // Append the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, "FilteredData");

        // Define the file path
        const filePath = path.join(__dirname, 'filtered_data.xlsx');

        // Write the Excel file to the server temporarily
        xlsx.writeFile(workbook, filePath);

        // Send the file for download
        response.download(filePath, 'filtered_data.xlsx', (err) => {
            if (err) {
                console.error("Error downloading the file:", err);
            } else {
                console.log('Download successfully');
                fs.unlinkSync(filePath); // Clean up the file after download
            }
        });
    } catch (error) {
        console.log("Error in excel:", error);
        //   response.status(500).send('Internal Server Error');
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
};

export const adminViewBatchesController = async (request, response) => {
    try {
        //const result = await batchSchema.find();

        const batchesData = await batchSchema.find({ status: false });
        for (let i = 0; i < batchesData.length; i++) {
            const courseObj = await courseSchema.findOne({ courseId: batchesData[i].courseId }, { courseName: 1 });
            console.log("courseName : ", courseObj.courseName);
            batchesData[i].courseName = courseObj.courseName;
        }
        const trainerArrObj = await employeeSchema.find({ profile: "Trainer" });
        response.render("adminViewBatches.ejs", { trainerArrObj, batchesData, message: "", status: status.SUCCESS });
    } catch (error) {
        console.log("error while admin view batches controller : ", error);
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });

    }
}

export const adminAllocateTrainerController = async (request, response) => {
    try {
        // console.log(request.body);
        const result = await batchSchema.updateOne({ batchId: request.body.batchId }, { $set: { trainerEnrollId: request.body.trainerEnrollId, status: true } });
        // console.log("AFTER UPDATE : ",result);

        const batchesData = await batchSchema.find({ status: false });
        for (let i = 0; i < batchesData.length; i++) {
            const courseObj = await courseSchema.findOne({ courseId: batchesData[i].courseId }, { courseName: 1 });
            console.log("courseName : ", courseObj.courseName);
            batchesData[i].courseName = courseObj.courseName;
        }
        const trainerArrObj = await employeeSchema.find({ profile: "Trainer" });
        response.render("adminViewBatches.ejs", { trainerArrObj, batchesData, message: message.ALLOCATION_SUCCESS, status: status.SUCCESS });

    } catch (error) {
        console.log("Error in adminAllocateTrainerController : ", error);
        response.render("adminHome.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const adminAddBlogController = async (request, response) => {
    try {
        //console.log(request.body);
        const filename = request.files.blogFile;
        // console.log(request.files);
        const fileName = new Date().getTime() + filename.name;
        const filePath = path.join(__dirname.replace("\\controller", "/public/blogImages/") + fileName);
        filename.mv(filePath, async (error) => {
            try {
                request.body.blogId = uuid4();
                request.body.blogFile = fileName;
                request.body.uploadDate = moment().format('DD-MM-YYYY');
                request.body.uploadTime = moment().format('hh:mm:ss A');
                const resultNew = await blogSchema.create(request.body);
                response.render("createBlogForm.ejs", { message: message.UPLOAD_STATUS, status: status.SUCCESS });
            } catch (error) {
                console.log(error);
                response.render("createBlogForm.ejs", { message: message.FILE_NOT_UPLOADED, status: status.SUCCESS });
            }
        })
    } catch (error) {
        console.log("Error in adminAddBlogController : ", error);
        response.render("createBlogForm.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const adminAddDomainController = async (request, response) => {
    try {
        request.body.domainId = uuid4();
        const result = await domainSchema.create(request.body);
        response.render("createDomainForm.ejs", { message: message.DOMAIN_ADDED, status: status.SUCCESS });
    } catch (error) {
        console.log("Error in adminAddDomainController : ", error);
        response.render("createDomainForm.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const updateDomainFormController = async (request, response) => {
    response.render("updateDomainForm.ejs", { domainObj: JSON.parse(request.body.domainObj), message: "", status: "" });
}
export const adminUpdateDomainController = async (request, response) => {
    const domainId = { domainId: request.body.domainId };
    const updateStatus = {
        $set: {
            domainTitle: request.body.domainTitle,
            domainDescription: request.body.domainDescription
        }
    }
    const result = await domainSchema.updateOne(domainId, updateStatus);
    console.log(result);
    if (result.modifiedCount == 1) {
        const domainResult = await domainSchema.find({ status: true });
        response.render("domainPage.ejs", { message: message.DOMAIN_UPDATED, status: status.SUCCESS, domainResult: domainResult.reverse() });
    } else {
        const domainResult = await domainSchema.find({ status: true });
        response.render("domainPage.ejs", { message: message.DOMAIN_NOT_UPDATED, status: status.SUCCESS, domainResult: domainResult.reverse() });
    }
}

export const deleteDomainController = async (request, response) => {
    console.log("domainId : ", JSON.parse(request.body.domainObj).domainId);

    const domainId = { domainId: JSON.parse(request.body.domainObj).domainId };
    const updateStatus = {
        $set: {
            status: false
        }
    }
    const result = await domainSchema.updateOne(domainId, updateStatus);
    console.log(result);
    if (result.modifiedCount == 1) {
        const domainResult = await domainSchema.find({ status: true });
        response.render("domainPage.ejs", { message: message.DOMAIN_DELETED, status: status.SUCCESS, domainResult: domainResult.reverse() });
    } else {
        const domainResult = await domainSchema.find({ status: true });
        response.render("domainPage.ejs", { message: message.DOMAIN_NOT_DELETED, status: status.SUCCESS, domainResult: domainResult.reverse() });
    }
}
export const domainPageController = async (request, response) => {
    const domainResult = await domainSchema.find({ status: true });
    response.render("domainPage.ejs", { message: "", status: "", domainResult: domainResult.reverse() });
}

export const createDomainFormController = async (request, response) => {
    response.render("createDomainForm.ejs", { message: "", status: "" });
}

export const addInterviewQuestionsController = async (request, response) => {
    response.render("adminAddInterviewQuestions.ejs", { domainObj: JSON.parse(request.body.domainObj), message: "", status: "" });
}

export const adminAddInterviewQuestionsController = async (request, response) => {
    try {
        // console.log(request.body);
        request.body.interviewQuestionsId = uuid4();
        request.body.domainId = JSON.parse(request.body.domainObj).domainId;
        const result = await interviewQuestionsSchema.create(request.body);
        // console.log(result);
        if (result) {
            const domainResult = await domainSchema.find({ status: true });
            response.render("domainPage.ejs", { message: message.INTERVIEW_QUESTIONS_ADDED, status: status.SUCCESS, domainResult: domainResult.reverse() });
        } else {
            console.log("Inside else of try while admin add interview questions");
            const domainResult = await domainSchema.find({ status: true });
            response.render("domainPage.ejs", { message: message.INTERVIEW_QUESTIONS_NOT_ADDED, status: status.SUCCESS, domainResult: domainResult.reverse() });
        }
    } catch (error) {
        console.log("Error while admin add interview questions : ", error);
        const domainResult = await domainSchema.find({ status: true });
        response.render("domainPage.ejs", { message: message.INTERVIEW_QUESTIONS_NOT_ADDED, status: status.SERVER_ERROR, domainResult: domainResult.reverse() });
    }
}

export const adminViewInterviewQuestionsController = async (request, response) => {
    try {
        const domainId = JSON.parse(request.body.domainObj).domainId;
        const result = await interviewQuestionsSchema.find({ domainId: domainId });
        console.log(result);
        if (result.length != 0) {
            response.render("adminViewInterviewQuestions.ejs", { interviewQuestions: result, message: "", status: status.SUCCESS });
        } else {
            console.log("Inside else of try while admin view interview questions");
            const domainResult = await domainSchema.find({ status: true });
            response.render("domainPage.ejs", { message: message.INTERVIEW_QUESTIONS_NOT_FOUND, status: status.SUCCESS, domainResult: domainResult.reverse() });
        }
    } catch (error) {
        console.log("Error while admin add interview questions : ", error);
        const domainResult = await domainSchema.find({ status: true });
        response.render("domainPage.ejs", { message: message.INTERVIEW_QUESTIONS_NOT_ADDED, status: status.SERVER_ERROR, domainResult: domainResult.reverse() });
    }
}

export const adminViewBlogController = async (request, response) => {
    try {
        const blogData = JSON.parse(request.body.blogData);
        response.render("viewUpdateBlogForm.ejs", { blogData: blogData, message: "", status: "" });
    } catch (error) {
        console.log("Error while admin view blog controller : ", error);
        const blogData = await blogSchema.find();
        response.render("blogPage.ejs", { blogData: blogData, message: "", status: status.SUCCESS });
    }
}
export const updateBlogController = async (request, response) => {
    try {
        const fileCheck = request.files;
        console.log("fileCheck : ", fileCheck);

        if (request.files) {
            console.log("file uploaded while update");
            // console.log(request.body);
            // console.log(request.files);
            const filename = request.files.blogFile;
            const fileName = new Date().getTime() + filename.name;
            const filePath = path.join(__dirname.replace("\\controller", "/public/blogImages/") + fileName);

            filename.mv(filePath, async (error) => {
                try {
                    request.body.blogFile = fileName;
                    request.body.uploadDate = moment().format('DD-MM-YYYY');
                    request.body.uploadTime = moment().format('hh:mm:ss A');
                    const resultNew = await blogSchema.updateOne({
                        blogId: request.body.blogId
                    }, {
                        $set: request.body
                    });
                    const blogData = await blogSchema.find();
                    response.render("blogPage.ejs", { blogData: blogData, message: message.BLOG_UPDATED, status: status.SUCCESS });
                } catch (error) {
                    console.log("Error in updateBlogController : ", error);
                    const blogData = await blogSchema.find();
                    response.render("blogPage.ejs", { blogData: blogData, message: message.BLOG_NOT_UPDATED, status: status.SERVER_ERROR });
                }
            })
        } else {
            console.log("File not uploaded while update");
            request.body.blogFile = request.body.previousBlogFile;
            console.log(request.body);

            request.body.uploadDate = moment().format('DD-MM-YYYY');
            request.body.uploadTime = moment().format('hh:mm:ss A');
            const resultNew = await blogSchema.updateOne({
                blogId: request.body.blogId
            }, {
                $set: request.body
            });
            const blogData = await blogSchema.find();
            response.render("blogPage.ejs", { blogData: blogData, message: message.BLOG_UPDATED, status: status.SUCCESS });
        }

    } catch (error) {
        console.log("Error in updateBlogController : ", error);
        const blogData = await blogSchema.find();
        response.render("blogPage.ejs", { blogData: blogData, message: message.BLOG_NOT_UPDATED, status: status.SERVER_ERROR });
    }
}

export const adminDeleteBlogController = async (request, response) => {
    try {
        const blogId = request.body.blogId;
        const resultNew = await blogSchema.deleteOne({blogId});
        const blogData = await blogSchema.find();
        response.render("blogPage.ejs", { blogData: blogData, message: message.BLOG_DELETED, status: status.SUCCESS });
    } catch (error) {
        console.log("Error in adminDeleteBlogController : ", error);
        const blogData = await blogSchema.find();
        response.render("blogPage.ejs", { blogData: blogData, message: message.BLOG_NOT_DELETED, status: status.SERVER_ERROR });
    }
}

export const adminDeleteInterviewQuestionController = async(request,response)=>{
    try{        
        // console.log(request.body.interviewQuestionsId);
        // console.log(request.body.interviewQuestionIndex);
        const iqId = request.body.interviewQuestionsId;
        const index = request.body.interviewQuestionIndex;
        const interviewObj = await interviewQuestionsSchema.findOne({interviewQuestionsId:iqId});
        //console.log(interviewObj);
        interviewObj.question.splice(index,1);
        interviewObj.description.splice(index,1);
        interviewObj.company.splice(index,1);
        interviewObj.frequency.splice(index,1);
        //console.log(interviewObj);
        
        const result = await interviewQuestionsSchema.updateOne({interviewQuestionsId:iqId},{$set:interviewObj});
        //console.log(result);
        if(result.modifiedCount>0){
            const domainResult = await domainSchema.find({ status: true });
            response.render("domainPage.ejs", { message: message.INTERVIEW_QUESTIONS_DELETED, status: status.SUCCESS, domainResult: domainResult.reverse() });
        } else{
            const domainResult = await domainSchema.find({ status: true });
            response.render("domainPage.ejs", { message: message.INTERVIEW_QUESTIONS_NOT_DELETED, status: status.SUCCESS, domainResult: domainResult.reverse() });
        }
    }catch(error){
        console.log("inside catch of adminDeleteInterviewQuestionController : ",error);
        const domainResult = await domainSchema.find({ status: true });
        response.render("domainPage.ejs", { message: message.INTERVIEW_QUESTIONS_NOT_DELETED, status: status.SUCCESS, domainResult: domainResult.reverse() });
    }
}

export const glimphsFileUploadController = async(request,response)=>{
    try {
        const filename = request.files.glimphsImage;
        const fileName = new Date().getTime() + filename.name;
        const filePath = path.join(__dirname.replace("\\controller", "/public/glimphsImages/") + fileName);
        filename.mv(filePath, async (error) => {
            if(error){
                console.log("Error while glimphsfile upload : ",error);
                const glimphsData = await glimphsSchema.find();
                response.render("glimphsGallery.ejs", {glimphsData:glimphsData.reverse(),message: message.FILE_NOT_UPLOADED, status: status.SUCCESS });
            }else{
                request.body.glimphsId = uuid4();
                request.body.glimphsImage = fileName;
                const resultNew = await glimphsSchema.create(request.body);
                const glimphsData = await glimphsSchema.find();
                response.render("glimphsGallery.ejs", {glimphsData:glimphsData.reverse(),message: message.UPLOAD_STATUS, status: status.SUCCESS });
            }
        })
    } catch (error) {
        console.log("Error in glimphsFileUploadController : ",error);
        response.render("adminHome.ejs", { message: message.SERVER_ERROR, status: status.SERVER_ERROR });
    }
}
// needs to print email id on every page {email:request.payload.email} like this