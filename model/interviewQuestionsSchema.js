import mongoose from "mongoose";
const interviewQuestionsSchema = mongoose.Schema({
    interviewQuestionsId : {
        type:String,
        required:true
    },
    domainId : {
        type:String,
        required:true
    },
    question : {
        type:[],
        required:true
    },
    description : {
        type:[],
        required:true
    },
    company : {
        type:[],
        required:true
    },
    frequency : {
        type:[],
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
});
export default mongoose.model('interviewQuestionsSchema',interviewQuestionsSchema,'interviewQuestions');