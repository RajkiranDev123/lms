import cron from "node-cron"

import { UserModel } from "../models/userModel.js"

export const removeUnverifiedAccounts = () => {
    cron.schedule("*/10 * * * * *", async () => {
        try {
            console.log(887)
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
            await UserModel.deleteMany({
                accountVerified: false,
                createdAt: { $lt: thirtyMinutesAgo }
            })

        } catch (error) {
            console.log(error.message)
        }
    })
}

