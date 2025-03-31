import uuid4 from "uuid4";
import batchSchema from "../model/batchSchema.js";
import { message, status } from "../utils/statusMessage.js";
import courseSchema from "../model/courseSchema.js";
import employeeSchema from "../model/employeeSchema.js";
export const addBatchController = async(request,response)=>{
    try{
        // console.log("data : ",request.body);
        request.body.batchId = uuid4();
        const result = await batchSchema.create(request.body); 
        const courseArrObj = await courseSchema.find({status:true});
        // console.log(result);
        if(result){
            response.render('addBatch.ejs',{courseArrObj:courseArrObj.reverse(),name:request.employeePayload.name,message:message.BATCH_ADDED,status:status.SUCCESS});
        }else{
            response.render('addBatch.ejs',{courseArrObj:courseArrObj.reverse(),name:request.employeePayload.name,message:message.BATCH_ADD_ERROR,status:status.SUCCESS});
        }
    }catch(error){
        console.log("error in addBatchController : ",error);
        
        response.render('employeeHome.ejs',{profile:request.employeePayload.profile,email:request.employeePayload.email,name:request.employeePayload.name,message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});
    }
}

export const viewBatchesController = async(request,response)=>{
    try{
        const batchesData = await batchSchema.find();
        for(let i=0;i<batchesData.length;i++){
            const courseObj = await courseSchema.findOne({courseId:batchesData[i].courseId},{courseName:1});
            // console.log("courseName : ",courseObj.courseName);
            batchesData[i].courseName = courseObj.courseName; 

            const obj = await employeeSchema.findOne({enrollId:batchesData[i].trainerEnrollId},{name:1});
            console.log(obj);
            
            batchesData[i].trainerEnrollId = obj?.name ? obj.name : "Not Allocate";
        }
        response.render('viewBatches.ejs',{batchesData,name:request.employeePayload.name,message:"",status:status.SUCCESS});
    }catch(error){
        console.log("error in viewBatchesController : ",error);        
        response.render('employeeHome.ejs',{profile:request.employeePayload.profile,email:request.employeePayload.email,name:request.employeePayload.name,message:message.SOMETHING_WENT_WRONG,status:status.SERVER_ERROR});
    }
}

