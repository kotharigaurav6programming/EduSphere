import mongoose from "mongoose";
const testimonialSchema = mongoose.Schema({
    testimonialId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        required:true
    },
    uploadDate:{
        type:String,
        required:true
    },
    uploadTime:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    adminVerify:{
        type:String,
        default:"Not Verified"
    }
});
export default mongoose.model('testimonialSchema',testimonialSchema,'testimonial');