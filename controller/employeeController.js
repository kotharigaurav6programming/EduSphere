import path from 'path';
import { fileURLToPath } from 'url';
import employeeSchema from '../model/employeeSchema.js';
import uuid4 from 'uuid4';
import { message, status } from '../utils/statusMessage.js'
import mailer from './mailer.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { request } from 'http';
import { response } from 'express';
import courseSchema from '../model/courseSchema.js';
import batchSchema from '../model/batchSchema.js';
import mailer_enrollLink from './mailer_enrollLink.js';
import studentSchema from '../model/studentSchema.js';
import customUpload from '../utils/customUploadFunctionality.js';
const EMPLOYEE_SECRET_KEY = process.env.EMPLOYEE_SECRET_KEY;

export const employeeRegistrationController = async (request, response) => {
    try {
        const uuid = uuid4();
        //  console.log(request.body);
        //  console.log(request.files);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // console.log(__dirname);

        const filename = request.files.docs;
        const fileName = new Date().getTime() + filename.name;
        const fileUrl = await customUpload('documents', filename, fileName);

        const employeeObj = request.body;
        employeeObj.enrollId = uuid;
        employeeObj.profilePic = fileUrl;
        employeeObj.password = await bcrypt.hash(request.body.password, 10);
        mailer.mailer(request.body.email, async (result) => {
            if (result) {
                // console.log("info in employeecontroller : ",result);
                const res = await employeeSchema.create(employeeObj);
                if (res) {
                    response.render("employeeLogin.ejs", { message: message.REGISTRATION_SUCCESSFULL + " | " + message.MAIL_SENT });
                } else {
                    response.render("employeeRegistration.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
                }
            } else {
                // console.log("error in employeecontroller : ",result);
                response.render("employeeRegistration.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
            }
        });
    } catch (error) {
        console.log(error);
        response.render("notfound.ejs", { message: message.SERVER_ERROR, status: status.SERVER_ERROR });
    }
}


export const employeeVerifyEmailController = async (request, response) => {
    try {
        const email = request.query.email;
        const status = {
            $set: {
                emailVerify: "Verified"
            }
        }
        const result = await employeeSchema.updateOne({ email: email }, status);
        console.log("result : ", result);
        if (result) {
            response.render("employeeLogin.ejs", { message: message.ADMIN_VERIFICATION_REQUIRED, status: status.SUCCESS });
        } else {

        }

    } catch (error) {
        console.log("Error in employeeVerifyEmailController : ", error);

    }
}

export const employeeLoginController = async (request, response) => {
    try {
        const { email, password } = request.body;
        const employeeObj = await employeeSchema.findOne({ email: email });
        const existingPassword = employeeObj.password;
        const passResult = await bcrypt.compare(password, existingPassword);
        if (passResult) {
            if (employeeObj.status) {
                var employeePayload = { email: email, profile: employeeObj.profile, name: employeeObj.name };
                var expireTime = {
                    expiresIn: '1d'
                }
                const token = jwt.sign(employeePayload, EMPLOYEE_SECRET_KEY, expireTime);
                response.cookie('employee_cookie', token, { httpOnly: true });
                if (!token)
                    response.render("notfound.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.UN_AUTHORIZE });
                else {
                    response.render("employeeHome.ejs", { email, profile: employeeObj.profile, name: employeeObj.name, status: status.SUCCESS, message: message.LOGIN_SUCCESSFULL });
                }
            } else {
                response.render("employeeLogin.ejs", { message: message.ACCOUNT_DEACTIVATED, status: status.SUCCESS });
            }
        } else {
            response.render("employeeLogin.ejs", { message: message.NOT_MATCHED, status: status.UN_AUTHORIZE });
        }
    } catch (error) {
        console.log("Error in Login Controller : ", error);
        response.render("employeeLogin.ejs", { message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const employeeViewBatchesController = async (request, response) => {
    try {
        const employeeEnrollId = await employeeSchema.findOne({ email: request.employeePayload.email }, { enrollId: 1 });
        const batchesData = await batchSchema.find({ trainerEnrollId: employeeEnrollId.enrollId });
        for (let i = 0; i < batchesData.length; i++) {
            const courseObj = await courseSchema.findOne({ courseId: batchesData[i].courseId }, { courseName: 1 });
            // console.log("courseName : ",courseObj.courseName);
            batchesData[i].courseName = courseObj.courseName;

            const obj = await employeeSchema.findOne({ enrollId: batchesData[i].trainerEnrollId }, { name: 1 });
            // console.log(obj);
            batchesData[i].trainerEnrollId = obj?.name ? obj.name : "Not Allocate";
        }
        response.render('employeeViewBatches.ejs', { batchesData, name: request.employeePayload.name, message: "", status: status.SUCCESS });
    } catch (error) {
        console.log("error in employeeViewBatchesController : ", error);
        response.render('employeeHome.ejs', { profile: request.employeePayload.profile, email: request.employeePayload.email, name: request.employeePayload.name, message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const assignmentFormController = async (request, response) => {
    try {
        const data = JSON.parse(request.query.data);
        // console.log("data received : ",data);
        response.render("assignmentForm.ejs", { data, email: request.employeePayload.email, name: request.employeePayload.name, message: "", status: status.SUCCESS });
    } catch (error) {
        console.log("error in assignmentFormController : ", error);

    }
}

export const sendEnrollLinkController = async (request, response) => {
    try {
        mailer_enrollLink.mailer(request.body.email, async (result) => {
            if (result) {
                console.log("info in sendEnrollLinkcontroller : ", result);
                response.render("employeeHome.ejs", { profile: request.employeePayload.profile, email: request.employeePayload.email, name: request.employeePayload.name, message: message.MAIL_SENT_FOR_ENROLL, status: status.SUCCESS });
            } else {
                response.render("employeeHome.ejs", { profile: request.employeePayload.profile, email: request.employeePayload.email, name: request.employeePayload.name, message: message.LOW_INTERNET, status: "" });
            }
        });
    } catch (error) {
        response.render("employeeHome.ejs", { profile: request.employeePayload.profile, email: request.employeePayload.email, name: request.employeePayload.name, message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const viewStudentListController = async (request, response) => {
    try {
        const studentData = await studentSchema.find();
        //console.log(studentData);
        response.render('viewStudentList.ejs', { studentData: studentData, name: request.employeePayload.name, message: "", status: status.SUCCESS });
    } catch (error) {
        console.log("error in viewStudentListController : ", error);
        response.render('employeeHome.ejs', { profile: request.employeePayload.profile, email: request.employeePayload.email, name: request.employeePayload.name, message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

export const allocateBatchController = async (request, response) => {
    try {
        const batchData = await batchSchema.find().lean();
        const studentData = await studentSchema.find({}, { enrollId: 1, name: 1, email: 1, _id: 0 }).lean();

        const batchArray = [];
        for (let i = 0; i < batchData.length; i++) {
            let trainerObj = await employeeSchema.findOne({ enrollId: batchData[i].trainerEnrollId });
            if (trainerObj) {
                batchData[i].trainerName = trainerObj.name;
                let courseObj = await courseSchema.findOne({ courseId: batchData[i].courseId });
                // console.log("------------> "+courseObj+"-=-=-=-=-=>"+batchData[i].batchId);
                batchData[i].courseName = courseObj.courseName;
                batchData[i].courseId = courseObj.courseId;
                // console.log("modified : ",batchData[i]);
                batchData[i].studentData = studentData;
                batchArray.push(batchData[i]);
            }
        }
        //   console.log(batchArray);        
        response.render("allocateBatch.ejs", { batchArray, profile: request.employeePayload.profile, email: request.employeePayload.email, name: request.employeePayload.name, message: "", status: "" });
    } catch (error) {
        console.log("error in allocateBatchController : ", error);
        response.render('employeeHome.ejs', { profile: request.employeePayload.profile, email: request.employeePayload.email, name: request.employeePayload.name, message: message.SOMETHING_WENT_WRONG, status: status.SERVER_ERROR });
    }
}

/*
whats the difference between  const batchData = await batchSchema.find().lean(); and  const batchData = await batchSchema.find(); as both gives same output
ChatGPT said:
Great question! Both

javascript
Copy
Edit
const batchData = await batchSchema.find();
and

javascript
Copy
Edit
const batchData = await batchSchema.find().lean();
give the same output initially, but there's a key difference in how they behave when modified.

1. find() Without .lean()
javascript
Copy
Edit
const batchData = await batchSchema.find();
Returns: An array of Mongoose model instances (Mongoose documents).

Effects:

These documents have additional functionalities like schema methods, virtuals, and middleware.

They are not plain JavaScript objects, so modifying them doesn't always behave as expected.

When you modify a field (batchData[i].trainerName = "John"), it may not persist unless you explicitly save it (batchData[i].save()).

Example: Unexpected Modification Behavior
javascript
Copy
Edit
const batchData = await batchSchema.find();
batchData[0].trainerName = "John";
console.log(batchData[0].trainerName); // "John" (seems to work)

// BUT:
console.log(await batchSchema.findOne({ _id: batchData[0]._id })); 
// trainerName is still undefined in the database unless you call batchData[0].save()
2. find().lean()
javascript
Copy
Edit
const batchData = await batchSchema.find().lean();
Returns: An array of plain JavaScript objects (not Mongoose documents).

Effects:

Modifications persist in the returned array because it's just a normal object.

However, you lose access to Mongoose features like instance methods, virtuals, and middleware.

Better performance: Mongoose skips overhead related to documents and models.

Example: Proper Modification Behavior
javascript
Copy
Edit
const batchData = await batchSchema.find().lean();
batchData[0].trainerName = "John";
console.log(batchData[0].trainerName); // "John" (works as expected)

// No need to call `save()`, but these changes are only in-memory.
Key Differences:
Feature	find() (Mongoose Docs)	find().lean() (Plain Objects)
Returns	Mongoose Documents	Plain JavaScript Objects
Can Modify Directly?	❌ No (requires .save())	✅ Yes (modifications persist)
Includes Mongoose Methods?	✅ Yes	❌ No
Uses Schema Virtuals?	✅ Yes	❌ No
Faster Performance?	❌ No (extra overhead)	✅ Yes (skips Mongoose processing)
When to Use Which?
✅ Use .lean() when:

You just need to fetch and modify data without saving to the database.

You don’t need Mongoose features like instance methods, middleware, or virtuals.

You want better performance (e.g., API responses).

❌ Avoid .lean() when:

You need to use Mongoose methods or middleware.

You plan to modify and save the documents back to the database (since .lean() returns objects, not Mongoose instances, .save() won’t work).

Final Takeaway
👉 If you're only reading data and making modifications inside memory, use .lean() for better performance.
👉 If you need to interact with the Mongoose model (e.g., save changes, use instance methods, virtuals, etc.), use find() without .lean().

Let me know if you need further clarification! 🚀
*/