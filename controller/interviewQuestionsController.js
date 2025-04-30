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
                //response.render("home.ejs",{testimonialData:testimonialData.reverse(),courseData:courseData.reverse(),videoData:videoData.reverse(),glimphsData:glimphsData.reverse(),result:res,message:"",status:""});

                        res.render("home.ejs", {
                            testimonialData: testimonialData.reverse(),
                            courseData: courseData.reverse(),
                            videoData: videoData.reverse(),
                            glimphsData: glimphsData.reverse(),
                            result: res,
                            message: "",
                            status: "",
                          
                            // SEO metadata
                            pageTitle: "EduSphere | Best Programming & IT Courses in India",
                            metaDescription: "Join EduSphere – the leading coaching institute for C, C++, Java, Python, Full Stack Development, Data Analytics,MERN STACK, node, express, mongodb and mysql and more. Get certified and career-ready.",
                            metaKeywords: "EduSphere, programming coaching, Java training, Python, C++, IT courses, computer classes, Mern Stack, git github, deployment, cloud, aws",
                            canonicalUrl: "http://23.22.33.19:5000/",
                          
                            // Social sharing
                            ogImage: "http://23.22.33.19:5000/images/og-image.jpg",
                            twitterCard: "summary_large_image",
                          
                            // Structured Data
                            structuredData: JSON.stringify({
                              "@context": "https://schema.org",
                              "@type": "EducationalOrganization",
                              "name": "EduSphere",
                              "url": "http://23.22.33.19:5000",
                              "logo": "http://23.22.33.19:5000/images/logo.png",
                              "sameAs": [
                                "https://www.facebook.com/Codingthinker/",
                                "https://www.instagram.com/codingthinker/"
                              ],
                              "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "207, Indraprastha Tower, M G Road, Inddore",
                                "addressLocality": "Indore",
                                "addressRegion": "Madhya Pradesh",
                                "postalCode": "452001",
                                "addressCountry": "IN"
                              },
                              "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+91-7415155301",
                                "contactType": "Customer Service"
                              }
                            })
                          });
                
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