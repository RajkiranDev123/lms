import mongoose from "mongoose";


export const connectDB = () => {
    mongoose.connect(process.env.DB_URL).then(() => console.log("DB Connected!")).catch(e => console.log("DB Connection failed!"))
}