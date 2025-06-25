
export const catchAsyncErrors = (theFunction) => {
    console.log("catchAsyncErrors called!")
    return (req, res, next) => {
        console.log("catchAsyncErrors2 called!")

        Promise.resolve(theFunction(req, res, next)).catch(next)
    }
}