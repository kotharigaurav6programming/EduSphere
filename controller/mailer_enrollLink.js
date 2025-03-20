import nodemailer from 'nodemailer';
function mailer(email,callback){
    const transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user : process.env.EMAIL,
            pass : process.env.PASSWORD        
        }
    });
    const mailOption = {
        from : process.env.EMAIL,
        to : email,
        subject:'Enrollment Link',
        html:`Hello ${email}<br>This is a Enrollment Link from <b>EduSphere Central India's Most trusted Organization</b>. You need to enroll yourself by clicking on the below link. <br><a href='${process.env.BACKEND_URL}student/studentRegistration?email=${email}'>Click Here to Enroll</a>`
    }

    transport.sendMail(mailOption,(error,info)=>{
        if(error){
            console.log("Error while dealing with mail option inside mailer_enrollLink : ",error);
            callback(false);
        }
        else{
            console.log("Mail sent notification from mailer_enrollLink");
            callback(info);
        }
    });
}
export default {mailer:mailer};