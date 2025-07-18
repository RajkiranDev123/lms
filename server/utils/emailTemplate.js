
export function generateVerificationOtpEmailTemplate(verificationCode) {
    return `
    <span>Your verification code for lms is : ${verificationCode}</span>
    
    `
}


export function generateForgotpasswordEmailTemplate(url,resetToken) {
    return `
   
    <p>Copy the Reset Token : ${resetToken}</p>
    
    `
}