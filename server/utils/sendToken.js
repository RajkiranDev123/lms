export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken()
    const refreshToken = user.generateRefreshToken()


    res.status(statusCode).json({
        success: true,
        user,
        message,
        token,
        newRefreshToken:refreshToken
    })
}