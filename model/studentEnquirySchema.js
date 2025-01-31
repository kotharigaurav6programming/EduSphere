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
    },
    enquiryDate:{
        type:String,
        default:new Date().toLocaleDateString()
    },
    enquiryTime:{
        type:String,
      //  default:new Date().getTime()
        default: () => new Date().getTime().toString()
    },
    remark:{
        type:String,
        default:"No Remark Yet"
    },
    syllabusStatus:{
        type:String,
        default:"No Mail Sent"
    }
});

export default mongoose.model('studentEnquirySchema',studentEnquirySchema,'studentEnquiry');