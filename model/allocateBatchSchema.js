import mongoose from 'mongoose';
const allocateBatchSchema = mongoose.Schema({
    allocateBatchId:{
        type:String,
        required:true
    },
    batchId:{
        type:String,
        required:true
    },
    courseId:{
        type:String,
        required:true
    },
    trainerName:{
        type:String,
        required:true
    },
    courseName:{
        type:String,
        required:true
    },
    enrollId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});
export default mongoose.model('allocateBatchSchema',allocateBatchSchema,'allocateBatch');