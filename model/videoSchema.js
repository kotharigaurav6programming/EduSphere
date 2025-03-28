import mongoose from 'mongoose';
const videoSchema = mongoose.Schema({
    videoId:{
        type:String,
        required:true
    },
    videoLink:{
        type:String,
        required:true
    },
    videoTitle:{
        type:String,
        required:true
    },
    videoDesc:{
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
    }
});

export default mongoose.model('videoSchema',videoSchema,'video');