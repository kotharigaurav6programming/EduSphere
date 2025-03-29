import mongoose from 'mongoose';
const courseSchema = mongoose.Schema({
    courseId:{
        type:String,
        required:true
    },
    courseName:{
        type:String,
        required:true,
        unique:true
    },
    courseType:{
        type:String,
        required:true
    },
    courseDuration:{
        type:String,
        required:true
    },
    courseFees:{
        type:String,
        required:true
    },
    // added this two fields extra
    courseDesc:{
        type:String,
        required:true
    },
    courseFile:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
});

export default mongoose.model('courseSchema',courseSchema,'course');