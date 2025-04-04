import domainSchema from "../model/domainSchema.js";
import glimphsSchema from "../model/glimphsSchema.js";
import interviewQuestionsSchema from "../model/interviewQuestionsSchema.js";
import uploadSyllabusSchema from "../model/uploadSyllabusSchema.js";
import { message, status } from "../utils/statusMessage.js";
export const interviewSubjectController = async (request, response) => {
    try {
        const domainData = await domainSchema.find();
        // console.log(domainData);
        response.render("interviewSubject.ejs", { domainData: domainData, message: "", status: "" });
    } catch (error) {
        console.log("Error in interview subjects : ", error);
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

export const interviewQuestionsController = async (request, response) => {
    try {
        const domainId = JSON.parse(request.query.domainObj).domainId;
        const result = await interviewQuestionsSchema.find({ domainId: domainId });
        console.log(result);
        if (result.length != 0) {
            response.render("interviewQuestions.ejs", { interviewQuestions: result, message: "", status: status.SUCCESS });
        } else {
            console.log("Inside else of try while view interview questions");
            const domainData = await domainSchema.find();
            // console.log(domainData);
            response.render("interviewSubject.ejs", { domainData: domainData, message: message.INTERVIEW_QUESTIONS_NOT_FOUND, status: "" });
        }
    } catch (error) {
        console.log("Error while view interview questions : ", error);
        const domainData = await domainSchema.find();
        // console.log(domainData);
        response.render("interviewSubject.ejs", { domainData: domainData, message: message.INTERVIEW_QUESTIONS_NOT_FOUND, status: "" });
    }
}