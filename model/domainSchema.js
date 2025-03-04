import mongoose from 'mongoose';
const domainSchema = mongoose.Schema({
    domainId:{
        type:String,
        required:true
    },
    domainTitle:{
        type:String,
        required:true
    },
    domainDescription:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
});

export default mongoose.model('domainSchema',domainSchema,'domain');