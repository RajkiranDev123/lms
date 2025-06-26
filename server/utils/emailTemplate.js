
export function generateVerificationOtpEmailTemplate(verificationCode) {
    return `
    <span>Your verification code for lms is : ${verificationCode}</span>
    
    `
}


export function generateForgotpasswordEmailTemplate(url,resetToken) {
    return `
    <span>Reset password url for lms is  : <a href=${url}>Click here to go to reset password!</a> </span>
    <p>Copy : ${resetToken}</p>
    
    `
}