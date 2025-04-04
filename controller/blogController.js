import blogSchema from "../model/blogSchema.js";
import glimphsSchema from "../model/glimphsSchema.js";
import uploadSyllabusSchema from "../model/uploadSyllabusSchema.js";
export const blogController = async (request, response) => {
    try {
        const blogData = await blogSchema.find();
        // console.log(blogData);
        response.render("blog.ejs", { blogData: blogData, message: "", status: "" });
    } catch (error) {
        console.log("Error in blog : ", error);
        const res = await uploadSyllabusSchema.find();
        const glimphsData = await glimphsSchema.find({ status: true });
        const videoData = await videoSchema.find({ status: true });
        const courseData = await courseSchema.find({status:true});
        const testStatus = {
                    $and:[
                        {
                            adminVerify:'Verified',
                            status:true
                        }
                    ]
                }
                const testimonialData = await testimonialSchema.find(testStatus);
                response.render("home.ejs",{testimonialData:testimonialData.reverse(),courseData:courseData.reverse(),videoData:videoData.reverse(),glimphsData:glimphsData.reverse(),result:res,message:"",status:""});
    }
}

export const detailedBlogController = async (request, response) => {
    try {
        const blogData = JSON.parse(request.query.blogObject);
        //console.log(blogData);
        response.render("detailedBlog.ejs", { blogObject: blogData, message: "", status: "" });
    } catch (error) {
        console.log("Error in detailed blog controller : ", error);
        const res = await uploadSyllabusSchema.find();
        const glimphsData = await glimphsSchema.find({ status: true });
        const videoData = await videoSchema.find({ status: true });
        const courseData = await courseSchema.find({status:true});
        const testStatus = {
                    $and:[
                        {
                            adminVerify:'Verified',
                            status:true
                        }
                    ]
                }
                const testimonialData = await testimonialSchema.find(testStatus);
                response.render("home.ejs",{testimonialData:testimonialData.reverse(),courseData:courseData.reverse(),videoData:videoData.reverse(),glimphsData:glimphsData.reverse(),result:res,message:"",status:""});
    }
}