import uuid4 from "uuid4";
import studentEnquirySchema from "../model/studentEnquirySchema.js";
import courseSchema from "../model/courseSchema.js";
import detailedSyllabusSchema from "../model/detailedSyllabusSchema.js";
import uploadSyllabusSchema from "../model/uploadSyllabusSchema.js";

export const studentEnquiry = async(request,response)=>{
    try{
        // Generate a new UUID
        var id = uuid4();
        console.log(id);
        
        const enquiryObj = {
            id:id,
            email:request.body.email,
            contact:request.body.contact,
            subject:request.body.subject
        }
        const result = await studentEnquirySchema.create(enquiryObj);
        // console.log("result : ",result);
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