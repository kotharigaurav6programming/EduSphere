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