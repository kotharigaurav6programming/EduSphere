import mongoose from "mongoose";
const detailedSyllabusSchema = mongoose.Schema({
    detailedSyllabusId : {
        type:String
    },
    courseId : {
        type:String,
        required:true
    },
    mainTopic : {
        type:[],
        required:true
    },
    subTopic : {
        type:[],
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
});
export default mongoose.model('detailedSyllabusSchema',detailedSyllabusSchema,'detailedSyllabus');