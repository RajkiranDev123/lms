class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}


//app.use(errorMiddleware)
export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error"
    err.statusCode = err.statusCode || 500

    console.log("err==>", err)
    console.log("err2==>", err.errors)


    if (err.code == 11000) {
        const statusCode = 400
        const message = "Duplicate field return"
        err = new ErrorHandler(message, statusCode)
    }

    if (err.code == "jwt") {
        const statusCode = 400
        const message = "jwt is invalid! Try again"
        err = new ErrorHandler(message, statusCode)
    }

    if (err.code == "jwt expired") {
        const statusCode = 400
        const message = "jwt is expired! Try again"
        err = new ErrorHandler(message, statusCode)
    }

    if (err.name == "cast error") {
        const statusCode = 400
        const message = `resource not found ${err.path}`
        err = new ErrorHandler(message, statusCode)
    }

    const errorMessage = err.errors
        ? Object.values(err.errors)
            .map((error) => error.message)
            .join(" ")
        : err.message

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
        test:1
   

    })
}

export default ErrorHandler