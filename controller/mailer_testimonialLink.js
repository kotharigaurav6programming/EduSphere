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
        subject:'Testimonial Link',
        html:`Hello ${email}<br>This is a Testimonial Link from <b>EduSphere Central India's Most trusted Organization</b>. You need to put a comment on your success story along with the journey you had with Us and how to encourage others to join and be a part of Edusphere,Click on the below link to give your valuable comment. <br>
        <form action='${process.env.BACKEND_URL}admin/testimonial' method='post'>
        <input type='hidden' name='email' id='email' value='${email}'>
        <button>Click Here to give your valuable Comment</button>
        </form>`
    }

    transport.sendMail(mailOption,(error,info)=>{
        if(error){
            console.log("Error while dealing with mail option inside mailer_testimonialLink : ",error);
            callback(false);
        }
        else{
            console.log("Mail sent notification from mailer_testimonialLink");
            callback(info);
        }
    });
}
export default {mailer:mailer};