
export function generateVerificationOtpEmailTemplate(verificationCode) {
    return `
    <span>LMS : Your OTP  for Account Creation is : ${verificationCode}</span>
    
    `
}


export function generateForgotpasswordEmailTemplate(url,resetToken) {
    return `
   
    <p>Copy the Reset Token : ${resetToken}</p>
    
    `
}