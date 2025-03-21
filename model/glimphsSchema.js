import mongoose from "mongoose";
const glimphsSchema = mongoose.Schema({
    glimphsId:{
        type:String,
        required:true
    },
    glimphsImage:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
});
export default mongoose.model('glimphsSchema',glimphsSchema,'glimphs');