import Mailgen from "mailgen";
import {Resend} from "resend"
async function sendmail(subject,content)
{
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'Book Bazaar',
            link: 'https://book_bazaar.com/'
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    });
    
    const emailBody = mailGenerator.generate(content);
    const emailText = mailGenerator.generatePlaintext(content);
    const resend=new Resend(process.env.RESEND_API);
     const { data, error } = await resend.emails.send({
        from: 'bookbazaar@resend.dev',
        to: ["magantisrikanth45@gmail.com"],
        subject: subject,
        text:emailText,
        html:emailBody,
      });
       
      if(error)
      { console.log(error);
        throw new ApiError(400,"unable to reset password");
      }

}

function forgotmailcontentgenerator(name,url)
{
    return  {
        body: {
            name: name,
            intro: 'Welcome to Book Bazaar! We\'re very excited to have you on board.',
            action: {
                instructions: 'To reset your password, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset Password',
                    link: url,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
}

export {sendmail,forgotmailcontentgenerator};