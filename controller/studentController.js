import uuid4 from "uuid4";
import { message, status } from "../utils/statusMessage.js";
import { fileURLToPath } from 'url';
import path from "path";
import bcrypt from 'bcrypt';
import studentSchema from "../model/studentSchema.js";
import jwt from "jsonwebtoken";
import allocateBatchSchema from "../model/allocateBatchSchema.js";
import batchSchema from "../model/batchSchema.js";
import testimonialSchema from "../model/testimonialSchema.js";
import moment from 'moment';
import uploadSyllabusSchema from "../model/uploadSyllabusSchema.js";
import glimphsSchema from "../model/glimphsSchema.js";
import videoSchema from "../model/videoSchema.js";
import courseSchema from "../model/courseSchema.js";
import assignmentSchema from "../model/assignmentSchema.js";
import customUpload from "../utils/customUploadFunctionality.js";
const STUDENT_SECRET_KEY = process.env.STUDENT_SECRET_KEY;

// export const studentRegistrationController = async (request, response) => {
//     try {
//         const uuid = uuid4();
//         const __filename = fileURLToPath(import.meta.url);
//         const __dirname = path.dirname(__filename);
//         // console.log(__dirname);

//         const filename = request.files.docs;
//         const fileName = new Date().getTime() + filename.name;
//         const pathName = path.join(__dirname.replace('\\controller', "") + '/public/documents/' + fileName);
//         filename.mv(pathName, async (error) => {
//             if (error) {
//                 console.log("error : ", error);
//                 response.render("studentRegistration.ejs", { message: message.FILE_NOT_UPLOADED, status: status.NOT_FOUND });
//             } else {
//                 const studentObj = request.body;
//                 studentObj.enrollId = uuid;
//                 studentObj.profilePic = fileName;
//                 studentObj.password = await bcrypt.hash(request.body.password, 10);
//                 const res = await studentSchema.create(studentObj);
//                 if (res) {
//                     response.render("studentLogin.ejs", { message: message.REGISTRATION_SUCCESSFULL, status: status.SUCCESS });
//                 } else {
//                     response.render("studentRegistration.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
//                 }
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         response.render("notfound.ejs", { message: message.SERVER_ERROR, status: status.SERVER_ERROR });
//     }
// }

export const studentRegistrationController = async (request, response) => {
    try {
        const uuid = uuid4();
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // console.log(__dirname);

        const filename = request.files.docs;
        const fileName = new Date().getTime() + filename.name;
        const fileUrl = await customUpload('documents', filename, fileName);

        const studentObj = request.body;
        studentObj.enrollId = uuid;
        studentObj.profilePic = fileUrl;
        studentObj.password = await bcrypt.hash(request.body.password, 10);
        const res = await studentSchema.create(studentObj);
        if (res) {
            response.render("studentLogin.ejs", { message: message.REGISTRATION_SUCCESSFULL, status: status.SUCCESS });
        } else {
            response.render("studentRegistration.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
        }
    } catch (error) {
        console.log(error);
        response.render("notfound.ejs", { message: message.SERVER_ERROR, status: status.SERVER_ERROR });
    }
}


export const studentLoginController = async (request, response) => {
    try {
        const { email, password } = request.body;
        const studentObj = await studentSchema.findOne({ email: email });
        const existingPassword = studentObj?.password ? studentObj.password : '';
        const passResult = await bcrypt.compare(password, existingPassword);
        if (passResult) {
            if (studentObj.status && studentObj.adminVerify == "Verified") {
                var studentPayload = { email: email, name: studentObj.name };
                var expireTime = {
                    expiresIn: '1d'
                }
                const token = jwt.sign(studentPayload, STUDENT_SECRET_KEY, expireTime);
                response.cookie('student_cookie', token, { httpOnly: true });
                if (!token)
                    response.render("notfound.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.UN_AUTHORIZE });
                else {
                    response.render("studentHome.ejs", { email, name: studentObj.name, status: status.SUCCESS, message: message.LOGIN_SUCCESSFULL });
                }
            } else {
                response.render("studentLogin.ejs", { message: message.CONTACT_ADMIN, status: status.SUCCESS });
            }
        } else {
            response.render("studentLogin.ejs", { message: message.NOT_MATCHED, status: status.UN_AUTHORIZE });
        }
    } catch (error) {
        console.log("Error in student Login Controller : ", error);
        response.render("studentLogin.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const viewBatchesController = async (request, response) => {
    try {
        const email = request.studentPayload.email;
        const allocatedBatchData = await allocateBatchSchema.find({ email }).lean();
        // console.log("allocatedBatchData : ",allocatedBatchData);
        for (let i = 0; i < allocatedBatchData.length; i++) {
            const batchData = await batchSchema.findOne({ batchId: allocatedBatchData[i].batchId });
            allocatedBatchData[i].startDate = batchData.startDate;
            allocatedBatchData[i].startTime = batchData.startTime;
            allocatedBatchData[i].endTime = batchData.endTime;
            allocatedBatchData[i].batchDuration = batchData.batchDuration;
        }

        response.render("studentViewBatches.ejs", { allocatedBatchData, email: request.studentPayload.email, name: request.studentPayload.name, status: status.SUCCESS, message: "" });
    } catch (error) {
        console.log("Error in view Batch Controller : ", error);
        response.render("studentHome.ejs", { email: request.studentPayload.email, name: request.studentPayload.name, status: status.SERVER_ERROR, message: message.SOMETHING_WENT_WRONG });
    }
}


export const addTestimonialController = async (request, response) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // console.log(__dirname);

        const filename = request.files.profilePic;
        const fileName = new Date().getTime() + filename.name;

        const fileUrl = await customUpload('testimonial', filename, fileName);

        request.body.testimonialId = uuid4();
        request.body.uploadDate = moment().format('DD-MM-YYYY');
        request.body.uploadTime = moment().format('hh:mm:ss A');
        request.body.profilePic = fileUrl;
        const result = await testimonialSchema.create(request.body);
        const res = await uploadSyllabusSchema.find();
        // console.log(res);
        const glimphsData = await glimphsSchema.find({ status: true });
        const videoData = await videoSchema.find({ status: true });
        const courseData = await courseSchema.find({ status: true });
        const testStatus = {
            $and: [
                {
                    adminVerify: 'Verified',
                    status: true
                }
            ]
        }
        const testimonialData = await testimonialSchema.find(testStatus);
        response.render("home.ejs", { testimonialData: testimonialData.reverse(), courseData: courseData.reverse(), videoData: videoData.reverse(), glimphsData: glimphsData.reverse(), result: res, message: "", status: "" });
    } catch (error) {
        response.render("notfound.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const studentViewAssignmentsController = async (request, response) => {
    try {
        const batchId = request.body.batchId;
        const assignments = await assignmentSchema.find({ batchId });
        response.render("studentViewAssignments.ejs", { assignments, email: request.studentPayload.email, name: request.studentPayload.name, message: "", status: status.SUCCESS });
    } catch (error) {
        console.log("Error in student view assignment controller : ", error);
        response.render("studentHome.ejs", { email: request.studentPayload.email, name: request.studentPayload.name, status: status.SERVER_ERROR, message: message.SOMETHING_WENT_WRONG });
    }
}