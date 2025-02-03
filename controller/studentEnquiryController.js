import uuid4 from "uuid4";
import studentEnquirySchema from "../model/studentEnquirySchema.js";
import courseSchema from "../model/courseSchema.js";
import detailedSyllabusSchema from "../model/detailedSyllabusSchema.js";
import uploadSyllabusSchema from "../model/uploadSyllabusSchema.js";

export const studentEnquiry = async(request,response)=>{
    try{
        console.log("request.body : ",request.body);
        // Generate a new UUID
        const enquiryObj = {
            id:uuid4(),
            email:request.body.email,
            contact:request.body.contact,
            subject:request.body.subject
        }
        console.log("enquiryObj : ",enquiryObj);
        
        const result = await studentEnquirySchema.create(enquiryObj);
         
        const courseObj = await courseSchema.findOne({courseName:request.body.subject});
        const detailedSyllabusObj = await detailedSyllabusSchema.findOne({courseId:courseObj.courseId});
        detailedSyllabusObj.courseName = request.body.subject;
        const uploadSyllabusObj = await uploadSyllabusSchema.findOne({subject:request.body.subject}); 
        console.log("Upload SyllabusObj : ",uploadSyllabusObj);
        
        detailedSyllabusObj.fileName = uploadSyllabusObj.syllabus; 
        if(result){
            response.render("studentECContent.ejs",{detailedSyllabusObj});
        }
    }catch(error){
        console.log("Error in studentEnquiry : ",error);
        
    }
}