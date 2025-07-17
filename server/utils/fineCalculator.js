
// per hour fine : 10 cents
export const calculateFine = (dueDate) => {

    const finePerHour = 0.1

    const today = new Date()
    //today > dueDate : crossed due date
    if (today > dueDate) {
        const lateHours = Math.ceil((today - dueDate) / (1000 * 60 * 60))
        const fine = lateHours * finePerHour
        return fine
    }

    return 0

}