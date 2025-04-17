import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

function mailer(email,syllabusFileName,callback){
    const transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user : process.env.EMAIL,
            pass : process.env.PASSWORD        
        }
    });
    // const mailOption = {
    //     from : process.env.EMAIL,
    //     to : email,
    //     subject:'Verification Mail',
    //     html:`Hello ${email}<br>Thanks for Enquirying With Us. <br>Here We are attaching a <b>Syllabus for your Reference</b>`,
    //     attachments: [
    //         {
    //           filename: syllabusFileName, // The name of the file in the email
    //           path: path.join(__dirname.replace("\\controller","/public/syllabus/")+syllabusFileName), // Path to the file
    //         },
    //       ],
    // }

    const mailOption = {
        from : process.env.EMAIL,
        to : email,
        subject:'Syllabus Regarding your Enquiry',
        html:`Hello ${email}<br>Thanks for Enquirying With Us. <br>Here We are attaching a <b>Syllabus for your Reference. Please Click on the link below to view the Syllabus</b><br><a href=${syllabusFileName}>Click here to view syllabus</a>`,
    }

    transport.sendMail(mailOption,(error,info)=>{
        if(error){
            console.log("Error while dealing with mail option");
            callback(false);
        }
        else{
            console.log("Mail sent notification from mailer");
            callback(info);
        }
    });
}
export default {mailer:mailer};