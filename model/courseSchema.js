import mongoose from 'mongoose';
const courseSchema = mongoose.Schema({
    courseId:{
        type:String,
        required:true
    },
    courseName:{
        type:String,
        required:true
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
    }
});

export default mongoose.model('courseSchema',courseSchema,'course');