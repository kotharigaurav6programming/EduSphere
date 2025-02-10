export const addAssignmentController = async(request,response)=>{
    try{
        console.log("Data received : ",request.body);
        console.log("Data file received : ",request.files.assignmentDoc);
        
    }catch(error){
        console.log("Error in addAssignmentController : ",error);
        
    }
}