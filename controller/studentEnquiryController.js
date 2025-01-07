import uuid4 from "uuid4";
import studentEnquirySchema from "../model/studentEnquirySchema.js";

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
        if(result){
            response.render("studentECContent.ejs");
        }
    }catch(error){

    }
}