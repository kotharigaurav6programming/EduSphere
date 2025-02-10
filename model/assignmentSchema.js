import mongoose from 'mongoose';
const assignmentSchema = mongoose.Schema({
    assignmentId:{
        type:String,
        required:true
    },
    batchId:{
        type:String,
        required:true
    },
    courseName : {
        type: String,
        required:true
    },
    trainerName:{
        type:String,
        required:true
    },
    allocationDate:{
        type:Date,
        required:true
    },
    submissionDate:{
        type:Date,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    },
    assignmentDoc:{
        type:File,
        required:true
    }
});
export default mongoose.model('assignmentSchema',assignmentSchema,'assignment');