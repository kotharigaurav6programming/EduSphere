import mongoose from "mongoose";
const studentEnquirySchema = mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    }
});

export default mongoose.model('studentEnquirySchema',studentEnquirySchema,'studentEnquiry');