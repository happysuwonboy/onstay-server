import nodemailer from 'nodemailer';
import { MAILER } from '../constants/secureConstatns.js';


const certificationCodeHtml = (code) => `
<div style="width:50%;height:25vh; background:#EEE; text-align:center; padding:2rem 1rem;">
    <h2>아이디 찾기 이메일 인증 코드</h2>
    <div style="display:inline-block; padding: 1rem 3rem; margin: 0 auto; margin-bottom: 1em; background:#FFF; font-size:3rem;">
    ${code}
    </div>
    <div>
    위 인증코드를 아이디 찾기 페이지 - 인증번호 란에 정확하게 입력해주세요.
    </div>
</div>
`

export const sendFindIdCertification = async (user_email, sendCode) => {
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        auth : {
              user : MAILER.USER ,
              pass : MAILER.PW
            },
    })
    const mailOptions = {
        from : MAILER.USER,
        to : user_email,
        subject : '[온스테이 하우스]아이디 찾기 인증 코드',
        html : certificationCodeHtml(sendCode)
    }
    try {
        await transporter.sendMail(mailOptions)
    } catch(err) {
        console.log(err);
        return 'error'
    }
}


const resetPwHtml = (token) => `
    <div>
     <a href='http://localhost:3000/find/pw/reset?token=${token}'>
        비밀번호 재설정 링크
     </a>
    </div>
`



export const sendResetPwLink = async (user_email, token) => {
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        auth : {
              user : MAILER.USER ,
              pass : MAILER.PW
            },
    })
    const mailOptions = {
        from : MAILER.USER,
        to : user_email,
        subject : '[온스테이 하우스]비밀번호 재설정 링크',
        html : resetPwHtml(token)
    }
    try {
        await transporter.sendMail(mailOptions)
    } catch(err) {
        console.log(err);
        return 'error'
    }
}