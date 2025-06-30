import cron from "node-cron"
import { BorrowModel } from "../models/borrowModel.js"
import { sendEmail } from "../utils/sendEmail.js"

export const notifyUsers = () => {
    cron.schedule("*/10 * * * * *", async () => {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
            console.log(oneDayAgo)
            const borrowers = await BorrowModel.find({
                dueDate: { $lt: oneDayAgo }, returnedDate: null, notified: false
            }).populate("book")
            console.log("borrowers==>", borrowers)

            for (let element of borrowers) {
                if (element.user && element.user.email) {

                    sendEmail({
                        email: element.user.email,
                        subject: "Book return reminder!",
                        message: `hello ${element.user.name}, you need to returned the borrowed book ${element.book.title} today!`
                    })
                    element.notified = true
                    await element.save()
                }
            }

        } catch (error) {
            console.log(error.message)
        }
    })
}