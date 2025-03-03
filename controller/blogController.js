import blogSchema from "../model/blogSchema.js";
import uploadSyllabusSchema from "../model/uploadSyllabusSchema.js";
export const blogController = async(request,response)=>{
    try{
        const blogData = await blogSchema.find();
        // console.log(blogData);
        response.render("blog.ejs",{blogData:blogData,message:"",status:""});
    }catch(error){
        console.log("Error in blog : ",error);
        const res = await uploadSyllabusSchema.find();
        response.render("home.ejs",{result:res,message:"",status:""});        
    }    
}

export const detailedBlogController = async(request,response)=>{
    try{
        const blogData = JSON.parse(request.query.blogObject);
        //console.log(blogData);
        response.render("detailedBlog.ejs",{blogObject:blogData,message:"",status:""});
    }catch(error){
        console.log("Error in detailed blog controller : ",error);
        const res = await uploadSyllabusSchema.find();
        response.render("home.ejs",{result:res,message:"",status:""});
    }    
}