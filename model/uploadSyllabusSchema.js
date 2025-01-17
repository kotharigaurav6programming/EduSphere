import mongoose from "mongoose";

const uploadSyllabusSchema = mongoose.Schema({
    syllabusId : {
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    syllabus:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
});

export default mongoose.model('uploadSyllabusSchema',uploadSyllabusSchema,'uploadSyllabus');