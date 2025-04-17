import uuid4 from 'uuid4';
import path from 'path';
import { fileURLToPath } from 'url';
import { message, status } from '../utils/statusMessage.js';
import assignmentSchema from '../model/assignmentSchema.js';
import customUpload from '../utils/customUploadFunctionality.js';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename).replace("\\controller", "");

// export const addAssignmentController = async (request, response) => {
//     var obj= {
//         batchId:request.body.batchId,
//         batchCourse : request.body.batchCourse,
//         trainerName:request.body.trainerName
//     }
//     try {
//         // console.log("Data received : ",request.body);
//         // console.log("Data file received : ",request.files.assignmentDoc);
//         let filename = request.files.assignmentDoc;
//         let fileName = new Date().getTime() + filename.name;
//         let pathName = path.join(__dirname + '/public/assignment/' + fileName);
//         filename.mv(pathName,async (error) => {
//             if (error) {
//                 response.render("assignmentForm.ejs",{data:obj,email:request.employeePayload.email,name:request.employeePayload.name,message:message.ASSIGNMENT_NOT_UPLOAD,status:status.SUCCESS});
//             } else {
//                 request.body.assignmentId = uuid4();
//                 request.body.assignmentDoc = fileName;
//                 const result = await assignmentSchema.create(request.body); 

//                 response.render("assignmentForm.ejs",{data:obj,email:request.employeePayload.email,name:request.employeePayload.name,message:message.ASSIGNMENT_UPLOADED,status:status.SUCCESS});
//             }
//         })
//     } catch (error) {
//         console.log("Error in addAssignmentController : ", error);
//        response.render("assignmentForm.ejs",{data:obj,email:request.employeePayload.email,name:request.employeePayload.name,message:message.ASSIGNMENT_NOT_UPLOAD,status:status.SUCCESS});
//     }
// }

export const addAssignmentController = async (request, response) => {
    var obj = {
        batchId: request.body.batchId,
        batchCourse: request.body.batchCourse,
        trainerName: request.body.trainerName
    }
    try {
        // console.log("Data received : ",request.body);
        // console.log("Data file received : ",request.files.assignmentDoc);
        let filename = request.files.assignmentDoc;
        let fileName = new Date().getTime() + filename.name;
        let fileUrl = await customUpload('assignment', filename, fileName);

        request.body.assignmentId = uuid4();
        request.body.assignmentDoc = fileUrl;
        const result = await assignmentSchema.create(request.body);

        response.render("assignmentForm.ejs", { data: obj, email: request.employeePayload.email, name: request.employeePayload.name, message: message.ASSIGNMENT_UPLOADED, status: status.SUCCESS });

    } catch (error) {
        console.log("Error in addAssignmentController : ", error);
        response.render("assignmentForm.ejs", { data: obj, email: request.employeePayload.email, name: request.employeePayload.name, message: message.ASSIGNMENT_NOT_UPLOAD, status: status.SUCCESS });
    }
}