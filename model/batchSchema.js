import mongoose from 'mongoose';
const batchSchema = mongoose.Schema({
    batchId:{
        type:String,
        required:true
    },
    courseId:{
        type:String,
        required:true
    },
    startDate : {
        type: Date,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    batchDuration:{
        type:String,
        required:true
    },
    trainerEnrollId:{
        type:String,
        default:"Not Allocate"
    },
    status:{
        type:Boolean,
        default:false
    }
});
export default mongoose.model('batchSchema',batchSchema,'batch');