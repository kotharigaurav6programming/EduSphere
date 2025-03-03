import mongoose from 'mongoose';
const blogSchema = mongoose.Schema({
    blogId:{
        type:String,
        required:true
    },
    blogTitle:{
        type:String,
        required:true
    },
    blogContent:{
        type:String,
        required:true
    },
    timeToRead:{
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
    blogFile:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
});

export default mongoose.model('blogSchema',blogSchema,'blog');