
export function generateVerificationOtpEmailTemplate(verificationCode) {
    return `
    <span>Your verification code for lms is : ${verificationCode}</span>
    
    `
}