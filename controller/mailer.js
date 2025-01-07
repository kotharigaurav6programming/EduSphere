import nodemailer from 'nodemailer';
function mailer(email,callback){
    const transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user : 'jsexample63@gmail.com',
            pass : 'uthg kqza igrl gjtl'
            // pass:'gauravkothari786'
        }
    });
    const mailOption = {
        from : 'jsexample63@gmail.com',
        to : email,
        subject:'Verification Mail',
        html:"Hello "+email+"<br>This is a verification mail from <b>EduSphere Central India's Most trusted Organization</b>. You need to verify yourself by clicking on the below link. <br><a href='http://localhost:5000/verifyEmail?email="+email+"'>Click Here to Verify</a>"
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